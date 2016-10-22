(function(){

	'use strict';

	/**
	* Mytab Directive function
	*/
	var myTabs=function(){
		
		return {
			restrict: 'E',
			transclude: true,
			scope: {},
			controller: function($scope) {
				var tabs = $scope.tabs = [];

				$scope.select = function(tab) {
					angular.forEach(tabs, function(tab) {
						tab.selected = false;
					});
					tab.selected = true;
					$scope.$emit('my-tabs-changed', tab);
				};

				this.addTab = function(tab) {
					if (tabs.length === 0) {
						$scope.select(tab);
					}
					tabs.push(tab);
				};
			},
			templateUrl: 'views/common/my-tabs.html'
		};

	}

	/**
	* @dependencies injector $scope, $ionicConfig
	*/

	myTabs.$inject=[];

	angular
		.module('tatafo')
		.directive('myTabs',myTabs)

})();

