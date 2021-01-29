import { GetUserInfoData, Role } from '@/apis/index.data';

import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import * as Storage from '@scf/helpers/es/storage';

import { PostChangeRole } from '@/apis';
import IMAGE_LOGO from '@/assects/logo.png';

import style from './login.less';

/** 默认的用户原始数据信息 */
const defaultOriginalUserData = {} as GetUserInfoData;

/** 选择身份后路由跳转 */
const jumpRouter = (id: number) => {
  // 角色 id 修改当前用户角色状态
  PostChangeRole({ identifyId: id }).then((res) => {
    Storage.setToken(res.data.token);
    // 因权限数据变化，不会触发菜单重新渲染，此处用刷新页面代替路由跳转
    window.location.href = `${window.location.origin}${window.location.pathname}${window.location.search}`;
  });
};

/** 抛出错误 */
const thorwError = () => {
  message.error('你当前没有权限进入该系统');
  Storage.setToken('');
};

/**
 * 登录页面
 * 用户从统一登录页面跳转回来后，统一处理页面
 * 如果用户有多个角色，需要选择一个进入系统
 * 如果用户只有一个角色，默认使用那个角色进入系统
 */
const Login: React.FC<{}> = () => {
  // 用户信息
  const { initialState } = useModel('@@initialState');

  /** 用户身份数组/用户角色 */
  const [userTypeList, setUserListType] = useState<Role[]>([]);

  /** 选择身份 */
  const onClickSelectType = (value: Role) => () => {
    jumpRouter(value.id);
  };

  useEffect(() => {
    const data = initialState?.originalUserData || defaultOriginalUserData;
    // 身份校验
    if (data.type === 1) {
      // 如果返回的数据有角色数组
      if (data && Array.isArray(data.role)) {
        // 过滤掉 roleId 为空的角色
        const roleRealitys = data.role.filter((i: any) => i.roleId);

        // 如果只有一个角色
        if (roleRealitys.length === 1) {
          jumpRouter(roleRealitys[0].id);
        } else if (roleRealitys.length > 1) {
          // 多个角色需要用户主动哦选择
          setUserListType(roleRealitys);
        } else {
          // 没有可以用的角色
          thorwError();
        }
      } else {
        thorwError();
      }
    } else {
      // 不是老师
      thorwError();
    }
  }, [initialState]);

  return (
    <div className={style.loginWrap}>
      <div className={style.desc}>
        <p>欢迎使用在线考试管理中心</p>
      </div>

      <div className={style.loginBox}>
        <div className={style.title}>
          <img width="50px" src={IMAGE_LOGO} alt="logo" />
          <span>在线考试管理中心</span>
        </div>

        <div className={style.formType}>
          <span className={style.formTypeText}>在线考试管理中心</span>
        </div>

        <div>
          {userTypeList.length
            ? userTypeList.map((i) => {
                const { id, roleName, organizationName } = i;
                return (
                  <div key={id} className={style.typeItem} onClick={onClickSelectType(i)}>
                    <div>
                      {organizationName}
                      <span className={style.roleName}>{roleName ? `（${roleName}）` : ''}</span>
                    </div>
                    <div>
                      <RightOutlined />
                    </div>
                  </div>
                );
              })
            : '该账号暂无身份无法登录'}
        </div>
      </div>
    </div>
  );
};

export default Login;
