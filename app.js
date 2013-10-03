var express = require("express");
 
var app = express();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/dist');  
  app.use(express.bodyParser());  
  app.use(express.static(__dirname + '/dist'));
  app.use(app.router);
  app.engine('html', require('ejs').renderFile);
});

app.get('/', function(request, response) {
  response.render('index.html')
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
