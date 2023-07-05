import service from '@/utils/request'

export function getBrands(data) {
    return service({
      url: '/wares/getBrands',
      method: 'post',
      data:data
    })
}


export function deleteBrand(data) {
    return service({
      url: '/wares/deleteBrand',
      method: 'post',
      data:data
    })
}
export function updataBrand(data) {
    return service({
      url: '/wares/updataBrand',
      method: 'post',
      data:data
    })
}
export function searchBrand(data) {
  return service({
    url: '/wares/searchBrand',
    method: 'post',
    data:data
  })
}
export function addBrand(data) {
  return service({
    url: '/wares/addBrand',
    method: 'post',
    data:data
  })
}
export function addStoreBrand(data) {
  return service({
    url: '/wares/addStoreBrand',
    method: 'post',
    data:data
  })
}

export function addCategoryBrand(data){
  return service({
    url:'/wares/addCategoryBrand',
    method:'post',
    data:data
  })
}