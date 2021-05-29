import {defineComponent,reactive,ref} from 'vue';
import {UserOutlined,LockOutlined,UserAddOutlined,ContainerOutlined} from '@ant-design/icons-vue';
import {auth,resetPassword} from '@/service'; 
import {result} from '@/helpers/utils/index';
import {getCharacterInfoById} from '@/helpers/character';
import {message,Modal,Input} from 'ant-design-vue';
import store from '@/store';
import {useRouter} from 'vue-router';
import { setToken } from '@/helpers/token';

//icon
export default defineComponent({
    components:{
        UserOutlined,
        LockOutlined,
        UserAddOutlined,
        ContainerOutlined,
    },
    
    setup(){//组件初始化的时候执行一次  也只执行这一次
        const router = useRouter();
        
        //忘记密码 弹框
        const forgetPassword = () => {
            Modal.confirm({
                title:`输入账号发起申请重置密码，管理员进行审核`,
                content:(
                    <div>
                        <Input class="__forget_password_account" />
                    </div>
                ), 
                //弹框的ok按钮
                onOk:async() => {
                    const el = document.querySelector('.__forget_password_account');
                    let account = el.value;

                    const res = await resetPassword.add(account);

                    result(res)
                        .success(({msg}) => {
                            message.success(msg);
                        });
                },
            });
        };

        //注册用的表单数据
        const regForm = reactive({   //reactive表单
            account:'',
            password:'',
            inviteCode:'',
        });

        //注册逻辑
        const register = async () => {
            //console.log(regForm);
            if(regForm.account === ''){
                message.info('账号不能为空');
                return;
            }
            if(regForm.password === ''){
                message.info('密码不能为空');
                return;
            }
            if(regForm.inviteCode === ''){
                message.info('邀请码不能为空');
                return;
            }

            const res = await auth.register(regForm.account,regForm.password,regForm.inviteCode,);

            result(res)
                .success((data) => {
                    message.success(data.msg);
                });           
        };

        //登录用的表单数据
        const loginForm = reactive({
            account:'',
            password:'',
        });


        //登录逻辑
        const login = async () => {
            if(loginForm.account === ''){
                message.info('请输入账号');
                return;
            }
            if(loginForm.password === ''){
                message.info('请输入密码');
                return;
            }

            const res = await auth.login(loginForm.account,loginForm.password);

            result(res)
                .success(async({msg,data:{user,token}}) => {
                    message.success(msg);//登录提示弹框
                    //console.log('user------------------------',user);

                    setToken(token);

                    await store.dispatch('getCharacterInfo');

                    store.commit('setUserInfo',user);

                    store.commit('setUserCharacter',getCharacterInfoById(user.character));
                   
                    //console.log('views/auth--------------------',store.state);

                    router.replace('/dashboard'); 

                });
        };

        return{
            //注册相关的数据
            regForm,
            register,
            
            //登录相关的数据
            loginForm,
            login,

            forgetPassword,
        };
    },
});