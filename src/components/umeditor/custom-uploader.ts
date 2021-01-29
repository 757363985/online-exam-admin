// import * as COMMON_APIS from '@/apis';

// 自定义上传代码示例
// https://github.com/liuhong1happy/react-umeditor/blob/master/src/utils/FileUpload.js

/** 空回调 */
const EmptyCallback = () => '';

const Uploader = {
  // 上传文件
  post: async (options: any) => {
    console.log(options);
    const formData = new FormData();
    formData.append('file', options.file);
    try {
      // 图片上传接口在这里写
      // const res: any = await COMMON_APIS.PostCommonUploadImg(formData);
      // options.onEnd(res.data);
      // options.onSuccess(res.data);
    } catch (e) {
      console.log('出错了', e);
    }
    return options;
  },
};

export default {
  uploadFile(options: any) {
    options.filename = options.filename || 'filename';
    options.beforeUpload = options.beforeUpload || (() => true);
    options.onSuccess = options.onSuccess || EmptyCallback;
    options.onError = options.onError || EmptyCallback;
    options.onLoad = options.onLoad || EmptyCallback;
    options.onStart = options.onStart || EmptyCallback;
    options.onEnd = options.onEnd || EmptyCallback;

    if (options.beforeUpload(options)) {
      options.onStart(options);
      // 开始上传文件
      console.log('开始上传文件', options);
      Uploader.post(options);
    }
  },
  uploadFiles(options: any) {
    console.log('options', options);
  },
};
