import React from 'react';
import { Empty } from 'antd';

const EmptyData: React.FC<{ description: string }> = ({ description }) => {
  return (
    <div
      style={{
        background: '#fff',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Empty description={description} />
    </div>
  );
};

export default EmptyData;
