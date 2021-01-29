import React from 'react';

import { Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

import { FormInstance } from 'antd/lib/form';

type OptionRenderProps = {
  option: { resetText: string; searchText: string };
  form: FormInstance;
  collapsed: boolean;
  onSubmit: (form: FormInstance) => void;
  onReset: (form: FormInstance) => void;
  onCllapsed: () => void;
};

/**
 * 自定义表单操作组件，重置或者搜索
 * @param props
 */
const OptionRender = (props: OptionRenderProps) => {
  const { option, form, collapsed, onSubmit, onReset, onCllapsed } = props;
  return (
    <>
      <Button
        style={{ marginRight: 10 }}
        onClick={() => {
          onReset(form);
        }}
      >
        {option.resetText}
      </Button>
      <Button style={{ marginRight: 10 }} type="primary" onClick={() => onSubmit(form)}>
        {option.searchText}
      </Button>
      <a onClick={onCllapsed}>
        {collapsed ? '展开' : '收起'}
        {collapsed ? <DownOutlined /> : <UpOutlined />}
      </a>
    </>
  );
};

export default OptionRender;
