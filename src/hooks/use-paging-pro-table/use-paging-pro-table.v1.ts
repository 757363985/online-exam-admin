import { ProColumns } from '@ant-design/pro-table';
import { FormInstance } from 'antd/lib/form';

import { useRef, useState, useEffect } from 'react';
import { useLocation, history } from 'umi';
import { parse, stringify } from 'qs';
import moment, { Moment } from 'moment';

import { BaseResponsePaging, BasePagingParam } from '@/apis/fetch';
import useOriginalDeepCopy from '@/hooks/previous-value/use-original-deep-copy';

import OptionRender from './pro-table-options';
import { ValueType } from './types';

/** 基础的查询参数 */
type BaseQueryParams = BasePagingParam & Record<string, any>;

/** 默认当前第几页 */
const defaultPage = 1;

/** 默认当前每页多少 */
const defaultSize = 10;

/** 默认的扩展参数 */
const defaultExtraParams = {};

/**
 * 时间/moment 格式化模板
 * https://github.com/ant-design/pro-table/blob/master/src/form/index.tsx#L405
 */
const dateFormatterMap: Record<string, string> = {
  time: 'HH:mm:ss',
  date: 'YYYY-MM-DD',
  dateTime: 'YYYY-MM-DD HH:mm:ss',
  dateRange: 'YYYY-MM-DD',
  dateTimeRange: 'YYYY-MM-DD HH:mm:ss',
};

/** 时间格式字段 */
const dateTypes = ['time', 'date', 'dateTime', 'dateRange', 'dateTimeRange'];

/**
 * 是否是时间值类型
 * @param k columns 里面的 dataIndex
 */
const isDateValueType = (k: string) => {
  return dateTypes.indexOf(k) >= 0;
};

/**
 * ProTable 分页
 * @param GetPaging 获取分页
 * @param columns 分页的字段配置
 * @param options 额外的配置
 */
const usePagingProTable = <T>(
  GetPaging: (p: any) => Promise<BaseResponsePaging<T>>,
  columns: ProColumns<T>[],
  options?: {
    extraParams?: Record<string, any>;
  },
) => {
  /** 复制额外参数 */
  const paramsOriginal = useOriginalDeepCopy(
    (options && options.extraParams) || defaultExtraParams,
  );

  /** location 拿参数 */
  const location = useLocation();

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
  // const COLLAPSED = useRef(true);

  // 是否加载中
  const [loading, setLoading] = useState(false);

  // 刷新监听变量
  const [reload, setReLoad] = useState<boolean>(false);

  // 搜索展开或者关闭
  const [collapsed, setCollapsed] = useState<boolean>(true);

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

    // 更新当前搜索条件
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
    form.validateFields().then((values) => {
      // console.log(values);

      Object.keys(values).forEach((dataIndex) => {
        // 如果某个搜索项没有数据就删除它
        if (!values[dataIndex] || (Array.isArray(values[dataIndex]) && !values[dataIndex].length)) {
          delete values[dataIndex];
        }

        /** 当前表单的值 */
        const itemValue = values[dataIndex];
        const curColumn = columns.filter((citem) => citem.dataIndex === dataIndex)[0];
        const valueType = curColumn.valueType as string;

        // 没使用 ProTable 默认的提交回调，内部的数据需要自己处理，诶。
        // 范围的字段通过 `,` 连接
        if (itemValue) {
          // 处理时间
          if (moment.isMoment(itemValue) && isDateValueType(valueType)) {
            // 处理时间
            const dateFormatter = dateFormatterMap[valueType];
            values[dataIndex] = (itemValue as Moment).format(dateFormatter);
          }

          // 处理时间段
          if (
            moment.isMoment(itemValue[0]) &&
            moment.isMoment(itemValue[1]) &&
            isDateValueType(valueType)
          ) {
            const dataIndexs = dataIndex.split(',');
            const dateFormatter = dateFormatterMap[valueType];

            values[dataIndexs[0]] = (itemValue[0] as Moment).format(dateFormatter);
            values[dataIndexs[1]] = (itemValue[1] as Moment).format(dateFormatter);

            delete values[dataIndex];
          }

          // 处理自定义的 slider
          if (valueType === ValueType.slider && itemValue[0] && itemValue[1]) {
            const dataIndexs = dataIndex.split(',');

            [values[dataIndexs[0]], values[dataIndexs[1]]] = itemValue;

            delete values[dataIndex];
          }
        }
      });

      history.push({
        pathname: location.pathname,
        search: stringify(values),
      });
    });
  };

  /** 表单重置 */
  const onReset = (form: FormInstance) => {
    history.push({
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
    /**
     * 分页数据对象
     */
    paging,

    /**
     * 更新分页数据
     */
    setPaging,

    /**
     * 分页数据加载中
     */
    loading,

    /**
     * 设置分页数据加载中
     */
    setLoading,

    /**
     * 当前分页搜索条件
     */
    PagingParams,

    /**
     * 当前选中的数据 key
     */
    selectedRowKeys,

    /**
     * 复选框
     */
    rowSelection: {
      selectedRowKeys,
      onChange: onChangeSlection,
    },

    /**
     * 自定义搜索按钮
     */
    search: {
      collapsed,
      optionRender: (option: any, form: any) =>
        OptionRender({ option, form: form.form, collapsed, onSubmit, onReset, onCllapsed }),
    },

    /**
     * 初始化简单的数据
     */
    initialValues: (_columns: ProColumns<T>[]) => {
      const query: any = location.search ? parse(location.search.slice(1)) : {};

      return _columns.map((item) => {
        // dataIndex 默认是字符串
        const dataIndex = item.dataIndex as string;

        // valueType 默认当做字符串
        const valueType = item.valueType as string;

        // 分割dataIndex字段，按逗号分隔
        const dataIndexs = dataIndex ? dataIndex.split(',') : [];

        // 一个字段内有两个数据/范围选项
        if (dataIndexs.length >= 2) {
          const [startDataIndexs, endDataIndexs] = dataIndexs;
          const startValue = query[startDataIndexs];
          const endValue = query[endDataIndexs];

          if (startValue && endValue) {
            // 时间相关的处理
            if (isDateValueType(valueType)) {
              const dateFormatter = dateFormatterMap[valueType];
              item.initialValue = [
                moment(startValue, dateFormatter),
                moment(endValue, dateFormatter),
              ];
            }

            // 处理自定义的 slider
            if (valueType === ValueType.slider) {
              item.initialValue = [startValue, endValue];
            }
          }
        } else {
          const curSingleValue = query[dataIndex];

          if (curSingleValue) {
            // 时间相关的处理
            if (isDateValueType(valueType)) {
              const dateFormatter = dateFormatterMap[valueType];
              item.initialValue = moment(curSingleValue, dateFormatter);
            } else {
              item.initialValue = curSingleValue;
            }
          }
        }

        return item;
      });
    },

    /**
     * Pagination 分页
     */
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

      /**
       * 页码改变的回调，参数是改变后的页码及每页条数
       */
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

    /**
     * 刷新列表
     */
    reload: () => {
      setReLoad((l) => !l);
    },

    /**
     * 工具栏
     */
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
