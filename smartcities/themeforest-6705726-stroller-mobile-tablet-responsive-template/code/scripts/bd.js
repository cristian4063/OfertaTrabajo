var id = 0;
var listaId = "";
var listData = [];
var datos = [];

var map;
var marker;
var markersArray = [];

$(document).ready(function () {

    validarInactividad();
    validarSesion();

    $("#map_canvas").hide();

});

function validarInactividad(){
    if(localStorage.getItem("nombreUsuario")) {
        $("#header").append('<a onclick="cerrar()" style="float:right;"><img style="width:35px;margin-top:-30px;" src="images/icons/user/exit.png" alt="img"></a>');
        $("#opc_Sesion").css("display", "none");
    }
    else {
        $("#opc_Sesion").css("display", "block");
        $("#opc_Registrar").css("display", "none");
        $("#opc_VerMias").css("display", "none");
    }
}

function validarSesion(){

    if(localStorage.getItem("tiempo")) {
        var today = new Date();
        var after = new Date(localStorage.getItem("tiempo"));
        var diffMs = (today - after); // milliseconds between now & Christmas
        var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

        if(diffMins >= 15) { //Tiempo de inactividad 15 minutos
            abrirAlertSesion("Su sesión se cerrará por inactividad");
            //alert("Su sesión se cerrará por inactividad");
            //cerrar();
        }
        else {
            localStorage.setItem("tiempo", today);
        }
    } 
}

function configurar_db() {
    function execute(tx) {
            //tx.executeSql('DROP TABLE vacantes');
        tx.executeSql('CREATE TABLE IF NOT EXISTS vacantes (id, titulo, nombre_tipo, descripcion, vacantes, cargo, nombre_salario, sector, nombre_experiencia, nombre_nivel, profesion, nombre_departamento, nombre_municipio, fecha_publicacion, fecha_vencimiento, dias_vence, empleador, telefono, indicativo, celular, direccion, email, fecha_actualizacion)');
    }

    //function execute2(tx) {
        //tx.executeSql('DROP TABLE vacantes');
    //}

    function error(error) {
        console.log("Error al configurar base de datos", error)
    }

    function exito() {
        console.log("Configuración exitosa")
    }

    var db = window.openDatabase("bd_vacantes", "1.0", "Vacantes", 200000);
    db.transaction(execute, error, exito);

}

function guardarVacante() {
    var db = window.openDatabase("bd_vacantes", "1.0", "Vacantes", 100000);
    db.transaction(GuardarVacanteBD, errorOperacion, operacionEfectuada);
}

function GuardarVacanteBD(tx) {
    var id = localStorage.getItem("id_guardar");
    var titulo = localStorage.getItem("titulo_guardar");
    var nombre_tipo = localStorage.getItem("tipo_guardar");
    var descripcion = localStorage.getItem("descripcion_guardar");
    var vacantes = localStorage.getItem("vacantes_guardar");
    var cargo = localStorage.getItem("cargo_guardar");
    var salario = localStorage.getItem("salario_guardar");
    var sector = localStorage.getItem("sector_guardar");
    var experiencia = localStorage.getItem("experiencia_guardar");
    var nivel = localStorage.getItem("nivel_guardar");
    var profesion = localStorage.getItem("profesion_guardar");
    var departamento = localStorage.getItem("departamento_guardar");
    var municipio = localStorage.getItem("municipio_guardar");
    var fecha_publicacion = localStorage.getItem("fechaPublicacion_guardar");
    var fecha_vencimiento = localStorage.getItem("fechaVencimiento_guardar");
    var dias_vence = localStorage.getItem("diasVence_guardar");
    var empleador = localStorage.getItem("empleador_guardar");
    var telefono = localStorage.getItem("telefono_guardar");
    var indicativo = localStorage.getItem("indicativo_guardar");
    var celular = localStorage.getItem("celular_guardar");
    var direccion = localStorage.getItem("direccion_guardar");
    var email = localStorage.getItem("email_guardar");
    var fecha_actualizacion = localStorage.getItem("fecha_actualizacion");
    
    tx.executeSql('INSERT INTO vacantes (id, titulo, nombre_tipo, descripcion, vacantes, cargo, nombre_salario, sector, nombre_experiencia, nombre_nivel, profesion, nombre_departamento, nombre_municipio, fecha_publicacion, fecha_vencimiento, dias_vence, empleador, telefono, indicativo, celular, direccion, email, fecha_actualizacion) ' +
        'VALUES ("' + id + '", "' + titulo + '" , "' + nombre_tipo + '", "' + descripcion + '", "' + vacantes + '", "' + cargo + '", "' + salario + '", "' + sector + '", "' + experiencia + '", "' + nivel + '", "' + profesion + '", "' + departamento + '", "' + municipio + '", "' + fecha_publicacion + '", "' + fecha_vencimiento + '", "' + dias_vence + '", "' + empleador + '", "' + telefono + '", "' + indicativo + '", "' + celular + '", "' + direccion + '", "' + email + '", "' + fecha_actualizacion + '")');
}

// Transaction error callback
function errorOperacion(err) {
    console.log(err);
    alert("Error de operación: " + err);
}

function operacionEfectuada() {
    $("#estrella" + localStorage.getItem("id_guardar")).attr("src", "images/estrella_llena.png")
    if (localStorage.getItem('vacantesGuardadas'))
        localStorage.setItem("vacantesGuardadas", localStorage.getItem("vacantesGuardadas") + "id" + localStorage.getItem("id_guardar") + ",");
    else
        localStorage.setItem("vacantesGuardadas", "id" + localStorage.getItem("id_guardar") + ",");
    console.log("Operación Exitosa!");
    abrirAlert("La vacante ha sido almacenada como favorita");
}

