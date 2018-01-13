const http = require('http'),
fs = require('fs'),
url = require('url'),
serverpublicDir = 'htdocs',
path = require("path"),
serverPort = 80;

http.createServer(function(req, res){
	clientId = req.socket.remoteAddress + ':'+ req.socket.remotePort;
	console.log('[REQUEST]'+ clientId + ' ' + req.url);
	if(req.url == '/'){
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(fs.readFileSync(serverpublicDir+'/index.html'));
	} else{
		if(fs.existsSync(serverpublicDir+req.url)){
			if(fs.statSync(serverpublicDir+req.url).isFile()){
				res.writeHead(200, {'Content-Type': 'text/html'});
				res.end(fs.readFileSync(serverpublicDir+req.url));
			}else{
				var files = [];
				fs.readdir(serverpublicDir+req.url, function(err, items){
					for(var i=0; i < items.length; i++){
						files.push('<p><a href='+req.url+'/'+items[i]+'>'+items[i]+'</a></p>');
					}
					res.writeHead(200, {'Content-Type': 'text/html'});
					res.end('<body><center>'+files+'</center></body>');
				});
			}
		}else{
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(fs.readFileSync('errors/404.html'));
		}
		
	}
}).listen(serverPort,function(err){
	console.log("WebServer Started on Port:"+serverPort);
	if(err){
		console.log(err);
	}
});