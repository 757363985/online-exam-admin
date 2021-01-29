/** 试卷列表 */
import Fetch, {
  buildURL,
  BaseResponsePaging,
  // BasePagingParam,
  BaseResponse,
} from '@/apis/fetch';
import { FileUpload } from '@/apis/file-upload';

/** 试卷分页列表参数 */
type ExamPaperPagingParam = {
  page: number;
  size: number;
  title: string;
  keywords: string;
};

/** 试卷分页列表 */
export type ExamPaperPagingItem = {
  id: number;
  title: string;
  keywords: string[];
  creator: string;
  createTime: string;
};

/** 试卷分页 */
export const GetExamPaging = (params: ExamPaperPagingParam) => {
  return Fetch<BaseResponsePaging<ExamPaperPagingItem>>(buildURL('paper'), params, 'GET');
};

type DeletePapersParam = {
  ids: React.Key[];
};

/** 试卷批量删除 */
export const DeletePapers = (params: DeletePapersParam) => {
  return Fetch<BaseResponse<any>>(buildURL('paper/delete'), params, 'POST');
};

type DeleteThePaperParam = {
  id: number;
};

/** 删除单个试卷 */
export const DeleteThePaper = (params: DeleteThePaperParam) => {
  return Fetch<BaseResponse<any>>(buildURL(`paper/${params.id}`), {}, 'DELETE');
};

type PaperDetailsParam = {
  paperId: number;
};

type PaperDetails = {
  info: {
    title: string;
    score: string;
  };
  questions: [
    {
      id: number;
      title: string;
      score: number;
      /** 1单选 2多选 3判断 4填空 5主观 */
      type: 1 | 2 | 3 | 4 | 5;
      rightAnswer: string[];
      optionCount: number;
      options: string[];
    },
  ];
};

/** 获取试卷详情 */
export const GetPaperDetails = (params: PaperDetailsParam) => {
  return Fetch<BaseResponse<PaperDetails>>(buildURL(`paper/${params.paperId}`), {}, 'GET');
};

export type PaperNewParam = {
  file: any;
  keywords: string[];
  title: string;
};

/** 新增试卷接口 */
export const PostNewPaper = (params: PaperNewParam) => {
  return Fetch<BaseResponse<any>>(buildURL('paper'), params, 'POST');
};

/**
 * 导入试卷
 * @param params 表单数据
 * @param query 除文件以外其他参数
 * @field {File} file 附件
 * @field {string} title 试卷标题
 * @field {string} keywords[0] 标签 1
 * @field {string} keywords[1] 标签 2
 * @field {string} keywords[n] 标签 n + 1
 */
export const PostPager = (params: FormData, query: string) => {
  // return Fetch<BaseResponse<string>>(buildURL(`paper?${query}`), params, 'FORM_DATA');
  return FileUpload(buildURL(`paper?${query}`), params);
};

/**
 * 试卷标签获取
 * */

export const GetPaperKeyWords = () => {
  return Fetch<BaseResponse<any>>(
    buildURL('common-keywords'),
    { business: 'paper', code: 'examine' },
    'GET',
  );
};
