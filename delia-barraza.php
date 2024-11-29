<?php
/*
	Plugin Name: Delia Barraza Importer
	Plugin URI: https://google.com 
	Description: Obtener de API REST los Servicios Medicos de Sass
	Version: 1.0
	Author: Miguel Benitez
	Author URI: https://www.migben.com/
	License: GPLv2
*/


define('WPDELIABAR_DIR',plugin_dir_path(__FILE__));
define('WPDELIABAR_URL',plugin_dir_url(__FILE__));

// include WPDELIABAR_DIR . '/inc/functions.php';


function wpgrp_menu(){
    add_menu_page( 
        __( 'Delia Import Servicios', '' ),
        'Delia Import Servicios',
        'manage_options',
        'wpgrp_menu',
        'wpgrp_menu_cb',
       'dashicons-nametag',
        6
    ); 
}
add_action( 'admin_menu', 'wpgrp_menu' );


function wpgrp_menu_cb(){
	include WPDELIABAR_DIR."/templates/remote_products.php";
}


/****************************************************************/


function get_all_products_tijuana(){

	$result = [];
	$data = [];
	$index = 0;
	$contar = 0;
	
		// ------------ Consulta TOKEN ------------------------------------// 
	
	$usuario = "DELIABARRAZA";
	$password = "RGVsaWFiYXJyYXphMTIzIQ==";
	$url_token = "https://deliabarraza.sass.com.mx/ws0";
	
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url_token); 
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_USERPWD, "$usuario:$password");
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);	
	
	$token_1 = curl_exec($ch); 
	$token_1 = json_decode($token_1); 
	
	curl_close($ch);
	
	
	// ------------ Consulta SERVICIOS ------------------------------------//
	


	$usuario = "Interfacepacs";
	$password = "Abc123456789$";
	$token_servicio = $token_1->respuesta;

	$url_servicio = "https://deliabarraza.sass.com.mx/ws1/?token=" . $token_servicio;

	$data_param = json_encode(['request' => 'WCE', 'client' => 'deliabarraza', 'company' => '0002' ]);

	$ch = curl_init();

	curl_setopt($ch, CURLOPT_URL, $url_servicio);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_USERPWD, "$usuario:$password");
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data_param);

	$servicios = curl_exec($ch);

	if (curl_errno($ch)) {
	  echo 'Error: ' . curl_error($ch);
	} else {
	  
		  
	// Decodificar el JSON en un array asociativo de PHP
	$datos = json_decode($servicios, true);

	$estudios = $datos['data']['studies'];

		foreach ($estudios as $estudio) {

		// Obtener la fecha y hora actual en un formato legible
		$fecha_hora = date('Y-m-d H:i:s');

			
			if($contar == 7 ){
				break;
			}
			

	// *********************** CONDICIONAL PRECIOS MAYORES A CERO	
		
			if( $estudio['price'] > '0.00' ){

			$result[$index]['code'] = $estudio['code'];
			$result[$index]['studie'] = $estudio['studie'];
			$result[$index]['price'] = $estudio['price'];
			$result[$index]['indications'] = $estudio['indications'][0]['indication'];

			$index++;
			$contar++;
			}

		}

		$data['result'] = $result;

		// Función de comparación para ordenar por 'studie'
		/*
		function compararEstudios($a, $b) {
		return strcmp($a['studie'], $b['studie']);
		}
		*/
		
		// ------ * FUNCION PARA ORDENAR POR CODIGO DE SERVICIO DE FORMA ASCENDENTE
		
		function compararEstudios($a, $b) {
		// Convertir los códigos a enteros para una comparación numérica
		$codigoA = intval($a['code']);
		$codigoB = intval($b['code']);

		// Comparar los códigos numéricos
		if ($codigoA === $codigoB) {
			return 0; // Si son iguales, no importa el orden
		} else {
			return ($codigoA < $codigoB) ? -1 : 1; // Orden ascendente
		}
		}
		
		

		// Ordenar el arreglo 'result' usando la función de comparación
		usort($data['result'], 'compararEstudios');
		$data_api = json_encode($data);
		echo $data_api;
		
		die();

	}

	curl_close($ch);
}

