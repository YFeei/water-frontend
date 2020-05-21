<template>
  <div class="app-container">
    <el-form :inline="true" style="float:left;margin-left: 3%" @keyup.enter.native="searchFile">
      <el-form-item>
        <el-input
          v-model="searchValue"
          size="small"
          placeholder="输入楼栋名称"
          prefix-icon="el-icon-search"
          clearable
          @input="getRecords"
        />
      </el-form-item>
      <el-form-item>
        <el-button size="small" @click="clearSearchValue">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true" style="float: right;margin-right: 2%;">
      <el-form-item>
        <el-button type="success" size="small" @click="addBuild">添加楼栋</el-button>
        <el-button type="danger" size="small" :disabled="recordsSelections.length<=0" @click="deleteBuilds">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="data.records"
      style="width: 100%"
      :cell-style="{paddingTop:'10px', paddingBottom:'10px'}"
      @selection-change="selectionChangeHandle"
    >
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50"
      />
      <el-table-column
        header-align="center"
        align="center"
        label="楼栋名称"
        prop="name"
      />
      <el-table-column
        header-align="center"
        align="center"
        label="设备1的ID"
        prop="deviceId1"
      />
      <el-table-column
        header-align="center"
        align="center"
        label="设备2的ID"
        prop="deviceId2"
      />
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        label="设备状态"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="有效"
            inactive-value="无效"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="updateBuildStatus(scope.$index,scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="300"
        label="相关操作"
      >
        <template slot-scope="scope">
          <el-button type="primary" plain size="small" @click="getDetail(scope.row)">查看详情</el-button>
          <el-button type="warning" plain size="small" @click="updateBuild(scope.row)">编辑</el-button>
          <el-button type="danger" plain size="small" @click="deleteBuild(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page.sync="data.current"
      :hide-on-single-page="data.size>0"
      :page-sizes="[5, 10, 15, 20, 25, 30]"
      layout="total, prev, pager, next, sizes"
      :total="data.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <build-info v-if="buildInfoVisible" ref="buildInfo" @refreshList="getRecords" />
    <build-detail v-if="buildDetailVisible" ref="buildDetail" />
  </div>
</template>

<script>
import { getBuildList, getBuildListByName, deleteBuild, updateBuildStatus } from '../../api/build'
import buildInfo from './buildInfo'
import buildDetail from './buildDetail'

export default {
  components: {
    buildInfo,
    buildDetail
  },
  data() {
    return {
      field: 'name',
      searchValue: '',
      listLoading: false,
      data: {
        current: 1,
        size: 10
      },
      buildInfoVisible: false,
      buildDetailVisible: false,
      recordsSelections: ''
    }
  },
  created() {
    this.getRecords()
  },
  methods: {
    getRecords() {
      this.listLoading = true
      if (this.searchValue !== '') {
        getBuildListByName(this.data.current, this.data.size, this.searchValue).then(response => {
          this.data = response.data
        })
      } else {
        getBuildList(this.data.current, this.data.size).then(response => {
          this.data = response.data
        })
      }
      this.listLoading = false
    },
    clearSearchValue() {
      this.searchValue = ''
      this.getRecords()
    },
    addBuild() {
      this.buildInfoVisible = true
      setTimeout(() => { this.$refs.buildInfo.init('add', {}) }, 20)
    },
    deleteBuilds() {
      this.$confirm('此操作将永久删除选中的记录，是否继续删除？', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        const idList = []
        for (const item of this.recordsSelections) {
          idList.push(item.id)
        }
        console.log('deleteIds : ' + idList.join(','))
        deleteBuild({ buildingIds: idList.join(',').toString() }).then(response => {
          if (response.code === 4001) {
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
          this.listLoading = false
        })
      })
    },
    selectionChangeHandle(val) {
      this.recordsSelections = val
    },
    updateBuildStatus(index, row) {
      updateBuildStatus(row.id, row.status).then(response => {
        if (response.code === 4001) {
          this.$message({
            message: '更新状态成功',
            type: 'success',
            duration: 1000
          })
        } else {
          this.$message({
            message: '更新状态失败',
            type: 'error',
            duration: 1000
          })
          //  更新状态失败后，要将视图上的改变，修改成原来的状态
          this.data.records[index].status = row.status === '有效' ? '无效' : '有效'
        }
      })
    },
    getDetail(record) {
      this.buildDetailVisible = true
      setTimeout(() => { this.$refs.buildDetail.init(record) }, 10)
    },
    updateBuild(record) {
      this.buildInfoVisible = true
      setTimeout(() => { this.$refs.buildInfo.init('update', record) }, 10)
    },
    deleteBuild(record) {
      this.$confirm('此操作将永久删除该记录，是否继续删除？', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteBuild({ buildingIds: record.id }).then(response => {
          if (response.code === 4001) {
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
        })
      })
    },
    handleSizeChange(val) {
      this.data.size = val
      this.getRecords()
    },
    handleCurrentChange(val) {
      this.data.current = val
      this.getRecords()
    }
  }
}
</script>

<style scoped>

</style>
