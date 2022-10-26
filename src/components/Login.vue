<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/mao.png" alt />
      </div>
      <!-- 登陆表单区域 -->
      <el-form class="login_form" ref="loginFormRef" :rules="rules" :model="loginForm">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" v-model="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-unlock"
            v-model="loginForm.password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 登录表单数据
      loginForm: {
        username: '',
        password: ''
      },
      // 登录表单的验证规则对象
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    // 监听键盘事件
    document.addEventListener('keydown', this.enterLogin, false)
  },
  beforeDestroy () {
    // 跳转其他页面时销毁键盘登录事件
    document.removeEventListener('keydown', this.enterLogin, false)
  },
  methods: {
    // 重置表单
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    // 表单校验
    login () {
      this.$refs.loginFormRef.validate(async (val) => {
        if (!val) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) {
          // 错误弹窗
          return this.$message.error({
            showClose: true,
            message: '登录失败，error: 400',
            center: true
          })
        }
        // 成功弹窗
        this.$message.success({
          showClose: true,
          message: '登录成功，success: 200',
          center: true
        })
        // 保存token值
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    },
    // enter登陆页面
    enterLogin () {
      const key = window.event.keyCode
      if (key === 13) {
        this.login()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  position: relative;
  min-height: 100vh;
  background-color: #67b9ce;
  background-image: radial-gradient(
      closest-side,
      rgba(137, 188, 213, 1),
      rgba(137, 188, 213, 0)
    ),
    radial-gradient(
      closest-side,
      rgba(170, 193, 238, 1),
      rgba(170, 193, 238, 0)
    ),
    radial-gradient(
      closest-side,
      rgba(252, 220, 150, 1),
      rgba(252, 220, 150, 0)
    ),
    radial-gradient(
      closest-side,
      rgba(246, 194, 235, 1),
      rgba(246, 194, 235, 0)
    ),
    radial-gradient(closest-side, rgba(238, 96, 156, 1), rgba(238, 96, 156, 0));
  background-size: 130vmax 130vmax, 80vmax 80vmax, 90vmax 90vmax,
    110vmax 110vmax, 90vmax 90vmax;
  background-position: -80vmax -80vmax, 60vmax -30vmax, 10vmax 10vmax,
    -30vmax -10vmax, 50vmax 50vmax;
  background-repeat: no-repeat;
  animation: 5s movement linear infinite;
}

// 虚化背景
.login_container::after {
  content: "";
  display: block;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

// 背景动画
@keyframes movement {
  0%,
  100% {
    background-size: 130vmax 130vmax, 80vmax 80vmax, 90vmax 90vmax,
      110vmax 110vmax, 90vmax 90vmax;
    background-position: -80vmax -80vmax, 60vmax -30vmax, 10vmax 10vmax,
      -30vmax -10vmax, 50vmax 50vmax;
  }
  25% {
    background-size: 100vmax 100vmax, 90vmax 90vmax, 100vmax 100vmax,
      90vmax 90vmax, 60vmax 60vmax;
    background-position: -60vmax -90vmax, 50vmax -40vmax, 0vmax -20vmax,
      -40vmax -20vmax, 40vmax 60vmax;
  }
  50% {
    background-size: 80vmax 80vmax, 110vmax 110vmax, 80vmax 80vmax,
      60vmax 60vmax, 80vmax 80vmax;
    background-position: -50vmax -70vmax, 40vmax -30vmax, 10vmax 0vmax,
      20vmax 10vmax, 30vmax 70vmax;
  }
  75% {
    background-size: 90vmax 90vmax, 90vmax 90vmax, 100vmax 100vmax,
      90vmax 90vmax, 70vmax 70vmax;
    background-position: -50vmax -40vmax, 50vmax -30vmax, 20vmax 0vmax,
      -10vmax 10vmax, 40vmax 60vmax;
  }
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  z-index: 1;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    margin: 10px 0 0 10px;
    // padding: 5px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .login_form {
    width: 100%;
    position: absolute;
    bottom: 0;
    padding: 0 20px;
    box-sizing: border-box;
    .btns {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
