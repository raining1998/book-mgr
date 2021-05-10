import {defineComponent,ref,onMounted} from 'vue';
import {book} from '@/service';
import {useRouter} from 'vue-router'
import {message,Modal,Input} from 'ant-design-vue';
import {result,formatTimestamp} from '@/helpers/utils';
import AddOne from './AddOne/index.vue';
import Update from './Update/index.vue';

export default defineComponent ({
    //注册AddOne
    components:{
        AddOne,
        Update,
    },
    setup(){
        const router = useRouter();
        const columns =[
            {
                title:'书名',
                dataIndex:'name',
            },
            {
                title:'分类',
                dataIndex:'classify',
            },
            {
                title:'作者',
                dataIndex:'author',
            },
            {
                title:'出版日期',
                dataIndex:'publishDate',
                slots:{
                    customRender:'publishDate',
                },
            },
            {
                title:'价格',
                dataIndex:'price',
            },
            {
                title:'库存',
                slots:{
                    customRender:'count',
                },
            },
            {
                title:'操作',
                slots:{
                    customRender:'actions',
                },
            },
        ];
       //默认弹窗关闭状态 ref包裹响应式变量
        const show = ref(false);
        const showUpdateModal = ref(false);

        //获取list数据
        const list = ref([]);
        const total = ref(0);
        const curPage = ref(1);
        const keyword = ref('');
        const isSearch = ref(false); //是否为搜索状态
        const curEditBook = ref({});

        //获取书籍列表
        const getList = async () => {
            const res = await book.list({
                page: curPage.value,
                size:10,
                keyword:keyword.value,
            });

            result(res)
              .success(({data})=>{
                //console.log(data);
                const {list:l,total:t} = data;
                list.value = l;
                total.value = t;
              });
        };

        onMounted(async () => { //onMounted加载的时候做的
            getList();
        });

        //页码改变  切页
        const setPage = (page) =>{
            curPage.value=page;

            getList();
        };

        //搜索功能
        const onSearch = () =>{
            getList();

            //字符串非空的时候 -> true
            //字符串为空的时候 -> false
            isSearch.value = Boolean(keyword.value); // = !!keyword.value
        };

        //回到全部列表
        const backAll = () => {
            keyword.value = '';
            isSearch.value = false;
            getList();
        };

        //删除一本书籍
        const remove = async ({text:record}) => {
            const{_id} = record;
            const res = await book.remove(_id);
            result(res)
                .success(({msg}) => {
                    message.success(msg);

                    //重新获取列表
                    //1.没有http请求 删一就少一
                    // const idx = list.value.findIndex((item) =>{
                    //     return item._id === _id;
                    // });
                    // list.value.splice(idx,1);
                    //2.发送http请求 重新拿数据  是完整数据
                    getList();  
                });
        };

        //弹出对话框
        const updateCount = (type,record) => {
            let word = '增加';

            if(type === 'OUT_COUNT'){
                word = '减少';
            }

            Modal.confirm({
                title:`要${word}库存`,
                content:(
                    <div>
                        <Input class="__book_input_count" />
                    </div>
                ), 
                //弹框的ok按钮
                onOk:async() => {
                    const el = document.querySelector('.__book_input_count');
                    let num = el.value;

                    const res = await book.updateCount({
                        id:record._id,
                        num,
                        type,
                    });
                    result(res)
                        .success((data) => {
                            if(type === 'IN_COUNT'){
                                //入库操作
                                num = Math.abs(num); //取绝对值 保证正数
                            }else{ 
                                //出库操作
                                num = -Math.abs(num);//负数
                            }

                            const one = list.value.find((item) => {
                                //findindex  返回的是下标 
                                //find 返回的是查找的那一项
                                return item._id === record._id;
                            });
                            if(one){
                                one.count = one.count + num;
                                message.success(`成功${word} ${Math.abs(num)} 本书`);
                            }
                        });
                },
            });

        };

        //  显示更新弹框
        const update = ({record}) => {
            showUpdateModal.value = true;
            curEditBook.value = record;
        };

        //更新列表的某一行的数据
        const updateCurBook = (newData) => {
            Object.assign(curEditBook.value,newData);
        };

        //进入书籍详情页
        const toDetail = ({record}) => {
            router.push(`/books/${record._id}`);
        };

        

        return{
            columns,
            show,
            list,
            formatTimestamp,
            curPage,
            total,
            setPage,
            keyword,
            onSearch,
            backAll,
            isSearch,
            remove,
            updateCount,
            showUpdateModal,
            update,
            curEditBook,
            updateCurBook,
            toDetail,
        };
    },
});