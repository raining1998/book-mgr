const Router = require('@koa/router');
const mongoose = require('mongoose');
const { getBody } = require('../../helpers/utils');

const BOOK_COUNT = {
    IN:'IN_COUNT',//入库
    OUT:'OUT_COUNT',//出库
};

const Book = mongoose.model('Book');
const InventoryLog = mongoose.model('InventoryLog');

const findBookOne = async(id) => {
    const one = await Book.findOne({
        _id:id,
    }).exec();

    return one;
};

const router = new Router({
    prefix:'/book',
});
//-------------------添加书籍
router.post('/add',async(ctx) => {
    const{
        name, //书名
        classify, //分类
        author, //作者
        publishDate,//出版日期
        price,//价格
        count, //库存
    } = getBody(ctx);

    const book = new Book({
        name, 
        classify, 
        author, 
        publishDate,
        price,
        count,
    });

    const res = await book.save();

    ctx.body = {
        data:res,
        code:1,
        msg:'添加成功',
    };
});

//-------------------获取列表
router.get('/list',async(ctx) => {
    //http://aa.cc.com/user?page=2&size=10&keyword=书名#fdsafds
    const{
        page = 1,
        keyword = '',
    }=ctx.query;

    let = {
        size = 10,
    }=ctx.query;

    size = Number(size);

    const query = {};
    if(keyword){
        query.name = keyword;
    }

    const list = await Book
        .find(query)
        .sort({
            _id:-1, //倒序
        })
        .skip((page-1)*size)
        .limit(size)
        .exec();
    
    const total = await Book.countDocuments();

    ctx.body = {
        data:{
            total,
            list,
            page,
            size,
        },
        code:1,
        msg:'获取列表成功',
    };
});

//-----------------------删除
router.delete('/:id',async(ctx)=>{
    const{
        id,
    }=ctx.params;

    const delMsg = await Book.deleteOne({
        _id:id,
    });

    ctx.body = {
        data:delMsg,
        msg:'删除成功',
        code:1,
    };
});

//----------------出库 入库 操作
router.post('/update/count',async(ctx)=>{
    const {
        id,
        type, //状态：出库or入库
    } = ctx.request.body;

    let{  //let变量 可以修改    const 常量 不可以修改
        num, //出库or入库的数量
    } = ctx.request.body;
    num = Number(num);

    const book = await findBookOne(id);

    if(!book){
        ctx.body = {
            code:0,
            msg:'没有找到书籍',
        };
        return;
    }

    //找到了书
    if(type === BOOK_COUNT.IN){
        //入库操作
        num = Math.abs(num); //取绝对值 保证正数
    }else{ 
        //出库操作
        num = -Math.abs(num);//负数
    }
    book.count = book.count + num;

    if(book.count < 0){
        ctx.body = {
            code:0,
            msg:'剩下的量不足以出库',
        };
        return;
    }

    const res = await book.save();//同步数据库

    //日志
    const log = new InventoryLog({
        num:Math.abs(num),
        type,
    });
    await log.save(); 

    ctx.body = {
        data:res,
        code:1,
        msg:'操作成功',
    };
});

//-------------------修改
router.post('/update',async(ctx) => {
    const {
        id,
        // name,
        // classify,
        // author,
        // publishDate,
        // price,
        ...others  //...剩余参数
    } = ctx.request.body;

    //根据id找数据
    const one = await findBookOne(id);
    //没有找到书籍
    if(!one){
        ctx.body = {
            msg:'没有找到书籍',
            code:0,
        }
        return;
    }

    const newQuery = {};
    Object.entries(others).forEach(([key,value]) => {
        if(value){
            newQuery[key] = value;
        }
    });
    Object.assign(one,newQuery); //对象合并

    const res = await one.save();
    ctx.body = {
        data:res,
        code:1,
        msg:'保存成功',
    }

});

//书籍详情页接口
router.get('/detail/:id',async(ctx) => {
    const{
        id,
    } = ctx.params;
    
    const one = await findBookOne(id);
    

    //没有找到书
    if(!one){
        ctx.body = {
            msg:'没有找到数据',
            code:0,
        }
        return;
    }
    ctx.body = {
        msg:'查询成功',
        data:one,
        code:1,
    }
});


module.exports = router;
