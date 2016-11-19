(function() {
    'use strict';

    /**
    * 1. Write Custom messages for hole app.
    */

    var messagesService = function() {
        this.general = {
            'SOMETHING_WRONG': 'Something went wrong',
            'INTERNET_NOT_CONNECTED':'Please check your internet connection',
            'INTERNET_NOT_WORKING':'Network unavailable'
        };

        // this.popupTitle = {

        // };

        // this.popupMessages = {
        // };
    }
    
    messagesService.$inject = [];

    angular
        .module('tatafo')
        .service('messagesService', messagesService);
})();