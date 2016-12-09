var app = angular.module('myapp', ['ngRoute','ui.bootstrap']);
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
		when('/register', {
			controller: 'registerController',
			templateUrl : "html/register.html"
		}).
		when('/recommendation', {
			controller: 'recommendationController',
			templateUrl : "html/recommendation.html"
		}).
        otherwise({
          redirectTo: '/home',
        });
        //$locationProvider.html5Mode(true);
    }
]);



app.controller('logoutController',function($scope,$http){
	if (confirm("Are you sure you want to logout?")== true) {
	     $http.get("/logout").success(function(response){
	     	if(response.msg == "Success")
	     		window.location = '/';
	     	else
	     		return false;
	     });
	} else {
	    return false;
	}
	
});


app.controller('homeController', function($scope,$http) {
});

app.controller('recommendationController', function($scope,$http) {
	
	
	$http.get("/getJobType").success(function(response){
		$scope.job_types = [];
		var len = response.length;
		console.log(len);
		$(response).each(function(key,obj){
			console.log("key: "+key);
			console.log(obj);
			$scope.job_types.push({"acronym":obj.ACRONYM, "description": obj.DESCRIPTION});
			if(key == len-1){
				$("#select_job_type option:first").remove();
				setTimeout(function(){ $("#select_job_type").trigger("change"); }, 100);
			}
		});
	});
	
	$scope.getPermitType = function(job_type){
		$scope.permit_types = [];
		$http.get("/getPermitType?job_type="+job_type).success(function(response){
			var len = response.length;
			$("#containerPermitType").show();
			$(response).each(function(key,obj){
				$scope.permit_types.push({"acronym":obj.ACRONYM, "description": obj.DESCRIPTION});
				if(key == len-1){
					console.log($("#select_permit_type option:first"));
					$("#select_permit_type option:first").remove();
					console.log($("#select_permit_type option:first"));
					setTimeout(function(){ $("#select_permit_type").trigger("change"); }, 100);
				}
			});
		});
	};
	$scope.getPermitSubType = function(permit_type){
		$scope.permit_subtypes = [];
		$http.get("/getPermitSubType?job_type="+$("#select_job_type").val()+"&permit_type="+permit_type).success(function(response){
			var len = response.length;
			$("#containerPermitSubType").show();
			$(response).each(function(key,obj){
				$scope.permit_subtypes.push({"acronym":obj.ACRONYM, "description": obj.DESCRIPTION});
				if(key == len-1){
					$("#select_permit_subtype option:first").remove();
					setTimeout(function(){ $("#select_permit_subtype").trigger("change"); }, 100);
				}
			});
			
		});
	};
/*
	
	$http.get("/getPermitSubType").success(function(response){
		$(response).each(function(key,obj){
			$scope.permit_subtypes.push(obj.PERMIT_SUBTYPE);
		});
		console.log($scope.permit_subtypes);
		
		$("#select_permit_type option:first").remove();
		$("#select_permit_subtype option:first").remove();
	});

*/
	
	$scope.getRecommendations = function(){
		var jobType = $("#select_job_type").val();
		var permitType = $("#select_permit_type").val();
		var permitSubtype = $("#select_permit_subtype").val();
		console.log(permitSubtype);
		
		var getRecommendatinURL = "/getRecommendation?job_type="+jobType+"&permit_type="+permitType;
		if(permitSubtype != "" && permitSubtype != "undefined" && permitSubtype != null)
			getRecommendatinURL = getRecommendatinURL+"&permit_subtype="+permitSubtype;

		$http.get(getRecommendatinURL).success(function(res){
			var data = eval(res);
			$scope.recommendations = data;
		});
	};
			
});

