const fs = require('fs');

const requestHandler=(req,res)=>{
    const url =req.url;
    const method = req.method
    if(url ==='/'){
        res.setHeader('Content-Type','text/html');
    res.write('<HTML>');
    res.write('<header><title>Enter Message</title></header>');
    res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button tpe="submit">Send</botton></form></body>')
    res.write('</HTML>');
    return res.end();
    }
    if(url==='/message' && method==='POST'){
        const body=[];
        req.on('data',(chunk)=>{
            console.log(chunk);
            body.push(chunk);
        });
        return req.on('end',()=>{
            const parsedBody=Buffer.concat(body).toString();
            const message=parsedBody.split('=')[1];
            fs.writeFile('message.text',message, err =>{
                res.statusCode=302;
                res.setHeader('Location','/');
                return res.end();
            });
        });
        
    }
    res.setHeader('Content-Type','text/html');
    res.write('<HTML>');
    res.write('<header><title>fisrt page</title></header>');
    res.write('<body><h1>hello</h1></body>')
    res.write('</HTML>');
    res.end();

};

module.exports = requestHandler;