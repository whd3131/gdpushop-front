<template>
  <div>
    <myHeader></myHeader>

    <div class="Pay">
      <el-steps :active="1" finish-status="success" simple style="margin-top: 20px">
        <el-step title="确认订单" ></el-step>
        <el-step title="支付" ></el-step>
        <el-step title="完成" ></el-step>
      </el-steps>

      <div class="pay-header">填写并核对订单信息</div>

      <el-divider></el-divider>
          <div class="pay-title">收货信息</div>



          <!-- 地址栏 遍历用户所有的地址信息 -->
          <div v-if="userAddressList != null" v-for="(ua,index) in userAddressList" :key="index">
                <el-card class="box-card">
                  <el-radio v-if="userAddressList.length !== 1" v-model="selectAddressRadio" :label="index">选择这个地址</el-radio>
                  <div slot="header" class="clearfix">
                    <span>{{ua.address.slice(0,3)}}...</span>
                    <el-button style="float: right; padding: 3px 0" type="text" class="el-icon-edit-outline"></el-button>
                  </div>
                  <div class="text item">
                    <ul>
                      <li>收货人：<span style="color:indianred">{{ua.name}}</span></li>
                      <li>
                        <span>收货地址:</span>
                        <span style="color:indianred">{{ua.address}}</span>
                      </li>
                      <li>收货人手机：<span style="color:#cd5c5c">{{ua.phone}}</span></li>
                    </ul>
                  </div>
                </el-card>
          </div>

          <div>
            <el-button @click="dialogFormVisible = true">添加地址</el-button>

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



          </div>
<!--          <div>{{payVoList[0].name}} 广东</div>-->

      <el-divider></el-divider>

      <div class="pay-title">支付方式</div>

      <div>货到付款</div>
          <div>在线支付</div>

      <el-divider></el-divider>

      <div class="pay-title">订单详情</div>

      <div class="dingdanhao">订单号：{{orderId}}</div>

<!--      展示订单关联的所有商品的信息  -->
      <div class="goods-info">
<!--        <ul class="goods-ul" v-for="(p,index) in payVoList" :key="index">-->
<!--          <li><img :src="p.goodsImg" style="width: 100px;height: 100px"></li>-->
<!--          <li>数量：{{p.nums}}</li>-->
<!--          <li>单价：{{p.price}}</li>-->
<!--          <li>商品：{{p.title}}</li>-->
<!--        </ul>-->

        <el-card class="box-card" v-for="(p,index) in payVoList" :key="index">
          <div slot="header" class="clearfix">
            <span>{{p.title}}</span>
            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
          </div>
            <li><img :src="p.goodsImg" style="width: 100px;height: 100px"></li>
            <li>数量：{{p.nums}}</li>
            <li>单价：{{p.price}}</li>
        </el-card>
      </div>




      <el-divider></el-divider>

      <div  class="div-confirm">
        <el-dropdown>
                <span class="el-dropdown-link">
                  使用优惠/礼品卡/抵用<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>广药学生证</el-dropdown-item>
            <el-dropdown-item>生日卡</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-alert
          title="请确认信息无误后支付"
          type="warning">
        </el-alert>

        <div class="pay-info">
          <div>应付金额</div>
          <div>￥{{payVoList[0].orderPrice}}</div>
          <div v-if="userAddressList.length > 0">
            寄送至：<span>{{userAddressList[selectAddressRadio].address}}</span>
            收货人：<span>{{userAddressList[selectAddressRadio].name}}</span>
          </div>
        </div>

        <button class="pay-button-2" @click="toEdit">返回修改</button>
        <button class="pay-button" @click="toPay">去支付</button>

      </div>


      <el-drawer
        title="支付"
        :visible.sync="drawer"
        :direction="direction"
        :before-close="handleClose"
        size="50%">
        <div class="pay-drawer">
          <img style="width: 400px;height: 500px" src="https://edu-zuck.oss-cn-guangzhou.aliyuncs.com/cover/pay.jpg"/>
          <el-button @click="paySuccess">我已支付完毕</el-button>
        </div>
      </el-drawer>






    </div>

  </div>
</template>

