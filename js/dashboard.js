//vars
socket = io('http://localhost');

//documents methods
$(document).ready(function() {
    infos();
});
function box() {
    $('.content').addClass('box').addClass('noPadding');
    $('.addHide').hide();
}
function infos() {
    socket.emit('getInfos', {});
    //setTimeout(infos, 5000);
}
function accueil() {
    $('.homeHide').text('');
    $('.addHide').show();
    $('.content').removeClass('box').removeClass('noPadding');
}

//event methods
$('.search input').keyup(function() {
    $('.homeHide').html('<h2></h2>');
    if ($(this).val() == '') {
        accueil();
    } else if ((!isNaN($(this).val()) && ($(this).val().length == 10 || $(this).val().length == 11)) || /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($(this).val())) {
        commande($(this).val(), 'user');
    } else if (/c[0-9]+/.test($(this).val())) {
        commande($(this).val().replace(/c/, ''));
    } else if (/p[0-9]+/.test($(this).val())) {
        produit($(this).val().replace(/p/, ''));
        $('.content .homeHide').html('<h2></h2>');
    } else {
        socket.emit('search', {
            q: $(this).val()
        });
        $('.content .homeHide').html('<h2></h2>');
    }
});
function commandes() {
    box();
    $('.homeHide').html('<h2></h2>');
    socket.emit('commande', {});
}
function commande(id, user) {
    box();
    if (!user) socket.emit('commande', {
        id: id
    });
    else socket.emit('commande', {
        user: id
    });
}
function produit(id) {
    box();
    socket.emit('produit', {
        id: id
    });
}
function addProduit(id, titre, prix, description) {
    box();
    $('.homeHide').text('');
    if (id) var add = 'Modifier',
        quantite = '',
        addPrefix = 'edit',
        kind = '';
    else var add = 'Ajouter',
        quantite = '<input type="text" class="quantite" placeholder="Quantite disponible">',
        addPrefix = 'add',
        kind = '<select class="kind"><option value="vegetable">Fruits/Legumes</option><option value="viande">Boucherie</option><option value="lait">Produit laitier</option></select>';
    if (!titre) var titre = '';
    if (!id) var id = '';
    if (!prix) var prix = '';
    if (!description) var description = '';
    $('.homeHide').html('<h2>' + add + ' un produit</h2><input type="text" class="titre" placeholder="Titre" value="' + titre + '"><input type="text" class="prix" placeholder="Prix" value="' + prix + '"><input type="text" class="description" value="' + description + '" placeholder="Description">' + kind + '' + quantite + '<label class="btn" style="display:block;width:195px;"><i class="fa fa-file"></i> Choisir une vignette<input type="file" id="image"></label><a onClick="' + addPrefix + 'Product(' + id + ');" href="#" class="btn btnPrimary">' + add + '</a>');
    $('#image').on('change', function() {
        $(this).parent().find('i').css('color', 'rgb(230, 50, 50)');
    });
}
function status(id, status) {
    socket.emit('status', {
        id: id,
        status: status
    });
}
function addQuantite(id) {
    if (!id) var id = '';
    box();
    $('.homeHide').text('');
    $('.homeHide').html('<h2>Ajouter une quantite</h2><input type="text" class="ref" placeholder="Référence" value="p' + id + '"><input type="text" class="quantite" placeholder="Quantite à ajouter"><a href="#" onClick="addQuantity();" class="btn btnPrimary">Ajouter</a>');
}
function addQuantity() {
    if (parseInt($('.ref').val().replace(/p/, '')) && !isNaN($('.quantite').val())) {
        socket.emit('addQuantity', {
            ref: parseInt($('.ref').val().replace(/p/, '')),
            q: $('.quantite').val()
        });
    } else {
        swal('Erreur, vérifiez les champs!', '', 'error');
    }
}
function deleteRef(id) {
    socket.emit('deleteRef', {
        id: id
    });
}
function editProduct(id) {
    if (!isNaN($('.prix').val()) && $('.titre').val() !== '' && $('.prix').val() !== '') {
        if (document.getElementById('image').files[0]) {

            var file = document.getElementById('image').files[0],
                reader = new FileReader();
            reader.onload = function(evt) {
                socket.emit('editProduct', {
                    id: id,
                    prix: $('.prix').val(),
                    titre: $('.titre').val(),
                    description: $('.description').val(),
                    image: evt.target.result
                });
            };
            reader.readAsDataURL(file);
        } else {
            socket.emit('editProduct', {
                id: id,
                prix: $('.prix').val(),
                titre: $('.titre').val(),
                description: $('.description').val()
            });
        }
    } else {
        swal('Erreur, vérifiez les champs!', '', 'error');
    }
}
function addProduct() {
    if (document.getElementById('image').files[0] && !isNaN($('.prix').val()) && !isNaN($('.quantite').val()) && $('.titre').val() !== '' && $('.quantite').val() !== '' && $('.prix').val() !== '') {
        var file = document.getElementById('image').files[0],
            reader = new FileReader();
        reader.onload = function(evt) {
            socket.emit('addProduct', {
                prix: $('.prix').val(),
                titre: $('.titre').val(),
                quantite: $('.quantite').val(),
                description: $('.description').val(),
                kind: $('.kind').val(),
                image: evt.target.result
            });
        };
        reader.readAsDataURL(file);
    } else {
        swal('Erreur, vérifiez les champs!', '', 'error');
    }
}

