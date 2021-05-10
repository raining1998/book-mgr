//认证相关的前端的接口请求 
import axios from 'axios';
//注册 
export const register = (account,password,inviteCode) => {
    return axios.post('http://localhost:3000/auth/register',{
        account,
        password,
        inviteCode,
    });
};
//登陆
export const login = (account,password) => {
    return axios.post('http://localhost:3000/auth/login',{
        account,
        password,
    });
};

