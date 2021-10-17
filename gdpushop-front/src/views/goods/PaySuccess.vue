<template>
  <div>
    <myHeader></myHeader>

    <div class="PaySuccess">
      <el-steps :active="3" finish-status="success" simple style="margin-top: 20px">
        <el-step title="确认订单" ></el-step>
        <el-step title="支付" ></el-step>
        <el-step title="完成" ></el-step>
      </el-steps>

      <div style="font-size:25px;font-weight: 900;text-align: center;padding:20px;">支付成功</div>

    </div>

  </div>
</template>

<script>
  import myHeader from '@/components/myHeader.vue';
  export default {
    name: "PaySuccess",
    components:{
      myHeader
    },
  }
</script>

<style scoped>

  .PaySuccess{
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

</style>
