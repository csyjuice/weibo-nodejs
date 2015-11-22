var User = require('../user');
module.exports = function(req, res, next){
    if (req.remoteUser) {
        res.locals.user = req.remoteUser;
    }
    var uid = req.session.uid;  //从会话中取出已登录用户的ID
    if (!uid) return next();
    User.get(uid, function(err, user){  //从Redis中取出已登录用户的数据
        if (err) return next(err);
        req.user = res.locals.user = user;  //将用户数据输出到响应对象中
        next();
    });
};

