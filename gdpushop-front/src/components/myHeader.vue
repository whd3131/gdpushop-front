<template>
  <div id="app">
    <div class="top">
        <img class="logoImg" src="../assets/gdpulogo.png" alt="">
<!--        已经登录-->
        <div class="headNav" v-if="isLogin === true">
          <i class="el-icon-user-solid"></i>
          <label class="welcome-title">{{userInfo.name}}，欢迎您&nbsp&nbsp&nbsp|&nbsp&nbsp</label>
          <el-button type="text" @click="toCart(userInfo.userId)">购物车</el-button>
          <el-button type="text" @click="toUserBuy()">我的订单</el-button>
          <el-button type="text" @click="toGoodsHistory()">浏览记录</el-button>
          <el-button type="text" @click="toAdmin()">后台</el-button>
          <el-button type="text" @click="toUserCenter()">个人中心</el-button>
          <el-button type="text" @click="logout()">退出</el-button>

          <!--商品浏览记录-->
          <el-drawer
            title="近期商品浏览记录"
            :visible.sync="drawer"
            :direction="direction"
            >
            <!--具体内容-->
            <span >
              <div class="recentGoods" v-if="recentGoodsList.length > 0">
                <el-collapse v-model="activeName" accordion>
                  <div v-for="(rg,index) in recentGoodsList" :key="index">
                      <el-collapse-item :title="rg.title" :name="index" >
                        <img :src="rg.goodsImg" style="width:100px;height:100px" @click="$router.push({path:`/goods/${rg.goodsId}`});$router.history.go(0)"/>
                        <p style="font-weight: 800">{{ rg.title }}</p>
                        <p style="color: gray">{{rg.goodsContent.slice(0,20)+"..."}}</p>
                        <p style="color: indianred">{{rg.price}} ￥</p>
                    </el-collapse-item>
                  </div>
                </el-collapse>
              </div>
              <div class="recentGoods" v-if="recentGoodsList.length === 0">
                <div style="font-weight: 400;color: gray">没有您的浏览历史记录</div>
              </div>


            </span>
          </el-drawer>

        </div>
<!--      未登录-->
        <div class="headNav" v-if="isLogin === false">
          <i class="el-icon-user-solid"></i>

          <label class="welcome-title">您暂未登录 |</label>
          <el-button type="text" @click="toRegister()">注册</el-button>
          <el-button type="text" @click="login()">登录</el-button>
      </div>

    </div>
    <div class="menu">
      <ul>
        <li><router-link to="/">首页</router-link> </li>
        <li><router-link to="/goodsIndex">全部商品</router-link> </li>
      </ul>



    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      userInfo: {
         name:'',
         token:'',
         userId:'',
      },
      isLogin:false,

      //商品历史浏览记录
      drawer: false,
      direction: 'rtl',

      recentGoodsList:undefined,

      activeName:'1',

    }
  },
  computed: {

  },
  created() {
    this.isLogin = false
    // 获取token
    this.token = window.localStorage.getItem('token');
    console.log('myHeader-'+this.token)

    this.initHeader()

    //获取商品浏览记录
    this.getGoodsHistory()
  },


  methods: {
    //跳转个人中心
    toUserCenter(){
      this.$router.push({name:"UserCenter"})
    },

    //刷新商品历史记录
    toGoodsHistory(){
      this.drawer = true
      this.getGoodsHistory()
    },

    //商品浏览历史记录
    getGoodsHistory(){
      this.$axios({
        method:'get',
        url:`http://localhost:8082/goods/getGoodsHistory`,
        headers:{
          token:localStorage.getItem("token")
        }
      }).then(res=>{
        if(res.data.success){
          this.recentGoodsList = res.data.data.goodsList
        }
      }).catch(error=>{
      })
    },

    //后台
    toAdmin(){
      window.location = "http://localhost:8000"
    },

    //用户购买详情
    toUserBuy(){
      this.$router.push({name:'UserBuy'})
    },


    //发送请求，查询当前token的用户信息
    initHeader(){
      this.$axios({
        method:'get',
        url:'http://localhost:8082/user/getUserInfo/',
        headers:{
          token:localStorage.getItem("token")
        }
      }).then(res=>{
        this.userInfo.userId = res.data.data.userId
        this.userInfo.name = res.data.data.name

        //放入浏览器中保存用户信息
        localStorage.setItem('userId',res.data.data.userId)
        localStorage.setItem('name',res.data.data.name)
        this.userInfo.name = res.data.data.name
        this.userInfo.userId = res.data.data.userId
        this.userInfo.token = localStorage.getItem("token")
        this.isLogin=true
      }).catch(error=>{
        console.log(error)
      })

    },

    //购物车
    toCart(userId){
      this.$router.push({path:`/cart/${userId}`})
    },

    //注册
    toRegister(){
      this.$router.push({path:'/register'})
    },

    //登录
    login() {
      this.$router.push({path:'/login'})
    },

    //退出
    logout(){
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('name')
      this.$router.go(0)
    },
  },
}
</script>

<style>
body{
  background-color: #ededed;

}
*{
   padding: 0;
  margin: 0;
}
.top{
  width: 100%;
  height: 58px;
  background: #ededed;
  display: flex;
  align-items: center;
  margin:auto;
}
.top img{
  margin:auto;

}
.menu{
  width: 100%;
  height: 74px;
  background: #fff;

}
ul{
  margin: 0;
  padding: 0;
  list-style-type: none;
}
.menu ul{
  width: 1180px;
  margin: 0 auto;
  display: flex;
}
.menu ul li{
  text-align: center;
  line-height: 74px;
  flex: 1;

  transition: all 0.1s;
}

.menu ul li:hover{
  text-align: center;
  line-height: 74px;
  flex: 1;
  color: #2b4b6b;

  border-radius: 10px;
  box-shadow: 0 3px 2px rgba(0,0,0,.1);
  transform: scale(1.01);

}

.menu ul li a{
  color: #333;
  text-decoration: none;
}

.logoImg{
  height: 50px;
  width: 200px;
}

.headNav{
  margin:auto;

  background-color: #FFFFFF;
  width: auto;
  text-align: center;
  text-shadow: #2b4b6b;
  /*border: 2px solid;*/
  border-radius: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  padding-left: 50px;
  padding-right: 50px;
}

.welcome-title{
  font-size: 14px;
}

.recentGoods{
  margin:10px;

  background-color: #FFFFFF;
  width: auto;
  text-align: center;
  text-shadow: #2b4b6b;
  /*border: 2px solid;*/
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  padding:15px;
}


</style>
