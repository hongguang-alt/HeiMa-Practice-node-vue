<template>
  <div>
    <!-- 面包屑导航头部 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品添加</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-steps
        :space="300"
        :active="activeIndex - 0"
        finish-status="success"
        align-center=""
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="150px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat" label-width="150px">
              <el-cascader
                expand-trigger="hover"
                :options="cateList"
                v-model="addForm.goods_cat"
                @change="handleChange"
                :props="cateProps"
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="(item, index) in manyTableData"
              :key="index"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="it"
                  v-for="(it, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="(item, index) in onlyTableData"
              :key="index"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :action="picURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headers"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
             <el-button type='primary' class='addbtn' @click="addCate">添加商品</el-button>
          </el-tab-pane>
         
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 预览窗口 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="50%"
    >
    <img :src="previewImg" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  data() {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        pics: [],
        goods_introduce:'',
        attrs:[]
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ]
      },
      //获取商品的列表
      cateList: [],
      //商品分类的配置
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //当前选中商品的动态参数
      manyTableData: [],
      //当前选中商品分类的动态属性
      onlyTableData: [],
      //上传图片的地址
      picURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      //设置上传图片的头部
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      },
      //设置预览图片的路径
      previewImg: '',
      //显示预览的界面
      previewVisible:false
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length == 3) {
        return this.addForm.goods_cat[2]
      } else {
        return null
      }
    }
  },
  methods: {
    //获取商品列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status != 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.cateList = res.data
    },
    //选择三级商品
    handleChange() {
      if (this.addForm.goods_cat.length != 3) {
        this.addForm.goods_cat = []
      }
    },
    //切换标签的钩子函数
    beforeLeave(activeName, oldActiveName) {
      if (oldActiveName == '0' && this.addForm.goods_cat.length != 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    //判断是否选择 1 的界面
    async tabClick() {
      if (this.activeIndex == '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: 'many'
            }
          }
        )
        if (res.meta.status != 200) {
          return this.$message.error(res.meta.msg)
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.split(',')
        })
        this.manyTableData = res.data
        console.log(this.manyTableData)
      } else if (this.activeIndex == '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        if (res.meta.status != 200) {
          return this.$message.error('获取静态数据失败！')
        }
        console.log(res.data)
        this.onlyTableData = res.data
      }
    },
    //点击图片已上传的文件的钩子
    handlePreview(data) {
      console.log(data)
      this.previewImg = data.response.data.url
      this.previewVisible = true
    },
    //文件列表移出文件的钩子
    handleRemove(data) {
      var i = this.addForm.pics.findIndex(
        x => x.pic == data.response.data.tmp_path
      )
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
    //文件上传成功的钩子
    handleSuccess(response) {
      var picInfo = {
        pic: response.data.tmp_path
      }
      this.addForm.pics.push(picInfo)
    },
    //添加商品
    addCate(){
      this.$refs.addFormRef.validate(
      async  val=>{
          if(!val){
            return this.$message.error('请填写必要的表单信息！')
          }
          var form = _.cloneDeep(this.addForm)
          form.goods_cat = form.goods_cat.join(',')
          console.log(this.manyTableData)

          //获取动态的参数
          this.manyTableData.forEach(item=>{
            var newAttr = {
              attr_id:item.attr_id,
              attr_value:item.attr_vals.join(' ')
            }
            this.addForm.attrs.push(newAttr)
          })

          //获取静态的属性
          this.onlyTableData.forEach(item=>{
            var newAttr = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            }
            this.addForm.attrs.push(newAttr)
          })
          form.attrs = this.addForm.attrs
          const { data:res } = await this.$http.post('goods',form)
          if(res.meta.status!==201){
             return this.$message.error(res.meta.msg)
          }
          this.$message.success('添加商品成功！')
          this.$router.push('/home/goods')
        })
    }
  }
}
</script>
<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg{
  width:100%;
  height:100%;
}
.addbtn{
  margin-top:15px;
}

</style>
