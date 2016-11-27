var app = angular.module('myapp', ['ngRoute']);
var map;

app.config(['$routeProvider', function($routeProvider,$locationProvider) {
	$routeProvider.
		when('/home', {
			controller: 'homeController',
			templateUrl : "html/home.html"

		}).
		when('/permits', {
			controller: 'permitsController',
			templateUrl : "html/permits.html"

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

app.controller('homeController', function($scope,$http) {
	
});
app.controller('permitsController', function($scope,$http) {
//	var wizard = $("#questionnaire").steps();
	$scope.questionPrevArray = [];
	$scope.responses = [];
	$scope.selectedOption = "";
	$scope.showComponents = "no";

	$scope.next = function() {
		if($scope.showComponents == "yes"){
			$("#prePermitContainer").hide();
			$("#permitContainer").show();
			$("#permits").html($scope.permits);
			var prevQuestionID = $scope.questionID;
			$scope.questionID = 100;
			$scope.questionPrevArray[$scope.questionID] = prevQuestionID;
		}
		else{
			$("#prePermitContainer").show();
			$("#permitContainer").hide();
			$("#permit").html("");
			var nextQuestionid = $("input[name='option']:checked").attr("next-question");//$("input[name='option']:checked").val();
			var response = $("input[name='option']:checked").val();
			$scope.responses[$scope.questionID] = response;
			
			$http.get("http://ec2-52-53-148-138.us-west-1.compute.amazonaws.com:3000/getquestion?id="+nextQuestionid).success(function(response){
			 	$scope.questionPrevArray[nextQuestionid] = $scope.questionID;
			 	$scope.questionID = nextQuestionid;
			 	$scope.question = response.Question;
			 	$scope.selectedOption = $scope.responses[$scope.questionID];
			 	$scope.options = $.parseJSON(response.Next_question);
			 	console.log($scope.options);
			 	if(typeof $scope.options.ANSWER == "string"){
			 		var options = [];
			 		response.Options = response.Options.split(",");
			 		$(response.Options).each(function(index,option){
			 			console.log("index: "+index+" | option: "+option);
			 			//options[index] = option;
			 		});
			 		$scope.showComponents = "yes";
			 		$scope.permits = $scope.options.ANSWER;
			 		$scope.options = response.Options;
			 		console.log($scope.options);
			 	} 
			});
		}
	};
	
	$scope.previous = function() {
		if($scope.showComponents == "yes")
			$scope.showComponents = "no";
		var prevQuestionid = $scope.questionPrevArray[$scope.questionID];
		$http.get("http://ec2-52-53-148-138.us-west-1.compute.amazonaws.com:3000/getquestion?id="+prevQuestionid).success(function(response){
			
		 	$scope.questionID = prevQuestionid;
		 	$scope.question = response.Question;
		 	$scope.options = $.parseJSON(response.Next_question);
		 	$scope.selectedOption = $scope.responses[$scope.questionID];
		 	console.log("queston: "+$scope.questionID);
		 	console.log($scope.selectedOption);
		 	if(typeof $scope.options.ANSWER == "string"){
		 		$scope.options = $scope.options;

		 	} 
		});
	};
	
	$http.get("http://ec2-52-53-148-138.us-west-1.compute.amazonaws.com:3000/getquestion?id=1").success(function(response){
	 	$scope.questionID = 1;
	 	$scope.questionPrevArray[$scope.questionID] = 0;
	 	$scope.prevQuestionID = 0;
	 	$scope.question = response.Question;
	 	$scope.options = $.parseJSON(response.Next_question);
	 	//$scope.nextQuestion = $.parseJSON(response.Next_question);
	});

	/*var wizard = $("#questionnaire").steps({
	    headerTag: "h3",
	    bodyTag: "section",
	    transitionEffect: "slideLeft",
	    autoFocus: true
	});*/
	// Add step
	/*wizard.steps("add", {
	    title: "HTML code", 
	    content: "<strong>HTML code</strong>"
	}); */
	
	
});

app.controller('analyticsController', function($scope,$http) {
	$scope.quarter = "Q1";

	$scope.years = [2012, 2013, 2014, 2015, 2016, 2017, 2018];

	var permit_desc = [];
	permit_desc["AL"] = "Alteration";
	permit_desc["EQ"] = "Construction Equipment";
	permit_desc["FO"] = "Foundation Work";
	permit_desc["NB"] = "New Building";
	permit_desc["PL"] = "Plumbing";
	permit_desc["DM"] = "Demolition";
	permit_desc["SG"] = "Sign";
	
	$scope.getSeasonalData = function(year) {
		$("#divSeasonalContent").find(".tab1").removeClass("active");
		$("#seasonal_"+year).parent(".tab1").addClass("active");

        $http.get("/seasonalAnalysis?year="+year).success(function(response){
			var seosonalTrendArray = [];
			var permitTypeCountArray = [];
			var permitTypes = [];
			var counts = [];
			
			$(response).each(function(idx,obj){
				if($.inArray(obj.Year, $scope.years) == -1)
					$scope.years.push(obj.Year);
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
				seosonalTrendArray.push({name: permit_desc[permit_type], data: counts})
			});
		
			
			    Highcharts.chart('containerSeasonalAnalytics', {
			         title: {
			            text: '',
			        },
			        subtitle: {
			            text: '',
			        },
			        xAxis: {
			            categories: ['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4'],
			            labels: {
			                events: {
			                    click: function (e) {
			                    	e.stopPropagation();
			                        $scope.quarter = $(e.target).text();
			                        $scope.getDrillDownSeasonalPermits($scope.quarter);
			                    }
			                }
			            }
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
    };
    $scope.getDrillDownSeasonalPermits = function(quarter){
    	alert(quarter);
    	//$("#seasonalBack").show();
    	$('#modalDrillDownSeasonalAnalytics').modal();
    	/*
    	$http.get("/seasonalAnalysis?year="+2012).success(function(response){
			var seosonalTrendArray = [];
			var permitTypeCountArray = [];
			var permitTypes = [];
			var counts = [];
			
			$(response).each(function(idx,obj){
				if($.inArray(obj.Year, $scope.years) == -1)
					$scope.years.push(obj.Year);
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
				seosonalTrendArray.push({name: permit_desc[permit_type], data: counts})
			});
		
			$(function () {
			    Highcharts.chart('containerSeasonalAnalytics', {
			        title: {
			            text: '',
			        },
			        subtitle: {
			            text: '',
			        },
			        xAxis: {
			            categories: ['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4'],
			            labels: {
			                events: {
			                    click: function (e) {
			                        $scope.getDrillDownSeasonalPermits($(e.target).text());
			                    }
			                }
			            }
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
		});	*/
    };

	
	$scope.getSeasonalData($scope.years[0]);
	$("#divSeasonalContent").find(".tab1:first").addClass("active");
	/*$scope.getExpirartionAnalysisData($scope.years[0]);
	$("#divExpiryContent").find(".tab1:first").addClass("active");
	$scope.getPopularPermitsData($scope.years[0]);
	$("#divPopularContent").find(".tab1:first").addClass("active");
	$scope.getHeatMapData($scope.years[0]);
	$("#divLocationContent").find(".tab1:first").addClass("active");
	$scope.initMap();
	$scope.initHeatMap();*/
});