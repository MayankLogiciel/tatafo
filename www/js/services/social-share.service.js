(function() {
    'use strict';

    /**
    * 1. Write Custom social for hole app.
    */

    var socialService = function($log, $cordovaSocialSharing) {

    	var link='';

		this.sharePost = function(link){
            window.plugins.socialsharing.share('Check this post here: ', null, null, link);
        };
    }
    
    socialService.$inject = ['$log', '$cordovaSocialSharing'];

    angular
        .module('tatafo')
        .service('socialService', socialService);
})();