/** 考试打分 */
import Fetch, {
  // buildURL,
  buildURL,
  // BaseResponsePaging,
  // BasePagingParam,
  BaseResponse,
} from '@/apis/fetch';

type PostCallScoreType = {
  id: number;
  results: {
    id: number;
    score: number | string;
  }[];
};

export const PutCallScore = (params: PostCallScoreType) => {
  return Fetch<BaseResponse<any>>(
    buildURL(`achievement/${params.id}/rate`),
    {list:params.results},
    'PUT',
  );
};
