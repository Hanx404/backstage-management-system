
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
// import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
import treeTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// import 'quill/dist/quill.core.css' // import styles
// import 'quill/dist/quill.snow.css' // for snow theme
// import 'quill/dist/quill.bubble.css' // for bubble theme

// 导入nprogress包 进度条
import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

// 配置全局请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 在request拦截器中，展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
  NProgress.start()
  // 添加请求头 调用API的身份验证
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 必须返回config
  return config
})
// 在response拦截器中，隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
Vue.prototype.$http = axios

// 阻止显示生产模式的消息
Vue.config.productionTip = false

Vue.component('tree-table', treeTable)
// 注册富文本编辑器全局组件
Vue.use(VueQuillEditor)

// 时间格式化
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  // padStart() 在原字符串开头填充指定的填充字符串直到目标长度所形成的新字符串
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
