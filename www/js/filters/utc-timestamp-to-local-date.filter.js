(function()	{
	'use strict';

	var utcTimestampToLocalDateFilter = function($filter){
		return function(uTimeStampInSeconds, formatName){
			var format = 'yyyy-MMM-dd | HH:mm a';

			if(angular.isDefined(formatName) && formatName == "timeFirst"){
				format = 'yyyy-MMM-dd | HH:mm a';
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