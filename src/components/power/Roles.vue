<!--
 * @Author: Fan
 * @Date: 2021-12-10 16:30:19
 * @LastEditors: your name
 * @LastEditTime: 2022-01-13 10:45:29
 * @Description: file content
-->
<template lang="html">
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolesList" stripe :border="true">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="scoped">
            <el-row
              :class="['bdbottom', index1 === 0 ? 'bdtop' : '']"
              v-for="(item1,index1) in scoped.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col class="firstLevel" :span="5">
                <el-tag closable @close="removeRightById(scoped.row, item1)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="['bdbottom2', index2 === 0 ? '' : 'bdtop2']"
                  v-for="(item2,index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col>
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scoped.row, item2)"
                    >{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col class="elcol-18" :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scoped.row, item3)"
                    >{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300">
          <template v-slot="scoped">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="showEditDialog(scoped.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="removeRoleById(scoped.row)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="small"
              @click="showSetRightDialog(scoped.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
      <!-- 添加角色表单区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%">
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defkeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
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
      // 角色列表数据
      rolesList: [],
      // 添加角色弹窗框的显示隐藏
      addDialogVisible: false,
      // 添加角色的表单数据
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色的表单验证规则对象
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 10, message: '角色名称的长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { max: 10, message: '角色描述的长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 编辑角色弹窗框的显示隐藏
      editDialogVisible: false,
      // 查询到的角色信息对象
      editForm: {},
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightsList: [],
      // 树形控件的绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中节点的id值
      defkeys: [],
      // 当前分配权限的角色id
      roleId: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表数据
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return MessagePrompt('error', '获取角色列表失败')
      this.rolesList = res.data
    },
    // 监听 添加用户对话框关闭 (重置表单)
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加角色 (校验表单)
    addRole () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 201) return MessagePrompt('error', '添加角色失败')
        MessagePrompt('success', '添加角色成功')
        // 关闭弹窗框
        this.addDialogVisible = false
        // 重新获取角色列表数据
        this.getRolesList()
      })
    },
    // 显示编辑角色的弹窗框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return MessagePrompt('error', '查询角色信息失败')
      // 显示编辑角色弹窗框
      this.editDialogVisible = true
      this.editForm = res.data
    },
    // 监听 关闭修改角色弹窗框 (重置表单)
    editDialogClose () {
      this.editForm = {}
      this.$refs.editFormRef.resetFields()
    },
    // 修改角色信息并提交
    editRoleInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('roles/' + this.editForm.roleId, {
          roleName: this.editForm.roleName,
          // 角色描述不能默认为空  只能通过一个占位符来传递
          roleDesc: this.editForm.roleDesc === '' ? ' ' : this.editForm.roleDesc
        })
        if (res.meta.status !== 200) return MessagePrompt('error', '更新角色信息失败')
        MessagePrompt('success', '更新角色信息成功')
        this.editDialogVisible = false
        this.getRolesList()
      })
    },
    // 根据ID删除对应的角色信息
    async removeRoleById (roleinfo) {
      const confirmResult = await this.$confirm('此操作将永久删除' + roleinfo.roleName + '角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      /*
        如果用户确认删除，则返回值为字符串 confirm
        如果用户取消了删除，则返回值为字符串 cancel
      */
      if (confirmResult !== 'confirm') return MessagePrompt('info', '已取消删除')
      const { data: res } = await this.$http.delete('roles/' + roleinfo.id)
      if (res.meta.status !== 200) return MessagePrompt('error', '删除角色失败')
      MessagePrompt('success', '删除角色成功')
      this.getRolesList()
    },
    // 根据ID删除对应的权限
    async removeRightById (role, right) {
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm('此操作将永久删除"' + right.authName + '"标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return MessagePrompt('info', '取消了删除')

      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${right.id}`)

      if (res.meta.status !== 200) return MessagePrompt('error', '删除权限失败')
      role.children = res.data
    },
    // 编辑权限
    async showSetRightDialog (role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return MessagePrompt('error', '获取权限数据失败')
      this.rightsList = res.data

      // 清空数组
      this.defkeys = []
      // 递归获取三级节点的id
      this.getLeafkeys(role, this.defkeys)
      this.setRightDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的ID,并保存到defkeys数组中
    getLeafkeys (node, arr) {
      // 如果当前node节点不包含children属性，则是三级节点
      if (!node.children) return arr.push(node.id)
      node.children.forEach(item => this.getLeafkeys(item, arr))
    },
    // 点击为角色分配权限
    async allotRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) return MessagePrompt('error', '分配权限失败')
      MessagePrompt('success', '分配权限成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.bdtop {
  border-top: 1px solid #eee;
}
.bdtop2 {
  padding-top: 10px;
}
.bdbottom2 {
  padding-bottom: 10px;
}
.bdbottom {
  padding-top: 10px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}
.firstLevel {
  margin-left: 50px;
}
.el-col-19 {
  width: 30%;
}
.elcol-18 {
  margin-left: 250px;
  width: 100%;
  position: relative;
  top: -30px;
  .el-tag {
    margin-right: 20px;
    margin-bottom: 10px;
  }
}
</style>
