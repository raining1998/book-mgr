import { defineComponent, reactive } from 'vue';
import { book } from '@/service';
import { message } from 'ant-design-vue';
import store from '@/store';
import { result,clone } from '@/helpers/utils';

const defaultFormData = {
    name:'',
    classify:'',
    author:'',
    publishDate:0,
    price:0,
    count:'', //库存
};

export default defineComponent({
    props:{
        show:Boolean,
    },
    setup(props,context){
        //console.log(props);
        const addForm = reactive(clone(defaultFormData));

        if (store.state.bookClassify.length) {
            addForm.classify = store.state.bookClassify[0]._id;
        }
      
        //弹框的两个按钮
        const submit = async () =>{
            const form =clone(addForm);
            form.publishDate = addForm.publishDate.valueOf();
            const res = await book.add(form);

            result(res)
                .success((d,{data}) => {
                  Object.assign(addForm,defaultFormData);
                  message.success(data.msg);

                  context.emit('getList');
            });
        };

        const close = () => {
            context.emit('update:show',false);
        };

        console.log(store.state);

        return{
            addForm,
            submit,
            props,
            close,
            store: store.state,
        };
    },
});