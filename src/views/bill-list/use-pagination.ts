import { ref } from 'vue';
import { filterByPaginationFn, IUsePagination } from '../types';

export const DEFAULT_PAGE_SIZE = 10;

export default function usePagination(filterByPagination: filterByPaginationFn): IUsePagination {
  const pageSize = ref(DEFAULT_PAGE_SIZE);
  const currentPage = ref(1);

  function change() {
    const start = pageSize.value * (currentPage.value - 1);
    const end = currentPage.value * pageSize.value;
    filterByPagination(start, end);
  }

  function handleCurrentChange(val: number) {
    currentPage.value = val;
    change();
  }

  function handleSizeChange(size: number) {
    pageSize.value = size;
    change();
  }

  return {
    pageSize,
    handleCurrentChange,
    handleSizeChange,
  };
}
