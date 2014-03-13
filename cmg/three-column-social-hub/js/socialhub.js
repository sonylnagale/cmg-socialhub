<?php
    header("Content-type: text/javascript");
	
	$version = '1.3.0';
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
	
	v1.3.0: JANUS-2209 checking the sharing text
	v1.2.12: Sync
	v1.2.11: Darned console.logs
	v1.2.10: Changes for logo triggering share
	v1.2.9: Bump
	v1.2.8: Cleanup bump
	v1.2.7: Moving custom share button for proper event propagation and using an internal method for share
	v1.2.6: Preventing propagation when source icon is clicked.
	v1.2.5: Sponsored variable passes through to wall view
	v1.2.4: Resetting sponsored variable on content as well
	v1.2.3: Sync
	v1.2.2: Making sure sponsored variable is reset
	v1.2.1: Only hashtag with # will be used
	v1.2.0.build2: Resolve mobile problem (must pass opts to all)
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