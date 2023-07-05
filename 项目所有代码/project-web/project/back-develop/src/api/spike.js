import service from '@/utils/request'

export function addSpike(data){
    return service({
        url:'/spike/addspike',
        method:'post',
        data,
    })
}

export function getSpike(data){
    return service({
        url:'/spike/getspike',
        method:'post',
        data,
    })
}

export function delSpike(data){
    return service({
        url:'/spike/delspike',
        method:'post',
        data
    })
}


export function slectSpike(data){
    return service({
        url:'/spike/slectspike',
        method:'post',
        data,
    })
}

export function updateSpike(data){
    return service({
        url:'/spike/updatespike',
        method:'post',
        data,
    })
}

// 获取商品列表
export function getSpu(data){
    return service({
        url:'/store/getSpu',
        method:'post',
        data,
    })
}

export function updataSup(data){
    return service({
        url:'/store/updataSpu',
        method:'post',
        data
    })
}