function cargarOfertas(palabra)
{
    $("#map_canvas").hide();

    var detalle = $("#detalle");
    detalle.empty();

    MostrarDivCargando();
    var vectorConectores = ["a", "ante", "bajo", "con", "contra", "de", "desde", "en", "entre","hacia","hasta","para","por","según","segun","sin", "sobre","tras", " ", "  ", "   ", ""];

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

    var texto = "";
    var ofertas = $("#ofertas");
    ofertas.empty();

    var nom_dpto = localStorage.getItem('NombreDepartamento');
    var nom_mun = localStorage.getItem('NombreMunicipio');
    var nom_sal = localStorage.getItem('NombreSalario'); 
    var nom_exp = localStorage.getItem('NombreExperiencia'); 
    var nom_niv = localStorage.getItem('NombreNivel'); 
    var municipio = localStorage.getItem('Municipio'); 
    var tipo = localStorage.getItem('Oportunidad');   
    var salario =  localStorage.getItem('Salario');
    var experiencia = localStorage.getItem('Experiencia');
    var nivel = localStorage.getItem('Nivel');
    var vacantesGuardadas = localStorage.getItem("vacantesGuardadas");
    var n = 0;

    $.ajax({
        url: 'http://apiempleo.apphb.com/api/Vacante/obtenerVacantes?palabra=' + palabra + '&tipo=' + tipo + '&salario=' + salario + '&experiencia=' + experiencia + '&nivel=' + nivel + '&municipio=' + municipio,
        type: 'POST',
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            var cantidad = data.length;
            if(cantidad==0){
                abrirAlert("No existen vacantes con los filtros seleccionados, intente seleccionando valores diferentes.")
            }
            $.each(data, function (i, val) {
                //alert(val['Titulo']);
                var rutaEstrella = "images/estrella_vacia.png";
                var metodoFavorito = 'agregarFavoritos(' + val['ID'] + ',\'' + val['Titulo'] + '\',\'' + val['Tipo'] + '\',\'' + val['Descripcion'] + '\',\'' + val['Num_vacantes'] + '\',\'' + val['Cargo'] + '\',\'' + nom_sal + '\',\'' + val['Sector'] + '\',\'' + nom_exp + '\',\'' + val['Nivel_estudios'] + '\',\'' + val['Profesion'] + '\',\'' + nom_dpto + '\',\'' + nom_mun + '\',\'' + val['Fecha_publicacion'] + '\',\'' + val['Fecha_vencimiento'] + '\',\'' + val['DiasVence'] + '\',\'' + val['Empleador'] + '\',\'' + val['Telefono'] + '\',\'' + val['Indicativo'] + '\',\'' + val['Celular'] + '\',\'' + val['Direccion'] + '\',\'' + val['Email'] + '\',\'' + val['Ultima_Actualizacion'] + '\')';
                var metodoDenuncia = 'GuardarDenuncia(' + val['ID'] + ',\'' + val['Titulo'] + '\',\'' + val['Tipo'] + '\',\'' + val['Descripcion'] + '\',\'' + val['Num_vacantes'] + '\',\'' + val['Cargo'] + '\',\'' + nom_sal + '\',\'' + val['Sector'] + '\',\'' + nom_exp + '\',\'' + val['Nivel_estudios'] + '\',\'' + val['Profesion'] + '\',\'' + nom_dpto + '\',\'' + nom_mun + '\',\'' + val['Fecha_publicacion'] + '\',\'' + val['Fecha_vencimiento'] + '\',\'' + val['DiasVence'] + '\',\'' + val['Empleador'] + '\',\'' + val['Telefono'] + '\',\'' + val['Indicativo'] + '\',\'' + val['Celular'] + '\',\'' + val['Direccion'] + '\',\'' + val['Email'] + '\',\'' + val['Ultima_Actualizacion'] + '\')';
                var textoFavorita = "Agregar a favoritas";
                if (localStorage.getItem('vacantesGuardadas')){
                    if(vacantesGuardadas.indexOf("id"+val['ID']+",")==-1){
                        rutaEstrella="images/estrella_vacia.png";
                    }
                    else{
                        rutaEstrella="images/estrella_llena.png";
                        metodoFavorito="yaAgregado()";
                        textoFavorita ="Agregada a favoritas";
                    }
                }
                n = val['Fecha_vencimiento'].indexOf('T');
                texto += '<div class="container">' +
                        '<div class="toggle-2">' +
                            '<a href="#" class="deploy-toggle-2 toggle-2" style="font-weight: normal; font-size: 15px; color: black;">' +
                                val['Titulo'] + '<label style="font-weight: bolder; font-size: 13px; color: black;">';
                if (val['DiasVence'] == 0)
                    texto += 'Vence HOY</label>';
                else if (val['DiasVence'] == 1)
                    texto += 'Vence MAÑANA</label>';
                else
                    texto += 'Vence en '+val['DiasVence']+' días</label>';
                texto +=    '</a>' +
                        '<div class="toggle-content">' +
                            '<p style="text-align:justify;">' +
                                '<label style="padding-bottom:10px;">' +
                                    val['Descripcion'] +
                                '</label>' +
                                '<label>' +
                                    'Número de vacantes: <b>' + val['Num_vacantes'] + '</b></label>' +
                                '<label>' +
                                    'Cargo: <b>' + val['Cargo'] + '</b></label>' +
                                '<label>' +
                                    'Salario: <b>' + nom_sal + '</b></label>' +
                                '<label>' +
                                    'Sector: <b>' + val['Sector'] + '</b></label>' +
                                '<label>' +
                                    'Experiencia: <b>' + nom_exp + '</b></label>' +
                                '<label>' +
                                    'Nivel de Estudios: <b>' + val['Nivel_estudios'] + '</b></label>' +
                                '<label>' +
                                    'Profesión: <b>' + val['Profesion'] + '</b></label>' +
                                '<label>' +
                                    'Departamento: <b>' + nom_dpto + '</b></label>' +
                                '<label>' +
                                    'Municipio: <b>' + nom_mun + '</b></label>' +
                                '<label>' +
                                    'Fecha Vencimiento: <b>' + val['Fecha_vencimiento'].substring(0, n) + '</b></label>' +
                            '</p>' +
                            '<div class="toggle-content">' +
                                '<p><strong style="font-size: medium;">DATOS DE CONTACTO DEL EMPLEADOR:</strong></p>' +
                                '<div class="one-half-responsive ">' +
                                    '<div class="submenu-navigation">' +
                                        '<div class="submenu-nav-items" style="overflow: hidden; display: block;"></div>' +
                                        '<a name="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                            '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                '<li class="right-list">Teléfono (Indicativo): <b>' + val['Telefono'] + ' (' + val['Indicativo'] + ')</b></li>' +
                                            '</ul>' +
                                        '</a>' +
                                        '<a name="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                            '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                '<li class="right-list">Celular: <b>' + val['Celular'] + '</b></li>' +
                                            '</ul>' +
                                        '</a>' +
                                        '<a name="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                            '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                '<li class="right-list">Dirección: <b>' + val['Direccion'] + '</b></li>' +
                                            '</ul>' +
                                        '</a>' +
                                        '<a name="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                            '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                '<li class="right-list">E-mail: <b>' + val['Email'] + '</b></li>' +
                                            '</ul>' +
                                        '</a>' +
                                        '<a name="#" style="width:60%; float:left; padding-top: 10px !important; padding-bottom: 10px !important;">' +
                                            '<label style="padding-left: 10px;">Comparta esta oportunidad de trabajo<label>' +
                                            '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                '<li style="padding-left: 0px;">' +
                                                    '<div style="width:50%; float:left;"><img src="images/misc/facebook.png" style="margin: 0 auto; width: 30px;" onclick="abrirPaginaFacebook(\'' + val['Titulo'] + '\', ' + val['ID'] + ')"/></div>' +
                                                    '<div style="width:50%; float:left;"><img src="images/misc/twitter.png" style="margin: 0 auto; width: 30px;" onclick="abrirPaginaTwitter(\'' + val['Titulo'] + '\', ' + val['ID'] + ')"/></div>' +
                                                '</li>' +
                                            '</ul>' +
                                        '</a>' +
                                        '<a name="#" style="width:40%; float:left; padding-top: 10px !important; padding-bottom: 10px !important; text-align: center;">' +
                                            '<label style="padding-left: 10px;">' + textoFavorita + '</label>' +
                                            '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                '<li style="padding-left: 0px;">' +
                                                    '<img id="estrella' + val['ID'] + '" src="' + rutaEstrella + '" onclick=\"' + metodoFavorito + '\" style="margin: 0 auto;" />' +
                                                '</li>' +
                                            '</ul>' +
                                        '</a>' +
                                        /*'<div onclick=\"'+metodoFavorito+'\" style="text-align:center; width: 50%; float: left; padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;"><a>'+textoFavorita+'</a><img id="estrella'+val['ID']+'" class="star" style="margin: 0px !important; width: 43px; height: 50px;" src="'+rutaEstrella+'" style="width: 20px;" /></div>' + */
                                    '</div>' +
                                '</div>' +
                                '<div class="one-half-responsive" style="text-align:center !important;">' +
                                     //'<div onclick=\"'+metodoFavorito+'\" style="width: 50%; float: left;"><img id="estrella'+val['ID']+'" class="star" style="margin: 0px !important; width:auto !important;" src="'+rutaEstrella+'" style="width: 20px;" /><label>'+textoFavorita+'</label></div>' +
                                     '<div id="btnDen' + val['ID'] + '" style="width: 100%; float: left; padding-top: 5px; padding-bottom: 5px; display:block; border-top: solid 1px rgba(0,0,0,0.1); border-bottom: solid 1px rgba(0,0,0,0.1);"><a name="#" onclick="Denunciar(' + val['ID'] + ')" class="button-icon icon-setting button-red">Denunciar</a></div>' +
                                     '<div id="comboDen' + val['ID'] + '" style="width: 96%; float: left;margin-left: 2%; display:none; border-top: solid 1px rgba(0,0,0,0.1); border-bottom: solid 1px rgba(0,0,0,0.1); padding-top: 5px; padding-bottom: 5px;">Motivo de la denuncia: <br />' +
                                     '<select class="styled-select" style="width:100% !important; margin-bottom: 5px;" name="selectMotivoDenuncia' + val['ID'] + '" id="selectMotivoDenuncia' + val['ID'] + '">' +
                                        '<option value="1">Vacante sospechosa / engañosa</option>'+
                                        '<option value="2">Lenguaje no adecuado</option>'+
                                        '<option value="3">Información de contacto errónea </option>'+
                                        '<option value="4">Sospecha de Trata de personas</option>'+
                                    '</select>'+
                                    '<br /> <a name="#" onclick=\"' + metodoDenuncia + '\" class="button-icon icon-setting button-red">Confirmar denuncia</a>&nbsp;<a name="#" onclick="CancelarDenuncia(' + val['ID'] + ')" class="button-icon icon-setting button-red">Cancelar</a>' +
                                    '</div>' +
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
            if(cantidad!=0){
                if(cantidad==1){
                    abrirAlert('Se ha encontrado '+cantidad+' oportunidad.');
                }
                else{
                    abrirAlert('Se han encontrado '+cantidad+' oportunidades.');
                }
                
            }
            OcultarDivCargando();
        },
        error: function (xhr, textStatus, errorThrown) {
            abrirAlert("Ha ocurrido un problema, inténtelo nuevamente.");
            OcultarDivCargando();
        }
    });
}

function cargarVacantesMapa(palabra) {

    var ofertas = $("#ofertas");
    ofertas.empty();

    var detalle = $("#detalle");
    detalle.empty();

    MostrarDivCargando();

    var vectorConectores = ["a", "ante", "bajo", "con", "contra", "de", "desde", "en", "entre","hacia","hasta","para","por","según","segun","sin", "sobre","tras", " ", "  ", "   ", ""];

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

    var municipio = localStorage.getItem('Municipio'); 
    var tipo = localStorage.getItem('Oportunidad');   
    var salario =  localStorage.getItem('Salario');
    var experiencia = localStorage.getItem('Experiencia');
    var nivel = localStorage.getItem('Nivel');

    $.ajax({
        url: 'http://apiempleo.apphb.com/api/Vacante/obtenerVacantesMapa?palabra=' + palabra + '&tipo=' + tipo + '&salario=' + salario + '&experiencia=' + experiencia + '&nivel=' + nivel + '&municipio=' + municipio,
        type: 'POST',
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            var cantidad = data.length;
            if(cantidad != 0){
                $.each(data, function (i, val) {
                    listData[i] = { "ID": "" + val['ID'] + "", "Nombre": "" + val['Titulo'] + "", "GeoLat": "" + val['Latitud'] + "", "GeoLong": "" + val['Longitud'] + "" };
                });
                setTimeout(function() {
                    Initialize(listData);
                }, 500);
                $("#map_canvas").show();
            }
            else {
                abrirAlertMap("No existe información geo-referenciada suficiente.");
            }
            OcultarDivCargando();
        },
        error: function (xhr, textStatus, errorThrown) {
            abrirAlert("Ha ocurrido un problema, inténtelo nuevamente.");
            OcultarDivCargando();
        }
    });
}

