<template>
  <el-dialog
    ref="dialogRef"
    title="添加账单"
    v-model="visible"
    width="400px"
    center
    :close-on-click-modal="false"
    :show-close="false"
  >
    <el-form
      ref="formRef"
      label-width="80px"
      :model="bill"
      :rules="rules"
    >
      <el-form-item label="账单类型" prop="type">
        <el-select
          class="w100"
          placeholder="请选择账单类型"
          clearable
          v-model="bill.type"
        >
          <el-option
            :key="0"
            label="收入"
            :value="1"
          >
          </el-option>
          <el-option
            :key="0"
            label="支出"
            :value="0"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="账单分类" prop="categoryId">
        <el-select
          class="w100"
          placeholder="请选择账单分类"
          clearable
          v-model="bill.categoryId"
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
      </el-form-item>

      <el-form-item label="账单金额" prop="amount">
        <el-input placeholder="请输入账单金额" v-model.number="bill.amount"></el-input>
      </el-form-item>

      <el-form-item class="item-btns">
        <el-button @click="handleSubmit" type="primary">确定</el-button>
        <el-button @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  toRaw,
} from 'vue';
import { UNCATEGORIZED } from '../bill-list/use-conditions-filters';
import useFetchData from '../bill-list/use-fetch-data';
import { IAddBill } from '../types';

const rules = {
  type: [
    {
      required: true,
      message: '请选择账单类型',
      trigger: 'change',
    },
  ],
  amount: [
    {
      required: true,
      message: '请输入账单金额',
      trigger: 'blur',
    },
    {
      validator(rule, value, callback) {
        if (/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value)) {
          callback();
        } else {
          callback(new Error('请输入正数'));
        }
      },
      trigger: 'change',
    },
  ],
};

export default defineComponent({
  name: 'add-bill',
  emits: ['addBill'],
  async setup(props, { emit }) {
    const visible = ref<boolean>(false);
    const dialogRef = ref(null);
    const formRef = ref(null);
    const categories = await useFetchData()
      .fetchCategories();
    const bill = reactive<IAddBill>({
      categoryId: '',
      time: 0,
      type: undefined,
      amount: undefined,
    });

    function handleSubmit() {
      formRef.value.validate((valid) => {
        if (!valid) {
          return false;
        }
        const obj = toRaw<IAddBill>(bill);
        obj.time = (new Date()).valueOf();
        emit('addBill', obj);
        closeAndReset();
        return true;
      });
    }

    function handleClose() {
      Object.assign(bill, {
        categoryId: '',
        time: 0,
        type: undefined,
        amount: undefined,
      });
      closeAndReset();
    }

    function closeAndReset() {
      if (formRef.value !== null) {
        formRef.value.clearValidate();
        formRef.value.resetFields();
      }
      visible.value = false;
    }

    function setVisible() {
      visible.value = true;
    }

    return {
      dialogRef,
      formRef,
      visible,
      categories,
      rules,
      UNCATEGORIZED,
      bill,
      handleSubmit,
      handleClose,
      setVisible,
    };
  },
});
</script>

<style scoped>
.w100 {
  width: 100%;
}

.item-btns {
  padding-top: 10px;
  margin-bottom: 0;
  padding-left: 18px;
}
</style>
