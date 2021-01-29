import { useEffect, useState } from 'react';

import useOriginalDeepCopy from '@/hooks/previous-value/use-original-deep-copy';

import * as API from './use-select-service';

/**
 * 格式化树需要的数据结构
 * @param option 配置
 * @param type 数据类型
 */
const foramtTreeOptions = (option: any, type: API.Params['all']): any[] => {
  return (
    option &&
    option.map((i: any) => {
      const { name, id, canUse, children } = i;
      return {
        title: name,
        value: id,
        key: id,
        disabled: type ? !canUse : false,
        children: foramtTreeOptions(children || [], type),
      };
    })
  );
};

/** 默认参数，提取到外部定义，避免每次参数一个新的引用 */
const defaultParams = {};

const useTreeSeclect = (params: API.Params, refresh = false) => {
  const [options, setOptions] = useState<any[]>([]);
  const parmasOriginal = useOriginalDeepCopy(params || defaultParams);

  useEffect(() => {
    API.GetTreeNode(parmasOriginal).then((res: any) => {
      const { data }: any = res;
      setOptions(foramtTreeOptions(data, parmasOriginal.all));
    });
  }, [refresh, parmasOriginal]);

  return options;
};

export default useTreeSeclect;
