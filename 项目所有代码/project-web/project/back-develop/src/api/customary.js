import service from '@/utils/request'

export const getCustomerMsg=(data)=>{
    return service({
        method:"post",
        data,
        url:"/user/getUserInfo"
    })
}