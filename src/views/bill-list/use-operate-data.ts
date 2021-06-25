import { ref, reactive } from 'vue';
import dayjs from 'dayjs';
import { postAddBill } from '@/api';
import { DEFAULT_PAGE_SIZE } from './use-pagination';
import {
  IAddBill,
  IBill,
  ICategory,
  ICategoryAmount,
  IClassifyBill,
  IIncomeAndExpend,
  IUseOperateData,
} from '../types';
import { UNCATEGORIZED } from './use-conditions-filters';
import useFetchData from './use-fetch-data';

function deepCopy<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

function getMonthByTime(time: number) {
  // 返回的 month 是从 0 开始算，需要加 1
  return dayjs(new Date(time))
    .month() + 1;
}

const EXPEND = 0;

type incomeAndExpendColumn =
  'totalIncome'
  | 'totalExpend'
  | 'curMonthIncome'
  | 'curMonthExpend'
  | 'curIncome'
  | 'curExpend';

type filterDataArg = 'month' | 'categoryId';

export default async function useOperateData(): Promise<IUseOperateData> {
  const bills = ref<Array<IBill>>([]);
  const originalAllData = ref<Array<IBill>>([]);
  const currentAllData = ref<Array<IBill>>([]);
  const total = ref(0);
  let pageSize = DEFAULT_PAGE_SIZE;

  // 选中的月份，没选或者清空为 undefined
  let selectedMonth: number | undefined;
  // 选中的分类，没选或者清空为 undefined
  let selectedCategoryId: string | undefined;

  let lastFilterCondition: filterDataArg | undefined;

  const incomeAndExpendData = reactive<IIncomeAndExpend>({
    totalIncome: 0,
    totalExpend: 0,
    curMonthIncome: 0,
    curMonthExpend: 0,
    curIncome: 0,
    curExpend: 0,
  });

  const classifyBillArr = ref<Array<ICategoryAmount>>([]);

  let categories: Array<ICategory> = [];

  await initData();
  calculateTotal();
  calculateByCurConditions();

  async function initData() {
    const { fetchBillList, fetchCategories } = useFetchData();
    const billList = await fetchBillList();
    categories = await fetchCategories();
    if (billList.length > 0) {
      originalAllData.value = deepCopy<Array<IBill>>(billList);
      setCurrentAllData(deepCopy<Array<IBill>>(billList));
      filterByPagination(0, pageSize);
    }
  }

  function setCurrentAllData(data: Array<IBill>) {
    currentAllData.value = data;
    total.value = currentAllData.value.length;
  }

  async function addBill(data: IAddBill) {
    const {
      categoryId,
      time,
      type,
      amount,
    } = data;
    const bill: IBill = {
      time,
      type: type as 0 | 1,
      amount: amount as number,
    };
    if (categoryId && categoryId !== UNCATEGORIZED) {
      bill.category = categories.find((item) => item.id === categoryId);
    }
    originalAllData.value.unshift(bill);

    await postAddBill(bill);

    if (selectedMonth || selectedCategoryId) {
      filterData(lastFilterCondition as filterDataArg);
      if (selectedMonth) {
        calculateByMonth(selectedMonth);
      }
    } else {
      setCurrentAllData(deepCopy(originalAllData.value));
      // 数据变更后重新分页
      filterByPagination(0, pageSize);
    }
    calculateTotal();
  }

  function filterByPagination(start: number, end: number) {
    pageSize = end - start;
    bills.value = currentAllData.value.slice(start, end);
  }

  function filterByMonth(month: number | undefined) {
    selectedMonth = month;
    filterData('month');
    if (month !== undefined) {
      lastFilterCondition = 'month';
      calculateByMonth(month);
    }
  }

  function filterByCategory(id: string | undefined) {
    selectedCategoryId = id;
    if (id !== undefined) {
      lastFilterCondition = 'categoryId';
    }
    filterData('categoryId');
  }

  function filterData(from: filterDataArg) {
    let data: Array<IBill> = [];
    // 月份是否有被选中某个值
    const isMonthSelected = selectedMonth !== undefined;
    // 分类是否有被选中某个值
    const isCategorySelected = selectedCategoryId !== undefined;

    if (!isCategorySelected && !isMonthSelected) {
      data = deepCopy<Array<IBill>>(originalAllData.value);
    }
    if (!isCategorySelected && isMonthSelected) {
      data = getDataWithMonth(originalAllData.value);
    }
    if (isCategorySelected && !isMonthSelected) {
      data = getDataWithCategoryId(originalAllData.value);
    }
    // 分类和月份都有选择某个值，并且本次的改变是从选择月份发起的
    if (isCategorySelected && isMonthSelected && from === 'month') {
      data = getDataWithCategoryId(getDataWithMonth(originalAllData.value));
    }
    if (isCategorySelected && isMonthSelected && from === 'categoryId') {
      data = getDataWithMonth(getDataWithCategoryId(originalAllData.value));
    }
    setCurrentAllData(data);
    // 数据变更后重新分页
    filterByPagination(0, pageSize);
    calculateByCurConditions();
  }

  /**
   * 根据当前选中的类别取数据
   * @param arr
   */
  function getDataWithCategoryId(arr: Array<IBill>): Array<IBill> {
    return arr
      // UNCATEGORIZED 为选择“未分类”的情况，因为分类不是必须的
      .filter((item) => (selectedCategoryId === UNCATEGORIZED
        ? !item.category
        : item.category?.id === selectedCategoryId));
  }

  /**
   * 根据当前选中的月份取数据
   * @param arr
   */
  function getDataWithMonth(arr: Array<IBill>): Array<IBill> {
    return arr.filter((item) => selectedMonth === getMonthByTime(item.time));
  }

  /**
   * 计算当月的总收入和总支出
   * @param month
   */
  function calculateByMonth(month: number) {
    incomeAndExpendData.curMonthExpend = 0;
    incomeAndExpendData.curMonthIncome = 0;

    const arr = originalAllData.value
      .filter((item) => month === getMonthByTime(item.time));

    const classifyBillData: IClassifyBill = {};

    arr.forEach((item) => {
      if (item.type === EXPEND) {
        incomeAndExpendData.curMonthExpend += item.amount;
        classify(item, classifyBillData);
      } else {
        incomeAndExpendData.curMonthIncome += item.amount;
      }
    });

    classifyBillArr.value = Object.values(classifyBillData);
    classifyBillArr.value.sort((item1, item2) => item1.amount - item2.amount);
  }

  /**
   * 将当月的总收入和总支出按类别汇总
   * @param bill
   * @param obj
   */
  function classify(bill: IBill, obj: IClassifyBill) {
    const { amount } = bill;
    if (bill.category) {
      const { id, name } = bill.category;
      if (!obj[id]) {
        obj[id] = { amount, name };
      } else {
        obj[id].amount += amount;
      }
    } else if (!obj[UNCATEGORIZED]) {
      obj[UNCATEGORIZED] = { amount, name: '未分类' };
    } else {
      obj[UNCATEGORIZED].amount += amount;
    }
  }

  /**
   * 计算总收入和总支出
   */
  function calculateTotal() {
    doCalculate4TotalAndCurConditions(originalAllData.value, 'totalExpend', 'totalIncome');
  }

  /**
   * 根据当前的筛选条件（按月和按类别）计算支出和收入
   */
  function calculateByCurConditions() {
    doCalculate4TotalAndCurConditions(currentAllData.value, 'curExpend', 'curIncome');
  }

  function doCalculate4TotalAndCurConditions(
    arr: Array<IBill>,
    expendColumn: incomeAndExpendColumn,
    incomeColumn: incomeAndExpendColumn,
  ) {
    incomeAndExpendData[expendColumn] = 0;
    incomeAndExpendData[incomeColumn] = 0;
    arr.forEach((item) => {
      if (item.type === EXPEND) {
        incomeAndExpendData[expendColumn] += item.amount;
      } else {
        incomeAndExpendData[incomeColumn] += item.amount;
      }
    });
  }

  return {
    bills,
    categories,
    total,
    incomeAndExpendData,
    classifyBillArr,
    filterByPagination,
    filterByMonth,
    filterByCategory,
    addBill,
  };
}
