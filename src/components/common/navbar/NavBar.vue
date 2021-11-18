<template>
  <div class="nar-bar">
      <div class="left"><slot name="left"></slot></div>
      <div class="center"><slot name="center"></slot></div>
      <div class="right"><slot name="right"></slot></div>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  data() { 
    return {

    }
  }
 }
</script>

<style  scoped>
  .nar-bar{
      line-height: 44px;
      display: flex;
      text-align: center;
      box-shadow:0 1px 1px rgba(rgb(153, 151, 151), green, blue, alpha);
  }
  .left, .right{
width: 60px;
  }
  .center{flex: 1;}
</style>