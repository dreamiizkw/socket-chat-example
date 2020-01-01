var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

const users = require('./user_data');
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


// ROUtE PAGE
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/room_2', function(req, res){
  res.sendFile(__dirname + '/room_name_2.html');
});

app.get('/example_form', function(req, res){
  res.sendFile(__dirname + '/example_form.html');
});


// api send data to client via socket
app.post('/send_data', (req, res) => {
  const roomName = req.body.roomName
  const message = req.body.message
  const user = users[req.body.userId]
  io.sockets.emit(roomName,JSON.stringify(user));
  res.status(200).json(user);
})

io.on('connection', (socket) => {
  console.log('a user connected');

  // listen to chat_message event
  socket.on('chat_message', (msg) => {
    console.log('message: ' + msg);
  });

  // listen to disconnect
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
