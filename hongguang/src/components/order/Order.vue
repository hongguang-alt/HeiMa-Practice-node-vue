<template>
  <div>
    <!-- 面包屑导航头部 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="orderList" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column
          label="订单价格"
          prop="order_price"
          width="100"
        ></el-table-column>
        <el-table-column label="是否付款" prop="is_send" width="100">
          <template slot-scope="solt">
            <el-tag type="success" v-if="solt.row.order_pay == '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="create_time" width="180">
          <template slot-scope="solt">
            {{ solt.row.create_time | dateformat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <template>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="addAddress"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showProgress"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 显示添加地址的区域 -->
      <el-dialog
        title="修改地址"
        :visible.sync="addressVisible"
        width="50%"
        @close="closeAddress"
      >
        <el-form
          :model="addressForm"
          :rules="addressrules"
          ref="addressRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="市/区" prop="address1">
            <el-cascader
              expand-trigger="hover"
              :options="citydata"
              v-model="addressForm.address1"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addressVisible = false">取 消</el-button>
          <el-button type="primary" @click="addressVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <!-- 显示物流信息的弹出框 -->
      <el-dialog
        title="查看物流信息"
        :visible.sync="progressVisible"
        width="50%"
      >
        <el-timeline >
          <el-timeline-item
            v-for="(activity, index) in progressList"
            :key="index"
            :timestamp="activity.time"
          >
            {{ activity.context}}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import citydata from '../../assets/js/citydata.js'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      orderList: [],
      //显示修改地址的信息
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressrules: {
        address1: [{ required: true, message: '请输入市/区', trigger: 'blur' }],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      citydata,
      progressVisible: false,
      progressList: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    //获取订单的数据
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status != 200) {
        return this.$message.error('获取订单数据失败！')
      }
      console.log(res.data)
      this.total = res.data.total
      this.orderList = res.data.goods
    },
    //分页时，改变每页有多少
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getOrderList()
    },
    //分页时，改变当前的页码值
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getOrderList()
    },
    //添加地址显示
    addAddress() {
      this.addressVisible = true
    },
    //关闭的时候清空写的东西
    closeAddress() {
      this.$refs.addressRef.resetFields()
    },
    //展示物流信息的对话框
    async showProgress() {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status != 200) {
        return this.$message.error('获取物流信息失败！')
      }
      this.progressList = res.data
      this.progressVisible = true
    }
  }
}
</script>
<style lang="less" scoped></style>
