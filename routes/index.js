/* GET home page. */
exports.notfound = function (req, res) {
  res.status(404).format({
      html : function (req, res) {
          res.render('404');
      },
      json : function (req, res) {
          res.send({ message: 'Resource not found' });
      },
      xml : function (req, res) {
          res.write('<error>\n');
          res.write('  <message>Resource not found</message>\n');
          res.end('</error>\n');
      },
      text : function (req, res) {
          res.send('Resource not found\n');
      }
  });
};

exports.error = function(err, req, res, next){　　//错误处理器必须有四个参数
    console.error(err.stack);  //将错误输出到stderr流中
    var msg;

    switch (err.type) {  //具体的错误示例
        case 'database':
            msg = 'Server Unavailable';
            res.statusCode = 503;
            break;
        default:
            msg = 'Internal Server Error';
            res.statusCode = 500;
    }
    res.format({
        html: function(){  //可以接受HTML时渲染模板
            res.render('5xx', { msg: msg, status: res.statusCode });
        },

        json: function(){  //可以接受JSON时发送的响应

            res.send({ error: msg });
        },
        text: function(){  //响应普通文本
            res.send(msg + '\n');
        }
    });
};