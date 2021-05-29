//书籍相关的接口
import { del,post,get } from '@/helpers/request';

//添加 
export const add = (form) => {
    return post('/book/add',
    form,
    );
};
//显示数据
export const list = (data) => {
    return get('/book/list',
    data,
    );
};
//删除
export const remove = (id) => {
    return del(`/book/${id}`,);
};

export const updateCount = (data = {}) => {
    return post(`/book/update/count`,
    data,
    );
};
//修改
export const update = (data = {}) => {
    return post(`/book/update`,
    data,
    );
};

//详情页面
export const detail = (id) => {
    return get(`/book/detail/${id}`,);
};

