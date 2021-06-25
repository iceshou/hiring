import { ref, watch } from 'vue';
import {
  filterByCategoryFn,
  filterByMonthFn,
  IMonthSelectOption,
  IUseConditionsFilters,
} from '../types';

function generateMonthSelectOptions() {
  const options: Array<IMonthSelectOption> = [];
  for (let i = 1; i <= 12; i++) {
    options.push({
      label: i,
      value: i,
    });
  }
  return options;
}

export const UNCATEGORIZED = 'Uncategorized';

export default function useConditionsFilters(
  filterByMonth: filterByMonthFn,
  filterByCategory: filterByCategoryFn,
): IUseConditionsFilters {
  const selectedMonth = ref<number | undefined>(undefined);
  const selectedCategory = ref<string | undefined>('');

  watch(selectedMonth, (newVal) => {
    filterByMonth(newVal);
  });

  watch(selectedCategory, (newVal) => {
    filterByCategory(newVal);
  });

  function handleMonthChange(val: number) {
    selectedMonth.value = val;
  }

  function handleMonthClear() {
    selectedMonth.value = undefined;
  }

  function handleCategoryChange(id: string) {
    selectedCategory.value = id;
  }

  function handleCategoryClear() {
    selectedCategory.value = undefined;
  }

  return {
    selectedMonth,
    selectedCategory,
    monthSelectOptions: generateMonthSelectOptions(),
    handleMonthChange,
    handleMonthClear,
    handleCategoryChange,
    handleCategoryClear,
  };
}
