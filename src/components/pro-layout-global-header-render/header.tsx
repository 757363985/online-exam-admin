import React from 'react';
import { Dropdown, Menu, Avatar } from 'antd';
// import { history } from 'umi';

const GlobalHeader: React.FC<any> = (BasicLayoutProps) => {
  const {
    breadcrumb,
    location: { pathname },
    initialState,
    logout,
  } = BasicLayoutProps;
  const currentBreadcrumb = breadcrumb[pathname] || {};

  if (BasicLayoutProps.location.pathname.indexOf('/score-management') >= 0) {
    currentBreadcrumb.name = '成绩管理';
  } else if (BasicLayoutProps.location.pathname.indexOf('/score-build') >= 0) {
    currentBreadcrumb.name = '成绩打分';
  } else if (BasicLayoutProps.location.pathname.indexOf('/score-details') >= 0) {
    currentBreadcrumb.name = '成绩详情';
  }

  // const onClickLogout = () => {
  //   localStorage.removeItem('token');
  //   history.replace('/login');
  // };

  const menu = (
    <Menu>
      {/**  <Menu.Item onClick={onClickPersonal}>个人中心</Menu.Item> */}
      <Menu.Item onClick={logout}>退出登录</Menu.Item>
    </Menu>
  );

  return (
    <div
      style={{
        backgroundColor: '#fff',
        width: '100%',
        height: '100%',
        padding: '0 20px',
        color: '#666666',
        borderBottom: '1px solid #e8e8e8',
        display: 'flex',
        cursor: 'default',
      }}
    >
      <div style={{ flex: 1 }}>{currentBreadcrumb.name || '成绩管理'}</div>
      <div style={{ flex: 1, textAlign: 'right' }}>
        <Dropdown overlay={menu}>
          <div
            style={{
              height: 47,
              textAlign: 'right',
              float: 'right',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Avatar size="small" src={initialState?.avatar} alt="avatar" />
            <span style={{ marginLeft: 10 }}>{initialState?.name}</span>
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default GlobalHeader;
