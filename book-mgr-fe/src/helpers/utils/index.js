import {message} from 'ant-design-vue';

export const result = (response,authShowErrorMsg = true) => {
    const {data} = response;

    if((data.code === 0) && authShowErrorMsg){
        message.error(data.msg);
    }

    return{
        success(cb){
            if(data.code !== 0){
                cb(data,response);
               //console.log(data);
            }
            return this;
        },
        fail(cb){
            if(data.code === 0){
                cb(data,response);
            }
            return this;
        },
        finally(cb){
            cb(data,response);
            return this;
        },
    };
};

export const clone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

//填充时间  
const timestampPadStart = (str) => {
    str = String(str);

    return str.padStart(2,'0'); //填充两位 用0填充  eg:1->01
};

export const formatTimestamp = (ts) =>{
    const  date = new Date(Number(ts));

    const YYYY = date.getFullYear();
    const MM = timestampPadStart(date.getMonth()+1);  //+1 是因为月是从0开始的
    const DD = timestampPadStart(date.getDate());

    const hh = timestampPadStart(date.getHours());
    const mm = timestampPadStart(date.getMinutes());
    const ss = timestampPadStart(date.getSeconds());

    return `${YYYY}/${MM}/${DD} ${hh}:${mm}:${ss}`;
};