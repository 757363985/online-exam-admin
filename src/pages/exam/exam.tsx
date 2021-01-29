import React, { useState, useEffect, useRef } from 'react';
import Protable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Divider, message, Tag, Modal, Select, TreeSelect, Tooltip } from 'antd';
import moment, { Moment } from 'moment';
import {
  SyncOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { history } from 'umi';

import usePagingProTable from '@/hooks/use-paging-pro-table/use-paging-pro-table';
import * as APIS from './service';
import EditModal, {
  EditMdoalProps,
  Option as Options,
  ReturnCascaderData,
} from './component/edit-modal';

const { Option } = Select;

type ExamTime = string | Moment;

export type TestListItem = {
  title: string;
  keywords: string[];
  startTime: ExamTime;
  endTime: ExamTime;
  duration: number;
  classes: string[];
  passRate: number;
  excellentRate: number;
  /** 0未开始;1:进行中;3:已结束;4:草稿 */
  status: 0 | 1 | 3 | 4;
  id: number;
  passScore: number;
  excellentScore: number;
  paperId: number;
  examTime?: ExamTime[];
};

const Exam: React.FC<any> = (props) => {
  const {
    location: {
      query: { classes },
    },
  } = props;
  console.log(classes);
  const actionRef = useRef<ActionType>();

  const PagingProTable = usePagingProTable(APIS.GetTestPaging, {});

  /** 用于筛选的班级组织列表(会禁用父节点) */
  const [filteroptions, setFilteroptions] = useState<Options[]>();

  const [keyWordFilterList, setKeyWordFilterList] = useState<string[]>([]);

  const [batchCheckedList, setBatchCheckedList] = useState<{
    selectedRowKeys: TestListItem['id'][];
    selectedRows: TestListItem[];
  }>({ selectedRowKeys: [], selectedRows: [] });

  /** 编辑或新增弹窗props */
  const [editModalProps, setEditModalProps] = useState<EditMdoalProps>({
    visible: false,
    item: undefined,
    type: 'add',
    onOk: (type, draft) => {
      if (type === 'add') {
        message.success(draft ? '保存草稿' : '发布成功');
      }
      if (type === 'edit') {
        message.success(draft ? '保存草稿' : '编辑成功');
      }
      PagingProTable.reload();

      setEditModalProps((t) => ({ ...t, visible: false }));
    },
    onCancel: () => {
      setEditModalProps((t) => ({ ...t, visible: false }));
    },
  });

  /** 点击查看成绩 */
  const onClickCheckGrade = (id: TestListItem['id']) => {
    history.push(`/score-management/${id}`);
  };

  /** 点击批量删除按钮 */
  const onClickDeleteBatch = () => {
    Modal.confirm({
      title: '批量删除?',
      icon: <ExclamationCircleOutlined />,
      content: (
        <>
          <div>批量删除选中的考试?</div>
          <div>当前选中项:</div>
          {batchCheckedList.selectedRows.map((item) => (
            <>
              <div key={item.id}>{`<<${item.title}>>`}</div>
              <br />
            </>
          ))}
        </>
      ),
      onOk() {
        return new Promise((resolve, reject) => {
          APIS.DeleteTestBatch({ id: batchCheckedList.selectedRowKeys })
            .then(() => {
              message.success('批量删除考试');
              setBatchCheckedList({ selectedRowKeys: [], selectedRows: [] });
              PagingProTable.reload();
              resolve();
            })
            .catch(() => {
              console.log('批量删除失败');
              reject();
            });
        });
      },
    });
  };

  /** 点击新建考试 */
  const onClickAdd = () => {
    setEditModalProps((t) => ({ ...t, visible: true, type: 'add', item: undefined }));
  };

  /** 点击编辑考试 */
  const onClickEdit = (item: TestListItem) => {
    const hide = message.loading('获取考试详情...');
    APIS.GetTestDetail({
      id: item.id,
    })
      .then(({ data }) => {
        hide();
        setEditModalProps((t) => ({ ...t, visible: true, type: 'edit', item: data }));
      })
      .catch(() => hide());
  };

  /** 提前结束考试 */
  const onClickEndTestAhead = (item: TestListItem) => {
    Modal.confirm({
      title: '提前结束考试?',
      icon: <ExclamationCircleOutlined />,
      content: `可能有未参考人员,确认提前结束考试<<${item.title}>>?`,
      onOk() {
        return new Promise((resolve, reject) => {
          APIS.PutTestFinish({ id: item.id })
            .then(() => {
              message.success('提前结束考试');
              PagingProTable.reload();
              resolve();
            })
            .catch(() => {
              console.log('结束考试失败');
              reject();
            });
        });
      },
    });
  };

  /** 发布考试 */
  const onClickTestPub = (item: TestListItem) => {
    Modal.confirm({
      title: '发布考试?',
      icon: <ExclamationCircleOutlined />,
      content: `确认发布考试<<${item.title}>>?`,
      onOk() {
        return new Promise((resolve, reject) => {
          APIS.PutTestPublish({ id: item.id })
            .then(() => {
              message.success('发布考试');
              PagingProTable.reload();
              resolve();
            })
            .catch(() => {
              console.log('发布考试失败');
              reject();
            });
        });
      },
    });
  };

  /** 删除考试 */
  const onClickTestDelete = (item: TestListItem) => {
    Modal.confirm({
      title: '删除考试?',
      icon: <ExclamationCircleOutlined />,
      content: `确认删除考试<<${item.title}>>?`,
      onOk() {
        return new Promise((resolve, reject) => {
          APIS.DeleteTest({ id: item.id })
            .then(() => {
              message.success('删除考试');
              PagingProTable.reload();
              resolve();
            })
            .catch(() => {
              console.log('删除考试失败');
              reject();
            });
        });
      },
    });
  };

  const toolBarRender = () => {
    return [
      <Button type="primary" onClick={onClickAdd} icon={<PlusOutlined />}>
        新建
      </Button>,
      <Button
        danger
        type="primary"
        disabled={batchCheckedList.selectedRowKeys.length === 0}
        onClick={onClickDeleteBatch}
        icon={<DeleteOutlined />}
      >
        批量删除
      </Button>,
    ];
  };

  const columns: ProColumns<TestListItem>[] = [
    {
      title: '考试标题',
      dataIndex: 'title',
    },
    {
      title: '考试标签',
      dataIndex: 'keywords',
      renderFormItem: () => (
        <Select placeholder="请选择考试标签">
          {keyWordFilterList.map((item) => (
            <Option key={item} value={item}>
              {item}
            </Option>
          ))}
        </Select>
      ),
      render: (keywords) => {
        if (Array.isArray(keywords)) {
          return keywords.join('、');
        }

        return null;
      },
    },
    {
      title: '考试时间范围',
      dataIndex: 'startTime',
      render: (_noUse, item) => {
        const s = moment(item.startTime).format('yyyy-MM-DD');
        const e = moment(item.endTime).format('yyyy-MM-DD');
        return `${s} 至 ${e}`;
      },
    },
    {
      title: '考试时长(分钟)',
      dataIndex: 'duration',
      hideInSearch: true,
      render: (duration) => {
        if (typeof duration === 'number') return (duration / 60).toFixed(0);
        return '';
      },
    },
    {
      title: '考试范围',
      dataIndex: 'classes',
      renderFormItem: () => (
        <TreeSelect
          defaultValue={classes ? [classes] : undefined}
          treeData={filteroptions}
          placeholder="请选择考试范围"
        />
      ),
      render: (_, item) => {
        if (Array.isArray(item.classes) && item.classes.length !== 0) {
          return (
            <Tooltip title={item.classes.join('、')}>
              <span style={{ cursor: 'default' }}>
                {item.classes.join('、').substr(0, 14)}
                {item.classes.join('、').length > 6 ? '...' : ''}
              </span>
            </Tooltip>
          );
        }
        return '-';
      },
      width: 200,
    },
    {
      title: '及格分',
      dataIndex: 'passScore',
      hideInSearch: true,
    },
    {
      title: '优秀分',
      dataIndex: 'excellentScore',
      hideInSearch: true,
    },
    {
      title: '及格率',
      dataIndex: 'passRate',
      hideInSearch: true,
      render: (passRate) => (passRate === '-' ? '-' : `${passRate}%`),
    },
    {
      title: '优秀率',
      dataIndex: 'excellentRate',
      hideInSearch: true,
      render: (excellentRate) => (excellentRate === '-' ? '-' : `${excellentRate}%`),
    },
    {
      title: '考试状态',
      dataIndex: 'status',
      hideInSearch: true,
      render: (status) => {
        /** 考试进行中 */
        if (status === 1)
          return (
            <Tag color="success" icon={<SyncOutlined spin />}>
              进行中
            </Tag>
          );
        /** 考试未开始 */
        if (status === 0) return <Tag color="warning">未开始</Tag>;
        /** 考试已结束 */
        if (status === 3) return <Tag color="error">已结束</Tag>;
        /** 草稿 */
        if (status === 4) return <Tag color="magenta">草稿</Tag>;

        return null;
      },
    },
    {
      title: '操作',
      hideInSearch: true,
      dataIndex: 'id',
      width: 200,
      render: (_id, item) => {
        /** 考试进行中 */
        if (item.status === 1)
          return [
            <span
              key="1"
              onClick={() => onClickCheckGrade(item.id)}
              style={{ color: '#1890FF', cursor: 'pointer' }}
            >
              查看成绩
            </span>,
            <Divider key="2" type="vertical" />,
            <span
              key="3"
              onClick={() => onClickEndTestAhead(item)}
              style={{ color: '#F56C6C', cursor: 'pointer' }}
            >
              提前结束考试
            </span>,
          ];
        /** 考试未开始 */
        if (item.status === 0)
          return [
            <span
              onClick={() => onClickEdit(item)}
              key="1"
              style={{ color: '#1890FF', cursor: 'pointer' }}
            >
              编辑
            </span>,
            <Divider key="2" type="vertical" />,
            <span
              key="3"
              onClick={() => onClickTestDelete(item)}
              style={{ color: '#F56C6C', cursor: 'pointer' }}
            >
              删除
            </span>,
          ];
        /** 考试已结束 */
        if (item.status === 3)
          return (
            <span
              onClick={() => onClickCheckGrade(item.id)}
              style={{ color: '#1890FF', cursor: 'pointer' }}
            >
              查看成绩
            </span>
          );
        /** 草稿 */
        if (item.status === 4)
          return [
            <span
              key="1"
              onClick={() => onClickTestPub(item)}
              style={{ color: '#27AE60', cursor: 'pointer' }}
            >
              发布考试
            </span>,
            <Divider key="2" type="vertical" />,
            <span
              onClick={() => onClickEdit(item)}
              key="3"
              style={{ color: '#1890FF', cursor: 'pointer' }}
            >
              编辑
            </span>,
            <Divider key="4" type="vertical" />,
            <span
              key="5"
              onClick={() => onClickTestDelete(item)}
              style={{ color: '#F56C6C', cursor: 'pointer' }}
            >
              删除
            </span>,
          ];

        return null;
      },
    },
  ];

  /** 获取筛选列表 */
  useEffect(() => {
    APIS.GetKeyWordList({ code: 'examine', business: 'exam' }).then((res) => {
      setKeyWordFilterList(res.data);
    });

    APIS.GetClassOrg({ type: 0, all: 1 }).then((res) => {
      setFilteroptions(ReturnCascaderData(res.data, true));
    });
  }, []);

  return (
    <>
      <Protable
        actionRef={actionRef}
        pagination={PagingProTable.pagination}
        options={PagingProTable.options}
        loading={PagingProTable.loading}
        dataSource={PagingProTable.paging.list}
        columns={PagingProTable.initialValues(columns)}
        toolBarRender={toolBarRender}
        rowKey="id"
        search={PagingProTable.search}
        rowSelection={{
          getCheckboxProps: (record) => {
            if (record.status === 1 || record.status === 3) {
              return { disabled: true };
            }
            return {};
          },
          selectedRowKeys: batchCheckedList.selectedRowKeys,
          onChange: (selectedRowKeys: any, selectedRows: TestListItem[]) => {
            setBatchCheckedList({ selectedRowKeys, selectedRows });
          },
        }}
      />

      <EditModal
        visible={editModalProps.visible}
        onCancel={editModalProps.onCancel}
        onOk={editModalProps.onOk}
        item={editModalProps.item}
        type={editModalProps.type}
      />
    </>
  );
};

export default Exam;
