<template>
  <el-container>
    <!--头部栏-->
    <el-header>
      <div class="title">
        <img src="../assets/head.jpg" alt="" />
        <span class="title-font">后台管理系统</span>
      </div>
      <el-button type="info" @click="exit">退出</el-button>
    </el-header>
    <el-container>
      <!--侧边栏-->
      <el-aside :width="iscollapse ? '64px' : '200px'">
        <!--导航栏-->
        <el-menu
          background-color="rgba(0,0,0,.1)"
          text-color="#fff"
          active-text-color="skyblue"
          unique-opened
          :collapse='iscollapse'
          :collapse-transition='false'
          router
          :default-active='topcolor'
        >
        <div class="changecollapse" @click="changecollapse()">|||</div>
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ' '"
            v-for="item in menulist"
            :key="item.id"
          >
            <template slot="title">
              <i :class="menuicon[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index=" '/home/'+subitem.path"
              v-for="subitem in item.children"
              :key="subitem.id"
              @click="changetopcolor('/home/'+subitem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subitem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  created() {
    this.getMenuList()
    this.topcolor=window.sessionStorage.getItem('path')
  },
  data() {
    return {
      //左侧菜单列表
      menulist: [],
      // 左侧菜单栏动态的图标样式
      menuicon:{
        "125":"iconfont icon-user",
        "103":"iconfont icon-lock_fill",
        "101":"iconfont icon-shangpin",
        "102":"iconfont icon-danju",
        "145":"iconfont icon-baobiao"
      },
      iscollapse:false,
      topcolor:''
    }
  },
  methods: {
    exit() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      let { data: res } = await this.$http.get('menus')
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    changecollapse(){
        this.iscollapse=!this.iscollapse
    },
    changetopcolor(topcolor){
      window.sessionStorage.setItem('path',topcolor)
      this.topcolor=topcolor
    }
  }
}
</script>
<style lang="less">
.el-container {
  height: 100%;
}
.el-header {
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title {
    display: flex;
    align-items: center;
    .title-font {
      width: 120px;
      color: white;
      font-size: 20px;
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: rgba(0, 0, 0, 0.4);
  .el-menu{
    border-right:none;
  }
}
.el-main {
  background-color: rgb(255, 255, 255, 0.5);
}
img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
.iconfont{
  font-size:20px!important;
  margin-right:10px;
}
.changecollapse{
  height:25px;
  text-align: center;
  letter-spacing: .2em;
  color:#fff;
  cursor: pointer;
}
</style>
