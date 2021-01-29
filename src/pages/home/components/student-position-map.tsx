import React, { useEffect, useState } from 'react';

import { Scene } from '@antv/l7';
import { CountryLayer } from '@antv/l7-district';
import { Mapbox } from '@antv/l7-maps';

import { GetStudent } from '../services';

/** 地图配置 */

const ProvinceData = [
  {
    name: '云南省',
    code: 530000,
    value: 0,
  },
  {
    name: '黑龙江省',
    code: 230000,
    value: 0,
  },
  {
    name: '贵州省',
    code: 520000,
    value: 0,
  },
  {
    name: '北京市',
    code: 110000,
    value: 0,
  },
  {
    name: '河北省',
    code: 130000,
    value: 0,
  },
  {
    name: '山西省',
    code: 140000,
    value: 0,
  },
  {
    name: '吉林省',
    code: 220000,
    value: 0,
  },
  {
    name: '宁夏回族自治区',
    code: 640000,
    value: 0,
  },
  {
    name: '辽宁省',
    code: 210000,
    value: 0,
  },
  {
    name: '海南省',
    code: 460000,
    value: 0,
  },
  {
    name: '内蒙古自治区',
    code: 150000,
    value: 0,
  },
  {
    name: '天津市',
    code: 120000,
    value: 0,
  },
  {
    name: '新疆维吾尔自治区',
    code: 650000,
    value: 0,
  },
  {
    name: '上海市',
    code: 310000,
    value: 0,
  },
  {
    name: '陕西省',
    code: 610000,
    value: 0,
  },
  {
    name: '甘肃省',
    code: 620000,
    value: 0,
  },
  {
    name: '安徽省',
    code: 340000,
    value: 0,
  },
  {
    name: '香港特别行政区',
    code: 810000,
    value: 0,
  },
  {
    name: '广东省',
    code: 440000,
    value: 0,
  },
  {
    name: '河南省',
    code: 410000,
    value: 0,
  },
  {
    name: '湖南省',
    code: 430000,
    value: 0,
  },
  {
    name: '江西省',
    code: 360000,
    value: 0,
  },
  {
    name: '四川省',
    code: 510000,
    value: 0,
  },
  {
    name: '广西壮族自治区',
    code: 450000,
    value: 0,
  },
  {
    name: '江苏省',
    code: 320000,
    value: 0,
  },
  {
    name: '澳门特别行政区',
    code: 820000,
    value: 0,
  },
  {
    name: '浙江省',
    code: 330000,
    value: 0,
  },
  {
    name: '山东省',
    code: 370000,
    value: 0,
  },
  {
    name: '青海省',
    code: 630000,
    value: 0,
  },
  {
    name: '重庆市',
    code: 500000,
    value: 0,
  },
  {
    name: '福建省',
    code: 350000,
    value: 0,
  },
  {
    name: '湖北省',
    code: 420000,
    value: 0,
  },
  {
    name: '西藏自治区',
    code: 540000,
    value: 0,
  },
  {
    name: '台湾省',
    code: 710000,
    value: 0,
  },
];

type ChartsDataType = {
  name: string;
  code: number;
  value: number;
}[];

// const scene = new Scene({
//   id: 'map',
//   map: new Mapbox({
//     center: [ 116.2825, 39.9 ],
//     pitch: 0,
//     style: 'blank',
//     zoom: 3,
//     minZoom: 0,
//     maxZoom: 10
//   })
// });

