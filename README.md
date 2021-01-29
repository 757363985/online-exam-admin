# 在线学习平台管理端

## 目录结构

```
|-- public 静态资源-会自动拷贝到根目录下

|-- src 源代码
|--|-- .umi umi 自动生成临时代码，勿动

|--|-- apis 通用接口、异步请求基础代码
|--|--|-- fetch.ts 自定义异步请求函数
|--|--|-- index.ts 通用接口
|--|--|-- index.data.d.ts 通用接口的数据类型定义文件


|--|-- assects 通用静态资源📂

|--|-- code-template 通用代码模板📂

|--|-- components 通用 UI 组件📂
|--|--|-- batch-operation-dropdown 批量操作下拉框
|--|--|-- empty-data 空数据/暂无数据
|--|--|-- loading loading
|--|--|-- umeditor 富文本编辑器

|--|-- configs 配置、静态数据📂
|--|--|-- app.ts 当前应用通用/相似系统通用配置
|--|--|-- upload-url.ts 上传文件接口路径

|--|-- layouts 通用布局组件📂
|--|--|-- base-layout 基础布局组件

|--|-- pages 具体业务组件📂
|--|--|-- login 通用登录业务组件

|--|-- types 第三方库类型定义📂

|--|-- types-temporary 当前项目接口、数据类型定义临时文件夹/指定接口时编写，业务开发时需要复制/移动到对应业务文件夹中
```

## 命名规范

文件夹、文件名 以小写字母、数字组成，多个单词以 `-` 链接。

变量名称，对象、异步方法以大写字母开头，同步方法以小写字母开头，HTTP 请求函数名称以 HTTP method 开头。

## 编码规范

安装 [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) 插件。

## JSX

className 多个或需要判断，使用 [classnames](https://github.com/JedWatson/classnames) 操作。

无子元素的组件/标签单闭合。

## 代码提交

```
npm commit

yarn commit
```

通过 `commitizen`、`cz-customizable` 实现，约定分类在 `.cz-config.js` 配置。

[优雅的提交你的 Git Commit Message](https://juejin.im/post/5afc5242f265da0b7f44bee4)


## 更新日志

[点击查看](./changelog.md)
