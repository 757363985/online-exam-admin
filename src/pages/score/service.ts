import ajaxFun, { buildURL, BaseResponsePaging, BaseResponse } from '@/apis/fetch';
import { downloadExcel } from '@/apis/download';
import { ScoreListItem } from './score';

/** 分页查询成绩 */
export const GetScorePaging = (parmas: {
  page: number;
  size: number;
  /** 考试id */
  examineId: number;
  studentName?: string;
  studentNumber?: string;
  startScore?: number;
  endScore?: number;
  status?: ScoreListItem['status'];
}) => {
  return ajaxFun<BaseResponsePaging<ScoreListItem>>(buildURL(`achievement`), parmas, 'GET');
};

/** 重新考试 */
export const PostRetest = (parmas: { ids: string[]; endTime: string }) => {
  return ajaxFun<BaseResponse<number>>(buildURL('achievement/reset'), parmas, 'POST');
};

/** 导出 excel 统计表 */
export const GetExcel = (parmas: { examineId: number | string }) => {
  // return ajaxFun<Blob>(buildURL('/achievement/export'), parmas, 'GET');
  return downloadExcel(buildURL('achievement/export'), parmas, 'GET');
};
