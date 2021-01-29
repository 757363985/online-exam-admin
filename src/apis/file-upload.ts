import * as Storage from '@scf/helpers/es/storage';

import { BaseResponse } from './fetch';

export const FileUpload = (url: string, file: FormData): Promise<BaseResponse<string>> => {
  /** fetch 配置项 */
  const params: RequestInit = {
    method: 'POST',
    headers: {
      Authorization: Storage.getToken(),
    },
    body: file,
  };

  return fetch(url, params).then((response) => {
    if (response.status === 200 && response.body) {
      return new Promise((resolve, reject) => {
        const contentType = response.headers.get('content-type') || '';

        if (contentType.indexOf('application/json') >= 0) {
          // 返回的是 JSON 文件
          response.json().then(resolve);
        } else if (contentType.indexOf('application/vnd.ms-excel') >= 0) {
          // 是 excel 文件
          response.blob().then((_blob) => {
            const cd = response.headers.get('content-disposition');
            const cds = cd?.split('filename=') || [];

            const blob = new Blob([_blob], {
              type:
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
            });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = decodeURIComponent(cds[1]) || '错误文件.xlsx';
            link.click();
          });
        } else {
          // 暂时不知道是啥
          reject();
        }
      });
    }

    return Promise.reject();
  });
};
