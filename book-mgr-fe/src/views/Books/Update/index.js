import { defineComponent, reactive,watch } from 'vue';
import { book } from '@/service';
import { message } from 'ant-design-vue';
import { result,clone } from '@/helpers/utils';
import moment from 'moment';

export default defineComponent({
    props:{
        show:Boolean,
        book:Object,
    },
    setup(props,context){
        const editForm = reactive({
            name:'',
            classify:'',
            author:'',
            publishDate:0,
            price:0,
        });

        const close = () => {
            context.emit('update:show',false);
        };

        //watch 监听响应式数据是否发生变化 变化的话触发传递的回调
        watch(() => props.book,(current) => {
            Object.assign(editForm,current);
            editForm.publishDate = moment(Number(editForm.publishDate));
        });

        const submit = async() => {
            const res = await book.update({
                    id:props.book._id,
                    name:editForm.name,
                    classify:editForm.classify,
                    author:editForm.author,
                    publishDate:editForm.publishDate.valueOf(),
                    price:editForm.price,
                });

            result(res)
                .success(({data,msg}) => {
                    context.emit('update',data);
                    message.success(msg);
                    close();
                });
        };

        return{
            editForm,
            submit,
            props,
            close,
        };
    },
});