import Fetch, {
  // buildURL,
  buildMockURL,
  // BaseResponsePaging,
  // BasePagingParam,
  BaseResponse,
  // BaseResponse,
} from '@/apis/fetch';

/** 获取所有标签 参数 */
export type GetKeywordsParams = {
  /** 分类 */
  code: string;

  /** 业务系统标识 */
  business: FunctionStringCallback;
};

/**
 * 获取所有标签
 */
export const GetKeywords = (params: GetKeywordsParams) => {
  return Fetch<BaseResponse<string[]>>(buildMockURL('common-keywords'), params, 'GET');
};
