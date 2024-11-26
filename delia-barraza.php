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


// $TextoFile1 = $variation_id . " si hay" ."\n";
// $file = plugin_dir_path( __FILE__ ) . '/productos_ID.txt';
// $open = fopen( $file, "a" );
// $write = fputs( $open, $TextoFile1 ); 
// fclose( $open );

 

function get_all_products(){

	$result = [];
	$data = [];
	$index = 0;
	$contar = 0;
	$updates = 0;
	
	
	
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


	
		// Iterar sobre cada estudio y mostrar el código
		foreach ($estudios as $estudio) {


			// $result[] = ['code' => $estudio['code']];
			
			$result[$index]['code'] = $estudio['code'];
			$result[$index]['studie'] = $estudio['studie'];
			$result[$index]['price'] = $estudio['price'];
			$result[$index]['indications'] = $estudio['indications'][0]['indication'];
			
					

			$updates++;
			$index++;
			$contar++;
			
			
			if($contar == 20 ){
				break;
			}
			
			


		}
		
		$data['result'] = $result;
		
		

		// Función de comparación para ordenar por 'studie'
		function compararEstudios($a, $b) {
		return strcmp($a['studie'], $b['studie']);
		}

		// Ordenar el arreglo 'result' usando la función de comparación
		usort($data['result'], 'compararEstudios');
		
		print json_encode($data);


		
	}

	curl_close($ch);

}

add_action('admin_post_get_all_products','get_all_products');
add_action('admin_post_nopriv_get_all_products','get_all_products');