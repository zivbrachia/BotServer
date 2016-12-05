var restify = require('restify');
var builder = require('botbuilder');
// node schedule

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: '',//process.env.MICROSOFT_APP_ID
    appPassword: ''//process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

//bot.dialog('/', function (session) {
//	session.send("Hello World1");
//});

bot.dialog('/', [
    function (session) {
        console.log(session.message.address);
        builder.Prompts.text(session, 'Hi! What is your name?');
        
    },
    function (session, results) {
        session.send('Hello %s!', results.response);
    },
    function (session) {
    	builder.Prompts.text(session, 'Do you want to ask me something?');
    },
    function (session, results) {
        session.send('I dont know yet', results.response);
    }

]);