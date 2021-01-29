import Fetch, {
  // buildURL,
  buildMockURL,
  BaseResponsePaging,
  BasePagingParam,
  BaseResponse,
  // BaseResponse,
} from '@/apis/fetch';

import { PagerListItem, PagerDetails } from './data';

/** 获取试卷分页数据 基础参数 */
export type GetPagerPagingBaseParams = {
  /** 试卷标题 */
  title?: string;

  /** 标签 */
  keywords?: string;
};

/** 获取试卷分页数据 参数 */
export type GetPagerPagingParams = GetPagerPagingBaseParams & BasePagingParam;

/**
 * 获取试卷分页数据
 */
export const GetPagerPaging = (params: GetPagerPagingParams) => {
  return Fetch<BaseResponsePaging<PagerListItem>>(buildMockURL('pager'), params, 'GET');
};

/**
 * 导入试卷
 * @param params 表单数据
 * @field {File} file 附件
 * @field {string} title 试卷标题
 * @field {string} keywords[0] 标签 1
 * @field {string} keywords[1] 标签 2
 * @field {string} keywords[n] 标签 n + 1
 */
export const PostPager = (params: FormData) => {
  return Fetch<BaseResponse<string>>(buildMockURL('pager'), params, 'FORM_DATA');
};

/**
 * 获取试卷详情
 * @param params 参数
 */
export const GetPagerDetails = (params: { id: number | string }) => {
  return Fetch<BaseResponse<PagerDetails>>(buildMockURL(`pager/${params.id}`), {}, 'GET');
};
