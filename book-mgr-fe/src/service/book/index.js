//书籍相关的接口
import axios from 'axios';
import { getToken } from '@/helpers/token';

axios.defaults.headers['Authorization'] = `Bearer ${getToken()}`;

//添加
export const add = (form) => {
    return axios.post('http://localhost:3000/book/add',
    form,
    );
};
//显示数据
export const list = (data) => {
    return axios.get('http://localhost:3000/book/list',
    {
        params:data,
    },
    );
};
//删除
export const remove = (id) => {
    return axios.delete(`http://localhost:3000/book/${id}`,);
};

export const updateCount = (data = {}) => {
    return axios.post(`http://localhost:3000/book/update/count`,
    data,
    );
};
//修改
export const update = (data = {}) => {
    return axios.post(`http://localhost:3000/book/update`,
    data,
    );
};

//详情页面
export const detail = (id) => {
    return axios.get(`http://localhost:3000/book/detail/${id}`,);
};

