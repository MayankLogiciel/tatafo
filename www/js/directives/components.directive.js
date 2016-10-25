(function () {
	'use strict';

	angular
		.module('tatafo')
		.directive('feedListingItem', function() {
		  	return {
		    	templateUrl: 'views/app/feeds/feed-listing-item.html',
		    	replace: true
		  	};
		});
})();



