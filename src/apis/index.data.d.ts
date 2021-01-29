/** 用户角色 */
export type Role = {
  id: number;
  organizationId: number;
  organizationName: string;
  roleId: number;
  roleName: string;
};

/** 用户信息 */
export type GetUserInfoData = {
  id: number;

  /** 头像 */
  avatar: string;

  /** 登录名 */
  loginName: string;

  /** 姓名 */
  name: string;

  /** 用户类型 */
  type: 1 | 2;

  /** 当前组织 id */
  organizationId: number;

  /** 当前组织名称 */
  organizationName: string;

  /** 当前角色 id */
  roleId: number;

  /** 当前角色名称 */
  roleName: string;

  /** 角色 */
  role: Role[];
};

/** 用户权限 */
export type GetUserPrmissionInfoData = {
  /** 是否是类型角色;0:否;1:是 */
  isTypeRole: 0 | 1;

  /** 权限字符串 */
  listPermissionString: string;

  roleId: number;

  roleName: string;

  userInfo: GetUserInfoData;

  permissions: {
    id: number;

    /** 路由编码 */
    code: string;

    /** 是否显示;0-不显示;1-显示 */
    display: 0 | 1;

    icon: string;

    name: string;

    sort: number;

    actions: {
      id: number;

      /** 行为 code */
      actionCode: string;

      /** 行为名 */
      actionName: string;

      /** 路由 id */
      permissionId: number;

      /** 路由名 */
      permissionName: string;

      /** 是否必要行为;0-不必要;1-必要 */
      required: 0 | 1;
    }[];
  }[];
};

/** 用户身份信息 */
export type GetUserIdentifyData = {
  id: number;

  /** 当前组织 id */
  organizationId: number;

  /** 当前组织名称 */
  organizationName: string;

  /** 当前角色 id */
  roleId: number;

  /** 当前角色名称 */
  roleName: string;
};
