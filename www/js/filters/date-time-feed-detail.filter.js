(function()	{
	'use strict';

	/**
	* dateTimeFeedDetailFilter filter function
	*/
	var dateTimeFeedDetailFilter = function($filter) {

		/**
		* converting the date/time formate in HH:mm | yyyy-MM-dd
		*/

		return function(input)
 		{
  			if(input == null){ return ""; } 
  			var _date = $filter('date')(new Date(input),'HH:mm | yyyy-MM-dd'); 
  			return _date;
  		};
	};

	/**
	* @dependencies injector
	*/
	dateTimeFeedDetailFilter.$inject=['$filter'];

	angular
		.module('tatafo')
		.filter('dateTimeFeedDetailFilter',dateTimeFeedDetailFilter);

})();