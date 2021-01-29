import React, { useEffect, useState } from 'react';
import * as G2Plot from '@antv/g2plot';

import EmptyData from '@/components/empty-data/empty-data';
import { GetPaperData } from '../services';

const config = {
  title: {
    visible: true,
    text: '试卷题型雷达分布图',
  },
  description: {
    visible: true,
    text: '各题型数量雷达图',
  },
  legend: {
    flipPage: false,
  },
  forceFit: true,
  radius: 1,
  line: {
    size: 1,
  },
  angleField: 'x',
  radiusField: 'y',
  color: ['#5B8FF9'],
};

const PaperRadar: React.FC = () => {
  const [chartsData, setChartsData] = useState<{ x: string; y: number }[]>([]);

  const renderCharts = (dataList: { x: string; y: number }[]) => {
    const container = document.getElementById('radar');
    if (container === null) return;
    // eslint-disable-next-line no-shadow
    const data = dataList;
    const plot = new G2Plot.Radar(container, {
      data,
      ...config,
    });
    plot.render();
  };

  useEffect(() => {
    if (chartsData.length > 0) {
      renderCharts(chartsData);
    }
  }, [chartsData]);

  useEffect(() => {
    GetPaperData().then(({data}) => {
      const newData = data.map((item) => {
        return {
          x:item.name,
          y:item.value,
        }
      })
      setChartsData(newData)
    })

  }, []);

  return chartsData.length === 0 ? <EmptyData description="暂无试卷题型数据" /> : <div id="radar" />;
};

export default PaperRadar;
