(function($){
	
	$(document).ready(function(){
		
		carpetaServicio = false;
		PredeterminadoApi = false;
		
		var spanCiudad = document.getElementById("ciudad-seleccionada-spam");
		// Deshabilitar el elemento para que no se pueda hacer clic
  		spanCiudad.style.pointerEvents = "none";

		const ciudadPredeterminada = localStorage.getItem('city_selected_id');
		
		if (ciudadPredeterminada === null || ciudadPredeterminada === '') {
			console.log('No existe ciudad predeterminada en el localStorage.');
			predeterminarPrecios();
			//return false;
		  }
		  else
		{
		 	
			const ciudadSpan1 = document.getElementById('ciudad-seleccionada-spam');
			const ciudadSeleccionadaTexto = localStorage.getItem('city_selected_name');
			ciudadSpan1.textContent = ciudadSeleccionadaTexto;  

		}			  

		 var CityIdSelex = 0;
		
		// Funcion Para llamar al modal (se debe CONDICIONAR)
		
		const ciudadSeleccionada = document.getElementById('ciudad-seleccionada-spam');
		ciudadSeleccionada.addEventListener('click', () => {
			
			MostrarModal();
	
		});
		
		
		
		// ----------------------------------------------------------------------------//

		
		comprobarCarpeta();
		
		
		function predeterminarPrecios(){
			
			console.log('Entró en función predeterminarPrecios');
			localStorage.setItem('city_selected_id','001');
			localStorage.setItem('city_selected_name', 'Sinaloa');
		  	const ciudadSpan1 = document.getElementById('ciudad-seleccionada-spam');
			ciudadSpan1.textContent = 'Sinaloa';
			PredeterminadoApi = true;
			get_servicios_por_ciudad('001');
		
		}
		
		/*
		function existeCiudadSeleccionada() {
		  // Obtenemos el valor del localStorage con la clave "city_selected_id"
		  const ciudadSeleccionada = localStorage.getItem('city_selected_id');
			
		  // Obtenemos el valor del localStorage con la clave "city_selected_name"
		  const ciudadSeleccionadaTexto = localStorage.getItem('city_selected_name');
			
		  // Verificamos si el valor obtenido es null (no existe) o una cadena vacía
		  if (ciudadSeleccionada === null || ciudadSeleccionada === '') {
			console.log('No existe una ciudad seleccionada en el localStorage.');
			
			 // Mostramos el MODAL - POP UP  
			 // MostrarModal();
			 
			
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
		*/
		
		function comprobarCarpeta(){

			console.log("Entró en... comprobarCarpeta");

			const urlActual = window.location.href;
			const contieneServicio = urlActual.includes('servicio');
	
			if (contieneServicio) {
				console.log("El dominio contiene la carpeta 'servicio'");
				reestablecerPrecios();
				 spanCiudad.style.pointerEvents = "auto";
			} else {
				console.log("El dominio NO contiene la carpeta 'servicio'");
				 spanCiudad.style.pointerEvents = "none";

			}		
		}
		
		
		
	
		// ------------------------------------------------------------------------------------------------------------------//
		
		
		function MostrarModal(){
			
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
	        
			
			const modalCiudades = document.getElementById('modal-ciudades');

			modalCiudades.addEventListener('click', (event) => {
			
			if (event.target.hasAttribute('modal-ciudad-close-boton')) {

					console.log('click en X de cerrar MODAL');


				// const modal = document.getElementById("modal-ciudades");
				
				modalCiudades.classList.remove('show'); // Ocultar el modal
				modalCiudades.style.display = 'none';
				modalCiudades.remove();
				console.log("Elemento 'modal-ciudades' eliminado correctamente.");  				
				

			}	
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
				modal.style.transition = 'transform 0.1s ease-in-out';
				modal.style.transform = 'translateY(-100%)';
				
				
				setTimeout(() => {
					  modal.style.display = 'none';
				  }, 200); // 5000 milisegundos = 5 segundos
				
				modal.remove();
				 console.log("Elemento 'modal-ciudades' eliminado correctamente.");  
				  
				  
				var CiudadSelectId =  localStorage.getItem('city_selected_id');
				  
				get_servicios_por_ciudad(CiudadSelectId);
				
	
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

		if ( PredeterminadoApi === true)
		{
		   activarAnimacionPrecios(false);
		}
		else	
		{
		   activarAnimacionPrecios(true);
		}
			
			
		
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
			
			
			const fin = new Date();
			console.log('Fin de la consulta:', fin.toLocaleString());
	
			const duracion = (fin - inicio) / 1000;
			console.log('Duración de la consulta:', duracion.toFixed(2), 'segundos');
			
			// Reestablece Precios JUSTAMENTE AL GINALIZAR EL LLENADO DEL ARRAY servicios_city
			reestablecerPrecios();	
			
			// desactivarAnimacion;	 --- OJO AQUI -------------- SE DEBE DESCOMENTAR SIEMPRE
			activarAnimacionPrecios(false);
		
				
			},
			error: function(error) {
				console.log('Dió Error: ');
				console.log('Error: ', error);
			}
		});
				
		
		}
		
				
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
					
				  
					return servicioEncontrado ? servicioEncontrado.price : 0;	  
	
			  }
				
			  
	
		 }
	
		
		function reestablecerPrecios(){
			
		console.log('entró en reestablecerPrecios');
			
		// Selecciona todos los elementos con la clase "clase-servicio-da-card"
		const elementosServicio = document.querySelectorAll('.clase-servicio-da-card');
		console.log('cnatidad de DIVS en reestablecerPrecios');
		console.log(elementosServicio.length);
	
			
			
		// Verifica si se encontraron elementos
		if (elementosServicio.length > 0) {
			// Si hay elementos, recorre cada uno y muestra el valor del atributo
			elementosServicio.forEach(elemento => {
				const codServicioMedico = parseInt(elemento.getAttribute('cod_servicio_medico'));
			
				// Buscar precio en LOCAL STORAGE
				const precioServicio = encontrarPrecioPorCodigo(codServicioMedico);

				// console.log('codServicioMedico', codServicioMedico);
				// console.log('precioServicio', precioServicio);

				
				if (precioServicio != 0)
				{	
					elemento.textContent = precioServicio;
				}	
				else
				{	
					
					elemento.textContent = "sinprec";
				}
				

				
				
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
		
		
		
		// ----- ANIMACION DIV TITILANDO
		// 
		
	
		function activarAnimacionPrecios(activador) {
			
			console.log('entró en ANIMACION');
	   	 	
		
	  const existingDiv = document.querySelector('.blinking');
	  const existingOverlay = document.querySelector('.overlay');
	  const existingStyle = document.querySelector('#blinking-style');

		// Ruta relativa de la imagen
		const rutaRelativa = "/wp-content/plugins/delia-barraza/imagenes/logo_delia_modal.png";

		// Obtener la URL base del sitio
		const baseUrl = new URL(window.location.href);
		console.log('baseUrl host'); 
		console.log(baseUrl); 

		// Concatenar la URL base con la ruta relativa
		const urlCompleta = new URL(rutaRelativa, baseUrl).href;
			
		const urlLogoDelia = baseUrl.origin + rutaRelativa;
			
		// console.log(urlCompleta); // Output: https://tudominio.com/wp-content/plugins/delia-barraza//imagenes/logo_delia_modal.png			
		console.log(urlLogoDelia); // Output: https://tudominio.com/wp-content/plugins/delia-barraza//imagenes/logo_delia_modal.png			
	
	  if (activador) {
		if (!existingOverlay) {
		  // Crear un overlay para bloquear la pantalla
		  const overlay = document.createElement('div');
		  overlay.classList.add('overlay');
		  document.body.appendChild(overlay);
		}
	
		if (!existingDiv) {
		  // Crear un nuevo elemento div
		  const div = document.createElement('div');
	
		  // Agregar una clase para estilos (opcional, pero recomendado)
		  div.classList.add('blinking');
			
		// Crear un elemento img para el GIF loader
			const loadergifprecios = document.createElement('img');
			loadergifprecios.src = 'https://i.gifer.com/ZKZg.gif'; // Reemplazar con la ruta del GIF
			loadergifprecios.alt = 'Cargando...';
			loadergifprecios.classList.add('loadergifprecios');			

			// Crear un elemento img para el LOGO DEL loader
			const logoloader = document.createElement('img');
			logoloader.src = urlLogoDelia; // Reemplazar con la ruta del GIF
			logoloader.classList.add('logoloader');			
		

			// Crear un elemento span para el texto
    		const text = document.createElement('p');
    		text.textContent = 'Localizando Precios De Su Región';

    // Agregar el GIF y el texto al div
    div.appendChild(loadergifprecios);
    div.appendChild(logoloader);			
    div.appendChild(text);			
	
			
			
		  // Agregar el div al cuerpo del documento
		  document.body.appendChild(div);
		}
	
		if (!existingStyle) {
		  // Estilos CSS para la animación y el overlay
		  const style = document.createElement('style');
		  style.id = 'blinking-style'; // Agregar un id para identificar el estilo
		  style.textContent = `
			.overlay {
			  position: fixed;
			  top: 0;
			  left: 0;
			  width: 100%;
			  height: 100%;
			  background-color: rgba(0, 0, 0, 0.5);
			  z-index: 9999;
			}
	

			.blinking {
				position: fixed;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				background-color: #fff;
				padding: 20px;
				z-index: 9999;
				text-align: center;
				border-radius: 22px;
			}


			.blinking img {
			}

			.blinking p {
				margin-top: 4%;
				font-size: 22px;
				font-weight: 600;
			}



			img.loadergifprecios {
			width: 10%;

			}

			img.logoloader {
			width: 25%;

			}

	
			@keyframes blink {
			  0% {
				opacity: 1;
			  }
			  50% {
				opacity: 0;
			  }
			  100% {
				opacity: 1;
			  }
			}
		  `;
		  
		  document.head.appendChild(style);
			
			
			
			
		}
	  } else {
		// Eliminar el div y el overlay si existen
		if (existingDiv) {
		  existingDiv.remove();
		}
	
		if (existingOverlay) {
		  existingOverlay.remove();
		}
	
		// Eliminar los estilos si existen
		if (existingStyle) {
		  existingStyle.remove();
		}
	  }
	}
	
		
		
// Detecta cuando inicia el evento
    $(document).on('ajaxSend', function(event, jqXHR, ajaxOptions) {
        if (ajaxOptions.data && ajaxOptions.data.includes('action=jet_engine_ajax')) {
            let params = new URLSearchParams(ajaxOptions.data);
            let handler = params.get('handler');

            if (handler === 'listing_load_more') {
                // console.log('Inicio del handler: listing_load_more en jet_engine_ajax');
            }
        }
    });

    // Detecta cuando el evento ha finalizado
    $(document).on('ajaxComplete', function(event, jqXHR, ajaxOptions) {
        if (ajaxOptions.data && ajaxOptions.data.includes('action=jet_engine_ajax')) {
            let params = new URLSearchParams(ajaxOptions.data);
            let handler = params.get('handler');

            if (handler === 'listing_load_more') {
                //console.log('Finalizó el handler: listing_load_more en jet_engine_ajax');
				reestablecerPrecios();
            }
        }
    });
			
		
			
	});
	})(jQuery);
	