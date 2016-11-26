(function()	{
	'use strict';

	var utcTimestampToLocalDateFilter = function($filter){
		return function(uTimeStampInSeconds, formatName){
			var dateformat = 'yyyy-MMM-dd';
			var timeFormat = 'HH:mm a';

			// if(angular.isDefined(formatName) && formatName == "timeFirst"){
			// 	format = 'yyyy-MMM-dd | HH:mm a';
			// }

			/**
			* unix timestamps are in seconds, so first need them to convert in milliseconds
			*/
			var convertedDate = $filter('date')(uTimeStampInSeconds * 1000, dateformat);
			var convertedTime = $filter('date')(uTimeStampInSeconds * 1000, timeFormat);

			return convertedDate +"<span>|</span>" + convertedTime;
		}
	};

	utcTimestampToLocalDateFilter.$inject=['$filter'];
	angular
		.module('tatafo')
		.filter('utcTimestampToLocalDateFilter', utcTimestampToLocalDateFilter);

})();