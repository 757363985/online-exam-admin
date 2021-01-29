import { defineConfig } from 'umi';

import routes from './src/routes';

const isDev = process.env.NODE_ENV !== 'production';
const baseURL = isDev ? '/' : './';

export default defineConfig({
  runtimePublicPath: false,
  publicPath: baseURL,
  history: {
    type: 'hash',
  },
  layout: {
    name: '在线考试管理',
    logo: `${baseURL}images/logo.png`,
    fixedHeader: true,
    fixSiderbar: true,
    locale: false,
    navTheme: 'light',
  },
  favicon: `${baseURL}favicon.ico`,
  /**路由文件 */
  routes,
  /**忽略 moment 的 locale 文件，用于减少尺寸。 */
  ignoreMomentLocale: true,
  lessLoader: {
    javascriptEnabled: true,
  },
  hash: true,
  dynamicImport: {
    loading: '@/components/loading/loading',
  },
  proxy: {
    '/web': {
      // 本系统接口
      // target: 'http://47.103.72.200:8099/api/v1/',
      target: 'http://192.168.2.53:5010',
      // target: 'http://c.dataofx.com/web',
      changeOrigin: true,
      // pathRewrite: { '^/web': '' },
    },
    '/mock': {
      // mock 服务器
      target: 'http://47.103.72.200:3000/mock/108/api/v1/',
      changeOrigin: true,
      pathRewrite: { '^/mock/api/v1': '/' },
    },
  },
});
