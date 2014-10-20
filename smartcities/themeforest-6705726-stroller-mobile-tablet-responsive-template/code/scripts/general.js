$(function () {
    $("#selectDepartamentos").combobox();
    $("#toggle").click(function () {
        $("#selectDepartamentos").toggle();
    });

    $('#combobox option').each(function () {
        $(this).removeAttr('selected')
    });

    //Evento change select departamento
    $("#selectDepartamentos").combobox({
        selectFirst: true,
        select: function (event, ui) {
            //                    alert(ui.item.text); alert(ui.item.value);
            $('input.ui-autocomplete-input:eq(1)').val("");
            cargarMunicipios();
        },
        focus: function (event, ui) { event.preventDefault(); }
    });

    $("#selectMunicipios").combobox({
        selectFirst: true,
        focus: function (event, ui) { event.preventDefault(); }
    });

    $("#toggle").click(function () {
        $("#selectMunicipios").toggle();
    });
});

function enviar(opcion) {
    //alert($('input.ui-autocomplete-input:eq(0)').val());
    if ($("#selectDepartamentos").val() == null || $('input.ui-autocomplete-input:eq(0)').val() == "") {
        alert("Debe seleccionar un departamento.")
    }
    else {
        if ($("#selectMunicipios").val() == null || $('input.ui-autocomplete-input:eq(1)').val() == "") {
            alert("Debe seleccionar un municipio.")
        }
        else {
            localStorage.setItem('Departamento', $("#selectDepartamentos").val());
            localStorage.setItem('Municipio', $("#selectMunicipios").val());
            localStorage.setItem('Nivel', $("#selectNivel").val());
            localStorage.setItem('Oportunidad', $("#selectTipoOportunidad").val());
            localStorage.setItem('Salario', $("#selectSalario").val());
            localStorage.setItem('Experiencia', $("#selectExperiencia").val());
            localStorage.setItem('NombreDepartamento', $("#selectDepartamentos option:selected").html());
            localStorage.setItem('NombreMunicipio', $("#selectMunicipios option:selected").html());
            localStorage.setItem('NombreNivel', $("#selectNivel option:selected").html());
            localStorage.setItem('NombreExperiencia', $("#selectExperiencia option:selected").html());
            localStorage.setItem('NombreSalario', $("#selectSalario option:selected").html());

            if (opcion == 1) {
                cargarOfertas($("#contactNameField").val());
            }
            else {
                cargarVacantesMapa($("#contactNameField").val());
            }
        }
    }
}

/*function agregarFavoritos(id) {
    //$("#estrella" + id).attr("src", "images/estrella_llena.png")
    alert("Favoritos: " + id);
}

function Denunciar(id) {
    alert("Denuncia: " + id)
}*/

function agregarFavoritos(id, titulo, tipo, descripcion, vacantes, cargo, salario, sector, experiencia, nivel, profesion, departamento, municipio, fechaPublicacion, fechaVencimiento, diasVence, empleador, telefono, indicativo, celular, direccion, email, fecha_actualizacion) {
    //$("#estrella" + id).attr("src", "images/estrella_llena.png");
    localStorage.setItem("id_guardar",id);
    localStorage.setItem("titulo_guardar", titulo);
    localStorage.setItem("tipo_guardar", tipo);
    localStorage.setItem("descripcion_guardar", descripcion);
    localStorage.setItem("vacantes_guardar",vacantes);
    localStorage.setItem("cargo_guardar", cargo);
    localStorage.setItem("salario_guardar", salario);
    localStorage.setItem("sector_guardar", sector);
    localStorage.setItem("experiencia_guardar", experiencia);
    localStorage.setItem("nivel_guardar", nivel);
    localStorage.setItem("profesion_guardar",profesion);
    localStorage.setItem("departamento_guardar", departamento);
    localStorage.setItem("municipio_guardar", municipio);
    localStorage.setItem("fechaPublicacion_guardar", fechaPublicacion);
    localStorage.setItem("fechaVencimiento_guardar", fechaVencimiento);
    localStorage.setItem("diasVence_guardar", diasVence);
    localStorage.setItem("empleador_guardar", empleador);
    localStorage.setItem("telefono_guardar", telefono);
    localStorage.setItem("indicativo_guardar", indicativo);
    localStorage.setItem("celular_guardar", celular);
    localStorage.setItem("direccion_guardar", direccion);
    localStorage.setItem("email_guardar", email);
    localStorage.setItem("fecha_actualizacion", fecha_actualizacion);
    guardarVacante();
}

