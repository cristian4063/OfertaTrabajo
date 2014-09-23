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

function cargarOfertas(palabra)
{
    MostrarDivCargando();
    var vectorConectores = ["a", "ante", "bajo", "con", "contra", "de", "desde", "en", "entre","hacia","hasta","para","por","según","segun","sin", "sobre","tras", " ", "  ", "   ", ""];
    //alert(palabra);
    if(palabra != ""){
        palabra = palabra.trim();
        var palabrasSeparadas = palabra.split(" ");
        var fraseDefinitiva = "";
        var palabraAuxiliar = "";

        for (x=0;x<palabrasSeparadas.length;x++){
            palabraAuxiliar = palabrasSeparadas[x];
            palabrasSeparadas[x] = palabraAuxiliar.trim().toLowerCase();
        }

        fraseDefinitiva += palabrasSeparadas[0];

        for (x=1;x<palabrasSeparadas.length;x++){
            if($.inArray(palabrasSeparadas[x], vectorConectores) == -1){
                fraseDefinitiva+=" AND ";
                fraseDefinitiva += palabrasSeparadas[x];
            }
        }

        palabra = fraseDefinitiva;
    }
    //alert(palabra);
    var texto = "";
    var ofertas = $("#ofertas");
    ofertas.empty();

    var nom_mun = localStorage.getItem('NombreMunicipio'); 
    var nom_sal = localStorage.getItem('NombreSalario'); 
    var nom_exp = localStorage.getItem('NombreExperiencia'); 
    var nom_niv = localStorage.getItem('NombreNivel'); 
    var municipio = localStorage.getItem('Municipio'); 
    var tipo = localStorage.getItem('Oportunidad');   
    var salario =  localStorage.getItem('Salario');
    var experiencia = localStorage.getItem('Experiencia');
    var nivel = localStorage.getItem('Nivel');

    $.ajax({
        url: 'http://apiempleo.apphb.com/api/Vacante/obtenerVacantes?palabra=' + palabra + '&tipo=' + tipo + '&salario=' + salario + '&experiencia=' + experiencia + '&nivel=' + nivel + '&municipio=' + municipio,
        type: 'POST',
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            var cantidad = data.length;
            if(cantidad==0){
                alert("No existen vacantes con los filtros seleccionados, intente seleccionando valores diferentes.")
            }
            $.each(data, function (i, val) {
                //alert(val['Titulo']);
                texto += '<div class="container">' +
                        '<div class="toggle-2">' +
                            '<a href="#" onclick="guardarNoticia(1)" class="deploy-toggle-2 toggle-2">' +
                                val['Titulo'] + '<label style="font-weight: bolder; font-size: 15px; color: black;">Vence en '+val['DiasVence']+' días</label>' +
                            '</a>' +
                        '<div class="toggle-content">' +
                            '<p style="text-align:justify;">' +
                                '<label>' +
                                    'Fecha Publicación: '+val['Fecha_publicacion']+'</label>' +
                                    'Fecha Vencimiento: '+val['Fecha_vencimiento']+'</label><br /><br />' +
                                val['Descripcion'] +
                            '</p>' +
                            '<div class="toggle-content">' +
                                '<p><strong>Datos del Empleador:</strong></p>' +
                                '<div class="one-half-responsive ">' +
                                    '<div class="submenu-navigation">' +
                                        '<div class="submenu-nav-items" style="overflow: hidden; display: block;"></div>' +
                                        '<a href="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                            '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                '<li class="right-list">Ciudad: '+nom_mun+' </li>' +
                                            '</ul>' +
                                        '</a>' +
                                        '<a href="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                            '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                '<li class="right-list">Número de vacantes: '+val['Num_vacantes']+' </li>' +
                                            '</ul>' +
                                        '</a>' +
                                        '<a href="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                            '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                '<li class="right-list">Cargo: '+val['Cargo']+' </li>' +
                                            '</ul>' +
                                        '</a>' +
                                        '<a href="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                            '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                '<li class="right-list">Sector: '+val['Sector']+' </li>' +
                                            '</ul>' +
                                        '</a>' +
                                        '<a href="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                            '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                '<li class="right-list">Profesión: '+val['Profesion']+' </li>' +
                                            '</ul>' +
                                        '</a>' +
                                        '<a href="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                            '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                '<li class="right-list">Salario: '+nom_sal+' </li>' +
                                            '</ul>' +
                                        '</a>' +
                                        '<a href="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                            '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                '<li class="right-list">Experiencia: '+nom_exp+' </li>' +
                                            '</ul>' +
                                        '</a>' +
                                        '<a href="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                            '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                '<li class="right-list">Nivel: '+nom_niv+' </li>' +
                                            '</ul>' +
                                        '</a>' +
                                        '<a href="#" style="text-align:center !important; border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                        'Comparta esta oportunidad de trabajo'+
                                            '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                '<li style="padding-left:0px !important;">' +
                                                    '<img src="images/misc/facebook.png" style="margin: 0px !important;" class="star" onclick="abrirPaginaFacebook(\''+val['Titulo']+'\', '+val['ID']+')">' +
                                                    '<img src="images/misc/twitter.png" class="star" style="margin-left: 5px;" onclick="abrirPaginaTwitter(\''+val['Titulo']+'\', '+val['ID']+')">' + 
                                                '</li>' +
                                            '</ul>' +
                                        '</a>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="one-half-responsive" style="text-align:center !important;">' +
                                     '<div onclick="agregarFavoritos('+val['ID']+')" style="width: 50%; float: left;"><img id="estrella'+val['ID']+'" class="star" style="margin: 0px !important; width:auto !important;" src="images/estrella_vacia.png" style="width: 20px;" /><label>Agregar a favoritas</label></div>' +
                                     '<div style="padding-left: 20px; width: 50%; float: left;margin-top: 5px;"><a href="#" onclick="Denunciar('+val['ID']+')" class="button-icon icon-setting button-red">Denunciar</a></div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '</div>';
            });
            $("#ofertas").html(texto);

            $('.deploy-toggle-2').click(function(){
                $(this).parent().find('.toggle-content').toggle(100);
                $(this).toggleClass('toggle-2-active');
                return false;
            });
            OcultarDivCargando();
        },
        error: function (xhr, textStatus, errorThrown) {
            //alert(errorThrown);
            OcultarDivCargando();
            alert("Ha ocurrido un problema, inténtelo nuevamente.");
        }
    });
        

    

    

}

