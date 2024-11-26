<?php

ignore_user_abort(true);
if ( !empty($_POST) || defined('DOING_AJAX') || defined('DOING_CRON') )
    die();
    
if ( !defined('ABSPATH') ) {
    /** Set up WordPress environment */
    //require_once( '/wp-load.php');
    if( !(@include $_SERVER['DOCUMENT_ROOT'].'/wp-load.php') )
        if( !(@include $_SERVER['DOCUMENT_ROOT'].'../wp-load.php') )
        if( !(@include 'wp-load.php') )
        if( !(@include '../../../wp-load.php') )
        if( !(@include '../../../../wp-load.php') )
        if( !(@include '../../../../../wp-load.php') )
        if( !(@include _DIR_ .'/../../../../wp-load.php') )
            die('<H1>Can\'t include wp-load. Report to Technical Support form on https://etruel.com/support</H1>');
}

define('DISABLE_WP_CRON',true);

	$products = getProducts();
	$result = [];
	$data = [];
	$index = 0;
	$updates = 0;

	
	foreach($products as $product){


		$productoSKU = eliminarCerosIzquierda($product->ClaveArticulo);
		$variation_id = wc_get_product_id_by_sku($productoSKU);


		
		// --- Aqui comprobamos si existe el SKU en la tienda, diferenciando de 0

		if ($variation_id != 0 || $variation_id != null )  
		{
			$variation_obj = wc_get_product($variation_id);
			
			if ($variation_obj->is_type('variation')) {
				# variable
				$tipoproducto = "V";
			}
			else {
				# simple
				$tipoproducto = "S";
			}
			
			$parent_product_id = $variation_obj->get_parent_id();

			if ($parent_product_id == 0) {
				# code...
				$parent_product_id = $variation_id;
			}
			

			// -------------- Propiedas Variacion
			
			$stock_variation = $variation_obj->get_stock_quantity();
			$precio_variation = $variation_obj->get_price();
			
			if ($stock_variation == null) {
				$stock_variation = 0;
			}

			// -----------------------------------
			
			// --- Si NO IGNORA actaulizacion, procede...
			if(!get_post_meta($parent_product_id,'ignore_update', true)){
				if(floatval($precio_variation) != floatval($product->Precio) || intval($stock_variation) != intval($product->Existencia) ){
					
					$tipoupdate = "cronjob"; 
					updateProduct($productoSKU, $product->Precio, $product->Existencia, $tipoproducto, $tipoupdate);		
					
					$updates++;
					$index++;

				}
			}
		}

		//if($index == 3 ){
		//	break;
		// }

	}

	$data['updates'] = $updates;

	print json_encode($data);
