import React from 'react';
import { BasicLayoutProps } from '@ant-design/pro-layout';

// 经过 @umijs/plugin-layout 一顿操作后，原来 @ant-design/pro-layout 一些数据变得不一样了
// 类型可能需要自己维护
export type HeaderLayoutProps = {
  /**
   * 主题色
   *
   * @default `'dark'`
   */
  theme: BasicLayoutProps['navTheme'];

  navTheme: BasicLayoutProps['navTheme'];

  initialState: any;

  /**
   * 展开或缩小菜单
   */
  onCollapse: (show: boolean) => void;

  /**
   * 是否展开菜单
   */
  collapsed: boolean;

  /**
   * 退出登录的操作
   */
  logout: () => void;

  /**
   * 应用名称
   */
  title: string;

  name: string;
};

const HeaderLayout: React.FC<HeaderLayoutProps> = (props) => {
  // console.log(props);
  return <div>header-layout</div>;
};

export default HeaderLayout;