// const configs = {
//   map: {
//     type: 'Map',
//     mapType: 'MapBox',
//     pitch: 0,
//     style: 'blank',
//     center: [104.288144, 31.239692],
//     zoom: 3,
//     visible: true,
//     controlsVisible: true,
//     controls: {
//       logo: {
//         visible: true,
//         disable: false,
//         position: 'bottomleft',
//       },
//       scale: {
//         visible: true,
//         disable: false,
//         position: 'bottomright',
//       },
//       zoom: {
//         visible: true,
//         disable: false,
//         position: 'topright',
//       },
//       attach: {
//         visible: false,
//         disable: true,
//         position: 'bottomright',
//       },
//     },
//   },
//   type: 'FillDistrict',
//   layerType: 'PolygonLayer',
//   options: {
//     autoFit: true,
//   },
//   position: {
//     visible: false,
//     disable: true,
//     type: 'loc',
//     loc: null,
//     targetField: 'name',
//     targetField1: 'code',
//     sourceField: 'name',
//   },
//   shape: {
//     visible: false,
//     field: null,
//     values: 'fill',
//   },
//   size: {
//     visible: false,
//   },
//   colorScheme: {
//     type: 'singlehue',
//     stops: 5,
//     reverse: false,
//     name: 'Blues',
//   },
//   scales: {
//     values: {
//       color: {
//         type: 'quantile',
//         field: 'confirm',
//       },
//     },
//   },

//   color: {
//     visible: true,
//     field: 'confirm',
//     values: [
//       'rgb(239,243,255)',
//       'rgb(189,215,231)',
//       'rgb(107,174,214)',
//       'rgb(49,130,189)',
//       'rgb(8,81,156)',
//     ],
//     scale: 'quantile',
//     opacity: 1,
//   },
//   stroke: {
//     visible: true,
//     field: null,
//     color: 'rgb(93,112,146)',
//     size: 0.6,
//     opacity: 0.77,
//   },
//   label: {
//     visible: true,
//     field: 'name',
//     size: 12,
//     opacity: 1,
//     color: '#fff',
//     stroke: '#fff',
//     strokeWidth: 1.2,
//     strokeOpacity: 1,
//     textAllowOverlap: false,
//   },
//   guojie: {
//     visible: true,
//   },
//   data: [
//     {
//       name: 'province_value',
//       alias: '属性数据',
//       url:
//         'https://gw.alipayobjects.com/os/basement_prod/bfb05f5d-3700-4dd4-ac77-b599d5aeaf39.json',
//     },
//     {
//       name: 'province',
//       alias: '省级行政区',
//       url: 'https://gw.alipayobjects.com/os/bmw-prod/1981b358-28d8-4a2f-9c74-a857d5925ef1.json',
//     },
//     {
//       name: 'boundaries',
//       alias: '国界线、海岸线',
//       url:
//         'https://gw.alipayobjects.com/os/basement_prod/ba8fa803-a8c3-4c67-b806-fe1c444546bd.json',
//     },
//     {
//       name: 'label',
//       alias: '标注点',
//       url: 'https://gw.alipayobjects.com/os/bmw-prod/c4a6aa9d-8923-4193-a695-455fd8f6638c.json',
//     },
//     {
//       name: 'island',
//       alias: '岛屿标注',
//       url:
//         'https://gw.alipayobjects.com/os/basement_prod/ffb777af-c499-4c3a-8226-fe9b1e877793.json',
//     },
//   ],
// };

