<template>
  <div class="app-container">
    <!--<el-data :inline="true" style="float:left;margin-left: 3%">
      <el-data-item>
        <el-input
          v-model="searchValue"
          size="small"
          placeholder="输入权限名"
          prefix-icon="el-icon-search"
          clearable
          @input="getRecords"
        />
      </el-data-item>
      <el-data-item>
        &lt;!&ndash;        <el-button size="small" type="success" @click="searchFile">搜索</el-button>&ndash;&gt;
        <el-button size="small" @click="clearSearch">重置</el-button>
      </el-data-item>
    </el-data>-->
    <el-form :inline="true" style="float:right;margin-right: 2%;">
      <el-form-item>
        <el-button type="success" size="small" @click="addRecord">新建权限</el-button>
        <el-button type="danger" size="small" :disabled="recordsSelections.length<=0" @click="deleteAll()">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="data"
      row-key="id"
      style="width: 100%;"
      :cell-style="{paddingTop:'10px',paddingBottom:'10px'}"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :default-sort="{prop: 'seq', order: 'descending'}"
      @selection-change="selectionChangeHandle"
    >
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50"
      />
      <el-table-column
        header-align="left"
        align="left"
        width="220"
        label="权限名称"
      >
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column
        header-align="left"
        align="left"
        width="120"
        label="权限url"
      >
        <template slot-scope="scope">
          {{ scope.row.url }}
        </template>
      </el-table-column>
      <el-table-column
        header-align="left"
        align="left"
        width="120"
        label="权限编码"
      >
        <template slot-scope="scope">
          {{ scope.row.perm }}
        </template>
      </el-table-column>
      <el-table-column
        header-align="left"
        align="left"
        width="100"
        label="类型"
      >
        <template slot-scope="scope">
          <el-tag :type="getTypeTag(scope.row.type)">{{ scope.row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        header-align="left"
        align="left"
        width="100"
        label="优先度"
        sortable
        prop="seq"
      />
      <el-table-column
        header-align="center"
        align="center"
        width="100"
        label="创建时间"
      >
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="100"
        label="更新时间"
      >
        <template slot-scope="scope">
          {{ scope.row.updateTime }}
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="50"
        label="状态"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="有效"
            inactive-value="无效"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="updateStatus(scope.$index,scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="300"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button type="success" plain size="small" @click="addChildRecord(scope.row)">添加子权限</el-button>
          <el-button type="warning" plain size="small" @click="updateRecord(scope.row)">编辑</el-button>
          <el-button type="danger" plain size="small" @click="deleteOne(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button @click="test" />
    <permInfo v-if="permInfoVisible" ref="permInfo" @refreshList="getRecords" />
  </div>
</template>

<script>
import { getPermList, updatePermStatus, deletePerms } from '@/api/perm'
import { hasPerm } from '@/utils/auth'
import permInfo from './permInfo'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  components: {
    permInfo
  },
  data() {
    return {
      field: 'name',
      searchValue: '',
      list: null,
      listLoading: false,
      data: [],
      recordsSelections: '',
      permInfoVisible: false
    }
  },
  created() {
    this.getRecords()
  },
  methods: {
    getRecords() {
      console.log('perm:' + hasPerm(this.$store.getters.perms, 'list1'))
      this.listLoading = true
      const params = {}
      if (this.searchValue !== '') {
        params[this.field] = this.searchValue
      }
      getPermList().then(response => {
        console.log(response)
        this.permList = response.data
        this.data = response.data
        this.listLoading = false
      })
    },
    selectionChangeHandle(val) {
      this.recordsSelections = val
    },
    handleSizeChange(val) {
      this.data.size = val
      this.getRecords()
    },
    handleCurrentChange(val) {
      this.data.current = val
      this.getRecords()
    },
    updateStatus(index, row) {
      console.log('update' + row.id + ' ' + row.status)
      updatePermStatus(row.id, row.status).then(response => {
        if (response.code !== 4001) {
          this.permList[index].status = row.status === '有效' ? '无效' : '有效'
        }
      })
    },
    clearSearch() {
      this.searchValue = ''
      this.getRecords()
    },
    getRecordDetail(record) {},
    updateRecord(record) {
      this.permInfoVisible = true
      setTimeout(() => { this.$refs.permInfo.init1('update', this.data, record) }, 10)
    },
    addRecord() {
      this.permInfoVisible = true
      setTimeout(() => { this.$refs.permInfo.init1('add', this.data, {}) }, 10)
    },
    addChildRecord(record) {
      this.permInfoVisible = true
      setTimeout(() => { this.$refs.permInfo.init1('add', this.data, {}, record.id) }, 10)
    },
    deleteOne(record) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePerms({ permIds: record.id }).then(resp => {
          if (resp.code === 4001) {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            })
            this.getRecords()
          }
        })
      })
    },
    deleteAll() {
      console.log(this.recordsSelections)
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.ListLoading = true
        const idList = []
        for (const item of this.recordsSelections) {
          idList.push(item.id)
        }
        console.log(idList.join(','))
        deletePerms({ permIds: idList.join(',').toString() }).then(resp => {
          if (resp.code === 4001) {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            })
            this.getRecords()
          } else {
            this.$message({
              message: '删除失败',
              type: 'error',
              duration: 1000
            })
          }
          this.ListLoading = false
        })
      })
    },
    addUser() {},
    test() {
      hasPerm('sys')
    },
    getTypeTag(type) {
      switch (type) {
        case '按钮': return 'success'
        case '菜单': return 'primary'
        case '数据': return 'info'
      }
    }
  }
}
</script>
