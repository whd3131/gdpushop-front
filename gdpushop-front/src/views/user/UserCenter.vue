<template>
  <div>
    <myHeader></myHeader>

    <div class="Pay">

      <div class="pay-header">个人信息中心</div>
        <el-divider></el-divider>
        <div class="pay-title">个人信息</div>
        <ul>
          <li>
            <img class="avatar" src="https://i.jd.com/commons/img/no-img_mid_.jpg">
          </li>
          <li style="color:indianred;font-weight: 900;margin-left:55px;">{{thisname}}</li>
          <li style="margin:10px;">手机号： {{userAddressList[0].phone}}</li>
        </ul>

      <el-divider></el-divider>

      <div class="pay-title">收货地址管理<span style="float:right;"><el-button class="el-icon-circle-plus-outline" @click="addAddr">  添 加</el-button></span></div>
        <!-- 地址栏 遍历用户所有的地址信息 -->
        <div v-if="userAddressList != null" v-for="(ua,index) in userAddressList" :key="index">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>{{ua.address.slice(0,3)}}...</span>
              <el-button style="float: right;margin-left:30px; padding: 3px 0" type="text" class="el-icon-edit-outline" @click="editAddr(ua)">  修 改</el-button>

              <el-button style="float: right;margin-left:10px; padding: 3px 0" type="text" class="el-icon-delete" @click="delAddr(ua)">  删 除</el-button>


            </div>
            <div class="text item">
              <ul>
                <li>收货人：<span style="color:indianred">{{ua.name}}</span></li>
                <li>
                  <span>收货地址:</span>
                  <span style="color:indianred">{{ua.address}}</span>
                </li>
                <li>收货人手机：<span style="color:indianred">{{ua.phone}}</span></li>
              </ul>
            </div>
          </el-card>
        </div>

      <!--编辑地址的弹出层-->
      <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
        <el-form class="address-form">
          <el-form-item label="收货人信息" >
            <el-input style="width:300px;" v-model="name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="收货地址" >
            <el-cascader
              v-model="userSelectAddress"
              :options="cityList"
              :props="{ expandTrigger: 'hover', value:'addressId',label:'addressTitle' }"
              @change="handleChange"
              ref="cascaderAddr"
            ></el-cascader>
            <span>详细地址：</span>
            <el-input v-model="moreAddress" style="width:500px;"></el-input>
          </el-form-item>
          <el-form-item>
            <span>手机号：</span>
            <el-input v-model="phone" style="width:300px;"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveAddress()">保 存</el-button>
        </div>
      </el-dialog>

      <el-divider></el-divider>

      <div class="pay-title">订单详情</div>



      <div class="goods-info">



      </div>




      <el-divider></el-divider>

      <div  class="div-confirm">


      </div>








    </div>

  </div>
</template>

