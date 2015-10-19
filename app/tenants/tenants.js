app.config(['$routeProvider',function($routeProvider) {
    $routeProvider
      .when('/tenants/:buildingID', {
        title: 'Tenants',
        templateUrl: 'app/tenants/tenants.html',
        controller: 'listCtrlTenants'
      }) 
      .when('/edit-tenant/:buildingID/:unitID/:tenantID', {
        title: 'Edit Tenant',
        templateUrl: 'app/tenants/edit-tenant.html',
        controller: 'editCtrlTenant',
        resolve: {
          tenant: function(services, $route){
            var tenantID = $route.current.params.tenantID;
            return services.getTenant(tenantID);
          }
        }
      })
      .when('/add-tenant/:buildingID/:unitID/:tenantID', {
        title: 'Add Tenant',
        templateUrl: 'app/tenants/add-tenant.html',
        controller: 'editCtrlTenant',
        resolve: {
          tenant: function(services, $route){
            var tenantID = $route.current.params.tenantID;
            return services.getTenant(tenantID);
          }
        }
      })
      .when('/edit-building-tenants/:buildingID', {
        title: 'Building Tenants',
        templateUrl: 'app/tenants/edit-building-tenants.html',
        controller: 'editCtrlTenants',
        resolve: {
          building: function(services, $route){
            var buildingID = $route.current.params.buildingID;
            return services.getBuilding(buildingID);
          }
        }
      })
}]);


app.controller('listCtrlTenants', function ($scope, services) {
    services.getTenants().then(function(data){
        $scope.tenants = data.data;
    });
});


app.controller('editCtrlTenants', function ($scope, $rootScope, $location, $routeParams, services, building, $log) {
    var buildingID = ($routeParams.buildingID) ? parseInt($routeParams.buildingID) : 0;
    $rootScope.title = (buildingID > 0) ? 'Edit Tenants' : 'Add Tenants';
    $scope.buttonText = (buildingID > 0) ? 'Update Tenants' : 'Add New Tenants';
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

app.controller('editCtrlTenant', function ($scope, $rootScope, $location, $routeParams, $log, services, tenant) {
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
$log.log($scope.tenant);
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
            unit.status = 'vacant';
            services.updateUnit(unit.unit_id, unit);
        }
      };
      
      $scope.cancelText = '/dbpm/#/edit-building-tenants/' + buildingID ;

      $scope.deleteTenant = function(tenantID) {
        $location.path('/edit-building-tenants/'+buildingID);
        if(confirm("Are you sure to delete tenant number: "+tenantID)==true)
            services.deleteTenant(tenantID);
      };

      $scope.saveTenant = function(tenant) {
        $location.path('/edit-building-tenants/'+buildingID);
        if (tenantID <= 0) {
            services.insertTenant(tenant);
        }
        else {
            services.updateTenant(tenantID, tenant);
        }
    };
});
