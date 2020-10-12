<template>
    <div>
      <div style="font-size: 16px;padding: 5px 5px 20px;">磁盘监控</div>
      <el-divider class="disk-divider"></el-divider>
      <div id="disk" class="disk"></div>
    </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data () {
    return {
      diskRate: 0,
      gauge: null
    }
  },
  mounted () {
    this.initGauge()
  },
  activated () {
    this.getData()
  },
  methods: {
    getData () {
      this.$nextTick(() => {
        this.$http({
          url: this.$http.adornUrl('/actuator/health'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          console.log(data.components)
          var free = data.components.diskSpace.details.free
          var total = data.components.diskSpace.details.total
          this.diskRate = ((free / total) * 100).toFixed(2)
          console.log('rate-' + this.diskRate)
          this.drawGuage()
        })
      })
    },
    drawGuage () {
      var option = {
        'series': [
          {
            name: 'gauge',
            type: 'gauge',
            center: ['50%', '50%'],
            radius: '75%',
            max: '100',
            axisLine: {
              lineStyle: {
                color: [[1, '#0099FF']],
                width: 18
              }
            },
            pointer: {
              width: 5,
              length: '70%'
            },
            splitLine: {
              show: false
            },
            axisTick: {
              splitNumber: 5,
              length: 23,
              lineStyle: {
                color: 'auto'
              }
            },
            axisLabel: {
              textStyle: {
                fontSize: 12
              },
              distance: 0
            },
            title: {
              show: false
            },
            detail: {
              show: true,
              formatter: '{value}%',
              offsetCenter: [0, '60%'],
              textStyle: {
                fontSize: 32,
                color: '#333333'
              }
            },
            data: [this.diskRate]
          }
        ]
      }
      this.gauge.setOption(option)
    },
    initGauge () {
      this.gauge = echarts.init(document.getElementById('disk'))
    }
  }
}
</script>

<style scoped>
.disk {
  min-height: 400px;
  max-width: 400px;
}
  .disk-divider {
    margin: 0 -20px;
  }
</style>
