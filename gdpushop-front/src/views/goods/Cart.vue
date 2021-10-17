<template>
  <div>
    <myHeader></myHeader>
    <!--    购物车 -->
    <div class="Cart">

      <el-steps :active="0" finish-status="success" simple style="margin-top: 20px">
        <el-step title="确认订单" ></el-step>
        <el-step title="支付" ></el-step>
        <el-step title="完成" ></el-step>
      </el-steps>

      <el-table
        :data="cartData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%" >

        <el-table-column width="40" type="selection">
          <el-checkbox></el-checkbox>
        </el-table-column>


        <el-table-column
          label="图片"
          prop="goodsImg">
          <template slot-scope="scope">
            <img :src="scope.row.goodsImg" style="width: 100px;height: 100px"/>
          </template>
        </el-table-column>

        <el-table-column
          label="订单号"
          prop="id" width="200">
        </el-table-column>

        <el-table-column
          label="商品名称"
          prop="title" width="300">
        </el-table-column>
        <el-table-column
          label="分类ID"
          prop="catId" width="50">
        </el-table-column>

        <el-table-column
          label="单价"
          prop="price" width="100" >
        </el-table-column>
        <el-table-column>
          <el-tag>有货</el-tag>
        </el-table-column>

        <!--        数量-->
        <el-table-column
          label="数量"
          prop="nums">
          <template slot-scope="scope">
            <el-input-number :min='1' :max="999" size="mini" v-model="scope.row.nums"></el-input-number>
          </template>
        </el-table-column>

        <el-table-column
          align="right">
          <template slot="header" slot-scope="scope">
            <el-input
              v-model="search"
              size="mini"
              placeholder="输入关键字搜索"/>
          </template>
          <template slot-scope="scope">
<!--            <el-button-->
<!--              size="mini"-->
<!--              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="jiesuanDiv">
        <span class="span-jiesuan">总价：{{sum}}￥</span>
        <span>
          <el-button v-if="this.cartData.length > 0" class="button-jiesuan" @click="goAccount">去结算</el-button>
        </span>
      </div>

    </div>
  </div>
</template>

<script>
  import myHeader from '@/components/myHeader.vue';
  export default {
    name: "Cart",
    components:{
      myHeader,
    },
    data() {
      return {
        search: '',
        userId:'',
        cartData:[],

      }
    },
    created() {
      this.userId = localStorage.getItem('userId')
      this.initCart()
    },

    methods: {


      //初识化加载该用户的购物车信息
      initCart(){


        //发送请求，查找该userId的购物单有哪些
        this.$axios({
          method:'get',
          url:'http://localhost:8082/cart/getUserCart/'+this.userId,
          headers:{
            token:localStorage.getItem('token')
          },
        }).then(res=>{
            this.cartData = res.data.data.cartList
        }).catch(error=>{
              this.$message.error(error)
        })

      },

      //编辑
      handleEdit(index, row) {
        console.log(index, row);
      },
      //删除
      handleDelete(index, row) {
        console.log(index, row);
        // 删除购物车里的订单
        let thisId = row.id

        this.$axios({
          method:"post",
          url:'http://localhost:8082/cart/deleteById',
          headers:{
            token:localStorage.getItem('token')
          },
          data:{
            id:thisId
          }
        }).then(res=>{

          this.$router.go(0)
        }).catch(error=>{
          this.$message({
            message:error,
            type:"info"
          })
        })

      },

      // 去结算
      goAccount(){
        //如果购物车没东西
        // if(this.cartData.length < 1) {
        //   this.$message.error('购物车为空')
        //   return
        // }


        // 添加订单前把购物车的各商品的数量修改
        //遍历得到各商品的目前数量
        for(let i=0;i<this.cartData.length;i++){
          let currentNums = this.cartData[i].nums
          let currentId = this.cartData[i].id
          this.$axios({
            method:"post",
            url:'http://localhost:8082/cart/updateNums',
            headers:{
              token:localStorage.getItem('token')
            },
            data:{
              id:currentId,
              nums:currentNums,
            }
          }).then(res=>{

          }).catch(error=>{
            this.$message({
              message:error,
              type:"info"
            })
          })
        }

        //得到购物车购买的商品的ID数组
        let cartId = []
        for (let i = 0; i < this.cartData.length; i++) {
          cartId.push(this.cartData[i].id)
        }



        //发送请求，去新添加一条订单
        this.$axios({
          method:'post',
          url:'http://localhost:8082/order/addOrder',
          headers:{
            token:localStorage.getItem('token')
          },
          data:{
            sum:this.sum,
            userId:this.userId,
            cartIds:cartId
          },
        })
          .then(res=>{
            if(res.data.success){
              this.$message({
                message:'创建订单成功',
                type:'success'
              })

              //跳转到支付页面
              this.$router.push({name:'Pay',params:{orderId:res.data.data.orderId}})
            }

          })
          .catch(error=>{
            this.$message.error(error)
          })





      }

    },


    computed: {
      //总价
      sum() {
        let t_sum = 0
        for(let cart of this.cartData){
          t_sum+=cart.nums * cart.price
        }
        return t_sum
      }
    },
  }
</script>

<style scoped>
.Cart{
  /*display: flex;*/
  align-items: center;
  border-radius: 30px;
  justify-content: center;
  margin: 50px auto;
  width: 1400px;
  height: 100px;
}

.button-jiesuan{
  background-color: indianred;
  color: #fff;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
  float: right;
  width: 200px;

}

.span-jiesuan{
  position: relative;
  top: 10px;
  right: 25px;
  color: indianred;
  font-weight: 900;
}

.jiesuanDiv{
  text-align: right;
  margin: 10px auto;
}
</style>
