import React, { useEffect, useState } from 'react';
import { stringify } from 'qs';

import { Input, Modal, Form, Upload, Button, message, Select, Divider } from 'antd';
import { InboxOutlined, DownloadOutlined, PlusOutlined } from '@ant-design/icons';

import useDragger from '@/hooks/use-dragger/use-dragger';
import { PostPager, GetPaperKeyWords } from '../service';

const { Item } = Form;
const { Option } = Select;
const { Dragger } = Upload;

type AddModalProps = {
  visible: boolean;
  title: string;
  onCancel: () => void;
  onOk: () => void;
};

const AddModal: React.FC<AddModalProps> = (props) => {
  const { visible, title, onCancel, onOk } = props;
  const [formRef] = Form.useForm();
  const [keyWordsOptions, setkeyWordsOptions] = useState<string[]>([]);
  const [paperKeywords, setPaperKeywords] = useState('');

  /** 文件上传组件属性 */
  const { props: DraggerProps, setFileList: setDraggerFileList } = useDragger({
    more: false,
    type: 'file',
  });

  // 表单 layout 布局配置
  const FormLayout = {
    labelCol: { span: 4, offset: 0 },
    wrapperCol: { span: 20, offset: 1 },
  };

  const onClickSubmit = () => {
    formRef.validateFields().then(() => {
      if (!DraggerProps.fileList.length || !DraggerProps.fileList[0].originFileObj) {
        message.warning('请选择试卷文件！');
        return;
      }

      const formValue = formRef.getFieldsValue();
      const formData = new FormData();

      formData.append('file', DraggerProps.fileList[0].originFileObj);

      PostPager(
        formData,
        stringify(
          {
            title: formValue.paperTitle,
            keywords: formValue.keywords,
          },
          { indices: false },
        ),
      ).then(() => {
        onOk();
      });
    });
  };

  /** input 框试卷标签新增内容更改 */
  const onPaperKeywordsAdd = (event: any) => {
    event.stopPropagation();
    setPaperKeywords(event.target.value);
  };

  /** 新增点击试卷标签 */
  const addPaperKeywords = (e: any) => {
    e.stopPropagation();
    if (paperKeywords === '') {
      message.warn('请填写内容');
      return;
    }
    if (keyWordsOptions.some((item) => item === paperKeywords)) {
      message.warn('已存在该标签');
      return;
    }
    const selectedValue = formRef.getFieldValue('keywords');
    // console.log(selectedValue)
    formRef.setFields([{ name: 'keywords', value: selectedValue.concat(paperKeywords) }]);
    setkeyWordsOptions([...keyWordsOptions, paperKeywords]);
    setPaperKeywords('');
  };

  const paperData = {
    title: '',
    keywords: [],
    file: {},
  };

  const modalProps = {
    visible,
    title,
    width: 500,
    onCancel,
    onOk: onClickSubmit,
    okText: '确定导入',
  };

  useEffect(() => {
    if (visible) {
      GetPaperKeyWords().then(({ data }) => {
        setkeyWordsOptions(data);
      });

      setDraggerFileList([]);
      formRef.resetFields();
      setPaperKeywords('');
    }
  }, [setDraggerFileList, formRef, visible]);

  return (
    <Modal getContainer={false} {...modalProps}>
      <Form labelAlign="right" {...FormLayout} form={formRef} initialValues={paperData}>
        <Item
          name="paperTitle"
          label="试卷标题"
          rules={[{ required: true, message: '请输入考试标题' }]}
        >
          <Input placeholder="请输入考试标题" />
        </Item>

        <Item
          name="keywords"
          label="试卷标签"
          rules={[{ required: true, message: '请添加试卷标签' }]}
        >
          <Select
            mode="multiple"
            placeholder="请选择试卷标签"
            dropdownRender={(menu) => (
              <div>
                {menu}
                <Divider style={{ margin: '4px 0' }} />
                <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                  <Input
                    style={{ flex: 'auto' }}
                    value={paperKeywords}
                    onChange={onPaperKeywordsAdd}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      return false;
                    }}
                    onPressEnter={(e) => {
                      addPaperKeywords(e);
                    }}
                  />
                  <a
                    style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                    onClick={addPaperKeywords}
                  >
                    <PlusOutlined /> 添加标签
                  </a>
                </div>
              </div>
            )}
          >
            {keyWordsOptions.map((item) => (
              <Option key={item} value={item}>
                {item}
              </Option>
            ))}
          </Select>
        </Item>

        <Item name="file" label="上传试卷" rules={[{ required: true, message: '请添加试卷标签' }]}>
          <Dragger
            {...DraggerProps}
            accept=".xlsx"
            beforeUpload={() => false}
            onChange={(info) => {
              setDraggerFileList(
                info.fileList.length >= 1 ? [info.fileList[info.fileList.length - 1]] : [],
              );
            }}
            listType="picture"
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
            <p className="ant-upload-hint">只支持固定格式: Excel</p>
          </Dragger>
        </Item>

        <Item label="Excel模板">
          <Button
            href="https://ny-media-public.oss-cn-beijing.aliyuncs.com/template/exam_import_temp.xlsx"
            target="_blank"
          >
            <DownloadOutlined /> 下载模板
          </Button>
        </Item>
      </Form>
    </Modal>
  );
};

export default AddModal;
