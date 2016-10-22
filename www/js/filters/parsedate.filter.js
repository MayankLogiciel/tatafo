(function()	{
	'use strict';

	/**
	* filter function
	*/
	var parseDate = function() {

		return function(value) {
      		return Date.parse(value);
  		};
	};

	/**
	* @dependencies injector
	*/
	parseDate.$inject=[];

	angular
		.module('tatafo')
		.filter('parseDate',parseDate);

})();