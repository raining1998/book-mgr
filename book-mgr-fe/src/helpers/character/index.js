//通过id 获取角色信息
import store from '@/store';

//判断当前用户是否是管理员
export const isAdmin = () => {
    const uc = store.state.userCharacter;//放置当前用户的角色相关信息

    console.log('fe/src/helpers/character',uc.name);

    return uc.name === 'admin';  //管理员->true  else->false

};

export const getCharacterInfoById = (id) => {
    const {characterInfo} = store.state; // characterInfo 角色相关的列表
    const one =characterInfo.find((item) => {
        return item._id === id;
    });

    // if(one){
    //     return one;
    // }

    // return{
    //     title:'未知角色',
    // };
    return one || {
        title:'未知角色',
    };
};