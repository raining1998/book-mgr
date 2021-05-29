import { isAdmin } from '@/helpers/character';

export const regDirectives = (app) => {//自定义指令
  app.directive('only-admin', {
    mounted(el, { value = true }) {//当前绑定的父组件被挂载的时候会去调用
      const res = isAdmin();

      if (!res && value) {
        el.style.display = 'none';//对应元素隐藏
      }
    },
  });
};
