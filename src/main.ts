import { createApp } from 'vue';
import {
  ElTable,
  ElTableColumn,
  ElPagination,
  ElSelect,
  ElOption,
  ElDialog,
  ElForm,
  ElFormItem,
  ElButton,
  ElInput,
} from 'element-plus';
import App from './App.vue';
import router from './router';
import '@/assets/scss/reset.scss';
import 'element-plus/packages/theme-chalk/src/base.scss';

const app = createApp(App);

app.use(ElTable);
app.use(ElTableColumn);
app.use(ElPagination);
app.use(ElSelect);
app.use(ElOption);
app.use(ElDialog);
app.use(ElForm);
app.use(ElFormItem);
app.use(ElButton);
app.use(ElInput);

app.use(router);
app.mount('#app');
