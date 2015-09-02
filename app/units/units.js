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
    });
    
    $scope.options = [
        { label: '1 Bedroom', value: '1 Bedroom'},
        { label: '2 Bedroom', value: '2 Bedroom'}
    ];
    $scope.items = [
        { label: 'Vacant', value: 'Vacant'},
        { label: 'Occupied', value: 'Occupied'}
    ];
   
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
    
    services
    .getBuildingsList()
    .then(function(data){
        $scope.list = data.data;
    });
    
      $scope.isClean = function() {
        return angular.equals(original, $scope.building);
      }
    
      $scope.deleteUnit = function(unit) {
        if(unit.tenant_id == null) {
            $location.path('#');
            if(confirm("Are you sure want to delete Unit name: "+unit.unitid)==true){
                services.deleteUnit(unit.unit_id);
            }
        }
        else{
            alert("You cannot delete a unit that has tenants. Delete the tenants first.");
        }
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
app.controller('editCtrlUnitRents', function ($scope, $rootScope, $location, $routeParams, services, unit, $log, $window) {
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
    .getTenantsList(unitID)
    .then(function(data){
        $scope.list = data.data;
    });
    
    $scope.options = [
        { label: '1 Bedroom', value: '1 Bedroom'},
        { label: '2 Bedroom', value: '2 Bedroom'}
    ];
    $scope.items = [
        { label: 'Vacant', value: 'Vacant'},
        { label: 'Occupied', value: 'Occupied'}
    ];
   
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
