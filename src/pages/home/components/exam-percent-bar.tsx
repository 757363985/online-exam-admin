import React, { useEffect, useState } from 'react';

import * as G2Plot from '@antv/g2plot';
import EmptyData from '@/components/empty-data/empty-data';
import { GetExamPercent } from '../services';

/** 图标配置，代码由图表魔方自动生成 */

const config = {
  /** 标题 */

  title: {
    visible: true,
    text: '考试科目柱状图',
  },
  /** 副标题 */

  description: {
    visible: true,
    text: '考试科目学生参加百分比',
  },
  legend: {
    flipPage: false,
  },
  xAxis: {
    title: {
      visible: false,
    },
  },
  yAxis: {
    title: {
      visible: false,
    },
  },
  /** 自使用父级的宽高 */

  forceFit: true,
  /** 也可以自定义图表的宽高 */

  // width: 570,
  // height: 360,
  xField: 'x',
  yField: 'y',
  stackField: 'series',
  /** 两种渲染颜色 */

  color: ['#e9e9e9', '#5b8ff9'],
};

const PaperRadar: React.FC = () => {
  type ChartsDataType = {
    series: string;
    x: string;
    y: number;
  }[];

  /** 数据渲染 */
  const [chartsData, setChartsData] = useState<ChartsDataType>([] as ChartsDataType);

  /** canvas 父级的宽度 */

  // const [chartsWidth, setChartsWidth] = useState<number>(560);

  const chartsRender = () => {
    const container: HTMLElement = document.getElementById('exam-bar') as HTMLElement;

    const plot = new G2Plot.PercentStackedColumn(container, {
      data: chartsData,
      ...config,
    });
    plot.render();
  };

  useEffect(() => {
    // setChartsData([
    //   {
    //     series: '门店一',
    //     x: '家具家电',
    //     y: 777,
    //   },
    //   {
    //     series: '门店一',
    //     x: '粮油副食',
    //     y: 934,
    //   },
    //   {
    //     series: '门店一',
    //     x: '美容洗护',
    //     y: 454,
    //   },
    //   {
    //     series: '门店一',
    //     x: '母婴用品',
    //     y: 999,
    //   },
    //   {
    //     series: '门店一',
    //     x: '进口食品',
    //     y: 98,
    //   },
    //   {
    //     series: '门店一',
    //     x: '食品饮料',
    //     y: 317,
    //   },
    //   {
    //     series: '门店一',
    //     x: '家庭清洁',
    //     y: 307,
    //   },
    //   {
    //     series: '门店二',
    //     x: '家具家电',
    //     y: 142,
    //   },
    //   {
    //     series: '门店二',
    //     x: '粮油副食',
    //     y: 199,
    //   },
    //   {
    //     series: '门店二',
    //     x: '美容洗护',
    //     y: 582,
    //   },
    //   {
    //     series: '门店二',
    //     x: '母婴用品',
    //     y: 64,
    //   },
    //   {
    //     series: '门店二',
    //     x: '进口食品',
    //     y: 89,
    //   },
    //   {
    //     series: '门店二',
    //     x: '食品饮料',
    //     y: 641,
    //   },
    //   {
    //     series: '门店二',
    //     x: '家庭清洁',
    //     y: 984,
    //   },
    // ]);
    GetExamPercent().then(({data}) => {
      const examed = data.map((item) => {
        return {
          x: item.name,
          y: item.value,
          series: '已参考',
        };
      });

      const noExam = data.map((item) => {
        return {
          x: item.name,
          y: 100 - item.value,
          series: '未参考',
        }
      })

      const nowExamData = noExam.concat(examed)

      setChartsData(nowExamData)
    });
  }, []);

  useEffect(() => {
    if (chartsData.length) {
      chartsRender();
    }
  }, [chartsData]);

  return (
    <div style={{height:"400px"}}>
      {
        chartsData.length === 0 ? <EmptyData description="暂无考试数据" /> : <div id="exam-bar" style={{ width: '100%' }}></div>
      }   
    </div>
  );
};

export default PaperRadar;