function cerrar()
{
    localStorage.setItem("nombreUsuario", "");
    document.location.href = "inicio-sesion.html";
}

//Ocultar Div cargando...
function OcultarDivCargando(data) {
    $('#loading').css("display", "none");
}

//Mostrar Div cargando...
function MostrarDivCargando(data) {
    $('#loading').css("display", "block");
}

$(document).ready(function () {

    /*var d = new Date();
    d.getHours();
    d.getMinutes();
    d.getSeconds();

    alert(d.getMinutes());*/ 

    if(localStorage.getItem("nombreUsuario") !== "")
    {
        $("#header").append('<a onclick="cerrar()" style="float:right;"><img style="width:35px;margin-top:-30px;" src="images/icons/user/exit.png" alt="img"></a>');
        $("#opc_Sesion").css("display", "none");
    }
    else
    {
        $("#opc_Sesion").css("display", "block");
        $("#opc_Registrar").css("display", "none");
        $("#opc_VerMias").css("display", "none");
    }

    /*if (localStorage.getItem("nombreUsuario") != null) {
        localStorage.setItem("nombreUsuario", localStorage.getItem("nombreUsuario"));
        $("#opc_Registrar").show();
        $("#opc_VerMias").show();
    }
    else{
        $("#opc_Registrar").hide();
        $("#opc_VerMias").hide();
    }*/

});


