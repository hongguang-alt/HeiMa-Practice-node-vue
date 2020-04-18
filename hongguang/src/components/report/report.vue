<template>
  <div>
    <!-- 面包屑导航头部 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <div id="main" style="width: 1000px;height:550px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data() {
    return {
        options: {
            title: {
                text: '用户来源'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#E9EEF3'
                }
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                boundaryGap: false
                }
            ],
            yAxis: [
                {
                type: 'value'
                }
            ]
      }
    }
  },
 async mounted() {
    var myChart = echarts.init(document.getElementById('main'))

    const { data:res } = await this.$http.get('reports/type/1')

    const option =  _.merge(res.data,this.options)
    
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  }
}
</script>

<style lang="less" scoped></style>
