const express=require('express');
const app=express();
const http=require('http').createServer(app);
const io = require('socket.io')(http);

users=[];
connections=[];



app.get('/', function(req, res){
    res.sendFile(__dirname+'/index.html');
});

io.sockets.on('connection',function(socket){
    connections.push(socket);
    console.log('Connected: %s sockets connected',connections.length);

    //disconnect
    socket.on('disconnect',function(data){
        // if(!socket.username) return;
        users.splice(users.indexOf(socket.username),1);
        updateUsernames();
        connections.splice(connections.indexOf(socket),1);
        console.log('Disconnected: %s sockets connected',connections.length);
    });

    //send message
    socket.on('send message',function(data){


            io.sockets.emit('new message',{msg:data,user:socket.username});
    });


    //New User
    socket.on('new user',function(data,callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames()
    });

    function updateUsernames(){
        io.sockets.emit('get users',users);
    }

});


//
//
// io.on('connection', function(socket){
//     socket.on('chat message', function(msg){
//         io.emit('chat message', msg);
//     });
// });
//
http.listen(3000,function(){
    console.log('listening on *3000');
});