function Denunciar(id) {
    $("#btnDen"+id).hide();
    $("#comboDen"+id).show();
    //alert("Denuncia: "+id)
}

function GuardarDenuncia(id, titulo, tipo, descripcion, vacantes, cargo, salario, sector, experiencia, nivel, profesion, departamento, municipio, fechaPublicacion, fechaVencimiento, diasVence, empleador, telefono, indicativo, celular, direccion, email, fecha_actualizacion) {
    var denuncia = new Object();
    denuncia.Fecha = null;
    denuncia.Tipo = $("#selectMotivoDenuncia" + id + " option:selected").html();
    denuncia.vacanteID = id;
    denuncia.Email = email;
    denuncia.TituloEmail = "La vacante '" + titulo + "' publicada a través del Servicio de Empleo Móvil ha sido denunciada";
    denuncia.TextoEmail = "Señor/a " + empleador + "<br/><br/>" +
          "La vacante '" + titulo + "' ha sido denunciada por varios usuarios de la app. Por precaución la vacante ha sido automáticamente despublicada.<br/><br/>" +
          "RESUMEN DE LA VACANTE:<br/><br/>" +
          "Título de la vacante: " + titulo + "<br/>" +
          "Tipo de oportunidad”: " + tipo + "<br/>" +
          "Descripción de la vacante: " + descripcion + "<br/>" +
          "Cargo: " + cargo + "<br/>" +
          "Salario ofrecido: " + salario + "<br/>" +
          "Experiencia mínima requerida: " + experiencia + "<br/>" +
          "Nivel de estudio mínimo requerido: " + nivel + "<br/>" +
          "Profesión: " + profesion + "<br/>" +
          "Ubicación: " + departamento + "/" + municipio + "<br/>" +
          "Dirección de referencia: " + direccion + "<br/>" +
          "Correo Electrónico de Contacto: " + email + "<br/>" +
          "Teléfono de Contacto: " + telefono + "<br/><br/>" +
          "Servicio de Empleo Móvil - Este es un correo electrónico automático, por favor no lo responda";

    $.ajax({
        url: 'http://apiempleo.apphb.com/api/Vacante/agregarDenuncia',
        type: 'POST',
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(denuncia),
        success: function (data, textStatus, xhr) {
            alert(data);
            if(data=="Denuncia creada correctamente"){
                $("#btnDen"+id).show();
                $("#comboDen"+id).hide();
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

function CancelarDenuncia(id){
    $("#btnDen"+id).show();
    $("#comboDen"+id).hide();
}

function yaAgregado(){
    alert("La vacante ya ha sido agregada como favorita.");
}

function abrirPaginaFacebook(nombre, id) {
    var url = 'http://empleomovil.apphb.com/Vacantes/Details/' + id;
    var title = 'Comparta esta vacante';
    var descr = 'Descripción de la vacante de prueba';
    var image = 'http://goo.gl/B8AWrE';
    window.open('http://www.facebook.com/sharer.php?s=100&p[title]=' + title + '&p[summary]=' + descr + '&p[url]=' + url + '&p[images][0]=' + image, 'sharer', 'top=auto,left=auto,toolbar=0,status=0,width=auto,height=auto');
}

function abrirPaginaTwitter(nombre, id) {
    var url = 'http://empleomovil.apphb.com/Vacantes/Details/' + id;
    window.open("https://twitter.com/intent/tweet?url=" + url + "&text=Oportunidad de empleo: " + nombre, "_blank", "closebuttoncaption=Regresar");
}

function cargarDeptos() {
    MostrarDivCargando();
    $('#selectDepartamentos').empty();
    var texto = "";
    var url = "http://www.dane.gov.co/Divipola/ControladorDivipola?tipoConsulta=depa";
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'xml',
        crossDomain: true,
        contentType: "application/xml; charset=utf-8",
        success: function (data) {
            $(data).find('DEPARTAMENTO').each(function () {
                var CODIGO_DEPARTAMENTO = $(this).find('CODIGO_DEPARTAMENTO').text();
                var NOMBRE_DEPARTAMENTO = $(this).find('NOMBRE_DEPARTAMENTO').text();
                $('#selectDepartamentos').append('<option value=' + CODIGO_DEPARTAMENTO + '>' + NOMBRE_DEPARTAMENTO + '</option>');
            });

            if (localStorage.getItem('Departamento')) {
                $("#selectDepartamentos").val(localStorage.getItem('Departamento'));
            }
            else {
                localStorage.setItem('Departamento', $("#selectDepartamentos").val());
            }
            $('input.ui-autocomplete-input:eq(0)').val($('#selectDepartamentos option:selected').text());
            cargarMunicipios();
            OcultarDivCargando();
        },
        error: function (x, y, z) {
            OcultarDivCargando();
            abrirAlert("Ha ocurrido un problema, inténtelo nuevamente.");
        },
        timeout: 60000
    });
}

function cargarMunicipios() {
    MostrarDivCargando();
    $('#selectMunicipios').empty();
    var texto = "";
    var url = "http://www.dane.gov.co/Divipola/ControladorDivipola?tipoConsulta=municpio&idDepa=" + $("#selectDepartamentos").val();
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'xml',
        crossDomain: true,
        contentType: "application/xml; charset=utf-8",
        success: function (data) {
            $(data).find('MUNICIPIO').each(function () {
                var CODIGO_DPTO_MPIO = $(this).find('CODIGO_DPTO_MPIO').text();
                var NOMBRE_MUNICIPIO = $(this).find('NOMBRE_MUNICIPIO').text();
                $('#selectMunicipios').append('<option value=' + CODIGO_DPTO_MPIO + '>' + NOMBRE_MUNICIPIO + '</option>');
            });
            if (localStorage.getItem('Municipio')) {
                $("#selectMunicipios").val(localStorage.getItem('Municipio'));
            }
            else {
                localStorage.setItem('Municipio', $("#selectMunicipios").val());
            }
            $('input.ui-autocomplete-input:eq(1)').val($('#selectMunicipios option:selected').text());
            OcultarDivCargando();
        },
        error: function (x, y, z) {
            OcultarDivCargando();
            abrirAlert("Ha ocurrido un problema, inténtelo nuevamente.")
        },
        timeout: 60000
    });
}

function cargar_sectores() {
    $("#select_sector>option").remove();
    var texto = "";
    var url = "http://servicedatosabiertoscolombia.cloudapp.net/v1/Unidad_Administrativa_Especial_Servicio_Publico_de_Empleo/sectorempresarial?$format=json";
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'jsonp',
        crossDomain: true,
        success: function (data) {
            $.each(data, function (i, field) {
                var cant = field.length;
                $.each(field, function (x, item) {
                    texto += " <option value='" + field[x].idsector + "'>" + field[x].descripcion + "</option>";
                });
                $("#select_sector").append(texto);
                $("#select_sector").val("-1");
                $("#select_sector").selectmenu('refresh');
            });
        },
        error: function (x, y, z) {
            
        }, 
        timeout: 15000                          
    });
}

