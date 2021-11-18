// import {ADD_COUNTER,ADD_TO_CART} from './mutation-types'
export default{
    addCart(context,payload){
      return new Promise ((resolve,reject)=>{
        let oldProduct = context.state.cartList.find(item => item.iid === payload.iid);
          // 2判断oldProduct
          if(oldProduct){
            // oldProduct.cont+=1
            context.commit('addCounter',oldProduct);
            resolve('商品数量+1');    
          }else{
            payload.count = 1
            context.commit('addToCart',payload)
            resolve('添加商品成功')
          //  context.state.cartList.push(payload)
          }
      })
        
        
          
      }
}