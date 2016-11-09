(function() {
    'use strict';

    /**
    *  sourceService are used for create an connection with api to get and set the valid data.
    */

    var settingService = function($log, $http, $q, TATAFO_API_URL) {

      var syncIntervalOptions = [
        {
              title : '30 MINUTES',
              value : 0.5
        },
        {
              title : '1 Hour',
              value : 1
        },
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

      var settings = {
         syncTimeOption: syncIntervalOptions[1], //set default value 4 Hours
         pushNotificationEnabled: true,
         imageViewEnabled: false
      };
      this.getSyncIntervalOptions = function(){
          return syncIntervalOptions;
      };

      /**
      * get user settings, if not found then it will first set default settings 
      * and then return them
      */
      this.getSettings = function() {
          if (localStorage.tatafo_settings == null) {
              localStorage.tatafo_settings = JSON.stringify(settings);
          }
          return JSON.parse(localStorage.tatafo_settings ||  null);
      }
     
      this.setPushNotificationSatus = function(isPushEnabled) {
          settings = JSON.parse(localStorage.tatafo_settings || settings);
          settings.pushNotificationEnabled = isPushEnabled;
          localStorage.tatafo_settings = JSON.stringify(settings);         
      }

      this.setImageViewEnable = function(isImageEnabled) {
          settings = JSON.parse(localStorage.tatafo_settings || settings);
          settings.imageViewEnabled = isImageEnabled;
          localStorage.tatafo_settings = JSON.stringify(settings);         
      };        

      this.setSyncTimeOption = function(option){
        settings = JSON.parse(localStorage.tatafo_settings || settings);
        settings.syncTimeOption = option;
        localStorage.tatafo_settings = JSON.stringify(settings);            
      };

      /**
      * setAppRateStatus used to set the app rate status(true/false) to Local storage 
      */
      this.setAppRateStatus = function(status) {
        localStorage.tatafo_appRateStatus = status;                
      }

      /**
      * getAppRateStatus used to get the current status from Local storage 
      */
      this.getAppRateStatus = function() {
        return localStorage.tatafo_appRateStatus ||  null;
      }

      this.setSourceFeedVisitedCount = function() {
        var sourceFeedVisitedCount = JSON.parse(localStorage.tatafo_sourceFeedVisitedCounter || 0);
        sourceFeedVisitedCount++;
        localStorage.tatafo_sourceFeedVisitedCounter = sourceFeedVisitedCount;
      }

      /**
      * doWeNeedToShowAppRatePopup used to confirm that when to show popop for app rate
      * geting the counter and app rate status from local storage
      * checking the count value is it dividual by 5 and status is true
      * returning true
      */
      this.doWeNeedToShowAppRatePopup = function() {                   
        var getSourceFeedAppRateStatus = localStorage.tatafo_appRateStatus;
        var getSourceFeedVisitedCount =  localStorage.tatafo_sourceFeedVisitedCounter;
        if((getSourceFeedVisitedCount % 5 == 0) && (angular.isUndefined(getSourceFeedAppRateStatus) || getSourceFeedAppRateStatus == 'false')) {
          return true;          
        }
      }

      // this.setTutorialTourStatus = function() {
      //   var appTutorialTourStatus = JSON.parse(localStorage.tatafo_AppTutorialTourStatus || false);
      //   localStorage.tatafo_AppTutorialTourStatus = sourceFeedVisitedCount;
      // }
      // this.doWeNeedToShowTutorialTour = function() {                   
      //   var getTutorialTourStatus =  localStorage.tatafo_AppTutorialTourStatus;
      //   if(getTutorialTourStatus ) {
      //     return true;          
      //   }
      // }
    }
    settingService.$inject = [
        '$log',
        '$http', 
        '$q', 
        'TATAFO_API_URL'
    ];

    angular
        .module('tatafo')
        .service('settingService', settingService);
})();