<script>
  import myHeader from '@/components/myHeader.vue';
  export default {
    name: "UserCenter",
    components:{
      myHeader
    },
    data() {
      return {
        userSelectAddress:[], //用于保存用户选择的地址值
        cityList:[ //保存所有的地址信息
          {
            addressId:'', //一级地址
            addressTitle:'',
            twoAddressVoList:[  //二级地址
              {
                addressId:'',
                addressTitle:'',
                triAddressVoList:[  //三级地址
                  {
                    addressId:'',
                    addressTitle:'',
                  }
                ]
              }
            ]
          }
        ],

        //用户填写地址表单
        name:'',//收货人
        address:[],//前缀地址
        moreAddress:'', //详细地址
        phone:'', //手机号
        dialogFormVisible: false, //用户填写地址表单可见性

        completeAddress:'',

        //用户地址集合
        userAddressList:[],

        //记录当前是编辑还是添加
        isEdit:false,
        editUaId:'',

        //用户名
        thisname:localStorage.getItem("name"),

      }
    },
    created() {
      this.initCityList()
      this.initAddress()
    },
    methods: {
      //发送地址保存请求
      saveAddress(){
          if(this.isEdit){
            //当前是编辑

            //拼接完成地址
            let checkedNodes = this.$refs['cascaderAddr'].getCheckedNodes()
            let addr = checkedNodes[0].pathLabels

            this.completeAddress = ''
            for(let a of addr){
              this.completeAddress += a
            }
            //完整地址
            this.completeAddress += this.moreAddress

            this.$axios({
              method:'post',
              url:`http://localhost:8082/user-address/editAddress`,
              headers:{
                token:localStorage.getItem("token")
              },
              data: {
                name:this.name,
                uaId:this.editUaId,
                address:this.completeAddress,
                phone:this.phone,
              }
            }).then(res=>{
              if(res.data.success){
                this.$message.success("地址编辑成功")
                this.dialogFormVisible = false
                this.initAddress()
              }else{
                this.$message.error("地址编辑失败")
              }
            }).catch(error=>{
              this.$message.error("地址编辑失败")
            })

          }else{
            //当前是添加
            //拼接完成地址
            let checkedNodes = this.$refs['cascaderAddr'].getCheckedNodes()
            let addr = checkedNodes[0].pathLabels

            this.completeAddress = ''
            for(let a of addr){
              this.completeAddress += a
            }
            //完整地址
            this.completeAddress += this.moreAddress

            this.$axios({
              method:'post',
              url:`http://localhost:8082/user-address/saveAddress`,
              headers:{
                token:localStorage.getItem("token")
              },
              data:{
                name:this.name,
                address:this.completeAddress,
                phone:this.phone,
              }
            }).then(res=>{
              if(res.data.success){
                this.$message.success("保存成功")
                this.initAddress()
                this.dialogFormVisible = false
              }else{
                this.$message.error("保存失败")
              }
            }).catch(error=>{
              this.$message.error("保存失败")
            })

          }
      },

      //删除用户地址
      delAddr(ua){


        this.$axios({
          method:'post',
          url:`http://localhost:8082/user-address/delAddress/${ua.uaId}`,
          headers:{
            token:localStorage.getItem("token")
          },
        }).then(res=>{
          if(res.data.success){
            this.$message.success("地址删除成功")
            this.dialogFormVisible = false
            this.initAddress()
          }else{
            this.$message.error("删除失败")
          }
        }).catch(error=>{
          this.$message.error("删除失败")
        })
      },

      //添加用户地址
      addAddr(){
        this.name = '';
        this.phone = '';
        this.dialogFormVisible = true
      },

      //编辑用户地址
      editAddr(ua){
        this.name = ua.name;
        this.phone = ua.phone;
        this.dialogFormVisible = true
        this.isEdit = true
        this.editUaId = ua.uaId
        this.userSelectAddress = []
        this.moreAddress = ''

      },

      //初始化地址列表
      initCityList(){
        this.$axios({
          method:'get',
          url:`http://localhost:8082/base-address/getAllAddress`,
          headers:{
            token:localStorage.getItem("token")
          }
        }).then(res=>{
          if(res.data.success){
            this.cityList = res.data.data.cityList;
          }else{
            this.$message.error("地址请求失败")
          }
        }).catch(error=>{
          this.$message.error("地址请求失败")
        })
      },

      handleChange(){

      },

      //初始化该用户地址列表
      initAddress(){

        this.$axios({
          method:'get',
          url:`http://localhost:8082/user-address/getAllAddress`,
          headers:{
            token:localStorage.getItem("token")
          },
        }).then(res=>{
          if(res.data.success){
            this.$message.success("获取地址信息成功")
            this.userAddressList = res.data.data.userAddressList
          }else{
            this.$message.error("获取地址信息失败")
          }
        }).catch(error=>{
          this.$message.error("获取地址信息失败")
        })


      },
    },

  }
</script>

<style scoped>

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
    margin: 10px;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }

  .myCollapse{
    margin-left: 10px;
    margin-right: 10px;
  }


  .Pay{
    align-items: center;
    border-radius: 10px;
    justify-content: center;
    margin: 50px auto;
    width: 1400px;
    height: auto;

    border: 5px solid #ededed;
    box-shadow: 0 0 40px #ddd;
    background-color: white;

    padding: 50px;



  }

  .pay-header{
    text-align: left;
    text-shadow: #2b4b6b;
    color: black;
    font-weight: 900;
    font-size: 25px;
    margin: 20px auto;
    padding-left: 1px;


  }

  .pay-title{
    text-align: left;
    text-shadow: #2b4b6b;
    color: black;
    font-weight: 800;
    font-size: 20px;
    margin: 20px auto;




  }


  .div-confirm{
    margin: 30px auto;
    padding: 50px;
  }


  .goods-info{
    display: flex;
    margin: 10px;
  }

  .goods-info li{
    float: left;
    display: block;
    color: black;
    text-align: left;
    padding: 5px 5px;
    text-decoration: none;
    margin: 5px;
    width: 200px;
  }

  /*鼠标悬停改变颜色*/
  .goods-info ul:hover{
    background-color: lightgrey;
    color: #333333;
  }


  .avatar {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    /*position: absolute;*/
    /*left: 50%;*/
    /*transform: translate(+10%, -10%);*/
    background-color: #fff;
  }

  .uc-title{
    padding: 20px;
    margin: 20px;
  }

</style>
