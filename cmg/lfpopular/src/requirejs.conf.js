require.config({
  baseUrl: '/',
  paths: {
    jquery: 'lib/jquery/jquery',
    text: 'lib/requirejs-text/text',
    base64: 'lib/base64/base64.min',
    hogan: 'lib/hogan/web/builds/2.0.0/hogan-2.0.0.amd',
    hgn: 'lib/requirejs-hogan-plugin/hgn',
    json: 'lib/requirejs-plugins/src/json',
    jasmine: 'lib/jasmine/lib/jasmine-core/jasmine',
    'jasmine-html': 'lib/jasmine/lib/jasmine-core/jasmine-html',
    'jasmine-jquery': 'lib/jasmine-jquery/lib/jasmine-jquery',
    'event-emitter': 'lib/event-emitter/src/event-emitter',
    inherits: 'lib/inherits/inherits'
  },
  packages: [{
	name: "streamhub-popular",
	location: "streamhub-popular"
  },{
	name: "streamhub-metrics",
	location: "streamhub-metrics/src"
  },{
	name: "streamhub-hot-collections",
	location: "streamhub-hot-collections/src"
  },{
    name: "streamhub-sdk",
    location: "streamhub-sdk/src"
  },{
    name: "streamhub-sdk/auth",
    location: "streamhub-sdk/src/auth"
  },{
    name: "streamhub-sdk/collection",
    location: "streamhub-sdk/src/collection"
  },{
    name: "streamhub-sdk/content",
    location: "streamhub-sdk/src/content"
  },{
    name: "streamhub-sdk/modal",
    location: "streamhub-sdk/src/modal"
  },{
    name: "streamhub-sdk-tests",
    location: "tests/"
  },{
    name: "stream",
    location: "stream/src"
  }],
  shim: {
    jquery: {
        exports: '$'
    },
    jasmine: {
        exports: 'jasmine'
    },
    'jasmine-html': {
        deps: ['jasmine'],
        exports: 'jasmine'
    },
    'jasmine-jquery': {
        deps: ['jquery', 'jasmine']
    }
  }
});