<script>
  import myHeader from '@/components/myHeader.vue';
  export default {
    name: "Pay",
    components:{
      myHeader
    },
    data() {
      return {
        orderId: '',
        payVoList:{},
        drawer:false,//支付界面
        direction:'rtl',//支付界面弹出方向

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


        //用户地址集合
        userAddressList:[],

        //用户最终选择付款的地址的选项索引
        selectAddressRadio:'0',
      }
    },
    created() {
      this.orderId = this.$route.params.orderId
      this.initPay()
      this.initCityList()
      this.initAddress()
    },
    methods: {

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
            //this.$message.success("获取地址信息成功")
            this.userAddressList = res.data.data.userAddressList
          }else{
            this.$message.error("获取地址信息失败")
          }
        }).catch(error=>{
          this.$message.error("获取地址信息失败")
        })


      },


      //保存地址
      saveAddress(){
        let checkedNodes = this.$refs['cascaderAddr'].getCheckedNodes()
        let addr = checkedNodes[0].pathLabels

        let completeAddress = ''
        for(let a of addr){
          completeAddress += a
        }
        //完整地址
        completeAddress += this.moreAddress

        this.$axios({
          method:'post',
          url:`http://localhost:8082/user-address/saveAddress`,
          headers:{
            token:localStorage.getItem("token")
          },
          data:{
            name:this.name,
            address:completeAddress,
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

      },


      //当级联选择器发生改变时
      handleChange(value){


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

      //支付成功
      paySuccess(){
        //支付成功需要将订单状态改为1，表示已完成
        //根据order_id去修改状态
        this.$axios({
          method:'post',
          url:'http://localhost:8082/order/updateStatus',
          headers:{
            token:localStorage.getItem('token')
          },
          data:{
            orderId:this.orderId,
          }
        }).then(res=>{
          //跳转到支付成功页面
          this.$router.push({name:'PaySuccess'})
        }).catch(error=>{

        })
      },

      //退出支付界面
      handleClose(done){
        this.$confirm('您还未支付订单，确认离开？')
          .then(_ => {
            //确认离开后，将订单状态改为3，表示未付款
            done();
          })
          .catch(_ => {});
      },

      // 去修改
      toEdit(){
        //如果返回修改了，原先生成的这个订单就删除(包括cart_order表）
        this.$axios({
          method:'post',
          url:'http://localhost:8082/order/delete',
          headers:{
            token:localStorage.getItem('token')
          },
          data:{
            orderId:this.orderId,
          }
        }).then(res=>{
          this.$router.go(-1)
        }).catch(error=>{

        })


     },
      //去支付
      toPay(){
        this.drawer = true

      },
      //根据订单号查询订单详情与商品详情
      initPay(){
        this.$axios({
          method:"post",
          url:'http://localhost:8082/cartOrder/getPayInfo',
          headers:{
            token:localStorage.getItem('token')
          },
          data:{
            orderId:this.orderId,
          }
        }).then(res=>{
          this.payVoList = res.data.data.payVoList

        }).catch(error=>{
          this.$message.error("网络出错！")
        })
      }

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

.pay-shouhuo{
  border-radius: 5px;
  border: 1px solid dimgray;

  margin: 40px auto;
}

.pay-method{
  border-radius: 5px;
  border: #333333 solid 5px;
  margin: 40px auto;
}

.pay-confirm{
  border-radius: 5px;
  margin: 40px auto;
}

.pay-info{
  text-align: right;
  font-size: 16px;
  font-weight: 400;
}

.pay-button{

  background-color: #F2F6FC;
  border: #ededed;
  color: black;
  justify-content: center;
  border-radius: 30px;
  float: right;
  width: 200px;
  height: 40px;
  margin: 20px auto;

  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;


}

  .pay-button-2{

    background-color: #F2F6FB;
    border: #ededed;
    color: black;
    justify-content: center;
    border-radius: 30px;
    float: left;
    width: 200px;
    height: 40px;
    margin: 20px auto;

    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;


  }

  .pay-button::before{

    content:'';
    display: block;
    width: 25px;
    height: 50px;
    background: rgba(255, 255, 255, 0.3);
    transform: skew(-25deg);
    position: absolute;
    left: -35px;
    animation: guang infinite 1s ease-in;

  }

  @keyframes guang {
    50%{
      left: -45px;
    }

    100%{
      left: 110px;
    }
  }

.div-confirm{
  margin: 30px auto;
  padding: 50px;
}

.dingdanhao{
  color: #99a9bf;
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

.pay-drawer{
  align-items: center;
  border-radius: 10px;
  justify-content: center;
  margin: 50px auto;
  width: 500px;
  height: auto;

  border: 5px solid #ededed;
  box-shadow: 0 0 40px #ddd;
  background-color: white;

  padding: 50px;
}


</style>
