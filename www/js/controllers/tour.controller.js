(function() {
    
    'use strict';

    /**
    * TourController function
    * This is the controller that handles the app tour page
    */
    var TourController = function($scope, $state, $ionicSlideBoxDelegate) {

        $scope.$on('$ionicView.enter', function() {
            //Customizations
            $scope.ioniconSize = "36px"; //icon button size.
            $scope.ioniconColor = "#fff"; //icon button color.
            $scope.imageWidth = "65%"; //size of the tour image.
            $scope.textWidth = "70%"; //how much width should the tour texts occupy.
            $scope.fontColor = "#fff"; //color of the tour texts.
            $scope.titleSize = "24px"; //size of the title.
            $scope.subtitleSize = "18px"; //size of the subtitle.
            $scope.textSize = "18px"; //size of the text.

            //To edit carousel size and color look for
            //.slider-pager .slider-pager-page
            //.slider-pager .slider-pager-page.active in style.css

            //Set the pages.
            $scope.pages = [({
                    backgroundColor: "#387ef5",
                    image: "img/bg-img.jpg",
                    title: "Welcome to Firebase v3 Auth Social Kit",
                    subtitle: "The easiest way to implement Firebase and Social login auth to your Ionic application."
                }),
                ({
                    backgroundColor: "#e82f2d",
                    image: "img/bg-gif.gif",
                    title: "Absolutely Beautiful User Interface",
                    subtitle: "Simple-yet-effective UI to guide your user in, including error and popup messages."
                }),               
            ];

            //Further Customizations
            $scope.pages.backgroundColor = "#387ef5";

            $scope.pages.nextPageText = "Swipe to Continue";
            $scope.pages.endText = "End Tour";
            $scope.pages.redirect = "app.feeds.all";

            //Initialization
            $scope.atFirstPage = true;
            $ionicSlideBoxDelegate.update();

            //Go to the next slide.
            $scope.next = function() {
                $ionicSlideBoxDelegate.next();
            };

            //Go to the previous slide.
            $scope.previous = function() {
                $ionicSlideBoxDelegate.previous();
            };

            //End tour.
            $scope.skip = function() {
                //Return to first page.
                $ionicSlideBoxDelegate.slide(0);
                $state.go($scope.pages.redirect);
            };

            //Go to the page of the pager/carousel selected.
            $scope.pagerClicked = function(index) {
                $ionicSlideBoxDelegate.slide(index);
            };

            //Determines whether the user is on the first page and the last page, to show the appropriate buttons.
            $scope.slideChanged = function(index) {
                //User is on the last page.
                if (index + 1 == $scope.pages.length) {
                    $scope.atLastPage = true;
                } else {
                    $scope.atLastPage = false;
                }
                //User is on the first page.
                if (index == 0) {
                    $scope.atFirstPage = true;
                } else {
                    $scope.atFirstPage = false;
                }
            };
        });
    };

    /**
    * @dependencies injector $scope, $state, $ionicSlideBoxDelegate
    */
    TourController.$inject=['$scope', '$state', '$ionicSlideBoxDelegate'];

    angular
        .module('tatafo')
        .controller('TourController',TourController);

})();


