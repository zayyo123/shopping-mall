<template>
  <div class="goods-item" @click="itemClick">
    <img v-lazy="showImage" alt="" @load="imgLoad">
    <div class="goods-info" >
      <p>{{product.title}}</p>
      <span class="price">{{product.price}}</span>
      <span class="collect">{{product.cfav}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "GoodsListItem",
    props: {
      product: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    created(){
      console.log(this.product)
    },
    computed:{
      showImage(){
        return this.product.img || this.product.image || this.product.show.img;
      }
    },
    methods:{
      imgLoad(){
        this.$bus.$emit('itemImageLoad');

        // if(this.$route.path.indexOf('/home')){
        //   this.$bus.$emit('homeItemImageLoad');
        // } else if(this.$route.path.indexOf('/detail')){
        //   this.$bus.$emit('detailItemImageLoad');
        // }
      },
      itemClick(){
        this.$router.push('/detail/' + this.product.iid);
      }
    }
  }
</script>

<style scoped>
  .goods-item {
    padding-bottom: 40px;
    position: relative;

    width: 46%;
  }

  .goods-item img {
    width: 100%;
    border-radius: 5px;
  }

  .goods-info {
    font-size: 12px;
    position: absolute;
    bottom: 5px;
    left: 0;
    right: 0;
    overflow: hidden;
    text-align: center;
  }

  .goods-info p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 3px;
  }

  .goods-info .price {
    color: var(--color-high-text);
    margin-right: 20px;
  }

  .goods-info .collect {
    position: relative;
  }

  .goods-info .collect::before {
    content: '';
    position: absolute;
    left: -15px;
    top: -1px;
    width: 14px;
    height: 14px;
    background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
  }
</style>
