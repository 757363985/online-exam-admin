import React, { useEffect, useState } from 'react';

import * as G2Plot from '@antv/g2plot';
import EmptyData from '@/components/empty-data/empty-data';
import { GetPaperSubject } from '../services';

const config = {
  title: {
    visible: true,
    text: '考试科目及格率条形图',
  },
  description: {
    visible: true,
    text: '考试及格率百分比条形图',
  },
  legend: {
    flipPage: false,
    offsetY: 14,
  },
  xAxis: {
    label: {},
    title: {
      visible: false,
    },
  },
  forceFit: true,
  xField: 'y',
  yField: 'x',
  stackField: 'series',
  barSize: 18,
  color: ['#5b8ff9', '#e9e9e9'],
};

const PassDegrade = () => {
  const [dataList, setDataList] = useState<{ series: string; x: string; y: number }[]>([]);

  // eslint-disable-next-line no-shadow
  const renderFC = (dataList: { series: string; x: string; y: number }[]) => {
    const container = document.getElementById('pass-degrade');
    if (container === null) return;
    const data = dataList;

    const plot = new G2Plot.PercentStackedBar(container, {
      data,
      ...config,
    });
    plot.render();
  };

  useEffect(() => {
    if (dataList.length > 0) {
      renderFC(dataList);
    }
  }, [dataList]);

  useEffect(() => {
    GetPaperSubject().then(({data}) => {

      const pass = data.map((item) => {
        return {
          series:'及格',
          x: item.name,
          y:item.value
        }
      })

      const noPass = data.map((item) => {
        return {
          series:'不及格',
          x: item.name,
          y: 100 - item.value
        }
      })
      setDataList(noPass.concat(pass))
    })
    // setDataList([
    //   {
    //     series: '未及格',
    //     x: '家具家电',
    //     y: 743,
    //   },
    //   {
    //     series: '未及格',
    //     x: '粮油副食',
    //     y: 864,
    //   },
    //   {
    //     series: '未及格',
    //     x: '美容洗护',
    //     y: 931,
    //   },
    //   {
    //     series: '未及格',
    //     x: '母婴用品',
    //     y: 463,
    //   },
    //   {
    //     series: '未及格',
    //     x: '进口食品',
    //     y: 601,
    //   },
    //   {
    //     series: '未及格',
    //     x: '食品饮料',
    //     y: 881,
    //   },
    //   {
    //     series: '未及格',
    //     x: '家庭清洁',
    //     y: 344,
    //   },
    //   {
    //     series: '及格',
    //     x: '家具家电',
    //     y: 886,
    //   },
    //   {
    //     series: '及格',
    //     x: '粮油副食',
    //     y: 89,
    //   },
    //   {
    //     series: '及格',
    //     x: '美容洗护',
    //     y: 6,
    //   },
    //   {
    //     series: '及格',
    //     x: '母婴用品',
    //     y: 686,
    //   },
    //   {
    //     series: '及格',
    //     x: '进口食品',
    //     y: 928,
    //   },
    //   {
    //     series: '及格',
    //     x: '食品饮料',
    //     y: 917,
    //   },
    //   {
    //     series: '及格',
    //     x: '家庭清洁',
    //     y: 1000,
    //   },
    // ]);
  }, []);

  return dataList.length === 0 ? (
    <EmptyData  description="暂无考试及格率数据" />
  ) : (
    <div id="pass-degrade" />
  );
};

export default PassDegrade;
