(function() {
    'use strict';

    /**
    *  sourceService are used for create an connection with api to get and set the valid data.
    */

    var settingService = function($log, $http, $q, TATAFO_API_URL) {

        var setting = {
           lastTimeSourceSynced: '',
           setSyncIntervalTime: 0,
           pushNotificationEnabled: true,
           imageViewEnabled: true
        }

        this.getSettings = function() {
            if (localStorage.setting == null) {
                localStorage.setting = JSON.stringify(setting);
            }
            return JSON.parse(localStorage.setting ||  null);
        }

        this.setSettings = function() {
            console.log(setting);
            localStorage.setting = JSON.stringify(setting);
        }


        this.getPushNotificationSatus = function() {
           
        }

        this.setPushNotificationSatus = function(status) {
            setting = JSON.parse(localStorage.setting || setting);
            setting.pushNotificationEnabled = status;
            localStorage.setting = JSON.stringify(setting);         
        }
        

        this.setSyncTime = function(date) {
            setting = JSON.parse(localStorage.setting || setting);
            setting.lastTimeSourceSynced = date;
            localStorage.setting = JSON.stringify(setting);
        };


        this.getSyncTime = function() {           
           
            return JSON.parse(localStorage.setting ||  null);
        };

  
        this.setInterval = function(hour) { 
            
            setting = JSON.parse(localStorage.setting || setting);
            setting.setSyncIntervalTime = hour;
            localStorage.setting = JSON.stringify(setting);
        };

        this.getAllSetting = function() {           
           
            return JSON.parse(localStorage.setting ||  null);
        };

        this.getInterval = function() {           
           
            return JSON.parse(localStorage.setting ||  null);
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
