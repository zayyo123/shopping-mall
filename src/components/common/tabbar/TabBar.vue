<template>
  <div id="tab-bar"> 
    <slot></slot>
    </div>
</template>

<script>
export default {
  name: 'TabBar',
  data() { 
    return {

    }
  }
 }
</script>

<style >

#tab-bar{
  display: flex;
  background: rgb(248, 225, 199);
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  box-shadow: 0px -2px 1px rgba(rgb(245, 172, 172), green, blue, alpha);
}


  
</style>