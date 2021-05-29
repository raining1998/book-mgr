//通过路径变成一个用户可以看懂的文案

//路径对应文案 表
const LOG_MAP = [
    ['/character/list', '获取角色列表'],
    ['/log/list', '获取日志列表'],
    ['/user/info', '获取自己的登入信息'],
    ['/book/list', '获取图书列表'],
    ['/dashboard/base-info', '进入首页'],
    ['/book-classify/list', '获取图书分类列表'],
    ['/user/list', '获取用户列表'],
    ['/profile/update/password', '修改密码'],
    ['/user/update/character', '修改用户角色'],
    ['/invite/list', '获取邀请码列表'],
    ['/auth/login', '进入登录页面'],
    ['/auth/register', '进入注册页面'], 
    ['/book-classify/update/title', '修改图书分类'], 	
    ['/book-classify/add', '添加图书分类'], 
    ['/book/add', '添加图书'], 
    ['/user/add', '添加用户'],
    ['/forget-password/list', '获取重置密码列表'], 
    ['/forget-password/update/status', '处理重置密码列表数据'],	
    ['/book/detail', '获取图书详情'],	
    ['/inventory-log', '查看出入库日志'],				
  ];
  
  export const getLogInfoByPath = (path) => {
    let title = '';
  
    LOG_MAP.forEach((item) => {
      if (path.includes(item[0])) {
        title = path.replace(item[0],item[1]);
        
      }
    });
  
    return title || path;
  };