import React from 'react';
import { Spin } from 'antd';

/**
 * 按需加载通用 loading
 */
const Loading: React.FC = () => {
  return (
    <div style={{ width: '100%', textAlign: 'center', padding: '100px 0' }}>
      <Spin />
    </div>
  );
};

export default Loading;
