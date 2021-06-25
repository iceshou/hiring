import Request, { ResponseArray, ResponseType } from '@/utils/request';
import { IBill, ICategory } from '@/views/types';

const service = new Request('/api');

export const getBillList = (): Promise<ResponseArray<IBill>> => service.get<IBill>('/getBillList');

export const getCategories = (): Promise<ResponseArray<ICategory>> => service.get<ICategory>('/getCategories');

export const postAddBill = (bill: IBill): Promise<ResponseType<null>> => service.post('/addBill', bill);
