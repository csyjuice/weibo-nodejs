var redis = require('redis');
var db = redis.createClient(32777,'192.168.99.100');

function Entry(obj) {
    for (var key in obj) {  //循环遍历传入对象中的键
        this[key] = obj[key];  //合并值
    }
}

Entry.prototype.save = function (fn) {
    var entryJSON = JSON.stringify(this);
    db.lpush(  //将JSON字符串保存到Redis列表中
        'entries',
        entryJSON,
        function(err) {
            if (err) return fn(err);
            fn();
        }
    );
};

Entry.getRange = function (from, to, fn) {
    db.lrange('entries', from, to, function(err, items){  //用来获取消息记录的Redis lrange函数
        if (err) return fn(err);
        var entries = [];
        items.forEach(function(item){
            entries.push(JSON.parse(item));  //解码之前保存为JSON的消息记录
        });
        fn(null, entries);
    });
};

Entry.count = function (fn) {
    db.llen('entries', fn);
};

module.exports = Entry;  //从模块中输出Entry函数