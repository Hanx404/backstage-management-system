<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <!-- <img class="home-img" src="../assets/logo.png" alt /> -->
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出登录</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="String(item.id)"
            v-for="item in menulist"
            :key="item.id"
          >
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <!-- index作为path进行路由跳转 -->
            <el-menu-item
              :index="subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState(subItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      // 侧边栏图标
      iconsObj: {
        125: "el-icon-user-solid",
        103: "el-icon-s-tools",
        101: "el-icon-s-goods",
        102: "el-icon-s-order",
        145: "el-icon-s-marketing",
      },
      // 折叠菜单
      isCollapse: false,
      // 被激活的链接地址
      activePath: "",
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    // 退出登陆
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取侧边栏菜单数据
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) {
        return this.$message.error({
          showClose: true,
          message: res.meta.msg,
          center: true,
        });
      }
      this.menulist = res.data;
    },
    // 折叠菜单
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = window.sessionStorage.getItem("activePath");
    },
  },
};
</script>
<style lang="less" scoped>
.home-container {
  height: 100vh;
}
.el-header {
  background-color: #363d40;
  display: flex;
  justify-content: space-between;
  padding-left: 10px;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
  }
  .home-img {
    width: 50px;
    height: 50px;
    background-size: cover;
  }
}
.el-aside {
  background-color: #313743;
  .toggle-button {
    background-color: #475163;
    line-height: 25px;
    font-size: 10px;
    text-align: center;
    color: #fff;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #e9edf0;
}
</style>
