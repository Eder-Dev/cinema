const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname,'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

console.log("Pegando");

app.use('/watch',(req,res) => {
    res.render('index.html');
});
app.use('/admin',(req,res) => {
    res.render('admin.html');
});

let msg = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

io.on('connection', socket =>{
    console.log(`User ID: ${socket.id}`);
    socket.emit('previewURL', msg);
    socket.on('url', data => {
        socket.broadcast.emit('url_res', data);
    });
    socket.on('action', function(msg) {
        console.log('pegou' + msg.action);
        socket.broadcast.emit('action_response', msg);
    });
});
server.listen(process.env.PORT || 3000);
console.log("https://localhost:"+process.env.PORT);
