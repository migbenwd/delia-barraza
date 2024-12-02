(function($){
	
	$(document).ready(function(){
	
		
		let animacionActiva = false; // Bandera para controlar la animación	
		
		getServiciosTijuana();
		
		function getServiciosTijuana(){
		
		// Marca el inicio de la consulta
		const inicio = new Date();
		console.log('Inicio de la consulta - getServiciosTijuana', inicio.toLocaleString());
		
		activarAnimacion();	
		
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
	
			desactivarAnimacion();	
				
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
			
		  // console.log('Entra en encontrarPrecioPorCodigo');
	
		  // Obtener el array de servicios desde el localStorage
		  const servicios = JSON.parse(localStorage.getItem('serviciosTijuana'));
	
		  // Buscar el servicio con el código dado
		  const servicioEncontrado = servicios.find(servicio => servicio.code === codigo);
	
		  // Si se encontró el servicio, retornar el precio, si no, retornar un mensaje o valor por defecto
		  return servicioEncontrado ? servicioEncontrado.price : 'Servicio Sin Precio En esta Ciudad';
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
		
		
		// --------- ANIMACION 
		
		
	function AnimacionBusqueda() {
	if (animacionActiva) {
	console.log('entró en ANIMACION');	
	
	// Obtén el div contenedor por su atributo data-id
	const contenedor = document.querySelector('div[data-id="ccae5cb"]');
	
	// Crea el div interno
	const divCargando = document.createElement('div');
	divCargando.style.backgroundColor = '#03B0AB';
	divCargando.style.position = 'absolute';
	divCargando.style.top = 0;
	divCargando.style.left = 0;
	divCargando.style.width = '100%';
	divCargando.style.height = '100%';
	divCargando.style.display = 'flex';
	divCargando.style.alignItems = 'center';
	divCargando.style.justifyContent = 'center';
	divCargando.id = "migben-animator";
	divCargando.textContent = 'Cargando precios...';	
	divCargando.style.fontSize = '50px';
	divCargando.style.color = 'white';
		
	
	// Crea una imagen para el GIF
	/*
	const imgLoader = document.createElement('img');
	imgLoader.src = 'https://i.gifer.com/ZZ5H.gif'; // Reemplaza con la ruta de tu GIF
	divCargando.appendChild(imgLoader);
	*/
	
	// Agrega el div interno al contenedor
	contenedor.appendChild(divCargando);
	
	// Función para cambiar la opacidad (disminuye ligeramente)
	  divCargando.style.opacity = 0.7; // Opacidad inicial (puedes ajustar)
		
	// Función para cambiar la opacidad
	/*
	function cambiarOpacidad() {
	  divCargando.style.opacity = divCargando.style.opacity === '0.5' ? '1' : '0.5';
	}
	
	// Ejecuta la función cada segundo
	setInterval(cambiarOpacidad, 500);	
	*/
		
		
	}
	}	
	
	function activarAnimacion() {
	  animacionActiva = true;
	  AnimacionBusqueda();
	}
	
	function desactivarAnimacion() {
	  animacionActiva = false;
	  // Aquí puedes agregar código para eliminar el div de carga si es necesario
	  // Por ejemplo:
	  const divCargando = document.querySelector('div[id="migben-animator"]');
	  if (divCargando) {
		divCargando.remove();
		// divCargando.hide();
	  }
	}	
		
		
	// ----- EVENTO QUE SE DISPARA...CUANDO HACEN CLICK EN ALGUN FILTRO
	
			
	$(document ).on( 'jet-filter-content-rendered', function() {
	
		console.log('click en filtros jet smart');
		reestablecerPrecios();
	
	
	});
	
		
		
		
		
			
			
	});
	})(jQuery);
	