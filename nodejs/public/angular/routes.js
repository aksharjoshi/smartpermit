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
		console.log(permitTypeCountArray);

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
		        series: expirationTrendArray
		    });
		});
	});
	

	$http.get("/heatMap?year=2012").success(function(response){
		console.log(response);
		var zipObj = {};
		$(response).each(function(index,obj){
			console
			zipObj[obj.Zipcode] = obj.Zipcode;
		});
		console.log(zipObj);
		var data = {
            'South-East Asia': {
                'Sri Lanka': {
                    'Communicable & other Group I': '75.5',
                    'Injuries': '89.0',
                    'Noncommunicable diseases': '501.2'
                },
                'Bangladesh': {
                    'Noncommunicable diseases': '548.9',
                    'Injuries': '64.0',
                    'Communicable & other Group I': '234.6'
                },
                'Myanmar': {
                    'Communicable & other Group I': '316.4',
                    'Injuries': '102.0',
                    'Noncommunicable diseases': '708.7'
                },
                'Maldives': {
                    'Injuries': '35.0',
                    'Noncommunicable diseases': '487.2',
                    'Communicable & other Group I': '59.2'
                },
                'India': {
                    'Communicable & other Group I': '253.0',
                    'Injuries': '115.9',
                    'Noncommunicable diseases': '682.3'
                }
            },
            'Europe': {
                'Hungary': {
                    'Communicable & other Group I': '16.8',
                    'Noncommunicable diseases': '602.8',
                    'Injuries': '44.3'
                },
                'Poland': {
                    'Communicable & other Group I': '22.6',
                    'Noncommunicable diseases': '494.5',
                    'Injuries': '48.9'
                },
                'Israel': {
                    'Communicable & other Group I': '31.2',
                    'Noncommunicable diseases': '311.2',
                    'Injuries': '20.8'
                },
                'France': {
                    'Communicable & other Group I': '21.4',
                    'Noncommunicable diseases': '313.2',
                    'Injuries': '34.6'
                },
                'Finland': {
                    'Noncommunicable diseases': '366.6',
                    'Injuries': '38.7',
                    'Communicable & other Group I': '9.0'
                },
                'United Kingdom of Great Britain and Northern Ireland': {
                    'Communicable & other Group I': '28.5',
                    'Injuries': '21.5',
                    'Noncommunicable diseases': '358.8'
                },
                'Czech Republic': {
                    'Injuries': '39.1',
                    'Noncommunicable diseases': '460.7',
                    'Communicable & other Group I': '27.0'
                }
            },
            'Africa': {
                'Equatorial Guinea': {
                    'Communicable & other Group I': '756.8',
                    'Injuries': '133.6',
                    'Noncommunicable diseases': '729.0'
                },
                'Madagascar': {
                    'Noncommunicable diseases': '648.6',
                    'Communicable & other Group I': '429.9',
                    'Injuries': '89.0'
                },
                'Swaziland': {
                    'Communicable & other Group I': '884.3',
                    'Injuries': '119.5',
                    'Noncommunicable diseases': '702.4'
                },
                'Congo': {
                    'Noncommunicable diseases': '632.3',
                    'Communicable & other Group I': '666.9',
                    'Injuries': '89.0'
                },
                'Zimbabwe': {
                    'Communicable & other Group I': '711.3',
                    'Injuries': '82.5',
                    'Noncommunicable diseases': '598.9'
                },
                'Rwanda': {
                    'Noncommunicable diseases': '585.3',
                    'Injuries': '106.3',
                    'Communicable & other Group I': '401.7'
                },
                'Zambia': {
                    'Noncommunicable diseases': '587.4',
                    'Injuries': '156.4',
                    'Communicable & other Group I': '764.3'
                },
                'Algeria': {
                    'Noncommunicable diseases': '710.4',
                    'Injuries': '53.8',
                    'Communicable & other Group I': '97.8'
                }
            },
            'Americas': {
                'Canada': {
                    'Noncommunicable diseases': '318.0',
                    'Injuries': '31.3',
                    'Communicable & other Group I': '22.6'
                },
                'Bahamas': {
                    'Noncommunicable diseases': '465.2',
                    'Injuries': '45.7',
                    'Communicable & other Group I': '122.0'
                },
                'Guyana': {
                    'Communicable & other Group I': '177.2',
                    'Noncommunicable diseases': '1024.2',
                    'Injuries': '150.0'
                },
                'United States of America': {
                    'Noncommunicable diseases': '412.8',
                    'Injuries': '44.2',
                    'Communicable & other Group I': '31.3'
                },
                'Guatemala': {
                    'Communicable & other Group I': '212.7',
                    'Noncommunicable diseases': '409.4',
                    'Injuries': '111.0'
                }
            },
            'Eastern Mediterranean': {
                'Egypt': {
                    'Communicable & other Group I': '74.3',
                    'Noncommunicable diseases': '781.7',
                    'Injuries': '33.5'
                },
                'Oman': {
                    'Injuries': '52.8',
                    'Noncommunicable diseases': '478.2',
                    'Communicable & other Group I': '84.2'
                },
                'Tunisia': {
                    'Noncommunicable diseases': '509.3',
                    'Communicable & other Group I': '65.0',
                    'Injuries': '39.1'
                }
            },
            'Western Pacific': {
                'Mongolia': {
                    'Injuries': '69.4',
                    'Noncommunicable diseases': '966.5',
                    'Communicable & other Group I': '82.8'
                },
                'Cambodia': {
                    'Injuries': '62.2',
                    'Communicable & other Group I': '227.5',
                    'Noncommunicable diseases': '394.0'
                },
                'Singapore': {
                    'Communicable & other Group I': '66.2',
                    'Noncommunicable diseases': '264.8',
                    'Injuries': '17.5'
                },
                'Republic of Korea': {
                    'Injuries': '53.1',
                    'Communicable & other Group I': '33.8',
                    'Noncommunicable diseases': '302.1'
                }
            }
        },
        points = [],
        regionP,
        regionVal,
        regionI = 0,
        countryP,
        countryI,
        causeP,
        causeI,
        region,
        country,
        cause,
        causeName = {
            'Communicable & other Group I': 'Communicable diseases',
            'Noncommunicable diseases': 'Non-communicable diseases',
            'Injuries': 'Injuries'
        };

    for (region in data) {
        if (data.hasOwnProperty(region)) {
            regionVal = 0;
            regionP = {
                id: 'id_' + regionI,
                name: region,
                color: Highcharts.getOptions().colors[regionI]
            };
            countryI = 0;
            for (country in data[region]) {
                if (data[region].hasOwnProperty(country)) {
                    countryP = {
                        id: regionP.id + '_' + countryI,
                        name: country,
                        parent: regionP.id
                    };
                    points.push(countryP);
                    causeI = 0;
                    for (cause in data[region][country]) {
                        if (data[region][country].hasOwnProperty(cause)) {
                            causeP = {
                                id: countryP.id + '_' + causeI,
                                name: causeName[cause],
                                parent: countryP.id,
                                value: Math.round(+data[region][country][cause])
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
    console.log(JSON.stringify(points));
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
        subtitle: {
            text: 'Click points to drill down. Source: <a href="http://apps.who.int/gho/data/node.main.12?lang=en">WHO</a>.'
        },
        title: {
            text: 'Global Mortality Rate 2012, per 100 000 population'
        }
    });
	});
	
	
	
});
