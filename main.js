const http = require('http');
const fs = require('fs');
const mime = require('mime-types');
const url = require('url');
let port = 80;
let htdocs = __dirname+'/htdocs';
let methods = {};
const server = http.createServer();
server.listen(port);
server.on('listening', ()=>{
    console.log("Server Started on PORT:"+port);
});
server.on('request', ( req, res )=>{
    let urlParsed = url.parse(req.url);
    console.log("REQUEST: "+urlParsed.path);
    if(urlParsed.pathname == '/'){
        methods.sendFile( res, "/index.html");
    }else{
        methods.sendFile( res, urlParsed.pathname );
    }
});
methods.sendFile = ( res, file )=>{
    let filePath = htdocs+file;
    if( fs.existsSync( htdocs+file ) ){
        let fileStream = fs.createReadStream( filePath );
        fileStream.pipe( res );
        fileStream.on('close', ()=>{
            res.end();
        });
    }else{
        methods.notFound( res );
    }
}
methods.notFound = ( res )=>{
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("<head><title>Not Found</title></head><body><center><h1>File Not Found</h1></center></body>");
    res.end();
}