<template>
  <div>
    <!-- 面包屑导航头部 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCatedialogVisible"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 设置表格 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        show-index
        index-text="#"
        :show-row-hover="false"
        :expand-type="false"
        :selection-type="false"
        border
        style="font-size:14px; space-letter:2px;margin-top:15px"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scopes">
          <i
            class="el-icon-success"
            v-if="scopes.row.cat_deleted === false"
            style="font-size:15px;color:green"
          ></i>
          <i class="el-icon-error" style="color:red;" v-else></i>
        </template>

        <!-- 排序 -->
        <template slot="grade" slot-scope="scopes">
          <el-tag v-if="scopes.row.cat_level == '0'" size="mini">一级</el-tag>
          <el-tag
            v-else-if="scopes.row.cat_level == '1'"
            type="success"
            size="mini"
            >二级</el-tag
          >
          <el-tag v-else type="warning" size="mini">三级</el-tag>
        </template>

        <!-- 按钮区域 -->
        <template slot="btn" slot-scope="scopes">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editTheCate(scopes.row)"
            >编辑</el-button
          >
          <el-button
            icon="el-icon-delete"
            type="danger"
            size="mini"
            @click="deleteCate(scopes.row)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="catedata.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="catedata.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCatedialogVisible"
      width="50%"
      @close="clearCate"
    >
      <el-form
        :model="addCate"
        :rules="addCateRules"
        ref="addCateRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCate.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- option数据来源 -->
          <el-cascader
            expand-trigger="hover"
            v-model="parentArry"
            :options="parentCateList"
            :props="parentCateCascader"
            @change="parentCatechange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ToaddCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑的对话框 -->
    <el-dialog
      title="编辑分类名称"
      :visible.sync="editcatedialogVisible"
      width="50%"
    >
      <el-form
        :model="editCate"
        :rules="addCateRules"
        ref="editCateRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editCate.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editcatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ToeditCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //获取商品分类的数据
      cateList: [],
      //获取当前的总数据
      total: 0,
      //传送的数据
      catedata: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //有关于table中的列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
          width: '400px'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'grade'
        },
        {
          label: '操作',
          type: 'template',
          template: 'btn'
        }
      ],
      //有关于添加分类对话框的显示
      addCatedialogVisible: false,
      //用来显示编辑对话框
      editcatedialogVisible: false,
      //用来添加分类
      addCate: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      //添加验证规则
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      //获取到的二级数据
      parentCateList: [],
      //获取的选择的分类名称
      parentArry: [],
      //分类名称的规则
      parentCateCascader: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //要编辑的分类
      editCate: {}
    }
  },
  created() {
    this.getcateList()
  },
  methods: {
    //获取商品分类的数据
    async getcateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.catedata
      })
      if (res.meta.status != 200) return this.$message.error('获商品列表失败！')
      this.total = res.data.total
      this.cateList = res.data.result
    },
    //获取当前的条数改变
    handleSizeChange(size) {
      this.catedata.pagesize = size
      this.getcateList()
    },
    //获取当前页的数据
    handleCurrentChange(Csize) {
      this.catedata.pagenum = Csize
      this.getcateList()
    },
    //显示当前对话框的函数
    showAddCatedialogVisible() {
      this.addCatedialogVisible = true
      this.getParentList()
    },
    //获取二级分类数据
    async getParentList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取分类名称失败！')
      this.parentCateList = res.data
    },
    //获取选择的分类
    parentCatechange() {
      if (this.parentArry.length > 0) {
        this.addCate.cat_pid = this.parentArry[this.parentArry.length - 1]
        this.addCate.cat_level = this.parentArry.length
      } else {
        this.addCate.cat_pid = 0
        this.addCate.cat_level = 0
      }
    },
    //点击按钮，添加新的用户分类
    ToaddCate() {
      this.$refs.addCateRef.validate(async val => {
        if (!val) return
        const { data: res } = await this.$http.post('categories', this.addCate)
        if (res.meta.status != 201) return this.$message.error('添加分类失败！')
        this.$message.success('添加分类成功！')
        this.getcateList()
        this.addCatedialogVisible = false
      })
    },
    //清空重置添加的数据
    clearCate() {
      this.$refs.addCateRef.resetFields()
      this.addCate.cat_pid = 0
      this.addCate.cat_level = 0
      this.parentArry = []
    },
    //编辑分类名称
    async editTheCate(role) {
      this.editcatedialogVisible = true
      const { data: res } = await this.$http.get('categories/' + role.cat_id)
      if (res.meta.status != 200)
        return this.$message.error('获取当前分类失败！')
      this.editCate = res.data
    },
    //确定编辑分类
    async ToeditCate() {
      this.$refs.editCateRef.validate(async val => {
        if (!val) return
        const { data: res } = await this.$http.put(
          'categories/' + this.editCate.cat_id,
          { cat_name: this.editCate.cat_name }
        )
        if (res.meta.status != 200) return this.$message.error('编辑失败!')
        this.editcatedialogVisible = false
        this.$message.success('编辑成功！')
        this.getcateList()
      })
    },
    //删除选中的分类
    async deleteCate(role) {
      const deleteC = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if(deleteC != 'confirm') return this.$message.info('已取消删除！')

      const {data:res} =await this.$http.delete('categories/'+role.cat_id)
      if(res.meta.status!=200) return this.$message.error('删除失败!')
      this.$message.success('删除成功!')
      this.getcateList()
    }
  }
}
</script>

<style lang="less">
.el-cascader {
  width: 100%;
}
</style>
