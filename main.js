const http = require('http');
const fs = require('fs');
const mime = require('mime-types');
const url = require('url');
let port = 80;
let htdocs = __dirname+'/htdocs';
try{
    const server = http.createServer();
    server.listen(port);
    server.on('listening', ()=>{
        greenColour("Server Started on PORT:"+port);
    });
    server.on(  'request', ( req, res )=>{
        greenColour( "[REQUEST][IP: "+req.connection.remoteAddress+" ] "+req.url );
        let urlparsed = url.parse(req.url, true);
        let query = urlparsed.query;
		if( fs.existsSync( htdocs+urlparsed.pathname ) ){
			let fileStats = fs.statSync( htdocs+urlparsed.pathname );
			if( fileStats.isDirectory() ){
				if( fs.existsSync( htdocs+urlparsed.pathname+"/index.html" ) ){
					streamFile( res, htdocs+urlparsed.pathname+"/index.html" );
				} else {
					notFound( res, "index.html" );
				}
			} else {
				streamFile( res, htdocs+urlparsed.pathname );
			}
		} else {
			redColour( "File: "+urlparsed.pathname+" not found" );
            notFound( res, urlparsed.pathname );
		}
    } );
}catch( err ){
    redColour( err );
}
greenColour = ( text )=>{
    console.log("\x1b[32m",text);
}
redColour = ( text )=>{
    console.log("\x1b[31m",text);
}
streamFile = ( res, file )=>{
	try{
		let fileStream = fs.createReadStream( file );
		fileStream.pipe( res );
		fileStream.on('close', ()=>{
			res.end();
		});
    }catch( err ){
        redColour( err );
        serverIternalServerError( res, err);
    }
}
notFound = ( res, file )=>{
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.write( "<head><title>404 not found</title></head><body><center><h1>404 Not Found</h1><p>"+file+" not found</p></center></body>" );
    res.end();
}
serverIternalServerError = ( res, error )=>{
    res.writeHead(500, {'Content-Type': 'text/html'});
    res.write( "<head><title>500 Internal Server Error</title></head><body><center><h1>500 Internal Server Error<h1><p>"+error+"</p></center></body>" );
    res.end();
}
