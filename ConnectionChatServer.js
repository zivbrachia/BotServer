var http = require('http');

var chatServer = "http://locahost:1234";
var options = {
  host: "http://localhost",
  port: 1234,
  path: '/createPrivateChat/',
  method: 'GET'
};

function createPrivateChat() {
    options.path = '/createPrivateChat/' + 111;
    //
    http.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        var responseString = '';
        res.on('data', function(data) {
            responseString += data;
        });
        res.on('end', function() {
            console.log(responseString);
            var responseObject = JSON.parse(responseString);
            success(responseObject);
        });
    //return roomId;
    });
}

function isconnectToChatServer() { 

}

function getUserAvailable() {

}

function isUserAvailable() {

}

function switchUser(user) {

}

exports.createPrivateChat = createPrivateChat;
exports.isconnectToChatServer = isconnectToChatServer;
exports.getUserAvailable = getUserAvailable;
exports.isUserAvailable = isUserAvailable;
exports.switchUser = switchUser;