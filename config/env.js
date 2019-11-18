//根据不同的环境更改不同的baseUrl  env:enviroment
let baseUrl = '';
//开发地址的配置
if (process.env.NODE_ENV == 'development') {
    baseUrl = '/sell/logSys';
//上线地址的配置
} else if (process.env.NODE_ENV == 'production') {
    //baseUrl = '测试地址';
    //baseUrl = '预发布地址';
    baseUrl = '/logSys';
}

export {
    baseUrl,//导出baseUrl
}