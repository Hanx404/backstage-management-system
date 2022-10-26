<!--
 * @Author: Fan
 * @Date: 2022-01-04 17:32:51
 * @LastEditTime: 2022-01-13 10:06:29
 * @LastEditors: your name
 * @Description:
 * @FilePath: \vue后台管理\src\components\goods\Add.vue
 * 焯!
-->
<template lang="html">
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="消息提示的文案" type="info" center show-icon></el-alert>
      <!-- 步骤区域 -->
      <el-steps :active="+activeIndex" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateProps"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的Item项 -->
            <el-form-item
              :label="item.attr_name + '：'"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" :border="true"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
              :headers="headerObj"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor class="ql-editor" v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt class="previewImg" />
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
      activeIndex: '0',
      // 添加商品的表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品分类的数组
        goods_cat: [],
        // 图片的的数组
        pics: [],
        // 商品的详情描述
        goods_introduce: '',
        // 参数数据
        attrs: []

      },
      // 添加商品的表单验证对象
      addFormRules: {
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
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 商品分类列表
      catelist: [],
      // 级联选择框的配置对象
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 动态参数列表数据
      manyTableData: [],
      // 静态属性列表数据
      onlyTableData: [],
      // 上传图片的URL地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的headers请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览图片链接
      previewPath: '',
      // 预览图片框的显示隐藏
      previewVisible: false
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取所有商品分类数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return MessagePrompt('error', '获取商品分类数据失败')
      this.catelist = res.data
    },
    // 监听级联选择器的变化
    handleChange () {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // tab钩子函数
    beforeTabLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        MessagePrompt('error', '请先选择商品分类')
        return false
      }
    },
    // tab点击切换事件
    async tabClicked () {
      // 访问商品参数的面板
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`, {
          params: { sel: 'many' }
        })
        if (res.meta.status !== 200) return MessagePrompt('error', '获取参数列表失败')
        // 转数组
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`, {
          params: { sel: 'only' }
        })
        if (res.meta.status !== 200) return MessagePrompt('error', '获取参数列表失败')
        this.onlyTableData = res.data
      }
    },
    // 处理图片预览效果
    handlePreview (file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 处理移除图片的操作
    handleRemove (file) {
      // 获取将要删除图片的临时路径
      const filePath = file.response.data.tmp_path
      // 从pics数组中查找到这个图片的索引值
      const i = this.addForm.pics.findIndex(obj => obj.pic === filePath
      )
      // 调用数组的splice方法把图片信息对象，从pics数组中移除
      this.addForm.pics.splice(i, 1)
    },
    // 添加成功时的操作
    handleSuccess (response) {
      // 拼接一个图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      // 将图片信息对象 push 到 pics
      this.addForm.pics.push(picInfo)
    },
    // 添加商品
    add () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return MessagePrompt('error', '请填写必要的表单项')
        // 执行添加的业务逻辑
        // 深拷贝addForm
        const form = this.deepClone(this.addForm)
        form.goods_cat = form.goods_cat.join(',')

        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          }
          form.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          form.attrs.push(newInfo)
        })
        // 添加商品
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) return MessagePrompt('error', '添加商品失败')
        MessagePrompt('success', '添加商品成功')
        this.$router.push('/home/goods')
      })
    },
    /**
     * @description: 深拷贝函数
     * @param {*} target
     * @return {*}
     */
    deepClone (target) {
      // 定义一个变量
      let result
      // 如果当前需要深拷贝的是一个对象的话
      if (typeof target === 'object') {
        // 如果是一个数组的话
        if (Array.isArray(target)) {
          result = [] // 将result赋值为一个数组，并且执行遍历
          for (const i in target) {
            // 递归克隆数组中的每一项
            result.push(this.deepClone(target[i]))
          }
          // 判断如果当前的值是null的话；直接赋值为null
        } else if (target === null) {
          result = null
          // 判断如果当前的值是一个RegExp对象的话，直接赋值
        } else if (target.constructor === RegExp) {
          result = target
        } else {
          // 否则是普通对象，直接for in循环，递归赋值对象的所有值
          result = {}
          for (const i in target) {
            result[i] = this.deepClone(target[i])
          }
        }
        // 如果不是对象的话，就是基本数据类型，那么直接赋值
      } else {
        result = target
      }
      // 返回最终结果
      return result
    }
  }
}

</script>
<style lang="less" scoped>
.el-checkbox {
  margin: 0 15px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
  margin-left: 15px;
}
</style>
