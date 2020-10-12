<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item label="消息类型" prop="smsTypeId">
        <el-select v-model="dataForm.smsTypeId" filterable clearable placeholder="请选择">
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="消息标题" prop="title">
        <el-input v-model="dataForm.title" placeholder="消息标题"></el-input>
      </el-form-item>
      <el-form-item label="消息内容" prop="content">
        <el-input v-model="dataForm.content" placeholder="消息内容"></el-input>
      </el-form-item>
      <el-form-item label="推送时间" prop="smsTime">
        <el-date-picker clearable
                        v-model="dataForm.smsTime"
                        type="datetime"
                        placeholder="选择日期"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="推送次数" prop="smsCount">
        <el-input v-model="dataForm.smsCount" placeholder="推送次数"></el-input>
      </el-form-item>
      <el-form-item label="推送间隔时间（秒）" prop="intervalTime">
        <el-input v-model="dataForm.intervalTime" placeholder="推送间隔时间（秒）"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">正常</el-radio>
          <el-radio :label="1">禁止</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
    export default {
      data () {
        return {
          visible: false,
          dataForm: {
            id: 0,
            smsTypeId: '',
            title: '',
            content: '',
            smsTime: '',
            smsCount: '',
            intervalTime: '',
            status: ''
          },
          typeList: [],
          dataRule: {
            smsTypeId: [
                        {required: true, message: '消息类型ID不能为空', trigger: 'blur'}
            ],
            title: [
                        {required: true, message: '消息标题不能为空', trigger: 'blur'}
            ],
            content: [
                        {required: true, message: '消息内容不能为空', trigger: 'blur'}
            ],
            smsTime: [
                        {required: true, message: '推送时间不能为空', trigger: 'blur'}
            ],
            smsCount: [
                        {required: true, message: '推送次数不能为空', trigger: 'blur'}
            ],
            intervalTime: [
                        {required: true, message: '推送间隔时间（秒）不能为空', trigger: 'blur'}
            ],
            status: [
                        {required: true, message: '状态不能为空', trigger: 'blur'}
            ]
          }
        }
      },
      methods: {
        init (id) {
          this.dataForm.id = id || 0
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
            this.typeList = []
            this.handleTypeList()
            if (this.dataForm.id) {
              this.$http({
                url: this.$http.adornUrl(`/sms/sms/info/${this.dataForm.id}`),
                method: 'get',
                params: this.$http.adornParams()
              }).then(({data}) => {
                if (data && data.code === 0) {
                  console.log('dataForm', data)
                  this.dataForm.smsTypeId = data.data.smsTypeId
                  this.dataForm.title = data.data.title
                  this.dataForm.content = data.data.content
                  this.dataForm.smsTime = data.data.smsTime
                  this.dataForm.smsCount = data.data.smsCount
                  this.dataForm.intervalTime = data.data.intervalTime
                  this.dataForm.status = data.data.status
                  this.dataForm.realTime = data.data.realTime
                  this.dataForm.realCount = data.data.realCount
                  this.dataForm.createTime = data.data.createTime
                  this.dataForm.updateTime = data.data.updateTime
                  this.dataForm.createUser = data.data.createUser
                  this.dataForm.updateUser = data.data.updateUser
                }
              })
            }
          })
        },
            // 表单提交
        dataFormSubmit () {
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              this.$http({
                url: this.$http.adornUrl(`/sms/sms/${!this.dataForm.id ? 'save' : 'update'}`),
                method: 'post',
                data: this.$http.adornData({
                  'id': this.dataForm.id || undefined,
                  'smsTypeId': this.dataForm.smsTypeId,
                  'title': this.dataForm.title,
                  'content': this.dataForm.content,
                  'smsTime': this.dataForm.smsTime,
                  'smsCount': this.dataForm.smsCount,
                  'intervalTime': this.dataForm.intervalTime,
                  'status': this.dataForm.status
                })
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.visible = false
                      this.$emit('refreshDataList')
                    }
                  })
                } else {
                  this.$message.error(data.msg)
                }
              })
            }
          })
        },
            // 获取用户信息
        handleTypeList () {
          this.$http({
            url: this.$http.adornUrl(`/sms/smsType/getSmsTypeTree`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              console.log('typeList', data)
              this.typeList = data.data
            }
          })
        }
      }
    }
</script>
