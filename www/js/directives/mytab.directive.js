(function(){

	'use strict';

	/**
	* Mytab Directive function
	*/
	var myTab=function(){
		
		return {
			require: '^myTabs',
			restrict: 'E',
			transclude: true,
			scope: {
				title: '@'
			},
			link: function(scope, element, attrs, tabsCtrl) {
				tabsCtrl.addTab(scope);
			},
			templateUrl: 'views/common/my-tab.html'
		};
	}

	/**
	* @dependencies injector $scope, $ionicConfig
	*/

	myTab.$inject=[];

	angular
		.module('tatafo')
		.directive('myTab',myTab)

})();