function cargar_niveles() {
    $("#select_nivel>option").remove();
    var texto = "";
    var url = "http://servicedatosabiertoscolombia.cloudapp.net/v1/Unidad_Administrativa_Especial_Servicio_Publico_de_Empleo/niveleducativo?$format=json";
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'jsonp',
        crossDomain: true,
        success: function (data) {
            $.each(data, function (i, field) {
                var cant = field.length;
                $.each(field, function (x, item) {
                    texto += " <option value='" + field[x].ided + "'>" + field[x].niveleductivo + "</option>";
                });
                $("#select_nivel").append(texto);
                $("#select_nivel").val("4");
                $("#select_nivel").selectmenu('refresh');
            });
        },
        error: function (x, y, z) {
            
        }, 
        timeout: 15000                          
    });
}

function guardar()
{
    var titulo = $("#txtTitulo").val();
    var tipo = $("#selectTipo").val();
    var tipoTexto = $("#selectTipo option:selected").html();
    var descripcion = $("#txtDescripcion").val();
    var numVacantes = $("#selectVacantes").val();
    var cargo = $("#txtCargo").val();
    var salario = $("#selectSalario").val();
    //var sector = $("#select_sector").val();
    var experiencia = $("#selectExperiencia").val();
    var nivel = $("#select_nivel").val();
    var profesion = $("#txtProfesion").val();
    var salarioTexto = $("#selectSalario option:selected").html();
    var departamento = $("#selectDepartamentos").val();
    var departamentoTexto = $("#selectDepartamentos option:selected").html();
    var municipio = $("#selectMunicipios").val();
    var municipioTexto = $("#selectMunicipios option:selected").html();
    var correo = $("#txtCorreo").val();
    var telefono = $("#txtTelefono").val();
    var fecha = $("#txtfechaVencimiento").val();

    if(titulo && tipo && descripcion && cargo && departamento != null && municipio != null && correo && telefono && fecha) {

        localStorage.setItem('titulo', titulo);
        localStorage.setItem('tipo', tipo);
        localStorage.setItem('descripcion', descripcion);
        localStorage.setItem('numVacantes', numVacantes);
        localStorage.setItem('cargo', cargo);
        localStorage.setItem('salario', salario);
        //localStorage.setItem('sector', sector);
        localStorage.setItem('experiencia', experiencia);
        localStorage.setItem('nivel', nivel);
        localStorage.setItem('profesion', profesion);
        localStorage.setItem('departamento', departamento);
        localStorage.setItem('municipio', municipio);
        localStorage.setItem('correo', correo);
        localStorage.setItem('telefono', telefono);
        localStorage.setItem('fecha', fecha);

        $("#detalleTitulo").text(titulo);
        $("#detalleTipo").text(tipoTexto);
        $("#detalleDesc").text(descripcion);
        $("#detalleCargo").text(cargo);
        $("#detalleSalario").text(salarioTexto);
        $("#detalleDepto").text(departamentoTexto);
        $("#detalleMuni").text(municipioTexto);

        $("#formularioVacante").css("display", "none");
        $("#detalleVacante").css("display", "block");
    }
}