function Initialize(data) {
    // Google has tweaked their interface somewhat - this tells the api to use that new UI
    google.maps.visualRefresh = true;

    var city = new google.maps.LatLng(data[0].GeoLat, data[0].GeoLong);

    // These are options that set initial zoom level, where the map is centered globally to start, and the type of map to show
    var mapOptions = {
        zoom: 14,
        center: city,
        mapTypeId: google.maps.MapTypeId.G_NORMAL_MAP
    };

    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
 
    // Using the JQuery "each" selector to iterate through the JSON list and drop marker pins
    $.each(data, function (i, item) {
        var marker = new google.maps.Marker({
            'position': new google.maps.LatLng(item.GeoLat, item.GeoLong),
            'map': map,
            'title': item.PlaceName
        });

        // Make the marker-pin blue!
        marker.setIcon('images/marker.png');

        // put in some information about each json object - in this case, the opening hours.
        var infowindow = new google.maps.InfoWindow({
            content: "<div class='infoDiv'><h2>" + item.Nombre + "</h2><div><input type='submit' class='buttonWrap button button-dark contactSubmitButton' onclick='cargarVacante(" + item.ID + ")' value='Ver detalles' /></div></div>"
        });

        // finally hook up an "OnClick" listener to the map so it pops up out info-window when the marker-pin is clicked!
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, marker);
        });

    })
}

