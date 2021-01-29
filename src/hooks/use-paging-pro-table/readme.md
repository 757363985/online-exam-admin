ProTabe组件使用
-----------------

```tsx
// 使用hook
const PagingProTable = usePagingProTable(APIS.GetHonorPaging, {});

return (
   <Protable
    pagination={PagingProTable.pagination}
    options={PagingProTable.options}
    loading={PagingProTable.loading}
    dataSource={PagingProTable.paging.list}
    columns={PagingProTable.initialValues(columns)}
    toolBarRender={toolBarRender}
    rowSelection={PagingProTable.rowSelection}
    rowKey="id"
    search={PagingProTable.search}
  />
)
```


columns
-----------------

```typescript
const columns = [
  {
    title: '获奖时间',
    dataIndex: 'xxx,yyy,date-time',
    hideInTable: true,
    hideInForm: true,
    renderFormItem(_: any, props: any) {
      return <RangePicker {...props} placeholder={['获奖开始时间', '获奖截止时间']} />;
    },
  },
   {
    title: '单个时间',
    dataIndex: 'xxx,date-time',
    hideInTable: true,
    hideInForm: true,
    renderFormItem(_: any, props: any) {
      return <RangePicker {...props} placeholder='选择时间' />;
    },
   }
    {
    title: '滑动输入',
    // range的时候添加格式化类型
    dataIndex: 'xxx,yyy,slider',
    hideInTable: true,
    hideInForm: true,
    renderFormItem(_: any, props: any) {
      return <Slider range  {...props} />
    },
  },
  {
    title: '树选择',
     // 多选时添加格式化类型
    dataIndex: 'xxx,tree',
    hideInTable: true,
    hideInForm: true,
    renderFormItem(_: any, props: any) {
      return <TreeSelect treeData={treeData} multiple {...props} placeholder='请选择' />;
    },
  }
]

'date-time':'YYYY-MM-DD HH:mm:ss'
'date-date':'YYYY-MM-DD '
'slider': '滑动输入条'
'tree':'树选择'

```


自定义hook抛出来的数据
--------------------

```typescript
return{
  paging,
    setPaging,
    loading,
    setLoading,
    PagingParams,
    // 复选框的keys
    selectedRowKeys,
    // 复选框，如过业务变得比较复杂，可以选择不用这个属性
    rowSelection: {
      selectedRowKeys,
      onChange: onChangeSlection
    },
    // 自定义搜索按钮
    search:{
      collapsed:boolean,
      // 自定义渲染表单按钮
      optionRender:(option: any, form: any)=>React.Node;
    },
    initialValues(columns)=>columns,
    pagination:{
      // 分页相关的属性方法
    },
    reload:()=>void,
    option:{
      // 工具栏相关属性
    }
}
    
```

