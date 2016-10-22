(function(){

	'use strict';

	/**
	* validPin Directive function
	*/
	var validPin=function($http){
		
		return {
			require: 'ngModel',
			link: function(scope, ele, attrs, c) {
				scope.$watch(attrs.ngModel, function(pinValue) {
					// $http({
					// 	method: 'POST',
					// 	url: '/api/check/' + attrs.validPin,
					// 	data: {'pin': attrs.validPin}
					// }).success(function(data, status, headers, cfg) {
					// 	c.$setValidity('valid-pin', data.isValid);
					// }).error(function(data, status, headers, cfg) {
					// 	c.$setValidity('valid-pin', false);
					// });
					if(pinValue=="12345")
					{
						c.$setValidity('valid-pin', true);
					}
					else
					{
						c.$setValidity('valid-pin', false);
					}
				});
			}
		};
	}

	/**
	* @dependencies injector $http
	*/

	validPin.$inject=['$http'];

	angular
		.module('tatafo')
		.directive('validPin',validPin)

})();

