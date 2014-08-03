var id = 0;
var listaId = "";

function configurar_db() {

    function execute(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS usuarios (usuario, password)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS noticias (id)');
        tx.executeSql('INSERT INTO usuarios (usuario, password) VALUES ("john", "202cb962ac59075b964b07152d234b70")');
        tx.executeSql('INSERT INTO usuarios (usuario, password) VALUES ("juan", "912ec803b2ce49e4a541068d495ab570")');
    }

    function error(error) {
        console.log("Error al configurar base de datos", error)
    }

    function exito() {
        console.log("Configuración exitosa")
    }

    var db = window.openDatabase("bd_reportes", "1.0", "Reporte Vial", 200000);
    db.transaction(execute, error, exito);

}

function guardarMarcador() {
    var db = window.openDatabase("bd_reportes", "1.0", "Guardar Marcador", 100000);
    db.transaction(GuardarMarca, errorOperacion, operacionEfectuada);
}

function GuardarMarca(tx) {
    var latitud = localStorage.getItem("latitud");
    var longitud = localStorage.getItem("longitud");
    var texto = localStorage.getItem("texto");
    
    tx.executeSql('INSERT INTO marcadores (latitud, longitud, texto) VALUES ("' + latitud + '", "' + longitud + '", "' + texto + '")');
}

/*Guarda en bd las noticias que no considera nuevas*/

function guardarNoticia(ident){
    
    var n = listaId.indexOf("" + ident + "");

    if(n == -1)
    {
        listaId += ident;
        localStorage.setItem("listaId", listaId);
    }
}

function guardarNoticia1(ident) {
    id = ident;
    var db = window.openDatabase("bd_reportes", "1.0", "Gestionar Noticia", 100000);
    db.transaction(EliminarNoticia, errorOperacion, operacionEfectuada);
    db.transaction(GuardarNoticia, errorOperacion, operacionEfectuada);
}

function EliminarNoticia(tx) {
    tx.executeSql('DELETE FROM noticias WHERE id = "' + id + '"');
}

function GuardarNoticia(tx) {
    tx.executeSql('INSERT INTO noticias (id) VALUES ("' + id + '")');
}

// Transaction error callback
function errorOperacion(err) {
    console.log(err);
    alert("Error de operación: " + err);
}

function operacionEfectuada() {
    console.log("Operación Exitosa!");
}

function cargarOfertas()
{
    var texto = "";
    var ofertas = $("#ofertas");
    ofertas.empty();

    for(var i = 0; i < 3; i++) {
        
        texto += '<div class="container">' +
                    '<div class="toggle-2">' +
                        '<a href="#" onclick="guardarNoticia(1)" class="deploy-toggle-2">' +
                            'Comienza traslado de Avianca al nuevo aeropuerto El Dorado' +
                        '</a>' +
                        '<div class="toggle-content">' +
                            '<p style="text-align:justify;">' +
                                '<label>' +
                                    'Fecha Publicación: 01/06/2014</label><br />' +
                                'A partir de mañana 8 de junio, Avianca estará atendiendo desde el terminal T1 en' +
                                'el Aeropuerto El Dorado a los viajeros que vuelan entre Bogotá y Barranquilla, Bucaramanga,' +
                                'Cali, Cartagena, Medellín, Pasto, Pereira y San Andrés.' +
                            '</p>' +
                            '<div class="toggle-content">' +
                                '<p><strong>Datos del Empleador:</strong></p>' +
                                '<div class="one-half-responsive ">' +
                                    '<div class="submenu-navigation">' +
                                        '<div class="submenu-nav-items" style="overflow: hidden; display: block;"></div>' +
                                        '<a href="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                            '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                '<li class="right-list">Tel. 3116099950</li>' +
                                            '</ul>' +
                                        '</a>' +
                                        '<a href="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                            '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                '<li class="right-list">Correo: arturogomez@gmail.com </li>' +
                                            '</ul>' +
                                        '</a>' +
                                        '<a href="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                            '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                '<li class="right-list">Cliente consumidor de grandes cantidades de naranja</li>' +
                                            '</ul>' +
                                        '</a>' +
                                        '<a href="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                            '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                '<li>' +
                                                    '<img src="images/misc/facebook.png" class="star" onclick="abrirPaginaFacebook()">' +
                                                    '<img src="images/misc/twitter.png" class="star" style="margin-left: 5px;" onclick="abrirPaginaTwitter()">' +
                                                '</li>' +
                                            '</ul>' +
                                        '</a>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>'; 
    }

    $("#ofertas").html(texto);

    $('.deploy-toggle-2').click(function(){
        $(this).parent().find('.toggle-content').toggle(100);
        $(this).toggleClass('toggle-2-active');
        return false;
    });

}