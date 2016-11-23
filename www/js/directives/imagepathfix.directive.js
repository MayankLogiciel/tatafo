(function () {

	'use strict';

	var imagePathFix = function ($rootScope, settingService, $timeout, ConnectivityMonitorFactory) {
		return {
			scope: {},
			link: function(scope, element, attrs) {

				var isImageViewDisabled = settingService.getSettings().imageViewDisabled;

				$rootScope.$on('imageViewEnabled', function(ev, args) {
					isImageViewDisabled = args;
				});

				if (isImageViewDisabled || ConnectivityMonitorFactory.isOffline()) {
					var timer = $timeout(function(){
						var images = element.find('img');
						var href = element.find('img').parent();

						// update img parent link
						if (href.length > 0) {
							angular.forEach(href, function(val) {
								var temp = 'javascript:void(0)';
								if(val.href) val.href = temp;
							});
						}

						// update image path
						if(images.length > 0)
						{
							angular.forEach(images, function(val) {
								var temp = 'img/imgUnavailable.png';
								val.src = temp;
							});
						}
					}, 0, false);
				}

				// Unbind watch
				scope.$on('$destroy', function() {
					$timeout.cancel( timer );
				});
			},
			restrict: 'A',
			replace: false
		};
	}

	imagePathFix.$inject = ['$rootScope', 'settingService', '$timeout', 'ConnectivityMonitorFactory'];

	angular
		.module('tatafo')
		.directive('imagePathFix', imagePathFix)
})();