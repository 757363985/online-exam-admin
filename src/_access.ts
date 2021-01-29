/**
 * 新增页面后，在此处放对应权限名称，然后再路由处加 access: 'live_view', 其中live是权限名称, view 不变
 *
 * 这个项目是自定义的菜单栏可能会和umi约定式侧边栏有区别
 */

// 需要做权限过滤的菜单名称
// const perList = ['home','paper-management'];

export default function init(initialState: any) {
  console.log(initialState);
  // console.log(initialState)
  // if (initialState && initialState.permissions) {
  //   const { permissions } = initialState;

  //   const permission: any = {};

  //   /** 用户权限数据遍历 */
  //   permissions.forEach((i: any) => {
  //     const { actions } = i;

  //     /** 需要做权限判断的菜单 */
  //     perList.forEach((item) => {
  //       console.log(item)
  //       // 菜单权限判断
  //       if (`exam_${item}` === i.code) {
  //         permission[`exam_${item}`] = { menu: true };
  //       }

  //       if (!permission[`exam_${item}`]) {
  //         permission[`exam_${item}`] = { menu: true };
  //       }
  //     });

  //     // 按钮权限判断
  //     if (perList.map((j: string) => `exam_${j}`).includes(i.code)) {
  //       actions.forEach((item: any) => {
  //         permission[i.code][item.actionCode] = true;
  //       });
  //     }
  //   });

  return { exam_home: true, 'exam_paper-management': true };
}
//   return {};
// }
