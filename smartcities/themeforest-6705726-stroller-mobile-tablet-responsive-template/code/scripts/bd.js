var id = 0;
var listaId = "";

function configurar_db() {

    function execute(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS vacantes (id, titulo, descripcion, vacantes, cargo, nombre_salario, sector, experiencia, nivel, profesion, municipio, empleador)');
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
    var vacantesGuardadas = localStorage.getItem("vacantesGuardadas");
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


