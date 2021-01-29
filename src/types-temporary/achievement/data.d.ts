/**
 * 分页列表每个数据
 */
export type AchievementListItem = {
  id: number;

  /** 学生姓名 */
  studentName: string;

  /** 学生学号 */
  studentNumber: string;

  /** 学院 */
  college: string;

  /** 专业 */
  major: string;

  /** 班级 */
  className: string;

  /** 成绩分数 */
  score: number;

  /** 状态;0:未开始;1:考试中;2:待批改;3:已完成;4:未参考 */
  status?: 0 | 1 | 2 | 3 | 4;

  /** 完成时长(秒) */
  duration: number;
};

/**
 * 考试试卷/成绩详情
 */
export type AchievementDetails = {
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
    studentAnswer: string;

    /** 正确答案 需要根据类型做数据转换 */
    rightAnswer: string;

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
