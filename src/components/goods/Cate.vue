<!--
 * @Author: Fan
 * @Date: 2021-12-21 10:41:43
 * @LastEditTime: 2022-01-13 10:08:49
 * @LastEditors: your name
 * @Description:
 * @FilePath: \vue后台管理\src\components\goods\Cate.vue
 * 焯!
-->
<template lang="html">
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col class="treeTable">
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
        <!-- 表格 -->
        <tree-table
          :data="catelist"
          :columns="columns"
          :selection-type="false"
          :expand-type="false"
          :show-index="true"
          index-text="#"
          :border="true"
          :show-row-hover="false"
        >
          <!-- 是否有效 -->
          <template v-slot:isok="isok">
            <i v-if="isok.row.cat_deleted === false" class="el-icon-success" style="color:#22a6b3"></i>
            <i v-else class="el-icon-error" style="color:#eb4d4b"></i>
          </template>
          <!-- 排序 -->
          <template v-slot:order="order">
            <el-tag v-if="order.row.cat_level === 0" size="mini">一级</el-tag>
            <el-tag v-else-if="order.row.cat_level === 1" type="success" size="mini">二级</el-tag>
            <el-tag v-else type="warning" size="mini">三级</el-tag>
          </template>
          <template v-slot:opt="opt">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(opt.row.cat_id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeCateById(opt.row)"
            >删除</el-button>
          </template>
        </tree-table>
        <!-- 分页区域 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[3, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </el-row>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog title="修改分类" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
      <el-form :model="editForm" :rules="addCateFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// MessagePrompt message的封装
import MessagePrompt from '../../assets/js/message'
export default {
  data () {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表，默认为空
      catelist: [],
      // 总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        }, {
          label: '是否有效',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isok'
        }, {
          label: '排序',
          type: 'template',
          template: 'order'
        }, {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      // 添加分类的表单对象
      addCateForm: {
        // 添加的分类名称
        cat_name: '',
        // 父级分类的ID
        cat_pid: 0,
        // 分类等级，默认添加的是1级分类
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { max: 8, message: '分类名称的长度不能超过8 个字符', trigger: 'blur' }
        ]
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        checkStrictly: true,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的ID数组
      selectedKeys: [],
      // 编辑角色弹窗框的显示隐藏
      editDialogVisible: false,
      // 查询到的角色信息对象
      editForm: {}
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return MessagePrompt('error', '获取商品分类失败')
      this.catelist = res.data.result
      this.total = res.data.total
    },
    // 监听 pagesize 变化 (以多少数据数显示)
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听 pagenum 变化 (显示第几页)
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 打开添加分类对话框
    showAddCateDialog () {
      this.addCateDialogVisible = true
      this.getParentCateList()
    },
    // 获取父级分类数据
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) return MessagePrompt('error', '获取父级分类数据失败')
      this.parentCateList = res.data
    },
    // 监听选择级联发生变化
    parentCateChanged () {
      // 如果 selectedKeys 数组中的length大于0，证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类ID
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 添加分类
    addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) return MessagePrompt('error', '添加分类失败')
        MessagePrompt('success', '添加分类成功 ')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 监听对话框的关闭事件，重置表单数据
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      // 清空级联选择器
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
      this.selectedKeys = []
    },
    // 显示商品编辑弹窗框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) return MessagePrompt('error', '查询商品信息失败')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 关闭商品编辑弹窗框
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
      this.editForm = {}
    },
    // 编辑商品信息
    editCateInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('categories/' + this.editForm.cat_id, {
          cat_name: this.editForm.cat_name
        })
        if (res.meta.status !== 200) return MessagePrompt('error', '更新商品信息失败')
        MessagePrompt('success', '更新商品信息成功')
        this.editDialogVisible = false
        this.getCateList()
      })
    },
    // 根据ID删除对应的商品信息
    async removeCateById (Cateinfo) {
      const confirmResult = await this.$confirm('此操作将永久删除"' + Cateinfo.cat_name + '"商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      /*
        如果用户确认删除，则返回值为字符串 confirm
        如果用户取消了删除，则返回值为字符串 cancel
      */
      if (confirmResult !== 'confirm') return MessagePrompt('info', '已取消删除')
      const { data: res } = await this.$http.delete('categories/' + Cateinfo.cat_id)
      if (res.meta.status !== 200) return MessagePrompt('error', '删除商品失败')
      MessagePrompt('success', '删除商品成功')
      this.getCateList()
    }
  }
}
</script>
<style lang="less" scoped>
.treeTable {
  margin-bottom: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
