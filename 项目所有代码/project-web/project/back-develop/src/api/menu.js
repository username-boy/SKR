import service from "@/utils/request";
export function getMenu(data) {
  return service({
    url: "/wares/getMenu",
    method: "post",
    data: data
  });
}

export function addParent(data) {
  return service({
    url: "/type/addParent",
    method: "post",
    data: data
  });
}


export function getSecondList(data){
    return service({
        url: "/wares/getSecondList",
        method: "post",
        data: data
    })
}


export function selectParentNameNUll(data){
  return service({
    url:'/wares/selectParentNameNUll',
    method:'post',
    data:data
  })
}

export function selectParentNotNull(data){
  return service({
    url:'/wares/selectParentNotNull',
    method:'post',
    data:data
  })
}