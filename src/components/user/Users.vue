<template lang="html">
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row type="flex" justify="space-between">
        <!-- 搜索区域 -->
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
            @change="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加区域 -->
        <el-col :span="2">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户内容显示区域 -->
      <el-table :data="userlist" stripe :border="true">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="职位" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template v-slot="scoped">
            <el-switch v-model="scoped.row.mg_state" @change="userStateChanged(scoped.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot="scoped">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scoped.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scoped.row)"
            ></el-button>
            <!-- 分配职位 -->
            <el-tooltip effect="dark" content="分配职位" placement="top-start" :enterable="false">
              <el-button
                type="info"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scoped.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
      <!-- 添加用户表单区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <p>当前的用户:{{ userInfo.username }}</p>
      <p>当前的角色:{{ userInfo.role_name }}</p>
      <p>
        分配新角色:
        <el-select v-model="selectedRoleId" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// MessagePrompt message的封装
import MessagePrompt from '../../assets/js/message'
export default {
  data () {
    // 手机号验证
    const validatorPhone = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else if (!/^1\d{10}$/.test(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    // 邮箱验证
    const validatorEmail = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
        callback(new Error('邮箱格式错误'))
      } else {
        callback()
      }
    }

    return {
      // 用户列表参数对象
      queryInfo: {
        // 查询字符
        query: '',
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      // 返回的用户数据
      userlist: [],
      // 总内容数
      total: 0,
      // 添加用户弹窗框的显示隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户的表单验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名的长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码的长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        // 可选
        email: [
          { validator: validatorEmail, trigger: 'blur' }
        ],
        // 可选
        mobile: [
          { validator: validatorPhone, trigger: 'blur' }
        ]
      },

      // 修改用户对话框的显示隐藏
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      // 分配角色对话框的显示隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 已选中的角色ID值
      selectedRoleId: ''
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取用户列表数据
    async getUserList () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error({
          showClose: true,
          message: '获取用户列表失败！',
          center: true
        })
      }
      this.userlist = res.data.users
      this.total = res.data.total
    },
    // 监听 pagesize改变 (以多少数据数显示)
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.getUserList()
    },
    // 监听 页码值 (显示第几页)
    handleCurrentChange (val) {
      this.queryInfo.pagenum = val
      this.getUserList()
    },
    // 监听 switch开关状态的改变
    async userStateChanged (userinfo) {
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        return MessagePrompt('error', '更新用户状态失败', () => {
          // 重置回修改前的状态
          userinfo.mg_state = !userinfo.mg_state
        })
      }
      MessagePrompt('success', '更新用户状态成功')
    },
    // 监听 添加用户对话框关闭 (重置表单)
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 确定添加用户 (校验表单)
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return MessagePrompt('error', '添加用户失败')
        MessagePrompt('success', '添加用户成功')
        // 关闭添加用户对话框
        this.addDialogVisible = false
        // 重新获取用户列表数据
        this.getUserList()
      })
    },
    // 显示编辑用户的对话框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return MessagePrompt('error', '查询用户信息失败')
      this.editDialogVisible = true
      this.editForm = res.data
    },
    // 监听 修改用户对话框关闭 (重置表单)
    editDialogClose () {
      this.editForm = {}
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.meta.status !== 200) return MessagePrompt('error', '更新用户信息失败')
        // 关闭对话框
        this.editDialogVisible = false
        // 更新数据
        this.getUserList()
        MessagePrompt('success', '更新用户信息成功')
      })
    },
    // 根据ID删除对应的用户信息
    async removeUserById (userinfo) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除' + userinfo.username + '用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      /*
        如果用户确认删除，则返回值为字符串 confirm
        如果用户取消了删除，则返回值为字符串 cancel
      */
      if (confirmResult !== 'confirm') return MessagePrompt('info', '已取消删除')
      const { data: res } = await this.$http.delete('users/' + userinfo.id)
      if (res.meta.status !== 200) return MessagePrompt('error', '删除用户失败')
      MessagePrompt('success', '删除用户成功')
      this.getUserList()
    },
    // 展示分配角色的对话框
    async setRole (userinfo) {
      this.userInfo = userinfo
      // 在展示对话框之前，获取所有角色的列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return MessagePrompt('error', '获取角色列表失败')
      this.rolesList = res.data
      this.setRoleDialogVisible = true
    },
    async saveRoleInfo () {
      if (!this.selectedRoleId) {
        return MessagePrompt('info', '请选择要分配的角色')
      }
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, {
        rid: this.selectedRoleId
      })
      if (res.meta.status !== 200) return MessagePrompt('error', '更新角色失败')
      MessagePrompt('success', '更新角色成功')
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    setRoleDialogClosed () {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>
<style lang="less" scoped></style>
