<?php

function executeService(){



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

	$data = json_encode(['request' => 'WCE', 'client' => 'deliabarraza', 'company' => '9999' ]);

	$ch = curl_init();

	curl_setopt($ch, CURLOPT_URL, $url_servicio);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_USERPWD, "$usuario:$password");
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

	$servicios = curl_exec($ch);

	$contar = 0;

	if (curl_errno($ch)) {
	  echo 'Error: ' . curl_error($ch);
	} else {
	  
		  
	// Decodificar el JSON en un array asociativo de PHP
	$datos = json_decode($servicios, true);

	// Acceder al array de estudios
	$estudios = $datos['data']['studies'];

	
	foreach ($estudios as $estudio) {

	echo "Código: " . $estudio['code'] . "<br>";
	echo "estudio: " . $estudio['studie'] . "<br>";
	echo "<br>";

	$contar++;
	}

		
	}

	curl_close($ch);


	
	
}

function getProducts(){

	$response = executeService();
	
	/*
	$pget = xml_parser_create();
    xml_parse_into_struct($pget, $response, $valsget, $index);
    xml_parser_free($pget);

    $data = json_decode($valsget[3]['value']);  // Decode the data
	*/
	
	 /*	
	 $TextoFile1 = $variation_id . ' / ' . $sku ."\n";
	 $file = plugin_dir_path( __FILE__ ) . '/productos_delia.txt';
	 $open = fopen( $file, "a" );
	 $write = fputs( $open, $TextoFile1 ); 
	 fclose( $open );
	 */
	
    
}



function updateProduct($sku, $price, $stock, $tipoproducto, $tipoupdate){

  $variation_id = wc_get_product_id_by_sku($sku);

  
// $TextoFile1 = $variation_id . ' / ' . $sku ."\n";
// $file = plugin_dir_path( __FILE__ ) . '/productos_ID.txt';
// $open = fopen( $file, "a" );
// $write = fputs( $open, $TextoFile1 ); 
// fclose( $open );

// FORZAR la gestión del Inventario

update_post_meta($variation_id, "_manage_stock", "yes");
$product = wc_get_product($variation_id );

if ($tipoproducto == "S") {
  
	// Set product stock

	$product->set_manage_stock( true ); // true/false
	$product->set_stock_quantity( $stock );

	
	$product->set_regular_price($price);
  	$product->save(); // Guardar los cambios

}
 
if ($tipoproducto == "V") {

	$regular_price = $price; // Define the regular price
	$sale_price    = ""; // Define the sale price (optional)

	// Set product stock

	$product->set_manage_stock( true ); // true/false
	$product->set_stock_quantity( $stock );

	// Set product sale price (precio rebajado)
	$product->set_sale_price($sale_price);
	
	// Set product regular price
	$product->set_regular_price($regular_price);

	// Sync data, refresh caches and saved data to the database
	$product->save(); 
}

	$meta_value = array(
    'product_id' => sanitize_text_field($variation_id),
    'fecha' => sanitize_text_field(date('l jS \of F Y h:i:s A')),
	'fechacorta' => sanitize_text_field(date("Y-m-d")),	
    'status' => sanitize_text_field('precio-actualizado'),
    '$tipoupdate' => sanitize_text_field($tipoupdate)
);
	
	update_post_meta( $variation_id, '_precio_actualizado_migben', $meta_value );


}