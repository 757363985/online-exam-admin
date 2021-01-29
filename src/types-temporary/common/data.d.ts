/** 用户信息 */
export type UserInfo = {
  /** 用户头像 */
  headPortrait: string;

  /** 用户 id */
  memberId: number;

  /** 用户名 */
  memberName: string;

  /** 用户类型 1: 教职工；2: 学生 */
  memberType: 1 | 2;

  /** 学/工号 */
  number: string;

  /** 专业 */
  college: string;

  /** 学院 */
  major: string;

  /** 班级 */
  className: string;

  /** 年级 */
  grade: string;
};
