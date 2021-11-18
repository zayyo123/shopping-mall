<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick='titleClick' ref="nav" />
    <scroll  class="content" ref="scroll"
    :probe-type="3"
     @scroll = "contentScroll">
    <detail-swiper :top-images='topImages'/>
     <detail-base-info :goods="goods"/>
     <detail-shop-info :shop='shop'/>
     <detail-goods-info  :detail-info="detailInfo" @imageLoad="imageLoad"/>
     <detail-param-info ref="params" :param-info='paramInfo'/>
     <detail-comment-info ref="comment" :comment-info="commentInfo"/>
     <goods-list ref="goodslist" :goods="recommendInfo"/>
    </scroll>
    <detail-bottom-bar @addToCart = "addToCart"  />
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
import DetailNavBar from './childComps/detailNavBar'
import DetailSwiper from './childComps/detailSwiper'
import DetailBaseInfo from'./childComps/detailBaseInfo'
import DetailShopInfo from './childComps/detailShopInfo'
import DetailGoodsInfo from './childComps/detailGoodsInfo'
import DetailParamInfo from './childComps/detailParamInfo'
import DetailCommentInfo from './childComps/detailCommentInfo'
import DetailBottomBar from './childComps/detailBottomBar'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'
import BackTop from 'components/content/backTop/BackTop'



import {getDetail ,Goods,Shop,GoodsParam,getRecommend} from 'network/detail'
import {itemListenerMiXin,backTopMixin} from 'common/mixin'
import {debounce} from 'common/utils'

export default {
  name: 'Detail',
  components:{
    DetailNavBar,
    DetailSwiper ,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
    BackTop
    
  },
   mixins:{itemListenerMiXin,backTopMixin},
    data() { 
    return {
    iid:null,
    topImages:[],
    goods:{},
    shop:{},
    detailInfo:{},
    paramInfo:{},
    commentInfo:{},
    recommendInfo:[],
    themeTopYs:[],
    getThemeTopY:null,
    currentIndex:0,
    isShowBackTop:false
   
    }
  },
  created () {
    // 保存传入的iid
      this.iid = this.$route.params.iid

    // 根据iid请求详情数据
    getDetail(this.iid).then(res =>{
      // console.log(res);
      const data = res.result;
    // 1获取顶部的图片轮播数据
      this.topImages = data.itemInfo.topImages

      // 2.获取商品属性
      this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)
      // 3.取出店铺的信息
      this.shop = new Shop(data.shopInfo)
       //4.取出商品的详情数据
       this.detailInfo = data.detailInfo
      // 5.获取参数的信息
      this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)
      // 6.取出评论的信息
      if(data.rate.cRate !==0){
        this.commentInfo = data.rate.list[0];}
  })
   //3. 请求推荐数据
    getRecommend().then(res =>{
      console.log(res);
      this.recommendInfo = res.data.list
    })
    // 4.给getThemeTopY赋值
    this.getThemeTopY = debounce(() =>{
        this.themeTopYs = []
          this.themeTopYs.push(0)
          this.themeTopYs.push(this.$refs.params.$el.offsetTop)
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
          this.themeTopYs.push(this.$refs.goodslist.$el.offsetTop)
          this.themeTopYs.push(Number.MAX_VALUE)
    },100)
 },


    destroyed(){
            this.$bus.$off('itemImageLoad',this.itemImgListener)
        },
   
 methods: {
   imageLoad(){
     this.$refs.scroll.refresh()
     this.getThemeTopY()
   },
   titleClick(index){
     this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],300)
   },
    contentScroll(position) {
    //1.判断BackTop是否显示
      this.isShowBackTop = (-position.y) > 1000
     },
    backClick() {
      this.$refs.scroll.scrollTo(0, 0,300)
       },
   contentScroll(position){
    //  1.获取y值
    const positoinY = -position.y
    let length = this.themeTopYs.length
    for(let i=0;i<length-1;i++){ 
      if(this.currentIndex!==i&&(positoinY >this.themeTopYs[i]&&positoinY<this.themeTopYs[i+1])){
       this.currentIndex = i;
       this.$refs.nav.currentIndex = this.currentIndex
      }
    }
    
   },
   addToCart(){
     const product ={}
     product.image = this.topImages[0]
     product.title = this.goods.title
     product.desc = this.goods.desc
     product.price =this.goods.realPrice
     product.idd = this.iid
    //  将商品添加到购物车
    //  this.$store.commit('addCart',product)
    this.$store.dispatch('addCart',product)
   }
 }
}
</script>

<style  scoped>
#detail{
  position: relative;
  z-index: 9;
  background-color: #fff;
  height:100vh;}
  .detail-nav{
    position: relative;
    z-index: 99;
    background-color: #fff;
  }
  .content{
    height: calc(100% - 44px);
  }
 
</style>