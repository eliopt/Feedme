var http = require('http');
var express = require('express');
var app = express();
var fs = require('fs');
var mysql = require('mysql');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cookieParser = cookieParser('your secret sauce');
var sessionStore = new session.MemoryStore();
var gm = require('googlemaps');
var stripe = require("stripe")("sk_test_TgKHpDlEbm8d2pU7eCwocNZA");
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'feedme'
});
connection.connect();
function extractFromAdress(components, type) {
    for (var i = 0; i < components.length; i++)
        for (var j = 0; j < components[i].types.length; j++)
            if (components[i].types[j] == type) return components[i].long_name;
    return "";
}
app.use(cookieParser)
    .use(session({
        secret: 'zetezt',
        store: sessionStore,
        resave: true,
        saveUninitialized: true
    })).get('/', function(req, res) {
        session = req.session;
        if(session.panier === undefined) session.panier = [];
        if(session.me === undefined) session.me = [];
        res.render('index.ejs', {});
    })
    .get('', function(req, res) {
        session = req.session;
        if(session.panier === undefined) session.panier = [];
        if(session.me === undefined) session.me = [];
        res.render('index.ejs', {});
    })
    .get('/:dir/:file', function(req, res) {
        var dir = req.params.dir;
        if (dir == 'js' || dir == 'css' || dir == 'img') {
            fs.readFile('./' + req.params.dir + '/' + req.params.file + '', function read(err, data) {
                if (err) {
                    res.status(404);
                    res.render('404.ejs', {
                        url: req.url
                    });
                } else {
                    res.end(data);
                }
            });
        } else {
            res.status(404);
            res.render('404.ejs', {
                url: req.url
            });
        }
    })
    .use(function(req, res, next) {
        res.status(404);
        res.render('404.ejs', {
            url: req.url
        });
    });
