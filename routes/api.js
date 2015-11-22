/**
 * Created by Bruce on 15/11/22.
 */
var express = require('express');
var User = require('../lib/user');
var Entry = require('../lib/entry');

exports.auth = express.basicAuth(User.authenticate);

exports.user = function (req, res, next) {
    User.get(req.params.id, function (err, user) {
        if (err) return next(err);
        if(!user.id) res.send(404);
        res.json(user);
    });
};

exports.entries = function(req, res, next){
    var page = req.page;
    Entry.getRange(page.from, page.to, function(err, entries){
        if (err) return next(err);
        res.format({
            json : function (req, res, next) {
                res.send(entries);
            },
            xml : function () {
                res.render('entries/xml', { entries: entries });
                //res.write('<entries>\n');
                //entries.forEach(function(entry){
                //    res.write('  <entry>\n');
                //    res.write('  <title>' + entry.title + '</title>\n');
                //    res.write('  <body>' + entry.body + '</body>\n');
                //    res.write('  <username>' + entry.username + '</username>\n');
                //    res.write('  </entry>\n');
                //});
                //res.end('</entries>');
            }
        });
    });
};