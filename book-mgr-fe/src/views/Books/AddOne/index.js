import { defineComponent, reactive } from 'vue';
import { book } from '@/service';
import { message } from 'ant-design-vue';
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

        //弹框的两个按钮
        const submit = async () =>{
            const form =clone(addForm);
            form.publishDate = addForm.publishDate.valueOf();
            const res = await book.add(form);

            result(res)
                .success((d,{data}) => {
                  Object.assign(addForm,defaultFormData);
                  message.success(data.msg);
            });
        };

        const close = () => {
            context.emit('update:show',false);
        };

        return{
            addForm,
            submit,
            props,
            close,
        };
    },
});