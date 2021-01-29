import Fetch, { buildURL, BaseResponsePaging, BaseResponse, BasePagingParam } from '@/apis/fetch';
import * as DataTypes from './data';

/** 分页接口 基础参数 */
export type GetPagingParamsBase = {
  // TODO 自动生成
};

/** 分页接口 完整参数 */
export type GetPagingParams = GetPagingParamsBase & BasePagingParam;

/**
 * 分页数据接口
 * @param params 参数
 */
export const GetPaging = (params: GetPagingParams) => {
  return Fetch<BaseResponsePaging<DataTypes.PagingItem>>(buildURL('paper'), params, 'GET');
};

/** 分页某个数据详情接口 参数 */
export type GetItemDetailsParams = {
  // TODO 自动生成
  id: number | string;
};

/**
 * 分页某个数据详情接口
 * @param params 参数
 */
export const GetItemDetails = (params: GetItemDetailsParams) => {
  return Fetch<BaseResponse<DataTypes.PagingItemDetails>>(
    buildURL(`paper/${params.id}`),
    params,
    'GET',
  );
};

/** 删除分页某个数据详情接口 参数 */
export type DeleteItemParams = {
  // TODO 自动生成
  id: number | string;
};

/**
 * 删除分页某个数据详情接口
 * @param params 参数
 */
export const DeleteItem = (params: DeleteItemParams) => {
  return Fetch<BaseResponse<string>>(buildURL(`paper/${params.id}`), params, 'DELETE');
};
