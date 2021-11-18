<template>
  <div id="home"> 
    <nav-bar class="home-nav">
      <div slot='center'>购物街</div> </nav-bar>
     <tab-control :titles="['流行','新款','精选']" @tabClick="tabClick" ref="tabControl1"  class="tab-control" v-show="isTabFixed"/>
    <scroll class="content" 
    ref='scroll' 
    :probe-type='3'
     @scroll="contentScroll"
     :pull-up-load="true"
     @pullingUp="loadMore"> 
   <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
   <recommend-view :recommends="recommends"/>
   <feature-view/>
   <tab-control :titles="['流行','新款','精选']"
    @tabClick="tabClick"
     ref="tabControl2" />
   <goods-list :goods="showGoods" />
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
  
</template>

<script>
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView"
import FeatureView from "./childComps/FeatureView"

import NavBar from 'components/common/navbar/NavBar'
import Scroll from 'components/common/scroll/Scroll'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import BackTop from 'components/content/backTop/BackTop'

import {getHomeMultidata,getHomeGoods} from 'network/home';
import{debounce} from "common/utils"
export default {
  name: 'Home',
  data() { 
    return {
      banners:[],
      recommends:[],
      goods:{
        'pop':{page:0,list:[]},
        'new':{page:0,list:[]},
        'sell':{page:0,list:[]},
      },
      currentType:'pop',
      isShowBackTop:false,
      tabOffsetTop:546,
      isTabFixed:false,
      saveY:0,
    }
  }, 
  components: {
    NavBar,
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodsList,
    Scroll,
    BackTop
  },
  utiles:{debounce},
  computed:{
showGoods(){
  return this.goods[this.currentType].list
}
  },
  created () {
  // 请求多个数据
  this.getHomeMultidata()
  // 请求商品数据
   this.getHomeGoods('pop')
   this.getHomeGoods('new')
   this.getHomeGoods('sell')
  },
  mounted(){
  // 监听goosItem中图片加载完成
  const refresh = debounce(this.$refs.scroll.refresh,200)
  this.$bus.$on('itemImageLoad',()=>{
    //  this.$refs.scroll.refresh()
    refresh()
  })
  },

  methods:{
    // 防抖函数
    debounce(func,delay){
      let timer = null
      return function(...args){
        if(timer)clearTimeout(timer)
        timer = setTimeout(() =>{
          func.apply(this,args)
        },delay)
      }
    },
    // 事件监听相关的方法
    tabClick(index){
    switch(index){
      case 0:
        this.currentType = 'pop'
        break
      case 1:
        this.currentType = 'new'
        break
      case 2:
        this.currentType = 'sell'
        break
      }
      if(this.$refs.tabControl1.currentIndex !== undefined){
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      }
    },
   backClick() {
        this.$refs.scroll.scrollTo(0, 0,300)
      },
  contentScroll(position){
    //1.判断BackTop是否显示
    this.isShowBackTop=(-position.y)>1000

    //2.决定tabControl是否吸顶(position:fixed)
    this.isTabFixed=(-position.y)>this.tabOffsetTop
  },
  loadMore(){
    this.getHomeGoods(this.currentType)
    // bescroll下拉加载问题解决
    // this.$refs.scroll.scroll.refresh()
  },
  swiperImageLoad(){
     this.tabOffsetTop =  this.$refs.tabControl2.$el.offsetTop
      },

    // 网络请求相关方法
    getHomeMultidata(){
      getHomeMultidata().then(res =>{
    this.banners = res.data.banner.list;
    this.recommends = res.data.recommend.list
    })
  },
   getHomeGoods(type){
     const page = this.goods[type].page + 1
    getHomeGoods(type,page).then(res =>{
      this.goods[type].list.push(...res.data.list)
      this.goods[type].page+=1 
       //上拉完成加载更多
      this.$refs.scroll.finishPullUp()
    })
  }
 },
  activated(){

      this.$refs.scroll.scrollTo(0,this.saveY,0)
          // this.$refs.scroll.refresh()
    },
  deactivated(){
    this.saveY = this.$refs.scroll.getScrollY()
  },
  }
</script>

<style  scoped>
 #home{
    height: calc(100% -44px -49px);
    /* position: relative; */
 }
   /* .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
  }  */
    .home-nav {
    background-color: var(--color-tint);
    color: #fff;

  }
  .content {
    overflow: hidden;
    height: 85vh;
    position: absolute;
    left: 0;
    right: 0;
    top: 44px;
    bottom: 49px;


  }
    .tab-control{
    position: relative;
    z-index: 9;
  }
  /*.content {*/
    /*height: calc(100% - 93px);*/
    /*overflow: hidden;*/
    /*margin-top: 44px;*/
  /*}*/
 
</style>