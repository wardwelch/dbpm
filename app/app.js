var app = angular.module('myApp', ['ngRoute','ui.bootstrap','snap']);
app.factory("services", ['$http', function($http) {
  var serviceBase = 'services/'
    var obj = {};
    // Tenents
    obj.getTenents = function(buildingID){
        return $http.get(serviceBase + 'tenents?id=' + buildingID);
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
    obj.getUnits = function(buildingID){
        return $http.get(serviceBase + 'units?id=' + buildingID);
    }
    
    obj.getUnit = function( unitID ){
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

app.controller('listCtrlTenents', function ($scope, services) {
    services.getTenents().then(function(data){
        $scope.tenents = data.data;
    });
});
app.controller('listCtrlBuildings', function ($scope, services) {
    services.getBuildings().then(function(data){
        $scope.buildings = data.data;
    });
});
app.controller('listCtrlUnits', function ($scope, services, $routeParams, $rootScope) {
    var buildingID = ($routeParams.buildingID) ? parseInt($routeParams.buildingID) : 0;

     services.getBuilding(buildingID).then(function(data){
        $scope.building = data.data;
    });

    services.getUnits(buildingID).then(function(data){
        $scope.units = data.data;
    });
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
app.controller('editCtrlUnit', function ($scope, $rootScope, $location, $routeParams, services, unit, $log) {
    var buildingID = ($routeParams.buildingID);
    var unitID = ($routeParams.unitID) ? parseInt($routeParams.unitID) : 0;
    var building = {};
    $rootScope.title = (unitID > 0) ? 'Edit Unit' : 'Add Unit';
    $scope.buttonText = (unitID > 0) ? 'Update Unit' : 'Add New Unit';
      var original = unit.data || {};
      original._id = unitID;
      $scope.unit = angular.copy(original);
      $scope.unit._id = unitID;
      $scope.unit.building_id = buildingID;
      $scope.unit.tenent_id = (unit.data.tenent_id > 0) ? unit.data.tenent_id : 0 ;
      
     services.getBuilding(buildingID).then(function(data){
        building = data.data;
        $scope.unit.building = building.name;
    });
     
      
    $scope.options = [
        { label: '1 Bedroom', value: '1 Bedroom'},
        { label: '2 Bedroom', value: '2 Bedroom'}
    ];
    $scope.items = [
        { label: 'Vacant', value: 'Vacant'},
        { label: 'Occupied', value: 'Occupied'}
    ];
    
    
      $scope.isClean = function() {
        return angular.equals(original, $scope.unit);
      }

      $scope.deleteUnit = function(unit) {
        $location.path('/edit-building-units/' + buildingID );
        if(confirm("Are you sure to delete unit name: "+$scope.unit._id)==true)
        services.deleteUnit(unit.unit_id);
      };

      $scope.saveUnit = function(unit) {
        $location.path('/edit-building-units/'+ buildingID ); 
        if (unitID <= 0) {
            services.insertUnit(unit);
        }
        else {
            services.updateUnit(unitID, unit);
        }
    };
});
app.controller('editCtrlUnits', function ($scope, $rootScope, $location, $routeParams, services, building, $log) {
    var buildingID = ($routeParams.buildingID) ? parseInt($routeParams.buildingID) : 0;
    $rootScope.title = (buildingID > 0) ? 'Edit Units' : 'Add Units';
    $scope.buttonText = (buildingID > 0) ? 'Update Units' : 'Add New Units';
      var original = building.data;
      original._id = buildingID;
      $scope.building = angular.copy(original);
      $scope.building._id = buildingID;

    services.getUnits(buildingID).then(function(data){
        $scope.units = data.data;
    });
    
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
app.controller('editCtrlTenents', function ($scope, $rootScope, $location, $routeParams, services, building, $log) {
    var buildingID = ($routeParams.buildingID) ? parseInt($routeParams.buildingID) : 0;
    $rootScope.title = (buildingID > 0) ? 'Edit Tenents' : 'Add Tenents';
    $scope.buttonText = (buildingID > 0) ? 'Update Tenents' : 'Add New Tenents';
      var original = building.data;
      original._id = buildingID;
      $scope.building = angular.copy(original);
      $scope.building._id = buildingID;

    services.getTenents(buildingID).then(function(data){
        $scope.tenents = data.data;
    });
    
      $scope.isClean = function() {
        return angular.equals(original, $scope.building);
      }
    
      $scope.deleteTenent = function(building) {
        $location.path('/buildings');
        if(confirm("Are you sure to delete tenent name: "+$scope.building._id)==true)
        services.deleteTenent(building.building_id);
      };

      $scope.saveTenent = function(building) {
        $location.path('/buildings');
        if (buildingID <= 0) {
            $log.log("save tenent");
            services.insertTenent(building);
        }
        else {
            services.updateTenent(buildingID, building);
        }
    };
});
app.controller('editCtrlTenent', function ($scope, $rootScope, $location, $routeParams, services, tenent) {
    var tenentID = ($routeParams.tenentID) ? parseInt($routeParams.tenentID) : 0;
    var buildingID = ($routeParams.buildingID);
    $rootScope.title = (tenentID > 0) ? 'Edit Tenent' : 'Add Tenent';
    $scope.buttonText = (tenentID > 0) ? 'Update Tenent' : 'Add New Tenent';
    var original = tenent.data || {};
    original._id = tenentID;
    $scope.tenent = angular.copy(original);
      $scope.tenent._id = tenentID;
      $scope.building_id = buildingID;
      $scope.isClean = function() {
        return angular.equals(original, $scope.tenent);
      }

      $scope.deleteTenent = function(tenent) {
        $location.path('/dbpm/#/edit-building-tenents/:buildingID');
        if(confirm("Are you sure to delete tenent number: "+$scope.tenent._id)==true)
        services.deleteTenent(tenent.tenentNumber);
      };

      $scope.saveTenent = function(tenent) {
        $location.path('/dbpm/#/edit-building-tenents/:buildingID');
        if (tenentID <= 0) {
            services.insertTenent(tenent);
        }
        else {
            services.updateTenent(tenentID, tenent);
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
      .when('/dashboard', {
        title: 'Dashboard',
        templateUrl: 'partials/dashboard.html',
        controller: 'listCtrl'
      })      
      .when('/tenents', {
        title: 'Tenents',
        templateUrl: 'partials/tenents.html',
        controller: 'listCtrlTenents'
      })      
      .when('/units/:buildingID', {
        title: 'Units',
        templateUrl: 'partials/units.html',
        controller: 'listCtrlUnits'
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
        title: 'Edit Units',
        templateUrl: 'partials/edit-building-units.html',
        controller: 'editCtrlUnits',
        resolve: {
          building: function(services, $route){
            var buildingID = $route.current.params.buildingID;
            return services.getBuilding(buildingID);
          }
        }
      })
      .when('/edit-unit/:buildingID/:unitID', {
        title: 'Edit Units',
        templateUrl: 'partials/edit-unit.html',
        controller: 'editCtrlUnit',
        resolve: {
          unit: function(services, $route){
            var unitID = $route.current.params.unitID;
            return services.getUnit(unitID);
          }
        }
      })
      .when('/edit-building-tenents/:buildingID', {
        title: 'Edit Tenents',
        templateUrl: 'partials/edit-building-tenents.html',
        controller: 'editCtrlTenents',
        resolve: {
          building: function(services, $route){
            var buildingID = $route.current.params.buildingID;
            return services.getBuilding(buildingID);
          }
        }
      })
      .when('/edit-tenent/:buildingID/:tenentID', {
        title: 'Edit Tenents',
        templateUrl: 'partials/edit-tenent.html',
        controller: 'editCtrlTenent',
        resolve: {
          tenent: function(services, $route){
            var tenentID = $route.current.params.tenentID;
            return services.getTenent(tenentID);
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