function configurar_db() {

    function execute(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS marcadores (latitud, longitud, texto)');
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
    db.transaction(GuardarMarca, errorOperacionGuardandoMarcador, efectuadaOperacion);
}

function GuardarMarca(tx) {
    var latitud = localStorage.getItem("latitud");
    var longitud = localStorage.getItem("longitud");
    var texto = localStorage.getItem("texto");
    
    tx.executeSql('INSERT INTO marcadores (latitud, longitud, texto) VALUES ("' + latitud + '", "' + longitud + '", "' + texto + '")');
}

// Transaction error callback
function errorOperacionGuardandoMarcador(err) {
    console.log(err);
    alert("Error procesando el almacenamiento del último marcador: " + err);
}

function efectuadaOperacion() {
    console.log("Marcador Almacenado!");
}