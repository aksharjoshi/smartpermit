var http = require('http');
var optionsget = {
    host : 'localhost', //localhost
    port : 8181,
    path : '/recommend?permitId=1&count=2',  
    method : 'GET'
};

http.createServer(function (request, response) {
   console.info('Do the GET call');
 
// do the GET request
var reqGet = http.request(optionsget, function(res) {
    console.log("statusCode: ", res.statusCode); 
    res.on('data', function(d) {
        console.info('GET result:\n');
        // data output
        process.stdout.write(d);
        console.info('\n\nCall completed');
    });
 
});
 
reqGet.end();
reqGet.on('error', function(e) {
    console.error(e);
});

   // Send the HTTP header 
   // HTTP Status: 200 : OK
   // Content Type: text/plain
   response.writeHead(200, {'Content-Type': 'text/plain'});
   
   // Send the response body as "Hello World"
   response.end('done');
}).listen(8081);

// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');



 

