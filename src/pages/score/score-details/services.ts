/** 考试详情 */
import Fetch, {
  // buildURL,
  buildURL,
  // BaseResponsePaging,
  // BasePagingParam,
  BaseResponse,
} from '@/apis/fetch';

/** 考试详情 */

type GetExamDetailsParmas = {
  id: number;
};

type AchievementDetails = {
  /** 基础信息 */
  info: {
    /** 考试标题 */
    examineTitle: string;
    /** 考试标签/分类 */
    examineKeywords: string;
    /** 学生名称 */
    studentName: string;
    /** 开始/触发考试时间 */
    studentExamineStartTime: string;
    /** 考试持续时间 秒 */
    examineDuration: number;
    /** 成绩 */
    score: number;
  };
  questions: {
    id: number;
    /** 标题 */
    title: string;
    /** 类型1:单选;2:多选;3:判断;4:填空;5:主观 */
    type: 1 | 2 | 3 | 4 | 5;
    /** 学生答案 需要根据类型做数据转换 */
    studentAnswer: string[];
    /** 正确答案 需要根据类型做数据转换 */
    rightAnswer: string[];
    /** 状态;0:未参考;1:待批改;2:已完成 */
    status: 0 | 1 | 2;
    /** 答题结果0:错误;1:正确 */
    result: 0 | 1;
    /** 题目分数 */
    score: number;
    /** 题目序号 */
    sort: number;
    /** 学生分数 */
    studentScore: number;
  }[];
};

export const GetExamDetails = (params: GetExamDetailsParmas) => {
  return Fetch<BaseResponse<AchievementDetails>>(buildURL(`achievement/${params.id}`), {}, 'GET');
};

/** 只获取主观题的考试详情 */
export const GetExamSubjective = (params: GetExamDetailsParmas) => {
  return Fetch<BaseResponse<AchievementDetails>>(
    buildURL(`achievement/${params.id}`),
    { type: 5 },
    'GET',
  );
};