var server = http.createServer(app).listen(8080, function() {
    console.log("Express server listening on port 8080");
});
var io = require('socket.io').listen(server);
io.on('connection', function(socket) {
    socket.on('panierCount', function (data) {
        if(session.panier !== undefined) var panierLength = session.panier.length;
        if(panierLength == 0) panierLength = '';
        socket.emit('panierCount', {panierCount:panierLength});
    });
    socket.on('getItems', function(post) {
        connection.query('SELECT * FROM produits WHERE kind = "'+post['kind']+'" AND quantite != 0', function(err, rows) {
            if(!err) {
                socket.emit('getItems', {items:rows});
            } else {
                console.log(err);
            }
        });
    });
    socket.on('caisse', function(post) {
        if(session.total >= 35) {
            socket.emit('caisse', {});
        } else {
            socket.emit('err', {message:'Vous devez commander au moins 35€.'});
        }
    });
    socket.on('panierDelete', function(post) {
        for(var key in session.panier) {
            if(session.panier[key]['id'] == post['id']) {
                session.panier.splice(key, 1);
                session.save();
                if(key == session.panier.length) {
                    socket.emit('panierDelete', {});
                }
            }
        }
    });
    socket.on('perso', function(post) {
        if(post['adresse'] && !isNaN(post['cp']) && post['cp'].length == 5) {
            gm.geocode(post['adresse']+' '+post['cp'], function(err, data){
              if(!err) {
                if(extractFromAdress(data['results'][0].address_components, "locality") == 'Paris') {            
                    socket.emit('perso', {});
                    session.me['adresse'] = post['adresse'];
                    session.me['cp'] = post['cp'];
                    session.save();
                } else {
                    socket.emit('err', {message:'Feedme ne livre pour le moment qu\'à Paris!'});
                }
              } else {
                console.log(err);
              }
            });
        } else {
            socket.emit('err', {message:'Les données semblent être erronées!'});
        }
    });
    socket.on('checkout', function(post) {
        if(!isNaN(post['telephone']) && (post['telephone'].length == 10 || post['telephone'].length == 11) && /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(post['email'])) {
            socket.emit('checkout', {});
            session.me['telephone'] = post['telephone'];
            session.me['email'] = post['email'];
            session.save();
            connection.query('INSERT INTO commandes(email, adresse, montant, detail, telephone, status) VALUES("'+session.me['email']+'", "'+session.me['adresse']+' '+session.me['cp']+'", "'+session.total*100+'", "'+JSON.stringify(session.panier).replace(/"/g, '\\"')+'", "'+session.me['telephone']+'", 0)', function(err, infos) {
                if(!err) {
                    session.idCommande = infos.insertId;
                    session.save();
                } else {
                    console.log(err);
                }
            });
            var i = 0;
            for(var key in session.panier) { 
                var row = session.panier[key];
                connection.query('SELECT * FROM produits WHERE id = "'+row['id']+'"', function(err, rows) {
                    if(!err) {
                        var quantite = rows[0]['quantite'];
                        var roww = session.panier[i];
                        quantite = quantite - roww['count'];
                        i++;
                        connection.query('UPDATE produits SET quantite = "'+quantite+'" WHERE id = "'+roww['id']+'"', function(err, rows) {
                            if(!err) {
                            } else {
                                console.log(err);
                            }
                        });
                    } else {
                        console.log(err);
                    }
                });
            }
        } else {
            socket.emit('err', {message:'Les données semblent être erronées!'});
        }
    });
    socket.on('panier', function(post) {
        var items = [];
        var total = 0;
        var i = 0;
        if(session.panier.length == 0) {
            socket.emit('err', {message:'Le panier est vide!'});
        } else {
            for(var key in session.panier) {
                var row = session.panier[key];
                connection.query('SELECT * FROM produits WHERE id = "'+row['id']+'"', function(err, rows) {
                    var roww = session.panier[i];
                    if(!err) {
                        total = total + rows[0]['prix'] * roww['count'];
                        i++;
                        items.push({'titre':rows[0]['titre'], 'description':rows[0]['description'], 'id':rows[0]['id'], 'prix':rows[0]['prix'], 'provenance':rows[0]['provenance'], 'kind':rows[0]['kind'], 'count':roww['count']});
                        if(i == session.panier.length) {          
                            socket.emit('panier', {
                                items: items,
                                total: total
                            });
                            session.total = total;
                            session.save();
                        }
                    } else {
                        console.log(err);
                    }
                });
            }
        }  
    });
    socket.on('payer', function(post) {
        var stripeToken = post.token;
        var charge = stripe.charges.create({
          amount: session.total*100, // amount in cents, again
          currency: "eur",
          card: stripeToken,
          description: session.me['email']
        }, function(err, charge) {
          if (err && err.type === 'StripeCardError') {
            socket.emit('err', {message:err});
          } else {
            connection.query('UPDATE commandes SET status = 1 WHERE id = "'+session.idCommande+'"', function(err, rows) {
                if(!err) {
                    socket.emit('err', {message:'Votre payement a été accepté!'});
                    socket.emit('payer', {});
                } else {
                    console.log(err);
                }
            });
          }
        });
    });
    socket.on('panierClear', function(post) {
        //session.panier = [];
        session.destroy();
    });
    socket.on('addPanier', function(post) {
        connection.query('SELECT * FROM produits WHERE id = "'+post['id']+'"', function(err, rows) {
            if(!err) {
                if(rows[0]['quantite'] >= post['count']) {
                    var ok = 0;
                    for(var key in session.panier) {
                        if(session.panier[key]['id'] == post['id']) {
                            ok = 1;
                            session.panier[key]['count'] = parseInt(session.panier[key]['count']) + parseInt(post['count']);
                        }
                    }
                    if(ok == 0) {
                        session.panier.push(post);
                    }
                    if(session.panier.length == 0) {
                        session.panier.push(post);
                    }
                    session.save();
                } else {
                    socket.emit('err', {message:'Le produit n\'existe pas dans ces quantités.'});
                }
            } else {
                console.log(err);
            }
        });
    });
});