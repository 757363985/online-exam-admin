import { message } from 'antd';
import { history } from 'umi';
import { stringify } from 'qs';
import * as Storage from '@scf/helpers/es/storage';

/** 接口约定的基本参数 */
export type BaseResponse<T> = {
  code: number;
  msg?: string;
  data: T;
};

/** 分页数据基本格式 */
export type BasePaging<T = any> = {
  totalCount: number;
  pageSize: number;
  totalPage: number;
  currPage: number;
  list: T[];
  // 额外添加一个字段，避免多次请求
  fetching: boolean;
  fail: boolean;
  refreshing: boolean;
};

/** Response 分页的返回数据格式 */
export type BaseResponsePaging<T = any> = BaseResponse<BasePaging<T>>;

/** Response 上传文件的返回数据格式 */
export type BaseResponseUpload = BaseResponse<{
  shortUrl: string;
  url: string;
  name: string;
}>;

/** 分页查询参数 */
export type BasePagingParam = {
  page: number | string;
  size: number | string;
};

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'FORM_DATA';

export type AjaxFun = <T = any>(
  url: string,
  data: any,
  method: Method,
  headers?: any,
) => Promise<T>;

/** 是否是开发环境 */
// const isDev = process.env.NODE_ENV !== 'production';

/** 没有登录延迟对象 避免多个接口同时报错触发多次提示、路由跳转 */
let notLoginMessageTimer: ReturnType<typeof setTimeout>;

/**
 * 构建接口地址
 * @param {string} p 接口路径
 */
export const buildURL = (p: string) => {
  return `/web/api/v1/${p}`;
};

/**
 * 构建认证系统接口地址
 * @param {string} p 接口路径
 */
export const buildAuthURL = (p: string) => {
  return `/web/api/v1/common-auth/${p}`;
};

/**
 * 构建 Mock 接口地址
 * @param {string} p 接口路径
 */
export const buildMockURL = (p: string) => {
  return `/mock/api/v1/${p}`;
};

/** 上传文件接口 */
export const UPLOAD_URL_BASE = 'fileinfo/upload';

/**
 * @method 通用fetch封装函数
 * @param url
 * @param data
 * @param method
 */
const ajaxFun: AjaxFun = (_url, _data, method, headers = {}) => {
  let url = _url;

  /** 请求参数 */
  const data = { ..._data };
  /** fetch 配置项 */
  const params: RequestInit = {
    method,
    headers: {
      // 'content-type': method === 'FORM_DATA' ? '' : 'application/json',
      Authorization: Storage.getToken(),
      ...headers,
    },
  };

  // FORM_DATA 上传 FormData 数据时，不需要手动设置 content-type，不然会报错
  // 如果不是 FORM_DATA 方式，并且自定义 headers 里没有 content-type 就默认一个 content-type
  if (method !== 'FORM_DATA' && !headers['content-type']) {
    params.headers = {
      ...params.headers,
      'content-type': 'application/json',
    };
  }

  if (method === 'GET') {
    // 每次请求添加时间戳，避免 GET 请求遭遇 HTTP 缓存
    data._ = new Date().getTime();

    // 请求参数合并到 URL 上
    url += `?${stringify(data)}`;
  } else if (method === 'DELETE') {
    // 每次请求添加时间戳，避免 GET 请求遭遇 HTTP 缓存
    data._ = new Date().getTime();

    params.body = JSON.stringify(_data);
  } else if (method === 'FORM_DATA') {
    // 表单、上传文件
    params.method = 'POST';
    params.body = _data;
  } else {
    params.body = JSON.stringify(data);
  }

  return fetch(url, params)
    .then((response) => {
      try {
        return response.json();
      } catch (error) {
        throw new Error(`${response.status},${response.statusText}`);
      }
    })
    .then((response) => {
      // 判断是否为接口返回数据, 接口返回结果是否为0，0代表正常
      if (response.code === 0) {
        return response;
      }

      if (response.code === 401) {
        clearTimeout(notLoginMessageTimer);
        notLoginMessageTimer = setTimeout(() => {
          history.replace(`/login?redirect=${history.location.hash}`);
          message.error(response.msg);
        }, 300);
      } else {
        message.error(response.code ? response.msg : `${response.status},${response.statusText}`);
      }
      return Promise.reject(response);
    });
};

export default ajaxFun;
