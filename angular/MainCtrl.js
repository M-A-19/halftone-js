(function() {

  var app = angular.module("Ape", ['mp.colorPicker','Halftone']);

  var MainCtrl = function($scope) {
  
  	  $scope.defaults = {
  	  					sample : 5,
  	  					luminosity : "Standard",
  	  					colour1: "#ffffff",
  						colour2: "#000000"
  	  					};
	
	
	/**
	 * Reset the demo form to the default values.
	 *
	 * @return void.
	 */
	 $scope.reset = function(canvasID) {
        $scope.data = angular.copy($scope.defaults);
        $scope.$broadcast('reset', canvasID);
      };
      
      $scope.render = function(canvasID){
 
        if (null !=canvasID)$scope.data.id = canvasID;
        $scope.$broadcast('render', $scope.data);
      
      };

    $scope.reset();
    $scope.message = "One of these days I'm going to cut you into little pieces!" + " ( " + $scope.data.sample + "px x " + $scope.data.sample + "px )";


  };
  
  app.controller("MainCtrl",MainCtrl);

}());