(function($){
	
	$(document).ready(function(){
		
		
		// Llamamos a la función para verificar
		existeCiudadSeleccionada();
		comprobarCarpeta();
		
		 var CityIdSelex = 0;
		
		const ciudadSeleccionada = document.getElementById('ciudad-seleccionada-spam');
		ciudadSeleccionada.addEventListener('click', () => {
			
			MostrarModal();
	
		});
		
		
		function existeCiudadSeleccionada() {
		  // Obtenemos el valor del localStorage con la clave "city_selected_id"
		  const ciudadSeleccionada = localStorage.getItem('city_selected_id');
			
		  // Obtenemos el valor del localStorage con la clave "city_selected_name"
		  const ciudadSeleccionadaTexto = localStorage.getItem('city_selected_name');
			
		  // Verificamos si el valor obtenido es null (no existe) o una cadena vacía
		  if (ciudadSeleccionada === null || ciudadSeleccionada === '') {
			console.log('No existe una ciudad seleccionada en el localStorage.');
			
			 // Mostramos el MODAL - POP UP  
			 MostrarModal();
			 
			
			return false;
		  } else {
			console.log('Existe una ciudad seleccionada:', ciudadSeleccionada);
			
			  
				  
			  // Mostrar el texto de la ciudad en el span con id "ciudad-seleccionada-spam"
			  const ciudadSpan1 = document.getElementById('ciudad-seleccionada-spam');
			  if (ciudadSpan1) {
				  ciudadSpan1.textContent = ciudadSeleccionadaTexto;  // Asignamos el texto al span
			  }			  
			  
			return true;
		  }
		}
		
		function comprobarCarpeta(){
	
			const urlActual = window.location.href;
			const contieneServicio = urlActual.includes('servicio');
	
			if (contieneServicio) {
				console.log("El dominio contiene la carpeta 'servicio'");
				// Si existe city_selected_id en LOCAL ESTORAGE...pues... reestablecer precio
				reestablecerPrecios();
			} else {
				console.log("El dominio NO contiene la carpeta 'servicio'");
			}		
		}
		
	
		// ------------------------------------------------------------------------------------------------------------------//
		
		
		function MostrarModal(){
		/*	
		localStorage.removeItem('city_selected_id');		
		localStorage.removeItem('city_selected_name');		
		localStorage.removeItem('servicios_city');
		*/
			
		$.ajax({
			url: ajaxParams.ajaxUrl,  // El URL de WordPress, usualmente 'wp-admin/admin-ajax.php'
			type: 'POST',
			data: {
				action: 'mostrar_modal_de_ciudades'
			},
			success: function(response) {
			$('body').append(response);	
			showModal();
			colocarEventClicksEnModal();
		
			},
			error: function(error) {
				console.log('Dió Error: ');
				console.log('Error: ', error);
			}
		});
		}
		
		
		
		// --------------------------------------------- CLICK EN DIV CON ID DE CIUDAD
		// 
		
		function colocarEventClicksEnModal(){
	
			const modalCiudadesXX = document.querySelectorAll('.modal-ciudades');
			  const cantidadModales = modalCiudadesXX.length;
			  // Mostramos el resultado en la consola (puedes modificarlo para mostrar el resultado donde quieras)
			  console.log('Hay', cantidadModales, 'modales de ciudades en la página.');
			
			 const modalCiudades = document.getElementById('modal-ciudades');
	
			// Agregamos un event listener para detectar clics dentro del div
			
			modalCiudades.addEventListener('click', (event) => {
				
			  // Verificamos si el elemento en el que se hizo clic tiene el atributo data-ciudad-id
			  
			  if (event.target.hasAttribute('data-ciudad-id')) {
				  
			   // Extraemos el texto del div al que se hizo clic
				const ciudadTexto = event.target.textContent || event.target.innerText;
				console.log('El texto de la ciudad es:', ciudadTexto);
				  
				// Obtenemos el valor del atributo y lo mostramos en consola (puedes reemplazar esto con cualquier otra acción)
				const ciudadId = event.target.dataset.ciudadId;
				console.log('El ID de la ciudad es:', ciudadId);
				  
				CityIdSelex = ciudadId;  
				  
				localStorage.setItem('city_selected_id', ciudadId);
				 
				console.log('Se procede a crear LocalStorage de Nombre de Ciudad');
				 
				localStorage.setItem('city_selected_name', ciudadTexto);
				  
				  
				// Mostrar el texto de la ciudad en el span con id "ciudad-seleccionada-spam"
				const ciudadSpan = document.getElementById('ciudad-seleccionada-spam');
				if (ciudadSpan) {
				  ciudadSpan.textContent = ciudadTexto;  // Asignamos el texto al span
				}			  
				
				const modal = document.getElementById("modal-ciudades");
				modal.classList.remove('show'); // Ocultar el modal
				modal.style.transition = 'transform 0.5s ease-in-out';
				modal.style.transform = 'translateY(-100%)';
				
				
				setTimeout(() => {
					  modal.style.display = 'none';
				  }, 800); // 5000 milisegundos = 5 segundos
				
				modal.remove();
				 console.log("Elemento 'modal-ciudades' eliminado correctamente.");  
				  
				  
				var CiudadSelectId =  localStorage.getItem('city_selected_id');
				  
				get_servicios_por_ciudad(CiudadSelectId);
				
				//reestablecerPrecios(); --- aqui no funciona  
	
			  }
				
			});
	
			
		}
		
		
		
		function showModal(){
			console.log('entro en showModal');
			const modal = document.getElementById('modal-ciudades');
			modal.classList.add('show');
		}
	
		
		let animacionActiva = false; // Bandera para controlar la animación	
		
		function get_servicios_por_ciudad($cityId){
		
		// Marca el inicio de la consulta
		const inicio = new Date();
		console.log('Inicio de la consulta - getServicios', inicio.toLocaleString());
		
		// activarAnimacion();	
		
		$.ajax({
			url: ajaxParams.ajaxUrl,  // El URL de WordPress, usualmente 'wp-admin/admin-ajax.php'
			type: 'POST',
			data: {
				action: 'get_servicios_por_ciudad',
				cityId: $cityId
			},
			success: function(response) {
			
				
			let dataServicio = JSON.parse(response);
				
			console.log('respuesta desde get_servicios_por_ciudad en dataServicio', dataServicio);	
	
			// Guardar el array en local storage
			
			localStorage.removeItem('servicios_city');
			localStorage.setItem('servicios_city', JSON.stringify(dataServicio.result));
			console.log('Datos guardados en local storage');			
			
			// desactivarAnimacion();	
				
			const fin = new Date();
			console.log('Fin de la consulta:', fin.toLocaleString());
	
			const duracion = (fin - inicio) / 1000;
			console.log('Duración de la consulta:', duracion.toFixed(2), 'segundos');
			
			// Reestablece Precios JUSTAMENTE AL GINALIZAR EL LLENADO DEL ARRAY servicios_city
			reestablecerPrecios();	
				
			},
			error: function(error) {
				console.log('Dió Error: ');
				console.log('Error: ', error);
			}
		});
				
		
		}
		
		
		var costoServicio = 0;
		
		function encontrarPrecioPorCodigo(codigo) {
			
		  // Obtener el array de servicios desde el localStorage
		  const servicios = JSON.parse(localStorage.getItem('servicios_city'));
	
		  // console.log('Tamaño de array servicios, luego de entrar en encontrarPrecioPorCodigo');
		  // console.log(servicios.length);	
		  
			  if (servicios !== null)
			  {  
					 // Buscar el servicio con el código dado
					 const servicioEncontrado = servicios.find(servicio => servicio.code === codigo);
					
					  // Si se encontró el servicio, retornar el precio, si no, retornar un mensaje o valor por defecto
					
				  
					return servicioEncontrado ? servicioEncontrado.price : 'Servicio Sin Precio En esta Ciudad';	  
	
			  }
				
			  
	
		 }
	
		
		function reestablecerPrecios(){
			
		console.log('entró en reestablecerPrecios');
			
		// Selecciona todos los elementos con la clase "clase-servicio-da-card"
		const elementosServicio = document.querySelectorAll('.clase-servicio-da-card');
	
		// Verifica si se encontraron elementos
		if (elementosServicio.length > 0) {
			// Si hay elementos, recorre cada uno y muestra el valor del atributo
			elementosServicio.forEach(elemento => {
				const codServicioMedico = parseInt(elemento.getAttribute('cod_servicio_medico'));
			
				// Buscar precio en LOCAL STORAGE
				const precioServicio = encontrarPrecioPorCodigo(codServicioMedico);
				//elemento.textContent = 'buscando precio';
				 elemento.textContent = precioServicio;
				
				/*
				if (CityIdSelex == '0002')
				{	
					elemento.style.color = 'red';
				}
				
				if (CityIdSelex == '001')
				{	
					elemento.style.color = 'blue';
				}
				*/
				
				
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
	