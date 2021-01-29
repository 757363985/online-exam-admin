import React, { useEffect, useState } from 'react';
import Protable, { ProColumns } from '@ant-design/pro-table';
import {
  Button,
  Divider,
  message,
  Tag,
  Modal,
  Form,
  DatePicker,
  Dropdown,
  Menu,
  Select,
  InputNumber,
} from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import { Link, IRouteComponentProps } from 'umi';

import usePagingProTable from '@/hooks/use-paging-pro-table/use-paging-pro-table';
import { Store } from 'antd/es/form/interface';
import moment from 'moment';
import * as APIS from './service';

export type ScoreListItem = {
  id: number;
  studentName: string;
  studentNumber: string;
  college: string;
  major: string;
  className: string;
  score: number;
  /** 0:未开始; 1:考试中; 2:待批改; 3:已完成; 4:未参考 */
  status: 0 | 1 | 2 | 3 | 4;
  /** 完成时长 单位 s */
  duration: number;
};

export type EditMdoalProps = {
  reTestList: ScoreListItem[];
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
};

const EditModal: React.FC<EditMdoalProps> = ({ reTestList, visible, onCancel, onOk }) => {
  /** 表单ref */
  const [form] = Form.useForm();

  /** 重考学生列表 */
  const [list, setList] = useState<ScoreListItem[]>([]);

  /** 弹窗是否加载中,防抖用 */
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  /** 弹窗ok */
  const onModalOk = () => {
    /** 做些什么...(一般是表单提交) */
    form.submit();
  };

  /** 弹窗cancel */
  const onModalCancel = () => {
    /** 做些什么...(一般不会做什么,只关闭弹窗) */
    onCancel();
  };

  /** 表单触发提交 */
  const onFinish = (store: Store) => {
    const { endTime } = store;
    setConfirmLoading(true);
    APIS.PostRetest({
      ids: list.map((item) => String(item.id)),
      endTime: moment(endTime).format('YYYY-MM-DD 23:59:59'),
    })
      .then(() => {
        setConfirmLoading(false);
        message.success('考生重考');
        onOk();
      })
      .catch(() => setConfirmLoading(false));
  };

  function disabledDate(current: any) {
    // Can not select days before today and today
    return current && current < moment().subtract(1, 'days');
  }

  /** 点击关闭tag */
  const onCloseTag = (id: ScoreListItem['id']) => {
    const newList = list.filter((item) => item.id !== id && item);
    if (newList.length === 0) {
      onCancel();
    }
    setList(newList);
  };

  /** 初始化表单 */
  useEffect(() => {
    if (visible) {
      form.resetFields();
      setList(reTestList);
    }
  }, [form, reTestList, visible]);

  return (
    <Modal
      title="学生重考"
      visible={visible}
      confirmLoading={confirmLoading}
      onCancel={onModalCancel}
      onOk={onModalOk}
      okText="确定重考"
      width={600}
    >
      <Form onFinish={onFinish} form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Form.Item label="重考学生">
          {list.map((item) => {
            return (
              <Tag
                key={item.id}
                style={{ marginBottom: 12 }}
                closable
                onClose={() => onCloseTag(item.id)}
              >
                {`${item.studentName}-${item.studentNumber}`}
              </Tag>
            );
          })}
        </Form.Item>

        <Form.Item
          label="截止时间"
          required
          name="endTime"
          rules={[{ required: true, message: '请选择截至时间' }]}
        >
          <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" disabledDate={disabledDate} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const Score: React.FC<IRouteComponentProps<{ id: string }>> = (props) => {
  // console.log(props);
  const {
    match: {
      params: { id },
    },
  } = props;

  const PagingProTable = usePagingProTable(APIS.GetScorePaging, {
    examineId: id,
  });

  /** 批量操作数组 */
  const [selectedRowKeys, setselectedRowKeys] = useState<ScoreListItem[]>([]);

  /** 导出excel加载中 */
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  /** 编辑或新增弹窗props */
  const [editModalProps, setEditModalProps] = useState<EditMdoalProps>({
    visible: false,
    reTestList: [],
    onOk: () => {
      setEditModalProps((t) => ({ ...t, visible: false }));
      setTimeout(() => {
        PagingProTable.reload();
      }, 0);
      setselectedRowKeys([]);
    },
    onCancel: () => {
      setEditModalProps((t) => ({ ...t, visible: false }));
    },
  });

  /** 点击重考 */
  const onClickReTest = (item: ScoreListItem) => {
    setEditModalProps((t) => ({ ...t, visible: true, reTestList: [item] }));
  };

  /** 点击批量重考 */
  const onClickBatchClick = () => {
    setEditModalProps((t) => ({ ...t, visible: true, reTestList: selectedRowKeys }));
  };

  /** 批量操作变化 */
  const onChangeSlection = (_noUse: any, selectedRows: ScoreListItem[]) => {
    setselectedRowKeys(selectedRows);
  };

  /** 点击导出excel */
  const onClickExport = () => {
    setBtnLoading(true);
    APIS.GetExcel({ examineId: id })
      .then(() => {
        setBtnLoading(false);
      })
      .catch(() => {
        setBtnLoading(false);
      });
  };

  const columns: ProColumns<ScoreListItem>[] = [
    {
      dataIndex: 'studentName',
      title: '姓名',
    },
    {
      dataIndex: 'studentNumber',
      title: '学/工号',
    },
    {
      title: '组织机构',
      render: (_Null, item) => {
        const college = item.college ? `${item.college}/` : '';
        const major = item.major ? `${item.major}/` : '';
        const className = item.className ? item.className : '';
        return college + major + className;
      },
    },
    {
      title: '成绩',
      dataIndex: 'score',
      hideInSearch: true,
    },
    {
      /** 这一项用于搜索过滤,不显示在表格里面 */
      title: '成绩最小值',
      dataIndex: 'startScore',
      hideInTable: true,
      renderFormItem: () => (
        <InputNumber style={{ width: '100%' }} min={0} placeholder="请输入最小成绩" />
      ),
    },
    {
      /** 这一项用于搜索过滤,不显示在表格里面 */
      title: '成绩最大值',
      dataIndex: 'endScore',
      hideInTable: true,
      renderFormItem: () => (
        <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入最大成绩" />
      ),
    },
    {
      title: '完成时长(分钟)',
      dataIndex: 'duration',
      hideInSearch: true,
      render: (duration) => {
        if (typeof duration === 'number') {
          return (duration / 60).toFixed(0);
        }
        return null;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      renderFormItem: () => {
        return (
          <Select placeholder="请选择状态">
            <Select.Option value={0}>未参考</Select.Option>
            <Select.Option value={1}>考试中</Select.Option>
            <Select.Option value={2}>待批改</Select.Option>
            <Select.Option value={3}>已完成</Select.Option>
            <Select.Option value={4}>缺考</Select.Option>
          </Select>
        );
      },
      render: (status) => {
        /** 考试未结束时未开始 */
        if (status === 0) return <Tag color="default">未参考</Tag>;
        if (status === 1) return <Tag color="processing">考试中</Tag>;
        // 待批改
        if (status === 2) return <Tag color="warning">待批改</Tag>;

        if (status === 3) return <Tag color="success">已完成</Tag>;

        if (status === 4) return <Tag color="error">缺考</Tag>;

        return null;
      },
    },
    {
      title: '操作',
      dataIndex: 'id',
      hideInSearch: true,
      width: 200,
      // eslint-disable-next-line no-shadow
      render: (id, item) => {
        if (item.status === 2)
          return (
            <>
              <Link to={`/score-build/${id}`} style={{ color: '#27AE60' }}>
                打分
              </Link>
              <Divider type="vertical" />
              <Link to={`/score-details/${id}`} style={{ color: ' #1890FF' }}>
                详情
              </Link>
              <Divider type="vertical" />
              <span
                style={{ color: '#FAAD14', cursor: 'pointer' }}
                onClick={() => onClickReTest(item)}
              >
                重考
              </span>
              {/* <Divider type="vertical" />
              <span style={{ color: '#1890FF', cursor: 'pointer' }}>导出</span> */}
            </>
          );
        if (item.status === 3)
          return (
            <>
              {/* <Link to={`/score-build/${id}`} style={{ color: '#27AE60' }}>
                打分
              </Link>
              <Divider type="vertical" /> */}
              <Link to={`/score-details/${id}`} style={{ color: ' #1890FF' }}>
                详情
              </Link>
              <Divider type="vertical" />
              <span
                style={{ color: '#FAAD14', cursor: 'pointer' }}
                onClick={() => onClickReTest(item)}
              >
                重考
              </span>
              {/* <Divider type="vertical" />
              <span style={{ color: '#1890FF', cursor: 'pointer' }}>导出</span> */}
            </>
          );
        if (item.status === 4)
          return (
            <>
              {/* <Link to={`/score-build/${id}`} style={{ color: '#27AE60' }}>
                打分
              </Link>
              <Divider type="vertical" /> */}
              <Link to={`/score-details/${id}`} style={{ color: ' #1890FF' }}>
                详情
              </Link>
              <Divider type="vertical" />
              <span
                style={{ color: '#FAAD14', cursor: 'pointer' }}
                onClick={() => onClickReTest(item)}
              >
                重考
              </span>
            </>
          );
        return null;
      },
    },
  ];

  const toolBarRender = () => [
    <Dropdown
      disabled={selectedRowKeys.length === 0}
      overlay={
        <Menu>
          <Menu.Item onClick={onClickBatchClick}>
            <span>批量选择重考</span>
          </Menu.Item>
        </Menu>
      }
      placement="bottomCenter"
    >
      <Button>批量操作</Button>
    </Dropdown>,
    <Button icon={<ExportOutlined />} onClick={onClickExport} loading={btnLoading}>
      导出excel统计表
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
        rowKey="id"
        search={PagingProTable.search}
        rowSelection={{
          onChange: onChangeSlection,
          getCheckboxProps: (record) => {
            if (record.status === 2 || record.status === 3 || record.status === 4) {
              return {};
            }
            return { disabled: true };
          },
        }}
      />
      <EditModal
        visible={editModalProps.visible}
        onCancel={editModalProps.onCancel}
        onOk={editModalProps.onOk}
        reTestList={editModalProps.reTestList}
      />
    </>
  );
};

export default Score;
