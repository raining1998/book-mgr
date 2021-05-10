import {defineComponent,ref,onMounted,reactive} from 'vue';
import {user} from '@/service';
import {message} from 'ant-design-vue';
import {EditOutlined} from '@ant-design/icons-vue';
import {result,formatTimestamp} from '@/helpers/utils';
import AddOne from './AddOne/index.vue';
import {getCharacterInfoById} from '@/helpers/character';
import store from '@/store';

const columns = [
    {
        title:'账户',
        dataIndex:'account',
    },
    {
        title:'角色',
        slots:{
            customRender:'character',
        },
    },
    {
        title:'创建日期',
        slots:{
            customRender:'createdAt',
        },
    },
    {
        title:'操作',
        slots:{
            customRender:'actions',
        },
    },
];

export default defineComponent({
    components:{
        AddOne,
        EditOutlined,
    },
    setup(){
        const list = ref([]); //放所有的用户列表      
        const total = ref(0); //放当前一共有几条数据
        const curPage = ref(1);//当前页面是第几页
        const showAddModal = ref(false);
        const keyword = ref('');
        const isSearch = ref(false);//判断当前是否为搜索状态
        const showEditCharacterModal = ref(false);

        const editForm = reactive({
            character:'',
            current:{},
        });

        const getUser = async() => {
            const res = await user.list(curPage.value,10,keyword.value); //请求接口获取用户列表

            result(res)
                .success(({data:{list:resList,total:resTotal}}) => {
                    list.value = resList;
                    total.value = resTotal;
                });
        };

        onMounted(() => {
            getUser();
        });

        //-----------删除
        const remove = async({_id}) => {
            const res = await user.remove(_id);

            result(res)
                .success(({msg}) => {
                    message.success(msg);
                    getUser();//重新获取列表
                });
        };

        //页码
        const setPage = (page) => {
            curPage.value = page;
            getUser();
        };

        //----------重置密码
        const resetPassword = async({_id}) => {
            const res = await user.resetPassword(_id);

            result(res)
                .success(({msg}) => {
                    message.success(msg);
                });
        };

        //------------搜索
        const onSearch = () => {
            getUser();
            isSearch.value = !!keyword.value;
        };

        const backAll = () => {
            isSearch.value = false;
            keyword.value = '';
            getUser();
        };

        const onEdit = (record) => {
            editForm.current = record;
            editForm.character = record.character; //当前修改用户的角色

            showEditCharacterModal.value = true;
        };

        const updateCharacter = async () => {
            const res = await user.editCharacter(editForm.character,editForm.current._id);

            result(res)
                .success(({msg}) => {
                    message.success(msg);
                    showEditCharacterModal.value = false;
                    editForm.current.character = editForm.character;
                });
        };


        return{
            list,
            total,
            curPage,
            columns,
            formatTimestamp,
            remove,
            showAddModal,
            getUser,
            setPage,
            resetPassword,
            isSearch,
            keyword,
            backAll,
            onSearch,
            onEdit,
            updateCharacter,
            getCharacterInfoById,
            showEditCharacterModal,
            editForm,
            characterInfo:store.state.characterInfo,
        };
    }, 
});