const StudentPostion: React.FC = () => {
  /** 数据渲染 */
  const [chartsData, setChartsData] = useState<ChartsDataType>([] as ChartsDataType);

  // const chartsRender = () => {
  //   const container: HTMLElement = document.getElementById('student-map') as HTMLElement;
  // };

  /** dom */
  // const [dom, setDom] = useState({} as HTMLElement);

  /** sence */
  // const [scene, setScene] = useState({} as any);

  //   const aa = () => {
  //   const scene = new Scene({
  //     id: 'student-map',
  //     map: new Mapbox({
  //       pitch: 0,
  //       style: 'blank',
  //       center: [116.368652, 39.93866],
  //       zoom: 10.07,
  //     }),
  //   });
  //   scene.on('loaded', () => {
  //     fetch(
  //       // 'https://gw.alipayobjects.com/os/bmw-prod/1981b358-28d8-4a2f-9c74-a857d5925ef1.json' //  获取行政区划P噢利用
  //       'https://gw.alipayobjects.com/os/bmw-prod/d6da7ac1-8b4f-4a55-93ea-e81aa08f0cf3.json',
  //     )
  //       .then((res) => res.json())
  //       .then((data) => {
  //         const chinaPolygonLayer = new PolygonLayer({
  //           autoFit: true,
  //         })
  //           .source(data)
  //           .color('name', [
  //             'rgb(239,243,255)',
  //             'rgb(189,215,231)',
  //             'rgb(107,174,214)',
  //             'rgb(49,130,189)',
  //             'rgb(8,81,156)',
  //           ])
  //           .shape('fill')
  //           .style({
  //             opacity: 1,
  //           });
  //         //  图层边界
  //         const layer2 = new LineLayer({
  //           zIndex: 2,
  //         })
  //           .source(data)
  //           .color('rgb(93,112,146)')
  //           .size(0.6)
  //           .style({
  //             opacity: 1,
  //           });

  //         scene.addLayer(chinaPolygonLayer);
  //         scene.addLayer(layer2);
  //       });
  //     fetch(
  //       'https://gw.alipayobjects.com/os/bmw-prod/c4a6aa9d-8923-4193-a695-455fd8f6638c.json', //  标注数据
  //     )
  //       .then((res) => res.json())
  //       .then((data) => {
  //         const labelLayer = new PointLayer({
  //           zIndex: 5,
  //         })
  //           .source(data, {
  //             parser: {
  //               type: 'json',
  //               coordinates: 'center',
  //             },
  //           })
  //           .color('#fff')
  //           .shape('name', 'text')
  //           .size(12)
  //           .style({
  //             opacity: 1,
  //             stroke: '#fff',
  //             strokeWidth: 0,
  //             padding: [5, 5],
  //             textAllowOverlap: false,
  //           });

  //         scene.addLayer(labelLayer);
  //       });
  //   });
  // };

  // const initDom = () => {
  //   const container = document.getElementById('student-map');
  //   setDom(container as HTMLElement);
  // };

  // const initScene = () => {
  //   const { map } = configs;
  //   const { mapType, ...res } = map;
  //   const mapInstance = mapType === 'MapBox' ? new Mapbox(res) : new GaodeMap(res);
  //   const newScene = new Scene({
  //     id: dom,
  //     map: mapInstance,
  //     logoVisible: false,
  //   });
  //   setScene(newScene);
  // };

  // const fetchData = async (cfg: any) => {
  //   const response = await fetch(cfg.url);
  //   let data;
  //   if (cfg.type === 'csv') {
  //     data = await response.text();
  //   } else {
  //     data = await response.json();
  //   }
  //   return data;
  // };

  // const fetchAllData = async () => {
  //   const { data } = configs;
  //   const fillData = await fetchData(data[1]);
  //   const labelData = await fetchData(data[3]);
  //   return {
  //     fill: fillData,
  //     label: labelData,
  //   };
  // };

  // const joinData = (data: any, fillData: any) => {
  //   const { position } = configs;
  //   const layerData = {
  //     type: 'FeatureCollection',
  //     features: [],
  //   };
  //   const dataObj = {};
  //   data.forEach((element: any) => {
  //     dataObj[element.name] = element;
  //   });
  //   fillData.features.forEach((element: any) => {
  //     const key1 = element.properties[position.targetField];
  //     const key2 = element.properties[position.targetField1];
  //     const item = dataObj[key1] || dataObj[key2];
  //     if (item) {
  //       element.properties = {
  //         ...element.properties,
  //         ...item,
  //       };
  //       // @ts-ignore
  //       layerData.features.push(element);
  //     }
  //   });

  //   return layerData;
  // };

  // const addLabelLayer = (data2: any) => {
  //   const { label } = configs;
  //   if (label.visible && label.field) {
  //     const labelLayer = new PointLayer()
  //       .source(data2, {
  //         parser: {
  //           type: 'json',
  //           coordinates: 'center',
  //         },
  //       })
  //       .shape(label.field, 'text')
  //       .color(label.color)
  //       .size(label.size)
  //       .style({
  //         stroke: label.stroke,
  //         strokeWidth: label.strokeWidth,
  //         strokeOpacity: label.strokeOpacity,
  //         textAllowOverlap: label.textAllowOverlap,
  //       });
  //     scene.addLayer(labelLayer);
  //   }
  // };

  // const addFillLayer = async () => {
  //   const res = await fetchAllData();
  //   const fillData = joinData(data, res.fill);
  //   const { options, shape, scales, color, stroke } = configs;
  //   const fillLayer = new PolygonLayer(options)
  //     .source(fillData)
  //     .shape(shape.values)
  //     .scale(scales.values)
  //     .style({
  //       opacity: color.opacity,
  //     });
  //   if (color.field) {
  //     fillLayer.color(color.field, color.values);
  //   } else {
  //     fillLayer.color(color.values);
  //   }
  //   scene.addLayer(fillLayer);
  //   if (stroke.visible) {
  //     const lineLayer = new LineLayer()
  //       .source(fillData)
  //       .shape('line')
  //       .color(stroke.color)
  //       .size(stroke.size)
  //       .style({
  //         opacity: stroke.opacity,
  //       });
  //     scene.addLayer(lineLayer);
  //   }
  //   addLabelLayer(res.label);
  // };

  // const initLayer = async () => {
  //   const layerType = configs.layerType;
  //   switch (layerType) {
  //     case 'PolygonLayer':
  //       await addFillLayer();
  //       break;
  //   }
  // };

  const draw = () => {
    // return new Promise((resolve) => {
    // scene.on('loaded',() => {
    //   // initLayer()
    // })
    // resolve()
    // });
    const scene = new Scene({
      id: 'student-map',
      logoVisible: false,
      map: new Mapbox({
        center: [116.2825, 39.9],
        pitch: 0,
        style: 'blank',
        zoom: 3,
        minZoom: 0,
        maxZoom: 10,
      }),
    });

    scene.on('loaded', () => {
      new CountryLayer(scene, {
        data: chartsData,
        joinBy: ['adcode', 'code'],
        depth: 1,
        /** 省界线颜色 */
        provinceStroke: '#fff',
        /** 省界线颜色宽度 */
        provinceStrokeWidth: 1,
        /** 市界线颜色 */

        cityStroke: '#EBCCB4',
        cityStrokeWidth: 1,
        /** 地图文字颜色 */
        label: {
          // stroke: 'rgba(0,0,0,0)',
          // color: 'rgba(255,255,255,1)',
        },
        fill: {
          color: {
            field: 'value',
            values: ['#BAE7FF', '#69C0FF', '#1890FF', '#0A73DA', '#004599'],
          },
        },
        popup: {
          enable: true,
          Html: (props: any) => {
            return `<span>${props.name}学生</span>:<span>${props.value}人</span>`;
          },
        },
      });
    });
  };

  // 初始化数据
  useEffect(() => {
    GetStudent().then(({ data }) => {
      ProvinceData.map((item) => {
        data.map((studentData) => {
          if (studentData.name === item.name) {
            item.value = studentData.value;
          }
        });
        return item;
      });
      setChartsData(ProvinceData);
    });
  }, []);

  // useEffect(() => {
  //   if (dom.nodeType === 1) {
  //     initScene();
  //     console.log('sence');
  //   }
  // }, [dom]);

  useEffect(() => {
    if (chartsData.length) {
      draw();
    }
  }, [chartsData]);

  return (
    <>
      <div style={{ height: '400px', padding: '20px 0 0 30px', fontWeight: 600 }}>
        <div style={{ fontSize: '18px', lineHeight: '40px' }}>学生地理位置分布统计图</div>
        <div id="student-map" style={{ height: 360 }} />
      </div>
    </>
  );
};

export default StudentPostion;
