<template>
  <div>
    <div class="topheader">
      <ul>
        <li :class="{ active: isAeactive == 1 }" @click="selectBtn(1)">
          综合排序
        </li>
        <li :class="{ active: isAeactive == 2 }" @click="selectBtn(2)">
          价格由低到高
        </li>
        <li :class="{ active: isAeactive == 3 }" @click="selectBtn(3)">
          价格由高到低
        </li>
        <li><input type="text"v-model="min"></li>
        <li>-</li>
        <li><input type="text" v-model="max"></li>
        <li><input type="button" value="确认" @click="btn"></li>
      </ul>
    </div>
    <div class="allgoods">
      <ul>
        <li v-for="(item, i) in allList" :key="i" @click="detailBtn(item.productId)">
          <img :src="item.productImageBig" alt="" />{{ item.productName }}
          <p>{{ item.salePrice }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isAeactive: 1,
      allList: [],
      sort:'',
      min:'',
      max:'',
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.$axios
        .get(
          `http://api.mm2018.com:8090/api/goods/allGoods?page=1&size=16&sort=${this.sort}&priceGt=${this.min}&priceLte=${this.max}`
        )
        .then(res => {
          this.allList = res.data.data;
          // console.log(res.data.data);
        });
    },
    selectBtn(i) {
      this.isAeactive = i;
      if(i==1){
          this.sort=''
          this.getData()
      }
      if (i==2) {
          this.sort=1
          this.getData()
      }
       if (i==3) {
          this.sort=-1
          this.getData()
      }
    },
    btn(i){
        if (this.max>this.min) {
            this.getData()
        }
    },
    detailBtn(id){
        //console.log(id);
        this.$router.push({
            path:`/detail?productId=${id}`
        })
    }
  }
};
</script>

<style scoped>
.active {
  color: royalblue;
}
.topheader {
  width: 1180px;
  margin: 0 auto;
}
.topheader ul {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
}
.topheader ul li {
  line-height: 60px;
  cursor: pointer;
}
.allgoods {
  width: 1180px;
  margin: 0 auto;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
}
.allgoods ul {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-flow: wrap;
}
.allgoods ul li {
  width: 25%;
  text-align: center;
}
.allgoods ul li img {
  width: 150px;
  display: block;
  margin: 0 auto;
}
.allgoods ul li p {
  color: red;
}
</style>
