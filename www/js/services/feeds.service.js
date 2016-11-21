(function() {
    'use strict';
    var feedService = function($log, $http, $q, TATAFO_API_URL, $window, $rootScope, $ionicLoading, $timeout) {

        var post;


        /**
        * Filtering feeds acording to Read/Unread Sort From API
        */

        this.markPostReadUnread=function(params) {

            var _defer  = $q.defer();
            $http({ method: 'POST',
                url: TATAFO_API_URL + '/feed/status/'+params.status ,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {'ids[]': params.ids },
                timeout: _defer.promise 
            }).then(function( response ) {
                _defer.resolve(response);
            }, function(response) {
                _defer.reject(response);
            });

            return _defer.promise;
        }

        /**
        * Get the post object
        * @return {object} 
        */
        this.getPostData = function() {
            return post;
        };

        /**
        * set the post object
        * @param {object} articleInfo 
        * set post = articleInfo
        */
        this.setPostData=function(articleInfo) {
            post=articleInfo;           
        };

        /**
        * Gettiong feed From API
        */
        this.getFeeds = function(data) {
            var _defer  = $q.defer(data);
            $http({ method: 'GET',
                url: TATAFO_API_URL + '/get-feeds',
                params : data,
                timeout: _defer.promise 
            }).then(function( response ) {
                var re = /<img[^>]+src="?([^"\s]+)"?[^>]*\/>/;
                response.data.data.feed.map(function(val) {
                    var results = re.exec(val.feed.content || val.feed.summary);
                    if(results) {
                       if((results[0].match(/width="1"/gi)) || (results[0].match(/height="1"/gi))) {
                            val.image = null; 
                        }else {
                            val.image = results[1];
                        }
                    }                                        
                });
                _defer.resolve(response);
            }, function(response) {
                _defer.reject(response);
            });
            return _defer.promise;
        }            

    }
    feedService.$inject = [
        '$log', 
        '$http', 
        '$q', 
        'TATAFO_API_URL',
        '$window', 
        '$rootScope',
        '$ionicLoading',
        '$timeout'
    ];

    angular
    .module('tatafo')
    .service('feedService', feedService);
})();
