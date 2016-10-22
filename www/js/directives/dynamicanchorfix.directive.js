(function(){

	'use strict';

	/**
	* dynamicAnchorFix Directive function
	*/
	var dynamicAnchorFix=function($ionicGesture, $timeout, $cordovaInAppBrowser){
		
		return {
			scope: {},
			link: function(scope, element, attrs) {
				$timeout(function(){
					var anchors = element.find('a');
					if(anchors.length > 0)
					{
						angular.forEach(anchors, function(a) {

							var anchor = angular.element(a);

							anchor.bind('click', function (event) {
								event.preventDefault();
								event.stopPropagation();

								var href = event.currentTarget.href;
								var	options = {};

								//inAppBrowser see documentation here: http://ngcordova.com/docs/plugins/inAppBrowser/

								$cordovaInAppBrowser.open(href, '_blank', options)
									.then(function(e) {
										// success
									})
									.catch(function(e) {
										// error
									});
							});

						});
					}
				}, 10);
			},
			restrict: 'A',
			replace: false,
			transclude: false
		};
	}

	/**
	* @dependencies injector $ionicGesture, $timeout, $cordovaInAppBrowser
	*/

	dynamicAnchorFix.$inject=['$ionicGesture', '$timeout', '$cordovaInAppBrowser'];

	angular
		.module('tatafo')
		.directive('dynamicAnchorFix',dynamicAnchorFix)

})();

