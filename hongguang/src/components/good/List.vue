/* eslint-disable vue/no-unused-vars */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20" class="btn">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable @clear='getGoodsList' v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="goodList" border>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）" width="120">
        </el-table-column>
        <el-table-column prop="goods_number" label="商品数量" width="80">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80">
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template slot-scope="slot">
            {{ slot.row.add_time | dateformat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="slot">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteById(slot.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      goodList: [],
      //获取数据的总条数
      total: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    //获取商品列表的信息
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status != 200) {
        return this.$message.error('获取信息列表失败！' + res.meta.msg)
      }
      this.$message.success('获取信息列表成功！')
      this.goodList = res.data.goods
      this.total = res.data.total
    },
    //页码条数发生改变
    handleSizeChange(newsize){
      this.queryInfo.pagesize = newsize
      this.getGoodsList()
    },
    //当前页码发生改变
    handleCurrentChange(newnum){
        this.queryInfo.pagenum = newnum
        this.getGoodsList()
    },
    //删除商品
    async deleteById(id){
       const result = await  this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

      if(result!='confirm'){
        return this.$message.info('已取消删除!')
      }
     const {data:res} =  await this.$http.delete(`goods/${id}`)
     if(res.meta.status!=200){
       return this.$message.error('删除失败！')
     }
      this.$message.success('删除成功！')
      this.getGoodsList()
    },
    //跳转到添加商品
    addPage(){
      this.$router.push('/home/goods/add')
    }
  }
}
</script>
<style lang="less" scoped></style>
