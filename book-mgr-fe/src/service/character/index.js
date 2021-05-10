//角色相关的接口
import axios from 'axios';

export const list = () => {
    return axios.get(
        'http://localhost:3000/character/list',
    );
};


