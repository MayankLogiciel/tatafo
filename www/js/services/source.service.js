(function() {
    'use strict';

    /**
    *  sourceService are used for create an connection with api to get and set the valid data.
    */

    var sourcesService = function($log, $http, $q, TATAFO_API_URL, settingService) {

        this.isFeedSourcesAvailable = function() {            
            var sources = JSON.parse(localStorage.tatafo_sources || '[]');

            if(angular.isDefined(sources) && sources.length > 0 ){
                return true;
            }else{
                return false;
            }
           
        };

        this.set
        /**
        *  setFeedSourcesinLocalStorage is used store sources in Local Storage
        */
        var setFeedSourcesinLocalStorage = function(sources){
            $log.debug('setFeedSourcesinLocalStorage');
            localStorage.tatafo_sources = JSON.stringify(sources);
        };

        /**
        *  getFeedSourcesinLocalStorage is used to get sources from Local Storage
        */
        this.getFeedSourcesFromLocalStorage = function(){
           return JSON.parse(localStorage.tatafo_sources ||  null)
        };


        /**
        *  getFeedSourceinLocalStorage is used to individual source from Local Storage accroding to the feed
        */
        this.getFeedSourceFromLocalStorage = function(id){
            var getSources= JSON.parse(localStorage.tatafo_sources ||  null);
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
                        setLastSourceSyncTime(new Date());
                    }
                    _defer.resolve(response.data.data.sources);
                },
                function(response) {
                    _defer.reject(response);
                }
            );

            return _defer.promise;
        };

        var setLastSourceSyncTime = function(date){
            localStorage.tatafo_lastSourceSyncTime = date;
        };

        this.getLastSourceSyncTime = function(){
            return localStorage.tatafo_lastSourceSyncTime || new Date("October 13, 2000 00:00:00");
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
