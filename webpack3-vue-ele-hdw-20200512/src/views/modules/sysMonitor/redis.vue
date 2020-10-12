<template>
  <div class="mod-echarts">
    <el-row :gutter="20">
      <el-col :span="12">
        <div id="redisUse" class="chart-box"></div>
      </el-col>
      <el-col :span="12">
        <div id="redisNum" class="chart-box"></div>
      </el-col>
      <el-col :span="24">
        <span style="font-size: 16px;">Redis 详细信息</span>
        <el-table :data="dataList">
          <el-table-column prop="key" label="Key" align="center">
          </el-table-column>
          <el-table-column prop="description" label="Description" align="center">
          </el-table-column>
          <el-table-column prop="value" label="Value" align="center">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {toTime} from '@/utils/index'
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  data () {
    return {
      chartMemory: null,
      chartKey: null,
      timer: null,
      dataList: [],
      key: {
        time: [],
        value: []
      },
      memory: {
        time: [],
        value: []
      },
      url: {
        keysSize: '/actuator/redis/keysSize',
        memoryInfo: '/actuator/redis/memoryInfo',
        info: '/actuator/redis/info'
      }
    }
  },
  mounted () {
    this.initChart()
  },
  activated () {
    this.openTimer()
    // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
    if (this.chartMemory) {
      this.chartMemory.resize()
    }
    if (this.chartKey) {
      this.chartKey.resize()
    }
  },
  deactivated () {
    this.closeTimer()
  },
  methods: {
    openTimer () {
      var t = this
      this.getTable()
      this.getKeys()
      this.getMemory()
      this.closeTimer()
      this.timer = setInterval(() => {
        t.getKeys()
        t.getMemory()
      }, 3000)
    },

    /** 关闭定时器 */
    closeTimer () {
      if (this.timer) clearInterval(this.timer)
    },
    cutToSix (array, newitem) {
      if (array.length > 5) {
        array.splice(0, 1)
      }
      array.push(newitem)
    },
    getKeys () {
      this.$nextTick(() => {
        this.$http({
          url: this.$http.adornUrl('/actuator/redis/keysSize'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          console.log(data)
          this.cutToSix(this.key.time, toTime(data.create_time))
          this.cutToSix(this.key.value, data.dbSize)
          this.initChartKey()
        })
      })
    },
    getMemory () {
      this.$nextTick(() => {
        this.$http({
          url: this.$http.adornUrl('/actuator/redis/memoryInfo'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          console.log(data)
          this.cutToSix(this.memory.time, toTime(data.create_time))
          this.cutToSix(this.memory.value, (data.used_memory / 1024).toFixed(2))
          this.initChartMemory()
        })
      })
    },
    getTable () {
      this.$nextTick(() => {
        this.$http({
          url: this.$http.adornUrl('/actuator/redis/info'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.data
          }
        })
      })
    },
    getDataList () {
      this.getKeys()
      this.getMemory()
      this.getTable()
    },
    initChart () {
      this.chartKey = echarts.init(document.getElementById('redisUse'))
      this.chartMemory = echarts.init(document.getElementById('redisNum'))
    },
    initChartMemory () {
      var option = {
        title: {
          text: 'Redis 内存实时占用情况（KB）'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: ['10px', '10px'],
          'data': this.memory.time
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'line',
            stack: '总量',
            itemStyle: {
              normal: {
                color: '#1890ff'
              }
            },
            lineStyle: {
              normal: {
                color: '#1890ff',
                width: 5
              }
            },
            areaStyle: {
              normal: {
                color: 'rgba(24, 144, 255, 0.8)'
              }
            },
            'data': this.memory.value
          }
        ]
      }
      this.chartMemory.setOption(option)
      window.addEventListener('resize', () => {
        this.chartMemory.resize()
      })
    },
    initChartKey () {
      var option = {
        title: {
          text: 'Redis Key 实时数量（个）'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: ['10px', '10px'],
          data: this.key.time
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'line',
            stack: '总量',
            itemStyle: {
              normal: {
                color: '#DB7093'
              }
            },
            lineStyle: {
              normal: {
                color: '#DB7093',
                width: 5
              }
            },
            areaStyle: {
              normal: {
                color: 'rgba(219,112,147, 0.8)'
              }
            },
            'data': this.key.value
          }
        ]
      }
      this.chartKey.setOption(option)
      window.addEventListener('resize', () => {
        this.chartKey.resize()
      })
    }
  }
}
</script>

<style scoped>
  .chart-box {
    min-height: 400px;
  }
</style>
