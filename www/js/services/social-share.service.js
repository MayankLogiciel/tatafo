(function() {
    'use strict';

    /**
    * 1. Write Custom social for hole app.
    */

    var socialService = function($log, $cordovaSocialSharing) {

    	var title='',
    		summary='', 
    		image='', 
    		link='';

		this.share=function(title, summary, image, link){

	    	$cordovaSocialSharing
				.share(title, summary, image, link) // Share via native share sheet
				.then(function(result) {
				// Success!
				}, function(err) {
			// An error occured. Show a message to the user
			});

			$log.debug(title,summary, image, link);

		}	
    }
    
    socialService.$inject = ['$log', '$cordovaSocialSharing'];

    angular
        .module('tatafo')
        .service('socialService', socialService);
})();