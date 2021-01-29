import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Alert,
  Select,
  Divider,
  message,
  DatePicker,
  InputNumber,
  Button,
  TreeSelect,
} from 'antd';
import { Store } from 'antd/es/form/interface';
import moment, { Moment } from 'moment';
import { SelectValue } from 'antd/lib/select';

import { PlusOutlined } from '@ant-design/icons';
import * as APIS from '../service';

type ExamTime = string | Moment;

type FormValues = APIS.ExamineBaseParams & { id: string | number; examTime?: ExamTime[] };

const { Item } = Form;
const { Option } = Select;
const { RangePicker } = DatePicker;

export type EditMdoalProps = {
  type: 'add' | 'edit';
  item?: FormValues;
  visible: boolean;
  onOk: (type: EditMdoalProps['type'], draft: boolean) => void;
  onCancel: () => void;
};

export type Option = {
  title: string;
  value: string | number;
  key: string | number;
  children?: Option[];
  selectable?: boolean;
};

/** 递归返回树形选择器数据结构 */
export const ReturnCascaderData = (data: APIS.ClassOrg[], childOnly?: boolean) => {
  let newData: Option[] = [];
  newData = data.map((item) => {
    if (item.children) {
      return {
        title: item.name,
        value: item.id,
        key: item.id,
        children: ReturnCascaderData(item.children, childOnly),
        selectable: childOnly ? false : undefined,
      };
    }
    return {
      title: item.name,
      key: item.id,
      value: item.id,
    };
  });
  return newData;
};

/** 为编辑弹窗的时候,根据返回的班级范围回填表单提交时的树形选择框值 */

const deal = (
  id: number,
  List: Option[],
  object: { sevalue: React.ReactText[]; labelList: React.ReactNode[] },
) => {
  List.map((op) => {
    if (op.value === id) {
      object.sevalue.push(op.value);
      object.labelList.push(op.title);
      return null;
    }
    if (op.children) {
      deal(id, op.children, object);
    }
    return null;
  });
};

/** 日期格式化 */
const TIME_FORMAT = 'YYYY-MM-DD';

