import {defineComponent,ref,onMounted} from 'vue';
import {useRouter,useRoute} from 'vue-router'
import menu from '@/config/menu';//导航栏数组

export default defineComponent({
    setup(){
        const router = useRouter();
        const route = useRoute();

        const openKeys = ref([]);//当前展开的SubMenu菜单项key数组
        const selectedKeys = ref([]);//当前选中的菜单项key数组

        onMounted(() => {
            //console.log(route);
            selectedKeys.value = [route.path]; //path每个导航菜单的key-》vue key是url 
        });

        const to = (url) => {
            router.push(url);
        };

        return{
            openKeys,
            selectedKeys,
            menu,
            to,
        };
    },
});