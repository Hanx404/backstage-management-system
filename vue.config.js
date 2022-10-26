/**
 * @Author: Fan
 * @Date: 2022-01-13 16:10:25
 * @LastEditTime: 2022-01-14 15:02:58
 * @LastEditors: your name
 * @Description:
 * @FilePath: \vue后台管理\vue.config.js
 * @焯!
 */
module.exports = {
  lintOnSave: false,
  chainWebpack: config => {
    // 生产模式
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })
      // 给index.html添加判断条件  区分生产模式与开发模式
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })

    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}
