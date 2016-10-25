(function() {
    'use strict';

    /**
    *  sourceService are used for create an connection with api to get and set the valid data.
    */

    var settingService = function($log, $http, $q, TATAFO_API_URL) {
        /**
        * Initiallization
        */
        var setting = {
           sourceSyncIntervalTime: 0,
           pushNotificationEnabled: true,
           imageViewEnabled: false
        }

        //get user settings, if not found then it will first set default settings 
        //and then return them
        this.getSettings = function() {
            if (localStorage.setting == null) {
                localStorage.setting = JSON.stringify(setting);
            }
            return JSON.parse(localStorage.setting ||  null);
        }
       
        //settingService.getSetting function will set pushnotification setting
        this.setPushNotificationSatus = function(status) {
            setting = JSON.parse(localStorage.setting || setting);
            setting.pushNotificationEnabled = status;
            localStorage.setting = JSON.stringify(setting);         
        }

        //settingService.getSetting function will set pushnotification setting
        this.setImageViewEnable = function(status) {
            setting = JSON.parse(localStorage.setting || setting);
            setting.imageViewEnabled = status;
            localStorage.setting = JSON.stringify(setting);         
        }          

        //Wait until time is more than setsourceSyncIntervalTime
        this.setSourceSyncIntervalTime = function(hour) {            
            setting = JSON.parse(localStorage.setting || setting);
            setting.sourceSyncIntervalTime = hour;
            localStorage.setting = JSON.stringify(setting);
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
