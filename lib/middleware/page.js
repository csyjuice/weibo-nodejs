/**
 * Created by Bruce on 15/11/22.
 */
module.exports = function(fn, perpage){
    perpage = perpage || 10;  //每页记录条数的默认值为10
    return function(req, res, next){  //返回中间件函数
        var page = Math.max(
                parseInt(req.param('page') || '1', 10),
                1
            ) - 1;  //将参数page解析为十进制的整型值
        fn(function(err, total){  //调用传入的函数
            if (err) return next(err);  //传递错误
            req.page = res.locals.page = {  //保存page属性以便将来引用
                number: page,
                perpage: perpage,
                from: page * perpage,
                to: page * perpage + perpage - 1,
                total: total,
                count: Math.ceil(total / perpage)
            };
            next();   //将控制权交给下一个中间件
        });
    }
};