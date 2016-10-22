(function(){

	'use strict';

	/**
	* multiBg Directive function
	*/
	var multiBg=function(_){
		
			return {
			scope: {
				multiBg: '=',
				interval: '=',
				helperClass: '@'
			},
			controller: function($scope, $element, $attrs) {
				$scope.loaded = false;
				var utils = this;

				this.animateBg = function(){
					// Think i have to use apply because this function is not called from this controller ($scope)
					$scope.$apply(function () {
						$scope.loaded = true;
						$element.css({'background-image': 'url(' + $scope.bg_img + ')'});
					});
				};

				this.setBackground = function(bg) {
					$scope.bg_img = bg;
				};

				if(!_.isUndefined($scope.multiBg))
				{
					if(_.isArray($scope.multiBg) && ($scope.multiBg.length > 1) && !_.isUndefined($scope.interval) && _.isNumber($scope.interval))
					{
						// Then we need to loop through the bg images
						utils.setBackground($scope.multiBg[0]);
					}
					else
					{
						// Then just set the multiBg image as background image
						utils.setBackground($scope.multiBg[0]);
					}
				}
			},
			templateUrl: 'views/common/multi-bg.html',
			restrict: 'A',
			replace: true,
			transclude: true
		};
	}

	/**
	* @dependencies injector _
	*/

	multiBg.$inject=['_'];

	angular
		.module('tatafo')
		.directive('multiBg',multiBg)

})();

