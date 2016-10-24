(function()	{
      'use strict';


      var SettingsController = function($scope, $state, $ionicPopup, $timeout, $ionicSideMenuDelegate, $ionicScrollDelegate, $ionicLoading, settingService, $filter) {

            /**
            * syncIntervals data
            */
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

            $scope.interval = {};
            $scope.interval.value = settingService.getAllSetting().sourceSyncIntervalTime;
            $scope.push=settingService.getAllSetting().pushNotificationEnabled;

            /**
            * Fecthing the title of Selected Interval by user
            */
            $scope.selectedInterval = function () {
                  if (angular.isDefined($scope.syncIntervals) && $scope.syncIntervals.length > 0) {
                        var temp = $filter('filter')($scope.syncIntervals, { value: $scope.interval.value });
                        return temp[0].title;
                  }
            };

            /**
            * Fecthing the value of Selected Interval by user
            */

            $scope.intervalValue=function() {
                  settingService.setSourceSyncIntervalTime($scope.interval.value);
            }

            /**
            * show the status of Pushnotifiaction button
            */
            $scope.showStatus=function(status){
                  settingService.setPushNotificationSatus(status);
                  window.plugins.OneSignal.setSubscription(status);
            }

            /**
            * show popup for select interval
            */
            $scope.showPopup = function() {
                  $scope.interval.value = settingService.getAllSetting().sourceSyncIntervalTime;
                  var myPopup = $ionicPopup.show({
                        template: '<div ng-repeat="entry in syncIntervals"><ion-radio ng-model="interval.value" value="{{entry.value}}">{{entry.title}}</ion-radio></div>',	       
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
	* @dependencies injector $scope, $state, $ionicPopup, $timeout, $ionicSideMenuDelegate, $ionicScrollDelegate, $ionicLoading, settingService, $filter
	*/
	SettingsController.$inject=['$scope', '$state', '$ionicPopup', '$timeout', '$ionicSideMenuDelegate', '$ionicScrollDelegate', '$ionicLoading', 'settingService', '$filter'];
	angular
		.module('tatafo')
		.controller('SettingsController' , SettingsController);

})();