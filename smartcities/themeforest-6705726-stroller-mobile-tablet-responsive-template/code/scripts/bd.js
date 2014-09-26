var id = 0;
var listaId = "";
var listData = [];
var datos = [];

var map;
var markersArray = [];

function configurar_db() {

    function execute(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS vacantes (id, titulo, nombre_tipo, descripcion, vacantes, cargo, nombre_salario, sector, nombre_experiencia, nombre_nivel, profesion, nombre_departamento, nombre_municipio, fecha_publicacion, fecha_vencimiento, empleador)');
    }

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
    var empleador = localStorage.getItem("empleador_guardar");
    var municipio = localStorage.getItem("municipio_guardar"); 
    var vacantes = localStorage.getItem("vacantes_guardar");
    var cargo = localStorage.getItem("cargo_guardar");
    var sector = localStorage.getItem("sector_guardar");
    var profesion = localStorage.getItem("profesion_guardar");
    var salario = localStorage.getItem("salario_guardar");
    var experiencia = localStorage.getItem("experiencia_guardar");
    var nivel = localStorage.getItem("nivel_guardar");
    var descripcion = localStorage.getItem("descripcion_guardar");
    
    tx.executeSql('INSERT INTO vacantes (id, titulo, descripcion, vacantes, cargo, nombre_salario, sector, experiencia, nivel, profesion, municipio, empleador) VALUES ("' + id+ '", "' + titulo+ '", "' + descripcion+ '", "' + vacantes+ '", "' + cargo+ '", "' + salario+ '", "' + sector+ '", "' + experiencia+ '", "' + nivel+ '", "' + profesion+ '", "' + municipio+ '", "' + empleador+ '")');
}

// Transaction error callback
function errorOperacion(err) {
    console.log(err);
    alert("Error de operación: " + err);
}

function operacionEfectuada() {
    alert("La vacante ha sido almacenada como favorita.");
    $("#estrella" + localStorage.getItem("id_guardar")).attr("src", "images/estrella_llena.png")
    localStorage.setItem("vacantesGuardadas", localStorage.getItem("vacantesGuardadas")+",id"+ localStorage.getItem("id_guardar"));
    console.log("Operación Exitosa!");
}

function cargarOfertas(palabra)
{
    $("#map_canvas").hide();

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
                var metodoFavorito ='agregarFavoritos('+val['ID']+',\''+val['Titulo']+'\',\''+val['Empleador']+'\',\''+nom_mun+'\',\''+val['Num_vacantes']+'\',\''+val['Cargo']+'\',\''+val['Sector']+'\',\''+val['Profesion']+'\',\''+nom_sal+'\',\''+nom_exp+'\',\''+nom_niv+'\',\''+val['Descripcion']+'\')';
                var textoFavorita ="Agregar a favoritas";
                if (localStorage.getItem('vacantesGuardadas')){
                    if(vacantesGuardadas.indexOf("id"+val['ID'])==-1){
                        rutaEstrella="images/estrella_vacia.png";
                    }
                    else{
                        rutaEstrella="images/estrella_llena.png";
                        metodoFavorito="yaAgregado()";
                        textoFavorita ="Agregada a favoritas";
                    }
                }
                texto += '<div class="container">' +
                        '<div class="toggle-2">' +
                            '<a href="#" class="deploy-toggle-2 toggle-2">' +
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
                                                '<li class="right-list">Empleador: '+val['Empleador']+' </li>' +
                                            '</ul>' +
                                        '</a>' +
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
                                     '<div onclick=\"'+metodoFavorito+'\" style="width: 50%; float: left;"><img id="estrella'+val['ID']+'" class="star" style="margin: 0px !important; width:auto !important;" src="'+rutaEstrella+'" style="width: 20px;" /><label>'+textoFavorita+'</label></div>' +
                                     '<div id="btnDen'+val['ID']+'" style="padding-left: 20px; width: 50%; float: left;margin-top: 5px; display:block;"><a href="#" onclick="Denunciar('+val['ID']+')" class="button-icon icon-setting button-red">Denunciar</a></div>' +
                                     '<div id="comboDen'+val['ID']+'" style="padding-left: 20px; width: 50%; float: left;margin-top: 5px; display:none;">Motivo de la denuncia: <br />'+ 
                                     '<select class="styled-select" name="selectMotivoDenuncia'+val['ID']+'" id="selectMotivoDenuncia'+val['ID']+'">'+
                                        '<option value="1">Vacante sospechosa / engañosa</option>'+
                                        '<option value="2">Lenguaje no adecuado</option>'+
                                        '<option value="3">Información de contacto errónea </option>'+
                                        '<option value="4">Sospecha de Trata de personas</option>'+
                                    '</select>'+
                                    '<br /> <a href="#" onclick="GuardarDenuncia('+val['ID']+')" class="button-icon icon-setting button-red">Confirmar denuncia</a>&nbsp;<a href="#" onclick="CancelarDenuncia('+val['ID']+')" class="button-icon icon-setting button-red">Cancelar</a>'+
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
            OcultarDivCargando();
        },
        error: function (xhr, textStatus, errorThrown) {
            //alert(errorThrown);
            OcultarDivCargando();
            alert("Ha ocurrido un problema, inténtelo nuevamente.");
        }
    });
}

