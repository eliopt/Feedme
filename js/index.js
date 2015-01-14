//vars
Stripe.setPublishableKey('pk_test_8AYuULi204AF3jvVUubOQwEH');
socket = io('http://localhost');

//click methods
$('.sidebar ul li a').click(function() {
    if (!$(this).parent().hasClass('active')) {
        $('.sidebar ul li.active').removeClass('active');
        $(this).parent().addClass('active');
        $('.content').text('');
        socket.emit('getItems', {
            kind: $(this).parent().attr('data-kind')
        });
    }
});
function payer() {
    if (number = Stripe.card.validateCardNumber($('.card-number').val())) {
        if (expiry = Stripe.card.validateExpiry($('.card-month').val(), $('.card-year').val())) {
            if (cvc = Stripe.card.validateCVC($('.card-cvc').val())) {
                Stripe.card.createToken({
                    number: $('.card-number').val(),
                    cvc: $('.card-cvc').val(),
                    exp_month: $('.card-month').val(),
                    exp_year: $('.card-year').val()
                }, stripeResponseHandler);
            } else {
                swal('Erreur!', 'Le numéro secret est invalide.', 'error');
                setTimeout(falseDisable, 1000);
            }
        } else {
            swal('Erreur!', 'La date d\'expiration est invalide.', 'error');
            setTimeout(falseDisable, 1000);
        }
    } else {
        swal('Erreur!', 'Le numéro de carte est invalide.', 'error');
        setTimeout(falseDisable, 1000);
    }
}
function panier() {
    socket.emit('panier', {
        call: 'panier'
    });
}
$('.addPanier').click(function() {
    if ($('.modal').attr('data-id') && $('.kg').val() >= 1) {
        socket.emit('addPanier', {
            id: $('.modal').attr('data-id'),
            count: Math.round(parseFloat($('.kg').val()))
        });
        $('.modal').hide();
    } else {
        swal('Vous devez entrer un nombre!');
    }
});
function panierDelete(id) {
    socket.emit('panierDelete', {
        id: id
    });
}
function caisse() {
    socket.emit('caisse', {});
}
function perso() {
    socket.emit('perso', {
        adresse: $('.adresse').val(),
        cp: $('.cp').val(),
        nom: $('.nom').val()
    });
}
function checkout() {
    socket.emit('checkout', {
        telephone: $('.telephone').val(),
        email: $('.email').val()
    });
}

//stripe
function stripeResponseHandler(status, response) {
    if (response.error) {
        swal('Erreur!', response.error.message, 'error');
    } else {
        var token = response.id;
        socket.emit('payer', {
            token: token
        });
    }
}

//document and global methods
$(document).ready(function() {
    socket.emit('getItems', {
        kind: 'vegetable'
    });
    panierCount();
});
function panierCount() {
    socket.emit('panierCount', {});
    setTimeout(panierCount, 1000);
}
function imgBack() {
    $('img').each(function() {
        if ($(this).css('backgroundImage') === 'none' || $(this).parent().parent().hasClass('modal')) $(this).css('backgroundImage', 'url("' + $(this).attr('data-src') + '")');
    });
}
function falseDisable() {
    $('button.btn').attr('disabled', false);
}
function gridify() {
    var options = {
        srcNode: '.item', // grid items (class, node)
        margin: '20px', // margin in pixel, default: 0px
        width: '250px', // grid item width in pixel, default: 220px
        max_width: '300px', // dynamic gird item width if specified, (pixel)
        resizable: true, // re-layout if window resize
        transition: 'none' // support transition for CSS3, default: all 0.5s ease
    }
    document.querySelector('.content').gridify(options);
}

