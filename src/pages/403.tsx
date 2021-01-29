import React from 'react';
import { Result } from 'antd';

const NoFoundPage: React.FC<{}> = () => (
  <Result status="403" title="403" subTitle="对不起，您没有权限访问" />
);

export default NoFoundPage;
