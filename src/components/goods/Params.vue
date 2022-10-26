<!--
 * @Author: Fan
 * @Date: 2021-12-24 17:48:08
 * @LastEditTime: 2022-01-13 10:35:44
 * @LastEditors: your name
 * @Description:
 * @FilePath: \vue后台管理\src\components\goods\Params.vue
 * 焯!
-->
<template lang="html">
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert title="注意:只允许为第三级分类设置相关参数!" type="warning" show-icon></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row>
        <el-col class="cat_opt">
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectCateKeys"
            :options="catelist"
            :props="cateProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数的按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addParamDialogVisible = true"
          >添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" :border="true" stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot="scoped">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item,i) in scoped.row.attr_vals"
                  :key="i"
                  closable
                  v-show="i"
                  @close="handleClose(i, scoped.row)"
                >{{ item }}</el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scoped.row.inputVisible"
                  v-model="scoped.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scoped.row)"
                  @blur="handleInputConfirm(scoped.row)"
                ></el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scoped.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scoped">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scoped.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeParams(scoped.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性的按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addParamDialogVisible = true"
          >添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" :border="true" stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot="scoped">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item,i) in scoped.row.attr_vals"
                  :key="i"
                  closable
                  v-show="i>=0"
                  @close="handleClose(i, scoped.row)"
                >{{ item }}</el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scoped.row.inputVisible"
                  v-model="scoped.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scoped.row)"
                  @blur="handleInputConfirm(scoped.row)"
                ></el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scoped.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scoped">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scoped.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeParams(scoped.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addParamDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editParamDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
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
      // 商品分类列表
      catelist: [],
      // 级联选择框的配置对象
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择框双向绑定的数组
      selectCateKeys: [],
      // 选中的页签名称
      activeName: 'many',
      beforeaActiveName: 'many',
      // 动态参数数据
      manyTableData: [],
      // 静态属性数据
      onlyTableData: [],
      // 控制添加参数弹出框的显示隐藏
      addParamDialogVisible: false,
      // 添加参数的表单对象
      addForm: {
        attr_name: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 控制修改参数弹出框的显示隐藏
      editParamDialogVisible: false,
      // 修改参数的表单对象
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品数据信息
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) MessagePrompt('error', '获取商品分类数据失败')
      this.catelist = res.data
    },
    // 监听级联选择框的变化
    handleChange () {
      // 未选中三级分类
      if (this.selectCateKeys.length !== 3) {
        this.selectCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      this.getChangelist()
    },
    // 根据所选分类的id，和当前所处的面板，获取对应的参数
    async getChangelist () {
      const { data: res } = await this.$http.get(`categories/${this.selectCateKeys[2]}/attributes`, {
        params: {
          sel: this.activeName
        }
      })
      if (res.meta.status !== 200) return MessagePrompt('error', '获取参数列表失败')

      res.data.forEach(item => {
        item.attr_vals = item.attr_vals.split(',')
        // 控制文本框的显示隐藏
        item.inputVisible = false
        // 文本框中输入的值
        item.inputValue = ''
      })

      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // tab 页签点击事件的处理函数
    handleTabClick () {
      if (this.selectCateKeys.length !== 3) return MessagePrompt('warning', '请选择商品分类')
      this.getChangelist()
    },
    // 监听对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加参数
    addParams () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.selectCateKeys[2]}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) return MessagePrompt('error', '添加参数失败')
        MessagePrompt('success', '添加参数成功')
        this.addParamDialogVisible = false
        this.getChangelist()
      })
    },
    // 展示修改对话框
    async showEditDialog (id) {
      // 查询当前参数的信息
      const { data: res } = await this.$http.get(`categories/${this.selectCateKeys[2]}/attributes/${id}`, {
        attr_sel: this.activeName
      })
      if (res.meta.status !== 200) return MessagePrompt('error', '获取参数信息失败')
      this.editForm = res.data
      this.editParamDialogVisible = true
    },
    // 监听对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
      this.editForm = {}
    },
    // 修改参数
    editParams () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.selectCateKeys[2]}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 200) return MessagePrompt('error', '修改参数失败')
        MessagePrompt('success', '修改参数成功')
        this.editParamDialogVisible = false
        this.getChangelist()
      })
    },
    // 根据id删除对应的参数
    async removeParams (row) {
      const confirmResult = await this.$confirm('此操作将永久删除"' + row.attr_name + '"参数，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      /*
        如果用户确认删除，则返回值为字符串 confirm
        如果用户取消了删除，则返回值为字符串 cancel
      */
      if (confirmResult !== 'confirm') return MessagePrompt('info', '已取消删除')
      const { data: res } = await this.$http.delete(`categories/${this.selectCateKeys[2]}/attributes/${row.attr_id}`)
      if (res.meta.status !== 200) return MessagePrompt('error', '删除参数失败')
      MessagePrompt('success', '删除参数成功')
      this.getChangelist()
    },
    // 文本框失去焦点或者按下Enter都可以触发
    async handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }

      // 实时添加参数数据  显示伪数据
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row, true)
    },
    /**
     * @description: 将attr_vals操作保存到数据库
     * @param {object} row 行内容
     * @param {boolean} add 是否为添加参数数据
     * @param {number?} i 当Boolean为false时，表示删除的下标
     * @param {string?} inp 当Boolean为false时，表示删除的内容
     */
    async saveAttrVals (row, add, i, inp) {
      const { data: res } = await this.$http.put(`categories/${this.selectCateKeys[2]}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(',')
      })

      if (res.meta.status !== 200) {
        add ? row.attr_vals.pop() : row.attr_vals.splice(i, 0, inp)
        MessagePrompt('error', '修改参数失败')
        return
      }
      MessagePrompt('success', '修改参数成功')
    },
    // 点击按钮，展示文本输入框
    showInput (row) {
      row.inputVisible = true
      // 让文本框自动获取焦点
      // $nextTick 方法的作用，当页面上元素被重新渲染后，才会指定调用回调函数
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除对应的参数可选项
    handleClose (i, row) {
      const inputContent = row.attr_vals[i]
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row, false, i, inputContent)
    }
  },
  computed: {
    // 如果按钮需要被禁用 则返回true 否则返回false
    isBtnDisabled () {
      if (this.selectCateKeys.length !== 3) {
        return true
      }
      return false
    },
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
