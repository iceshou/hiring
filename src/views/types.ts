import { Ref } from 'vue';

export interface ICategory {
  id: string;
  name: string;
  type: 0 | 1;
}

export interface IBill {
  time: number;
  type: 0 | 1;
  amount: number;
  category?: ICategory;
}

export interface IUsePagination {
  pageSize: Ref<number>;
  handleCurrentChange: (val: number) => void;
  handleSizeChange: (size: number) => void;
}

export type filterByPaginationFn = (start: number, end: number) => void;

export type filterByMonthFn = (month: number | undefined) => void;

export type filterByCategoryFn = (month: string | undefined) => void;

export interface IUseOperateData {
  total: Ref<number>;
  categories: Array<ICategory>;
  bills: Ref<Array<IBill>>;
  incomeAndExpendData: IIncomeAndExpend;
  classifyBillArr: Ref<Array<ICategoryAmount>>;
  filterByPagination: filterByPaginationFn;
  filterByMonth: filterByMonthFn;
  filterByCategory: filterByCategoryFn;
  addBill: (bill: IAddBill) => void;
}

export interface IMonthSelectOption {
  label: number,
  value: number,
}

export interface IUseConditionsFilters {
  selectedMonth: Ref<number | undefined>;
  selectedCategory: Ref<string | undefined>;
  monthSelectOptions: Array<IMonthSelectOption>;
  handleMonthChange: (val: number) => void;
  handleMonthClear: () => void;
  handleCategoryChange: (id: string) => void;
  handleCategoryClear: () => void;
}

export interface IIncomeAndExpend {
  totalIncome: number;
  totalExpend: number;
  curMonthIncome: number;
  curMonthExpend: number;
  curIncome: number;
  curExpend: number;
}

export interface ICategoryAmount {
  name: string;
  amount: number;
}

export interface IClassifyBill {
  [id: string]: ICategoryAmount;
}

export interface IAddBill {
  type: number | undefined;
  amount: number | undefined;
  categoryId: string;
  time: number;
}

export interface IUseFetchData {
  fetchBillList: () => Promise<Array<IBill>>;
  fetchCategories: () => Promise<Array<ICategory>>;
}
