(function() {
    'use strict';
    var utilService = function($cordovaToast, $cordovaDialogs) { 

        /**
        * 1. show toast or dialog on devices
        * 2. it will always show window alert on desktop browser
        * @param  {string} message to show
        * @param  {string} type  [toast|dialog]
        * @param  {string} duration  how long toast message will show [short|long]
        * @param  {string} title  to show on native dialog box
        */
        this.toastOrDialog = function(message,type,duration,title){

            type = angular.isDefined(type) ? type : 'toast';
            duration = angular.isDefined(duration) ? duration : 'short';

            if(!ionic.Platform.isWebView()){
            //if running on browser convert all toast messages to dialogs
                type = "dialog";
            }

            if(type=="toast"){
                switch(duration){
                    case 'short':
                    $cordovaToast.showShortBottom(message);
                    break;
                    case 'long':
                    $cordovaToast.showLongBottom(message);
                    break;     
                }  
            }else{
                if(angular.isDefined(title)){
                    $cordovaDialogs.alert(message,title);
                }else{
                    $cordovaDialogs.alert(message);
                }
            }
        };  
    }
  
    utilService.$inject = ['$cordovaToast', '$cordovaDialogs'];

    angular
        .module('tatafo')
        .service('utilService', utilService);
})();