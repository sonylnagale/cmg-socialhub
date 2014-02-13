<?php
    header("Content-type: text/javascript");
	
	$version = '1.2.0';
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
	v1.2.0.build1: Sponsored content preview
	v1.1.6: Sync
	v1.1.5: Merge hotfix1 (instagram onerror for avatar), remove RSS images until QA ready
	v1.1.4: Empty out Janrain share info since reset() doesn't appear to work
	v1.1.3: Sync
	v1.1.2: Sync
	v1.1.1: Allow Facebook replies
*/	
	
EOF;
	echo $versioninfo . $releasenotes . $return;