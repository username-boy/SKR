import service from "@/utils/request"

export const getOrder=(data)=>{
    return service({
        method:"post",
        url:"/order/getOrder",
        data,
    })
}

export const getOrderDetail=(data)=>{
    return service({
        method:"post",
        url:"/order/getOrderDetail",
        data,
    })
}
export const updateOrder=(data)=>{
    return service({
        method:"post",
        url:"/order/updateOrder",
        data,
    })
}
export const deleteOrder=(data)=>{
    return service({
        method:"post",
        url:"/order/deleteOrder",
        data
    })
}
export const getBackStock=(data)=>{
    return service({
        method:"post",
        url:"/order/getBackStock",
        data
    })
}
export const getBackStockDetail=(data)=>{
    return service({
        method:"post",
        url:"/order/getBackStockDetail",
        data
    })
}
export const updateBackStock=(data)=>{
    return service({
        method:'post',
        url:'order/updateBackStock',
        data,
    })
}
