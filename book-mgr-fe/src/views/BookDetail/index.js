import { defineComponent,onMounted,ref } from 'vue';
import { useRoute,useRouter } from 'vue-router';
import { result,formatTimestamp } from '@/helpers/utils';
import { book,inventoryLog } from '@/service';
import { CheckOutlined } from '@ant-design/icons-vue' 
import { message } from 'ant-design-vue';
import Update from '@/views/Books/Update/index.vue';
import {getClassifyTitleById} from '@/helpers/book-classify';

//表格列相关的数据  是一个数组
const columns = [
    {
        title:'数量',
        dataIndex:'num',
    },
    {
        title:'操作时间',
        slots:{
            customRender:'createdAt',
        },
    },
];

export default defineComponent({
    components:{
        Update,
        CheckOutlined,
    },

    setup(){
        const route = useRoute();
        const router = useRouter();


        const {id} = route.params; //拿到对应id
        const detailInfo = ref({});
        const log = ref([]); //数组
        const showUpdateModal = ref(false); //默认不展示弹框
        const logTotal = ref(0); //记录总数
        const logCurPage = ref(1);//分页
        const curLogType = ref('IN_COUNT'); 

        //---------------获取书籍详细信息
        const getDetail = async () => {
            const res = await book.detail(id);

            result(res)
                .success(({data}) => {
                    detailInfo.value = data;
                });
        };

        //---------------获取出入库日志
        const getInventoryLog = async () => {
            const res = await inventoryLog.list(curLogType.value,logCurPage.value,10);

            result(res)
                .success(({data:{list,total}}) => {  //total 总共有几页
                    log.value = list;
                    logTotal.value = total;
                });
        };

        //挂载
        onMounted(() => {
            getDetail();
            getInventoryLog();
        });

        //----------------------删除
        const remove = async () => {
            const res = await book.remove(id);
            result(res)
                .success(({msg}) => {
                    message.success(msg);

                    router.replace('/books'); //push与replace区别：1、push 操作完成后可以返回页面 2、replace 不能返回
                });
        };

        //----------------------更新
        const update = (book) => {
            Object.assign(detailInfo.value,book);
        };

        //----------------------日志分页切换的时候
        const setLogPage = (page) => {
            logCurPage.value = page;

            getInventoryLog();
        };

        //筛选日志  入库or出库
        const logFilter = (type) => {
            curLogType.value = type;

            getInventoryLog();
        };


        return{
            d: detailInfo,
            formatTimestamp,
            remove,
            showUpdateModal,
            update,
            log,
            logTotal,
            setLogPage,
            columns,
            logFilter,
            curLogType,
            logCurPage,
            getClassifyTitleById,
        };
    },
});