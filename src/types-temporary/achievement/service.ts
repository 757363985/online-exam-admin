import Fetch, {
  // buildURL,
  buildMockURL,
  BaseResponsePaging,
  BasePagingParam,
  BaseResponse,
  // BaseResponse,
} from '@/apis/fetch';

import { AchievementListItem, AchievementDetails } from './data';

/** 获取成绩分页数据 基础参数 */
export type GetAchievementPagingBaseParams = {
  /** 考试 id */
  examineId: string;

  /** 学生名称 */
  studentName?: string;

  /** 学号 */
  studentNumber?: string;

  /** 成绩范围开始 */
  startScore?: string;

  /** 成绩范围结束 */
  endScore?: string;

  /** 状态;0:未开始;1:考试中;2:待批改;3:已完成;4:未参考 */
  status?: 0 | 1 | 2 | 3 | 4;
};

/** 获取成绩分页数据 参数 */
export type GetAchievementPagingParams = GetAchievementPagingBaseParams & BasePagingParam;

/**
 * 获取成绩分页数据
 */
export const GetAchievementPaging = (params: GetAchievementPagingParams) => {
  return Fetch<BaseResponsePaging<AchievementListItem>>(buildMockURL('achievement'), params, 'GET');
};

/**
 * 获取试卷/成绩详情
 * @param params 参数
 */
export const GetAchievementDetails = (params: {
  /** 成绩列表中的 id */
  id: number | string;

  /** 题目类型 */
  type?: AchievementDetails['questions'][0]['type'];
}) => {
  return Fetch<BaseResponse<AchievementDetails>>(
    buildMockURL(`achievement/${params.id}`),
    {},
    'GET',
  );
};

/**
 * 打分
 */
export const PutAchievement = (params: {
  /** 成绩列表中的 id */
  id: number | string;

  results: {
    /** 试卷/成绩详情里某个题的 id */
    id: number;

    /** 分数 */
    score: number;
  }[];
}) => {
  return Fetch<BaseResponse<string>>(buildMockURL(`achievement/${params.id}/rate`), params, 'PUT');
};

/**
 * 重考
 */
export const PostAchievementReset = (params: {
  /** 成绩列表中的 id */
  ids: number | string[];

  /** 结束时间 yyyy-MM-dd */
  endTime: string;
}) => {
  return Fetch<BaseResponse<string>>(buildMockURL('achievement/reset'), params, 'POST');
};
