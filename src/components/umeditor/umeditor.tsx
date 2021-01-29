import React from 'react';

// https://github.com/liuhong1happy/react-umeditor
import Editor from 'react-umeditor';

import customUploader from './custom-uploader';

interface Props {
  newsContent: string;
  setNewsContent: (val: string) => void;
}

/** 工具栏配置 */
const icons = [
  'source | undo redo | bold italic underline strikethrough fontborder emphasis | ',
  'paragraph fontfamily fontsize | superscript subscript | ',
  'forecolor backcolor | removeformat | insertorderedlist insertunorderedlist | selectall | ',
  'cleardoc  | indent outdent | justifyleft justifycenter justifyright | touppercase tolowercase | ',
  'horizontal date time  | inserttable | image emotion spechars',
  // 上传图片icon image emotion spechars
];

const OpenCourseModal = (props: Props) => {
  const { setNewsContent, newsContent } = props;

  // 富文本内容变化
  const onContentChange = (content: string) => {
    setNewsContent(content);
  };

  return (
    <Editor
      icons={icons}
      value={newsContent}
      defaultValue={newsContent}
      onChange={onContentChange}
      plugins={{
        image: {
          customUploader,
        },
      }}
    />
  );
};
export default OpenCourseModal;
