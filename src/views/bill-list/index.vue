<template>
  <div class="bill-list-wrapper">
    <div class="add-bill">
      <p class="operation">常用操作</p>
      <el-button @click="addBillRef?.setVisible()">添加账单</el-button>
    </div>

    <div class="filters">
      <p class="conditions">条件筛选</p>
      <el-select
        v-model="selectedMonth"
        placeholder="请选择月份"
        clearable
        @change="handleMonthChange"
        @clear="handleMonthClear"
      >
        <el-option
          v-for="item in monthSelectOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>

      <el-select
        class="select-category"
        v-model="selectedCategory"
        placeholder="请选择分类"
        clearable
        @change="handleCategoryChange"
        @clear="handleCategoryClear"
      >
        <el-option
          v-for="item in categories"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
        <el-option
          :key="UNCATEGORIZED"
          label="未分类"
          :value="UNCATEGORIZED"
        >
        </el-option>
      </el-select>
    </div>
    <el-table
      :data="bills"
      stripe
      border
      style="width: 60%"
    >

      <el-table-column
        label="收支类型">
        <template #default="scope">{{ parseInt(scope.row.type) === 1 ? '收入' : '支出' }}</template>
      </el-table-column>

      <el-table-column
        label="金额">
        <template #default="scope">{{Math.abs(scope.row.amount).toFixed(2)}}
        </template>
      </el-table-column>

      <el-table-column
        label="分类">
        <template #default="scope">{{ get(scope.row, 'category.name', '--') }}</template>
      </el-table-column>

      <el-table-column
        label="时间">
        <template #default="scope">
          {{dayjs(new Date(scope.row.time)).format('YYYY/MM/DD HH:mm') }}
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        layout="total, sizes, prev, pager, next"
        :total="total"
        :page-sizes="[10, 20, 30, 40]"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      >
      </el-pagination>
    </div>

    <hr>

    <div class="statistics">
      <h3 class="title">收入与支出</h3>
      <div>
        <span>总收入：{{ incomeAndExpendData.totalIncome }}</span>
        <span>总支出：{{ incomeAndExpendData.totalExpend }}</span>
      </div>
      <div v-show="selectedMonth">
        <span>当前月收入：{{ incomeAndExpendData.curMonthIncome }}</span>
        <span>当前月支出：{{ incomeAndExpendData.curMonthExpend }}</span>
      </div>
      <div v-show="selectedMonth || selectedCategory">
        <span>当前过滤条件下的收入：{{ incomeAndExpendData.curIncome }}</span>
        <span>当前过滤条件下的支出：{{ incomeAndExpendData.curExpend }}</span>
      </div>
    </div>

    <hr v-show="selectedMonth && classifyBillArr.length">

    <div
      class="classify"
      v-show="selectedMonth && classifyBillArr.length">
      <h3 class="title">{{ selectedMonth }}月支出按分类统计</h3>
      <div
        v-for="item in classifyBillArr"
        :key="item.name"
      >
        <span>{{ item.name }}: {{ item.amount }}</span>
      </div>
    </div>

    <add-bill ref="addBillRef" @addBill="addBill"></add-bill>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { get } from 'lodash-es';
import * as dayjs from 'dayjs';
import usePagination from './use-pagination';
import useOperateData from './use-operate-data';
import useConditionsFilters, { UNCATEGORIZED } from './use-conditions-filters';
import AddBill from '../add-bill/index.vue';

export default defineComponent({
  name: 'bill-list',
  components: { AddBill },
  async setup() {
    const addBillRef = ref(null);

    const {
      bills,
      total,
      filterByPagination,
      filterByMonth,
      categories,
      filterByCategory,
      incomeAndExpendData,
      classifyBillArr,
      addBill,
    } = await useOperateData();

    const {
      monthSelectOptions,
      handleMonthChange,
      handleMonthClear,
      selectedMonth,
      selectedCategory,
      handleCategoryChange,
      handleCategoryClear,
    } = await useConditionsFilters(filterByMonth, filterByCategory);

    const {
      handleSizeChange,
      handleCurrentChange,
    } = usePagination(filterByPagination);

    return {
      // useData
      bills,
      total,
      categories,
      incomeAndExpendData,
      classifyBillArr,
      addBill,
      // useConditionsFilters
      monthSelectOptions,
      handleMonthChange,
      handleMonthClear,
      selectedMonth,
      selectedCategory,
      handleCategoryChange,
      handleCategoryClear,
      // usePagination
      handleCurrentChange,
      handleSizeChange,
      // others
      get,
      dayjs,
      UNCATEGORIZED,
      addBillRef,
    };
  },
});
</script>

<style scoped lang="scss">
.bill-list-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 30px;
  font-size: 14px;

  hr {
    width: 60%;
  }

  .filters, .add-bill {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 60%;
    padding-bottom: 10px;

    .conditions, .operation {
      margin-right: 10px;
      font-size: 16px;
      font-weight: bold;
    }

    .select-category {
      margin-left: 20px;
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    padding: 10px 0;
    width: 60%;
  }

  .statistics, .classify {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 10px 0;
    width: 60%;

    .title {
      padding-bottom: 10px;
      font-weight: bold;
      font-size: 16px;
    }

    div {
      display: flex;
      padding: 10px 0;

      span {
        display: flex;
        width: 400px;
      }
    }
  }
}
</style>
