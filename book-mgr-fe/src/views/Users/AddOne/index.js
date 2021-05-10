import { defineComponent, reactive } from 'vue';
import { user } from '@/service';
import { message } from 'ant-design-vue';
import { result,clone } from '@/helpers/utils';
import store from '@/store';

const defaultFormData = {
    account:'',
    password:'',
    character:'',
};

export default defineComponent({
    props:{
        show:Boolean,
    },
    setup(props,context){
        const {characterInfo} = store.state;
        
        const addForm = reactive(clone(defaultFormData));//addForm通过clone复制一份defaultFormData 然后转换成响应式数据（reactive）

        addForm.character = characterInfo[1]._id; //1就是普通成员 0是管理员
        
        const close = () => {
            context.emit('update:show',false);
        };

        //弹框的两个按钮
        const submit = async () =>{
            const form =clone(addForm);
           
            const res = await user.add(form.account,form.password,form.character);

            //console.log(res);

            result(res)
                .success((d,{data}) => { 
                  Object.assign(addForm,defaultFormData);
                  message.success(data.msg);
                  close(); 

                  context.emit('getList');
            });

            
            console.log(data);
     
        };

        return{
            addForm,
            submit,
            props,
            close,
            characterInfo,
        };
    },
});