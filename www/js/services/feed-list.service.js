(function()	{
	'use strict';

	/**
	* feedListService service function
	*/
	var feedListService = function($rootScope , FeedLoader , $q) {

		this.get = function(feedSourceUrl) {
			var response = $q.defer();
			//num is the number of results to pull form the source
			FeedLoader.fetch({q: feedSourceUrl, num: 20}, {}, function (data) {
				response.resolve(data.responseData);
			});
			return response.promise;
		};

	};

	/**
	* @dependencies injector $rootScope, FeedLoader, $q
	*/
	feedListService.$inject=['$rootScope', 'FeedLoader', '$q'];

	angular
		.module('tatafo')
		.service('feedListService',feedListService);

})();