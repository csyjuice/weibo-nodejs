var redis = require('redis');
var bcrypt = require('bcrypt');
var db = redis.createClient(32777,'192.168.99.100');

module.exports = User;

function User(obj){
    for (var key in obj) {
        this[key] = obj[key];
    }
}

User.prototype.save = function (fn) {
    if ( this.id ) {
        this.update(fn);
    } else {
        var user = this;
        db.incr('user:ids', function (err, id) {
            if (err) return fn(err);
            user.id = id;
            user.hashPassword(function (err) {
                user.update(fn);  //保存用户属性
            });
        });
    }
};

User.prototype.update = function (fn) {
    var user = this;
    var id = user.id;
    db.set('user:id:' + user.name, id, function (err) {
        if (err) return fn(err);
        db.hmset('user:' + id, user, function(err) {  //用Redis哈希存储数据
            fn(err);
        });
    });
};

User.prototype.hashPassword = function (fn) {
    var user = this;
    bcrypt.genSalt(12, function (err, salt) {
        if (err) return fn(err);
        user.salt = salt;
        bcrypt.hash(user.pass, salt, function (err, hash) {
            if (err) return fn(err);
            user.pass = hash;
            fn();
        });
    });
};

//通过名称获得用户
User.getByName = function (name, fn) {
    User.getId(name, function (err, id) {
        if (err) return fn(err);
        User.get(id, fn);//用ID抓取用户
    });
};

//通过名字获得ID
User.getId = function (name, fn) {
    db.get('user:id:' + name, fn);
};

//通过ID获取用户
User.get = function (id, fn) {
    db.hgetall('user:' + id, function (err, user) {
        if (err) return fn(err);
        fn(null, new  User(user));
    });
};

//认证用户的名称和密码
User.authenticate = function(name, pass, fn){
    User.getByName(name, function(err, user){  //通过名称查找用户
        if (err) return fn(err);
        if (!user.id) return fn();  //用户不存在
        bcrypt.hash(pass, user.salt, function(err, hash){  //对给出的密码做哈希处理
            if (err) return fn(err);
            if (hash == user.pass) return fn(null, user);   //匹配发现项
            fn();  //密码无效
        });
    });
};

User.prototype.toJSON = function(){
    return {
        id: this.id,
        name: this.name
    }
};