//server events
socket.on('search', function(datas) {
    $('.homeHide').text('');
    box();
    for (var key in datas['rows']) {
        var data = datas['rows'][key];
        $('.homeHide').append('<div><h2>p' + data['id'] + ' — ' + data['titre'] + ' ' + data['prix'] + '€</h2><p>' + data['description'] + '<br/><a href="#" onClick="deleteRef(' + data['id'] + ');" class="btn btnPrimary">Supprimer la référence</a><a href="#" onClick="addProduit(' + data['id'] + ', \'' + data['titre'] + '\', \'' + data['prix'] + '\', \'' + data['description'] + '\');" class="btn">Modifier</a><a href="#" onClick="addQuantite(' + data['id'] + ');" class="btn">Ajouter un stock</a></p><hr/></div>')
    }
});
socket.on('commande', function(datas) {
    for (var key in datas['rows']) {
        var data = datas['rows'][key];
        $('.homeHide').append('<div class="c' + data['id'] + '"><h2></h2><p></p><table class="detail"></table><br/></div>');
        if (data['status'] == 0) var status = 'À payer';
        else if (data['status'] == 1) var status = 'Payé';
        else if (data['status'] == 2) var status = 'Préparé';
        else if (data['status'] == 3) var status = 'Livré';
        $('.c' + data['id'] + ' h2').html('c' + data['id'] + ' — ' + (data['montant'] / 100).toFixed(2) + '€ <span class="prix">' + status + '</span>');
        if (data['status'] == 1) var up = '<a href="#" onClick="status(' + data['id'] + ', 2);" class="btn">Paquet préparé</a><br/>';
        else if (data['status'] == 2) var up = '<a href="#" onClick="status(' + data['id'] + ', 3);" class="btn">Paquet envoyé</a><br/>';
        else var up = '';
        $('.c' + data['id'] + ' p').html('' + up + '<a href="mailto:' + data['email'] + '">' + data['email'] + '</a><br/><a href="tel:' + data['telephone'] + '">' + data['telephone'] + '</a>');
        socket.emit('panier', {
            panier: JSON.parse(data['detail']),
            call: 'detail',
            idC: data['id']
        });
    }
});
socket.on('status', function(data) {
    accueil();
});
socket.on('detail', function(data) {
    $('.c' + data['idC'] + ' table').text('');
    for (var key in data['items']) {
        var row = data['items'][key];
        $('.c' + data['idC'] + ' table').append('<tr><td>' + row['titre'] + '</td><td>' + row['count'] + '</td><td>' + (row['prix'] * row['count']).toFixed(2) + '€</td></tr>');
    }
    $('.c' + data['idC'] + ' table').append('<tr class="total"><td>Total</td><td></td><td>' + data['total'].toFixed(2) + '</td></tr>');
});
socket.on('produit', function(data) {
    $('.content .homeHide').html('<h2></h2><p></p><span class="quantite"></span>');
    $('.homeHide h2').html('p' + data['id'] + ' — ' + data['titre'] + ' <span class="prix">' + parseFloat(data['prix']).toFixed(2) + '€</span>');
    $('.homeHide p').html(data['description'] + '<br/><a href="#" onClick="deleteRef(' + data['id'] + ');" class="btn btnPrimary">Supprimer la référence</a><a href="#" onClick="addProduit(' + data['id'] + ', \'' + data['titre'] + '\', \'' + data['prix'] + '\', \'' + data['description'] + '\');" class="btn">Modifier</a><a href="#" onClick="addQuantite(' + data['id'] + ');" class="btn">Ajouter un stock</a>');
});
socket.on('deleteRef', function(data) {
    accueil();
    swal('La référence p' + data['id'] + ' a bien été supprimée.', '', 'success');
});
socket.on('noResults', function(data) {
    box();
    $('.homeHide h2').html('Aucun résultat');
});
socket.on('getInfos', function(data) {
    $('.nP').text(data['np']);
    $('.nC').text(data['nc']);
    $('.mE').text(data['me']);
});
socket.on('editProduct', function(data) {
    swal('La référence p' + data['id'] + ' a bien été modifiée.', '', 'success');
    accueil();
    infos();
    $('.search input').focus();
});
socket.on('addProduct', function(data) {
    swal('La référence p' + data['id'] + ' a bien été ajoutée.', '', 'success');
    accueil();
    infos();
    $('.search input').focus();
});
socket.on('addQuantity', function(data) {
    swal('La référence p' + data['ref'] + ' a bien été modifiée.', '', 'success');
    infos();
    accueil();
});
socket.on('err', function(data) {
    swal(data['message'], '', 'error');
});