<template>
    <div>
      <div class="alert-info">
        <i class="el-icon-info" style="color: #1890ff;padding: 0 5px;"></i>上次更新时间：{{time}}
        <el-divider direction="vertical"></el-divider>
        <span class="alert-info-click" @click="getDataList">立即更新</span>
      </div>
      <el-table :data="dataList">
        <el-table-column label="参数">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.name.indexOf('tomcat.sessions') > -1" type="success">{{scope.row.name}}</el-tag>
            <el-tag v-if="scope.row.name.indexOf('tomcat.global') > -1" type="warning">{{scope.row.name}}</el-tag>
            <el-tag v-if="scope.row.name.indexOf('tomcat.threads') > -1" type="primary">{{scope.row.name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description"
                         label="描述">
        </el-table-column>
        <el-table-column prop="value"
                         label="当前值">
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
import {nowTime, addUnit, toByte, toTime} from '@/utils/index'
export default {
  data () {
    return {
      dataList: [],
      time: '',
      urls: [
        {
          url: '/actuator/metrics/tomcat.sessions.created',
          unitType: 1,
          unit: '个'
        }, {
          url: '/actuator/metrics/tomcat.sessions.expired',
          unitType: 1,
          unit: '个'
        }, {
          url: '/actuator/metrics/tomcat.sessions.active.current',
          unitType: 1,
          unit: '个'
        }, {
          url: '/actuator/metrics/tomcat.sessions.active.max',
          unitType: 1,
          unit: '个'
        }, {
          url: '/actuator/metrics/tomcat.sessions.rejected',
          unitType: 1,
          unit: '个'
        }
      ]
    // '/actuator/metrics/tomcat.sessions.alive.max',
    }
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    getDataList () {
      this.dataList = []
      for (var i in this.urls) {
        this.getData(this.urls[i])
      }
    },
    getData (item) {
      this.$nextTick(() => {
        this.$http({
          url: this.$http.adornUrl(item.url),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          // console.log(data)
          var value = ''
          if (item.unitType === 1) {
            value = addUnit(data.measurements[0].value, item.unit)
          }
          if (item.unitType === 2) {
            value = toByte(data.measurements[0].value)
          }
          if (item.unitType === 3) {
            value = toTime((data.measurements[0].value) * 1000)
          }
          this.dataList.push({
            name: data.name,
            description: data.description,
            value: value
          })
        })
      })
      this.time = nowTime()
    }
  }
}
</script>

<style scoped>

</style>
