(function(){

	'use strict';

	/**
	* showHideContainer Directive function
	*/
	var showHideContainer=function(){
		
		return {
			scope: {
			},
			controller: function($scope, $element, $attrs) {
				$scope.show = false;

				$scope.toggleType = function($event){
					$event.stopPropagation();
					$event.preventDefault();

					$scope.show = !$scope.show;

					// Emit event
					$scope.$broadcast("toggle-type", $scope.show);
				};
			},
			templateUrl: 'views/common/show-hide-password.html',
			restrict: 'A',
			replace: false,
			transclude: true
		};
	}

	/**
	* @dependencies injector 
	*/

	showHideContainer.$inject=[];

	angular
		.module('tatafo')
		.directive('showHideContainer',showHideContainer)

})();

