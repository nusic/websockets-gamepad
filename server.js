var config = require('./config.js');
var net = require('net');
var mod_ctype = require('ctype')

/* Set up web server */
var express = require('express'),
    WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port: config.wsPort}), //pass an object that has property "port" with value: config.wsPort
    app = express();

app.get('/', function (req, res) {
    res.sendfile('./index.html');
})

app.get('/client.js', function (req, res) {
    res.sendfile('./client.js');
})

app.get('/config.js', function (req, res) {
    res.sendfile('./config.js');
})

app.get('/style.css', function (req, res) {
    res.sendfile('./style.css');
})

app.listen(config.httpPort);


var parser = new mod_ctype.Parser({ endian: 'little' });
parser.typedef('worm_t', [
    { direction: { type: 'float' } },
    { alive: { type: 'float' } }
]);

/**
 *  Setup TCP-Socket
 */

var server = net.createServer(function(sock){
    sock.on('data', function(data){
        var out = parser.readData([ { worm: { type: 'worm_t[1]' } } ], data, 0);
        console.log("DATA:");
        console.log(data);
        console.log("Parsed:");
        console.log(out);
    });
});
//to be able to reach socket when clients send colors
var reportSocket;
//Start listening
server.listen(config.reportPort, config.reportHost);

server.on('connection', function(sock){
    console.log('Client Connected');
    sock.write('welcome\r\n');
    reportSocket = sock;
    //refuse other connections (use maxConnections instead?)
    server.close();
});
server.on('close', function(data){
    console.log('Client Disconnect, wait for new user...');
    //start to listen again
    this.listen(config.reportPort, config.reportHost);
});



/*
 * Set up WebSocket Server
 */

var sockets = []; //
var nextSocketId = 0;
var color = generateColor();

/*
    This function is called every time a client connects to the local server at
        example: http://127.0.0.1:1337/
    or
        http:// <config.reportHost> : <config.reportPort> 
        

    The function takes a function as argument (which we will define), which in
    turn has a websocket as argument. The server will have one websocket per client.
*/
wss.on('connection', function(ws) {

    //When a client connects: give it an ID for this client/websocket
    var socketId = nextSocketId++;

    //Store the websocket in array.
    sockets[socketId] = ws;
    ws.send(color);
    console.log(">>> Client connect with socketId: " + socketId);


    //This function gets called every time a client sends a message. 
    ws.on('message', function(message) {
        console.log("---");
        console.log('message recieved: ' + message);

        //when client sends message: randomize color on panel on server
        color = generateColor();

        //update the color on panel for all clients
        Object.keys(sockets).forEach(function (k) {
            var v = sockets[k];
            if(v == ws)
            {
                if(reportSocket)
                {
                    //Report to TCP socket what client pressed a button
                    reportSocket.write('Client: ' + k + ' Sent color: ' + color + ' To Clients \r\n' );
                }
            }
            else
            {
                console.log("v is " + v + "this is " + ws );
            }
            if (v) {
                console.log("sending " + color + " to client with id " + k);
                v.send(color);
            }
        });
    });

    //this function gets called when client closes window
    ws.on('close', function(ws) {
        //remove websocket from server
        sockets[socketId] = null;
    });
})  ;

/*
* Generate new color
*/
function generateColor() {
    var c = Math.round(Math.random()*0xffffff).toString(16);
    while (c.length < 6) {
        c = '0' + c;
    }
    c = "#" + c;
    return c;
}

console.log("report socket on " + config.reportHost + ":" + config.reportPort);
console.log("websocket server listening to port " + config.wsPort);

