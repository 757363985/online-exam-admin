import Fetch, {
  // buildURL,
  buildMockURL,
  BaseResponsePaging,
  BasePagingParam,
  BaseResponse,
  // BaseResponse,
} from '@/apis/fetch';

import { ExamineListItem } from './data';

/** 获取试卷分页数据 基础参数 */
export type GetExaminePagingBaseParams = {
  /** 试卷标题 */
  title?: string;

  /** 标签 */
  keywords?: string;
};

/** 获取试卷分页数据 参数 */
export type GetExaminePagingParams = GetExaminePagingBaseParams & BasePagingParam;

/**
 * 获取试卷分页数据
 */
export const GetExaminePaging = (params: GetExaminePagingParams) => {
  return Fetch<BaseResponsePaging<ExamineListItem>>(buildMockURL('examine'), params, 'GET');
};

/** 考试基本参数 */
export type ExamineBaseParams = {
  title: string;

  keywords: string[];

  /** 试卷id */
  paperId: number;

  /** 开始时间 */
  startTime: string;

  /** 结束时间 */
  endTime: string;

  /** 班级 id */
  classIds: number[];

  /** 考试时长 */
  duration: number;

  /** 及格分数 */
  passScore: number;

  /** 优秀分数 */
  excellentScore: number;

  /** 状态:0提交;4:草稿 */
  status: 0 | 4;
};

/**
 * 新增考试
 */
export const PostExamine = (params: ExamineBaseParams) => {
  return Fetch<BaseResponse<string>>(buildMockURL('examine'), params, 'POST');
};

/**
 * 修改考试
 */
export const PutExamine = (params: ExamineBaseParams & { id: number }) => {
  return Fetch<BaseResponse<string>>(buildMockURL(`examine/${params.id}`), params, 'PUT');
};

/**
 * 获取考试详情
 */
export const GetExamineDetails = (params: { id: number | string }) => {
  return Fetch<BaseResponse<ExamineBaseParams>>(buildMockURL(`examine/${params.id}`), {}, 'GET');
};

/**
 * 发布考试
 */
export const PutExaminePublish = (params: { id: number | string }) => {
  return Fetch<BaseResponse<string>>(buildMockURL(`examine/${params.id}/publish`), {}, 'PUT');
};

/**
 * 结束考试
 */
export const PutExamineFinish = (params: { id: number | string }) => {
  return Fetch<BaseResponse<string>>(buildMockURL(`examine/${params.id}/finish`), {}, 'PUT');
};

/**
 * 删除考试
 */
export const DeleteExamine = (params: { id: number | string }) => {
  return Fetch<BaseResponse<string>>(buildMockURL(`examine/${params.id}`), {}, 'DELETE');
};

/**
 * 批量删除考试
 */
export const DeleteExamineBatch = (params: { id: number[] }) => {
  return Fetch<BaseResponse<string>>(buildMockURL('examine/delete'), params, 'POST');
};
