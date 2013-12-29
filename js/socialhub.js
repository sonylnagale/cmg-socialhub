<?php
    header("Content-type: text/javascript");
	
	$version = '1.1';
	$build_date = date('c');

	$files = array(
		'lfcustomcontent.js',
		'lfsocialhub.js',
		'lfpopular.js',
	);
	
	$return = '';
	
	foreach ($files as $file) {
		$return .= file_get_contents($file);
	}
	
	$versioninfo = "// Version $version \n// Build Date: $build_date \n\n";
	
	echo $versioninfo . $return;