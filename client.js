/*
* Client executes this when Document ready
*/
$(document).ready(function() {

    if (typeof WebSocket !== 'function') {
        pln("Your browser does not support websockets");
        return;
    }

    //Create websocket
    //Obs. Jag har ändrat så att WebSocketten kopplar upp sig mot 
    //min privata IP-adress. Detta gör att andra datorer kan kommunicera 
    //till servern via websockets
    var ws = new WebSocket("ws://130.236.124.78:" + config.wsPort);

    //When websocket is open, do this
    ws.onopen = function () {
        pln('Websocket connection established!');
        $('#state').html('');
        init(ws);
    }
});


/*
 * Bind events
 */

function init(ws) {

    $('#left').bind('mousedown touchstart', function (e) {
        ws.send('left pressed');
        e.preventDefault();
        e.stopPropagation();
    }).bind('mouseup touchend', function (e) {
        ws.send('left released');
        e.preventDefault();
        e.stopPropagation();
    });

    $('#right').bind('mousedown touchstart', function (e) {
        ws.send('right pressed');
        e.preventDefault();
        e.stopPropagation();
    }).bind('mouseup touchend', function (e) {
        ws.send('right released');
        e.preventDefault();
        e.stopPropagation();
    });

    ws.onmessage = function (msg) {
        var data = msg.data;
        $('#state').css({
            'background-color': data
        });
    }
}


/*
 * Print line
 */

var pln = function(a) {
    $('#console').append(a + "<br/>");
}
