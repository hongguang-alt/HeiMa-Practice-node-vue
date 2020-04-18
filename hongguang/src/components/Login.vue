<template>
  <div class="login_bak">
    <!-- 头像区域 -->
    <div class="login_babel">
      <div class="login_title">
        <img src="../assets/head.jpg" alt="" />
      </div>
      <!-- 登陆区域 -->
      <el-form
        ref="loginFormReset"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_input"
      >
        <el-form-item label="" prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon=" iconfont icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="login()">登陆</el-button>
          <el-button type="info" @click="resetLoginForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import '../assets/css/glob.css'
export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormReset.resetFields()
    },
    login() {
      this.$refs.loginFormReset.validate(async val => {
        if (!val) return
        let { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status == 200) {
          this.$message({
            message: '登陆成功！',
            type: 'success'
          })
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('./home')
        } else {
          this.$message({
            message: '登陆失败！',
            type: 'error'
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login_bak {
  height: 100%;
  background-color: #2b4b6b;
}
.login_babel {
  width: 500px;
  height: 300px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 20px;
  .login_title {
    width: 120px;
    height: 120px;
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0 0 10px #eee;
    position: absolute;
    padding: 10px;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_input {
  width: 80%;
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
</style>
