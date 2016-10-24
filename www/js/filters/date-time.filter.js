(function()	{
	'use strict';

	/**
	* dateTimeFilter filter function
	*/
	var dateTimeFilter = function($filter) {

		/**
		* converting the date/time formate in yyyy-MM-dd | HH:mm
		*/
		return function(input)
 		{
  			if(input == null){ return ""; } 
  			var _date = $filter('date')(new Date(input),'yyyy-MM-dd | HH:mm'); 
  			return _date;
  		};
	};

	/**
	* @dependencies injector $filter
	*/
	dateTimeFilter.$inject=['$filter'];

	angular
		.module('tatafo')
		.filter('dateTimeFilter',dateTimeFilter);

})();