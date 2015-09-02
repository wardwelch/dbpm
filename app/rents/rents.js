app.controller('editCtrlRent', function ($scope, $rootScope, $http, $location, $log, $routeParams, services, rent) {
    var rentID = ($routeParams.rentID) ? parseInt($routeParams.rentID) : 0;    
    var buildingID = ($routeParams.buildingID);
    var unitID = ($routeParams.unitID);

    $rootScope.title = (rentID > 0) ? 'Edit Rent' : 'Add Rent';
    $scope.buttonText = (rentID > 0) ? 'Update Rent' : 'Add New Rent';
    var original = rent.data || {};
    original._id = rentID;
    $scope.rent = angular.copy(original);
    $scope.rent._id = rentID;
    $scope.rent.unit_id = unitID;
    $scope.rent.building_id = buildingID;

    $scope.calcDue = function() { 
        $scope.rent.due_this_mo = $scope.rent.rent_owed - $scope.rent.rent_paid - $scope.rent.adjustment;
    }
    
    services.getBuilding(buildingID).then(function(data){
        $scope.building = data.data;
    });
    services.getUnit(unitID).then(function(data){
        $scope.unit = data.data;
    });
    
      $scope.isClean = function() {
        return angular.equals(original, $scope.rent);
      }

      $scope.deleteRent = function(rent) {
        $location.path('/edit-building-rents/' + buildingID);
        if(confirm("Are you sure to delete rent id: "+$scope.rent._id)==true)
        services.deleteRent(rentID);
      };
        $scope.updateUnitPrice = function(data) {
             $scope.unit.price = data;
             services.updateUnit($scope.unit.unit_id, $scope.unit);
        };

      $scope.saveRent = function(rent) {
        $location.path('/edit-building-rents/' + buildingID);
        if (rentID <= 0) {
            services.insertRent(rent);
        }
        else {
            services.updateRent(rentID, rent);
        }
        
        
    };
});
app.filter('sumByKey', function () {
    return function (data, key) {
        if (typeof (data) === 'undefined' || typeof (key) === 'undefined') {
            return 0;
        }

        var sum = 0;
        for (var i = data.length - 1; i >= 0; i--) {
            sum += parseInt(data[i][key]);
        }

        return sum;
    };    
 });
app.controller('editCtrlRents', function ($scope, $rootScope, $location, $routeParams, services, building, $log, $window) {
    var buildingID = ($routeParams.buildingID) ? parseInt($routeParams.buildingID) : 0;
    $rootScope.title = (buildingID > 0) ? 'Edit Rents' : 'Add Rents';
    $scope.buttonText = (buildingID > 0) ? 'Update Rents' : 'Add New Rents';
      var original = building.data;
      original._id = buildingID;
      $scope.building = angular.copy(original);
      $scope.building._id = buildingID;
      
    services
    .getBuildingsList()
    .then(function(data){
        $scope.list = data.data;
    });

    services
    .getRentsRange(buildingID)
    .then(function(data){
        $scope.age = data.data;
    });

    
    services.getRents(buildingID)
    .then(function(data){
        $scope.rents = data.data;
    });
    
      $scope.isClean = function() {
        return angular.equals(original, $scope.building);
      }
    
      $scope.addRents = function(building, month, year) {
      	var month = month;
      	var year = year;
       $location.path('/edit-building-rents/' + buildingID);
        if(confirm("We will now create rents for Building:" + buildingID + "/" + month+"/"+year)==true){
            services.addRents(buildingID,month,year)
            .then(function(){  
            $window.location.reload()
            });
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
            services.insertBuilding(building);
        }
        else {
            services.updateBuilding(buildingID, building);
        }
    };

    
});