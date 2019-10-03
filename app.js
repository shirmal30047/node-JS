const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;

const rootDir = require('./util/path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));

app.use((req, res, next) => {
    // User.findById(1).then(user => {
    //     req.user = user;
    //     next();
    // }).catch(err => {
    //     console.log(err);

    // })
    next();
});

app.use('/admin', adminRoutes);
// app.use(shopRoutes);

app.use('/', errorController.get404);

const port = 3000;

mongoConnect(()=>{
    app.listen(port,()=>{
        console.log('Running on :'+port);
        
    });
})