app.controller('permitsController', function($scope,$http) {
//	var wizard = $("#questionnaire").steps();
	$scope.questionPrevArray = [];
	$scope.responses = [];
	$scope.selectedOption = "";
	$scope.showComponents = "no";
	$scope.XQuestion = [];
	$scope.finalAnswer = false;
	$scope.calculatedPermits = [];
	$scope.outputPermits = {};
	$("[data-toggle=popover]").popover();

	$scope.icons = {
		"NEW" : "glyphicons-619-mixed-buildings.png",
		"REMODELING" : "glyphicons-281-settings.png",
		"COMMERCIAL" : "glyphicons-620-industrial-zone.png",
		"RESIDENTIAL" : "glyphicons-21-home.png",
		"EXISTING" : "glyphicons-21-home.png",
		"OFFICE" : "glyphicons-90-building.png",
		"RESIDENTIAL" : "glyphicons-21-home.png",
		"OTHERS" : "glyphicons-630-engineering-networks.png",
		"LIVINGROOM" : "glyphicons-87-display.png",
		"HALL" : "glyphicons-87-display.png",
		"BEDROOM" : "glyphicons-628-bedroom-lamp.png",
		"KITCHEN" : "glyphicons-277-cutlery.png",
		"BATHROOM" : "glyphicons-514-bath-bathtub.png",
		"BASEMENT" : "glyphicons-681-door.png",
		"STAIRS" : "glyphicons-431-construction-cone.png",
		"BACKYARD" : "glyphicons-614-park.png",
		"PATIO" : "glyphicons-686-sunbath.png",
		"CURB/FENCE" : "glyphicons-27-road.png",
		"OTHER" : "glyphicons-195-question-sign.png",
		"YES" : "glyphicons-207-ok.png",
		"NO" : "glyphicons-208-remove.png",
		"ADDITION/INSTALLATION" : "glyphicons-433-plus.png",
		"ALL" : "glyphicons-194-ok-sign.png",
		"DEMOLITIONOFANYWALL" : "glyphicons-314-ax.png",
		"RELOCATION" : "glyphicons-435-redo.png",
		"REPAIRING/STYLINGOFFIXTURES" : "glyphicons-440-wrench.png",
		"SHOWER" : "glyphicons-516-shower.png",
		"BATHTUB" : "glyphicons-514-bath-bathtub.png",
		"LIGHTING/SWITCHING" : "glyphicons-65-lightbulb.png",
		"VENT" : "glyphicons-22-snowflake.png",
		"WINDOW" : "glyphicons-95-vector-path-square.png",
		"FAUCET" : "glyphicons-515-bath-shower.png",
		"NONE" : "glyphicons-200-ban-circle.png",
		"COMPONENT" : "glyphicons-453-shop.png",
		"SUBCOMPONENT" : "glyphicons-514-bath-bathtub.png",
		"SPRINKLER" : "glyphicons-232-sun.png",
		"SINK" : "glyphicons-718-waste-pipe.png",
		"LIGHTING/SWITCHES" : "glyphicons-65-lightbulb.png",

	};
	
    var tempPerm = [];
	$scope.next = function() {
		if($scope.showComponents == "yes"){
			if($("input[name='option']:checked").val() == "5" || $("input[name='option']:checked").val() == 5){
				$scope.showComponents = "no";
				
				$http.get("/getquestion?id=5").success(function(response){
					$scope.RESPONSE = response;
				 	$scope.questionID = 1;
				 	$scope.questionPrevArray[$scope.questionID] = 0;
				 	$scope.prevQuestionID = 0;
				 	$scope.question = response.Question;
				 	$scope.options = $.parseJSON(response.Next_question);
				 	$scope.answer_type = response.Answer_type;

				 	setTimeout(function(){ 
				 		$(".imgIcon").each(function(index,imgObj){
					 		var icon = $(imgObj).attr("data");
					 		icon = icon.replace(/\s/g, '');
					 		console.log(icon);
					 		console.log($scope.icons[icon]);
					 		if($scope.icons[icon] != "undefined")
					 			imgObj.src = "/images/glyphicons_free/glyphicons/png/"+$scope.icons[icon];
					 	});
				 	}, 100);
				});
				return false;
			}

			if($scope.finalAnswer){
				$("#prePermitContainer").hide();
				$("#nopermits").hide();
				$("#permitContainer").show();
				$("#permits").html($scope.calculatedPermits);

				/*$http.post('/getDescription', {"permits": $scope.calculatedPermits})
				.success(function(data, status, headers, config) {
					
				});*/
				
				var prevQuestionID = $scope.questionID;
				$scope.questionID = 100;
				$scope.questionPrevArray[$scope.questionID] = prevQuestionID;
			}
			else{
				$("input[name='option']:checked").each(function(key,obj){
					var tempPermits = JSON.parse($(obj).val());
					var product = $(obj).parent("label").text().replace(/\s/g, '');
					
					$scope.outputPermits[product] =  tempPermits;
					console.log($scope.outputPermits);

				});
				
				$http.get("/checkNextQuestions").success(function(response){
					console.log(">>>>>>>>>>>>>>> CHECK NEXT QUESTION >>>>>>>>>>>>>");
					if(response.msg == "Success"){
						$scope.showComponents = "no";
						$scope.RESPONSE = response.data;
						$scope.question = response.data.Question;
						if((response.data.Next_question).indexOf("ANSWER") >= 0){
							$scope.question = response.data.Question;
							$scope.options = (($.parseJSON(response.data.Next_question)).ANSWER);
							
							$scope.answer_type = response.data.Answer_type;
							$scope.showComponents = "yes";
						}
						else
							$scope.options = $.parseJSON(response.data.Next_question);
						$scope.answer_type = response.data.Answer_type;
						$scope.XQuestion.push(response.previous_answer);	
					}
					else{
						$scope.finalAnswer = true;
						$scope.showComponents = "yes";
						$("#prePermitContainer").hide();
						$("#permitContainer").show();

						$http.post('/postRecommendation', {"permits": $scope.outputPermits})
						.success(function(response, status, headers, config) {
							$scope.postPermitRecommendations = JSON.parse(response.data);
							$('.slider1').show();
							//var html = $("#postPermitRecommendation").html();
							//$('.slider1').html(html);
							setTimeout(function(){ 
						 		$('.slider1').bxSlider({
								    slideWidth: 500,
								    minSlides: 2,
								    maxSlides: 3,
								    slideMargin: 10
								});
						 	}, 100);
						});
					{
						/*$http.post('/getDescription', {"permits": $scope.calculatedPermits})
						.success(function(data, status, headers, config) {
							//$("#permits").html($scope.outputPermits);
							acronymArray = [];
							$(data.data).each(function(a,acronymObj){
								acronymArray[acronymObj.ACRONYM] = acronymObj.DESCRIPTION;
							});

							console.log(acronymArray);

							var xproducts = [];
							var temp = [];
							$($scope.outputPermits).each(function(i,iproduct){
								if($.inArray( iproduct.product, xproducts ) == -1){
									xproducts.push(iproduct.product);
									tempPermitsArray = iproduct.permits.split(",");
									for(var j=0;j<tempPermitsArray.length;j++){
										tempPermitsArray[j] = acronymArray[tempPermitsArray[j]];
									}
									
									temp.push({"product":iproduct.product,"permits":tempPermitsArray.join(",")});
								}
							});
							console.log(jQuery.unique($scope.outputPermits));
							$scope.outputPermits = temp;
						});*/

					}
					}
				});

			}
			setTimeout(function(){ 
				 		$(".imgIcon").each(function(index,imgObj){
					 		var icon = $(imgObj).attr("data");
					 		icon = icon.replace(/\s/g, '');
					 		if($scope.icons[icon] != "undefined"){
					 			console.log("/images/glyphicons_free/glyphicons/png/"+$scope.icons[icon]);
					 			imgObj.src = "/images/glyphicons_free/glyphicons/png/"+$scope.icons[icon];
					 		}
					 	});
				 	}, 100);
		}
		else{
			$("#prePermitContainer").show();
			$("#permitContainer").hide();
			$("#permit").html("");
			$("#nopermits").hide();
			
			if($scope.answer_type == "MULTIPLE"){
				var nextQuestionid = $("input[name='option']:checked:first").attr("next-question");//$("input[name='option']:checked").val();
				$scope.XQuestion.push($("input[name='option']:checked:first").val());
				console.log($scope.XQuestion);
				var saveQuestions = [];
				var respQuestion = $.parseJSON($scope.RESPONSE.Next_question);
				console.log($("input[name='option']:checked"));
				$("input[name='option']:checked").each(function(key,obj){
					if(key>0){
						var passObj = {"answer":$(obj).val(), "next_question_id": respQuestion[$(obj).val()]}
						saveQuestions.push(passObj);
					}
				});
				
				$http.post('/saveQuestion', {"saveQuestions": saveQuestions})
				.success(function(data, status, headers, config) {
					//obj.sensordetail.status=sensorstatus;
					saveQuestions = []; // Added on monday dec 5, 2016
				});
			}
			else
				var nextQuestionid = $("input[name='option']:checked").attr("next-question");

			if(nextQuestionid == "-1" || nextQuestionid == -1){
				$("#nopermits").show();
				$("#prePermitContainer").hide();
				$("#permitContainer").hide();
				$("#permit").html("");
				return false;
			}

			var response = $("input[name='option']:checked").val();
			$scope.responses[$scope.questionID] = response;

			if(nextQuestionid != null && nextQuestionid != "undefined" && nextQuestionid != "" ){
				$http.get("/getquestion?id="+nextQuestionid).success(function(response){
					$scope.RESPONSE = response;
				 	$scope.questionPrevArray[nextQuestionid] = $scope.questionID;
				 	$scope.questionID = nextQuestionid;
				 	$scope.question = response.Question;
				 	$scope.selectedOption = $scope.responses[$scope.questionID];
				 	
				 	

				 	if((response.Next_question).indexOf("ANSWER") >= 0){
				 		$scope.showComponents = "yes";
				 		$scope.options = (($.parseJSON(response.Next_question)).ANSWER);
				 		$scope.answer_type = response.Answer_type;
				 		/*
				 		$($scope.XQuestion).each(function(idx,opt){
				 			if(typeof (($.parseJSON(response.Next_question)).ANSWER)[opt] == "object"){
							 	$scope.question = response.Question;
							 	$scope.options = (($.parseJSON(response.Next_question)).ANSWER)[opt];
							 	console.log(options);
							 	$scope.answer_type = response.Answer_type;
							 	$scope.showComponents = "yes";
				 			}
							//var index = $scope.XQuestion.indexOf(opt);
							//$scope.XQuestion.splice(idx, 1);
							$scope.XQuestion[idx] = "";
				 		});*/
				 	}
				 	else{
				 		$scope.options = $.parseJSON(response.Next_question);
				 	}
				 	
				 	$scope.answer_type = response.Answer_type;
				 	if((response.Options).indexOf("COMPONENT") >= 0){
					 	//$("#containerComponent").show();
					 	
					 	setTimeout(function(){ 
				 			//$(".placeholders").children(":first").css("margin-left","11%");
					 		//$(".placeholders").children(":last").css("margin-left","25%");
					 		$(".popup").show();
				 		}, 100);
					}
					else
					 	$(".popup").hide();//$("#containerComponent").hide();
				 	if(typeof $scope.options.ANSWER == "string"){
				 		var options = [];
				 		response.Options = response.Options.split(",");
				 		$(response.Options).each(function(index,option){
				 			//console.log("index: "+index+" | option: "+option);
				 			//options[index] = option;
				 		});
				 		$scope.showComponents = "yes";
				 		$scope.permits = $scope.options.ANSWER;
				 		$scope.options = response.Options;
				 		//console.log($scope.options);
				 	} 
				 	setTimeout(function(){ 
				 		$(".imgIcon").each(function(index,imgObj){
					 		var icon = $(imgObj).attr("data");
					 		icon = icon.replace(/\s/g, '');
					 		if($scope.icons[icon] != "undefined"){
					 			console.log("/images/glyphicons_free/glyphicons/png/"+$scope.icons[icon]);
					 			imgObj.src = "/images/glyphicons_free/glyphicons/png/"+$scope.icons[icon];
					 		}
					 	});
				 	}, 100);
				});
			}
			else{
				alert("Select atleast one option.");
			}
		}
	};
	
	$scope.previous = function() {
		if($scope.showComponents == "yes")
			$scope.showComponents = "no";
		var prevQuestionid = $scope.questionPrevArray[$scope.questionID];

		if(prevQuestionid != null && prevQuestionid != "undefined" && prevQuestionid != "" ){
			$http.get("/getquestion?id="+prevQuestionid).success(function(response){
				$scope.RESPONSE = response;
			 	$scope.questionID = prevQuestionid;
			 	$scope.question = response.Question;
			 	$scope.options = $.parseJSON(response.Next_question);
			 	$scope.selectedOption = $scope.responses[$scope.questionID];
			 	$scope.answer_type = response.Answer_type;

			 	if((response.Options).indexOf("COMPONENT") >= 0){
				 		//$("#containerComponent").show();
				 		setTimeout(function(){ 
				 			//$(".placeholders").children(":first").css("margin-left","11%");
					 		//$(".placeholders").children(":last").css("margin-left","25%");
					 		$(".popup").show();
				 		}, 100);
				}
				else
				 		$(".popup").hide();//$("#containerComponent").hide();
			 	if(typeof $scope.options.ANSWER == "string"){
			 		$scope.options = $scope.options;

			 	}
			 	setTimeout(function(){ 
			 		$(".imgIcon").each(function(index,imgObj){
				 		var icon = $(imgObj).attr("data");
				 		icon = icon.replace(/\s/g, '');
				 		console.log(icon)
				 		console.log($scope.icons[icon]);
				 		if($scope.icons[icon] != "undefined")
				 			imgObj.src = "/images/glyphicons_free/glyphicons/png/"+$scope.icons[icon];
				 	});
			 	}, 100);
			});
		}
	};
	
	$scope.selectWizard = function(){
		$(".select").removeClass("select");
		$("input[type=radio]:checked").parent("label").parent(".wizard-box").addClass("select");
	};
	$scope.multiSelectelectWizard = function(){
		$( "input[type=checkbox]:not(:checked)").parent("label").parent(".wizard-box").removeClass("select");
		$("input[type=checkbox]:checked").parent("label").parent(".wizard-box").addClass("select");
	};
	$scope.restart = function(){
		$http.get("/startOver").success(function(response){
			if(response.msg == "Success"){
				location.reload();
				/*$(".select").removeClass("select");
				$("input[type=checkbox]:checked").attr("checked", false);
				$("input[type=radio]:checked").attr("checked", false);

				$("#nopermits").hide();
				$("#permitContainer").hide();
				$("#permit").html("");
				$("#prePermitContainer").show();

				$http.get("/getquestion?id=1").success(function(response){
					$scope.RESPONSE = response;
				 	$scope.questionID = 1;
				 	$scope.questionPrevArray[$scope.questionID] = 0;
				 	$scope.prevQuestionID = 0;
				 	$scope.question = response.Question;
				 	$scope.options = $.parseJSON(response.Next_question);
				 	$scope.answer_type = response.Answer_type;

				 	setTimeout(function(){ 
				 		$(".imgIcon").each(function(index,imgObj){
					 		var icon = $(imgObj).attr("data");
					 		icon = icon.replace(/\s/g, '');
					 		console.log(icon);
					 		console.log($scope.icons[icon]);
					 		if($scope.icons[icon] != "undefined")
					 			imgObj.src = "/images/glyphicons_free/glyphicons/png/"+$scope.icons[icon];
					 	});
				 	}, 100);
				});*/
			}
		});	

	};

	$http.get("/getquestion?id=1").success(function(response){
		$scope.RESPONSE = response;
		console.log(response);
	 	$scope.questionID = 1;
	 	$scope.questionPrevArray[$scope.questionID] = 0;
	 	$scope.prevQuestionID = 0;
	 	$scope.question = response.Question;
	 	$scope.options = $.parseJSON(response.Next_question);
	 	$scope.answer_type = response.Answer_type;

	 	if((response.Options).indexOf("COMPONENT") >= 0){
		 	//$("#containerComponent").show();
		 	setTimeout(function(){ 
			 	//$(".placeholders").children(":first").css("margin-left","11%");
				//$(".placeholders").children(":last").css("margin-left","25%");
				$(".popup").show();
			}, 100);
	 	}
		else
		 	$(".popup").hide();//$("#containerComponent").hide();

	 	setTimeout(function(){ 
	 		$(".imgIcon").each(function(index,imgObj){
		 		var icon = $(imgObj).attr("data");
		 		icon = icon.replace(/\s/g, '');
		 		console.log(icon);
		 		console.log($scope.icons[icon]);
		 		if($scope.icons[icon] != "undefined")
		 			imgObj.src = "/images/glyphicons_free/glyphicons/png/"+$scope.icons[icon];
		 	});
	 	}, 100);
	 	
		 	//./images/glyphicons_free/glyphicons/png/{{}}
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

	

	$scope.popover = function(e) {
		target = (e.option).replace(/\s/g, '');
		$(".popover").hide();
		$("#pop"+target).show();
	};
	$scope.dismissPop = function() {
		$(".popover").hide();
	};
	
	
});

app.controller('analyticsController', function($scope,$http) {

	$('#myTabs a').click(function (e) {
	  e.preventDefault()
	  $(this).tab('show')
	});

	$scope.quarter = "Q1";

	$scope.years = [2010, 2011, 2012];

	var permit_desc = [];
	permit_desc["AL"] = "Alteration";
	permit_desc["EQ"] = "Construction Equipment";
	permit_desc["FO"] = "Foundation Work";
	permit_desc["NB"] = "New Building";
	permit_desc["PL"] = "Plumbing";
	permit_desc["DM"] = "Demolition";
	permit_desc["SG"] = "Sign";
	permit_desc["OT"] = "Others";
	permit_desc["EW"] = "Equipment Work";
	
	$scope.getSeasonalData = function(year) {
		$("#divSeasonalContent").find(".tab1").removeClass("active");
		$("#seasonal_"+year).parent(".tab1").addClass("active");

        $http.get("/seasonalAnalysis?year="+year).success(function(response){
			var seasonalTrendArray = [];
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
				seasonalTrendArray.push({name: permit_desc[permit_type], data: counts})
			});
		
			console.log(seasonalTrendArray);
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
			        series: seasonalTrendArray
			    });
			    console.log(2);
			
		});		
    };

    $scope.getDrillDownSeasonalPermits = function(quarter){    	
    	
    	$http.get("/seasonalAnalysis?year="+2012+"&quarter="+$scope.quarter.slice(-1)).success(function(response){
    		$('#modalDrillDownSeasonalAnalytics').modal();
    		$("#quarter").html($scope.quarter);
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
				permitTypeCountArray[obj.Permit_Type][parseInt(obj.Month)] = obj.Count;
			});
console.log(permitTypeCountArray);
			$(permitTypes).each(function(idx,permit_type){
				counts = [];
				for(var i=1; i<=12; i++){
					if(typeof permitTypeCountArray[permit_type][i] == "undefined")
						counts.push(0);
					else
						counts.push(permitTypeCountArray[permit_type][i]);
				}
				seosonalTrendArray.push({name: permit_desc[permit_type], data: counts})
			});
			console.log(seosonalTrendArray);
		
			$(function () {
			    Highcharts.chart('containerDrillDownSeasonalAnalytics', {
			        title: {
			            text: '',
			        },
			        subtitle: {
			            text: '',
			        },
			        xAxis: {
			            categories: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
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
		});	
    };

	$scope.getPopularPermitsData = function(year) {
		$("#divPopularContent").find(".tab1").removeClass("active");
		$("#popular_"+year).parent(".tab1").addClass("active");
		$http.get("/popularPermit?year="+year).success(function(response){
			var permitsArray = [];
			var permitTypes = [];
			var counts = [];
			var mostPopularPermitsArray = [];
			$(response).each(function(idx,obj){
				if(typeof permitsArray[obj.Permit_Type] == "undefined" || typeof permitsArray[obj.Permit_Type] == null){
					permitsArray[obj.Permit_Type] = {};
					permitTypes.push(obj.Permit_Type);
				}
				permitsArray[obj.Permit_Type][parseInt(obj.Quarter)-1] = obj.permit_count;
			});
		
			$(permitTypes).each(function(idx,permit_type){
				counts = [];
				for(var i=0; i<4; i++){
					counts.push(permitsArray[permit_type][i]);
				}
				mostPopularPermitsArray.push({name: permit_desc[permit_type], data: counts})
			});
			Highcharts.chart('containerMostPopularPermitsAnalytics', {

		        chart: {
		            type: 'column'
		        },

		        title: {
		            text: ''
		        },

		        xAxis: {
		            categories: ['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4'],
		            labels: {
			                events: {
			                    click: function (e) {
			                        $scope.getDrillDownPopularPermits($(e.target).text());
			                    }
			                }
			         }
		        },

		        yAxis: {
		            allowDecimals: false,
		            min: 0,
		            title: {
		                text: 'Number of Permits'
		            }
		        },

		        tooltip: {
		            formatter: function () {
		                return '<b>' + this.x + '</b><br/>' +
		                    this.series.name + ': ' + this.y + '<br/>';
		            }
		        },

		        

		        series: mostPopularPermitsArray
		    });
		});
	};

	$scope.getDrillDownPopularPermits = function(quarter){    	
    	
    	$http.get("/popularPermit?year="+2012+"&quarter="+quarter.slice(-1)).success(function(response){
    		$('#modalDrillDownPopularPermits').modal();
    		$("#popular_quarter").html(quarter);
    		var permitsArray = [];
			var permitTypes = [];
			var counts = [];
			var mostPopularPermitsArray = [];
			$(response).each(function(idx,obj){
				if(typeof permitsArray[obj.Permit_Type] == "undefined" || typeof permitsArray[obj.Permit_Type] == null){
					permitsArray[obj.Permit_Type] = {};
					permitTypes.push(obj.Permit_Type);
				}
				permitsArray[obj.Permit_Type][parseInt(obj.Month)] = obj.permit_count;
			});
		
			$(permitTypes).each(function(idx,permit_type){
				counts = [];
				for(var i=1; i<=12; i++){
					if(typeof permitsArray[permit_type][i] == "undefined")
						counts.push(0);
					else
						counts.push(permitsArray[permit_type][i]);
				}
				mostPopularPermitsArray.push({name: permit_desc[permit_type], data: counts})
			});
			Highcharts.chart('containerDrillDownPopularPermits', {

		        chart: {
		            type: 'column'
		        },

		        title: {
		            text: ''
		        },

		        xAxis: {
		            categories: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		        },

		        yAxis: {
		            allowDecimals: false,
		            min: 0,
		            title: {
		                text: 'Number of Permits'
		            }
		        },

		        tooltip: {
		            formatter: function () {
		                return '<b>' + this.x + '</b><br/>' +
		                    this.series.name + ': ' + this.y + '<br/>';
		            }
		        },
		        series: mostPopularPermitsArray
		    });
		});	
    };
	
	$scope.getExpirartionAnalysisData = function(year) {
		$("#divExpiryContent").find(".tab1").removeClass("active");
		$("#expiration_"+year).parent(".tab1").addClass("active");
		$http.get("/expirartionAnalysis?year="+year).success(function(response){
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
				expirationTrendArray.push({name: permit_desc[permit_type], data: counts})
			});
			
			$(function () {
			    Highcharts.chart('containerExpirationAnalytics', {
			        title: {
			            text: '',
			            x: -20 //center
			        },
			        subtitle: {
			            text: 'Source: New York Open Data',
			            x: -20
			        },
			        xAxis: {
			            categories: ['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4'],
			            labels: {
			                events: {
			                    click: function (e) {
			                        $scope.getDrillDownExpirationAnalysis($(e.target).text());
			                    }
			                }
			         	}
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
	};

	$scope.getDrillDownExpirationAnalysis = function(quarter){    	
    	$('#modalDrillDownExpiration').modal();
		$http.get("/expirartionAnalysis?year="+2012+"&quarter="+quarter.slice(-1)).success(function(response){
    		
    		$("#popular_quarter").html(quarter);

			var expirationTrendArray = [];
			var permitTypeCountArray = [];
			var permitTypes = [];
			var counts = [];
			$(response).each(function(idx,obj){
				if(typeof permitTypeCountArray[obj.Permit_Type] == "undefined" || typeof permitTypeCountArray[obj.Permit_Type] == null){
					permitTypeCountArray[obj.Permit_Type] = {};
					permitTypes.push(obj.Permit_Type);
				}
				permitTypeCountArray[obj.Permit_Type][parseInt(obj.Month)] = obj.Count;
			});

			$(permitTypes).each(function(idx,permit_type){
				counts = [];
				for(var i=1; i<12; i++){
					if(typeof permitTypeCountArray[permit_type][i] == "undefined")
						counts.push(0);
					else
						counts.push(permitTypeCountArray[permit_type][i]);
				}
				expirationTrendArray.push({name: permit_desc[permit_type], data: counts})
			});
			
		    Highcharts.chart('containerDrillDownExpirationAnalysis', {
		        title: {
		            text: '',
		            x: -20 //center
		        },
		        subtitle: {
		            text: 'Source: New York Open Data',
		            x: -20
		        },
		        xAxis: {
		            categories: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		        },
		        yAxis: {
		            title: {
		                text: 'Total Number of Permits Expired'
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
    };

	$scope.getHeatMapData = function(year) {
		$("#divLocationContent").find(".tab1").removeClass("active");
		$("#heatmap_"+year).parent(".tab1").addClass("active");
		$http.get("/heatMap?year="+year).success(function(response){
		
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
	   
		    for(BOROUGH in data2){
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
		                                name: permit_desc[permit],
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
		            regionP.value = Math.round(regionVal);
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
		        subtitle: {
		            text: 'Click points to drill down. Source: New York Open Data.'
		        },
		        title: {
		            text: ''
		        }
		    });
		});
	};

	$scope.initMap = function() {
		var map;
		map = new google.maps.Map(document.getElementById('map'), {
          zoom: 10,
          center: new google.maps.LatLng(40.714080, -74.006113),
          mapTypeId: 'terrain'
        });
        $http.get("/mapsData").success(function(response){
			$(response).each(function(key,location){

				var infowindow = new google.maps.InfoWindow({
		          content: "<p>Permit Counts: "+location.permit_count+"</p><p>Borough: "+location.BOROUGH+"</p><p> Zipcode: "+location.zipcode+"</p>"
		        });

				var marker = new google.maps.Marker({
		          position: {lat: parseFloat(location.latitude), lng: parseFloat(location.longitude)},
		          map: map
		        });

		        marker.addListener('click', function() {
		          infowindow.open(map, marker);
		        });
			});
			
			
		});
	};
	var map2;
	var heatmap;
	$scope.initHeatMap = function(){
		map2 = new google.maps.Map(document.getElementById('heatmap'), {
          zoom: 11,
          center: {lat: 40.714080, lng: -74.006113},
          //center: new google.maps.LatLng(8.881928, 76.592758),
          //mapTypeId: 'terrain'
          mapTypeId: 'satellite'
        });

		$http.get("/mapsData").success(function(response){
			var heatMapData = [];
			$(response).each(function(key,location){
				heatMapData.push(new google.maps.LatLng(location.latitude, location.longitude))
			});
			var heatmap = new google.maps.visualization.HeatmapLayer({
			  data: heatMapData
			});
			heatmap.setOptions({
				radius: heatmap.get('50'),
				fillColor: 'red',
          		//fillOpacity: .2,
			});

        	var gradient = [					// rgba colors for the gradient
	'rgba(255,255,0,0)','rgba(255,255,0,1)','rgba(255,191,255,1)','rgba(255,127,255,1)',
	'rgba(255,63,255,1)','rgba(255,0,223,1)','rgba(255,0,191,1)','rgba(255,0,159,1)',
	'rgba(255,0,127,1)','rgba(255,0,91,1)','rgba(255,0,31,1)','rgba(255,0,0,1)',
	];
	var gradient = [
          'rgba(0, 255, 255, 0)',
          'rgba(0, 255, 255, 1)',
          'rgba(0, 191, 255, 1)',
          'rgba(0, 127, 255, 1)',
          'rgba(0, 63, 255, 1)',
          'rgba(0, 0, 255, 1)',
          'rgba(0, 0, 223, 1)',
          'rgba(0, 0, 191, 1)',
          'rgba(0, 0, 159, 1)',
          'rgba(0, 0, 127, 1)',
          'rgba(63, 0, 91, 1)',
          'rgba(127, 0, 63, 1)',
          'rgba(191, 0, 31, 1)',
          'rgba(255, 0, 0, 1)'
        ]

	/*var gradient2 = [
						'rgba(255, 0, 0, 0.2)',
						'rgba(255, 0, 0, 0.4)',
						'rgba(255, 0, 0, 0.6)',
						'rgba(255, 0, 0, 0.8)',
					];
					var gradient = [
    'rgba(0, 255, 255, 0)',
    'rgba(0, 255, 255, 1)',
    'rgba(0, 191, 255, 1)',
    'rgba(0, 127, 255, 1)',
    'rgba(0, 63, 255, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(0, 0, 223, 1)',
    'rgba(0, 0, 191, 1)',
    'rgba(0, 0, 159, 1)',
    'rgba(0, 0, 127, 1)',
    'rgba(63, 0, 91, 1)',
    'rgba(127, 0, 63, 1)',
    'rgba(191, 0, 31, 1)',
    'rgba(255, 0, 0, 1)'
  ]*/

			heatmap.set('gradient', gradient);
			heatmap.set('radius', 30);
			heatmap.set('opacity', 1);

			heatmap.setMap(map2);

			map2.data.setStyle(function(feature) {
	          var magnitude = feature.getProperty('mag');
	          console.log(magnitude);
	          return {
	            icon: $scope.getCircle(magnitude)
	          };
	        });
		});


        /*heatmap = new google.maps.visualization.HeatmapLayer({
          data: $scope.getPoints(),
          map: map2
        });

        var heatMapData = [
		    new google.maps.LatLng(8.8678, 76.5623),
		    new google.maps.LatLng(9.5674, 77.5623),
		    new google.maps.LatLng(10.7821, 78.447),
		    new google.maps.LatLng(12.4523, 79.443),
		    new google.maps.LatLng(37.782, -122.441),
		    new google.maps.LatLng(37.782, -122.439),
		    new google.maps.LatLng(37.782, -122.435),
		    new google.maps.LatLng(37.785, -122.447),
		    new google.maps.LatLng(37.785, -122.445),
		    new google.maps.LatLng(37.785, -122.441),
		    new google.maps.LatLng(37.785, -122.437),
		    new google.maps.LatLng(37.785, -122.435)
		];*/

		
	};
	
	$scope.getCircle = function(magnitude){
        return {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: 'red',
          fillOpacity: .2,
          scale: Math.pow(2, magnitude) / 2,
          strokeColor: 'white',
          strokeWeight: .5
        };
    };

	$scope.getPoints = function(){
		var points = [];
		$http.get("/mapsData").success(function(response){
			$(response).each(function(key,location){
				points.push(new google.maps.LatLng(location.latitude, location.longitude))
			});
		});
		
		return points;
      };

     $scope.initBubbleMap = function(){

     	var colorCodes = {
     		"AL" : "red",
     		"EQ" : "blue",
     		"EW" : "orange",
     		"FO" : "green",
     		"NB" : "violet",
     		"PL" : "brown",
     	};

     	var description = {
     		"AL" : "Alteration",
     		"EQ" : "Equipment Work",
     		"EW" : "Earth Work",
     		"FO" : "Foundation Work",
     		"NB" : "New Building",
     		"PL" : "Plumbing",
     	};
     	// Create the map.
        var map = new google.maps.Map(document.getElementById('bubblemap'), {
          zoom:11,
          center: {lat: 40.714080, lng: -74.006113},
          mapTypeId: 'terrain'
        });

        map.data.addListener("click", function(event){
					console.log('Mag Type: ' + event.feature.getProperty('magType'));
				});

				var legend = document.getElementById('legend');
		        for (var key in colorCodes) {
		        	
		          	var div = document.createElement('div');
		          	$(div).addClass("row");
		          	div.innerHTML = "<div class='colorLegend' style='background-color:"+colorCodes[key]+"'></div>"+description[key];
		          	legend.appendChild(div);
		        }

		        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
     	
     	$http.get("/bubbleMapsData").success(function(response){
     		$(response).each(function(i,permitData){
     			console.log("permit-type: "+permitData.Permit_Type);
     			console.log("color: "+colorCodes[permitData.Permit_Type]);
     			console.log("count: "+permitData.permit_count);
     			console.log("lat: "+parseFloat(permitData.latitude) + "long: "+parseFloat(permitData.longitude));
     			//var center = {lat: permitData.latitude, lng: permitData.longitude};
     			var cityCircle = new google.maps.Circle({
		            strokeColor: colorCodes[permitData.Permit_Type],
		            strokeOpacity: 0.8,
		            strokeWeight: 2,
		            label: permitData.Permit_Type,
		            fillColor: colorCodes[permitData.Permit_Type],
		            fillOpacity: 0.35,
		            map: map,
		            center: {lat: parseFloat(permitData.latitude), lng: parseFloat(permitData.longitude)},
		            radius: parseInt(permitData.permit_count)*0.5
		          });
     		});
		});
     };
	
	$scope.getSeasonalData($scope.years[0]);
	$("#divSeasonalContent").find(".tab1:first").addClass("active");
	$scope.getExpirartionAnalysisData($scope.years[0]);
	$("#divExpiryContent").find(".tab1:first").addClass("active");
	$scope.getPopularPermitsData($scope.years[0]);
	$("#divPopularContent").find(".tab1:first").addClass("active");
	$scope.getHeatMapData($scope.years[0]);
	$("#divLocationContent").find(".tab1:first").addClass("active");
	$scope.initMap();
	$scope.initHeatMap();
	$scope.initBubbleMap();

});