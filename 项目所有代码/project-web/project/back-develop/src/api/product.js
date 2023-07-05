
import service from "@/utils/request";

export function getProduct(data) {
  return service({
    url: "/wares/getMenu",
    method: 'post',
    data
  });
}

export function updateProduct(data){
  return service({
    url:'/wares/updataMenu',
    method:'post',
    data
  })
}

export function deleteProduct(data){
  return service({
    url:'/wares/deleteMenu',
    method:"post",
    data
  })
}

//二级
export function getSubMenu(data){
  return service({
    url:'/wares/getSubmenu',
    method:'post',
    data
  })
} 

// export function updataSubmenu(data){
//   return service({
//     url:'/wares/updataSubmenu',
//     method:'post',
//     data
//   })
// }

export function deleteSubmenu(data){
  return service({
    url:'/wares/deleteSubmenu',
    method:'post',
    data
  })
}

// 获取库存
export function getStock(data){
  return service({
    url:'/wares/getStock',
    method:'post',
    data
  })

}
// 传入parentname获取某一大类（数码）下的二级分类
// 传入category_id 获取name(二级分类)
export function getCateGory(data){
    return service({
        url:'/wares/getSubmenu',
        method:'post',
        data:data
    })
}

// 获取商品品牌
export function getBrand(data){
    return service({
        url:'/wares/getBrand',
        method:'post',
        data:data
    })
}

// 获取分类品牌 （有店铺的限定）
export function getStorBrands(data){
  return service({
    url:'/wares/getStorBrands',
    method:'post',
    data:data
  })
}

// 获取品类参数
export function getSpecParam(data){
    return service({
        url:'/store/getSpecParam',
        method:'post',
        data:data
    })
}

// 获取品类表品类对应的ID
export function getSpgId(data){
    return service({
        url:'/classification/class',
        method:'post',
        data:data
    })
}

// 添加spu
export function addSpu(data){
    return service({
        url:'/store/addSpu',
        method:'post',
        data:data
    })
}

// 获取squ的数据
export function getSpu(data){
    return service({
        url:'/store/getSpu',
        method:'post',
        data:data
    })
}

// 添加sku
export function addSku(data){
    return service({
        url:'/store/addMoreSku',
        method:'post',
        data:data
    })
}

// 获取sku
export function getSku(data){
  return service({
    url:'/store/getSku',
    method:'post',
    data:data
  })
}

// 删除sku
export function deleteSku(data){
  return service({
    url:'/store/checkDelete',
    method:'post',
    data:data
  })
}

// 更新sku
export function updateSku(data){
  return service({
    url:'/store/updataShop',
    method:'post',
    data:data
  })
}

// 通过spu_id查询t_category中的name
export function getCatName(data){
  return service({
    url:'/store/getCatName',
    method:'post',
    data:data
  })
}

// 通过spu_id查询t_brand中的name
export function getBrandName(data){
  return service({
    url:'/store/getBrandName',
    method:'post',
    data:data
  })
}

// 删除spu
export function deletSpu(data){
  return service({
    url:'/store/deleteSpu',
    method:'post',
    data:data
  })
}