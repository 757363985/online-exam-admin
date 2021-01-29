/**
 * 分页列表每个数据
 */
export type PagerListItem = {
  id: number;

  /** 标题 */
  title: string;

  /** 标签 */
  keywords: string[];

  /** 创建人 */
  creator: string;

  /** 创建时间 */
  createTime: string;
};

/**
 * 试卷详情
 */
export type PagerDetails = {
  /** 试卷基本信息 */
  info: {
    /** 标题 */
    title: string;

    /** 总分 */
    score: string;
  };

  /** 问题 */
  questions: {
    id: string;

    title: string;

    score: string;

    /** 类型1:单选;2:多选;3:判断;4:填空;5:主观 */
    type: 1 | 2 | 3 | 4 | 5;

    /** 正确答案 选择类下标，天空类答案 */
    rightAnswer: string[];

    /** 选项数量 */
    optionCount: number;
    
    /** 选项 */
    options: string[];
  }[];
};
