(function() {
	'use strict';

	/*
	* AdsController function
	*/
	var AdsController = function($scope , $ionicActionSheet , adMobileFactory , iAd) {

		$scope.manageAdMob = function() {
		// Show the action sheet
		var hideSheet = $ionicActionSheet.show({
			//Here you can add some more buttons
			buttons: [
				{ text: 'Show Banner' },
				{ text: 'Show Interstitial' }
			],
			destructiveText: 'Remove Ads',
			titleText: 'Choose the ad to show',
			cancelText: 'Cancel',
			cancel: function() {
				// add cancel code..
			},
			destructiveButtonClicked: function() {
				console.log("removing ads");
				adMobileFactory.removeAds();
				return true;
			},
			buttonClicked: function(index , button) {
				if(button.text == 'Show Banner')
				{
					console.log("show banner");
					adMobileFactory.showBanner();
				}
				if(button.text == 'Show Interstitial')
				{
					console.log("show interstitial");
					adMobileFactory.showInterstitial();
				}
				return true;
			}
		});
	};

		$scope.manageiAd = function() {

			// Show the action sheet
			var hideSheet = $ionicActionSheet.show({
				//Here you can add some more buttons
				buttons: [
					{ text: 'Show iAd Banner' },
					{ text: 'Show iAd Interstitial' }
				],
				destructiveText: 'Remove Ads',
				titleText: 'Choose the ad to show - Interstitial only works in iPad',
				cancelText: 'Cancel',
				cancel: function() {
					// add cancel code..
				},
				destructiveButtonClicked: function() {
					console.log("removing ads");
					iAd.removeAds();
					return true;
				},
				buttonClicked: function(index, button) {
					if(button.text == 'Show iAd Banner')
					{
						console.log("show iAd banner");
						iAd.showBanner();
					}
					if(button.text == 'Show iAd Interstitial')
					{
						console.log("show iAd interstitial");
						iAd.showInterstitial();
					}
					return true;
				}
			});
		};
	};

	/**
	* @dependencies injector $scope, $ionicActionSheet, adMobileFactory, iAd
	*/
	AdsController.$inject = ['$scope','$ionicActionSheet', 'adMobileFactory', 'iAd'];

	angular
		.module('tatafo')
		.controller('AdsController',AdsController);
})();