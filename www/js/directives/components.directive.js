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
		})

		.directive('compile', ['$compile', function ($compile) {
		     return function(scope, element, attrs) {
		        var ensureCompileRunsOnce = scope.$watch(
		            function(scope) {
		            	// watch the 'compile' expression for changes
		              	return scope.$eval(attrs.compile);
		            },
		            function(value) {
		              	// when the 'compile' expression changes
		              	// assign it into the current DOM
		              element.html(value);

		              	// compile the new DOM and link it to the current
		              	// scope.
		              	// NOTE: we only compile .childNodes so that
		              	// we don't get into infinite loop compiling ourselves
		              	$compile(element.contents())(scope);
		                
		              	// Use Angular's un-watch feature to ensure compilation only happens once.
		              	ensureCompileRunsOnce();
		            }
		        );
		    };
    	}]);
})();



