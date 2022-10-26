<!--
 * @Author: Fan
 * @Date: 2022-01-10 17:06:27
 * @LastEditTime: 2022-01-13 10:59:49
 * @LastEditors: your name
 * @Description:
 * @FilePath: \vue后台管理\src\components\order\Order.vue
 * 焯!
-->
<template lang="html">
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表数据 -->
      <el-table :data="orderList" :border="true" stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="100px"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status" width="100px">
          <template v-slot="scoped">
            <el-tag type="success" v-if="scoped.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="100px"></el-table-column>
        <el-table-column label="下单时间" prop="create_time" width="180px">
          <template v-slot="scoped">{{ scoped.row.create_time | dateFormat }}</template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template v-slot="{}">
            <!-- 修改 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
            <!-- 删除 -->
            <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <!-- 修改地址对话框 -->
      <el-dialog
        title="修改地址"
        :visible.sync="addressVisible"
        width="50%"
        @close="addressDialogClosed"
      >
        <el-form
          :model="addressForm"
          :rules="addressFormRules"
          ref="addressFormRef"
          label-width="100px"
        >
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader
              :options="cityData"
              :props="{ expandTrigger: 'hover' }"
              v-model="addressForm.address1"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addressVisible = false">取 消</el-button>
          <el-button type="primary" @click="addressVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 展示物流进度的对话框 -->
      <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
        <!-- 时间线 -->
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in progeressInfo"
            :key="index"
            :timestamp="activity.time"
          >{{ activity.context }}</el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import MessagePrompt from '../../assets/js/message'
import cityData from './citydata.js'
export default {
  data () {
    return {
      // 获取订单列表数据的参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 订单总数
      total: 0,
      // 订单列表数据
      orderList: [],
      // 修改地址对话框的显示与隐藏
      addressVisible: false,
      // 修改地址对话框的内容参数对象
      addressForm: {
        address1: [],
        address2: ''
      },
      // 修改地址对话框验证对象
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      // 地址区域数据
      cityData,
      // 物流进度对话框的显示与隐藏
      progressVisible: false,
      // 物流数据
      progeressInfo: [
        {
          time: '2018-05-10 09:39:00',
          ftime: '2018-05-10 09:39:00',
          context: '已签收,感谢使用顺丰,期待再次为您服务',
          location: ''
        },
        {
          time: '2018-05-10 08:23:00',
          ftime: '2018-05-10 08:23:00',
          context: '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
          location: ''
        },
        {
          time: '2018-05-10 07:32:00',
          ftime: '2018-05-10 07:32:00',
          context: '快件到达 [北京海淀育新小区营业点]',
          location: ''
        },
        {
          time: '2018-05-10 02:03:00',
          ftime: '2018-05-10 02:03:00',
          context: '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
          location: ''
        },
        {
          time: '2018-05-09 23:05:00',
          ftime: '2018-05-09 23:05:00',
          context: '快件到达 [北京顺义集散中心]',
          location: ''
        },
        {
          time: '2018-05-09 21:21:00',
          ftime: '2018-05-09 21:21:00',
          context: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
          location: ''
        },
        {
          time: '2018-05-09 13:07:00',
          ftime: '2018-05-09 13:07:00',
          context: '顺丰速运 已收取快件',
          location: ''
        },
        {
          time: '2018-05-09 12:25:03',
          ftime: '2018-05-09 12:25:03',
          context: '卖家发货',
          location: ''
        },
        {
          time: '2018-05-09 12:22:24',
          ftime: '2018-05-09 12:22:24',
          context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
          location: ''
        },
        {
          time: '2018-05-08 21:36:04',
          ftime: '2018-05-08 21:36:04',
          context: '商品已经下单',
          location: ''
        }
      ]
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    // 获取订单列表数据
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) return MessagePrompt('error', '获取订单列表失败')
      this.total = res.data.total
      this.orderList = res.data.goods
    },
    // 监听显示数据数
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 监听页码值
    handleCurrentChange (newCurrent) {
      this.queryInfo.pagenum = newCurrent
      this.getOrderList()
    },
    // 显示地址弹出框
    showBox () {
      this.addressVisible = true
    },
    // 监听修改地址弹出框的关闭
    addressDialogClosed () {
      this.$refs.addressFormRef.resetFields()
    },
    // 显示物流进度对话框
    async showProgressBox () {
      this.progressVisible = true
    }
  }
}
</script>
<style lang="less" scoped>
</style>
