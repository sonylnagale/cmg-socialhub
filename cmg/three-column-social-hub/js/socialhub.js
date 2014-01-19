<?php
    header("Content-type: text/javascript");
	
	$version = '1.1.3.2';
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
	
	$releasenotes = <<<EOF
/**	
	RELEASE NOTES
	v1.1.3.2: Hotfix for Instagram avatars onerror
	v1.1.3: Sync
	v1.1.2: Sync
	v1.1.1: Allow Facebook replies
*/	
	
EOF;
	echo $versioninfo . $releasenotes . $return;