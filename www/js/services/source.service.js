(function() {
    'use strict';

    /**
    *  sourceService are used for create an connection with api to get and set the valid data.
    */

    var sourcesService = function($log, $http, $q, TATAFO_API_URL) {

        this.isFeedSourcesAvailable = function() {            
            var sources = JSON.parse(localStorage.sources || '[]');

            if(angular.isDefined(sources) && sources.length > 0 ){
                return true;
            }else{
                return false;
            }
           
        };

        var setFeedSourcesinLocalStorage = function(sources){
            $log.debug('setFeedSourcesinLocalStorage');
            localStorage.sources = JSON.stringify(sources);
        };

        this.getFeedSourcesFromLocalStorage = function(){
           return JSON.parse(localStorage.sources ||  null)
        };


        this.getSources = function(data) {
            var _defer  = $q.defer();
            // Initiate the AJAX request.
            $http({
                method: 'get',
                url: TATAFO_API_URL + '/get-sources',
                params: data,
                timeout: _defer.promise
            }).then(
                function( response ) {
                    setFeedSourcesinLocalStorage(response.data.data.sources);
                    _defer.resolve(response.data.data.sources);
                },
                function(response) {
                    _defer.reject(response);
                }
            );

            return _defer.promise;
        };

       

    }

    sourcesService.$inject = [
        '$log', 
        '$http', 
        '$q', 
        'TATAFO_API_URL'
    ];

    angular
        .module('tatafo')
        .service('sourcesService', sourcesService);
})();
