import ajaxFun, { buildURL, BaseResponsePaging, BaseResponse, buildAuthURL } from '@/apis/fetch';
import { TestListItem } from './exam';

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

/** 分页查询考试列表 */
export const GetTestPaging = (parmas: {
  size: number;
  page: number;
  title?: string;
  keywords?: string;
  classes?: string;
}) => {
  return ajaxFun<BaseResponsePaging<TestListItem>>(buildURL(`examine`), parmas, 'GET');
};

/** 添加考试 */
export const PostTestAdd = (
  parmas: ExamineBaseParams & {
    totalScore: number;
    classList: { id: number; name: string }[];
  },
) => {
  return ajaxFun<BaseResponse<number>>(buildURL(`examine`), parmas, 'POST');
};

/** 修改考试 */
export const PutTestEdit = (
  parmas: ExamineBaseParams & {
    totalScore: number;
    id: number | string;
    classList: { id: number; name: string }[] | number[];
  },
) => {
  return ajaxFun<BaseResponse<number>>(buildURL(`examine/${parmas.id}`), parmas, 'PUT');
};

/** 发布考试 */
export const PutTestPublish = (parmas: { id: number }) => {
  return ajaxFun<BaseResponse<number>>(buildURL(`examine/${parmas.id}/publish`), {}, 'PUT');
};

/** 结束考试 */
export const PutTestFinish = (parmas: { id: number }) => {
  return ajaxFun<BaseResponse<number>>(buildURL(`examine/${parmas.id}/finish`), {}, 'PUT');
};

/** 删除考试 */
export const DeleteTest = (parmas: { id: number }) => {
  return ajaxFun<BaseResponse<number>>(buildURL(`examine/${parmas.id}`), {}, 'DELETE');
};

/** 批量删除考试 */
export const DeleteTestBatch = (parmas: { id: number[] }) => {
  return ajaxFun<BaseResponse<number>>(buildURL(`examine/delete`), parmas, 'DELETE');
};

/** 获取考试详情 */
export const GetTestDetail = (parmas: { id: number }) => {
  return ajaxFun<BaseResponse<ExamineBaseParams & { id: number }>>(
    buildURL(`examine/${parmas.id}`),
    {},
    'GET',
  );
};

export type ClassOrg = {
  canUse: 0 | 1;
  children?: ClassOrg[];
  grade: number;
  id: number;
  name: string;
  parentId: number;
  type: 0 | 1 | 2 | 3;
};

/** 获取班级的组织机构 */
export const GetClassOrg = (parmas: {
  /** 是否所有数据;0否;1:是 */
  all?: 0 | 1;
  grade?: number;
  /** 类型,0:班级;1:专业;2:学院;3:机构, */
  type?: 0 | 1 | 2 | 3;
}) => {
  return ajaxFun<BaseResponse<ClassOrg[]>>(buildAuthURL('organizations/option'), parmas, 'GET');
};

/** 获取标签列表 */
export const GetKeyWordList = (parmas: { code: 'examine'; business: 'exam' }) => {
  return ajaxFun<BaseResponse<string[]>>(buildURL(`common-keywords`), parmas, 'GET');
};

/** 获取试卷选项 */
export const GetPaperOption = () => {
  return ajaxFun<BaseResponse<{ name: string; id: number; score: number }[] | null>>(
    buildURL(`paper/option`),
    {},
    'GET',
  );
};
