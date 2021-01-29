import Fetch, { BaseResponse, buildURL } from '@/apis/fetch';

/** 获取首页顶部计数数据 */
export const GetHeaderCounter = () => {
  return Fetch<BaseResponse<any>>(buildURL('dashboard/counter'), {}, 'GET');
};

type GetExamPercentType = {
  name: string;
  value: number;
}[];

/** 考试进度 */
export const GetExamPercent = () => {
  return Fetch<BaseResponse<GetExamPercentType>>(buildURL('dashboard/progress'), {}, 'GET');
};

/** 学生地理位置分布统计图 */ 
export const GetStudent = () => {
  return Fetch<BaseResponse<GetExamPercentType>>(buildURL('dashboard/map'), {}, 'GET');
};

/** 试题分布雷达图 */
export const GetPaperData = () => {
  return Fetch<BaseResponse<GetExamPercentType>>(buildURL('dashboard/dist'), {}, 'GET');
};

/** 考试科目条形分布图 */
export const GetPaperSubject = () => {
  return Fetch<BaseResponse<GetExamPercentType>>(buildURL('dashboard/rate'), {}, 'GET');
};


