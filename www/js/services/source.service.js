(function() {
    'use strict';

    /**
    *  sourceService are used for create an connection with api to get and set the valid data.
    */

    var sourcesService = function($log, $http, $q, TATAFO_API_URL, settingService) {

        this.isFeedSourcesAvailable = function() {            
            var sources = JSON.parse(localStorage.sources || '[]');

            if(angular.isDefined(sources) && sources.length > 0 ){
                return true;
            }else{
                return false;
            }
           
        };

        /**
        *  setFeedSourcesinLocalStorage is used store sources in Local Storage
        */
        var setFeedSourcesinLocalStorage = function(sources){
            $log.debug('setFeedSourcesinLocalStorage');
            localStorage.sources = JSON.stringify(sources);
        };

        /**
        *  getFeedSourcesinLocalStorage is used to get sources from Local Storage
        */
        this.getFeedSourcesFromLocalStorage = function(){
           return JSON.parse(localStorage.sources ||  null)
        };


        /**
        *  getFeedSourceinLocalStorage is used to individual source from Local Storage accroding to the feed
        */
        this.getFeedSourceFromLocalStorage = function(id){
            var getSources= JSON.parse(localStorage.sources ||  null);
            var singleSource={}
            angular.forEach(getSources, function(val,key){ 
                if(val.id==id){
                    singleSource = val;
                };

            });
            return singleSource;

        };

        /**
        *  getFeedSourceinLocalStorage is used to get sources from API
        */
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
                    if(angular.isDefined(response.data.data.sources) && response.data.data.sources.length > 0 ){
                        console.log(new Date());
                        settingService.setSyncTime(new Date());
                    }
                    _defer.resolve(response.data.data.sources);
                },
                function(response) {
                    _defer.reject(response);
                }
            );

            return _defer.promise;
        };

       

    }

    /** 
    * sourcesService $injector $log, $http, $q, TATAFO_API_URL, settingService
    */
    sourcesService.$inject = [
        '$log', 
        '$http', 
        '$q', 
        'TATAFO_API_URL',
        'settingService'
    ];

    angular
        .module('tatafo')
        .service('sourcesService', sourcesService);
})();