function InitializeReg(lat, lon) {

    google.maps.visualRefresh = true;
    var cityCenter = new google.maps.LatLng(lat, lon);

    var mapOptions = {
        zoom: 14,
        center: cityCenter,
        mapTypeId: google.maps.MapTypeId.G_NORMAL_MAP
    };

    map = new google.maps.Map(document.getElementById("map_canvas2"), mapOptions);

    google.maps.event.addListener(map, "click", function(event)
    {
        placeMarker(event.latLng);
    });
}

function InitializeEdit(lat, lon) {

    google.maps.visualRefresh = true;
    var cityCenter = new google.maps.LatLng(lat, lon);

    var mapOptions = {
        zoom: 14,
        center: cityCenter,
        mapTypeId: google.maps.MapTypeId.G_NORMAL_MAP
    };

    map = new google.maps.Map(document.getElementById("map_canvas2"), mapOptions);

    var myLatlng = new google.maps.LatLng(lat, lon);

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map
    })

    marker.setIcon('images/marker.png');
    markersArray.push(marker);

    google.maps.event.addListener(map, "click", function(event)
    {
        placeMarker(event.latLng);
    });
}

function placeMarker(location) {

    deleteOverlays();

    marker = new google.maps.Marker({
        position: location, 
        map: map
    });

    localStorage.setItem('latitud', location.lat());
    localStorage.setItem('longitud', location.lng());

    marker.setIcon('images/marker.png');
    markersArray.push(marker);
}

function deleteOverlays() {
    if (markersArray) {
        for (i in markersArray) {
            markersArray[i].setMap(null);
        }
    markersArray.length = 0;
    }
}

