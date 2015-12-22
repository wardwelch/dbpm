app.config(['$routeProvider',function($routeProvider) {
    $routeProvider
      .when('/buildings', {
        title: 'Buildings',
        templateUrl: 'app/buildings/buildings.html',
        controller: 'listCtrlBuildings'
      })
      .when('/edit-building/:buildingID', {
        title: 'Edit Buildisng',
        templateUrl: 'app/buildings/edit-building.html',
        controller: 'editCtrlBuilding',
        resolve: {
          building: function(services, $route){
            var buildingID = $route.current.params.buildingID;
            return services.getBuilding(buildingID);
          }
        }
      })
}]);


app.controller('listCtrlBuildings', function ($scope, services) {
    services
    .getBuildings()
    .then(function(data){
        $scope.buildings = data.data;
    });

    $scope.getUnitsByBuilding = function(bid){
         services
         .getUnits(bid)
         .then(function(data){
             $scope.units = data.data;
         });
    }

    $scope.getRentsByUnit = function(unitID) {
           var uid = unitID;
           services
           .getRentsByUnit(uid)
           .then(function(data){
               $scope.rents = data.data;
           });
    }
    
    
 });
    
app.controller('editCtrlBuilding', function ($scope, $rootScope, $location, $routeParams, services, building, $log) {
    var buildingID = ($routeParams.buildingID) ? parseInt($routeParams.buildingID) : 0;
    $rootScope.title = (buildingID > 0) ? 'Edit Building' : 'Add Building';
    $scope.buttonText = (buildingID > 0) ? 'Update Building' : 'Add New Building';
      var original = building.data;
      original._id = buildingID;
      $scope.building = angular.copy(original);
      $scope.building._id = buildingID;
      
      $scope.isClean = function() {
        return angular.equals(original, $scope.building);
      }
      
      $scope.changeInactive = function(val) {
        if(val == 1) {
            if(confirm("Are you sure you want to deactivate : "+$scope.building.name)==true){
                $scope.building.inactive = '1';
            }else{
                $scope.building.inactive = '0';
            }
        }
      };
      
      
      $scope.deleteBuilding = function(building) {
        $location.path('/buildings');
        if(confirm("Are you sure to delete building name: "+$scope.building._id)==true)
        services.deleteBuilding(building.building_id);
      };

      $scope.saveBuilding = function(building) {
        $location.path('/buildings');
        if (buildingID <= 0) {
            $log.log("save building");
            services.insertBuilding(building);
        }
        else {
            services.updateBuilding(buildingID, building);
        }
    };
});

