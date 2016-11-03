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
		            text: 'Source: New York Open Data',
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
		var expirationTrendArray = [];
		var permitTypeCountArray = [];
		var permitTypes = [];
		var counts = [];
		$(response).each(function(idx,obj){
			if(typeof permitTypeCountArray[obj.Permit_Type] == "undefined" || typeof permitTypeCountArray[obj.Permit_Type] == null){
				permitTypeCountArray[obj.Permit_Type] = {};
				permitTypes.push(obj.Permit_Type);
			}
			permitTypeCountArray[obj.Permit_Type][parseInt(obj.Quarter)-1] = obj.Count;
		});

		$(permitTypes).each(function(idx,permit_type){
			counts = [];
			for(var i=0; i<4; i++){
				counts.push(permitTypeCountArray[permit_type][i]);
			}
			expirationTrendArray.push({name: permit_type, data: counts})
		});
		
		$(function () {
		    Highcharts.chart('containerExpirationAnalytics', {
		        title: {
		            text: 'Permit Expiration Analysis',
		            x: -20 //center
		        },
		        subtitle: {
		            text: 'Source: New York Open Data',
		            x: -20
		        },
		        xAxis: {
		            categories: ['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4']
		        },
		        yAxis: {
		            title: {
		                text: 'Total Number of Permits'
		            },
		        },
		        legend: {
		            layout: 'vertical',
		            align: 'right',
		            verticalAlign: 'middle',
		            borderWidth: 0
		        },
		        series: expirationTrendArray
		    });
		});
	});
	

	$http.get("/heatMap?year=2012").success(function(response){
		console.log(response);
		var zipObj = {};
		var zipArray = [];
		/*$(response).each(function(index,obj){
			if(typeof zipObj[obj.zipcode] == "undefined" || typeof zipObj[obj.zipcode] == null){
				zipObj[obj.zipcode] = {};
				zipObj[obj.zipcode][obj.Permit_Type] = {}; 
				zipObj[obj.zipcode][obj.Permit_Type]["count"] = obj.permit_count;
			}
			else{
				if(obj.zipcode != "undefined" && obj.zipcode != null && obj.zipcode != ""){
					if(typeof zipObj[obj.zipcode][obj.Permit_Type] == "undefined" || typeof zipObj[obj.Permit_Type][obj.Permit_Type] == null){
						zipObj[obj.zipcode][obj.Permit_Type] = {}; 
						zipObj[obj.zipcode][obj.Permit_Type]["count"] = obj.permit_count;
					}
					else{
						zipObj[obj.zipcode][obj.Permit_Type]["count"] = obj.permit_count;
					}	
				}
			}
		});*/
		$(response).each(function(index,obj){
			if(typeof zipObj[obj.BOROUGH] == "undefined" || typeof zipObj[obj.BOROUGH] == null){
				zipObj[obj.BOROUGH] = {};
				zipObj[obj.BOROUGH][obj.zipcode] = {};
				zipObj[obj.BOROUGH][obj.zipcode][obj.Permit_Type] = {}; 
				zipObj[obj.BOROUGH][obj.zipcode][obj.Permit_Type]["count"] = obj.permit_count;
			}
			else{
				if(obj.BOROUGH != "undefined" && obj.BOROUGH != null && obj.BOROUGH != ""){
					if(typeof zipObj[obj.BOROUGH][obj.zipcode] == "undefined" || typeof zipObj[obj.BOROUGH][obj.zipcode] == null){
						zipObj[obj.BOROUGH][obj.zipcode] = {};
						zipObj[obj.BOROUGH][obj.zipcode][obj.Permit_Type] = {}; 
						zipObj[obj.BOROUGH][obj.zipcode][obj.Permit_Type]["count"] = obj.permit_count;
					}
					else{
						if(obj.zipcode != "undefined" && obj.zipcode != null && obj.zipcode != ""){
							if(typeof zipObj[obj.BOROUGH][obj.zipcode][obj.Permit_Type] == "undefined" || typeof zipObj[obj.BOROUGH][obj.zipcode][obj.Permit_Type] == null){
								zipObj[obj.BOROUGH][obj.zipcode][obj.Permit_Type] = {}; 
								zipObj[obj.BOROUGH][obj.zipcode][obj.Permit_Type]["count"] = obj.permit_count;
							}
							else{
								zipObj[obj.BOROUGH][obj.zipcode][obj.Permit_Type]["count"] = obj.permit_count;
							}	
						}
					}
				}
			}
		});
		
		var points = [],
        regionP,
        regionVal,
        regionI = 0,
        countryP,
        countryI,
        causeP,
        causeI
        var data2 = zipObj;
   
    for (BOROUGH in data2) {
        if (data2.hasOwnProperty(BOROUGH)) {
            regionVal = 0;
            regionP = {
                id: 'id_' + regionI,
                name: BOROUGH,
                color: Highcharts.getOptions().colors[regionI]
            };
            countryI = 0;
            for (zipcode in data2[BOROUGH]) {
                if (data2[BOROUGH].hasOwnProperty(zipcode)) {
                    countryP = {
                        id: regionP.id + '_' + countryI,
                        name: zipcode,
                        parent: regionP.id
                    };
                    points.push(countryP);
                    causeI = 0;
                    for (permit in data2[BOROUGH][zipcode]) {
                        if (data2[BOROUGH][zipcode].hasOwnProperty(permit)) {
                            causeP = {
                                id: countryP.id + '_' + causeI,
                                name: permit,
                                parent: countryP.id,
                                value: Math.round(+data2[BOROUGH][zipcode][permit]["count"])
                            };
                            regionVal += causeP.value;
                            points.push(causeP);
                            causeI = causeI + 1;
                        }
                    }
                    countryI = countryI + 1;
                }
            }
            regionP.value = Math.round(regionVal / countryI);
            points.push(regionP);
            regionI = regionI + 1;
        }
    }
    
    Highcharts.chart('containerlocationWiseAnalytics', {
        series: [{
            type: 'treemap',
            layoutAlgorithm: 'squarified',
            allowDrillToNode: true,
            animationLimit: 1000,
            dataLabels: {
                enabled: false
            },
            levelIsConstant: false,
            levels: [{
                level: 1,
                dataLabels: {
                    enabled: true
                },
                borderWidth: 3
            }],
            data: points
        }],

        colorAxis: {
        	stops: [
	            [0, '#FFF'],
	            [1000, '#CCC'],
	            [2000, '#000']
	        ],
	        minColor: '#FFFFFF',
            maxColor: '#000000'
	        min: 0
        	/*
            min: 0,
            minColor: '#FFFFFF',
            maxColor: Highcharts.getOptions().colors[0]*/
        },
        subtitle: {
            text: 'Click points to drill down. Source: New York Open Data.'
        },
        title: {
            text: 'Area wise permits 2012-2016'
        }
    });
	});
	
	
	
});
