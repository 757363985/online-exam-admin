import { history } from 'umi';
import { message } from 'antd';
import { parse, stringify } from 'qs';
import * as Storage from '@scf/helpers/es/storage';

import { GetUserInfo } from '@/apis';
import IMAGE_AVATAR from '@/assects/img/user-avatar.png';
import GlobalHeader from './components/pro-layout-global-header-render/header';

/** 是否是开发环境 */
const isDev = process.env.NODE_ENV !== 'production';

/** 统一登录系统 */
const LOGIN_URL = `http://auth.dataofx.com/?from=${encodeURIComponent(
  `${window.location.origin}/exam-web/#/login`,
)}`;

/** 设置一个开发 token */
const setToken = () => {
  Storage.setToken(
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJkYXRhb2Z4IiwiaWF0IjoxNTk1OTg4NzgwLCJleHAiOjE1OTYxNjE1ODAsInVzZXJJZCI6NTkyOH0.mHQsnz_EeiwNPiHxylFkrAn1OaXaLskTMT5v-R94gG0',
  );
};

/**
 * 初始化状态
 */
export async function getInitialState() {
  // 处理 token
  // www.a.com/#/xxx?token=11111&id=1 -> www.a.com/#/xxx?id=1
  // www.a.com/?token=1111 -> www.a.com/
  // 测试的时候添加一个token
  const { query } = history.location as any;
  const searchObj = parse(window.location.search.slice(1));

  if (query.token || searchObj.token) {
    // 如果有 token 保存
    Storage.setToken(query.token || searchObj.token);

    if (query.token) {
      delete query.token;

      history.replace({
        pathname: history.location.pathname,
        search: stringify(query),
      });
    }

    if (searchObj.token) {
      delete searchObj.token;
      // 剩余的参数字符串
      const searchStr = stringify(searchObj);

      window.location.href = [
        window.location.origin,
        window.location.pathname,
        searchStr ? `?${searchStr}` : '',
        window.location.hash,
      ].join('');
    }
  }

  // 如果是开发环境，并且没有 token
  if (isDev && !Storage.getToken()) {
    setToken();
  }

  // 获取用户信息
  // 如果本地没有保存 token, 且跳转过来的页面url也没有 token,则跳转到登录页面
  if (!Storage.getToken()) {
    window.location.href = LOGIN_URL;
    return Promise.reject();
  }

  try {
    // 获取当前用户信息
    const res = await GetUserInfo();

    // debugger
    if (res.code === 0) {
      if (res.data.type === 2) {
        Storage.setToken('');
        message.error('你当前没有权限进入该系统');
        return Promise.reject();
      }

      // 获取往前用户在系统中的权利
      // const {
      //   data: { permissions },
      // } = await GetUserPrmissionInfo();

      // 没有 token 时, 此处 res.data 为 null，会走向 catch，登录页面会获取 url 上的 token
      return {
        name: res.data.name,
        userId: res.data.id,
        avatar: res.data.avatar || IMAGE_AVATAR,
        originalUserData: res.data,
        // permissions: permissions || [],
      };
    }
    return {
      name: '',
      userId: -1,
      avatar: '',
      originalUserData: res.data || {},
      // permissions: [],
    };
  } catch (e) {
    Storage.setToken('');
    window.location.href = LOGIN_URL;
    return Promise.reject();
  }
}

/**
 * ProLayout 默认配置
 */
export const layout = {
  logout: () => {
    Storage.setToken('');
    window.location.href = LOGIN_URL;
  },
  headerRender: (props: any) => GlobalHeader(props),
};
