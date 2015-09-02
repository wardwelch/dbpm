app.controller('editCtrlTenants', function ($scope, $rootScope, $location, $routeParams, services, building, $log) {
    var buildingID = ($routeParams.buildingID) ? parseInt($routeParams.buildingID) : 0;
    $rootScope.title = (buildingID > 0) ? 'Edit tenants' : 'Add tenants';
    $scope.buttonText = (buildingID > 0) ? 'Update tenants' : 'Add New tenants';
      var original = building.data;
      original._id = buildingID;
      $scope.building = angular.copy(original);
      $scope.building._id = buildingID;
      
    services.getTenants(buildingID).then(function(data){
        $scope.tenants = data.data;
    });
    services
    .getBuildingsList()
    .then(function(data){
        $scope.list = data.data;
    });
      $scope.isClean = function() {
        return angular.equals(original, $scope.building);
      }
    
      $scope.deleteTenant = function(building) {
        $location.path('/buildings');
        if(confirm("Are you sure to delete tenant name: "+$scope.building._id)==true)
        services.deleteTenant(building.building_id);
      };

      $scope.saveTenant = function(building) {
        $location.path('/buildings');
        if (buildingID <= 0) {
            $log.log("save tenant");
            services.insertTenant(building);
        }
        else {
            services.updateTenant(buildingID, building);
        }
    };
});
app.controller('editCtrlTenant', function ($scope, $rootScope, $location, $routeParams, services, tenant) {
    var tenantID = ($routeParams.tenantID) ? parseInt($routeParams.tenantID) : 0;    
    var buildingID = ($routeParams.buildingID);
    var unitID = ($routeParams.unitID);
    $rootScope.title = (tenantID > 0) ? 'Edit Tenant' : 'Add Tenant';
    $scope.buttonText = (tenantID > 0) ? 'Update Tenant' : 'Add New Tenant';
    var original = tenant.data || {};
    original._id = tenantID;
    $scope.tenant = angular.copy(original);
    $scope.tenant._id = tenantID;
    $scope.tenant.building_id = buildingID;
    $scope.tenant.unit_id = unitID;


    services.getBuilding(buildingID).then(function(data){
        $scope.building = data.data;
    });
    services.getUnit(unitID).then(function(data){
        $scope.unit = data.data;
        $scope.tenant.unitnum = $scope.unit.unitnum;
    });
    
    services.getTenantRents(tenantID).then(function(data){
        $scope.rents = data.data;
    });
    
      $scope.isClean = function() {
        return angular.equals(original, $scope.tenant);
      }
      
      $scope.moveIn = function() {
        alert("coming soon");  
      }
      
      $scope.moveOut = function(unit) {
          if(confirm("Move this Tenant out?: #"+unit.tenant_id)==true) {
            unit.tenant_id = 0;
            unit.tenant = 'Vacant';
            services.updateUnit(unit.unit_id, unit);
        }
      };

      $scope.deleteTenant = function(tenantID) {
        $location.path('/edit-building-units/'+buildingID);
        if(confirm("Are you sure to delete tenant number: "+tenantID)==true)
            services.deleteTenant(tenantID);
      };

      $scope.saveTenant = function(tenant) {
        $location.path('/edit-building-units/'+buildingID);
        if (tenantID <= 0) {
            services.insertTenant(tenant);
        }
        else {
            services.updateTenant(tenantID, tenant);
        }
    };
});