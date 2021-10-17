<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  components:{
  }
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

ul{
  margin: 0;
  padding: 0;
  list-style-type: none;
}
li{
  cursor: pointer;
}

</style>
