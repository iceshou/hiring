import axios, { AxiosInstance } from 'axios';

const BASE_URL = '/';

export interface ResponseType<T> {
  status: number;
  data: T;
}

export type ResponseArray<T> = ResponseType<Array<T>>;

export default class Request {
  private instance: AxiosInstance = axios.create({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest',
    },
  });

  constructor(baseURL: string = BASE_URL) {
    this.instance.defaults.baseURL = baseURL;
  }

  public get<T>(url: string, data?: any): Promise<ResponseArray<T>> {
    return this.instance
      .get(url, { params: data || {} })
      .then((res) => res.data);
  }

  public post<T>(url: string, data?: any): Promise<ResponseType<T>> {
    return this.instance
      .post(url, data)
      .then((res) => res.data);
  }
}
