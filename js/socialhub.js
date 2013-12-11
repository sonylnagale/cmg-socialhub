<?php
    header("Content-type: text/javascript");
	
	$files = array(
		'lfcustomcontent.js',
		'lfsocialhub.js',
		'lfpopular.js',
	);
	
	$return = '';
	
	foreach ($files as $file) {
		$return .= file_get_contents($file);
	}
	
	echo $return;