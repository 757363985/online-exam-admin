const routes = [
  {
    path: '/',
    name: '父路由',
    component: '@/layouts/base-layout/base-layout', // 本路由用于做一些全局化配置
    menu: {
      flatMenu: true, // 隐藏此路由，子路由向上提
    },
    routes: [
      {
        path: '/',
        redirect: '/home',
      },
      {
        path: '/login',
        layout: false,
        component: '@/pages/login/login',
        breadcrumbName: '登录',
      },
      {
        path: '/home',
        name: '首页',
        component: '@/pages/home/home',
        icon: 'HomeOutlined',
        breadcrumbName: '首页',
      },
      {
        path: '/paper-management',
        name: '试卷管理',
        icon: 'ContainerOutlined',
        component: '@/pages/paper/paper',
        breadcrumbName: '试卷管理',
      },
      {
        path: '/exam-management',
        name: '考试管理',
        icon: 'HighlightOutlined',
        component: '@/pages/exam/exam',
        breadcrumbName: '试卷管理',
      },
      {
        path: '/score-management/:id',
        name: '成绩管理',
        component: '@/pages/score/score',
        breadcrumbName: '成绩管理',
        menu: false,
      },
      {
        path: '/score-details/:id',
        name: '成绩详情',
        component: '@/pages/score/score-details',
        breadcrumbName: '成绩详情',
        menu: false,
      },
      {
        path: '/score-build/:id',
        name: '成绩详情',
        component: '@/pages/score/score-build/score-build',
        breadcrumbName: '成绩打分',
        menu: false,
      },

      // 测试代码，勿动
      // {
      //   path: '/code-template/paging',
      //   name: '代码模板-分页',
      //   component: '@/code-template/paging/paging',
      //   breadcrumbName: '代码模板-分页',
      //   // menu: false,
      // },

      { component: '@/pages/403' },
    ],
  },
];

export default routes;