function cargarVacantesMapa(palabra) {

    var ofertas = $("#ofertas");
    ofertas.empty();

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

    $.ajax({
        url: 'http://apiempleo.apphb.com/api/Vacante/obtenerVacantesMapa?palabra=' + palabra + '&tipo=' + tipo + '&salario=' + salario + '&experiencia=' + experiencia + '&nivel=' + nivel + '&municipio=' + municipio,
        type: 'POST',
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            var cantidad = data.length;
            if(cantidad != 0){
                $.each(data, function (i, val) {
                    listData[i] = { "ID": "" + val['ID'] + "", "Nombre": "" + val['Titulo'] + "", "GeoLat": "" + val['Latitud'] + "", "GeoLong": "" + val['Longitud'] + "", "Municipio": "" + nom_mun + "", "Salario": "" + nom_sal + "", "Experiencia": "" + nom_exp + "", "Nivel": "" + nom_niv + "" };
                });
                setTimeout(function() {
                    Initialize(listData);
                }, 500);
                $("#map_canvas").show();
            }
            else {
                abrirAlert("No existen vacantes con los filtros seleccionados, intente seleccionando valores diferentes.");
            }
            OcultarDivCargando();
        },
        error: function (xhr, textStatus, errorThrown) {
            alert("Ha ocurrido un problema, inténtelo nuevamente.");
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

        //alert(item.Municipio);
        //alert(item.Salario);

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
    // Google has tweaked their interface somewhat - this tells the api to use that new UI
    google.maps.visualRefresh = true;
    var cityCenter = new google.maps.LatLng(lat, lon);

    // These are options that set initial zoom level, where the map is centered globally to start, and the type of map to show
    var mapOptions = {
        zoom: 14,
        center: cityCenter,
        mapTypeId: google.maps.MapTypeId.G_NORMAL_MAP
    };

    // This makes the div with id "map_canvas" a google map
    map = new google.maps.Map(document.getElementById("map_canvas2"), mapOptions);

    google.maps.event.addListener(map, "click", function(event)
    {
        // place a marker
        placeMarker(event.latLng);

        // display the lat/lng in your form's lat/lng fields

        //document.getElementById("latFld").value = event.latLng.lat();
        //document.getElementById("lngFld").value = event.latLng.lng();

        localStorage.setItem("latitud", event.latLng.lat());
        localStorage.setItem("longitud", event.latLng.lng());
    });

    /*var myLatlng = new google.maps.LatLng(53.40091, -2.994464);

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'Tate Gallery'
    });

    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')

    var data = [
              { "Id": 1, "PlaceName": "Liverpool Museum", "OpeningHours": "9-5, M-F", "GeoLong": "53.410146", "GeoLat": "-2.979919" },
              { "Id": 2, "PlaceName": "Merseyside Maritime Museum ", "OpeningHours": "9-1,2-5, M-F", "GeoLong": "53.401217", "GeoLat": "-2.993052" },
              { "Id": 3, "PlaceName": "Walker Art Gallery", "OpeningHours": "9-7, M-F", "GeoLong": "53.409839", "GeoLat": "-2.979447" },
              { "Id": 4, "PlaceName": "National Conservation Centre", "OpeningHours": "10-6, M-F", "GeoLong": "53.407511", "GeoLat": "-2.984683" }
    ];
 
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
            content: "<div class='infoDiv'><h2>" + item.Nombre + "</h2><div><input type='submit' class='buttonWrap button button-dark contactSubmitButton' onclick='prueba(" + item.Id + ")' value='Ver detalles' /></div></div>"
        });

        // finally hook up an "OnClick" listener to the map so it pops up out info-window when the marker-pin is clicked!
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, marker);
        });

    })*/
}

function placeMarker(location) {
            // first remove all markers if there are any
    deleteOverlays();

    var marker = new google.maps.Marker({
        position: location, 
        map: map
    });

    marker.setIcon('images/marker.png');

    // add marker in markers array
    markersArray.push(marker);

    //map.setCenter(location);
}

// Deletes all markers in the array by removing references to them
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

    $.ajax({
        url: 'http://apiempleo.apphb.com/api/Vacante/obtenerVacante/' + vacanteID,
        type: 'POST',
        dataType: 'json',
        success: function (data, textStatus, xhr) {

            alert(data['ID']);
            var rutaEstrella = "images/estrella_vacia.png";
            var metodoFavorito ='agregarFavoritos('+data['ID']+',\''+data['Titulo']+'\',\''+data['Empleador']+'\',\''+data['Municipio']+'\',\''+data['Num_vacantes']+'\',\''+data['Cargo']+'\',\''+data['Sector']+'\',\''+data['Profesion']+'\',\''+data['SalarioID']+'\',\''+data['ExperienciaID']+'\',\''+data['Nivel_estudiosID']+'\',\''+data['Descripcion']+'\')';
            var textoFavorita ="Agregar a favoritas";
            if (localStorage.getItem('vacantesGuardadas')){
                if(vacantesGuardadas.indexOf("id"+data['ID'])==-1){
                    rutaEstrella="images/estrella_vacia.png";
                }
                else{
                    rutaEstrella="images/estrella_llena.png";
                    metodoFavorito="yaAgregado()";
                    textoFavorita ="Agregada a favoritas";
                }
            }
            texto += '<div class="container">' +
                        '<div class="toggle-2">' +
                            '<a href="#" class="deploy-toggle-2 toggle-2">' +
                                data['Titulo'] + '<label style="font-weight: bolder; font-size: 15px; color: black;">Vence en '+data['DiasVence']+' días</label>' +
                            '</a>' +
                        '</div>' + 
                        '<div class="toggle-content">' +
                            '<p style="text-align:justify;">' +
                                '<label>' +
                                    'Fecha Publicación: '+data['Fecha_publicacion']+'</label>' +
                                    'Fecha Vencimiento: '+data['Fecha_vencimiento']+'</label><br /><br />' +
                                data['Descripcion'] +
                            '</p>' +
                            '<div class="toggle-content">' +
                                '<p><strong>Datos del Empleador:</strong></p>' +
                                '<div class="one-half-responsive ">' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
            /*texto += '<div class="container">' +
                    '<div class="toggle-2">' +
                        '<a href="#" class="deploy-toggle-2 toggle-2">' +
                            data['Titulo'] + '<label style="font-weight: bolder; font-size: 15px; color: black;">Vence en '+data['DiasVence']+' días</label>' +
                        '</a>' +
                    '<div class="toggle-content">' +
                        '<p style="text-align:justify;">' +
                            '<label>' +
                                'Fecha Publicación: '+data['Fecha_publicacion']+'</label>' +
                                'Fecha Vencimiento: '+data['Fecha_vencimiento']+'</label><br /><br />' +
                            data['Descripcion'] +
                        '</p>' +
                        '<div class="toggle-content">' +
                            '<p><strong>Datos del Empleador:</strong></p>' +
                            '<div class="one-half-responsive ">' +
                                '<div class="submenu-navigation">' +
                                    '<div class="submenu-nav-items" style="overflow: hidden; display: block;"></div>' +
                                    '<a href="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                        '<ul style="margin-bottom:0px;" class="icon-list">' +
                                            '<li class="right-list">Empleador: '+data['Empleador']+' </li>' +
                                        '</ul>' +
                                    '</a>' +
                                    '<a href="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                        '<ul style="margin-bottom:0px;" class="icon-list">' +
                                            '<li class="right-list">Ciudad: '+data['Municipio']+' </li>' +
                                        '</ul>' +
                                    '</a>' +
                                    '<a href="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                        '<ul style="margin-bottom:0px;" class="icon-list">' +
                                            '<li class="right-list">Número de vacantes: '+data['Num_vacantes']+' </li>' +
                                        '</ul>' +
                                    '</a>' +
                                    '<a href="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                        '<ul style="margin-bottom:0px;" class="icon-list">' +
                                            '<li class="right-list">Cargo: '+data['Cargo']+' </li>' +
                                        '</ul>' +
                                    '</a>' +
                                    '<a href="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                        '<ul style="margin-bottom:0px;" class="icon-list">' +
                                            '<li class="right-list">Sector: '+data['Sector']+' </li>' +
                                        '</ul>' +
                                    '</a>' +
                                    '<a href="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                        '<ul style="margin-bottom:0px;" class="icon-list">' +
                                            '<li class="right-list">Profesión: '+data['Profesion']+' </li>' +
                                        '</ul>' +
                                    '</a>' +
                                    '<a href="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                        '<ul style="margin-bottom:0px;" class="icon-list">' +
                                            '<li class="right-list">Salario: '+data['SalarioID']+' </li>' +
                                        '</ul>' +
                                    '</a>' +
                                    '<a href="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                        '<ul style="margin-bottom:0px;" class="icon-list">' +
                                            '<li class="right-list">Experiencia: '+data['ExperienciaID']+' </li>' +
                                        '</ul>' +
                                    '</a>' +
                                    '<a href="#" style="border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                        '<ul style="margin-bottom:0px;" class="icon-list">' +
                                            '<li class="right-list">Nivel: '+data['Nivel_estudiosID']+' </li>' +
                                        '</ul>' +
                                    '</a>' +
                                    '<a href="#" style="text-align:center !important; border-top: solid 1px rgba(0,0,0,0.1); padding-left: 20px !important; padding-top: 10px !important; padding-bottom: 10px !important; border-bottom: solid 1px rgba(0,0,0,0.1) !important;">' +
                                    'Comparta esta oportunidad de trabajo'+
                                        '<ul style="margin-bottom:0px;" class="icon-list">' +
                                            '<li style="padding-left:0px !important;">' +
                                                '<img src="images/misc/facebook.png" style="margin: 0px !important;" class="star" onclick="abrirPaginaFacebook(\''+data['Titulo']+'\', '+data['ID']+')">' +
                                                '<img src="images/misc/twitter.png" class="star" style="margin-left: 5px;" onclick="abrirPaginaTwitter(\''+data['Titulo']+'\', '+data['ID']+')">' + 
                                            '</li>' +
                                        '</ul>' +
                                    '</a>' +
                                '</div>' +
                            '</div>' +
                            '<div class="one-half-responsive" style="text-align:center !important;">' +
                                 '<div onclick=\"'+metodoFavorito+'\" style="width: 50%; float: left;"><img id="estrella'+data['ID']+'" class="star" style="margin: 0px !important; width:auto !important;" src="'+rutaEstrella+'" style="width: 20px;" /><label>'+textoFavorita+'</label></div>' +
                                 '<div id="btnDen'+data['ID']+'" style="padding-left: 20px; width: 50%; float: left;margin-top: 5px; display:block;"><a href="#" onclick="Denunciar('+data['ID']+')" class="button-icon icon-setting button-red">Denunciar</a></div>' +
                                 '<div id="comboDen'+data['ID']+'" style="padding-left: 20px; width: 50%; float: left;margin-top: 5px; display:none;">Motivo de la denuncia: <br />'+ 
                                 '<select class="styled-select" name="selectMotivoDenuncia'+data['ID']+'" id="selectMotivoDenuncia'+data['ID']+'">'+
                                    '<option value="1">Vacante sospechosa / engañosa</option>'+
                                    '<option value="2">Lenguaje no adecuado</option>'+
                                    '<option value="3">Información de contacto errónea </option>'+
                                    '<option value="4">Sospecha de Trata de personas</option>'+
                                '</select>'+
                                '<br /> <a href="#" onclick="GuardarDenuncia('+data['ID']+')" class="button-icon icon-setting button-red">Confirmar denuncia</a>&nbsp;<a href="#" onclick="CancelarDenuncia('+data['ID']+')" class="button-icon icon-setting button-red">Cancelar</a>'+
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '</div>';*/

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

function cerrar()
{
    localStorage.setItem("nombreUsuario", "");
    document.location.href = "inicio-sesion.html";
}

$("#selectMuni").change(function () {
    crearMapa();
});

function crearMapa() {
    setTimeout(function() {
        geoCiudad($("#selectMuni option:selected").html());
    }, 500);
}

function geoCiudad(cityName) {
    var geocoder =  new google.maps.Geocoder();
    geocoder.geocode( { 'address': ''+ cityName +', co'}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var lat = results[0].geometry.location.lat();
            var lon = results[0].geometry.location.lng();
            InitializeReg(lat, lon);
            //alert("location : " + results[0].geometry.location.lat() + " " +results[0].geometry.location.lng()); 
        } else {
            alert("Something got wrong " + status);
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

//Ocultar Div cargando...
function OcultarDivCargando(data) {
    $('#loading').css("display", "none");
}

//Mostrar Div cargando...
function MostrarDivCargando(data) {
    $('#loading').css("display", "block");
}

$(document).ready(function () {

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

    $("#map_canvas").hide();

});


