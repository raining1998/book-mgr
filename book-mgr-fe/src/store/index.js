import { createStore } from 'vuex';
import { character,user,bookClassify } from '@/service';
import { getCharacterInfoById } from '@/helpers/character';
import { result } from '@/helpers/utils';

export default createStore({
  state: { //状态 对应的就是放的数据
    characterInfo:[],
    bookClassify: [],
    userInfo:{},
    userCharacter:{},//当前登录用户的角色
  },
  mutations: {//函数集合  用来修改数据
    setCharacterInfo(state,characterInfo){
      state.characterInfo = characterInfo;
    },
    setUserInfo(state,userInfo){
      state.userInfo = userInfo;
      //console.log('this is state.userInfo',state.userInfo);
    },
    setUserCharacter(state,userCharacter){
      state.userCharacter = userCharacter;
      //console.log('this is state.userCharacter',state.userCharacter);
    },
    setBookClassify(state, bookClassify) {
      state.bookClassify = bookClassify;
    },
  },
  actions: {//触发修改数据的前置操作  修改之前先去拿数据
    async getBookClassify(store) {
      const res = await bookClassify.list();

      result(res)
        .success(({data}) => {
          store.commit('setBookClassify', data);
        });
    },

    async getCharacterInfo(store){
      const res = await character.list();
      //console.log('rrrrrrrrrrrrrrrrrrrrrrrrres',res);

     result(res)
      .success(({data}) => {
        store.commit('setCharacterInfo',data);
      });
    },
    async getUserInfo(store) {
      const res = await user.info();

      result(res)
        .success(({data}) => {
          store.commit('setUserInfo',data);
          store.commit('setUserCharacter',getCharacterInfoById(data.character));

          //console.log('actions-------------',store.state);
        });
    },
  },
  
});