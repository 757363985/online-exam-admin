import React from 'react';

import { Input } from 'antd';

import Style from '../details-modal.less';

type InputModalProps = {
  count: number;
};

const InputModal: React.FC<InputModalProps> = (props: InputModalProps) => {
  const { count } = props;
  const itemInput = [];
  for (let i = 1; i <= count; i++) {
    itemInput.push(
      <div key={Math.random() * 100} className={Style.inputWarpper}>
        <span className={Style.blankIndex}>{i}、</span> <Input placeholder="请输入答案" />
      </div>,
    );
  }
  return <div>{itemInput}</div>;
};

export default InputModal;
