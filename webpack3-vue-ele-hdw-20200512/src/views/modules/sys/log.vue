<template>
  <div class="mod-log">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="登录日志" name="first">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item>
            <el-input v-model="dataForm.key" placeholder="用户名／类名" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="tempDate"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              align="right">
            </el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-button @click="getDataList()">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          style="width: 100%">
          <el-table-column
            prop="loginName"
            header-align="center"
            align="center"
            label="用户名">
          </el-table-column>
          <el-table-column
            prop="logType"
            header-align="center"
            align="center"
            label="日志类型">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.logType === 1" size="small">登录日志</el-tag>
              <el-tag v-else size="small" type="info">操作日志</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="logContent"
            header-align="center"
            align="center"
            label="日志内容">
          </el-table-column>
          <el-table-column
            prop="method"
            header-align="center"
            align="center"
            width="150"
            :show-overflow-tooltip="true"
            label="请求方法">
          </el-table-column>
          <el-table-column
            prop="className"
            header-align="center"
            align="center"
            width="150"
            :show-overflow-tooltip="true"
            label="请求类名">
          </el-table-column>
          <el-table-column
            prop="params"
            header-align="center"
            align="center"
            width="150"
            :show-overflow-tooltip="true"
            label="请求参数">
          </el-table-column>
          <el-table-column
            prop="time"
            header-align="center"
            align="center"
            label="执行时长(毫秒)">
          </el-table-column>
          <el-table-column
            prop="clientIp"
            header-align="center"
            align="center"
            width="150"
            label="IP地址">
          </el-table-column>
          <el-table-column
            prop="createTime"
            header-align="center"
            align="center"
            width="180"
            label="创建时间">
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="操作日志" name="second">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item>
            <el-input v-model="dataForm.key" placeholder="用户名／类名" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList()">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          style="width: 100%">
          <el-table-column
            prop="loginName"
            header-align="center"
            align="center"
            label="用户名">
          </el-table-column>
          <el-table-column
            prop="logType"
            header-align="center"
            align="center"
            label="操作类型">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.logType === 1" size="small">登录日志</el-tag>
              <el-tag v-else size="small" type="info">操作日志</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="logContent"
            header-align="center"
            align="center"
            label="日志内容">
          </el-table-column>
          <el-table-column
            prop="method"
            header-align="center"
            align="center"
            width="150"
            :show-overflow-tooltip="true"
            label="请求方法">
          </el-table-column>
          <el-table-column
            prop="className"
            header-align="center"
            align="center"
            width="150"
            :show-overflow-tooltip="true"
            label="请求类名">
          </el-table-column>
          <el-table-column
            prop="params"
            header-align="center"
            align="center"
            width="150"
            :show-overflow-tooltip="true"
            label="请求参数">
          </el-table-column>
          <el-table-column
            prop="time"
            header-align="center"
            align="center"
            label="执行时长(毫秒)">
          </el-table-column>
          <el-table-column
            prop="clientIp"
            header-align="center"
            align="center"
            width="150"
            label="IP地址">
          </el-table-column>
          <el-table-column
            prop="createTime"
            header-align="center"
            align="center"
            width="180"
            label="创建时间">
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
    export default {
        data () {
            return {
                dataForm: {
                    key: '',
                    logType: 1,
                    startTime: '',
                    endTime: ''
                },
                activeName: 'first',
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick (picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick (picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick (picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                tempDate: '',
                dataList: [],
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                dataListLoading: false,
                selectionDataList: []
            }
        },
        created () {
            this.getDataList()
        },
        methods: {
            // 获取数据列表
            getDataList () {
                if (this.tempDate.length > 0) {
                    this.dataForm.startTime = this.tempDate[0]
                    this.dataForm.endTime = this.tempDate[1]
                }
                this.dataListLoading = true
                this.activeName = 'first'
                this.$http({
                    url: this.$http.adornUrl('/sys/log/list'),
                    method: 'get',
                    params: this.$http.adornParams({
                        'page': this.pageIndex,
                        'limit': this.pageSize,
                        'key': this.dataForm.key,
                        'logType': this.dataForm.logType,
                        'startTime': this.dataForm.startTime,
                        'endTime': this.dataForm.endTime
                    })
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        this.dataList = data.data.list
                        this.totalPage = data.data.totalCount
                    } else {
                        this.dataList = []
                        this.totalPage = 0
                    }
                    this.dataListLoading = false
                })
            },
            // 每页数
            sizeChangeHandle (val) {
                this.pageSize = val
                this.pageIndex = 1
                this.getDataList()
            },
            // 当前页
            currentChangeHandle (val) {
                this.pageIndex = val
                this.getDataList()
            },
            // tab切换
            handleClick (tab, event) {
                if (tab.name === 'first') {
                    this.dataForm.logType = 1
                    this.tempDate = []
                    this.dataForm.startTime = ''
                    this.dataForm.endTime = ''
                    this.getDataList()
                } else if (tab.name === 'second') {
                    this.dataForm.logType = 0
                    this.tempDate = []
                    this.dataForm.startTime = ''
                    this.dataForm.endTime = ''
                    this.getDataList()
                }
            }
        }
    }
</script>