function editar()
{
    var id = $("#txtId").val();
    var titulo = $("#txtTitulo").val();
    var tipo = $("#selectTipo").val();
    var tipoTexto = $("#selectTipo option:selected").html();
    var descripcion = $("#txtDescripcion").val();
    var numVacantes = $("#selectVacantes").val();
    var cargo = $("#txtCargo").val();
    var salario = $("#selectSalario").val();
    //var sector = $("#select_sector").val();
    var experiencia = $("#selectExperiencia").val();
    var nivel = $("#select_nivel").val();
    var profesion = $("#txtProfesion").val();
    var salarioTexto = $("#selectSalario option:selected").html();
    var departamento = $("#selectDepartamentos").val();
    var departamentoTexto = $("#selectDepartamentos option:selected").html();
    var municipio = $("#selectMunicipios").val();
    var municipioTexto = $("#selectMunicipios option:selected").html();
    var correo = $("#txtCorreo").val();
    var telefono = $("#txtTelefono").val();
    var fecha = $("#txtfechaVencimiento").val();

    if(id && titulo && tipo && descripcion && cargo && departamento != null && municipio != null && correo && telefono && fecha) {

        localStorage.setItem('id', id);
        localStorage.setItem('titulo', titulo);
        localStorage.setItem('tipo', tipo);
        localStorage.setItem('descripcion', descripcion);
        localStorage.setItem('numVacantes', numVacantes);
        localStorage.setItem('cargo', cargo);
        localStorage.setItem('salario', salario);
        //localStorage.setItem('sector', sector);
        localStorage.setItem('experiencia', experiencia);
        localStorage.setItem('nivel', nivel);
        localStorage.setItem('profesion', profesion);
        localStorage.setItem('departamento', departamento);
        localStorage.setItem('municipio', municipio);
        localStorage.setItem('correo', correo);
        localStorage.setItem('telefono', telefono);
        localStorage.setItem('fecha', fecha);

        $("#detalleTitulo").text(titulo);
        $("#detalleTipo").text(tipoTexto);
        $("#detalleDesc").text(descripcion);
        $("#detalleCargo").text(cargo);
        $("#detalleSalario").text(salarioTexto);
        $("#detalleDepto").text(departamentoTexto);
        $("#detalleMuni").text(municipioTexto);

        $("#formularioVacante").css("display", "none");
        $("#detalleVacante").css("display", "block");
    }
}

function regresar()
{
    $("#detalleVacante").css("display", "none");
    $("#formularioVacante").css("display", "block");
    $("#contactForm").show();
}