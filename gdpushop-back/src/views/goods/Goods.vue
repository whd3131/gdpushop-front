<template>
  <div class="table-classic-wrapper">

    <el-card shadow="always">
      <!-- 操作栏 -->
      <div class="control-btns">
        <el-button type="primary" @click="handleCreate">新建数据</el-button>
        <el-button type="primary" @click="handleImport">导入数据</el-button>
        <el-button type="primary" @click="exportVisible = true">导出数据</el-button>
<!--        <el-button type="danger" @click="batchDelete">批量删除</el-button>-->
      </div>


      <!-- 查询栏 -->
      <el-form
        ref="searchForm"
        :inline="true"
        :model="listQuery"
        label-width="90px"
        class="search-form"
      >
        <el-form-item label="用户名">
          <el-input v-model="listQuery.id" placeholder="用户名" />
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="listQuery.phone" placeholder="手机" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="listQuery.sex" placeholder="性别">
            <el-option :value="0" label="男" />
            <el-option :value="1" label="女" />
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
        <el-table-column width="100" label="商品图片">
          <template scope="scope" >
            <img v-if="scope.row.goodsImg!==''" style="width: 50px; height: 50px" :src="scope.row.goodsImg"></img>
          </template>
        </el-table-column>

        <el-table-column prop="goodsId" label="商品id" align="center" width="120" show-overflow-tooltip/>
        <el-table-column prop="title" label="商品名" align="center" width="120" />
        <!--show-overflow-tooltip 内容过长可隐藏-->
        <el-table-column prop="goodsContent" label="商品描述" align="center" width="120" show-overflow-tooltip/>
        <el-table-column prop="price" label="价格" align="center" width="120" />
        <el-table-column prop="catId" label="分类" align="center" width="150" />
        <el-table-column prop="countBuy" label="购买数" align="center" width="70" />
        <el-table-column prop="countView" label="浏览数" align="center" width="70" />
        <el-table-column prop="countComment" label="评论数" align="center" width="70" />


        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button size="mini"  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>


      <!-- 分页栏 -->
      <Pagination
        :total="total"
        :page.sync="listQuery.currentPage"
        :limit.sync="listQuery.pageSize"
        @pagination="fetchData" />


      <!-- 新增/编辑 弹出栏 -->
      <el-dialog
        title="操作数据"
        :visible.sync="formVisible"
        width="80%"
        class="dialog-form"
        :before-close="handleClose"
      >
        <el-form
          ref="dialogForm"
          :model="dialogForm"
          label-width="100px"
        >
          <el-form-item label="商品名：" prop="title">
            <el-input v-model="dialogForm.title" />
          </el-form-item>
          <el-form-item label="价格：" prop="price">
            <el-input v-model.number="dialogForm.price" />
          </el-form-item>
          <el-form-item label="关联商家：">
            <el-select @change="changeSelect"  v-model="choiceBusiness" placeholder="请选择">
              <el-option
                v-for="item in businessList"
                :key="item.businessId"
                :label="item.businessName"
                :value="item.businessId">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="分类：" >

            <el-cascader
              v-model="selectCatIdList"
              :options="categoryVoList"
              :props="{ expandTrigger: 'hover', value:'cat_id',label:'label' }"
              @change="handleChange"
              ref="cascaderAddr"
            ></el-cascader>

          </el-form-item>


          <el-form-item  label="商品封面:" prop="goodsImg">
              <div slot="header" class="title">图片缩略图</div>
              <div class="content-box">
                <el-upload action="#" :file-list="fileList" list-type="picture">
                  <el-button size="small" type="primary" class="icon-small"><i class="el-icon-upload" />点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg、jpeg、gif、png、bmp文件，且不超过500kb</div>
                </el-upload>
              </div>
              <el-input v-model="dialogForm.goodsImg"></el-input>
          </el-form-item>
          <el-form-item label="商品描述：">
            <Editor v-model="dialogForm.goodsContent" ></Editor>
          </el-form-item>


          <div class="footer-item">
            <el-button @click="cancleForm">取 消</el-button>
            <el-button type="primary" :disabled="isSubmit" @click="submitForm('dialogForm')">确 定</el-button>
          </div>
        </el-form>
      </el-dialog>


      <!-- 导入数据 弹出栏 -->
      <el-dialog
        title="导入数据"
        :visible.sync="importVisible"
        width="20%"
      >
        <div class="upload-box">
          <span>选择文件：</span>
          <Upload :files-format="filesFormat">
            <i class="vue-dsn-icon-upload" />上传文件
          </Upload>
        </div>
        <div class="hints">TIP：请选择要导出数据的格式。</div>
        <span slot="footer">
          <el-button @click="cancleImport">取 消</el-button>
          <el-button type="primary" @click="confirmImport">确 定</el-button>
        </span>
      </el-dialog>


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
  import { getTableList } from '../../api'
  import excel from '../../utils/excel'
  import Pagination from '../../components/Pagination'
  import Upload from '../../components/Upload'
  import axios from 'axios'
  import methods from "methods";
  import { Message } from 'element-ui'

  //富文本
  import Editor from '../../components/Editor'

  export default {
    name: 'User',
    components: { Pagination, Upload,Editor },
    data() {
      return {
        //图片文件集合
        fileList:[
          { name: 'logo.jpg', url: 'https://cdn.jsdelivr.net/gh/baimingxuan/media-store/images/img04.jpg' }
        ],

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
        // 新增/编辑提交表单对象
        dialogForm: {
          goodsId:undefined,
          title:undefined,
          goodsContent:undefined,
          price:undefined,
          catId:undefined,
          goodsImg:undefined,

        },
        // 数据总条数
        total: 0,
        // 表格数据数组
        tableData: [],
        // 多选数据暂存数组
        multipleSelection: [],
        // 新增/编辑 弹出框显示/隐藏
        formVisible: false,
        // 防止多次连续提交表单
        isSubmit: false,
        // 导入数据 弹出框显示/隐藏
        importVisible: false,
        // 导出文件格式
        filesFormat: '.txt, .csv, .xls, .xlsx',
        // 导出数据 弹出框显示/隐藏
        exportVisible: false,

        //用户选择的分类
        selectCatIdList:[],
        selectCatId:'',
        //商品分类信息
        categoryVoList:[],
        //商家列表
        businessList:[],
        //用户选择的商家
        choiceBusiness:'',

      }
    },

    created() {
      this.fetchData()
      this.getCategory()
      this.initBusiness()
    },

    methods: {

      //用户改变商家选择
      changeSelect(){

      },

      //加载商家列表
      initBusiness(){
        axios({
          method:'get',
          url:'http://localhost:8082/business/getAllBusiness',
          headers:{
            admin:'admin'
          }
        }).then(res=>{
          this.businessList = res.data.data.businessList
          console.log(this.businessList)
        }).catch(error=>{

        })
      },


      //分类级联选择器改变
      handleChange(value){
        this.selectCatId = this.selectCatIdList[this.selectCatIdList.length-1]
        console.log(this.selectCatId)
      },

      //获取商品分类信息
      getCategory(){

        axios({
          methods:"get",
          url:'http://localhost:8082/category/getCategory',
          headers:{
            admin:'admin'
          }
        }).then(res=>{
          this.categoryVoList = res.data.data.categoryVoList
          console.log(this.categoryVoList)
        }).catch(error=>{

        })


      },


      // 多选操作
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      // 新建数据
      handleCreate() {
        this.formVisible = true
        this.dialogForm.goodsId = undefined
        this.dialogForm.title = undefined
        this.dialogForm.price = undefined
        this.dialogForm.catId = undefined
        this.dialogForm.goodsContent = undefined
        this.dialogForm.goodsImg = undefined

      },
      // 编辑数据
      handleEdit(index, row) {
        console.log(index, row)
        console.log(this.dialogForm)
        this.formVisible = true
        this.dialogForm.goodsId = row.goodsId
        this.dialogForm.title = row.title
        this.dialogForm.price = row.price
        this.dialogForm.catId = row.catId
        this.dialogForm.goodsContent = row.goodsContent
        this.dialogForm.goodsImg = row.goodsImg

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
          let goodsId = row.goodsId

          // axios({
          //   method:'post',
          //   url:`http://localhost:8082/goods/delGoods/${goodsId}`,
          //   headers:{
          //     admin:'admin'
          //   }
          // }).then(res=>{
          //   if(res.data.success){
          //     this.$message({
          //       type: 'success',
          //       message: '删除成功!'
          //     })
          //     this.fetchData()
          //   }else{
          //     this.$message({
          //       type: 'error',
          //       message: '删除失败!'
          //     })
          //   }
          // }).catch(error=>{
          //   this.$message({
          //     type: 'error',
          //     message: '删除失败!'
          //   })
          // })


        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })


      },


      // // 批量删除
      // batchDelete() {
      //   if (this.multipleSelection.length < 1) {
      //     this.$message({
      //       message: '请先选择要删除的数据！',
      //       type: 'warning'
      //     })
      //   } else {
      //     this.handleDelete()
      //   }
      // },

      // 新增/编辑弹出框 关闭时操作
      handleClose() {
        this.formVisible = false
        this.$refs.dialogForm.resetFields()
      },
      // 获取数据列表
      fetchData(page = 1) {
        this.currentPage = page
        let currentPage = this.listQuery.currentPage
        let pageSize = this.listQuery.pageSize

        this.listLoading = true
        // 获取数据列表接口
        axios({
          method:'get',
          url:`http://localhost:8082/goods/getPageGoods/${currentPage}/${pageSize}`,
          headers:{
            admin:'admin'
          },
        }).then(res=>{
          this.tableData = res.data.data.goodsList
          this.total = res.data.data.total
          this.listLoading=false
        }).catch(error=>{

        })

      },
      // 查询数据
      onSubmit() {
        this.listQuery.currentPage = 1
        this.fetchData()
      },
      // 导入数据
      handleImport() {
        this.importVisible = true
      },
      // 新增/编辑表单确认提交
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            // 此处添加 新增/编辑数据的接口 新增成功后调用fetchData方法更新列表
            // 先 this.isSubmit = true 接口返回成功后 再 this.isSubmit = false
            this.isSubmit = true
            axios({
              method:'post',
              url:'http://localhost:8082/goods/addGoods',
              headers:{
                admin:'admin'
              },
              data:{
                goodsId:this.dialogForm.goodsId,
                title:this.dialogForm.title,
                price:this.dialogForm.price,
                catId:this.selectCatId,
                goodsContent:this.dialogForm.goodsContent,
                goodsImg:this.dialogForm.goodsImg,
                businessId:this.choiceBusiness,
              }
            }).then(res=>{
              console.log(res.data.success)

              if(res.data.success){
                Message.success("添加成功")
                this.fetchData() //刷新列表
              }else{
                Message.error("添加失败")
              }

            }).catch(error=>{
              Message.error("添加失败")
            })

            this.formVisible = false
          } else {
            this.isSubmit = false
            return false
          }
        })
      },
      // 新增/编辑表单取消提交
      cancleForm() {
        this.$refs.dialogForm.resetFields()
        this.formVisible = false
      },
      // 导入数据弹出栏 确认操作
      confirmImport() {
        // 此处添加 后台接收的接口，将导入的数据传给后台处理
        this.importVisible = false
      },
      // 导入数据弹出栏 取消操作
      cancleImport() {
        // 将导入的数据清空
        this.importVisible = false
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
      // 列表中婚姻状况栏，状态值改变时，调用
      selectChange(row) {
        // 此处添加后台接口，成功后调用fetchData方法更新列表
      },
      // 列表中禁止编辑栏，状态值改变时，调用
      stateChange(row) {
        // 此处添加后台接口，成功后调用fetchData方法更新列表
      }
    }
  }
</script>

<style lang="less">
  .avatar-upload {
    .content-box {
      height: 320px;
      .el-upload {
        display: block;
      }
      .icon-small {
        padding: 8px 24px;
        .el-icon-upload {
          font-size: 14px;
          margin-right: 3px;
        }
      }
    }
  }


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
