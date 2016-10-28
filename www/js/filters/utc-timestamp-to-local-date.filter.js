(function()	{
	'use strict';

	var utcTimestampToLocalDateFilter = function($filter){
		return function(uTimeStampInSeconds, formatName){
			var format = 'yyyy-MM-dd | HH:mm';

			if(angular.isDefined(formatName) && formatName == "timeFirst"){
				format = 'HH:mm | yyyy-MM-dd';
			}

			/**
			* unix timestamps are in seconds, so first need them to convert in milliseconds
			*/
			return $filter('date')(uTimeStampInSeconds * 1000, format);
		}
	};

	utcTimestampToLocalDateFilter.$inject=['$filter'];
	angular
		.module('tatafo')
		.filter('utcTimestampToLocalDateFilter', utcTimestampToLocalDateFilter);

})();