/**
 * 分页列表每个数据
 */
export type ExamineListItem = {
  id: number;

  /** 标题 */
  title: string;

  /** 标签 */
  keywords: string[];

  /** 开始时间 年月日 */
  startTime: string;

  /** 结束时间 年月日 */
  endTime: string;

  /** 考试持续时间 */
  duration: number;

  /** 班级 考试范围 */
  classes: string[];

  /** 及格率 0~1 */
  passRate: number;

  /** 优秀率 0~1 */
  excellentRate: number;

  /** 状态;0未开始;1:进行中;3:已结束;4:草稿 */
  status: 0 | 1 | 2 | 3 | 4;

  /** 合格分数 */
  passScore: number;

  /** 优秀分数 */
  excellentScore: number;
};
