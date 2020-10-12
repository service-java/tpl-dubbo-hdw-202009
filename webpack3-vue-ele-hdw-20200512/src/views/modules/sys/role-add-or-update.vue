<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="description">
        <el-input v-model="dataForm.description" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="seq">
        <el-input v-model="dataForm.seq" controls-position="right" :min="0" placeholder="排序"></el-input>
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">正常</el-radio>
          <el-radio :label="1">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item size="mini" label="授权">
        <el-tree
          :data="menuList"
          :props="menuListTreeProps"
          node-key="id"
          ref="menuListTree"
          :default-expand-all="false"
          show-checkbox>
        </el-tree>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
    import {treeDataTranslate} from '@/utils'

    export default {
      data () {
        return {
          visible: false,
          menuList: [],
          resourceIdTree: [],
          menuListTreeProps: {
            label: 'name',
            children: 'children'
          },
          dataForm: {
            id: 0,
            name: '',
            description: '',
            seq: '',
            status: 0
          },
          dataRule: {
            name: [
                        {required: true, message: '角色名称不能为空', trigger: 'blur'}
            ],
            seq: [
                        {required: true, message: '排序不能为空', trigger: 'blur'}
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
            this.menuList = []
            this.resourceIdTree = []
            this.$http({
              url: this.$http.adornUrl('/sys/menu/list'),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              this.menuList = treeDataTranslate(data.data, 'id', 'parentId')
              this.$refs.menuListTree.setCheckedNodes([])
            }).then(() => {
              if (this.dataForm.id) {
                this.$http({
                  url: this.$http.adornUrl(`/sys/role/info/${this.dataForm.id}`),
                  method: 'get',
                  params: this.$http.adornParams()
                }).then(({data}) => {
                  if (data && data.code === 0) {
                    this.dataForm.name = data.data.name
                    this.dataForm.seq = data.data.seq
                    this.dataForm.status = data.data.status
                    this.dataForm.description = data.data.description
                    this.$refs.menuListTree.setCheckedNodes(data.data.resourceNodeList)
                  }
                })
              }
            })
          })
        },
            // 表单提交
        dataFormSubmit () {
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              this.$http({
                url: this.$http.adornUrl(`/sys/role/${!this.dataForm.id ? 'save' : 'update'}`),
                method: 'post',
                data: this.$http.adornData({
                  'id': this.dataForm.id || undefined,
                  'name': this.dataForm.name,
                  'description': this.dataForm.description,
                  'seq': this.dataForm.seq,
                  'status': this.dataForm.status,
                  'resourceIdList': [].concat(this.$refs.menuListTree.getCheckedKeys(), this.$refs.menuListTree.getHalfCheckedKeys())
                })
              }).then(({data}) => {
                console.log('add', data)
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
        }
      }
    }
</script>
