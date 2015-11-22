/**
 * Created by Bruce on 15/11/21.
 */
var User = require('../lib/user');

exports.form = function (req, res) {
    res.render('login', { title: 'Login' });
};

exports.submit = function (req, res) {
    var data = req.body.user;
    User.authenticate(data.name, data.pass, function(err, user){  //检查凭证
        if (err) return next(err);  //传递错误
        if (user) {  //处理凭证有效的用户
            req.session.uid = user.id;  //为认证存储uid
            res.redirect('/');  //重定向到记录列表页
        } else {
            res.error("信息校验失败.");  //输出错误消息
            res.redirect('back');  //重定向回登录表单
        }
    });
};

exports.logout = function (req, res) {
    req.session.destroy(function (err) {
        if (err) throw err;
        res.redirect('/');
    });
};