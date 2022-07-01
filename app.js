const express = require("express");
const json2html = require("json2html");
const { SourceQuerySocket } = require("source-server-query");

BigInt.prototype.toJSON = function () { return this.toString(); }

const app = express();
app.get("/a2s", async function(req, res) {
    const ip = req.query.ip;
    const port = parseInt(req.query.port);
    const query = new SourceQuerySocket();
    query.info(ip, port, 1000)
    .then(function(info) {
        res.write(json2html.render(info));
    }).then(function() {
        query.players(ip, port, 1000)
        .then(function(players) {
            res.write(json2html.render(players));
        })
        .then(function() {
            query.rules(ip, port, 1000)
            .then(function(rules) {
                res.write(json2html.render(rules));
                res.end();
            })
            .catch(function(err) {
                console.log(err);
                res.end();
            })
        })
    })
});

app.listen(3002);