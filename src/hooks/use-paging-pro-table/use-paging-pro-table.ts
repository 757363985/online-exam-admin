import { useRef, useState, useEffect } from 'react';
import { FormInstance } from 'antd/lib/form';
import { useLocation, history } from 'umi';
import { parse, stringify } from 'querystring';
import moment from 'moment';

import { BaseResponsePaging, BasePagingParam } from '@/apis/fetch';
import useOriginalDeepCopy from '@/hooks/previous-value/use-original-deep-copy';

import OptionRender from './pro-table-options';

/** 基础的查询参数 */
type BaseQueryParams = BasePagingParam & Record<string, any>;

/** 默认当前第几页 */
const defaultPage = 1;

/** 默认当前每页多少 */
const defaultSize = 10;

/**
 * 时间范围选择器格式化
 * @param dataIndexArr columns 中元素对应的dataIndex字段
 * @param query 浏览器url参数
 */
function foramtQuery(dataIndexArr: any[], query: any, type = 'date') {
  const len = dataIndexArr.length;

  let initVal;

  const temparr = dataIndexArr
    .map((i: string, index: number) => {
      if (index < len && type === 'date') {
        // 时间选择器
        return query[i] ? moment(query[i]) : undefined;
      }
      if (index < len && type === 'slider') {
        // 滑动输入条
        return query[i] ? query[i] : undefined;
      }
      return undefined;
    })
    .filter((i: any) => i);

  if (temparr.length > 1) {
    initVal = temparr;
  } else if (temparr.length === 1) {
    [initVal] = temparr;
  }

  return initVal;
}

/**
 * ProTable 分页
 * @param GetPaging 获取分页
 * @param extraParams 额外的参数
 */
