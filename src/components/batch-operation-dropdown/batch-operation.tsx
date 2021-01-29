import React from 'react';

import { Dropdown, Menu, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import './batch-operation.less';

type BatchOperationProps = {
  /** text为显menuItem示文本,clickCallBack为对应的点击回调方法 */
  menuArray: { text: string; clickCallBack: () => void }[];
};

const BatchOperation: React.FC<BatchOperationProps> = (props) => {
  const { menuArray } = props;

  /** 点击下拉菜单的menuitem产生的回调 */
  const handleMenuClick = (e: any) => {
    menuArray.forEach((item) => {
      if (item.text === e.key) {
        item.clickCallBack();
      }
    });
  };

  /** 下拉的列表的内部配置 */
  const menu = (
    <Menu onClick={handleMenuClick}>
      {menuArray.map((menuItem: any) => (
        <Menu.Item key={menuItem.text}>
          <span className="batch-options-menuItem">{menuItem.text}</span>{' '}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={menu}>
      <Button>
        批量操作 <DownOutlined />
      </Button>
    </Dropdown>
  );
};

export default BatchOperation;
