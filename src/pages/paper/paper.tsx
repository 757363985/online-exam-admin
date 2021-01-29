import React, { useState, useEffect } from 'react';
import Protable, { ProColumns } from '@ant-design/pro-table';
import { Button, Popconfirm, Divider, message, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import BatchOperation from '@/components/batch-operation-dropdown/batch-operation';
import usePagingProTable from '@/hooks/use-paging-pro-table/use-paging-pro-table';

import AddModal from './add-modal/add-modal';
import PaperModal from './details-modal/details-modal';

import * as APIS from './service';

const {Option} = Select;

const Paper: React.FC = () => {
  const PagingProTable = usePagingProTable(APIS.GetExamPaging, {});

  /** 用户选择的行用数组记录 */
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 就像一个字典
  const [selectObj, setSelectObj] = useState<any>({});

  // 新建弹出层展示
  const [addVisible, setAddVisible] = useState<boolean>(false);

  // 试卷详情弹出层展示
  const [showPaper, setShowPaper] = useState<boolean>(false);

  // 当前点击的试卷id保存
  const [paperId, setPaperId] = useState<number>(NaN);

  // 记录试卷的可选标签
  const [keyWordFilterList, setKeyWordFilterList] = useState<string[]>([]);

    /** 获取筛选列表 */
    useEffect(() => {
      APIS.GetPaperKeyWords().then((res) => {
        setKeyWordFilterList(res.data);
      });
    }, []);

  /** 批量删除试卷 */
  const clickDeleteMore = () => {
    PagingProTable.setLoading(true);
    APIS.DeletePapers({ ids: selectedRowKeys })
      .then(() => {
        PagingProTable.setLoading(false);
        message.success('批量删除成功');
        PagingProTable.reload();
      })
      .catch(() => {
        PagingProTable.setLoading(false);
      });
  };

  /** 删除试卷 */
  const onDeleteConfirm = (item: any) => {
    PagingProTable.setLoading(true);
    APIS.DeleteThePaper({ id: item.id })
      .then(() => {
        PagingProTable.setLoading(false);
        message.success('删除成功');
        PagingProTable.reload();
      })
      .catch(() => {
        PagingProTable.setLoading(false);
      });
  };

  /** 点击新增试卷 */
  const onClickAddPaper = () => {
    setAddVisible(true);
  };

  /** 点击查看试卷 */
  const onViewPaperDetails = (paperItem: any) => {
    setShowPaper(true);
    setPaperId(paperItem.id);
  };

  /** 列表checkbox选中事件 */
  const onChangeSlection = (keys: React.Key[]) => {
    const temp: React.Key[] = [];
    selectObj[PagingProTable.pagination.current] = keys;

    Object.keys(selectObj).forEach((i) => {
      temp.push(selectObj[i]);
    });
    setSelectedRowKeys(temp.flat(200));
    setSelectObj(selectObj);
  };

  const addModalProps = {
    visible: addVisible,
    title: '新建试卷',
    onCancel: () => {
      setAddVisible(false);
    },
    onOk: () => {
      setAddVisible(false);
      PagingProTable.reload();
    },
  };

  const columns: ProColumns<APIS.ExamPaperPagingItem>[] = [
    /** tab表展示的部分 */
    { title: '试卷标题', dataIndex: 'title' },
    {
      title: '试卷标签',
      dataIndex: 'keywords',
      renderFormItem: () => (
        <Select placeholder="请选择试卷标签">
          {keyWordFilterList.map((item) => (
            <Option key={item} value={item}>
              {item}
            </Option>
          ))}
        </Select>
      ),
      render: (_, row) => {
        return row.keywords.map((item) => {
          return `${item}`;
        }).join('、');
      },
    },
    { title: '创建人', dataIndex: 'creator', hideInSearch: true },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      hideInSearch: true,
      render: (time) => {
        return time || '-';
      },
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_a, item) => (
        <>
          <span
            onClick={() => {
              onViewPaperDetails(item);
            }}
            style={{ cursor: 'pointer', color: '#1890FF' }}
          >
            预览
          </span>

          <Divider type="vertical" />

          <Popconfirm
            title="确定删除此试卷吗？"
            onConfirm={() => {
              onDeleteConfirm(item);
            }}
            okText="确定"
            cancelText="取消"
          >
            <a style={{ color: '#F5222D' }}>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  const toolBarRender = () => {
    return [
      <Button onClick={onClickAddPaper} type="primary" key="add" icon={<PlusOutlined />}>
        新增
      </Button>,
      selectedRowKeys.length ? (
        <>
          <BatchOperation
            key="drop"
            menuArray={[{ text: '批量删除', clickCallBack: clickDeleteMore }]}
          />
        </>
      ) : null,
    ];
  };

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
        rowSelection={{
          
          selectedRowKeys,
          onChange: onChangeSlection,
        }}
      />
      <AddModal {...addModalProps} />
      <PaperModal
        id={paperId}
        visible={showPaper}
        onCancel={() => {
          setShowPaper(false);
        }}
      />
    </>
  );
};

export default Paper;
