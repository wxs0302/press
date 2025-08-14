import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Cedar Plugins",
  description: "各类文档",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '文档', link: '/uploadAndPreview/uploadAndPreview' }
    ],

    sidebar: [
      {
        text: '文档',
        items: [
          // { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: '入职宝典', link: '/api-examples' },
          { text: '好用Excel导出', link: '/excel/excel' },
          {
            text: 'UAP媒体管理插件',
            items: [
              {
                text: 'UAP主页', link: '/uploadAndPreview/uploadAndPreview',
              },
              { text: 'UAP.js(源码)', link: '/uploadAndPreview/code' },
              { text: '前端怎么用', link: '/uploadAndPreview/html' },
              { text: '路由怎么用', link: '/uploadAndPreview/route' },
              { text: 'JAVA怎么用', link: '/uploadAndPreview/java' },
            ]
          },
          {
            text: "方法大全",
            items: [
              {
                text: "完整CURD页面代码参考", link: "/curd/curd"
              },
              {
                text: "JAVA CURD controller", link: "/curd/controller"
              },
              {
                text: "JAVA CURD service", link: "/curd/service"
              }
            ]
          }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
