
app.config(['$routeProvider',function($routeProvider) {
    $routeProvider
      .when('/edit-rent/:buildingID/:unitID/:rentID', {
        title: 'Edit Rent',
        templateUrl: 'app/rents/edit-rent.html',
        controller: 'editCtrlRent',
        resolve: {
          rent: function(services, $route){
            var rentID = $route.current.params.rentID;
            return services.getRent(rentID);
          }
        }
      })
      .when('/edit-unit-rents/:buildingID/:unitID', {
        title: 'Unit Rents',
        templateUrl: 'app/units/edit-unit-rents.html',
        controller: 'editCtrlUnitRents',
        resolve: {
          unit: function(services, $route){
            var unitID = $route.current.params.unitID;
            return services.getUnit(unitID);
          }
        }
      })
      .when('/edit-unit-rent/:buildingID/:unitID/:rentID', {
        title: 'Edit Unit Rent',
        templateUrl: 'app/rents/edit-rent.html',
        controller: 'editCtrlUnitRent',
        resolve: {
          rent: function(services, $route){
            var rentID = $route.current.params.rentID;
            return services.getRent(rentID);
          }
        }
      })
      .when('/edit-building-rents/:buildingID', {
        title: 'Building Rents',
        templateUrl: 'app/rents/edit-building-rents.html',
        controller: 'editCtrlRents',
        resolve: {
          building: function(services, $route){
            var buildingID = $route.current.params.buildingID;
            return services.getBuilding(buildingID);
          }
        }
      })
}]);

app.controller('ModalCtrl', function ($scope, $modal, $log) {

  $scope.animationsEnabled = true;

  $scope.open = function (rent) {
   
    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'app/rents/modal.html',
      controller: 'ModalInstanceCtrl',
      size: 'md',
      resolve: {
        rent: function () {
          return rent;
        }
      }
    });

    modalInstance.result.then(function (rent) {
      $scope.rent = rent;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };

});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, $log, services, rent) {

  $scope.rent = rent;
  
    services.getRentsByRent(rent)
    .then(function(data){    
        $scope.rents = data.data;
        

      $scope.isFirst = function(rent) {
        var first = 0;
        var current = _.findIndex($scope.rents, 'rent_id', rent.rent_id);
        return current == first;
      }

      $scope.isLast = function(rent) {
        var last = ($scope.rents.length)-1;
        var current = _.findIndex($scope.rents, 'rent_id', rent.rent_id);
        return current == last;
      }

      $scope.triggerClick = function () {
      setTimeout(function() {
        jQuery('#myForm').trigger('click');
      }, 100);
    };                                         
          
      $scope.nextRent = function(rent, event) {
        if(rent.rent_id > 0) {
                services.updateRent(rent.rent_id, rent);
                setTimeout(function() {
                    var next = $scope.rents[_.findIndex($scope.rents, 'rent_id', rent.rent_id)+1];                        
                    $scope.rent = next;
                    $scope.triggerClick();
                });
        }else
        {
            event.preventDefault();
        }
      };
      
      
      $scope.prevRent = function(rent, event) {
        if(rent.rent_id > 0) {
                services.updateRent(rent.rent_id, rent);
                setTimeout(function() {
                    var prev = $scope.rents[_.findIndex($scope.rents, 'rent_id', rent.rent_id)-1];                        
                    $scope.rent = prev;
                    $scope.triggerClick();
                });
        }else
        {
            event.preventDefault();
        }
      };
   });
  
  
     $scope.calcDue = function() { 
        $scope.rent.due_this_mo = $scope.rent.rent_owed - $scope.rent.rent_paid - $scope.rent.adjustment;
    }
 

  $scope.ok = function () {
  
        services.updateRent($scope.rent.rent_id, $scope.rent); 
         
        $modalInstance.close($scope.rent);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

app.controller('editCtrlRent', function ($scope, $rootScope, $http, $location, $log,$window, $routeParams, services, rent) {
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
    
    services.getRentsByRent(rent)
    .then(function(data){    
        $scope.rents = data.data;
        

      $scope.isFirst = function(rent) {
        var first = 0;
        var current = _.findIndex($scope.rents, 'rent_id', rent.rent_id);
        return current == first;
      }

      $scope.isLast = function(rent) {
        var last = ($scope.rents.length)-1;
        var current = _.findIndex($scope.rents, 'rent_id', rent.rent_id);
        return current == last;
      }

            
      $scope.nextRent = function(rent, event) {
        if(rentID > 0) {
                services.updateRent(rentID, rent);
                setTimeout(function() {
                    var next = $scope.rents[_.findIndex($scope.rents, 'rent_id', rent.rent_id)+1];                        
                    $window.location.href='#/edit-rent/' + next.building_id + '/' + next.unit_id + '/' + next.rent_id;                      
                });
        }else
        {
            event.preventDefault();
        }
      };
      
      
//     $scope.nextRent = function(rent){
//         services.
//         updateRent(rent.rent_id, rent);
//         var next = $scope.rents[_.findIndex($scope.rents, 'rent_id', rent.rent_id)+1];
//         setTimeout(function() {
//             $location.path('/edit-rent/' + next.building_id + '/' + next.unit_id + '/' + next.rent_id);  
//         });    
//     
//     }    
    $scope.prevRent = function(rent){
        services.updateRent(rent.rent_id, rent);
        var prev = $scope.rents[_.findIndex($scope.rents, 'rent_id', rent.rent_id)-1];
        $location.path('/edit-rent/' + prev.building_id + '/' + prev.unit_id + '/' + prev.rent_id);       
    
    }    
      
      
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
        
      $scope.cancelText = '#/edit-building-rents/' + buildingID;
      
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
app.controller('editCtrlUnitRent', function ($scope, $rootScope, $http, $location, $log, $routeParams, services, rent) {
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
      
      $scope.cancelText = '#/edit-unit-rents/' + buildingID + '/' + unitID;

        $scope.deleteRent = function(rent) {
            $location.path('/edit-unit-rents/' + buildingID + '/' + unitID);
            if(confirm("Are you sure to delete rent id: "+$scope.rent._id)==true)
            services.deleteRent(rentID);
        };
        $scope.updateUnitPrice = function(data) {
             $scope.unit.price = data;
             services.updateUnit($scope.unit.unit_id, $scope.unit);
        };

      $scope.saveRent = function(rent) {
        $location.path('/edit-unit-rents/' + buildingID + '/' + unitID);
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
                services.getRents(buildingID)
                .then(function(data){
                    $scope.rents = data.data;
                });
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
angular.module('ui.bootstrap').controller('DatepickerCtrl', function ($scope) {
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
});
app.controller('EditableTableCtrl', function($scope, $filter, $http, $q, $log, services) {
  // save edits
  $scope.saveTable = function() {
    var results = [];
    $scope.rents = $filter('filter')($scope.rents, $scope.month.value + '/' + $scope.year.value);
    for (var i = $scope.rents.length; i--;) {
        var rent = $scope.rents[i];        
        results.push(services.updateRent(rent.rent_id, rent));        
    }

    $q.all(results);
    services.getRents(rent.building_id)
    .then(function(data){
        $scope.rents = data.data;
    });
  };


});

app.run(function(editableOptions, editableThemes) {
  editableThemes.bs3.inputClass = 'input-sm';
  editableThemes.bs3.buttonsClass = 'btn-sm';
  editableOptions.theme = 'bs3';
});    

