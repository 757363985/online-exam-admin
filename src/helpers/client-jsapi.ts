// 客户端 API 接口集合
// 所需要用到客户端的接口皆在此文件内再次封装

import { message } from 'antd';
import * as dd from 'dingtalk-jsapi';
import * as Storage from '@scf/helpers/es/storage';

import Fetch from '@/apis/fetch';
import * as AppConfigs from '@/configs/app';

/** 是否是开发状态 */
const isDev = process.env.NODE_ENV === 'development';

/**
 * 检测 token 是否已超时
 */
const checkTokenIsTimeout = () => {
  // 上一次更新 token 的时间
  const lastTime = +Storage.getTokenTime();

  // 从来都没有换成过
  if (lastTime === 0) {
    return true;
  }

  const nowTime = new Date().getTime();

  // 当前时间减去一天时间是否还大于上次更新时间
  return nowTime - 24 * 60 * 60 * 1000 >= lastTime;
};

/**
 * 注入一个开发状态的 token
 */
const setDevToken = () => {
  Storage.setToken(
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJkYXRhb2Z4IiwiaWF0IjoxNTk1OTg4NzgwLCJleHAiOjE1OTYxNjE1ODAsInVzZXJJZCI6NTkyOH0.mHQsnz_EeiwNPiHxylFkrAn1OaXaLskTMT5v-R94gG0',
  );
};

/**
 * JSAPI 返回的 reject err 信息
 */
export const JSAPI_REJECT_CODES = {
  /** 初始化用户登录 */
  InitUserLogin: {
    /** 不在客户端容器 */
    notInClient: 'NOT_IN_CLIENT',

    /** 授权失败 */
    authFail: 'AUTH_FAIL',

    /** 用户登录失败 */
    loginFail: 'LOGIN_FAIL',
  },
};

/**
 * JSAPI 准备好了
 */
export const ready = (cb: () => void) => {
  dd.ready(cb);
};

/**
 * 初始化用户免登陆
 * @param {string} url 免登陆接口 code 换 token
 */
export const InitUserLogin = (url: string) => {
  return new Promise((resolve, reject) => {
    if (dd.env.platform === 'notInDingTalk') {
      // 不在客户端容器

      if (isDev) {
        // 开发模式忽视不能免登陆，自己注入一个 token
        setDevToken();
        resolve();
      } else {
        // 不在钉钉浏览器内打开
        reject(JSAPI_REJECT_CODES.InitUserLogin.notInClient);
      }
    } else if (checkTokenIsTimeout() || !Storage.getToken()) {
      // 在客户端容器

      // token 缓存时间已经过期
      // 本地没有 token 缓存

      // jsdk 加载好后初始化
      ready(() => {
        // 用户免登陆
        dd.runtime.permission
          .requestAuthCode({
            corpId: AppConfigs.corpId,
          })
          .then(({ code }) => {
            // 用户登录
            Fetch(
              url,
              {
                code,
              },
              'POST',
            )
              .then((data) => {
                Storage.setToken(data.data.token);

                resolve();
              })
              .catch(() => {
                // 用户登录失败
                // 接口响应有误
                reject(JSAPI_REJECT_CODES.InitUserLogin.loginFail);
              });
          })
          .catch(() => {
            message.error('获取用户信息失败，请重新打开');

            // 开发模式忽视不能免登陆，自己注入一个 token
            if (isDev) {
              setDevToken();

              resolve();
            } else {
              reject(JSAPI_REJECT_CODES.InitUserLogin.authFail);
            }
          });
      });
    } else {
      resolve();
    }
  });
};
