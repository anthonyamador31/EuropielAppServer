const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const PassportLocal = require('passport-local').Strategy;
//const userAgent = require('user-agents');
const Request = require('request');

//const device = require('express-device');
//const typedeviceos = require('mobile-detect');
const useragent = require('express-useragent');
const fs = require("fs")
const app = express()

const http = require('http')
// Certificate
//const privateKey = fs.readFileSync(__dirname + '/data/privkey.pem', 'utf8');
//const certificate = fs.readFileSync(__dirname + '/data/fullchain.pem', 'utf8');
//const ca = fs.readFileSync('/etc/letsencrypt/live/europiel.fazguz.com/chain.pem', 'utf8');
//const credentials = {
//	key: privateKey,
//	cert: certificate,
//	ca: ca
//};
const httpServer = http.createServer(app)
//const httpsServer = http.createServer(credentials, app)
//const path = require('path');
//const dir = path.join(__dirname, 'resources');


app.use(express.urlencoded({ extended: true}));

app.use(cookieParser('top secret'));

app.use(session({
    secret: 'top secret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(useragent.express());
//app.use(device.capture());
//app.use(typedeviceos.headers());
app.use("/resources", express.static(__dirname + '/resources'));
app.use("/.well-known/acme-challenge/", express.static(__dirname + '/.well-known/acme-challenge', { dotfiles: 'allow' }));
passport.use(new PassportLocal(function(username, password,done){
    /*if(username === "codigoF" && password === "1234")
        return done(null,{ id: 1, name: "Europiel" });

    done(null, false);*/

    Request.get({
        "headers": { 
            "ApiKey": "D7IVnus4m0IpE326wxr3whYQJU9EcAjL",
            "Username": username,
            "Password": password
        },
        "url": "http://app.europiel.com.mx/api/CustomerExperience/Login"
    }, (error, response, body) => {
        if(error) {
            return done(null, false);
            return console.dir(error);
        }

        if(response.statusCode === 200){
            console.dir(JSON.parse(body));
            return done(null,{ id: 1, name: "Europiel" });
        } else {
            console.dir(JSON.parse(body));
            return done(null, false);
        }
        
    });

}));
// { id: 1, name: "Europiel" }
// 1 = > Serialización
passport.serializeUser(function(user, done){
    done(null,user.id);
})

// Deserialización
passport.deserializeUser(function(id,done){
    done(null, { id: 1, name: "Europiel" });
})

app.set('view engine', 'ejs');

app.get("/", (req,res,next)=>{

	        console.log("test")

    if(req.isAuthenticated()) return next();

    res.redirect("login");
},(req,res)=>{
    // Si ya iniciamos mostrar bienvenida
    
    //res.send(req.useragent.isiPhone);
    
    var resultDevA = req.useragent.isAndroid
    var resultDevi = req.useragent.isiPhone
    
    if(resultDevi == true){
        res.render("iOS");
    
    } else if(resultDevA == true){
        res.render("android");

    } else {    
        res.send("No es compatible con su dispositivo");
    }
    /*let deviceStr = getMobileOperatingSystem();
    if(deviceStr === "iOS"){
        res.render("iOS"); //res.send("Hola iOS");
    } else if(deviceStr === "Android"){
        res.render("android"); //res.send("Hola Android");
    } else {
        res.send("No es movil"); //res.render("iOS");
    }*/
    //Sino hemos iniciado sesión redireccionar a /login
    
})

app.get("/login",(req,res)=>{
    //Mostrar formulario de login
	console.log("test")
    res.render("login");
})

app.post("/login", passport.authenticate('local',{
    //Recibir credenciales e iniciar sesión
    successRedirect: "/",
    failureRedirect: "/login"
}));


//app.listen(80,()=> console.log("Server started"));
//serverA.listen(8080, '127.0.0.1', () => console.log("Server started"));
//serverA.listen(8080, '54.234.91.3', () => console.log("Server started"));

/*function getMobileOperatingSystem(){

    if (/Android/.test(userAgent)) {
        return "Android";
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    return "unknown";
}*/


app.post('/android', function (req, res){
    console.log("download version Adroid");
});

app.post('/iOS', function (req, res){
    console.log("download version iOS");
});

httpServer.listen(3000, () => console.log("Server start"));
//httpsServer.listen(443, ()=>console.log("servert start on 443"));

