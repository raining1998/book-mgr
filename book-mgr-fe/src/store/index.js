import { createStore } from 'vuex';
import { character,user } from '@/service';
import { getCharacterInfoById } from '@/helpers/character';
import { result } from '@/helpers/utils';

export default createStore({
  state: { //状态 对应的就是放的数据
    characterInfo:[],
    userInfo:{},
    userCharacter:{},//当前登录用户的角色
  },
  mutations: {//函数集合  用来修改数据
    setCharacterInfo(state,characterInfo){
      state.characterInfo = characterInfo;
    },
    setUserInfo(state,userInfo){
      state.userInfo = userInfo;
    },
    setUserCharacter(state,userCharacter){
      state.userCharacter = userCharacter;
    },
  },
  actions: {//触发修改数据的前置操作
    async getCharacterInfo(store){
      const res = await character.list();

     result(res)
      .success(({data}) => {
        store.commit('setCharacterInfo',data);
      });
    },
    async getUserInfo(store) {
      const res = await user.info();

      console.log(res,"----");

      result(res)
        .success(({data}) => {
          store.commit('setUserInfo',data);
          store.commit('setUserCharacter',getCharacterInfoById(data.character));

          //console.log(store.state);
        });
    },
  },
  
});