function cargarVacante(vacanteID) {
    
    var texto = "";
    var detalle = $("#detalle");
    detalle.empty();

    var nom_dpto = localStorage.getItem('NombreDepartamento');
    var nom_mun = localStorage.getItem('NombreMunicipio');
    var nom_sal = localStorage.getItem('NombreSalario'); 
    var nom_exp = localStorage.getItem('NombreExperiencia'); 
    var nom_niv = localStorage.getItem('NombreNivel');
    var vacantesGuardadas = localStorage.getItem("vacantesGuardadas");
    var n = 0;

    $.ajax({
        url: 'http://apiempleo.apphb.com/api/Vacante/obtenerVacante/' + vacanteID,
        type: 'POST',
        dataType: 'json',
        success: function (data, textStatus, xhr) {

            var rutaEstrella = "images/estrella_vacia.png";
            var metodoFavorito = 'agregarFavoritos(' + data['ID'] + ',\'' + data['Titulo'] + '\',\'' + data['Tipo'] + '\',\'' + data['Descripcion'] + '\',\'' + data['Num_vacantes'] + '\',\'' + data['Cargo'] + '\',\'' + nom_sal + '\',\'' + data['Sector'] + '\',\'' + nom_exp + '\',\'' + nom_niv + '\',\'' + data['Profesion'] + '\',\'' + nom_dpto + '\',\'' + nom_mun + '\',\'' + data['Fecha_publicacion'] + '\',\'' + data['Fecha_vencimiento'] + '\',\'' + data['DiasVence'] + '\',\'' + data['Empleador'] + '\',\'' + data['Telefono'] + '\',\'' + data['Indicativo'] + '\',\'' + data['Celular'] + '\',\'' + data['Direccion'] + '\',\'' + data['Email'] + '\',\'' + data['Ultima_Actualizacion'] + '\')';
            var metodoDenuncia = 'GuardarDenuncia(' + data['ID'] + ',\'' + data['Titulo'] + '\',\'' + data['Tipo'] + '\',\'' + data['Descripcion'] + '\',\'' + data['Num_vacantes'] + '\',\'' + data['Cargo'] + '\',\'' + nom_sal + '\',\'' + data['Sector'] + '\',\'' + nom_exp + '\',\'' + nom_niv + '\',\'' + data['Profesion'] + '\',\'' + nom_dpto + '\',\'' + nom_mun + '\',\'' + data['Fecha_publicacion'] + '\',\'' + data['Fecha_vencimiento'] + '\',\'' + data['DiasVence'] + '\',\'' + data['Empleador'] + '\',\'' + data['Telefono'] + '\',\'' + data['Indicativo'] + '\',\'' + data['Celular'] + '\',\'' + data['Direccion'] + '\',\'' + data['Email'] + '\',\'' + data['Ultima_Actualizacion'] + '\')';
            var textoFavorita = "Agregar a favoritas";
            if (localStorage.getItem('vacantesGuardadas')){
                if(vacantesGuardadas.indexOf("id"+data['ID']+",")==-1){
                    rutaEstrella="images/estrella_vacia.png";
                }
                else{
                    rutaEstrella="images/estrella_llena.png";
                    metodoFavorito="yaAgregado()";
                    textoFavorita ="Agregada a favoritas";
                }
            }
            n = data['Fecha_vencimiento'].indexOf('T');
            texto += '<div class="container">' +
                    '<div class="toggle-2">' +
                        '<a href="#" class="deploy-toggle-2 toggle-2-active" style="font-weight: normal; font-size: 15px; color: black;">' +
                            data['Titulo'] + '<label style="font-weight: bolder; font-size: 13px; color: black;">';
            if (data['DiasVence'] == 0)
                texto += 'Vence HOY</label>';
            else if (data['DiasVence'] == 1)
                texto += 'Vence MAÑANA</label>';
            else
                texto += 'Vence en ' + data['DiasVence'] + ' días</label>';
            texto +=    '</a>' +
                    '<div class="toggle-content" style="overflow: hidden; display: block;">' +
                        '<p style="text-align:justify;">' +
                            '<label style="padding-bottom:10px;">' +
                                data['Descripcion'] +
                            '</label>' +
                            '<label>' +
                                'Número de vacantes: <b>' + data['Num_vacantes'] + '</b></label>' +
                            '<label>' +
                                'Cargo: <b>' + data['Cargo'] + '</b></label>' +
                            '<label>' +
                                'Salario: <b>' + nom_sal + '</b></label>' +
                            '<label>' +
                                'Sector: <b>' + data['Sector'] + '</b></label>' +
                            '<label>' +
                                'Experiencia: <b>' + nom_exp + '</b></label>' +
                            '<label>' +
                                'Nivel de Estudios: <b>' + nom_niv + '</b></label>' +
                            '<label>' +
                                'Profesión: <b>' + data['Profesion'] + '</b></label>' +
                            '<label>' +
                                'Departamento: <b>' + nom_dpto + '</b></label>' +
                            '<label>' +
                                'Municipio: <b>' + nom_mun + '</b></label>' +
                            '<label>' +
                                'Fecha Vencimiento: <b>' + data['Fecha_vencimiento'].substring(0, n) + '</b></label>' +
                        '</p>' +
                        '<div class="toggle-content" style="overflow: hidden; display: block;">' +
                            '<p><strong>DATOS DE CONTACTO DEL EMPLEADOR:</strong></p>' +
                            '<div class="one-half-responsive ">' +
                                '<div class="submenu-navigation">' +
                                    '<div class="submenu-nav-items" style="overflow: hidden; display: block;"></div>' +
                                    '<a name="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                        '<ul style="margin-bottom:0px;" class="icon-list">' +
                                            '<li class="right-list">Teléfono (Indicativo): <b>' + data['Telefono'] + ' (' + data['Indicativo'] + ')</b></li>' +
                                        '</ul>' +
                                    '</a>' +
                                    '<a name="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                        '<ul style="margin-bottom:0px;" class="icon-list">' +
                                            '<li class="right-list">Celular: <b>' + data['Celular'] + '</b></li>' +
                                        '</ul>' +
                                    '</a>' +
                                    '<a name="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                        '<ul style="margin-bottom:0px;" class="icon-list">' +
                                            '<li class="right-list">Dirección: <b>' + data['Direccion'] + '</b></li>' +
                                        '</ul>' +
                                    '</a>' +
                                    '<a name="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                        '<ul style="margin-bottom:0px;" class="icon-list">' +
                                            '<li class="right-list">E-mail: <b>' + data['Email'] + '</b></li>' +
                                        '</ul>' +
                                    '</a>' +
                                    '<a name="#" style="width:60%; float:left; padding-top: 10px !important; padding-bottom: 10px !important;">' +
                                        '<label style="padding-left: 10px;">Comparta esta oportunidad de trabajo<label>' +
                                        '<ul style="margin-bottom:0px;" class="icon-list">' +
                                            '<li style="padding-left: 0px;">' +
                                                '<div style="width:50%; float:left;"><img src="images/misc/facebook.png" style="margin: 0 auto; width: 30px;" onclick="abrirPaginaFacebook(\'' + data['Titulo'] + '\', ' + data['ID'] + ')"/></div>' +
                                                '<div style="width:50%; float:left;"><img src="images/misc/twitter.png" style="margin: 0 auto; width: 30px;" onclick="abrirPaginaTwitter(\'' + data['Titulo'] + '\', ' + data['ID'] + ')"/></div>' +
                                            '</li>' +
                                        '</ul>' +
                                    '</a>' +
                                    '<a name="#" style="width:40%; float:left; padding-top: 10px !important; padding-bottom: 10px !important; text-align: center;">' +
                                        '<label style="padding-left: 10px;">' + textoFavorita + '</label>' +
                                        '<ul style="margin-bottom:0px;" class="icon-list">' +
                                            '<li style="padding-left: 0px;">' +
                                                '<img id="estrella' + data['ID'] + '" src="' + rutaEstrella + '" onclick=\"' + metodoFavorito + '\" style="margin: 0 auto;" />' +
                                            '</li>' +
                                        '</ul>' +
                                    '</a>' +
                                '</div>' +
                            '</div>' +
                            '<div class="one-half-responsive" style="text-align:center !important;">' +
                                    '<div id="btnDen' + data['ID'] + '" style="width: 100%; float: left; padding-top: 5px; padding-bottom: 5px; display:block; border-top: solid 1px rgba(0,0,0,0.1); border-bottom: solid 1px rgba(0,0,0,0.1);"><a name="#" onclick="Denunciar(' + data['ID'] + ')" class="button-icon icon-setting button-red">Denunciar</a></div>' +
                                    '<div id="comboDen' + data['ID'] + '" style="width: 96%; float: left;margin-left: 2%; display:none; border-top: solid 1px rgba(0,0,0,0.1); border-bottom: solid 1px rgba(0,0,0,0.1); padding-top: 5px; padding-bottom: 5px;">Motivo de la denuncia: <br />' +
                                    '<select class="styled-select" style="width:100% !important; margin-bottom: 5px;" name="selectMotivoDenuncia' + data['ID'] + '" id="selectMotivoDenuncia' + data['ID'] + '">' +
                                    '<option value="1">Vacante sospechosa / engañosa</option>' +
                                    '<option value="2">Lenguaje no adecuado</option>' +
                                    '<option value="3">Información de contacto errónea </option>' +
                                    '<option value="4">Sospecha de Trata de personas</option>' +
                                '</select>' +
                                '<br /> <a name="#" onclick=\"' + metodoDenuncia + '\" class="button-icon icon-setting button-red">Confirmar denuncia</a>&nbsp;<a name="#" onclick="CancelarDenuncia(' + data['ID'] + ')" class="button-icon icon-setting button-red">Cancelar</a>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="formSubmitButtonErrorsWrap">' +
                    '<br />' +
                    '<input type="submit" class="buttonWrap button button-dark contactSubmitButton" id="mapButton" value="Volver al mapa" data-formid="contactForm" onclick="volverMapa();" />' +
                '</div>' +
            '</div>' +
            '</div>';

            $("#detalle").html(texto);

            $('.deploy-toggle-2').click(function(){
                $(this).parent().find('.toggle-content').toggle(100);
                $(this).toggleClass('toggle-2-active');
                return false;
            });

            $("#map_canvas").hide();
        },
        error: function (xhr, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

function cargarVacantesEmpleador() {

    var texto = "";
    var estadoHtml = "";
    var estado = "";
    var textoEstado = "";

    var ofertas = $("#ofertas");
    ofertas.empty();

    MostrarDivCargando();

    var empleador = localStorage.getItem("nombreUsuario");

    $.ajax({
        url: 'http://apiempleo.apphb.com/api/Vacante/obtenerVacantesXEmpleador?empleador=' + empleador,
        type: 'POST',
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            $.each(data, function (i, val) {

                if(val['Estado'] === "A") {
                    estado = "I";
                    estadoHtml = 'cambiarEstadoVacante('+val['ID']+',\'' + estado + '\')';
                    textoEstado = "Inactivar";
                }
                else {
                    estado = "A";
                    estadoHtml = 'cambiarEstadoVacante('+val['ID']+',\'' + estado + '\')';
                    textoEstado = "Activar";
                }

                n = val['Fecha_vencimiento'].indexOf('T');
                texto += '<div class="container">' +
                        '<div class="toggle-2">' +
                            '<a href="#" class="deploy-toggle-2 toggle-2-active" style="font-weight: normal; font-size: 15px; color: black;">' +
                            val['Titulo'] + '<label style="font-weight: bolder; font-size: 13px; color: black;">';
                        if (val['DiasVence'] < 0)
                            texto += 'VENCIDA</label>';
                        else if (val['DiasVence'] == 0)
                                texto += 'Vence HOY</label>';
                        else if (val['DiasVence'] == 1)
                                texto += 'Vence MAÑANA</label>';
                            else
                                texto += 'Vence en ' + val['DiasVence'] + ' días</label>';
                            texto += '</a>' +
                            '<div class="toggle-content">' +
                                '<p style="text-align:justify;">' +
                                    '<label style="padding-bottom:10px;">' +
                                        val['Descripcion'] +
                                    '</label>' +
                                    '<label>' +
                                        'Número de vacantes: <b>' + val['Num_vacantes'] + '</b></label>' +
                                    '<label>' +
                                        'Cargo: <b>' + val['Cargo'] + '</b></label>' +
                                    '<label>' +
                                        'Salario: <b>' + val['Salario'] + '</b></label>' +
                                    '<label>' +
                                        'Sector: <b>' + val['Sector'] + '</b></label>' +
                                    '<label>' +
                                        'Experiencia: <b>' + val['Experiencia'] + '</b></label>' +
                                    '<label>' +
                                        'Nivel de Estudios: <b>' + val['Nivel_estudios'] + '</b></label>' +
                                    '<label>' +
                                        'Profesión: <b>' + val['Profesion'] + '</b></label>' +
                                    '<label>' +
                                        'Departamento: <b>' + val['Departamento'] + '</b></label>' +
                                    '<label>' +
                                        'Municipio: <b>' + val['Municipio'] + '</b></label>' +
                                    '<label>' +
                                        'Fecha Vencimiento: <b>' + val['Fecha_vencimiento'].substring(0, n) + '</b></label>' +

                                '</p>' +
                                '<div class="toggle-content" style="padding-bottom: 5px;">' +
                                    '<p><strong>Datos del Empleador:</strong></p>' +
                                    '<div class="one-half-responsive ">' +
                                        '<div class="submenu-navigation">' +
                                            '<div class="submenu-nav-items" style="overflow: hidden; display: block;"></div>' +
                                            '<a name="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                                '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                    '<li class="right-list">Teléfono (Indicativo): <b>' + val['Telefono'] + ' (' + val['Indicativo'] + ')</b></li>' +
                                                '</ul>' +
                                            '</a>' +
                                            '<a name="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                                '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                    '<li class="right-list">Celular: <b>' + val['Celular'] + '</b></li>' +
                                                '</ul>' +
                                            '</a>' +
                                            '<a name="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                                '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                    '<li class="right-list">Dirección: <b>' + val['Direccion'] + '</b></li>' +
                                                '</ul>' +
                                            '</a>' +
                                            '<a name="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                                '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                    '<li class="right-list">E-mail: <b>' + val['Email'] + '</b></li>' +
                                                '</ul>' +
                                            '</a>' +
                                            '<a name="#" style="width:100%; float:left; padding-top: 10px !important; padding-bottom: 10px !important;">' +
                                                '<label style="padding-left: 10px;">Comparta esta oportunidad de trabajo<label>' +
                                                '<ul style="margin-bottom:0px;" class="icon-list">' +
                                                    '<li style="padding-left: 0px;">' +
                                                        '<div style="width:50%; float:left;"><img src="images/misc/facebook.png" style="margin: 0 auto; width: 30px;" onclick="abrirPaginaFacebook(\'' + val['Titulo'] + '\', ' + val['ID'] + ')"/></div>' +
                                                        '<div style="width:50%; float:left;"><img src="images/misc/twitter.png" style="margin: 0 auto; width: 30px;" onclick="abrirPaginaTwitter(\'' + val['Titulo'] + '\', ' + val['ID'] + ')"/></div>' +
                                                    '</li>' +
                                                '</ul>' +
                                            '</a>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="one-half-responsive">' +
                                        '<div style="text-align: center; width: 30%; float: left;margin-top: 5px;"><a class="button-icon icon-setting button-red" onclick="cargarDatosVacante('+val['ID']+')">Editar</a></div>' +
                                        '<div style="text-align: center; width: 40%; float: left;margin-top: 5px;"><a class="button-icon icon-setting button-red" onclick=\"' + estadoHtml + '\">'+ textoEstado +'</a></div>' +
                                        '<div style="text-align: center; width: 30%; float: left;margin-top: 5px;"><a class="button-icon icon-setting button-red" onclick="confirmarEliminacion('+val['ID']+')">Eliminar</a></div>' +
                                    '</div>'+
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
            abrirAlert("Ha ocurrido un problema, inténtelo nuevamente.");
            OcultarDivCargando();
        }
    });
}

function agregarVacante() {

    MostrarDivCargando();

    var vacante = new Object();
    vacante.ID = null;
    vacante.Titulo = localStorage.getItem('titulo');
    vacante.TipoID = localStorage.getItem('tipo');
    vacante.Descripcion = localStorage.getItem('descripcion');
    vacante.Num_vacantes = localStorage.getItem('numVacantes');
    vacante.Cargo = localStorage.getItem('cargo');
    vacante.SalarioID = localStorage.getItem('salario');
    //vacante.Sector = localStorage.getItem('sector');
    vacante.ExperienciaID = localStorage.getItem('experiencia');
    vacante.Nivel_estudiosID = localStorage.getItem('nivel');
    vacante.Profesion = localStorage.getItem('profesion');
    vacante.Municipio = localStorage.getItem('municipio');
    vacante.Departamento = localStorage.getItem('departamento');
    vacante.Fecha_publicacion = localStorage.getItem('fechaPublicacion');
    vacante.Fecha_vencimiento = localStorage.getItem('fechaVencimiento');
    vacante.Direccion = localStorage.getItem('direccion');
    vacante.Email = localStorage.getItem('correo');
    vacante.Indicativo = localStorage.getItem('indicativo');
    vacante.Telefono = localStorage.getItem('telefono');
    vacante.Celular = localStorage.getItem('celular');

    if(localStorage.getItem('latitud') != 0 && localStorage.getItem('longitud') != 0) {
        vacante.Latitud = localStorage.getItem('latitud');
        vacante.Longitud = localStorage.getItem('longitud');
    }
    else {
        vacante.Latitud = "0";
        vacante.Longitud = "0";
    }

    vacante.Empleador = localStorage.getItem("nombreUsuario");

    $.ajax({
        url: 'http://apiempleo.apphb.com/api/Vacante/agregarVacante',
        type: 'POST',
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(vacante),
        success: function (data, textStatus, xhr) {
            abrirConfirm("la vacante ha sido registrada exitosamente!!");
            OcultarDivCargando();
        },
        error: function (xhr, textStatus, errorThrown) {
            abrirAlert("Ha ocurrido un problema, inténtelo nuevamente.");
            OcultarDivCargando();
        }
    });
}

function cargarDatosVacante(vacanteID) {
    $.ajax({
        url: 'http://apiempleo.apphb.com/api/Vacante/obtenerVacante/' + vacanteID,
        type: 'POST',
        dataType: 'json',
        success: function (data, textStatus, xhr) {

            localStorage.setItem('id', data['ID']);
            localStorage.setItem('titulo', data['Titulo']);
            localStorage.setItem('tipo', data['TipoID']);
            localStorage.setItem('descripcion', data['Descripcion']);
            localStorage.setItem('numVacantes', data['Num_vacantes']);
            localStorage.setItem('cargo', data['Cargo']);
            localStorage.setItem('salario', data['SalarioID']);
            //localStorage.setItem('sector', data['Sector']);
            localStorage.setItem('experiencia', data['ExperienciaID']);
            localStorage.setItem('nivel', data['Nivel_estudiosID']);
            localStorage.setItem('profesion', data['Profesion']);
            localStorage.setItem('departamento', data['Departamento']);
            localStorage.setItem('municipio', data['Municipio']);
            localStorage.setItem('fechaPublicacion', data['Fecha_publicacion']);
            localStorage.setItem('fechaVencimiento', data['Fecha_vencimiento']);
            localStorage.setItem('direccion', data['Direccion']);
            localStorage.setItem('correo', data['Email']);
            localStorage.setItem('indicativo', data['Indicativo']);
            localStorage.setItem('telefono', data['Telefono']);
            localStorage.setItem('celular', data['Celular']);
            localStorage.setItem('latitud', data['Latitud']);
            localStorage.setItem('longitud', data['Longitud']);

            document.location.href = "EditarOferta.html";
        },
        error: function (xhr, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

function modificarVacante() {

    MostrarDivCargando();

    var vacante = new Object();
    vacante.ID = localStorage.getItem('id');
    vacante.Titulo = localStorage.getItem('titulo');
    vacante.TipoID = localStorage.getItem('tipo');
    vacante.Descripcion = localStorage.getItem('descripcion');
    vacante.Num_vacantes = localStorage.getItem('numVacantes');
    vacante.Cargo = localStorage.getItem('cargo');
    vacante.SalarioID = localStorage.getItem('salario');
    //vacante.Sector = localStorage.getItem('sector');
    vacante.ExperienciaID = localStorage.getItem('experiencia');
    vacante.Nivel_estudiosID = localStorage.getItem('nivel');
    vacante.Profesion = localStorage.getItem('profesion');
    vacante.Municipio = localStorage.getItem('municipio');
    vacante.Departamento = localStorage.getItem('departamento');
    vacante.Fecha_publicacion = localStorage.getItem('fechaPublicacion');
    vacante.Fecha_vencimiento = localStorage.getItem('fechaVencimiento');
    vacante.Direccion = localStorage.getItem('direccion');
    vacante.Email = localStorage.getItem('correo');
    vacante.Indicativo = localStorage.getItem('indicativo');
    vacante.Telefono = localStorage.getItem('telefono');
    vacante.Celular = localStorage.getItem('celular');

    if(localStorage.getItem('latitud') != 0 && localStorage.getItem('longitud') != 0) {
        vacante.Latitud = localStorage.getItem('latitud');
        vacante.Longitud = localStorage.getItem('longitud');
    }
    else {
        vacante.Latitud = "0";
        vacante.Longitud = "0";
    }

    vacante.Empleador = localStorage.getItem("nombreUsuario");

    $.ajax({
        url: 'http://apiempleo.apphb.com/api/Vacante/modificarVacante',
        type: 'POST',
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(vacante),
        success: function (data, textStatus, xhr) {
            abrirConfirm("la vacante ha sido modificada exitosamente!!");
            OcultarDivCargando();
        },
        error: function (xhr, textStatus, errorThrown) {
            abrirAlert("Ha ocurrido un problema, inténtelo nuevamente.");
            OcultarDivCargando();
        }
    });
}

function cambiarEstadoVacante(vacanteID, estado) {
    var empleador = localStorage.getItem("nombreUsuario");
    $.ajax({
        url: 'http://apiempleo.apphb.com/api/Vacante/cambiarEstadoVacante/?ID=' + vacanteID + '&empleador=' + empleador + '&estado=' + estado,
        type: 'POST',
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            abrirConfirm("Se ha cambiado el estado de la vacante exitosamente");
        },
        error: function (xhr, textStatus, errorThrown) {
            abrirAlert("Ha ocurrido un problema, inténtelo nuevamente.");
        }
    });
}

function confirmarEliminacion(vacanteID) {

    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var ancho=windowWidth-(windowWidth/10);
    $('#content-alert').html('<p>Esta seguro que desea eliminar la vacante ?</p>');
    $("#div-confirm").dialog({
        modal: true,
        draggable: false,
        resizable: false,
        title: 'Advertencia',
        minWidth:ancho,
        my: "center",
        at: "center",
        of: window,
        show: 'blind',
        hide: 'blind',
        dialogClass: 'prueba',
        buttons: {
            "Aceptar": function() {
                $(this).dialog("close");
                //eliminarVacante(vacanteID);
            },
            "Cancelar": function() {
                $(this).dialog("close");
            }
        }
    });
}

function eliminarVacante(vacanteID) {
    var empleador = localStorage.getItem("nombreUsuario");
    $.ajax({
        url: 'http://apiempleo.apphb.com/api/Vacante/eliminarVacante/?ID=' + vacanteID + '&empleador=' + empleador,
        type: 'POST',
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            //alert(data);
            abrirConfirm("La vacante ha sido eliminada exitosamente");
        },
        error: function (xhr, textStatus, errorThrown) {
            //alert(errorThrown);
            abrirAlert("Ha ocurrido un problema, inténtelo nuevamente.");
        }
    });
}

function cerrar()
{
    localStorage.removeItem("nombreUsuario");
    localStorage.removeItem("tiempo");
    document.location.href = "inicio-sesion.html";
}

$("#selectMuni").change(function () {
    crearMapa();
});

function crearMapa() {
    setTimeout(function() {
        geoCiudad($("#selectMunicipios option:selected").html());
    }, 500);
}

function geoCiudad(cityName) {
    var geocoder =  new google.maps.Geocoder();
    geocoder.geocode( { 'address': ''+ cityName +', co'}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var lat = results[0].geometry.location.lat();
            var lon = results[0].geometry.location.lng();
            InitializeReg(lat, lon);
        } else {
            alert("Something got wrong " + status);
        }
    });
}

function abrirPrimerAlert(contenido){

    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var ancho=windowWidth-(windowWidth/10);
    $('#content-alert').html('<p>'+contenido+'</p>');
    $("#div-confirm").dialog({
        modal: true,
        draggable: false,
        resizable: false,
        title: 'Bienvenidos al Servicio de Empleo Móvil',
        minWidth:ancho,
        my: "center",
        at: "center",
        of: window,
        show: 'blind',
        hide: 'blind',
        dialogClass: 'prueba',
        buttons: {
            "Aceptar": function() {
                $(this).dialog("close");
            }
        }
    });
}

function abrirAlert(contenido){

    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var ancho=windowWidth-(windowWidth/10);
    $('#content-alert').html('<p>'+contenido+'</p>');
    $("#div-confirm").dialog({
        modal: true,
        draggable: false,
        resizable: false,
        title: 'Advertencia',
        minWidth:ancho,
        my: "center",
        at: "center",
        of: window,
        show: 'blind',
        hide: 'blind',
        dialogClass: 'prueba',
        buttons: {
            "Aceptar": function() {
                $(this).dialog("close");
            }
        }
    });
}

function abrirAlertMap(contenido){

    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var ancho=windowWidth-(windowWidth/10);
    $('#content-alert').html('<p>'+contenido+'</p>');
    $("#div-confirm").dialog({
        modal: true,
        draggable: false,
        resizable: false,
        title: 'Advertencia',
        minWidth:ancho,
        my: "center",
        at: "center",
        of: window,
        show: 'blind',
        hide: 'blind',
        dialogClass: 'prueba',
        buttons: {
            "Aceptar": function() {
                $(this).dialog("close");
                cargarOfertas("");
            }
        }
    });
}

function abrirConfirm(contenido){
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var ancho=windowWidth-(windowWidth/10);
    $('#content-alert').html('<p>'+contenido+'</p>');
    $("#div-confirm").dialog({
        modal: true,
        draggable: false,
        resizable: false,
        title: 'Advertencia',
        minWidth:ancho,
        my: "center",
        at: "center",
        of: window,
        show: 'blind',
        hide: 'blind',
        dialogClass: 'prueba',
        buttons: {
            "Aceptar": function() {
                $(this).dialog("close");
                document.location.href="lista_ofertas_empleador.html";
            }
        }
    });

}

function abrirConfirmSesion(contenido){
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var ancho=windowWidth-(windowWidth/10);
    $('#content-alert').html('<p>'+contenido+'</p>');
    $("#div-confirm").dialog({
        modal: true,
        draggable: false,
        resizable: false,
        title: 'Advertencia',
        minWidth:ancho,
        my: "center",
        at: "center",
        of: window,
        show: 'blind',
        hide: 'blind',
        dialogClass: 'prueba',
        buttons: {
            "Aceptar": function() {
                $(this).dialog("close");
                //OcultarDivCargando();
                document.location.href="lista_ofertas_empleador.html";
            }
        }
    });

}

function abrirAlertSesion(contenido){
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var ancho=windowWidth-(windowWidth/10);
    $('#content-alert').html('<p>'+contenido+'</p>');
    $("#div-confirm").dialog({
        modal: true,
        draggable: false,
        resizable: false,
        title: 'Advertencia',
        minWidth:ancho,
        my: "center",
        at: "center",
        of: window,
        show: 'blind',
        hide: 'blind',
        dialogClass: 'prueba',
        buttons: {
            "Aceptar": function() {
                $(this).dialog("close");
                cerrar();
            }
        }
    });

}

function volverMapa() {
    var detalle = $("#detalle");
    detalle.empty();
    $("#map_canvas").show();
}

function regresarListado() {
    document.location.href="lista_ofertas_empleador.html";
}

function crearVacante() {
    document.location.href="RegistrarOferta.html";
}

function gestionarVacantes() {
    document.location.href="lista_ofertas_empleador.html";
}

//Ocultar Div cargando...
function OcultarDivCargando(data) {
    $('#loading').css("display", "none");
}

//Mostrar Div cargando...
function MostrarDivCargando(data) {
    $('#loading').css("display", "block");
}

function getCurrentDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    var hour = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();

    if(dd<10) {
        dd='0'+dd
    } 

    if(mm<10) {
        mm='0'+mm
    } 

    today = mm+'/'+dd+'/'+yyyy+' '+hour+':'+minutes+':'+seconds;

    return today;
}

function getEndDate(fecha) {
    var today = new Date(fecha);
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd
    } 

    if(mm<10) {
        mm='0'+mm
    } 

    today = mm+'/'+dd+'/'+yyyy;

    return today;
}