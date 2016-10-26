(function () {
	'use strict';

	angular
		.module('tatafo')
		.directive('feedListingItem', function() {
		  	return {
		    	templateUrl: 'views/app/feeds/feed-listing-item.html'
		  	};
		})


		.directive('actionEnter', function () {
		    return function (scope, element, attrs) {
		        element.bind("keydown keypress", function (event) {
		            if (event.which === 13) {
		                scope.$apply(function () {
		                    scope.$eval(attrs.actionEnter, {
		                        'event': event
		                    });
		                });

		                event.preventDefault();
		            }
		        });
		    };
		});
})();



