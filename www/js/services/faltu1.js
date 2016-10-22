  // this.feedsPost=function(feeds){ 
        //         angular.forEach(feeds, function(feed, key) {                                   
        //             _db.find({
        //                 selector: {id: feed.id},                                        
        //             }).then(function (result) {
        //                 if(result.docs.length==0){                            
        //                     _db.post(feed);                                               
        //                 }else{
        //                     _db.remove(result.docs[0]._id, result.docs[0]._rev);
        //                     _db.post(feed);
        //                 }
        //             })            
               
        //         });
        //     localDbData(feeds);
        //     //console.log(feeds);
        // }      

        //store only 50 records in pouchDB
        // var localDbData=function(feeds){

        //     console.log(feeds);
        //     // angular.forEach(extraDocs.rows, function(row){
        //     //     postsDB.get(row.id).then(function(doc){
        //     //         postsDB.remove(doc._id, doc._rev);
        //     //     });
        //     // });
        //     // $timeout(function (feeds) {
        //     //     $q.when(_db.allDocs({  
        //     //         include_docs: true,
        //     //         descending: true, 
        //     //     })).then(function(docs) {

        //     //             _db.remove(docs.rows[0].doc._id , docs.rows[0].doc._rev);
                       
        //     //         });
        //     // },3000);
        // };




        this.sortReadUnread=function(param) {
            var _defer  = $q.defer();
            // _db.createIndex({
            //     index: {fields: ['is_read']}
            // }).then(function () {
                _db.find({
                    selector: {is_read: param.is_read},
                    include_docs: true,
                    skip: (param.page - 1) * 10,
                }).then(function(docs) {
                    console.log(docs);
                    var mydata = {
                        data : [],
                        total_rows : docs.total_rows,
                        offset: docs.offset,
                        isMorePostsPresent: true  
                    };
                    mydata.data = docs;
                    mydata.isMorePostsPresent = (docs.total_rows - docs.offset - docs.length) > 0 ? true : false;
                    _defer.resolve(mydata.data);

                },function(error) {
                    _defer.reject(error);     
                }).then(function(res) {
                    _db.getIndexes().then(function (result) {
                    // _db.deleteIndex({
                    //     "ddoc" : result.ddoc,
                    //     "name": result.name,
                    //     "type": "json",
                    //     "def": {
                    //         "fields": [{"is_read": "asc"}]
                    //     }
                    // }).then(function (response) {
                        
                    // });
                    });   

                });
           // });
            return _defer.promise;
        }




