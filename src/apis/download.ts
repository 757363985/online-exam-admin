import * as Storage from '@scf/helpers/es/storage';
import { stringify } from 'qs';

type Method = 'GET' | 'POST';

export const download = (
  url: string,
  data: any,
  method: Method,
  type: string,
  fileName?: string,
) => {
  /** fetch 配置项 */
  const params: RequestInit = {
    method,
    headers: {
      Authorization: Storage.getToken(),
      'response-type': 'arraybuffer',
    },
  };

  if (method === 'GET') {
    // 每次请求添加时间戳，避免 GET 请求遭遇 HTTP 缓存
    data._ = new Date().getTime();

    // 请求参数合并到 URL 上
    url += `?${stringify(data)}`;
  } else {
    params.body = JSON.stringify(data);
  }

  return fetch(url, params)
    .then((response) => {
      if (response.status === 200 && response.body) {
        if (!fileName) {
          const cd = response.headers.get('content-disposition');
          const cds = cd?.split('filename=') || [];
          if (cds[1]) {
            fileName = decodeURIComponent(cds[1]);
          }
        }
        return response.blob();
      }

      return Promise.reject();
    })
    .then((_blob) => {
      const blob = new Blob([_blob], {
        type,
      });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName || 'file';
      link.click();

      return 'done';
    });
};

/**
 * 下载 Excel
 */
export const downloadExcel = (url: string, data: any, method: Method, fileName?: string) => {
  return download(
    url,
    data,
    method,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
    fileName,
  );
};
