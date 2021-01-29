import { IRouteComponentProps } from 'umi';

import React, { useEffect } from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';

type LayoutProps = {} & IRouteComponentProps;

const Layout: React.FC<LayoutProps> = (props) => {
  const configProps = {
    locale: zhCN,
  };

  /** 是否是登录页面 */
  const isLoginPage = props.location.pathname === '/login';

  // 每当路由变化、页面切换，回到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [props.location.pathname]);

  useEffect(() => {
    moment.locale('zh-cn');
  }, []);

  return (
    <>
      <ConfigProvider {...configProps}>
        <div style={{ height: '100%', padding: isLoginPage ? 0 : 10 }}>{props.children}</div>
      </ConfigProvider>
    </>
  );
};

export default Layout;
