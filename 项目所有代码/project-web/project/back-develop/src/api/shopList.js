import service from '@/utils/request'

export function getSpu(data) {
  return service({
    url: '/store/getShopList',
    method: 'post',
    data:data,
  })
}
export function deleteSpu(data) {
  return service({
    url: '/store/deleteSpu',
    method: 'post',
    data:data,
  })
}
export function getSpecParam(data) {
  return service({
    url: '/store/getSpecParam',
    method: 'post',
    data:data,
  })
}
export function getShopData(data) {
  return service({
    url: '/store/getShop',
    method: 'post',
    data:data,
  })
}
export function updataShopData(data) {
  return service({
    url: '/store/updataSpu',
    method: 'post',
    data:data,
  })
}
export function getSearchList(data) {
  return service({
    url: '/store/search',
    method: 'post',
    data:data,
  })
}
// spu_id删除sku
export function deleteSkuShop(data){
  return service({
    url:'/store/checkDeleteShop',
    method:'post',
    data:data
  })
}



