<!--
 * @Author: Fan
 * @Date: 2022-01-04 09:29:05
 * @LastEditTime: 2022-01-13 10:10:04
 * @LastEditors: your name
 * @Description: 商品列表
 * @FilePath: \vue后台管理\src\components\goods\List.vue
 * 焯!
-->
<template lang="html">
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
            @change="getGoodsList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格区域 -->
      <el-table :data="goodslist" :border="true" stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="100px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="80px"></el-table-column>
        <el-table-column label="商品数量" prop="goods_number" width="80px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="180px">
          <template v-slot="scoped">{{ scoped.row.add_time | dateFormat }}</template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template v-slot="scoped">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scoped.row.goods_id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scoped.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>

    <!-- 编辑角色对话框 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
      <el-form :model="editForm" :rules="FormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editForm.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="editForm.goods_number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editListInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// MessagePrompt message的封装
import MessagePrompt from '../../assets/js/message'
export default {
  data () {
    const validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入商品名称'))
      } else if (/[\d]/g.test(value)) {
        callback(new Error('商品名称不能为数字'))
      } else {
        callback()
      }
    }
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表
      goodslist: [],
      // 总数
      total: 0,
      // 控制修改弹窗框的显示隐藏
      editDialogVisible: false,
      // 修改弹窗框的内容验证对象
      FormRules: {
        goods_name: [
          { required: true, validator: validateName, trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ]
      },
      // 修改信息对象
      editForm: {}
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 根据分页获取对应的商品列表
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) return MessagePrompt('error', '获取商品列表失败')
      this.goodslist = res.data.goods
      this.total = res.data.total
    },
    // 监听 pagesize 变化 (以多少数据数显示)
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 监听 pagenum 变化 (显示第几页)
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 删除商品
    async removeById (row) {
      const confirmResult = await this.$confirm('此操作将永久删除"' + row.goods_name + '"商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      /*
        如果用户确认删除，则返回值为字符串 confirm
        如果用户取消了删除，则返回值为字符串 cancel
      */
      if (confirmResult !== 'confirm') return MessagePrompt('info', '已取消删除')
      const { data: res } = await this.$http.delete('goods/' + row.goods_id)
      if (res.meta.status !== 200) return MessagePrompt('error', '删除商品失败')
      MessagePrompt('success', '删除商品成功')
      this.getGoodsList()
    },
    // 跳转到添加商品页面
    goAddpage () {
      this.$router.push('goods/add')
    },
    // 显示编辑数据的弹窗框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('goods/' + id)
      if (res.meta.status !== 200) return MessagePrompt('error', '查询商品信息失败')
      this.editDialogVisible = true
      this.editForm = res.data
    },
    // 监听 关闭修改数据弹窗框 (重置表单)
    editDialogClose () {
      this.editForm = {}
      this.$refs.editFormRef.resetFields()
    },
    // 修改商品信息并提交
    editListInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('goods/' + this.editForm.goods_id, {
          goods_name: this.editForm.goods_name,
          goods_price: this.editForm.goods_price,
          goods_weight: this.editForm.goods_weight,
          goods_number: this.editForm.goods_number,
          // 需接收商品分类
          goods_cat: this.editForm.goods_cat
        })
        if (res.meta.status !== 200) return MessagePrompt('error', '更新商品信息失败')
        MessagePrompt('success', '更新商品信息成功')
        this.editDialogVisible = false
        this.getGoodsList()
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
