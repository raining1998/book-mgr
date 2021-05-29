//认证相关的前端的接口请求 
import { post } from '@/helpers/request';
//注册 
export const register = (account,password,inviteCode) => {
    return post('/auth/register',{
        account,
        password,
        inviteCode,
    });
};
//登录
export const login = (account,password) => {
    return post('/auth/login',{
        account,
        password,
    });
};


