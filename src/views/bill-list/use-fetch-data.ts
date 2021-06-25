import { IBill, ICategory, IUseFetchData } from '@/views/types';
import { getBillList, getCategories } from '@/api';
import { STATUS_OK } from '@/constant';

export default function useFetchData(): IUseFetchData {
  async function fetchBillList(): Promise<Array<IBill>> {
    let billList: Array<IBill> = [];
    const res = await getBillList();
    if (res.status === STATUS_OK) {
      billList = res.data;
    }
    return billList;
  }

  async function fetchCategories(): Promise<Array<ICategory>> {
    let categories: Array<ICategory> = [];
    const res = await getCategories();
    if (res.status === STATUS_OK) {
      categories = res.data;
    }
    return categories;
  }

  return {
    fetchBillList,
    fetchCategories,
  };
}
