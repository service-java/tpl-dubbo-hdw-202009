<template>
  <el-dialog
    title="消息"
    :visible.sync="dialogVisible"
    width="80%"
    modal-append-to-body
  >
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="未读" name="first">
        <div class="mod-config">
          <el-form :inline="true" :model="dataForm">
            <el-form-item>
              <el-button v-if="isAuth('sms/smsRecord/update')" type="primary" @click="handleUpdateMsgStatus()"
                         :disabled="dataListSelections.length <= 0">批量已读
              </el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="dataList"
            border
            v-loading="dataListLoading"
            @selection-change="selectionChangeHandle"
            style="width: 100%;">
            <el-table-column
              type="selection"
              header-align="center"
              align="center"
              width="50">
            </el-table-column>
            <el-table-column
              prop="userName"
              header-align="center"
              align="center"
              label="账号">
            </el-table-column>
            <el-table-column
              prop="title"
              header-align="center"
              align="center"
              label="消息标题">
            </el-table-column>
            <el-table-column
              prop="content"
              header-align="center"
              align="center"
              show-overflow-tooltip
              label="消息内容">
            </el-table-column>
            <el-table-column
              prop="smsTime"
              header-align="center"
              align="center"
              label="要求推送时间">
            </el-table-column>
            <el-table-column
              prop="pushTime"
              header-align="center"
              align="center"
              label="实际推送时间">
            </el-table-column>
            <el-table-column
              prop="status"
              header-align="center"
              align="center"
              label="状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status === 0" size="small">待推送</el-tag>
                <el-tag v-else-if="scope.row.status === 1" size="small">推送成功</el-tag>
                <el-tag v-else-if="scope.row.status === 2" size="small" type="danger">推送失败</el-tag>
                <el-tag v-else-if="scope.row.status === 3" size="small">已读</el-tag>
                <el-tag v-else size="small" type="danger">禁用</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              width="150"
              label="操作">
              <template slot-scope="scope">
                <el-button v-if="isAuth('sms/smsRecord/update')" type="text" size="small"
                           @click="handleUpdateMsgStatus(scope.row.id)">
                  <i class="el-icon-check"></i></el-button>
              </template>
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
        </div>
      </el-tab-pane>
      <el-tab-pane label="全部" name="second">
        <div class="mod-config">
          <el-form :inline="true" :model="dataForm">
            <el-form-item>
              <el-input v-model="dataForm.userName" placeholder="用户名" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-date-picker clearable
                              v-model="dataForm.startTime"
                              type="datetime"
                              placeholder="选择日期"
                              format="yyyy-MM-dd HH:mm:ss"
                              value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-date-picker clearable
                              v-model="dataForm.endTime"
                              type="datetime"
                              placeholder="选择日期"
                              format="yyyy-MM-dd HH:mm:ss"
                              value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button @click="getDataList(1)">查询</el-button>
              <el-button v-if="isAuth('sms/smsRecord/update')" type="danger" @click="deleteHandle()"
                         :disabled="dataListSelections.length <= 0">批量删除
              </el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="dataList"
            border
            v-loading="dataListLoading"
            @selection-change="selectionChangeHandle"
            style="width: 100%;">
            <el-table-column
              type="selection"
              header-align="center"
              align="center"
              width="50">
            </el-table-column>
            <el-table-column
              prop="userName"
              header-align="center"
              align="center"
              label="账号">
            </el-table-column>
            <el-table-column
              prop="title"
              header-align="center"
              align="center"
              label="消息标题">
            </el-table-column>
            <el-table-column
              prop="content"
              header-align="center"
              align="center"
              show-overflow-tooltip
              label="消息内容">
            </el-table-column>
            <el-table-column
              prop="smsTime"
              header-align="center"
              align="center"
              label="要求推送时间">
            </el-table-column>
            <el-table-column
              prop="pushTime"
              header-align="center"
              align="center"
              label="实际推送时间">
            </el-table-column>
            <el-table-column
              prop="status"
              header-align="center"
              align="center"
              label="状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status === 0" size="small">待推送</el-tag>
                <el-tag v-else-if="scope.row.status === 1" size="small">推送成功</el-tag>
                <el-tag v-else-if="scope.row.status === 2" size="small" type="danger">推送失败</el-tag>
                <el-tag v-else-if="scope.row.status === 3" size="small">已读</el-tag>
                <el-tag v-else size="small" type="danger">禁用</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              width="150"
              label="操作">
              <template slot-scope="scope">
                <el-button v-if="isAuth('sms/smsRecord/update')" type="text" size="small"
                           @click="deleteHandle(scope.row.id)">
                  <i class="el-icon-delete"></i></el-button>
              </template>
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
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
    export default {
      data () {
        return {
          dataForm: {
            userName: '',
            startTime: '',
            endTime: '',
            userId: '',
            status: 0
          },
          dataList: [],
          pageIndex: 1,
          pageSize: 10,
          totalPage: 0,
          dataListLoading: false,
          dataListSelections: [],
          dialogVisible: false,
          activeName: 'first'
        }
      },
      components: {},
      computed: {
        userId: {
          get () {
            return this.$store.state.user.id
          }
        }
      },
      activated () {
      },
      methods: {
        init () {
          this.dialogVisible = true
          this.activeName = 'first'
          this.dataForm.userId = this.userId
          this.dataForm.status = -1
          this.getDataList(1)
        },
            // 获取数据列表
        getDataList (pageIndex) {
          if (pageIndex) {
            this.pageIndex = pageIndex
          }
          this.dataListLoading = true
          this.$http({
            url: this.$http.adornUrl('/sms/smsRecord/list'),
            method: 'get',
            params: this.$http.adornParams({
              'page': this.pageIndex,
              'limit': this.pageSize,
              'userName': this.dataForm.userName,
              'startTime': this.dataForm.startTime,
              'endTime': this.dataForm.endTime,
              'userId': this.dataForm.userId,
              'status': this.dataForm.status
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataList = data.page.list
              this.totalPage = data.page.totalCount
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
            // 多选
        selectionChangeHandle (val) {
          this.dataListSelections = val
        },
            // 删除
        deleteHandle (id) {
          var ids = id ? [id] : this.dataListSelections.map(item => {
            return item.id
          })
          this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http({
              url: this.$http.adornUrl('/sms/smsRecord/delete'),
              method: 'post',
              data: this.$http.adornData(ids, false)
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.getDataList()
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          })
        },
            // 已读
        handleUpdateMsgStatus (id) {
          var ids = id ? [id] : this.dataListSelections.map(item => {
            return item.id
          })
          this.$http({
            url: this.$http.adornUrl('/sms/smsRecord/updateStatus'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        },
            // tab切换
        handleClick (tab, event) {
          this.dataForm.userId = this.userId
          if (tab.name === 'first') {
            this.dataForm.status = -1
          } else {
            this.dataForm.status = 0
          }
          this.getDataList(1)
        }
      }
    }
</script>
