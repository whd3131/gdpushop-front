<template>
  <div>
    <div class="index-header">
      <!--    分类选择-->
      <div class="index-header-type">

        <el-cascader-panel
          class="myCascader"
          v-model="typeValue"
          :options="categoryVoList"
          :props="{ expandTrigger: 'hover' }"
          @change="typeChange"

        ></el-cascader-panel>


      </div>

      <!-- 轮播图 -->
      <div class="banner">
        <el-carousel height="415px">
          <el-carousel-item v-for="(item,i) in goodsList" :key="i">
            <img :src="item.goodsImg" alt style="width:auto;height: auto;" />
          </el-carousel-item>
        </el-carousel>
      </div>




    </div>

    <!-- 广告  -->
    <div class="container">
      <div class="card">
        <div class="content">
          <h2>1</h2>
          <p>{{adList[0].adTitle}}</p>
          <a :href="'http://localhost:8080/#/goods/'+adList[0].goodsId">Read More</a>
        </div>
      </div>
      <div class="card">
        <div class="content">
          <h2>2</h2>
          <p>{{adList[0].adTitle}}</p>
          <a href="#">Read More</a>
        </div>
      </div>
      <div class="card">
        <div class="content">
          <h2>3</h2>
          <p>{{adList[0].adTitle}}</p>
          <a href="#">Read More</a>
        </div>
      </div>
      <div class="card">
        <div class="content">
          <h2>4</h2>
          <p>{{adList[0].adTitle}}</p>
          <a href="#">Read More</a>
        </div>
      </div>
    </div>

      <!-- 热门商品 -->
      <div class="hotdetail">

        <div class="hotdetail_menu">热门商品</div>

        <div class="hotdetail_main">

          <ul>
            <li v-for="(g,index) in goodsList" :key="index">
              <img :src="g.goodsImg" alt="" @click="toDetail(g.goodsId)">
              {{g.title}}
              <p>{{g.price}}￥</p>
              <ol style="font-size: 12px">{{g.countBuy}}人已购买</ol>
            </li>
          </ul>

        </div>

      </div>




    <!-- 官方精选 -->
    <div class="product" >

      <div class="product_menu">广药精选</div>

      <div class="jingxuan">
        <ul>
          <li style="width:580px;" class="ck" >
            <img src="https://imgcps.jd.com/ling4/10022326921203/5Lqs6YCJ5aW96LSn/5L2g5YC85b6X5oul5pyJ/p-5f3a47329785549f6bc7a6e8/2a71be7d/cr/s/q.jpg"
                 style="width:590px;"/>
          </li>

          <li v-for="(g,index) in goodsList" :key="index">
            <img
              :src="g.goodsImg"
              style="width:150px;"
            />
            <p>{{g.title}}</p>
            <span>{{g.price}}￥</span>
          </li>

        </ul>
      </div>

    </div>


<!--=======================================================================================================-->



    </div>



</template>

<script>
export default {
  data() {
    return {
      lunbo: [],
      goodsList:[],
      typeValue:'',
      categoryVoList:[],
      adList:[],
    };
  },
  created() {
    this.getAllGoods();
    this.initTypes()
    this.initAd()
  },
  methods: {

    //初始化广告
    initAd(){
      this.$axios({
        methods:"get",
        url:'http://localhost:8082/ad/getAd',
        headers:{
          token:localStorage.getItem("token")
        }
      }).then(res=>{
        this.adList = res.data.data.adList
      }).catch(error=>{

      })
    },

    //初始化首页分类栏
    initTypes(){

      this.$axios({
        methods:"get",
        url:'http://localhost:8082/category/getCategory',
        headers:{
          token:localStorage.getItem("token")
        }
      }).then(res=>{
        this.categoryVoList = res.data.data.categoryVoList
      }).catch(error=>{

      })

    },

    //跳转分类页
    typeChange(){
      let _value = this.typeValue
      this.$router.push({name:'Types',params:{typeValue:_value[1]}})

    },


    toDetail(goodsId){
      this.$router.push({path:`/goods/${goodsId}`})
    },
    //初始化首页数据
    getAllGoods(){
      this.$axios({
        method:'get',
        url:`http://localhost:8082/goods/getAllGoods`,
      }).then(res=>{
          this.goodsList = res.data.data.goodsList
      }).catch(error=>{
      })
    },

  }
};
</script>

<style scoped>

