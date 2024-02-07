<?php

function add_ajax_url_to_frontend()
{
?>
	<script>
		const ajaxurl = '<?= admin_url('admin-ajax.php'); ?>';
	</script>
<?php
}

add_action('wp_head', 'add_ajax_url_to_frontend');
