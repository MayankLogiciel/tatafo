(function()	{
	'use strict';

	/**
	* SendMailController function
	*/
	var SettingsController = function($scope, $state, $ionicPopup, $timeout, $ionicSideMenuDelegate, $ionicScrollDelegate, $ionicLoading, settingService) {

      	$scope.syncIntervals = [
      		{
      			title : '2 Hours',
      			value : 2
      		},
      		{
      			title : '4 Hours',
      			value : 4
      		},
      		{
      			title : '6 Hours',
      			value : 6
      		},
      		{
      			title : '8 Hours',
      			value : 8
      		},
      		{
      			title : '10 Hours',
      			value : 10
      		},
      		{
      			title : '12 Hours',
      			value : 12
      		},
      	];

            $scope.push=settingService.getAllSetting().pushNotificationEnabled;

            $scope.intervalValue=function() {  
                                            
                  settingService.setInterval($scope.interval);
            }
            $scope.showStatus=function(status){
                  settingService.setPushNotificationSatus(status);
                  window.plugins.OneSignal.setSubscription(status);
            }


            $scope.showPopup = function() {
                  $scope.interval = {};
                  $scope.interval.value = settingService.getInterval().setSyncIntervalTime;
                  // Custom popup
            	var myPopup = $ionicPopup.show({
      	            template: '<div ng-repeat="entry in syncIntervals"><ion-radio ng-model="interval.value" value="{{entry}}">{{entry.title}}</ion-radio></div>',	       
      	            title: 'Please select the interval',		     
      	            scope: $scope,
                        buttons: [{
                              text: '<b>OK</b>',
                              type: 'button-positive',
                              onTap: function(e) {
                                    $scope.intervalValue();
                                    myPopup.close();
                              }
                        }] 
                  });
                  
            };
	};

	/**
	* @dependencies injector $scope , $ionicActionSheet , $state
	*/
	SettingsController.$inject=['$scope', '$state', '$ionicPopup', '$timeout', '$ionicSideMenuDelegate', '$ionicScrollDelegate', '$ionicLoading', 'settingService'];

	angular
		.module('tatafo')
		.controller('SettingsController' , SettingsController);

})();