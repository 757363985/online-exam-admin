import Fetch, { BaseResponse, buildAuthURL } from '@/apis/fetch';
import { GetUserInfoData, GetUserPrmissionInfoData, GetUserIdentifyData } from './index.data';

// 通用接口放这里

/**
 * 获取用户信息
 */
export const GetUserInfo = () => {
  return Fetch<BaseResponse<GetUserInfoData>>(buildAuthURL('user/info'), {}, 'GET');
};

/**
 * 获取用户权限信息
 *  */
export const GetUserPrmissionInfo = () => {
  return Fetch<BaseResponse<GetUserPrmissionInfoData>>(buildAuthURL('user/permission'), {}, 'GET');
};

/**
 * 获取用户身份
 */
export const GetUserIdentify = (id: number) => {
  return Fetch<BaseResponse<GetUserIdentifyData>>(buildAuthURL(`user/${id}/identify`), {}, 'GET');
};

/**
 * 切换身份
 */
export const PostChangeRole = (params: { identifyId: number }) => {
  return Fetch<BaseResponse<{ token: string }>>(buildAuthURL('user/change/role'), params, 'POST');
};
