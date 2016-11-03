var app = angular.module('myapp', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider,$locationProvider) {
	$routeProvider.
		when('/home', {
			controller: 'homeController',
			templateUrl : "html/home.html"

		}).
		when('/analytics', {
			controller: 'analyticsController',
			templateUrl : "html/analytics.html"

		}).
		when('/logout', {
			controller: 'logoutController',
			templateUrl : "html/home.html"

		}).
        otherwise({
          redirectTo: '/home',
        });
    }
]);

app.controller('logoutController',function($scope,$http){
	if (confirm("Are you sure you want to logout?")== true) {
	     window.location = '/';
	} else {
	    return false;
	}
	
});

var current_community;
var current_user;
app.controller('homeController', function($scope,$http) {
	
	$scope.CommunityListObj = {};
	
	/*$http.get("/user").success(function(response){
		if(response.msg == "Fail"){
			alert("Session Expired. Please Login to continue.");
			window.location.href = "/";
			return false;
		}else{
			response.data[0].logindatetime = new Date(Date.parse(response.data[0].logindatetime));
			console.log(response.data[0]);
			$scope.user = response.data[0];
			console.log($scope.user.logindatetime);
			current_user=$scope.user.userunkid;
		}
		
	});*/
	
	$scope.logout = function() {
		$http({
	        method: 'DELETE',
	        url: '/api/session',
	        
	     }).success(function(response){
	       
	        console.log(response);
	        window.location = '/';
	    }).error(function(error){
	        alert("error");
	    });
	};
	
	$scope.saveCommunity = function() {	
	};
	
	
});
app.controller('analyticsController', function($scope,$http) {
	
	$http.get("/seasonalAnalysis?year=2012").success(function(response){
		var seosonalTrendArray = [];
		var permitTypeCountArray = [];
		var permitTypes = [];
		var seosonalTrendObj = {};
		var counts = [];
		$(response).each(function(idx,obj){
			if(typeof permitTypeCountArray[obj.Permit_Type] == "undefined" || typeof permitTypeCountArray[obj.Permit_Type] == null){
				permitTypeCountArray[obj.Permit_Type] = {};
				permitTypes.push(obj.Permit_Type);
			}
			permitTypeCountArray[obj.Permit_Type][parseInt(obj.Quarter)-1] = obj.Count;
		});
		console.log(permitTypeCountArray);

		$(permitTypes).each(function(idx,permit_type){
			counts = [];
			for(var i=0; i<4; i++){
				counts.push(permitTypeCountArray[permit_type][i]);
			}
			seosonalTrendArray.push({name: permit_type, data: counts})
		});
		
		$(function () {
		    Highcharts.chart('containerSeasonalAnalytics', {
		        title: {
		            text: 'Seasonal Permit Trend',
		            x: -20 //center
		        },
		        subtitle: {
		            text: 'Source: NYU OPen Data',
		            x: -20
		        },
		        xAxis: {
		            categories: ['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4']
		        },
		        yAxis: {
		            title: {
		                text: 'Total Number of Permits'
		            },
		            plotLines: [{
		                value: 0,
		                width: 1,
		                color: '#808080'
		            }]
		        },
		        tooltip: {
		            valueSuffix: '°C'
		        },
		        legend: {
		            layout: 'vertical',
		            align: 'right',
		            verticalAlign: 'middle',
		            borderWidth: 0
		        },
		        series: seosonalTrendArray
		    });
		});
	});
	
	$http.get("/expirartionAnalysis?year=2012").success(function(response){
		console.log(response)
	});
	$http.get("/heatMap?year=2012").success(function(response){
		console.log(response)
	});
	
	
	
});
