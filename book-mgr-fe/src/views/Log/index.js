import {defineComponent, onMounted,ref} from 'vue';
import {log} from '@/service';
import {result,formatTimestamp} from '@/helpers/utils';
import {getLogInfoByPath} from '@/helpers/log';
import {message} from 'ant-design-vue';

const columns =[
    {
        title:'账号',
        dataIndex:'user.account',
    },
    {
        title:'动作',
        dataIndex:'action',
    },
    {
        title:'记录时间',
        slots:{
            customRender:'createdAt',
        },
    },
    {
        title:'操作',
        slots:{
            customRender:'action',
        },
    },
];

export default defineComponent({
    setup(){
        const curPage = ref(1);
        const total = ref(0);
        const list = ref([]);
        const loading = ref(true);
        
        const getList = async() => {
            loading.value = true;
            const res = await log.list(curPage.value, 20);
            loading.value = false;

            result(res)
                .success(({data:{list:l,total:t}}) => {
                    l.forEach((item) => {
                        item.action = getLogInfoByPath(item.request.url);
                    });

                    list.value = l;
                    total.value = t;
                });
        };

        onMounted(() => {
            getList();
        });

        const setPage = (page) => { //切页
            curPage.value = page;
            getList();
        };

        //删除操作
        const remove = async ({_id}) => {
            const res = await log.remove(_id);

            result(res)
                .success(({ msg }) => {
                message.success(msg);
                getList();
            });
        };

        return{
            curPage,
            total,
            list,
            columns,
            setPage,
            loading,
            formatTimestamp,
            remove,
        };
    },
});