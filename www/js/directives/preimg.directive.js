(function(){

	'use strict';

	/**
	* preImg Directive function
	*/
	var preImg=function(){
		
		return {
			restrict: 'E',
			transclude: true,
			scope: {
				ratio:'@',
				helperClass: '@'
			},
			controller: function($scope) {
				$scope.loaded = false;

				this.hideSpinner = function(){
					// Think i have to use apply because this function is not called from this controller ($scope)
					$scope.$apply(function () {
						$scope.loaded = true;
					});
				};
			},
			templateUrl: 'views/common/pre-img.html'
		};
	}

	/**
	* @dependencies injector 
	*/

	preImg.$inject=[];

	angular
		.module('tatafo')
		.directive('preImg',preImg)

})();

