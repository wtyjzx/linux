const net = require('net')




net.createServer(sock =>{
	sock.on('data',data => console.log(data.toString()))
}).listen(7001,() => console.log(7001))