//server events
socket.on('panierCount', function(data) {
    $('.panier span').text(data['panierCount']);
});
socket.on('payer', function(data) {
    socket.emit('panier', {
        call: 'facture'
    });
});
socket.on('facture', function(data) {
    socket.emit('panierClear', {});
    swal('Votre payement a bien été accepté!', '', 'success');
    $('.status').text('Facture');
    $('.content').addClass('noPadding');
    $('.content').removeClass('box');
    $('.content').text('');
    $('.search').hide();
    $('.sidebar .active').removeClass('active');
    var table = $(document.createElement('table'));
    for (var key in data['items']) {
        var row = data['items'][key];
        if (row['kind'] == 'vegetable') var par = ' kg';
        else var par = '';
        table.append($(document.createElement('tr')).append($(document.createElement('td')).html('' + row['titre'])).append($(document.createElement('td')).text(row['count'] + par)).append($(document.createElement('td')).text((row['prix'] * row['count']).toFixed(2) + '€')));
    }
    table.append('<tr class="total"><td>Total</td><td></td><td>' + data['total'].toFixed(2) + '</td>');
    $('.content').append(table).append('<div class="panierControls"><a href="#" onClick="window.print();" class="btn btnPrimary"><i class="fa fa-print"></i> Imprimer</a></div>');
});
socket.on('err', function(data) {
    if (data['message'] == 'Le panier est vide!') {
        $('.sidebar ul li:first-child a').click();
    }
    swal(data['message'], '', 'error');
    $('button.btn').attr('disabled', false);
});
socket.on('panier', function(data) {
    $('.status').text('Panier');
    $('.content').addClass('noPadding');
    $('.content').removeClass('box');
    $('.content').text('');
    $('.search').hide();
    $('.sidebar .active').removeClass('active');
    var table = $(document.createElement('table'));
    for (var key in data['items']) {
        var row = data['items'][key];
        if (row['kind'] == 'vegetable') var par = ' kg';
        else var par = '';
        table.append($(document.createElement('tr')).append($(document.createElement('td')).html('<a href="#" onClick="panierDelete(' + row['id'] + ');">&times;</a> ' + row['titre'])).append($(document.createElement('td')).text(row['count'] + par)).append($(document.createElement('td')).text((row['prix'] * row['count']).toFixed(2) + '€')));
    }
    table.append('<tr class="total"><td>Total</td><td></td><td>' + data['total'].toFixed(2) + '</td>');
    $('.content').append(table).append('<div class="panierControls"><a href="#" onClick="caisse();" class="btn btnPrimary"><i class="fa fa-shopping-cart"></i> Caisse</a></div>');
});
socket.on('caisse', function(data) {
    $('.content').addClass('box');
    $('.status').text('Payement');
    $('.content').html('<h2>Adresse de livraison</h2><input class="nom" type="text" placeholder="Nom"><input type="text" class="adresse" placeholder="Adresse"><input type="text" class="cp" placeholder="Code postal"><input type="text" value="Paris" readonly><input type="text" value="France" readonly><button onClick="perso();$(this).attr(\'disabled\', \'true\');" class="btn btnPrimary">Suivant <i class="fa fa-angle-right"></i></button>');
});
socket.on('panierDelete', function(data) {
    panier();
});
socket.on('perso', function(data) {
    $('.box').html('<h2>Informations personnelles</h2><input class="email" type="text" placeholder="Email"><input class="telephone" type="text" placeholder="Telephone"><button onClick="checkout();$(this).attr(\'disabled\', \'true\');" class="btn btnPrimary">Payer <i class="fa fa-angle-right"></i></button>');
});
socket.on('checkout', function(data) {
    $('.box').html('<h2>Informations de payement</h2><input type="text" class="card-number" placeholder="Numéro de carte"><input type="text" class="card-cvc" placeholder="Numéro d\'identification"><input type="text" class="card-month" placeholder="Mois d\'expiration"><input type="text" class="card-year" placeholder="Année d\'expiration"><button onClick="payer();$(this).attr(\'disabled\', \'true\');" class="btn btnPrimary">Payer <i class="fa fa-angle-right"></i></button>');
});
$('#search').keyup(function() {
    $('.content div h3:contains(' + $(this).val() + ')').parent().parent().addClass('item').show();
    $('.content div h3:not(:contains(' + $(this).val() + '))').parent().parent().removeClass('item').hide();
    gridify();
});
socket.on('getItems', function(data) {
    $('.search').show();
    $('.status').text('Feedme');
    $('.content').removeClass('box');
    $('#search').focus();
    $('.content').removeClass('noPadding');
    for (var key in data['items']) {
        var row = data['items'][key];
        if (row['kind'] == 'vegetable') var par = '/kg';
        else var par = '';
        $('.content').append($(document.createElement('div')).addClass('item').attr('data-id', row['id']).attr('data-kind', row['kind']).append($(document.createElement('div')).append($(document.createElement('img')).attr('src', 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==').attr('data-src', './img/' + row['id'] + '.png')).append($(document.createElement('span')).addClass('prix').text(parseFloat(row['prix']).toFixed(2) + '€' + par + '')).append($(document.createElement('h3')).text(row['titre'])).append($(document.createElement('p')).html(row['description'] + '<span><i class="fa fa-map-marker"></i> ' + row['provenance'] + '</span>'))));
    }
    $('.item').click(function() {
        $('.modalContent img').attr('data-src', $(this).find('img').attr('data-src'));
        $('.modalContent h2').text($(this).find('h3').text());
        $('.modalContent p').html($(this).find('p').html());
        if ($(this).attr('data-kind') == 'vegetable') var par = 'kg';
        else if ($(this).attr('data-kind') == 'viande') var par = '0';
        else if ($(this).attr('data-kind') == 'lait') var par = '0';
        $('.modal input').attr('placeholder', par);
        $('.modal').attr('data-id', $(this).attr('data-id'));
        $('.modal').show();
        imgBack();
    });
    gridify();
    $('img').each(function() {
        imgBack();
    });
});