(function() {
	'use strict';

	/**
	* filter function
	*/
	var rawHtml = function($sce) {

		return function(val) {
    		return $sce.trustAsHtml(val);
  		};

	};

	/**
	* @dependencies injector $sce
	*/
	rawHtml.$inject=['$sce'];

	angular
		.module('tatafo')
		.filter('rawHtml',rawHtml);

})();