const EditModal: React.FC<EditMdoalProps> = ({ type, item, visible, onCancel, onOk }) => {
  /** 表单ref */
  const [form] = Form.useForm();

  /** 本次弹窗是保存草稿还是发布 */
  const [draftOrPub, setDraftOrPub] = useState<'draft' | 'publish'>('draft');

  /** 经过处理后的表单(原来数据时间格式化为moment) initialValues */
  const [initialValues, setInitialValues] = useState<FormValues>({} as FormValues);

  /** 处理后的班级组织列表 */
  const [options, setOptions] = useState<Option[]>([]);

  /** 试卷选项 */
  const [paperOptin, setPaperOption] = useState<{ name: string; id: number; score: number }[]>([]);

  /** 弹窗是否加载中,防抖用 */
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  /** 添加新标签的输入框的值 */
  const [value, setValue] = useState<string>();

  /** 历史标签列表(如果手动添加了标签也会添加到里面) */
  const [keyWordList, setKeyWordList] = useState<string[]>([]);

  /** 树形选择器的值 */
  const [treeSelect, setTreeSlect] = useState<{
    sevalue: React.ReactText[];
    labelList: React.ReactNode[];
  }>({ sevalue: [], labelList: [] });

  /** 新增标签输入框变化 */
  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  /** 点击新增keyword 选项 */
  const onClickAddKeyword = (e:any) => {
    e.stopPropagation()
    if (!value || !value.trim()) {
      message.warning('请先输入标签');
    } else {
      if (keyWordList.findIndex((word) => word === value) === -1) {
        setKeyWordList((t) => t.concat(value));
        const selectedValue = form.getFieldValue('keywords');
        if (Array.isArray(selectedValue)) {
          form.setFields([{ name: 'keywords', value: selectedValue.concat(value) }]);
        } else {
          form.setFields([{ name: 'keywords', value: [value] }]);
        }
      } else {
        message.warning('关键词已存在');
      }

      setValue(undefined);
    }
  };

  /** 点击保存为草稿 */
  const onClickSaveFraft = () => {
    setDraftOrPub('draft');
    form.submit();
  };

  /** 点击发布 */
  const onClickPublish = () => {
    setDraftOrPub('publish');
    form.submit();
  };

  /** 弹窗cancel */
  const onModalCancel = () => {
    /** 做些什么...(一般不会做什么,只关闭弹窗) */
    onCancel();
  };

  /** 树形选择器变化 */
  const onChange = (sevalue: React.ReactText[], labelList: React.ReactNode[], extra: any) => {
    console.log(sevalue, labelList, extra);
    setTreeSlect({ sevalue, labelList });
  };

  /** 切换试卷 */
  const onChangePaper = (pv: SelectValue) => {
    console.log(value);
    const index = paperOptin.findIndex((paper) => paper.id === pv);
    if (index !== -1) {
      form.setFields([{ name: 'totalScore', value: paperOptin[index].score }]);
    } else {
      console.log('试卷参数有问题');
    }
  };

  /** 表单触发提交 */
  const onFinish = (store: Store) => {
    const {
      paperId,
      title,
      keywords,
      examTime,
      duration,
      classIds,
      passScore,
      excellentScore,
      totalScore,
    } = store;
    console.log(type, draftOrPub);
    setConfirmLoading(true);

    /** 基础数据 */
    const baseParams: APIS.ExamineBaseParams = {
      paperId,
      title,
      keywords,
      startTime: moment(examTime[0]).format(`${TIME_FORMAT} 00:00:00`),
      endTime: moment(examTime[1]).format(`${TIME_FORMAT} 23:59:59`),
      duration: duration * 60,
      classIds,
      passScore,
      excellentScore,
      status: draftOrPub === 'draft' ? 4 : 0,
    };

    /** 新增或编辑时,classIds 数据改为 {name:string,id:number}[]形式 */
    const newclassIds: { id: number; name: string }[] = [];
    for (let i = 0; i < treeSelect.labelList.length; i++) {
      newclassIds.push({
        name: String(treeSelect.labelList[i]),
        id: Number(treeSelect.sevalue[i]),
      });
    }

    if (type === 'add') {
      APIS.PostTestAdd({ ...baseParams, classList: newclassIds, totalScore })
        .then(() => {
          setConfirmLoading(false);
          /** 为 true 时 发布的草稿 */
          onOk('add', draftOrPub === 'draft');
        })
        .catch(() => setConfirmLoading(false));
    }
    if (type === 'edit' && item) {
      APIS.PutTestEdit({
        ...baseParams,
        totalScore,
        classList: newclassIds,
        id: item.id,
      })
        .then(() => {
          setConfirmLoading(false);
          /** 为 true 时 发布的草稿 */
          onOk('edit', draftOrPub === 'draft');
        })
        .catch(() => setConfirmLoading(false));
    }
  };

  /** 初始处理表单初始数据 */
  useEffect(() => {
    if (visible) {
      if (type === 'add') {
        setInitialValues({} as FormValues);
        setTreeSlect({ sevalue: [], labelList: [] });
      }
      if (type === 'edit' && item) {
        /** 根据班级范围遍历出树形选择器的值(提交数据时使用,不会展示到表单上) */
        const TreeData: { sevalue: React.ReactText[]; labelList: React.ReactNode[] } = {
          sevalue: [],
          labelList: [],
        };
        item.classIds.map((ids) => deal(ids, options, TreeData));
        setTreeSlect(TreeData);

        const newItem: FormValues = {
          ...item,
          duration: item.duration / 60,
          examTime: item.startTime
            ? [moment(item.startTime, TIME_FORMAT), moment(item.endTime, TIME_FORMAT)]
            : [],
        };
        setInitialValues(newItem);
      }
      setTimeout(() => {
        form.resetFields();
      }, 0);
    }
  }, [visible, form, type, item, options]);

  /** 获取组织机构 */
  useEffect(() => {
    APIS.GetClassOrg({ type: 0, all: 1 })
      .then((res) => {
        setOptions(ReturnCascaderData(res.data));
      })
      .catch(() => {
        console.log('获取班级列表失败');
      });
    APIS.GetKeyWordList({ code: 'examine', business: 'exam' })
      .then((res) => setKeyWordList(res.data))
      .catch(() => {
        console.log('获取标签列表失败');
      });
    APIS.GetPaperOption()
      .then((res) => {
        setPaperOption(res.data || []);
      })
      .catch(() => console.log('获取试卷选项列表失败'));
  }, []);

  return (
    <Modal
      title={type === 'add' ? '新建考试' : '编辑考试'}
      visible={visible}
      confirmLoading={confirmLoading}
      onCancel={onModalCancel}
      width={500}
      footer={
        <>
          <Button
            loading={confirmLoading}
            onClick={onClickSaveFraft}
            style={{ color: '#fff', backgroundColor: '#F2994A', borderColor: '#F2994A' }}
          >
            保存为草稿
          </Button>
          <Button onClick={onClickPublish} loading={confirmLoading} type="primary">
            发布考试
          </Button>
        </>
      }
    >
      <Alert
        message="请注意开考时间"
        description="如到开考时间，不能编辑和删除考试，只能提前结束考试，请合理安排考试时间。"
        type="warning"
        showIcon
      />

      <Form
        style={{ marginTop: 20 }}
        onFinish={onFinish}
        form={form}
        initialValues={initialValues}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <Item
          label="考试标题"
          required
          name="title"
          rules={[{ required: true, message: '请输入考试标题' }]}
        >
          <Input placeholder="请输入考试标题" />
        </Item>

        <Item
          label="考试标签"
          required
          name="keywords"
          rules={[{ required: true, message: '请选择考试标签' }]}
        >
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="请选择标签"
            dropdownRender={(menu) => (
              <div>
                {menu}
                <Divider style={{ margin: '4px 0' }} />
                <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                  <Input
                    placeholder="请输入标签"
                    onChange={onChangeValue}
                    value={value}
                    style={{ flex: 'auto' }}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      return false;
                    }}
                    onPressEnter={(e) => {onClickAddKeyword(e)} }
                  />
                  <a
                    style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                    onClick={onClickAddKeyword}
                  >
                    <PlusOutlined /> 添加新标签
                  </a>
                </div>
              </div>
            )}
          >
            {keyWordList.map((kwl) => (
              <Option key={kwl} value={kwl}>
                {kwl}
              </Option>
            ))}
          </Select>
        </Item>

        <Item
          label="选择试卷"
          required
          name="paperId"
          rules={[{ required: true, message: '请选择试卷' }]}
        >
          <Select placeholder="请选择试卷" onChange={onChangePaper}>
            {paperOptin.map((po) => (
              <Option key={po.id} value={po.id}>
                {`${po.name} (${po.score})分`}
              </Option>
            ))}
          </Select>
        </Item>

        <Item
          label="考试时间"
          required
          name="examTime"
          rules={[{ required: true, message: '请选择考试时间' }]}
        >
          <RangePicker
            style={{ width: '100%' }}
            placeholder={['请选择考试开始时间', '请选择考试结束时间']}
            format={TIME_FORMAT}
            disabledDate={(current) => current && current < moment().subtract(1, 'days')}
          />
        </Item>

        {/* <Item
          label="考试开始时间"
          required
          name="startTime"
          rules={[{ required: true, message: '请选择考试开始时间' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            placeholder="请选择考试开始时间"
            format={TIME_FORMAT}
            disabledDate={(current) => current && current < moment().subtract(1, 'days')}
          />
        </Item> */}

        {/* <Item
          label="考试结束时间"
          required
          name="endTime"
          rules={[{ required: true, message: '请选择考试结束时间' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            placeholder="请选择考试结束时间"
            format={TIME_FORMAT}
            disabledDate={(current) => current && current < moment().subtract(1, 'days')}
          />
        </Item> */}

        <Item
          label="考试范围"
          required
          name="classIds"
          rules={[{ required: true, message: '请选择考试范围' }]}
        >
          <TreeSelect
            placeholder="请选择考试范围"
            multiple
            treeCheckable
            treeData={options}
            onChange={onChange}
          />
        </Item>

        <Item
          label="考试时长"
          required
          name="duration"
          rules={[
            { required: true, message: '请输入考试时长' },
            () => ({
              validator(_rule, duration) {
                if (!duration || duration >= 1) {
                  return Promise.resolve();
                }
                // eslint-disable-next-line prefer-promise-reject-errors
                return Promise.reject('考试时长必须大于0');
              },
            }),
          ]}
        >
          <Input
            addonAfter="min"
            style={{ width: '100%' }}
            type="number"
            placeholder="请输入考试时长"
          />
        </Item>

        <Item
          name="totalScore"
          label="满分成绩"
          required
          dependencies={['excellentScore', 'passScore']}
          rules={[{ required: true, message: '请选择试卷' }]}
        >
          <InputNumber disabled style={{ width: '100%' }} min={0} placeholder="请选择试卷" />
        </Item>

        <Item
          label="及格成绩"
          required
          name="passScore"
          dependencies={['excellentScore', 'totalScore']}
          rules={[
            { required: true, message: '请输入及格成绩' },
            (formIS) => ({
              validator(_rule, passScore) {
                const excellentScore = formIS.getFieldValue('excellentScore');
                const totalScore = formIS.getFieldValue('totalScore');
                // 如果没有输入优秀分数和总分数,验证通过
                if (excellentScore !== 0 && !excellentScore && totalScore !== 0 && !totalScore)
                  return Promise.resolve();
                // 如果本输入框没有值 或者 优秀分数大于等于本输入框数(通过分数)且总分数大于等于本输入框数,验证通过
                if (!passScore || (excellentScore >= passScore && totalScore >= passScore)) {
                  return Promise.resolve();
                }
                // eslint-disable-next-line prefer-promise-reject-errors
                return Promise.reject('及格成绩需要小于或等于优秀、满分成绩');
              },
            }),
          ]}
        >
          <InputNumber style={{ width: '100%' }} min={0} placeholder="请输入及格成绩" />
        </Item>

        <Item
          label="优秀成绩"
          required
          name="excellentScore"
          dependencies={['passScore', 'totalScore']}
          rules={[
            { required: true, message: '请输入优秀成绩' },
            (formIS) => ({
              validator(_rule, excellentScore) {
                const passScore = formIS.getFieldValue('passScore');
                const totalScore = formIS.getFieldValue('totalScore');
                // 及格分数和满分没有值,验证通过
                if (passScore !== 0 && !passScore && totalScore !== 0 && !totalScore)
                  return Promise.resolve();
                // 如果本输入框(优秀成绩)没有值 或者  及格成绩小于等于优秀成绩 且 满分成绩大于等于优秀成绩
                if (
                  !excellentScore ||
                  (passScore <= excellentScore && totalScore >= excellentScore)
                ) {
                  return Promise.resolve();
                }
                // eslint-disable-next-line prefer-promise-reject-errors
                return Promise.reject('优秀成绩大于等于及格成绩、小于等于满分成绩');
              },
            }),
          ]}
        >
          <InputNumber style={{ width: '100%' }} min={0} placeholder="请输入优秀成绩" />
        </Item>
      </Form>
    </Modal>
  );
};

export default EditModal;
