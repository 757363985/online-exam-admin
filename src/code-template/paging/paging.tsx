import React from 'react';
import Protable, { ProColumns } from '@ant-design/pro-table';
import { Button } from 'antd';
import { PlusOutlined, ExportOutlined } from '@ant-design/icons';

import usePagingProTable from '@/hooks/use-paging-pro-table/use-paging-pro-table.v1';
import ProTableSlider from '@/hooks/use-paging-pro-table/slider';

import * as APIS from './service';
import * as DataTypes from './data';

const Paging: React.FC = () => {
  const columns: ProColumns<DataTypes.PagingItem>[] = [
    {
      title: '状态',
      dataIndex: 'state',
      filters: false,
      valueEnum: {
        // all: { text: '全部', status: 'Default' },
        1: {
          text: '未解决',
          status: 'Error',
        },
        2: {
          text: '已解决',
          status: 'Success',
        },
      },
    },
    {
      dataIndex: '_',
      title: '操作',
      render: (_, row) => {
        return <>{row.id}</>;
      },
      hideInSearch: true,
    },

    // 额外搜索字段

    // 普通字符串
    {
      dataIndex: 'text_todo',
      title: '某个字符串',
      valueType: 'text',
      hideInTable: true,
    },

    // 长字符串
    {
      dataIndex: 'textarea_todo',
      title: '某个字符串',
      valueType: 'textarea',
      hideInTable: true,
    },

    // 时间 yyyy-MM-dd
    {
      dataIndex: 'date_todo',
      title: '某个天',
      valueType: 'date',
      hideInTable: true,
    },

    // 时间 yyyy-MM-dd hh-mm-ss
    {
      dataIndex: 'dateTime_todo',
      title: '某个天时',
      valueType: 'dateTime',
      hideInTable: true,
    },

    // 时间 hh-mm-ss
    {
      dataIndex: 'time_todo',
      title: '某个时',
      valueType: 'time',
      hideInTable: true,
    },

    // 时间 yyyy-MM-dd~yyyy-MM-dd
    {
      dataIndex: 'dateRange1_todo,dateRange2_todo',
      title: '某个天到某天',
      valueType: 'dateRange',
      hideInTable: true,
    },

    // 时间 yyyy-MM-dd hh-mm-ss~yyyy-MM-dd hh-mm-ss
    {
      dataIndex: 'dateTimeRange1_todo,dateTimeRange2_todo',
      title: '某个天时到某个天时',
      valueType: 'dateTimeRange',
      hideInTable: true,
    },

    // 金额
    {
      dataIndex: 'money_todo',
      title: '金额',
      valueType: 'money',
      hideInTable: true,
    },

    // 数字
    {
      dataIndex: 'digit_todo',
      title: '数字',
      valueType: 'digit',
      hideInTable: true,
    },

    // 自定义输入
    {
      dataIndex: 'slider1_todo,slider2_todo',
      title: 'Slider',
      valueType: ProTableSlider.valueType as any,
      hideInTable: true,
      renderFormItem: (_, props) => (
        <ProTableSlider value={props.value} onChange={props.onChange} min={10} max={80} />
      ),
    },
  ];

  const PagingProTable = usePagingProTable(APIS.GetPaging, columns);

  const toolBarRender = () => [
    <Button type="primary" icon={<PlusOutlined />}>
      新建
    </Button>,
    <Button type="default" icon={<ExportOutlined />}>
      导出
    </Button>,
  ];

  return (
    <>
      <Protable
        pagination={PagingProTable.pagination}
        options={PagingProTable.options}
        loading={PagingProTable.loading}
        dataSource={PagingProTable.paging.list}
        columns={PagingProTable.initialValues(columns)}
        toolBarRender={toolBarRender}
        // rowSelection={PagingProTable.rowSelection}
        rowKey="id"
        search={PagingProTable.search}
        // rowSelection={{
        //   selectedRowKeys,
        //   onChange: onChangeSlection,
        // }}
      />
    </>
  );
};

export default Paging;
