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
           lastTimeSourceSynced: '',
           sourceSyncIntervalTime: 0,
           pushNotificationEnabled: true,
           imageViewEnabled: false
        }

        /**
            settingService.getSetting function will set default settings if already not set
            (means first Time) other wise it will return users setting
        */
        this.getSettings = function() {
            if (localStorage.setting == null) {
                localStorage.setting = JSON.stringify(setting);
            }
            return JSON.parse(localStorage.setting ||  null);
        }

        // this.setSettings = function() {
        //     console.log(setting);
        //     localStorage.setting = JSON.stringify(setting);
        // }
       
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

        //settingService.setSyncTime function will set last sync time set by the user
        this.setSyncTime = function(date) {
            setting = JSON.parse(localStorage.setting || setting);
            setting.lastTimeSourceSynced = date;
            localStorage.setting = JSON.stringify(setting);
        };

        //settingService.getAllSetting function will get all settings from LocalStorage
        this.getAllSetting = function() {                    
            return JSON.parse(localStorage.setting ||  null);
        };

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
