(function()	{
      'use strict';


      var SettingsController = function($log, $scope, $rootScope, $ionicPopup, settingService) {

            var setup = function(){
                  $log.debug('SettingsController');
                  $scope.syncIntervalOptions = settingService.getSyncIntervalOptions();
                  $log.debug($scope.syncIntervalOptions);
                  $scope.userSettings = settingService.getSettings();
                  $log.debug($scope.userSettings);
            };

            /**
            * show the status of Pushnotifiaction button
            */
            $scope.toggleUserPushChoice=function(status){
                  settingService.setPushNotificationSatus(status);
                  window.plugins.OneSignal.setSubscription(status);
            }

            $scope.toggleUserImageChoice = function (status) {
                settingService.setImageViewEnable(status);
                $rootScope.$broadcast('imageViewEnabled', status);
            };

            /**
            * show popup for select interval
            */
            $scope.showPopup = function() {
                  //put selected option object in ng-model for radio button before opening popup
                  $scope.userSettings.selectedSyncOption = angular.toJson($scope.userSettings.syncTimeOption);
                  var syncPopup = $ionicPopup.show({
                        template: '<div ng-repeat="entry in syncIntervalOptions"><ion-radio ng-model="userSettings.selectedSyncOption" value="{{entry}}">{{entry.title}}</ion-radio></div>',	       
                        title: 'Please select the interval',		     
                        scope: $scope,
                        buttons: [{
                              text: '<b>OK</b>',
                              type: 'button-positive',
                              onTap: function(e) {
                                    $log.debug($scope.userSettings);
                                    $scope.userSettings.syncTimeOption = angular.fromJson($scope.userSettings.selectedSyncOption);
                                    settingService.setSyncTimeOption($scope.userSettings.syncTimeOption);
                                    $log.debug($scope.userSettings);
                                    //syncPopup.close();
                              }
                        }] 
                  });

            };

            setup();
      };

	SettingsController.$inject=['$log', '$scope', '$rootScope', '$ionicPopup', 'settingService'];
	angular
		.module('tatafo')
		.controller('SettingsController' , SettingsController);

})();