.ad {
  width: 1180px;
  height: 180px;
  background: #fff;
  margin: 20px auto;
  border: 1px solid #ccc;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
.ad ul {
  width: 100%;
  display: flex;
}
.ad ul li {
  flex: 1;
}
.ad ul li img{
  width: 100%;
}
.hotdetail {
  width: 1180px;
  height: auto;
  margin: 0 auto;
  background: #fff;
  border: 1px solid #ccc;
  overflow: hidden;
  border-radius: 10px;
}
.hotdetail_menu {
  height: 51px;
  background: rgb(243, 241, 241);
  text-indent: 30px;
  border-bottom: 1px solid #ccc;
  line-height: 51px;
}
.hotdetail_main {
  width: 100%;


}
.hotdetail_main ul {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  list-style: none;
}
.hotdetail_main ul li {
  list-style: none;

  text-align: center;

  width: 180px; /*每个元素的初始化宽度*/
  /*margin-top: 10px;*/
  /*margin-bottom: 10px;*/
  margin:20px;
  flex:auto;  /*这是关键*/

  /*box-shadow: 0 10px 5px rgba(0,0,0,.1);*/

}

.hotdetail_main ul li:hover {
  list-style: none;

  text-align: center;

  width: 180px; /*每个元素的初始化宽度*/
  /*margin-top: 10px;*/
  /*margin-bottom: 10px;*/
  margin:20px;
  flex:auto;  /*这是关键*/

  box-shadow: 0 10px 15px rgba(0,0,0,.1);

}

.hotdetail_main ul li p {
  color: indianred;
}
.hotdetail_main ul li img {
  display: block;
  width: 170px;

  margin: 30px auto;

}
.ck img {
  display: block;
  width: 580px;
  margin: 0 !important;
  padding: 0px !important;
}
.product {
  width: 1180px;
  height: auto;
  margin: 0 auto;
  margin-top: 25px;
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid #dbdbdb;
}

.jingxuan {
  width: 1180px;
  height: 716px;
  background: #fff;
}

.jingxuan ul {
  display: flex;
  flex-flow: wrap;
  justify-content: space-between;
}

.jingxuan ul li {
  width: 284px;
  box-sizing: border-box;
  background: #fff;
  height: 350px;
  margin-bottom: 16px;
  overflow: hidden;
  text-align: center;
}

.jingxuan ul li img {
  display: block;
  margin: 0 auto;
  margin-top: 50px;
}

.jingxuan ul li:hover img {
  opacity: 0.8;
}

.jingxuan ul li p {
  padding-bottom: 15px;
  padding-top: 20px;
}

.jingxuan ul li span {
  color: red;
}

.product_menu {
  width: 1180px;
  height: 50px;
  background: #fafafa;
  line-height: 50px;
  text-indent: 30px;
  border-bottom: 1px solid #e1e1e1;
}

.product_main {
  width: 1180px;
}

.product_main ul {
  display: flex;
  justify-content: space-between;
}

.product_main ul li {
  width: 586px;
  height: 350px;
  background: #fff;
  text-align: center;
}

.product_main ul li img {
  display: block;
  margin: 0 auto;
  width: 170px;
  height: 170px;
  margin-top: 35px;
}

.product_main ul li p {
  padding-top: 30px;
  padding-bottom: 30px;
}

.product_main ul li span {
  color: red;
}

.HotGoods{
  background-color: #FFFFFF;


  width: 590px;
  margin: 20px auto;

  text-align: center;
  text-shadow: #2b4b6b;
  /*border: 2px solid;*/
  border-radius: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
.HotGoods img{
  width: 100px;
  height: 100px;
}

.index-header{
  display: flex;
  width: 1180px;
  height: 400px;
  margin: auto;
}

.banner {
  width: 1180px;
  height: 380px;
  margin: 5px;
  background: #fff;
  border: 1px  #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  overflow: hidden;
  border-radius: 10px;


}

.index-header-type{
  margin-left: auto;
  padding: 5px;
  overflow: hidden;
  width: 400px;

}

.myCascader{
  background-color: white;


}

@import url('https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,800&display=swap');

*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}
body{
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(0deg, #fff 50%, #2196f3);
}
.container{
  position: relative;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  transition: 0.5s;
  margin:auto;
  padding:20px;
  width:100%;
}
.container .card{
  position: relative;
  width: 290px;
  height: 300px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.5s;
}
.container:hover .card{
  filter: blur(5px);
  transform: scale(.7);
}
.container .card:hover{
  filter: blur(0px);
  transform: scale(1);
}
.container .card:before{
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: #fff;
  z-index: 1;
  transition: 0.5s;
}
.container .card:hover:before{
  background: #000;
  transform: scaleY(1.15);
  box-shadow: 0 5px 15px rgba(0,0,0,.2);
}
.container .card .content{
  text-align: center;
  z-index: 2;
  padding: 0 20px;
  transition: 0.5s;
}
.container .card:hover .content{
  color: #fff;
}
.container .card .content h2{
  font-size: 3em;
}
.container .card .content p{
  font-size: 0.9em;
}
.container .card .content a{
  display: inline-block;
  margin-top: 15px;
  padding: 5px 10px;
  background: #262626;
  color: #fff;
  text-decoration: none;
}
.container .card:hover .content a{
  background: #2196f3;
}


</style>
