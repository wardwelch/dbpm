app.config(['$routeProvider',function($routeProvider) {
    $routeProvider
      .when('/edit-unit/:buildingID/:unitID', {
        title: 'Edit Unit',
        templateUrl: 'app/units/edit-unit.html',
        controller: 'editCtrlUnit',
        resolve: {
          unit: function(services, $route){
            var unitID = $route.current.params.unitID;
            return services.getUnit(unitID);
          }
        }
      })
      .when('/edit-building-units/:buildingID', {
        title: 'Building Units',
        templateUrl: 'app/units/edit-building-units.html',
        controller: 'editCtrlUnits',
        resolve: {
          building: function(services, $route){
            var buildingID = $route.current.params.buildingID;
            return services.getBuilding(buildingID);
          }
        }
      }) 
      .when('/units/:buildingID', {
        title: 'Units',
        templateUrl: 'app/units/units.html',
        controller: 'listCtrlUnits'
      })      
}]);

app.controller('ModalTenantCtrl', function ($scope, $modal, $log, $window, services) {

  $scope.animationsEnabled = true;

  $scope.open = function (unit) {

    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'app/units/modal.html',
      controller: 'ModalTenantInstanceCtrl',
      size: 'md',
        resolve: {
          unit: function(){
            return unit;
          }
        }
    });

    modalInstance.result.then(function (tenant) {
        $log.log(tenant);
        services.updateTenant(tenant.tenant_id, tenant);
        //$window.location.reload()
        
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

app.controller('ModalTenantInstanceCtrl', function ($scope, $rootScope, $modalInstance, $log, services, unit) {
    
    $log.log("adding tenant..,")
    if(unit.tenant_id > 0) {
        services.getTenant(unit.tenant_id).then(function(data){
            $scope.tenant = data.data ;
            $log.log(data.data);
        });
    }else
    {
    
     
        $scope.tenant = {
            building_id :  unit.building_id,
            unit_id     :  unit.unit_id,
            unitnum     :  unit.unitnum,
            unitid      :  unit.unitid,
            tenant_id   :  unit.tenant_id
        }
       $log.log('new tenant');
    }
  
      $scope.isClean = function() {
        //return angular.equals(original, $scope.tenant);
        return false;
      }
      
  $scope.ok = function (tenant) {
        $log.log(tenant);
        if (!tenant.tenant_id) {
            $log.log("saving tenant");
            tenant.status = 'active'
            services.insertTenant(tenant);
            unit.tenant = tenant.lastname + ', ' + tenant.firstname;
            unit.status = "Occupied";
            unit.building = tenant
            
        }
        else {
            if(tenant.status == 'inactive' && tenant.move_out_date != ''){
                $log.log('saving unit...');
                unit.tenant = 'Vacant';
                unit.tenant_id = 0;
                unit.status = 'Vacant';
                services.updateUnit(unit.unit_id, unit); 
                
            }
          $log.log('no save');  
        }
        
        $log.log(tenant);
        $modalInstance.close(tenant);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  
    $scope.moveOut = function(tenant) {
      if(confirm("Move this Tenant out?: #"+tenant.tenant_id)==true) {
        tenant.status = 'inactive';
        
      }
  };

  
});

app.controller('listCtrlUnits', function ($scope, services, $routeParams, $rootScope) {
    var buildingID = ($routeParams.buildingID) ? parseInt($routeParams.buildingID) : 0;

     services.getBuilding(buildingID).then(function(data){
        $scope.building = data.data;
    });

    services.getUnits(buildingID).then(function(data){
        $scope.units = data.data;
    });
    
    services
        .getUnits(unitID)
        .then(function(data){
            $scope.units = data.data;
        });
        
      $scope.deleteUnit = function(unit) {
        if(confirm("Are you sure to delete Unit: " + unit.unitid)==true)
            services.deleteUnit(unit);
      };
    
});


app.controller('editCtrlUnit', function ($scope, $rootScope, $location, $routeParams, services, unit, $log, $window) {
    var buildingID = ($routeParams.buildingID);
    var unitID = ($routeParams.unitID) ? parseInt($routeParams.unitID) : 0;
    var building = {};
    $rootScope.title = (unitID > 0) ? 'Edit Unit' : 'Add Unit';
    $scope.buttonText = (unitID > 0) ? 'Update Unit' : 'Add Unit';
    var original = unit.data || {};
    original._id = unitID;
    $scope.unit = angular.copy(original);
    $scope.unit._id = unitID;
    $scope.unit.building_id = buildingID;

    services.getBuilding(buildingID).then(function(data){
        building = data.data;
        $scope.unit.building = building.name;
 
        services.getUnits(buildingID).then(function(data){
            $scope.unitsList = data.data;
            if(unitID == 0) {
                if($scope.unitsList.length){
                    var tmp = (_.max($scope.unitsList,'unitnum')).unitnum;
                    $scope.unit.unitnum = parseInt(tmp) + 1;
                }
                else{
                    $scope.unit.unitnum = 1;
                }
                $scope.unit.unitid = $scope.unit.building+"/"+$scope.unit.unitnum;
                $scope.unit.price = $rootScope.price || 0;
                $scope.unit.tenant_id =  0  ;
                $scope.unit.total_bal_due = 0;
                $scope.unit.type = $scope.options[0].value;
                $scope.unit.status = $scope.items[0].value;
            }
        });
 
 
 
 
 
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
        if(confirm("Are you sure you want to delete unit name: "+$scope.unit._id)==true)
            services.deleteUnit(unit.unit_id);
      };
      
      $scope.nextUnit = function(unit, event) {
        if(unitID > 0) {
            if(confirm("Do you want to save your changes: "+$scope.unit.unitid)==true)
                services.updateUnit(unitID, unit);
                        setTimeout(function() {
                        //$window.location.href="#/edit-unit/"+buildingID+"/"+unitID;                        
            });
        }
        else
        {
            event.preventDefault();
        }
         
      };
      
      $scope.addTenant = function(unitD) {
        setTimeout(function() {
          $window.location.href="#/add-tenant/"+buildingID+"/"+unitID+"/0";
        });
      };


            
      $scope.saveUnit = function(unit, event) {
        if (unitID <= 0) {
            var d = new Date();
            if(event.target.id == 'add'){
                $location.path('/edit-unit/' + buildingID + '/0?time=' +  d.getMilliseconds() ); 
            }else
            {
                $location.path('/edit-building-units/' + buildingID ); 
            }
            $rootScope.price = $scope.unit.price;
            services.insertUnit(unit);
        }
        else {
           $location.path('/edit-building-units/' + buildingID ); 
           $rootScope.price = $scope.unit.price;
           services.updateUnit(unitID, unit);
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
 
app.controller('editCtrlUnits', function ($scope, $rootScope, $window, $location, $routeParams, services, building, $log) {
    var buildingID = ($routeParams.buildingID) ? parseInt($routeParams.buildingID) : 0;
    $rootScope.title = (buildingID > 0) ? 'Edit Units' : 'Add Units';
    $scope.buttonText = (buildingID > 0) ? 'Update Units' : 'Add New Units';
      var original = building.data;
      original._id = buildingID;
      $scope.building = angular.copy(original);
      $scope.building._id = buildingID;

    services.getUnits(buildingID).then(function(data){
        $scope.units = data.data;
        $log.log($scope.units);
    });
    
    services
    .getBuildingsList()
    .then(function(data){
        $scope.list = data.data;
    });
    
      $scope.isClean = function() {
        return angular.equals(original, $scope.building);
      }

      $scope.deleteUnit = function(unit) {
      $log.log(unit);
        if(!unit.tenant_id) {
            if(confirm("Are you sure want to delete Unit Name: "+unit.unitid)==true){
               services.deleteUnit(unit.unit_id);
                $window.location.reload()            
            }
        }
        else{
            alert("You cannot delete a unit that has tenants. Delete the tenants first.");
        }
      };
      
        $scope.updateUnitPrice = function( price, unit) {
             unit._id = unit.unit_id;
             unit.price = price;
             services.updateUnit(unit.unit_id, unit);
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


app.controller('ModalSearchCtrl', function ($scope, $modal, $log, $window, $location) {

  $scope.animationsEnabled = true;
  $scope.lists = {};
  $scope.open = function (unit) {

   
    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'app/units/search.html',
      controller: 'ModalSearchInstanceCtrl',
      size: 'sm',
        resolve: {
          lists: function(){
            $scope.lists.buildings = $scope.buildingsList
            $scope.lists.buildings.selected = unit.building_id;
            $scope.lists.units = $scope.unitsList;
            $scope.lists.units.selected = unit.unit_id;
            return $scope.lists;
          }
        }
    });

    modalInstance.result.then(function (lists) {
        $log.log(lists);
        $location.path("edit-unit-rents/"+lists.buildings.selected+"/"+lists.units.selected);        
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

app.controller('ModalSearchInstanceCtrl', function ($scope, $modalInstance, $log, services, lists) {

   
    $scope.lists = lists; 
     
    $scope.changeBuilding = function(id){
        services
        .getUnitsList(id)
        .then(function(data){
            $scope.lists.units = data.data;
            $scope.lists.units.selected = $scope.lists.units[0].id;
        });
    }
  
  $scope.ok = function (lists) {
        $modalInstance.close(lists);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  
        $scope.moveOut = function(unit) {
          if(confirm("Move this Tenant out?: #"+unit.tenant_id)==true) {
            unit.tenant_id = 0;
            unit.tenant = 'Vacant';
            services.updateUnit(unit.unit_id, unit);
        }
      };

  
});






app.controller('editCtrlUnitRents', function ($scope, $rootScope, $location, $routeParams, services, unit, $log, $window, $cookies, $cookieStore) {
    var buildingID = ($routeParams.buildingID);
    var unitID = ($routeParams.unitID) ? parseInt($routeParams.unitID) : 0;
    var building = {};
    $rootScope.title = (unitID > 0) ? 'Edit Unit' : 'Add Unit';
    $scope.buttonText = (unitID > 0) ? 'Update Unit' : 'Add Unit';
    var original = unit.data || {};
    original._id = unitID;
    $scope.unit = angular.copy(original);
    $scope.unit._id = unitID;
    $scope.unit.building_id = buildingID;

    services.getBuilding(buildingID).then(function(data){
        building = data.data;
        $scope.unit.building = building.name;
    });
    
    services
    .getBuildingsList()
    .then(function(data){
        $scope.buildingsList = data.data;
    });
    
    services
    .getUnitsList(buildingID)
    .then(function(data){
        $scope.unitsList = data.data;
    });

    
    services
    .getRentsRange(buildingID)
    .then(function(data){
        $scope.age = data.data;
    });

    
     var month = $cookieStore.get('month');
     var year = $cookieStore.get('year');
     $log.log($scope.d1);
     $scope.d1 = year.value +'-01-01';
     $scope.d2 = year.value +'-12-31';
        
   $scope.loadRents = function(){
   $log.log($scope.d1);
   if($scope.d1 == '' || $scope.d2 == 'undefined') {
   
         var month = $cookieStore.get('month');
         var year = $cookieStore.get('year');
         $log.log($scope.d1);
         $scope.d1 = year.value +'-01-01';
         $scope.d2 = year.value +'-12-31';
         
    }
        
    services
    .getRentsByDateRange(buildingID, unitID, $scope.d1, $scope.d2)
    .then(function(data){
        $scope.rents = data.data;
    });
 
   
   }    

    services
    .getRentsByDateRange(buildingID, unitID, $scope.d1, $scope.d2)
    .then(function(data){
        $scope.rents = data.data;
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
        if(confirm("Are you sure you want to delete unit name: "+$scope.unit._id)==true)
         $location.path('/edit-building-units/' + buildingID );
           services.deleteUnit(unit.unit_id);
      };
      
      $scope.nextUnit = function(unit, event) {
        if(unitID > 0) {
            if(confirm("Do you want to save your changes: "+$scope.unit.unitid)==true)
                services.updateUnit(unitID, unit);
                        setTimeout(function() {
                        //$window.location.href="#/edit-unit/"+buildingID+"/"+unitID;                        
            });
        }
        else
        {
            event.preventDefault();
        }
        
      };
      
      $scope.addTenant = function(unitD) {
        setTimeout(function() {
          $window.location.href="#/add-tenant/"+buildingID+"/"+unitID+"/0";
        });
      };

            
      $scope.saveUnit = function(unit, event) {
        if (unitID <= 0) {
            var d = new Date();
            if(event.target.id == 'add'){
                $location.path('/edit-unit/' + buildingID + '/0?time=' +  d.getMilliseconds() ); 
            }else
            {
                $location.path('/edit-building-units/' + buildingID ); 
            }
            $rootScope.price = $scope.unit.price;
            services.insertUnit(unit);
        }
        else {
           $location.path('/edit-building-units/' + buildingID ); 
           $rootScope.price = $scope.unit.price;
           services.updateUnit(unitID, unit);
        }
    };
});
