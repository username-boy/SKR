import service from '@/utils/request'
export function addInfoModify(data) {
    return service({
      url: '/store/infoModify',
      method: 'post',
      data:data,
    })
  }
  export function getStoreInfo(data) {
    return service({
      url: '/store/getInfo',
      method: 'post',
      data:data,
    })
  }