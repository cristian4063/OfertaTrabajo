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
        
        if(i == 0)
        {
            texto += '<div class="container">' +
                        '<div class="toggle-2">' +
                            '<a href="#" onclick="guardarNoticia(1)" class="deploy-toggle-2 toggle-2">' +
                                'Auxiliar de servicio general' +
                            '</a>' +
                        '<div class="toggle-content">' +
                            '<p style="text-align:justify;">' +
                                '<label>' +
                                    'Fecha Publicación: 02/08/2014</label><br />' +
                                'Importante temporal requiere para su equipo de trabajo, mujer con experienica minima de un años como auxiliar de servicio general, preferiblemnete que haya trabajo en aseo capital,responsable, honesta y trabajadora.' +
                                'Actvidad: asear los frentes de las casas del cojunto, aseo de oficina, recoger y sacar la basura.' +
                            '</p>' +
                            '<div class="toggle-content" style="display:block;">' +
                                '<p><strong>Datos del Empleador:</strong></p>' +
                                '<div class="one-half-responsive ">' +
                                    '<div class="submenu-navigation">' +
                                        '<div class="submenu-nav-items" style="overflow: hidden; display: block;"></div>' +
                                        '<a href="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                            '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                '<li class="right-list">Tel. 33347-14189</li>' +
                                            '</ul>' +
                                        '</a>' +
                                        '<a href="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                            '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                '<li class="right-list">Ciudad: Bogotá </li>' +
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
                '</div>' +
                '</div>';
        }
        else if(i == 1) 
        {
            texto += '<div class="container">' +
                    '<div class="toggle-2">' +
                        '<a href="#" onclick="guardarNoticia(2)" class="deploy-toggle-2">' +
                            'Oficial de obra civil' +
                        '</a>' +
                        '<div class="toggle-content">' +
                            '<p style="text-align:justify;">' +
                                '<label>' +
                                    'Fecha Publicación: 02/08/2014</label><br />' +
                                'Debe saber leer y escribir, debe ser bachiller y tener preferiblemente' +
                                '2 años de experiencia como oficial de construcción u oficial de obra en' +
                                'el sector de hidrocarburos' +
                            '</p>' +
                            '<div class="toggle-content">' +
                                '<p><strong>Datos del Empleador:</strong></p>' +
                                '<div class="one-half-responsive ">' +
                                    '<div class="submenu-navigation">' +
                                        '<div class="submenu-nav-items" style="overflow: hidden; display: block;"></div>' +
                                        '<a href="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                            '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                '<li class="right-list">Tel. 33342-10170</li>' +
                                            '</ul>' +
                                        '</a>' +
                                        '<a href="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                            '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                '<li class="right-list">Castilla la nueva</li>' +
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
        else
        {
            texto += '<div class="container">' +
                    '<div class="toggle-2">' +
                        '<a href="#" onclick="guardarNoticia(2)" class="deploy-toggle-2">' +
                            'Ingenieros en construcción y obras civiles' +
                        '</a>' +
                        '<div class="toggle-content">' +
                            '<p style="text-align:justify;">' +
                                '<label>' +
                                    'Fecha Publicación: 02/08/2014</label><br />' +
                                'Experiencia superior a 3 años en diseños de sistemas de acueductos' +
                                'con manejo de programas como autocad, arcgis, entre otros más, trabajo en equipo' +
                                'trabajo bajo presión entre otros' +
                            '</p>' +
                            '<div class="toggle-content">' +
                                '<p><strong>Datos del Empleador:</strong></p>' +
                                '<div class="one-half-responsive ">' +
                                    '<div class="submenu-navigation">' +
                                        '<div class="submenu-nav-items" style="overflow: hidden; display: block;"></div>' +
                                        '<a href="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                            '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                '<li class="right-list">Tel. 33342-10170</li>' +
                                            '</ul>' +
                                        '</a>' +
                                        '<a href="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                            '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                '<li class="right-list">Castilla la nueva</li>' +
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
        
    }

    $("#ofertas").html(texto);

    $('.deploy-toggle-2').click(function(){
        $(this).parent().find('.toggle-content').toggle(100);
        $(this).toggleClass('toggle-2-active');
        return false;
    });

}



$(document).ready(function () {
    if (localStorage.getItem("nombreUsuario") != null) {
        localStorage.setItem("nombreUsuario", localStorage.getItem("nombreUsuario"));
        $("#opc_Registrar").show();
        $("#opc_VerMias").show();
        $('#user_login').text = "Log In";
    }
    else{
        $("#opc_Registrar").hide();
        $("#opc_VerMias").hide();
        $('#user_login').text = "Log Out";
    }

});


