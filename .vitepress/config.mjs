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
          // { text: 'Runtime API Examples', link: '/api-examples' },
          { text: 'uploadAndPreview', link: '/uploadAndPreview/uploadAndPreview' },
          { text: 'UAP.js(源码)', link: '/uploadAndPreview/code' },
          { text: 'UAP.js(压缩)', link: '/uploadAndPreview/min' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
