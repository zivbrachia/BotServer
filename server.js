var restify = require('restify');
var builder = require('botbuilder');
//var io = require("socket.io");
var events = require('events');
var eventEmitter = new events.EventEmitter();
var ioConnect = require('socket.io-client'); // using to connect per session into diffrent chat
var socketConnect = ioConnect.connect("http://localhost:1234");
var chatServer = require('./ConnectionChatServer');
// node schedule

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
chatServer.createPrivateChat();
// socket.io server... the same port as 3978 /////////////////////////////////////////////////////////////////////////////
//io.listen(server);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
server.get('/api/messages/:message', function(req, res, next) {
    res.send(req.params);
    return next();
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
server.get('/api/notify/:message', function(req, res, next) {
    //console.log(addressJSON);
    var msg = new builder.Message().address(JSON.parse(addressJSON)).text(req.params.message);
    console.log(msg);
    bot.send(msg, function (err) {
        res.status(err ? 500 : 200);
        res.end();
    });
    return next();
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Create chat bot
var connector = new builder.ChatConnector({
    appId: '',//process.env.MICROSOFT_APP_ID
    appPassword: ''//process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());
//
//var addressJSON = "";    //

//=========================================================
// Bots Dialogs
//=========================================================

//bot.dialog('/', function (session) {
//	session.send("Hello World1");
//});

bot.dialog('/', [
    function (session, args, next) {
        //console.log(session.message.address);
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.send('Hello %s!', results.response);
        builder.Prompts.choice(session, "What do you want to do?", "Human");
    },
    function (session, results) {
        if (results.response) {
            var choice = results.response.entity;
            session.send("Your Choice is %s", choice);
            next();
            
            //addressJSON = JSON.stringify(session.message.address);
            //socketConnect.emit("clientMsg", {
            //        "name": session.userData.name,
            //        "msg": "hello world"
            //});
            //session.endDialog('');
        //} else {
        //    session.send("Nothing?");
        }
    },
    function  (session, results) {
        session.send('connect to chat server');
        session.send('find user avaiable');
        session.send('connect between user1 and user2');
    }

]);

bot.dialog('/createSubscription', function (session, args) {
    // Serialize users address to a string.
    addressJSON = JSON.stringify(session.message.address);

    // Save subscription with address to storage.
    session.sendTyping();
    createSubscription(args.userId, address, function (err) {
        // Notify the user of success or failure and end the dialog.
        var reply = err ? 'unable to create subscription.' : 'subscription created';
        session.endDialog(reply);
    }); 
});

socketConnect.on("serverMsg", function (data) {
    if(typeof(addressJSON) === 'undefined') { 
        return;
    }

    console.log(data);
    //
    var msg = new builder.Message()
        .address(JSON.parse(addressJSON))
        .text("Human:" + data.msg);
    //
    bot.send(msg);
});