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
	
	//$scope.CommunityListObj = {};
	
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
			console.log(permitTypeCountArray[permit_type]);
			$(permitTypeCountArray[permit_type]).each(function(key,count){
				console.log("key: "+key);
				console.log(count[key]);
				counts.push(count[key]);
			});
			console.log(counts);
			seosonalTrendArray.push({name: permit_type, data: counts})
		});
		var series = [{
		            name: 'PM',
		            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
		        }, {
		            name: 'New York',
		            data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
		        }, {
		            name: 'Berlin',
		            data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
		        }, {
		            name: 'London',
		            data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
		        }];
		console.log(series);
		console.log(seosonalTrendArray);
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
		                text: 'Temperature (°C)'
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
	
	
});