add_action('wp_ajax_get_all_products_tijuana', 'get_all_products_tijuana');  // Para usuarios logueados
add_action('wp_ajax_nopriv_get_all_products_tijuana', 'get_all_products_tijuana');  // Para usuarios no logueados


function enqueue_ajax_script() {
    // Obtener el directorio del plugin
    $plugin_url = plugin_dir_url(__FILE__);

    // Registrar el script
    wp_register_script(
        'ajax-products-script',  // Handle
        $plugin_url . 'js/script.js',  // Ubicación del archivo
        ['jquery'],  // Dependencias
        '1.0',  // Versión
        true  // Cargar en el footer
    );

    // Localizar el script para enviar el URL de AJAX
    wp_localize_script(
        'ajax-products-script',
        'ajaxParams',  // Objeto JS accesible desde el script
        [
            'ajaxUrl' => admin_url('admin-ajax.php'),  // URL de admin-ajax.php
        ]
    );

    // Encolar el script
    wp_enqueue_script('ajax-products-script');
}

add_action('wp_enqueue_scripts', 'enqueue_ajax_script');




// ---------------------- * FUNCION PARA AGREGAR/ACTUALIZAR LOS ESTUDIOS POR CODIGO DE SERVICIO DE FORMA ASCENDENTE  ---------------------- * 
// 


