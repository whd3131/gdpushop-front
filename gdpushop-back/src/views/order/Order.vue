<template>
  <div class="table-classic-wrapper">

    <el-card shadow="always">
      <!-- 操作栏 -->
      <div class="control-btns">
        <el-button type="primary" @click="exportVisible = true">导出数据</el-button>
        <el-button type="danger" @click="batchDelete">批量删除</el-button>
      </div>


      <!-- 查询栏 -->
      <el-form
        ref="searchForm"
        :inline="true"
        :model="listQuery"
        label-width="90px"
        class="search-form"
      >
        <el-form-item label="订单号">
          <el-input v-model="listQuery.id" placeholder="用户名" />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="listQuery.phone" placeholder="手机" />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="listQuery.sex" placeholder="性别">
            <el-option :value="0" label="进行中" />
            <el-option :value="1" label="已完成" />
            <el-option :value="2" label="取消" />
            <el-option :value="3" label="未付款" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格栏 -->
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        size="medium"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="60" />
        <el-table-column prop="orderId" label="订单号"  show-overflow-tooltip></el-table-column>

        <el-table-column prop="orderPrice" label="订单价格" align="center" width="120" >
          <template slot-scope="scope">
            <p>{{scope.row.orderPrice}}￥</p>
          </template>
        </el-table-column>
        <el-table-column prop="userId" label="用户ID" align="center"  show-overflow-tooltip/>
        <el-table-column label="订单状态" align="center" width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.orderStatus === 0">进行中</el-tag>
            <el-tag v-if="scope.row.orderStatus === 1" type="success">已完成</el-tag>
            <el-tag v-if="scope.row.orderStatus === 2" type="info">取消</el-tag>
            <el-tag v-if="scope.row.orderStatus === 3" type="warning">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建日期" align="center" width="300" show-overflow-tooltip sortable/>

        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>

      <!-- 分页栏 -->
      <Pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="fetchData" />



      <!-- 导出数据 弹出栏 -->
      <el-dialog
        title="导出数据"
        :visible.sync="exportVisible"
        width="30%"
      >
        <div class="export-data">
          <el-button type="primary" @click="exportTable('xlsx')">EXCEL格式</el-button>
          <el-button type="primary" @click="exportTable('csv')">CSV格式</el-button>
          <el-button type="primary" @click="exportTable('txt')">TXT格式</el-button>
        </div>
        <div class="hints">TIP：请选择要导出数据的格式。</div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import excel from '../../utils/excel'
  import Pagination from '../../components/Pagination'
  import Upload from '../../components/Upload'
  import axios from 'axios'
  import methods from "methods";

  export default {
    name: 'Order',
    components: { Pagination, Upload },
    data() {
      return {
        // 数据列表加载动画
        listLoading: true,
        // 查询列表参数对象
        listQuery: {
          username: undefined,
          phone: undefined,
          sex: undefined,
          currentPage: 1,
          pageSize: 5
        },
        // 数据总条数
        total: 0,
        // 表格数据数组
        tableData: [],
        // 多选数据暂存数组
        multipleSelection: [],

        // 导出文件格式
        filesFormat: '.txt, .csv, .xls, .xlsx',
        // 导出数据 弹出框显示/隐藏
        exportVisible: false
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      // 多选操作
      handleSelectionChange(val) {
        this.multipleSelection = val
      },

      // 删除数据
      handleDelete(index, row) {
        console.log(index, row)
        this.$confirm('此操作将删除选中数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 此处可添加--删除接口
          // 删除成功调用fetchData方法更新列表
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 批量删除
      batchDelete() {
        if (this.multipleSelection.length < 1) {
          this.$message({
            message: '请先选择要删除的数据！',
            type: 'warning'
          })
        } else {
          this.handleDelete()
        }
      },
      // 新增/编辑弹出框 关闭时操作
      handleClose() {
        this.formVisible = false
        this.$refs.dialogForm.resetFields()
      },
      // 获取数据列表
      fetchData() {
        this.listLoading = true
        // 获取数据列表接口
        axios({
          method:'get',
          url:'http://localhost:8082/order/getAllOrder',
          headers:{
            admin:'admin'
          }
        }).then(res=>{
          this.tableData = res.data.data.orderList
          console.log(this.tableData)
          this.listLoading=false
        }).catch(error=>{

        })

      },
      // 查询数据
      onSubmit() {
        this.listQuery.currentPage = 1
        this.fetchData()
      },


      // 导出数据--excle格式
      exportTable(type) {
        if (this.tableData.length) {
          const params = {
            header: [ '用户名', '密码', '邮箱', '性别', '手机', '禁止编辑', '创建日期'],
            key: [ 'username', 'password', 'email', 'sex', 'phone', 'isDeleted', 'createTime'],
            data: this.tableData,
            autoWidth: true,
            fileName: '用户列表',
            bookType: type
          }
          excel.exportDataToExcel(params)
          this.exportVisible = false
        }
      },

    }
  }
</script>

<style lang="less">
  .table-classic-wrapper {
    .el-card {
      min-height: 656px;
    }
    .control-btns {
      margin-bottom: 20px;
    }
    .search-form {
      padding-top: 18px;
      margin-bottom: 15px;
      background-color: #f7f8fb;
    }
    .el-table thead {
      font-weight: 600;
      th {
        background-color: #f2f3f7;
      }
    }
    .dialog-form {
      .el-input {
        width: 380px;
      }
      .footer-item {
        margin-top: 50px;
        text-align: right;
      }
    }
    .upload-box,
    .export-data {
      width: 300px;
      margin: 0 auto 30px;
    }
    .upload-box {
      width: 156px;
      .files-upload {
        color: #20a0ff;
      }
    }
    .hints {
      font-size: 12px;
      color: #aaa;
      text-align: center;
    }
  }
</style>
