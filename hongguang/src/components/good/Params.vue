<template>
  <div>
    <!-- 面包屑导航头部 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        title="只允许第三极分类设置相关参数！"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <!-- 选择商品分类分类区域 -->
      <el-row class="top">
        <el-col :span="3">
          <span>选择商品分类：</span>
        </el-col>
        <el-col :span="5">
          <el-cascader
            expand-trigger="hover"
            v-model="Catechose"
            :options="CateList"
            :props="CatePros"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab页签的区域 -->
      <!-- 动态参数区域 -->
      <el-tabs v-model="activeName" type="card" @tab-click="handleCheckClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isbtnDisable"
            @click="adddialogVisible = true"
            >添加参数</el-button
          >
          <el-table :data="manyParamsData" style="width: 100%" border>
            <el-table-column type="expand">
              <template slot-scope="scopes">
                <!-- 这是Tag标签 -->
                <el-tag
                  v-for="(item, index) in scopes.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleTagClose(index, scopes.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 这是点击就增加Tag标签的按钮和input -->
                <el-input
                  class="input-new-tag first"
                  v-if="scopes.row.inputVisible"
                  v-model="scopes.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scopes.row)"
                  @blur="handleInputConfirm(scopes.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scopes.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scopes">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editParams(scopes.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(scopes.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <!-- 静态属性区域 -->
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isbtnDisable"
            @click="adddialogVisible = true"
            >添加属性</el-button
          >
          <el-table :data="onlyParamsData" style="width: 100%" border>
            <el-table-column type="expand">
              <template slot-scope="scopes">
                <!-- 这是Tag标签 -->
                <el-tag
                  v-for="(item, index) in scopes.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleTagClose(index, scopes.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 这是点击就增加Tag标签的按钮和input -->
                <el-input
                  class="input-new-tag first"
                  v-if="scopes.row.inputVisible"
                  v-model="scopes.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scopes.row)"
                  @blur="handleInputConfirm(scopes.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scopes.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scopes">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editParams(scopes.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(scopes.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加属性的弹出框 -->
    <el-dialog
      :title="'添加' + Getactive"
      :visible.sync="adddialogVisible"
      width="50%"
      @close="addformClear"
    >
      <el-form
        :model="addform"
        :rules="addformRules"
        ref="addformRef"
        label-width="100px"
      >
        <el-form-item :label="Getactive" prop="attr_name">
          <el-input v-model="addform.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="Toaddform">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑的弹出框 -->
    <el-dialog
      :title="'编辑' + Getactive"
      :visible.sync="editdialogVisible"
      width="50%"
      @close="editformClear"
    >
      <el-form
        :model="editform"
        :rules="editformRules"
        ref="editformRef"
        label-width="100px"
      >
        <el-form-item :label="Getactive" prop="attr_name">
          <el-input v-model="editform.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="Toeditform">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //获取所有商品列表的分类
      CateList: [],
      //选中后的数组
      Catechose: [],
      //级联的条件：
      CatePros: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //默认选择的页签
      activeName: 'many',
      //动态参数列表
      manyParamsData: [],
      //静态属性列表
      onlyParamsData: [],
      // 添加公用的弹出框
      adddialogVisible: false,
      //添加的商品属性，可静态，可动态
      addform: {
        attr_name: ''
      },
      //验证规则
      addformRules: {
        attr_name: [
          { required: true, message: '请输入要修改的值', trigger: 'blur' }
        ]
      },
      //编辑对话框的弹出
      editdialogVisible: false,
      //要编辑的参数获属性
      editform: {
        attr_name: ''
      },
      //要编辑的认证规则
      editformRules: {
        attr_name: [
          { required: true, message: '请输入要修改的值', trigger: 'blur' }
        ]
      },
      //这是Tag点击是否显示文本框
      inputVisible: false,
      //这是input双向绑定的数据
      inputValue: ''
    }
  },
  created() {
    this.getCatelist()
  },
  computed: {
    //如果是三级为flase
    isbtnDisable() {
      if (this.Catechose.length != 3) {
        return true
      }
      return false
    },
    //获取当前选择修改商品的id号
    GetId() {
      if (this.Catechose.length != 3) {
        return null
      }
      return this.Catechose[2]
    },
    //获取当前是动态参数还是静态属性
    Getactive() {
      if (this.activeName == 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  },
  methods: {
    //获取所有商品的列表分类
    async getCatelist() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status != 200)
        return this.$message.error('请求商品分类失败！')
      this.CateList = res.data
    },
    //选择分类变化调用此函数
    async handleChange() {
      //判断是否选择了三级分类
      if (this.Catechose.length != 3) {
        this.Catechose = []
        this.manyParamsData = []
        this.onlyParamsData = []
        return
      }
      this.Togetparams()
    },
    //这是改变tab页签的函数
    handleCheckClick() {
      this.Togetparams()
    },
    //获取属性（静态属性和动态参数）
    async Togetparams() {
      const { data: res } = await this.$http.get(
        `categories/${this.GetId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        item.inputValue = ''
        item.inputVisible = false
      })
      //动态挂载数据
      if (this.activeName == 'many') {
        this.manyParamsData = res.data
      } else {
        this.onlyParamsData = res.data
      }
    },
    addformClear() {
      this.$refs.addformRef.resetFields()
    },
    //添加参数或者属性
    Toaddform() {
      this.$refs.addformRef.validate(async val => {
        if (!val) return
        const { data: res } = await this.$http.post(
          `categories/${this.GetId}/attributes`,
          {
            attr_name: this.addform.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status != 201) return this.$message.error('添加失败！')
        this.$message.success('添加成功！')
        this.adddialogVisible = false
        this.Togetparams()
      })
    },
    //关闭的时候进行表单验证
    editformClear() {
      this.$refs.editformRef.resetFields()
    },
    //编辑静态或者动态
    Toeditform() {
      this.$refs.editformRef.validate(async val => {
        if (!val) return
        const { data: res } = await this.$http.put(
          `categories/${this.GetId}/attributes/${this.editform.attr_id}`,
          {
            attr_name: this.editform.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status != 200) return this.$message.error('编辑失败！')
        this.$message.success('编辑成功！')
        this.editdialogVisible = false
        this.Togetparams()
      })
    },
    //跳出编辑的对话框
    editParams(par) {
      this.editdialogVisible = true
      this.editform = par
    },
    //删除参数或者属性
    async deleteParams(par) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult != 'confirm')
        return this.$message.info('已经取消删除！')
      const { data: res } = await this.$http.delete(
        `categories/${this.GetId}/attributes/${par.attr_id}`
      )
      if (res.meta.status != 200) return this.$message.error('删除失败！')
      this.$message.success('删除成功！')
      this.Togetparams()
    },
    //删除标签
    handleTagClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAtterVals(row)
    },
    //这是点击Tag新增的数据框之后，以及按下enter键之后触发的事件
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length == 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      //有输入内容的时候所做的业务逻辑
      row.attr_vals.push(row.inputValue)
      row.inputValue = ''
      row.inputVisible = false

      this.saveAtterVals(row)
    },
    //点击按钮实现Tag标签和输入的显示切换
    showInput(row) {
      row.inputVisible = true
      // 让文本框自动获取焦点
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    //操作attr_vals中的数据
    async saveAtterVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.GetId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(',')
        }
      )
      if (res.meta.status !== 200) return this.$message.error('编辑失败！')
      this.$message.success('编辑成功！')
    }
  }
}
</script>
>
<style lang="less">
.top {
  margin-top: 15px;
  text-align: center;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.el-tag {
  margin: 5px;
}
.input-new-tag.first {
  width: 90px;
  margin-left: 10px;
  display: inline-block;
}
</style>
