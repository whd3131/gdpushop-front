<template>
  <div>
    <myHeader></myHeader>

    <div class="buy-all">

      <el-container style="padding: 20px;margin: auto;height: auto; border: 1px solid #eee">
        <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
          <el-menu :default-openeds="['1', '2','3']">

            <el-submenu index="1">

              <template slot="title"><i class="el-icon-message"></i>订单中心</template>
              <el-menu-item-group>
                <el-menu-item index="1-1">我的订单</el-menu-item>
                <el-menu-item index="1-2">我的评价</el-menu-item>
              </el-menu-item-group>
            </el-submenu>

            <el-submenu index="2">
              <template slot="title"><i class="el-icon-menu"></i>关注中心</template>
              <el-menu-item-group>
                <el-menu-item index="2-1">关注的商品</el-menu-item>
                <el-menu-item index="2-2">关注的店铺</el-menu-item>
              </el-menu-item-group>
            </el-submenu>

            <el-submenu index="3">
              <template slot="title"><i class="el-icon-setting"></i>资产中心</template>
              <el-menu-item-group>
                <el-menu-item index="3-1">学生卡</el-menu-item>
                <el-menu-item index="3-2">广药白条</el-menu-item>
                <el-menu-item index="3-3">余额</el-menu-item>
              </el-menu-item-group>

            </el-submenu>
          </el-menu>
        </el-aside>

        <el-container>
          <el-header style="text-align: left; font-size: 12px">

          </el-header>

          <div class="buy-title">
            我的订单
          </div>

          <div class="UserBuy">
            <el-tabs v-model="activeName" @tab-click="handleClick">

              <el-tab-pane label="全部订单" name="first">


                <div class="order-goods">
                  <div  v-for="(u,index) in userBuyVoList" :key="index" >

                    <div class="order-header">
                      创建时间：{{u.createTime}}
                      &nbsp;&nbsp;&nbsp;
                      订单号：{{u.orderId}}
                    </div>


                    <ul v-for="(g,index) in u.goodsList" :key="index">

                      <el-card class="box-card">
                        <div slot="header" class="clearfix">
                          <span style="font-weight: 500">{{g.title}}</span>
                        </div>
                          <img :src="g.goodsImg" style="width: 100px;height: 100px">
                        <a style="font-size: small;font-weight: 400">x{{u.goodsNumsArray[index]}}</a>
                      </el-card>

                    </ul>



                    <div class="order-bottom">总价：{{u.orderPrice}}￥  在线支付</div>
                    <div class="order-bottom">
                      <h5 v-if="u.orderStatus===0">正在进行</h5>
                      <h5 v-if="u.orderStatus===1">已完成</h5>
                      <h5 v-if="u.orderStatus===2">已取消</h5>
                      <h5 v-if="u.orderStatus===3">未付款</h5>
                    </div>
                    <el-button style="float: right; padding: 3px 0" type="text" @click="delOrder(u.orderId)">删除订单</el-button>
                    <el-divider></el-divider>

                  </div>
                </div>




              </el-tab-pane>

              <el-tab-pane label="待付款" name="second">待付款</el-tab-pane>

              <el-tab-pane label="待收货" name="third">待收货</el-tab-pane>

              <el-tab-pane label="待评价" name="fourth">待评价</el-tab-pane>

            </el-tabs>
          </div>


        </el-container>
      </el-container>

    </div>

  </div>
</template>

<script>
  import myHeader from '@/components/myHeader.vue';
  export default {
    name: "UserBuy",
    components:{
      myHeader,
    },
    data() {
      return {
        activeName: 'first',

        //订单数据
        userBuyVoList:[
          {
            orderId:'',
            orderPrice:'',
            orderStatus:0,
            createTime:'',
            //该订单购买的商品详细信息
            goodsList:[
              {
                catId:'',
                countBuy:0,
                countComment:0,
                countView:0,
                goodsId:'',
                goodsImg:'',
                isDeleted:0,
                price:0,
                title:'',
              }
            ],
            goodsNumsArray:[],
          }
        ]

      }
    },
    created() {
      this.initUserBuy()
    },
    methods: {
      //删除订单
      async delOrder(orderId){

        const confirmResult = await this.$confirm('您确定删除这个订单吗？','删除订单',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).catch(err => err)

        if(confirmResult === 'confirm'){
          this.$axios({
            method:'post',
            url:'http://localhost:8082/order/delete',
            data:{
              orderId:orderId
            },
            headers:{
              token:localStorage.getItem('token')
            }
          }).then(res=>{
            if(res.data.success){
              this.$message.success("删除成功")
              this.initUserBuy()
              //this.$router.go(0)
            }else{
              this.$message.error("删除失败")
            }
          }).catch(error=>{
            this.$message.error("删除失败")
          })
        }else{
          return this.$message.info('已取消删除！')
        }


      },

      //初始化用户订单
      initUserBuy(){
        this.$axios({
          method:'get',
          url:'http://localhost:8082/user/getUserOrder',
          headers:{
            token:localStorage.getItem('token')
          }
        }).then(res=>{
          console.log(res.data.data.userBuyVoList)
          this.userBuyVoList = res.data.data.userBuyVoList
        }).catch(error=>{
        })
      },

      formatter(row, column) {
        return row.address;
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },

      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    },

  }
</script>

<style scoped>


  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }


  .buy-all{
    display: flex;
  }

  .buy-side{
    position: relative;
    width: 400px;
    height: auto;
    /*margin: 20px auto;*/
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    background-color: white;
    padding: 25px;
    font-size: 20px;

  }
  .buy-title{
    width: 1150px;
    height: auto;
    margin: 10px auto;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    background-color: white;
    padding: 25px;
    font-size: 20px;
  }

.UserBuy{
  width: 1150px;
  height: auto;
  margin: 10px auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  background-color: white;
  padding: 25px;


}

.order-header{
  background-color: #dbdbdb;
  padding: 10px;
  box-shadow: 0 2px 4px #999999;
  margin: 5px;
  font-size: small;
  color: #999999;
}

.order-bottom{
  background-color: white;
  padding: 10px;
  margin: 5px;
  font-size: small;
  color: #999999;
  text-align: right;
}

.order-goods{
  background-color: white;
  padding: 10px;
  box-shadow: 0 2px 4px #999999;
  margin-top: 10px;
  border-radius: 10px;
}

.order-goods ul{
  padding: 3px;
  margin: 1px;

}

.order-goods li{
  padding: 5px;
}
</style>
