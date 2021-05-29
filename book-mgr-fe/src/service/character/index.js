//角色相关的接口
import { get } from '@/helpers/request';

export const list = () => {
    return get(
        '/character/list',
    );
};


