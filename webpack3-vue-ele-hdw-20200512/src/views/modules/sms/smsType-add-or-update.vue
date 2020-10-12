<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item label="类型名称" prop="typeName">
        <el-input v-model="dataForm.typeName" placeholder="类型名称"></el-input>
      </el-form-item>
      <el-form-item label="账号列表" prop="accountList">
        <el-select v-model="dataForm.accountList" multiple filterable clearable placeholder="请选择">
          <el-option
            v-for="item in userList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发送短信" prop="isSendSms">
        <el-radio-group v-model="dataForm.isSendSms">
          <el-radio :label="0">是</el-radio>
          <el-radio :label="1">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="发送邮件" prop="isSendEmail">
        <el-radio-group v-model="dataForm.isSendEmail">
          <el-radio :label="0">是</el-radio>
          <el-radio :label="1">否</el-radio>
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
            typeName: '',
            accountList: [],
            isSendSms: 1,
            isSendEmail: 1
          },
          userList: [],
          dataRule: {
            typeName: [
                        {required: true, message: '类型名称不能为空', trigger: 'blur'}
            ],
            accountList: [
                        {required: true, message: '账号列表不能为空', trigger: 'blur'}
            ],
            isSendSms: [
                        {required: true, message: '发送短信不能为空', trigger: 'blur'}
            ],
            isSendEmail: [
                        {required: true, message: '发送邮件不能为空', trigger: 'blur'}
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
            this.userList = []
            this.handleUserList()
            if (this.dataForm.id) {
              this.$http({
                url: this.$http.adornUrl(`/sms/smsType/info/${this.dataForm.id}`),
                method: 'get',
                params: this.$http.adornParams()
              }).then(({data}) => {
                if (data && data.code === 0) {
                  console.log('dataForm', data)
                  this.dataForm.typeName = data.data.typeName
                  this.dataForm.accountList = this.stringToArray(data.data.accountList[0])
                  this.dataForm.isSendSms = data.data.isSendSms
                  this.dataForm.isSendEmail = data.data.isSendEmail
                }
              })
            }
          })
        },
        stringToArray (str) {
          var array = str.split(',')
          var toArray = []
          for (var i in array) {
            toArray.push(array[i] + '')
          }
          return toArray
        },
            // 表单提交
        dataFormSubmit () {
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              this.$http({
                url: this.$http.adornUrl(`/sms/smsType/${!this.dataForm.id ? 'save' : 'update'}`),
                method: 'post',
                data: this.$http.adornData({
                  'id': this.dataForm.id || undefined,
                  'typeName': this.dataForm.typeName,
                  'accountList': this.dataForm.accountList,
                  'isSendSms': this.dataForm.isSendSms,
                  'isSendEmail': this.dataForm.isSendEmail
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
        handleUserList () {
          this.$http({
            url: this.$http.adornUrl('/sys/user/getUserTree'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              console.log('userList', data)
              this.userList = data.data
            }
          })
        }
      }
    }
</script>
