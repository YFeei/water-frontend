<template >
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <div style="width: 70%">
      <el-form ref="form" :model="data" :rules="rules" label-width="100px">
        <el-form-item label="公司名称" prop="name">
          <el-input
            v-model="data.name"
            placeholder="请输入公司名称"
          />
        </el-form-item>
        <el-form-item label="详细地址" prop="addr">
          <el-input
            v-model="data.addr"
            placeholder="请输入公司地址"
          />
        </el-form-item>
        <el-form-item label="负责人" prop="manager">
          <el-input
            v-model="data.manager"
            placeholder="请输入负责人名称"
          />
        </el-form-item>
        <el-form-item
          label="联系电话"
          prop="telephone"
        >
          <el-input
            v-model="data.telephone"
            type="tel"
            placeholder="请输入负责人电话"
          />
        </el-form-item>
        <el-form-item v-if="mode==='update'" label="状态">
          <el-switch
            v-model="data.status"
            active-value="有效"
            inactive-value="无效"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="data.remark"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close" >关闭</el-button>
      <el-button type="primary" @click="addOrUpdateComp('form')">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { addComp, updateComp } from '../../api/comp'

export default {
  data() {
    // eslint-disable-next-line no-unused-vars
    var checkPhone = (rule, value, callback) => {
      const phoneReg = /^1[34578]\d{9}$$/
      if (!value) {
        return callback(new Error('电话号码不能为空'))
      }
      setTimeout(() => {
        // Number.isInteger是es6验证数字是否为整数的方法,实际输入的数字总是识别成字符串
        // 所以在前面加了一个+实现隐式转换

        if (!Number.isInteger(+value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (phoneReg.test(value)) {
            callback()
          } else {
            callback(new Error('电话号码格式不正确'))
          }
        }
      }, 100)
    }
    return {
      mode: 'add',
      title: '添加公司',
      visible: true,
      data: {
        name: '',
        status: 'true'
      },
      rules: {
        name: [
          { required: true, message: '请输入公司名称', trigger: 'blur' },
          { min: 3, message: '长度至少 3 个字符', trigger: 'blur' }
        ],
        addr: [
          { required: true, message: '请输入公司详细地址', trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '请输入负责人', trigger: 'blur' }
        ],
        telephone: [
          { validator: checkPhone, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(mode, data) {
      // 用来进行界面的初始化
      console.log('进行compInfo界面的初始化')
      this.mode = mode
      this.visible = true
      if (mode === 'update') {
        this.title = '编辑公司'
        this.data = data
      } else {
        this.title = '添加公司'
        // this.data = { status: 'true' }
        this.data = {
          name: '',
          status: 'true'
        }
      }
    },
    close() {
      this.$emit('refreshList')
      this.visible = false
    },
    addOrUpdateComp(form) {
      // 先检验，确定没有违反relus，再进行下面的具体操作
      this.$refs[form].validate((valid) => {
        console.log(valid)
        if (valid) {
          if (this.mode === 'add') {
            this.addComp()
          } else {
            this.updateComp()
          }
        } else {
          console.log('error submit!!')
        }
      })
    },
    addComp() {
      addComp(this.data).then(response => {
        if (response.code === 4001) {
          this.$message({
            message: '添加成功',
            type: 'success',
            duration: 1000
          })
          this.close()
        } else {
          this.$message({
            message: '添加公司失败',
            type: 'error',
            duration: 1000
          })
        }
      })
    },
    updateComp() {
      updateComp(this.data).then(response => {
        if (response.code === 4001) {
          this.$message({
            message: '更新成功',
            type: 'success',
            duration: 1000
          })
          this.close()
        } else {
          this.$message({
            message: '更新公司失败',
            type: 'error',
            duration: 1000
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
