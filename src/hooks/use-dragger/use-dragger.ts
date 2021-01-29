import { useState } from 'react';
import { message } from 'antd';
import * as Storage from '@scf/helpers/es/storage';

import { UploadFile } from 'antd/es/upload/interface';

import { imgUploadUrl, fileUploadUrl } from '@/configs/upload-url';

export type ImgFile = { name: string; url: string; shortUrl: string };

type Arg = {
  more: boolean; // 是否可以上传多
  maxLength?: number; // 限制文件上传数量
  type?: 'img' | 'file'; // 上传文件类型
};

/**
 * upload 上传
 * @param arg 成功回调
 */
const useDragger = (arg: Arg) => {
  const { more = false, maxLength = 10, type } = arg;

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const token = Storage.getToken();

  const onChange = (info: any) => {
    const { status, size } = info.file;

    if (status === 'uploading') {
      if (size / 1024 / 1024 > 5) {
        message.error('文件限制最大5M');
        return;
      }
    }
    setFileList(info.fileList);
    console.log('info', info, maxLength);
    if (status === 'done') {
      // message.success(`${info.file.name}上传成功。`);

      // 判断是否需要上传多个
      if (!more) {
        setFileList([info.fileList[info.fileList.length - 1]]);
      } else {
        if (info.fileList.length >= maxLength) {
          info.fileList.shift();
          setFileList(info.fileList);
        }
        setFileList(info.fileList);
      }
    } else if (status === 'error') {
      message.error(`${info.file.name}上传失败`);

      // 清除新的
      if (!more) {
        setFileList(info.fileList.length > 1 ? [info.fileList[0]] : []);
      } else {
        info.fileList.shift();
        setFileList(info.fileList);
      }
    }
  };

  return {
    props: {
      name: 'file',
      headers: {
        Authorization: token || '',
      },
      action: type === 'img' ? imgUploadUrl : fileUploadUrl,
      fileList,
      onChange,
    },
    setFileList,
  };
};

export default useDragger;
