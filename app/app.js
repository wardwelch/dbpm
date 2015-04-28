var app = angular.module('myApp', ['ngRoute','ui.bootstrap']);
app.factory("services", ['$http', function($http) {
  var serviceBase = 'services/'
    var obj = {};
    // Tenents
    obj.getTenents = function(){
        return $http.get(serviceBase + 'tenents');
    }
    obj.getTenent = function(tenentID){
        return $http.get(serviceBase + 'tenent?id=' + tenentID);
    }

    obj.insertTenent = function (tenent) {
        return $http.post(serviceBase + 'insertTenent', tenent).then(function (results) {
            return results;
        });
	};

	obj.updateTenent = function (id,tenent) {
	    return $http.post(serviceBase + 'updateTenent', {id:id, tenent:tenent}).then(function (status) {
	        return status.data;
	    });
	};

	obj.deleteTenent = function (id) {
	    return $http.delete(serviceBase + 'deleteTenent?id=' + id).then(function (status) {
	        return status.data;
	    });
	};
    //Buildings	
    obj.getBuildings = function(){
        return $http.get(serviceBase + 'buildings');
    }
    
    obj.getBuilding = function(buildingID){
        return $http.get(serviceBase + 'building?id=' + buildingID);
    }

    obj.insertBuilding = function (building) {       
       return $http.post(serviceBase + 'insertBuilding', building).then(function (results) {           
         return results;
        });
	};

	obj.updateBuilding = function (id,building) {
	    return $http.post(serviceBase + 'updateBuilding', {id:id, building:building}).then(function (status) {
	        return status.data;
	    });
	};

	obj.deleteBuilding = function (id) {
	    return $http.delete(serviceBase + 'deleteBuilding?id=' + id).then(function (status) {
	        return status.data;
	    });
	};
    //Units	
    obj.getUnits = function(){
        return $http.get(serviceBase + 'units');
    }
    
    obj.getUnit = function(unitID){
        return $http.get(serviceBase + 'unit?id=' + unitID);
    }

    obj.insertUnit = function (unit) {       
       return $http.post(serviceBase + 'insertUnit', unit).then(function (results) {           
         return results;
        });
	};

	obj.updateUnit = function (id,unit) {
	    return $http.post(serviceBase + 'updateUnit', {id:id, unit:unit}).then(function (status) {
	        return status.data;
	    });
	};

	obj.deleteUnit = function (id) {
	    return $http.delete(serviceBase + 'deleteUnit?id=' + id).then(function (status) {
	        return status.data;
	    });
	};

    return obj;   
}]);

app.controller('listCtrl', function ($scope, services) {
    services.getTenents().then(function(data){
        $scope.tenents = data.data;
    });
});
app.controller('listCtrlBuildings', function ($scope, services) {
    services.getBuildings().then(function(data){
        $scope.buildings = data.data;
    });
});
app.controller('listCtrlUnits', function ($scope, services) {
    services.getUnits().then(function(data){
        $scope.units = data.data;
    });
});

app.controller('editCtrl', function ($scope, $rootScope, $location, $routeParams, services, tenent) {
    var tenentID = ($routeParams.tenentID) ? parseInt($routeParams.tenentID) : 0;
    $rootScope.title = (tenentID > 0) ? 'Edit Tenent' : 'Add Tenent';
    $scope.buttonText = (tenentID > 0) ? 'Update Tenent' : 'Add New Tenent';
      var original = tenent.data;
      original._id = tenentID;
      $scope.tenent = angular.copy(original);
      $scope.tenent._id = tenentID;
      $scope.isClean = function() {
        return angular.equals(original, $scope.tenent);
      }

      $scope.deleteTenent = function(tenent) {
        $location.path('/');
        if(confirm("Are you sure to delete tenent number: "+$scope.tenent._id)==true)
        services.deleteTenent(tenent.tenentNumber);
      };

      $scope.saveTenent = function(tenent) {
        $location.path('/');
        if (tenentID <= 0) {
            services.insertTenent(tenent);
        }
        else {
            services.updateTenent(tenentID, tenent);
        }
    };
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

app.controller('DropdownCtrl', function ($scope, $log) {
  $scope.items = [
    'The first choice!',
    'And another choice for you.',
    'but wait! A third!'
  ];

  $scope.status = {
    isopen: false
  };

  $scope.toggled = function(open) {
    $log.log('Dropdown is now: ', open);
  };

  $scope.toggleDropdown = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };
});

app.controller('HeaderController',function HeaderController($scope, $location) 
{ 
    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };
});

app.config(['$routeProvider',function($routeProvider) {
    $routeProvider.
      when('/buildings', {
        title: 'Buildings',
        templateUrl: 'partials/buildings.html',
        controller: 'listCtrlBuildings'
      })
      .when('/tenents', {
        title: 'Tenents',
        templateUrl: 'partials/tenents.html',
        controller: 'listCtrl'
      })      
      .when('/edit-tenent/:tenentID', {
        title: 'Edit Tenents',
        templateUrl: 'partials/edit-tenent.html',
        controller: 'editCtrl',
        resolve: {
          tenent: function(services, $route){
            var tenentID = $route.current.params.tenentID;
            return services.getTenent(tenentID);
          }
        }
      })
      .when('/edit-building/:buildingID', {
        title: 'Edit Buildings',
        templateUrl: 'partials/edit-building.html',
        controller: 'editCtrlBuilding',
        resolve: {
          building: function(services, $route){
            var buildingID = $route.current.params.buildingID;
            return services.getBuilding(buildingID);
          }
        }
      })
      .when('/edit-building-units/:buildingID', {
        title: 'Edit Buildings',
        templateUrl: 'partials/edit-building-units.html',
        controller: 'editCtrlBuilding',
        resolve: {
          building: function(services, $route){
            var buildingID = $route.current.params.buildingID;
            return services.getBuilding(buildingID);
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
}]);
app.run(['$location', '$rootScope', function($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);