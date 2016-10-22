(function() {
    'use strict';
    var feedService = function($log, $http, $q, TATAFO_API_URL, $window, $rootScope, $ionicLoading, $timeout,$filter) {

        var _db;
        var getResponse;
        var post;
        
        _db = new PouchDB('feeds');
        this.feedsPost=function(feeds){ 
                angular.forEach(feeds, function(feed, key) {                                   
                    _db.find({
                        selector: {id: feed.id},                                        
                    }).then(function (result) {
                        if(result.docs.length==0){                            
                            _db.post(feed);                                               
                        }else{
                            
                            _db.remove(result.docs[0]._id, result.docs[0]._rev);
                            _db.post(feed);
                        }
                       // console.log(result,feed.id,result.docs[0].id);
                    })            
               
                });
            localDbData(feeds);
            //console.log(feeds);
        }      

        //store only 50 records in pouchDB
        var localDbData=function(feeds){
            $timeout(function (feeds) {
                $q.when(_db.allDocs({  
                    include_docs: true,
                    sort:[{'updated_at':'asc'}]
                })).then(function(docs) {
                        if(docs.rows.length>50){
                            for(var i = docs.rows.length; i > 50; i--){
                               _db.remove(docs.rows[i].doc._id , docs.rows[i].doc._rev);
                            }
                        }
                    });
            },3000);
        };



     /**
     * get filtered source posts from Posts Local DB according to sourceId
     * @param  {String/Integer} sourceId  posts to be fetched for
     * @return {Promise}
     */
    // this.getPostsHavingSource = function(param){
    //     var deferred = $q.defer();

    //     var options = {
    //         include_docs: true,
    //         descending: true,
    //         skip: (param.page - 1) * 10,
    //         limit: 10
    //     };

    //     _db.allDocs(options).then(function(docs){
    //         var data = {
    //             posts : [],
    //             total_rows : docs.total_rows,
    //             offset: docs.offset,
    //             isMorePostsPresent: true  
    //         };

    //         data.posts = filterPostsHavingSourceId(docs.rows, param.source_id);
    //         data.isMorePostsPresent = (docs.total_rows - docs.offset - docs.rows.length) > 0 ? true : false;
    //         deferred.resolve(data.posts); 
    //     });

    //     return deferred.promise;      
    // };


     /**
     * get matching post with source Id
     * @param  {Array}  rows  rows/post fetched from pouch db
     * @param  {String/Integer}  sourceId 
     * @return {Array} filtered posts accordint to sourceId
     */
    // var filterPostsHavingSourceId = function(rows, param) {
        
    //     var relatedPosts = [];
    //     rows.map(function(row){
    //         if(isPostRelatedToSource(row.doc.post, param) ) {
    //            relatedPosts.push(row.doc.post);
    //         }
    //     });
    //     return relatedPosts;
    // }

    /**
     * check whether post is related with particular source or not
     * @param  {Object}          post       to decide
     * @param  {String/Integer}  sourceId 
     * @return {Boolean}
     */
    // var isPostRelatedToSource = function(post, param){
    //     var isRelated = false;
    //     if(post.source_id == param.source_id){
    //         isRelated = true;
    //     }
    //     return isRelated;
    // };

    this.searchFromPouchDB=function(param){  
        var _defer  = $q.defer();
        _db.search({
            query: param.name,
            fields: ['feed.title'],
            include_docs: true,
            skip: (param.page - 1) * 10,
            limit: 10
        }).then(function(docs){
            var mydata = {
                data : [],
                total_rows : docs.total_rows,
                offset: docs.offset,
                isMorePostsPresent: true  
            };
            angular.forEach(docs.rows,function(value,key){   
                mydata.data.push(value.doc);
            });
            mydata.isMorePostsPresent = (docs.total_rows - docs.offset - docs.rows.length) > 0 ? true : false;
            _defer.resolve(mydata);
        },function(error){
            _defer.reject(error);
        });
        return _defer.promise;
    }; 



    this.sortPouchDBData=function(param){  
        var _defer  = $q.defer();
        _db.createIndex({
            index: {fields: ['is_read']}
        }).then(function () {
            _db.find({
                selector: {is_read: param.is_read},
                include_docs: true,
                skip: (param.page - 1) * 10,
                limit: 100
            }).then(function(docs){
                var mydata = {
                    data : [],
                    total_rows : docs.total_rows,
                    offset: docs.offset,
                    isMorePostsPresent: true  
                };
                    mydata.data = docs;
                    mydata.isMorePostsPresent = (docs.total_rows - docs.offset - docs.length) > 0 ? true : false;
                _defer.resolve(mydata.data.docs);

        },function(error){
            _defer.reject(error);     
        }).then(function(res) {
            _db.getIndexes().then(function (result) {
                _db.deleteIndex({
                    "ddoc" : result.ddoc,
                    "name": result.name,
                    "type": "json",
                    "def": {
                        "fields": [{"is_read": "asc"}]
                    }
                }).then(function (response) {
                    
                });
                });   

            });
        });
        return _defer.promise;
    };       
          
    this.getfeedFromPouchDB=function(param){
        var options = {
            include_docs: true,
            descending: true,
            skip: (param.page - 1) * 10,
            limit: 10
        };
        var _defer  = $q.defer();
        $q.when(_db.allDocs(options))
        .then(function(docs) {
            $log.debug(docs);
            var mydata = {
                data : [],
                total_rows : docs.total_rows,
                offset: docs.offset,
                isMorePostsPresent: true  
            }
            angular.forEach(docs.rows,function(value,key){   
                mydata.data.push(value.doc);
            });
            mydata.isMorePostsPresent = (docs.total_rows - docs.offset - docs.rows.length) > 0 ? true : false;
            _defer.resolve(mydata);
        },function(error){
            _defer.reject(error);
        });
        return _defer.promise;

    };


        this.getFeeds = function(data) {
                var _defer  = $q.defer(data);
                $http({ method: 'GET',
                    url: TATAFO_API_URL + '/get-feeds',
                    params : data,
                    timeout: _defer.promise 
                }).then(function( response ) {
                    _defer.resolve(response);
                }, function(response) {
                    _defer.reject(response);
                });

                return _defer.promise;
            }

        this.getRaedOrUnread=function(query) {
            
            var _defer  = $q.defer();
            $http({ method: 'POST',
                url: TATAFO_API_URL + '/feed/status/'+query.status ,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {'ids[]': query.ids },
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

    }
    feedService.$inject = [
    '$log', 
    '$http', 
    '$q', 
    'TATAFO_API_URL',
    '$window', 
    '$rootScope',
    '$ionicLoading',
    '$timeout',
    '$filter'
    ];

    angular
    .module('tatafo')
    .service('feedService', feedService);
})();





        // this.feedsPost = function(posts) {
        //     var docPosts = posts.map(function(post){
        //         var docPost = {
        //             "_id" : new Date(post.updated_at).toJSON(),
        //             "post" : post
        //         }
        //         return docPost.post;
        //     });

        //     //Don't bother for document conflict, as these records are already present
        //     _db.bulkDocs(docPosts)
        //     .then(function(result) {
        //         return _db.allDocs({descending: true, skip: 50});
        //     }).then(function (extraDocs) {
        //         angular.forEach(extraDocs.rows, function(row){
        //             console.log(row);
        //             _db.get(row.id).then(function(doc){
        //                 _db.remove(doc._id, doc._rev);
        //             });
        //         });
        //     });
        // };
