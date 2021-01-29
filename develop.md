## 测试环境账号

http://192.168.2.54:9008/doc.html

用户管理-用户登录

## 模拟用户登录

### 统一认证

API 文档用户登录后复制 token，浏览器中打开 `http://192.168.2.146:8000/#/login?token=xxxx`，模拟统一认证后跳转回来登录系统。

### 代码中预置 token

 API 文档用户登录 -> 切换角色，填充登录后的 token、角色 id 填写登录接口返回的 `identify` 字段中的 `id`，`src/app.ts` 中 `setToken` 更新字符串。

## 服务代理

`.umirc.ts` proxy

## 页面大体布局

`@umijs/plugin-layout`: https://umijs.org/zh-CN/plugins/plugin-layout