function get_all_products(){

	$result = [];
	$data = [];
	$index = 0;
	$contar = 0;
	$updates = 0;
	
	$usuario = "DELIABARRAZA";
	$password = "RGVsaWFiYXJyYXphMTIzIQ==";
	$url_token = "https://deliabarraza.sass.com.mx/ws0";
	
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url_token); 
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_USERPWD, "$usuario:$password");
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);	
	
	$token_1 = curl_exec($ch); 
	$token_1 = json_decode($token_1); 
	
	curl_close($ch);
	
	
	$usuario = "Interfacepacs";
	$password = "Abc123456789$";
	$token_servicio = $token_1->respuesta;

	$url_servicio = "https://deliabarraza.sass.com.mx/ws1/?token=" . $token_servicio;

	$data_param = json_encode(['request' => 'WCE', 'client' => 'deliabarraza', 'company' => '9999' ]);

	$ch = curl_init();

	curl_setopt($ch, CURLOPT_URL, $url_servicio);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_USERPWD, "$usuario:$password");
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data_param);

	$servicios = curl_exec($ch);

	if (curl_errno($ch)) {
	  echo 'Error: ' . curl_error($ch);
	} else {
	  
		  
	// Decodificar el JSON en un array asociativo de PHP

	$datos = json_decode($servicios, true);
	$estudios = $datos['data']['studies'];
		
		// CICLO FOR MATRIZ - Condicionales En Precio NO IGUAL A 0.00

		foreach ($estudios as $estudio) {


		if($contar == 7 ){
			break;
		}
		
			// *********************** CONDICIONAL PRECIOS MAYORES A CERO	
		
			if( $estudio['price'] > '0.00' ){

				$result[$index]['code'] = $estudio['code'];
				$result[$index]['studie'] = $estudio['studie'];
				$result[$index]['price'] = $estudio['price'];
				$result[$index]['indications'] = $estudio['indications'][0]['indication'];

				$updates++;
				$index++;
				$contar++;
			}
		
			

		}
		
		$data['result'] = $result;

		// Función de comparación para ordenar por 'studie'
		/*
		function compararEstudios($a, $b) {
		return strcmp($a['studie'], $b['studie']);
		}
		*/
		
		// ------ * FUNCION PARA ORDENAR POR CODIGO DE SERVICIO DE FORMA ASCENDENTE
		
		function compararEstudios($a, $b) {
		// Convertir los códigos a enteros para una comparación numérica
		$codigoA = intval($a['code']);
		$codigoB = intval($b['code']);

		// Comparar los códigos numéricos
		if ($codigoA === $codigoB) {
			return 0; // Si son iguales, no importa el orden
		} else {
			return ($codigoA < $codigoB) ? -1 : 1; // Orden ascendente
		}
		}

		// Ordenar el arreglo 'result' usando la función de comparación
		usort($data['result'], 'compararEstudios');
		$data_api = json_encode($data);
		
		
		//-- RECORRER ARRAY ORDENADO Y PROCEDER A CREAR O ACTUALIZAR cada post de servicio
		//
		//
		
		// print_r($data);

		foreach ($data['result'] as $estudio) {
			
			// Obtener la fecha y hora actual en un formato legible
			$fecha_hora = date('Y-m-d H:i:s');
			
			// ---------------------------- Crear o actualizar el post ----------------------------
			// 
			
			$args = array(
				'meta_query' => array(
					array(
						'key'     => 'cod_servicio_deliabarraza',
						'value'   => $estudio['code'],
						'compare' => '='
					)
				),
				'post_type' => 'servicios',
				'posts_per_page' => 1
			);

			$posts = get_posts($args);

			if ($posts) {
				
				// Si se encontró el post, actualizarlo
				$post_id = $posts[0]->ID;
				$post_args = array(
					'ID'           => $post_id,
					// Aquí agregarías los campos a actualizar, por ejemplo:
					'post_title'   => $estudio['studie'],
					'post_content' => $estudio['indications'],
				);
				
				wp_update_post($post_args);
        		update_post_meta($post_id, 'precio_oferta', $estudio['price']);

			
			} else {
				
				// Si no se encontró, crear un nuevo post
				// Crear SERVICIOS (Post) ----------------------------------------------------
	
				// Obtener la fecha y hora actual en un formato legible
				$fecha_hora = date('Y-m-d H:i:s');
	
				$nueva_publicacion = array(
					
					'post_title'   => $estudio['studie'],
					'post_content' => $estudio['indications'],
					'post_status'   => 'publish',
					'post_type'     => 'servicios',
				);
	
				$post_id = wp_insert_post($nueva_publicacion);
			   
				update_post_meta($post_id, 'cod_servicio_deliabarraza', $estudio['code']);
        		update_post_meta($post_id, 'precio_oferta', $estudio['price']);
					
				// -------------------------------------------------------------------------------
			}
			
		}
		
		
		//--------------------------------------------------------------------------
		
		
		
		//-- Enviar a AJAX
		echo $data_api;
		die();
		

	}

	curl_close($ch);
}

add_action('admin_post_get_all_products','get_all_products');
add_action('admin_post_nopriv_get_all_products','get_all_products');


function mostrar_cod_servicio() {
	$cod_servicio = get_post_meta( get_the_ID(), 'cod_servicio_deliabarraza', true );
	return "<p class='clase-servicio-da-card' post_id_servicio_medico=". get_the_ID() ." cod_servicio_medico=". $cod_servicio ." style='font-size: 25px; font-weight: 700;'>0.00</p>";
}
add_shortcode( 'cod_servicio_medico_deliabarraza', 'mostrar_cod_servicio' );









