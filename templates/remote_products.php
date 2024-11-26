<style>
	table.data-products {
		width: 300px !important;
		height: auto;
		overflow: hidden;
		margin: 20px 0px;
	}

	table.data-products thead th{
		border: 1px solid #ccc;
		padding: 10px;
	}

	table.data-products tbody tr td{
		border: 1px solid #ccc;
		padding: 10px;
	}

	table.data-products tr td:first-child{
		text-align: right;
		font-weight: bold;
		background: #ccc;
	}

	table.data-products tr td:last-child{
		text-align: center;
	}

	table.list-products{
		margin: 20px 0px;
		width: 99% !important;
		height: auto;
		overflow: hidden;
	}

	table.list-products thead th{
		text-align: center;
		background: #ccc;
		color: black;
		padding: 10px;
		border: 1px solid #ccc;
	}

	table.list-products tbody tr td{
		text-align: center;
		color: black;
		padding: 10px;
		border: 1px solid #ccc;
	}
</style>
<h1>Importar / Actualizar Productos</h1>
<hr />

<table class="data-products">
	<thead>
		<th colspan="2">Resumen</th>
	</thead>
	<tbody>
		<tr>
			<td>Por Actualizar: </td>
			<td id="resument_update">0</td>
		</tr>
	</tbody>
</table>
<h2>Url CronJob</h2>
<hr />
<div class="cron-url">
	<span class="coderr b"><i> php -q <?php echo WPGRP_DIR. "cron.php"; ?></i></span><br />
    <br>
    <?php _e('or URL:', ''); ?> &nbsp;&nbsp;&nbsp;<span class="coderr b"><i><?php echo WPGRP_URL. "cron.php"; ?></i></span>
    <br />
    <br>
</div>
<button type="button" id="iou_button">Actualizar</button>
<table class="list-products">
	<thead>
		<th>COD ESTUDIO</th>
		<th>ESTUDIO</th>		
		<th>INDICACIONES</th>		
		<th>PRECIO</th>		
		<!--

		<th>Precio XML</th>
		<th>Stock XML</th>
		<th>Precio en Tienda</th>
		<th>Stock en Tienda</th>
		<th>ACCION</th>
		-->
		
	</thead>
	<tbody id="load_products_data">
		<tr>
			<td colspan="7">Cargando...</td>
		</tr>
	</tbody>
</table>
<script>
	(function($){
		$(document).ready(function(){

			function LeerApi() {

				$("#load_products_data").empty();

				// Marca el inicio de la consulta
				const inicio = new Date();
				console.log('Inicio de la consulta:', inicio.toLocaleString());


				$.get("<?=admin_url('admin-post.php?action=get_all_products')?>", function(response){


				// Marca el fin de la consulta
				const fin = new Date();
				console.log('Fin de la consulta:', fin.toLocaleString());

				// Calcula la duración en segundos
				const duracion = (fin - inicio) / 1000;
				console.log('Duración de la consulta:', duracion.toFixed(2), 'segundos');

				let data = JSON.parse(response);

				$.each(data.result, function(v,e){
				$("#load_products_data").append("<tr><td>"+e.code+"</td><td>"+e.studie+"</td><td>"+e.indications+"</td><td>"+e.price+"</td></tr>");

				});



				});	

			}

			$("#iou_button").click(function(){

				console.log('click en BOTON');

				$("#iou_button").attr("disabled",true);
				$("#iou_button").text("Leyendo API...");
				LeerApi();
				$("#iou_button").attr("disabled", false);

			});


		});

	})(jQuery);
</script>