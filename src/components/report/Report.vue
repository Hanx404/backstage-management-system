<!--
 * @Author: Fan
 * @Date: 2022-01-12 14:34:16
 * @LastEditTime: 2022-01-13 11:18:14
 * @LastEditors: your name
 * @Description:
 * @FilePath: \vue后台管理\src\components\report\Report.vue
 * 焯!
-->
<template lang="html">
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <div id="main" style="width: 800px;height:400px;"></div>
    </el-card>
  </div>
</template>
<script>
import MessagePrompt from '../../assets/js/message'
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts'
export default {
  data () {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  async mounted () {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) return MessagePrompt('error', '获取折线图数据失败')
    // 合并配置对象
    const result = this.MergeRecursive(this.options, res.data)
    // 两边不留白
    result.xAxis[0].boundaryGap = false

    // 绘制表格
    myChart.setOption(result)
  },
  methods: {
    // 对象合并
    MergeRecursive (obj1, obj2) {
      const arr = Object.keys(obj2)
      let index = -1
      while (++index < arr.length) {
        const p = arr[index]
        try {
          if (obj2[p].constructor === Object) {
            obj1[p] = this.MergeRecursive(obj1[p], obj2[p])
          } else {
            obj1[p] = obj2[p]
          }
        } catch (e) {
          obj1[p] = obj2[p]
        }
      }
      return obj1
    }
  }
}
</script>
<style lang="less" scoped>
</style>