/*
function get_all_products(){

	$result = [];
	$data = [];
	$index = 0;
	$contar = 0;
	$updates = 0;
	
	$usuario = "DELIABARRAZA";
	$password = "RGVsaWFiYXJyYXphMTIzIQ==";
	$url_token = "https://deliabarraza.sass.com.mx/ws0";
	
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url_token); 
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_USERPWD, "$usuario:$password");
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);	
	
	$token_1 = curl_exec($ch); 
	$token_1 = json_decode($token_1); 
	
	curl_close($ch);
	
	
	$usuario = "Interfacepacs";
	$password = "Abc123456789$";
	$token_servicio = $token_1->respuesta;

	$url_servicio = "https://deliabarraza.sass.com.mx/ws1/?token=" . $token_servicio;

	$data_param = json_encode(['request' => 'WCE', 'client' => 'deliabarraza', 'company' => '9999' ]);

	$ch = curl_init();

	curl_setopt($ch, CURLOPT_URL, $url_servicio);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_USERPWD, "$usuario:$password");
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data_param);

	$servicios = curl_exec($ch);

	if (curl_errno($ch)) {
	  echo 'Error: ' . curl_error($ch);
	} else {
	  
		  
	// Decodificar el JSON en un array asociativo de PHP
	$datos = json_decode($servicios, true);

	$estudios = $datos['data']['studies'];

	foreach ($estudios as $estudio) {

		// Obtener la fecha y hora actual en un formato legible
		$fecha_hora = date('Y-m-d H:i:s');

		
			if($contar == 7 ){
				break;
			}
			
			$result[$index]['code'] = $estudio['code'];
			$result[$index]['studie'] = $estudio['studie'];
			$result[$index]['price'] = $estudio['price'];
			$result[$index]['indications'] = $estudio['indications'][0]['indication'];
					

			$updates++;
			$index++;
			



			// Crear o actualizar el post
			$args = array(
				'meta_query' => array(
					array(
						'key'     => 'cod_servicio_deliabarraza',
						'value'   => $estudio['code'],
						'compare' => '='
					)
				),
				'post_type' => 'servicios',
				'posts_per_page' => 1
			);

			$posts = get_posts($args);

			if ($posts) {
				
				// Si se encontró el post, actualizarlo
				$post_id = $posts[0]->ID;
				$post_args = array(
					'ID'           => $post_id,
					// Aquí agregarías los campos a actualizar, por ejemplo:
					'post_title'   => 'Update título -' . $estudio['studie']. ' - ' . $fecha_hora ,
					'post_content' => 'Update contenido ' . $estudio['indications'][0]['indication'] . ' - ' . $fecha_hora,
				);
				
				wp_update_post($post_args);
				
        		update_post_meta($post_id, 'precio_oferta', 666);

			
			} else {
				// Si no se encontró, crear un nuevo post
				// Crear SERVICIOS (Post) ----------------------------------------------------
	
				// Obtener la fecha y hora actual en un formato legible
				$fecha_hora = date('Y-m-d H:i:s');
	
				$nueva_publicacion = array(
					
					'post_title'   => 'Insert Migben SERVICIO DELIA BARRAZA - ' . $estudio['studie'] . '- FECHA - '. $fecha_hora,
					'post_content' => 'Insert Contenido Indicaciones - ' . $estudio['indications'][0]['indication'],
					'post_status'   => 'publish',
					'post_type'     => 'servicios',
				);
	
				$post_id = wp_insert_post($nueva_publicacion);
			   
				update_post_meta($post_id, 'cod_servicio_deliabarraza', $estudio['code']);
        		update_post_meta($post_id, 'precio_oferta', 332);
					
				// -------------------------------------------------------------------------------
			}

			$contar++;

		}

		
		$data['result'] = $result;
		
		

		// Función de comparación para ordenar por 'studie'
		
		// function compararEstudios($a, $b) {
		// return strcmp($a['studie'], $b['studie']);
		// }
		
		
		
		function compararEstudios($a, $b) {
		$codigoA = intval($a['code']);
		$codigoB = intval($b['code']);

		// Comparar los códigos numéricos
		if ($codigoA === $codigoB) {
			return 0; // Si son iguales, no importa el orden
		} else {
			return ($codigoA < $codigoB) ? -1 : 1; // Orden ascendente
		}
		}

		// Ordenar el arreglo 'result' usando la función de comparación
		usort($data['result'], 'compararEstudios');
		
		$data_api = json_encode($data);
		
	
		// print $data_api;
		echo $data_api;
		
		// return $data_api;
		

	}

	curl_close($ch);
}

add_action('admin_post_get_all_products','get_all_products');
add_action('admin_post_nopriv_get_all_products','get_all_products');

*/
