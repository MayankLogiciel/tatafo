(function() {
    'use strict';

    /**
    *  sourceService are used for create an connection with api to get and set the valid data.
    */

    var settingService = function($log, $http, $q, TATAFO_API_URL) {

        var syncIntervalOptions = [
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
            if (localStorage.settings == null) {
                localStorage.settings = JSON.stringify(settings);
            }
            return JSON.parse(localStorage.settings ||  null);
        }
       
        this.setPushNotificationSatus = function(isPushEnabled) {
            settings = JSON.parse(localStorage.settings || settings);
            settings.pushNotificationEnabled = isPushEnabled;
            localStorage.settings = JSON.stringify(settings);         
        }

        this.setImageViewEnable = function(isImageEnabled) {
            settings = JSON.parse(localStorage.settings || settings);
            settings.imageViewEnabled = isImageEnabled;
            localStorage.settings = JSON.stringify(settings);         
        };        

        this.setSyncTimeOption = function(option){
            settings = JSON.parse(localStorage.settings || settings);
            settings.syncTimeOption = option;
            localStorage.settings = JSON.stringify(settings);            
        };

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
