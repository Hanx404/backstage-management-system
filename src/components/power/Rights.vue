<!--
 * @Author: Fan
 * @Date: 2021-12-10 10:44:37
 * @LastEditors: your name
 * @LastEditTime: 2022-01-13 11:18:23
 * @Description: file content
-->
<template lang="html">
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-table :data="rightsList" stripe :border="true">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template v-slot="scoped">
            <el-tag v-if="scoped.row.level === '0'">一级</el-tag>
            <el-tag v-else-if="scoped.row.level === '1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 权限列表
      rightsList: []
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    // 获取权限列表数据
    async getRightsList () {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error({
          showClose: true,
          message: '获取权限列表失败',
          center: true
        })
      }
      this.rightsList = res.data
    }
  }
}
</script>
<style lang="less" scoped>
</style>
