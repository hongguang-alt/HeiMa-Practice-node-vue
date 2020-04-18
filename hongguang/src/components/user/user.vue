<template>
  <div>
    <!-- 面包屑导航头部 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片主体 -->
    <el-card>
      <el-row :gutter="20" class="btn">
        <el-col :span="8">
          <el-input v-model="askparams.query" clearable @clear="getUserList">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!--用户列表-->
      <el-table :data="userList" border style="width: 100%">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="slotProps">
            <el-switch
              v-model="slotProps.row.mg_state"
              @change="changeuserstate(slotProps.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="solts">
            <!-- 小细节，因为不使用这个变量就会报错，如果没有这个变量，插槽就不能使用渲染 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editUser(solts.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="更改权限"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="changeRole(solts.row)"
              ></el-button>
            </el-tooltip>
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="mini"
              @click="deleteUser(solts.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 进行分页，使用组件 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.askparams.pagenum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="this.askparams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 这是对话框用来添加用户 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="closeReset"
    >
      <el-form
        :model="addForm"
        :rules="addFormrules"
        ref="addFormref"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 这是用来编辑用户的对话框 -->
    <el-dialog
      title="编辑用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editUserReset"
    >
      <el-form
        :model="edituserList"
        :rules="edituserListRules"
        ref="edituserListref"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="edituserList.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="edituserList.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="edituserList.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 这是修改用户的角色权限 -->
    <el-dialog
      title="修改角色"
      :visible.sync="changeRoledialogVisible"
      width="50%"
      @close="clearrole"
    >
      <div>
        <p>用户名为:{{ user.username }}</p>
        <br />
        <p>角色为:{{ user.role_name }}</p>
        <br />
        <p>请选择更改角色：
        <el-select v-model="selectrole" placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeRoledialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="Tochangerole"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    //自定义用户的规则，有关于手机号和邮箱
    const checkmobile = (rule, value, callback) => {
      let tocheckM = /^1[34578]\d{9}$/
      if (tocheckM.test(value)) {
        return callback()
      }
      return callback(new Error('请输入正确的手机格式！'))
    }
    const checkemail = (rule, value, callback) => {
      let tocheckE = /[a-zA-Z0-9]{1,10}@[a-zA-Z0-9]{1,5}\.[a-zA-Z0-9]{1,5}/
      if (tocheckE.test(value)) {
        return callback()
      }
      return callback(new Error('请输入正确的邮箱！'))
    }
    return {
      askparams: {
        //用户关键字
        query: '',
        //当前页数
        pagenum: 1,
        //请求当前页面的数据多少
        pagesize: 5
      },
      total: 0,
      userList: [],
      dialogVisible: false,
      editDialogVisible: false,
      edituserList: {},
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkemail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkmobile, trigger: 'blur' }
        ]
      },
      edituserListRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkemail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkmobile, trigger: 'blur' }
        ]
      },
      //修改角色
      changeRoledialogVisible: false,
      //当前要修改权限的用户
      user: {},
      //角色列表
      roleList: {},
      //选中的角色
      selectrole:''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    //获取列表的数据
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.askparams
      })
      if (res.meta.status !== 200) return this.$message.error('获取列表失败！')
      this.userList = res.data.users
      this.total = res.data.total
    },
    //获取分页时每一页的数据是多少
    handleSizeChange(pageSize) {
      this.askparams.pagesize = pageSize
      this.getUserList()
    },
    //分页时候改变当前页码
    handleCurrentChange(currentPage) {
      this.askparams.pagenum = currentPage
      this.getUserList()
    },
    //监听状态值的改变，也就是状态中开关的点击
    async changeuserstate(slotProps) {
      const { data: res } = await this.$http.put(
        `users/${slotProps.id}/state/${slotProps.mg_state}`
      )
      if (res.meta.status !== 200) {
        slotProps.mg_state = !slotProps.mg_state
        return this.$message.error('更改状态失败！')
      }
      this.$message.success('更改状态成功')
    },
    //获取数据
    clear() {
      this.getUserList()
    },
    //关闭添加用户表单的时候进行重置
    closeReset() {
      this.$refs.addFormref.resetFields()
    },
    //添加用户的功能
    addUser() {
      this.$refs.addFormref.validate(async val => {
        if (!val) return
        //通过解构，获取成功的值
        const { data: res } = await this.$http.post('users', this.addForm)
        console.log(res)
        if (res.meta.status == 400)
          return this.$message.error('插入失败，用户名已存在！')
        if (res.meta.status !== 201) return this.$message.error('插入失败！')
        //将弹出框隐藏
        this.dialogVisible = false
        this.$message.success('插入用户成功!')
        this.getUserList()
      })
    },
    //获取要修改用户信息的函数
    async editUser(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200)
        return this.$message.error('获取编辑信息失败！')
      this.edituserList = res.data
    },
    //修改用户表单的重置功能
    editUserReset() {
      this.$refs.edituserListref.resetFields()
    },
    //修改用户进行表单的预验证，并且提交修改信息
    editUserInfo() {
      this.$refs.edituserListref.validate(async val => {
        if (!val) return
        const { data: res } = await this.$http.put(
          'users/' + this.edituserList.id,
          {
            email: this.edituserList.email,
            mobile: this.edituserList.mobile
          }
        )
        console.log(res)
        if (res.meta.status != 200) return this.$message.error('编辑修改失败！')
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('编辑成功！')
      })
    },
    //删除用户，并且进行弹框提示
    async deleteUser(id) {
      const deleteU = await this.$confirm(
        '此操作将要删除用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (deleteU !== 'confirm') return this.$message.info('已经取消删除！')
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.$message.success('已成功删除！')
      this.getUserList()
    },
    //修改角色
    async changeRole(user) {
      this.changeRoledialogVisible = true
      this.user = user
      //获取所有的角色
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status != 200)
        return this.$message.error('获取角色列表失败！')
      this.roleList = res.data
    },
    //发起请求修改角色
    async Tochangerole(){
      if(!this.selectrole) return this.$message.error('请选择你要修改的角色！')
      const {data:res} = await this.$http.put(`users/${this.user.id}/role`,{rid:this.selectrole})
      if(res.meta.status!=200) return this.$message.error('修改失败！')
      this.getUserList()
      this.changeRoledialogVisible=false
    },
    //清除用户列表
    clearrole(){
      this.user=''
      this.selectrole=''
    }
  }
}
</script>
<style lang="less" scoped>
.btn {
  display: flex;
  align-items: center;
}
</style>
