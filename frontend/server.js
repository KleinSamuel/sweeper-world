const express = require('express');

const port = process.env.PORT || 9080;

const app = express();

app.use(express.static('dist'));

app.listen(port, function(){
    console.log('[ OK ] server started on port '+port);
});