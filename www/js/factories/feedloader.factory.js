(function(){

	'use strict';

	/**
	* Feed Loader factory function
	*/
	var FeedLoader=function($resource){

		return $resource('https://ajax.googleapis.com/ajax/services/feed/load', {}, {
   			fetch: { method: 'JSONP', params: {v: '1.0', callback: 'JSON_CALLBACK'} }
  		});
	}
	/**
	* @dependencies injector $resource
	*/

	FeedLoader.$inject=['$resource'];

	angular
		.module('tatafo')
		.factory('FeedLoader',FeedLoader)

})();