const usePagingProTable = <T>(
  GetPaging: (p: any) => Promise<BaseResponsePaging<T>>,
  extraParams: Record<string, any>,
) => {
  /** 复制额外参数 */
  const paramsOriginal = useOriginalDeepCopy(extraParams);

  /** location 拿参数 */
  const location = useLocation();

  /** history 跳转页面 */
  // const history = useHistory();

  // 分页需要的参数
  const PagingParams = useRef<BaseQueryParams>({} as BaseQueryParams);

  // 请求时间戳
  const Timestamp = useRef(0);

  // 分页数据
  const [paging, setPaging] = useState<{
    list: T[];
    page: number;
    size: number;
    total: number;
  }>({
    list: [],
    page: defaultPage,
    size: defaultSize,
    total: 0,
  });

  // 存储搜索是展开还是关闭的变量
  const COLLAPSED = useRef(true);

  // 是否加载中
  const [loading, setLoading] = useState(false);

  // 刷新监听变量
  const [reload, setReLoad] = useState<boolean>(false);

  // 搜索展开或者关闭
  const [collapsed, setCollapsed] = useState<boolean>(COLLAPSED.current);

  // 复选框
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 就像一个字典
  const [selectObj, setSelectObj] = useState<any>({});

  // 监听页面的 search 参数变化
  // 每次翻页、搜索参数变动都改变页面的 search
  useEffect(() => {
    // 同步参数
    const query = location.search ? parse(location.search.slice(1)) : ({} as BaseQueryParams);

    // 补全必要的参数
    if (!query.page) {
      query.page = defaultPage;
    }

    if (!query.size) {
      query.size = defaultSize;
    }

    PagingParams.current = query as BaseQueryParams;

    setPaging((p) => ({
      ...p,
      page: +(query.page || defaultPage),
      size: +(query.size || defaultSize),
    }));

    // 记录请求的时间戳
    /** 时间戳 */
    const timestep = new Date().getTime();

    Timestamp.current = timestep;

    setLoading(true);

    // 加载数据
    // 合并额外的参数和当前分页的参数
    GetPaging({
      ...paramsOriginal,
      ...PagingParams.current,
    })
      .then(({ data }) => {
        // 是否是当前请求
        if (timestep === Timestamp.current) {
          setPaging((p) => ({
            ...p,
            list: data.list as [],
            page: +data.currPage,
            size: +data.pageSize,
            total: +data.totalCount,
          }));

          setLoading(false);
        }
      })
      .catch(() => {
        if (timestep === Timestamp.current) {
          setLoading(false);
        }
      });
  }, [location.search, GetPaging, paramsOriginal, reload]);

  /** 表单提交 */
  const onSubmit = (form: FormInstance) => {
    form.validateFields().then((val) => {
      Object.keys(val).forEach((i) => {
        // 如果某个搜索项没有数据就删除它
        if (!val[i] || (Array.isArray(val[i]) && !val[i].length)) {
          delete val[i];
        }

        // 遇到数组形式的搜索项，将其转为字符串并用逗号分隔
        const toArr = i.split(',');

        // 数组长度
        const len = toArr.length;

        // 取范围选择器的类型
        const type = len > 1 ? toArr[toArr.length - 1] : undefined;

        // 如果是
        if (type) {
          toArr.forEach((item: string, index: number) => {
            if (index < len - 1) {
              if (type === 'date-time' && val[i]) {
                // 日期-时间选择器
                val[item] = moment(val[i][index]).format('YYYY-MM-DD HH:mm:ss');
              } else if (type === 'date-date' && val[i]) {
                // 日期选择器
                val[item] = moment(val[i][index]).format('YYYY-MM-DD');
              } else if (type === 'slider' && val[i]) {
                // 其他，比如滑动输入条
                val[item] = val[i][index];
              } else if (type === 'tree' && val[i]) {
                // 多选的树形选择，或者多选的下拉选择器
                val[item] = val[i].join(',');
              }
            }
          });

          delete val[i];
        }
      });

      history.push({
        pathname: location.pathname,
        search: stringify(val),
      });
    });
  };

  /** 表单重置 */
  const onReset = (form: FormInstance) => {
    history.replace({
      pathname: location.pathname,
    });

    setTimeout(() => {
      form.resetFields();
    });
  };

  /**
   * 列表checkbox选中事件
   */
  const onChangeSlection = (keys: React.Key[]) => {
    const temp: React.Key[] = [];
    selectObj[paging.page] = keys;

    Object.keys(selectObj).forEach((i) => {
      temp.push(selectObj[i]);
    });
    setSelectedRowKeys(temp.flat(200));
    setSelectObj(selectObj);
  };

  /** 搜素展开或是关闭 */
  const onCllapsed = () => {
    setCollapsed(!collapsed);
  };

  return {
    paging,
    setPaging,
    loading,
    setLoading,
    PagingParams,
    selectedRowKeys,
    // 复选框
    rowSelection: {
      selectedRowKeys,
      onChange: onChangeSlection,
    },
    // 自定义搜索按钮
    search: {
      collapsed,
      optionRender: (option: any, form: any) =>
        OptionRender({ option, form: form.form, collapsed, onSubmit, onReset, onCllapsed }),
    },
    // 初始化简单的数据
    initialValues: (columns: any[]) => {
      const query: any = location.search ? parse(location.search.slice(1)) : {};

      return columns.map((item) => {
        // 分割dataIndex字段，按逗号分隔
        const toArr = item.dataIndex ? item.dataIndex.split(',') : [];
        // 分隔后的数组长度
        const len = toArr.length;
        // 数据类型
        const type = len > 1 ? toArr[toArr.length - 1] : undefined;

        // 填充搜索表单的默认值
        if (!(typeof item.hideInSearch === 'boolean' && item.hideInSearch)) {
          if (type && (type === 'date-date' || type === 'date-time')) {
            // 时间范围选择器
            item.initialValue = foramtQuery(toArr, query);
          } else if (type === 'slider') {
            // 滑动输入条
            item.initialValue = foramtQuery(toArr, query, 'slider');
          } else if (type === 'tree') {
            // 树形选择器的时候
            item.initialValue =
              query[toArr[0]] && query[toArr[0]].split(',').map((i: string) => +i);
          } else {
            // 普通类型
            item.initialValue = query[item.dataIndex];
          }
        }

        return item;
      });
    },

    // Pagination分页
    pagination: {
      // 当前页数
      current: paging.page,

      // 每页条数
      pageSize: paging.size,

      // 数据总数
      // 如果接口数据不稳定、动态数据，会有点小报错
      total: paging.total,

      // pageSize 变化的回调
      onShowSizeChange: (_: number, size: number) => {
        history.push({
          pathname: location.pathname,
          search: stringify({
            ...PagingParams.current,
            size,
          }),
        });
      },

      // 页码改变的回调，参数是改变后的页码及每页条数
      onChange: (page: number, pageSize?: number) => {
        history.push({
          pathname: location.pathname,
          search: stringify({
            ...PagingParams.current,
            page,
            size: pageSize,
          }),
        });
      },
    },

    /** 刷新列表 */
    reload: () => {
      setReLoad((l) => !l);
    },

    // 工具栏
    // 刷新目前没有对应的回调事件
    options: {
      reload: false,
      density: true,
      fullScreen: true,
      setting: true,
    },
  };
};

export default usePagingProTable;
