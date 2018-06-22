const  https = require('https')
const  http = require('http')
const fs = require('fs')
const net = require('net')
const server = createServer()
	


const port = 443

server.on('request',function(req, res){
	if (req.url.startWith('http://')) {
		var urlObj = url.parse(req.url)

		delete req.headers['proxy-connection']

		http.request({
			host: urlObj.hostname,
			port: urlObj.port  || 80,
			method: urlObj.method,
			path: urlObj.path,
			query: urlObj.query,
			headers: req.headers,

		}, response => {
			res.wirteHead(response.statusCode, response.headers)
			response.pipe(res)
		}).end()
	} else{
		res.end('hello')
	}
})

server.on('connect', function(req, socket, head){
	var [host, port] = req.url.split(':')
	var serverSock = net.connect(port, host, ()=>{
		socket.write('HTTP/1.1 200 Connect Established\r\n\r\n')
		socket.pipe(serverSock).pipe(socket)
	})
	serverSock.on('error',() =>{
		serverSock.end()
	})
	socket.on('error',() => {
		socket.end()
	})
})

server.listen(port,() => console.log(port))

function createServer(){
	if (process.platform === 'linux') {
		return https.createServer({
	key:fs.readFileSync('/root/.acme.sh/h.wjtzyx.me/h.wjtzyx.me.key'),
	cert:fs.readFileSync('/root/.acme.sh/h.wjtzyx.me/h.wjtzyx.me.cer'),
	})
   } else {
   	return http.createServer()
   }
}


