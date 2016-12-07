angular
	.module('tatafo.config', [])

	/**
	* Constant for QA API Url
	* Constant ONESIGNAL App Id
	* Constant for Admob (Banner and Interstitial ads)
	**/
	// .constant('TATAFO_API_URL','http://qa.tatafo.me/api/v1')
	// .constant('ONESIGNAL_APP_ID','8c566d45-c299-4535-bd2f-f19415635a55')
	// .constant('GOOGLE_PROJECT_NUMBER','1082216437947')
	// .constant('ANDROID_BANNER_ID','ca-app-pub-2007428953027611/9618067289')
	// .constant('ANDROID_INTERSTITIAL_ID','ca-app-pub-2007428953027611/9618067289')
	// .constant('DEBUG', true)



	/**
	* Constant for Tatafo Live Server Url
	* Constant ONESIGNAL App Id
	* Constant for Admob (Banner and Interstitial ads)
	**/
	.constant('TATAFO_API_URL','http://tatafo.me/api/v1')
	.constant('ONESIGNAL_APP_ID','a726a388-d2df-4a3f-8d02-e4a1a5cb6c2e')
	.constant('GOOGLE_PROJECT_NUMBER','581044149896')
	.constant('ANDROID_BANNER_ID','ca-app-pub-2007428953027611/9618067289')
	.constant('ANDROID_INTERSTITIAL_ID','ca-app-pub-2007428953027611/9618067289')
	.constant('DEBUG', true)
	
	.config(function($logProvider, DEBUG){
		//enable disable log statements depends on environment DEBUG flag
	  	$logProvider.debugEnabled(DEBUG);
	});