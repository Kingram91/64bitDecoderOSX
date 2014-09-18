 /*
    This is a simple TCP server for tests.
  */
  String.prototype.format = String.prototype.format = function () {
      var s = this,
          i = arguments.length;

      while (i--) {
          s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
      }
      return s;
  };

  var WebSocketServer = require('websocket').server;
  var http = require('http');
  var net = require('net'); // module that contains methods for creating both servers and clients.
  var fs = require('fs');
  var buffer = require('buffer');
  var clients = []; // Keep tack of clients connected
  var HOST = '10.2.5.104';
  var PORT = '1337';
  var FILEPATH = '/Users/kquanei/Downloads';
  
  var server = http.createServer(newSocket); // Start a TCP Server

  wsServer = new WebSocketServer({
    httpServer: server, autoAcceptConnections: false
  });
  
  server.listen(PORT, HOST, function () {
      address = server.address();
      console.log('Server Listening...\r');
      console.log('server bound to ' + PORT + '\n');
      console.log('Port Number: {0} \r'.format(address.port));
      console.log('IPAddress: {0} \r'.format(address.address));
      console.log('Address Family: {0} \r'.format(address.family));

      server.on('connection', function () {
          console.log('connection made...\n');
      });
  });

  wsServer.on('request', function(request){
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
            var b = new Buffer(message.utf8Data, 'utf8');
            var s = b.toString();
            console.log(s);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
  });

  connection.on('close', function(reasonCode, description){
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });
});

  // Callback method executed when a new TCP socket is opened.


  function newSocket(socket) {
      clients.push(socket);

      // Identify the client
      socket.name = socket.remoteAddress + ":" + socket.remotePort;

      socket.write('Welcome to the Server');


      // Recieve data from client
      socket.on('data', function (data) {
          receiveDataFromClient(socket, data);
      });

      //Remove the client from the list when it leaves
      socket.on('end', function () {
          closeSocket(socket);
      });

      socket.on('close', function (data) {
          console.log('CLOSED: ' + socket.remoteAddress + ' ' + socket.remotePort);
          closeSocket(socket);
      });
  }

  // Method executed when data is received from a socket


  function receiveDataFromClient(socket, data) {
      var cleanData = cleanInput(data);
      if (cleanData == "@quit") {
          socket.end('Connection ended\n');
      } else {
          //launchAppleScript();
          console.log('data received');
          console.log('The Client is expressing its desire to switch protocols from HTTP to WebSocket \nthrough the Upgrade Header: \n' + data);
          console.log('data is: \n' + data);
          var b64String = data;
          var buf = new Buffer(data, 'base64');
          console.log (buf);

          //         for (var i = 0; i < clients.length; i++) {
          //           if (clients[i] !== socket) {
          //             clients[i].write(data);
          //           }
          //         }
      }
  }

  // Method executed when a socket ends

  function closeSocket(socket) {
      var i = clients.indexOf(socket);
      if (i != -1) {
          clients.splice(i, 1);
      }
  }

  //Cleans the input of carriage return, newline


  function cleanInput(data) {
      return data.toString().replace(/(\r\n|\n|\r)/gm, "");
  }

  // Method executed when authorized client connects to server


 //  function launchAppleScript() {
//       var cp = require("child_process");
//       cp.exec('osascript AppleScriptXcodeBuild2.scpt');
//   }
