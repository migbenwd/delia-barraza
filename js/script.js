(function($){
	
$(document).ready(function(){

	getServiciosTijuana();
	
	function getServiciosTijuana(){
	
	// Marca el inicio de la consulta
	const inicio = new Date();
	console.log('Inicio de la consulta - getServiciosTijuana', inicio.toLocaleString());
	
	$.ajax({
		url: ajaxParams.ajaxUrl,  // El URL de WordPress, usualmente 'wp-admin/admin-ajax.php'
		type: 'POST',
		data: {
			action: 'get_all_products_tijuana'  // El nombre de la acción que registramos
		},
		success: function(response) {

		let dataServicio = JSON.parse(response);

        // Guardar el array en local storage
        localStorage.setItem('serviciosTijuana', JSON.stringify(dataServicio.result));
        console.log('Datos guardados en local storage');

		// Recuperar y parsear los datos del local storage
                
		const datosGuardados = JSON.parse(localStorage.getItem('serviciosTijuana'));					
		const primerEstudio = datosGuardados[0].studie;
        // console.log('Primer campo de studie:', primerEstudio);			
		
		reestablecerPrecios();	
			
		const fin = new Date();
		console.log('Fin de la consulta:', fin.toLocaleString());

		const duracion = (fin - inicio) / 1000;
		console.log('Duración de la consulta:', duracion.toFixed(2), 'segundos');	
		
			
		},
		error: function(error) {
			console.log('Dió Error: ');
			console.log('Error: ', error);
		}
	});
			
	
	}
	
	
	
	function encontrarPrecioPorCodigo(codigo) {
		
	  // console.log('Entra en encontrarPrecioPorCodigo y su codigo es: ', codigo);

	  // Obtener el array de servicios desde el localStorage
	  const servicios = JSON.parse(localStorage.getItem('serviciosTijuana'));

	  // Buscar el servicio con el código dado
	  const servicioEncontrado = servicios.find(servicio => servicio.code === codigo);

	  // Si se encontró el servicio, retornar el precio, si no, retornar un mensaje o valor por defecto
	  return servicioEncontrado ? servicioEncontrado.price : 'Servicio no encontrado';
     }

	
	
		function reestablecerPrecios() {
	// Selecciona todos los elementos con la clase "clase-servicio-da-card"
	const elementosServicio = document.querySelectorAll('.clase-servicio-da-card');

	// Verifica si se encontraron elementos
	if (elementosServicio.length > 0) {
		// Si hay elementos, recorre cada uno y muestra el valor del atributo
		elementosServicio.forEach(elemento => {
			const codServicioMedico = parseInt(elemento.getAttribute('cod_servicio_medico'));
		
			// Buscar precio en LOCAL STORAGE
			const precioServicio = encontrarPrecioPorCodigo(codServicioMedico);
		    elemento.textContent = precioServicio;
			
		});
	} else {
		// Si no hay elementos, muestra un mensaje en la consola
		// console.log('No se encontraron elementos con la clase "clase-servicio-da-card".');
	}
	}		
		
		
});
})(jQuery);
