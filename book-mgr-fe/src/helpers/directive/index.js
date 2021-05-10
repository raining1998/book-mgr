import {isAdmin} from '@/helpers/character';

export const regDirectives = (app) => {
    app.directive('only-admin',{//自定义指令
        mounted(el){//当前绑定的父组件被挂载的时候会去调用
            const res = isAdmin();

            if(!res){
                el.style.dispaly = 'none'; 
            }
        },
    });
};