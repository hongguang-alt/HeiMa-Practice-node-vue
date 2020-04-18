<template>
  <div>
    <!-- 面包屑导航头部 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="dialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="roleList" border>
        <!-- 开启一个点击下拉菜单 -->
        <el-table-column type="expand">
          <template slot-scope="scopes">
            <!-- 渲染一级标签 -->
            <el-row
              v-for="(item, index) in scopes.row.children"
              :key="index"
              :class="['topline', index == 0 ? 'bottomline' : '', 'vcenter']"
            >
              <el-col :span="5">
                <el-tag closable @close="removeRight(scopes.row, item.id)">
                  {{ item.authName }}
                </el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(item1, index1) in item.children"
                  :key="index1"
                  :class="[index1 == 0 ? '' : 'topline', 'vcenter']"
                >
                  <!-- 渲染二级标签 -->
                  <el-col :span="8">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRight(scopes.row, item1.id)"
                      >{{ item1.authName }}</el-tag
                    >
                    <i class="el-icon-arrow-right"></i>
                  </el-col>
                  <!-- 渲染三级标签 -->
                  <el-col :span="16">
                    <el-tag
                      closable
                      @close="removeRight(scopes.row, item2.id)"
                      type="warning"
                      v-for="(item2, index2) in item1.children"
                      :key="index2"
                      >{{ item2.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 正常的列表 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scopes">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-search"
              @click="geteditrole(scopes.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleterole(scopes.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scopes.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色 -->
    <el-dialog
      title="添加角色"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addreset"
    >
      <el-form
        :model="addrole"
        :rules="addrolerules"
        ref="addroleref"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addrole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addrole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="Toaddrole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色弹出框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editdialogVisible"
      width="50%"
      @close="editreset"
    >
      <el-form
        :model="editrole"
        :rules="addrolerules"
        ref="editroleref"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editrole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editrole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="Toeditrole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分配权限弹出框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="getRightdialogVisible"
      width="50%"
      @close='keyArry=[]'
    >
      <el-tree
        :data="getroleRight"
        :props="treeProps"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys='keyArry'
        ref='Thetree'
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="getRightdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="TochangeRight"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //获取角色权限tree型
      getroleRight: [],
      //获取角色列表信息
      roleList: [],
      //添加角色
      dialogVisible: false,
      //修改角色
      editdialogVisible: false,
      //分配权限
      getRightdialogVisible: false,
      //要添加的角色
      addrole: {
        roleName: '',
        roleDesc: ''
      },
      //要修改的角色
      editrole: {},
      addrolerules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: false },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      },
      //树型结构显示的标签名以及作为下一级的名称
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      //默认勾选的数组，以id为勾选标准
      keyArry:[],
      // 当前修改的权限的角色
      role:''
    }
  },
  created() {
    this.getroleList()
  },
  methods: {
    async getroleList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.roleList = res.data
    },
    //添加角色
    Toaddrole() {
      this.$refs.addroleref.validate(async val => {
        if (!val) return
        const { data: res } = await this.$http.post('roles', this.addrole)
        console.log(res)
        if (res.meta.status != 201) return this.$message.error('创建角色失败！')
        this.$message.success('创建角色成功！')
        this.dialogVisible = false
        this.getroleList()
      })
    },
    //重置添加角色所填写的数据
    addreset() {
      this.$refs.addroleref.resetFields()
    },
    //重置编辑角色所填写的数据
    editreset() {
      this.$refs.editroleref.resetFields()
    },
    //根据id获取要编辑的角色
    async geteditrole(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status != 200) return this.$message.error('获取角色失败')
      this.editrole = res.data
      this.editdialogVisible = true
    },
    //验证修改的角色并且提交
    Toeditrole() {
      this.$refs.editroleref.validate(async val => {
        if (!val) return
        const { data: res } = await this.$http.put(
          'roles/' + this.editrole.roleId,
          {
            roleName: this.editrole.roleName,
            roleDesc: this.editrole.roleDesc
          }
        )
        console.log(res)
        if (res.meta.status != 200) return this.$message.error('修改失败！')
        this.editdialogVisible = false
        this.getroleList()
        this.$message.success('修改成功！')
      })
    },
    //删除所选的角色
    async deleterole(id) {
      const deleteR = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '删除角色',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (deleteR !== 'confirm') return this.$message.info('已经取消删除！')
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.$message.success('删除角色成功！')
      this.getroleList()
    },
    //删除角色的权限
    async removeRight(role, id2) {
      const removeR = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '删除权限',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (removeR !== 'confirm') return this.$message.info('已经取消删除！')
      const { data: res } = await this.$http.delete(
        'roles/' + role.id + '/rights/' + id2
      )
      if (res.meta.status !== 200) return this.$message.error('删除权限失败')
      this.$message.success('删除权限成功！')
      role.children = res.data
    },
    // 展示分配权限的对话框并获取权限数据
    async showSetRightDialog(node) {
      //获取当前选择的角色
      this.role=node
      // 获取权限的对应数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200)
        return this.$message.error('获取权限数据失败！')
      this.getroleRight = res.data
      console.log(node)
      this.getThreekey(node,this.keyArry)
      this.getRightdialogVisible = true
    },
    //获取三级权限中的id值，通过递归的方法
    getThreekey(node,arr){
        if(!node.children) {
          return arr.push(node.id)
        }
        node.children.forEach(item => {
          this.getThreekey(item,arr)
        });
    },
    //进行权限设置更新的请求
    async TochangeRight(){
      const arr = [...this.$refs.Thetree.getCheckedKeys(),...this.$refs.Thetree.getHalfCheckedKeys()] 
      const Sarr = arr.join(',')
      const {data:res} = await this.$http.post(`roles/${this.role.id}/rights/`,{rids:Sarr})
      if(res.meta.status!=200) return this.$message.error(res.meta.msg)
      this.$message.success('分配权限成功！')
      this.getroleList()
      this.getRightdialogVisible=false
    }
  }
}
</script>
<style lang="less" scoped>
.topline {
  border-top: 1px solid #eee;
}
.bottomline {
  border-bottom: 1px solid #eee;
}
.el-tag {
  margin: 10px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
