
const webpack = require('webpack')

module.exports = {
    baseUrl: './',  //build打包后的引入文件基础路径为当前目录. 例如，如果应用程序部署在https://www.foobar.com/my-app/，设置publicPath(3.3以后baseUrl改为publicPath)为'/my-app/'
    //outputDir: 'dist', //build文件保存的位置，默认保存在dist目录下
    //把这个改为false。不然在最终打包的文件中会出现一些map文件，map文件的作用在于：项目打包后，代码都是经过压缩加密的，如果运行时报错，输出的错误信息无法准确得知是哪里的代码报错。有了map就可以像未加密的代码一样，准确的输出是哪一行哪一列有错。
    productionSourceMap: false,
    lintOnSave: false, //ESLint 是一个代码规范和错误检查工具
    
    devServer: {
        // npm run serve启动的域名端口
        port: 3000, // 端口号
        host: 'localhost',
        https: false, // https:{type:Boolean}
        open: true, //配置自动启动浏览器
        
        // axios代理
        // 也就是说，在用axios请求的时候，url中用'/sell'代替下面的'target',
        // 通过的当前的域名和端口作为代理，向服务器端发送请求：index.html的请求->代理地址->目标地址
        proxy: {
            '/sell': {
                target: 'http://localhost:8080',   // 需要请求的地址
                changeOrigin: true,  // 是否跨域
                pathRewrite: {
                    '^/sell': ''  //规定请求地址中以/sell的部分改为'',通过重定向的形式，以正则匹配规则将以"/sell"开头的请求地址修改为""，也就是说，我们这样配置后，当我们请求"/sell/abc"的时候，会被重写为请求"/abc"，直接在请求地址中将"/sell"变成了""，由此刚好去掉了请求地址中多余的"/sell"
                }
            }

        },  // 配置多个代理
    },

    configureWebpack: {

        plugins: [
            //jquery配置
            new webpack.ProvidePlugin({       
                $:"jquery",               
                jQuery:"jquery",               
                "windows.jQuery":"jquery"                
            })   
        ]
    }
     
        
}