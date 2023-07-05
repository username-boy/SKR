import service from "@/utils/request";

export function getVoucher(data) {
  return service({
    url: "/voucher/getVoucher",
    method: "post",
    data
  });
}
export function addVoucher(data){
    return service({
        url:'/voucher/addVoucher',
        method:'post',
        data
    })
}
export function deleteVoucher(data){
  return service({
    url:'/voucher/deleteVoucher',
    method:'post',
    data
  })
}

export function selectVoucher(data){
  return service({
    url:'/voucher/selectVoucher',
    method:'post',
    data
  })
}

// 编辑
export function editVoucheer(data){
  return service({
    url:'/voucher/editVoucheer',
    method:'post',
    data
  })
}
// 查看
export function seeVoucher(data){
  return service({
    url:'/voucher/seeVoucheer',
    method:'post',
    data
  })
}