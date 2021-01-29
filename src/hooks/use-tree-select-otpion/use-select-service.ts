import Fetch, {
  // buildURL,
  BaseResponse,
} from '@/apis/fetch';

export type Params = {
  type: number; // 组织类型;0-班级;1-专业;2-学院;3-机构,可用值:0,1,2,3
  all: 0 | 1;
};

/**
 * @method 获取组织机构树形数据
 * */
export const GetTreeNode = (params: Params) => {
  return Fetch<BaseResponse<any>>('/api/v1/common-auth/organizations/option', params, 'GET');
};
