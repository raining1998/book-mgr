import {defineComponent,reactive,ref} from 'vue';
import {UserOutlined,LockOutlined,UserAddOutlined,ContainerOutlined} from '@ant-design/icons-vue';
import {auth} from '@/service';
import {result} from '@/helpers/utils/index';
import {getCharacterInfoById} from '@/helpers/character';
import {message} from 'ant-design-vue';
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
    
    setup(){
        const router = useRouter();

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

        //登陆用的表单数据
        const loginForm = reactive({
            account:'',
            password:'',
        });
        //登陆逻辑
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
                .success(({msg,data:{user,token}}) => {
                    message.success(msg);
                    console.log('sssssssssssssssssssssssssssss',user);

                    store.commit('setUserInfo',user);
                    store.commit('setUserCharacter',getCharacterInfoById(user.character));

                    console.log('views/auth',store.state);

                    setToken(token);

                    router.replace('/books');

                });
        };

        return{
            //注册相关的数据
            regForm,
            register,
            
            //登陆相关的数据
            loginForm,
            login,
        };
    },
});