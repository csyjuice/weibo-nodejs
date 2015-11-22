/**
 * Created by Bruce on 15/11/21.
 */
var User = require('../lib/user');

exports.form = function (req, res) {
    res.render('register', { title: 'Register' });
};

exports.submit = function(req, res, next){　　//检查用户名是否唯一
    var data = req.body.user;
    User.getByName(data.name, function(err, user){
        if (err) return next(err);  //顺延传递数据库连接错误和其他错误
        // redis will default it
        if (user.id) {  //用户名已经被占用
            res.error("用户名已经被占用");
            res.redirect('back');
        } else {
            user = new User({  //用POST数据创建用户
                name: data.name,
                pass: data.pass
            });
            user.save(function(err){  //保存新用户
                if (err) return next(err);
                req.session.uid = user.id;  //为认证保存uid
                res.redirect('/');  //重定向到记录的列表页
            });
        }
    });
};