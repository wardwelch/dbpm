var app = angular.module('myApp', ['ngRoute','ui.bootstrap','snap','ngCookies',"xeditable"]);
app.factory("services", ['$http', function($http) {
  var serviceBase = 'services/'
    var obj = {};
       
    // tenants
    obj.getLastInsertID = function() {
        return $http.get(serviceBase + 'lastInsertID');
    
    }
    obj.getTenantsList = function(unitID){
        return $http.get(serviceBase + 'tenantsList?id='+unitID);
    }
    
    obj.getFirstYear = function() {
        return $http.get(serviceBase + 'firstYear');
    
    }
    obj.getLastYear = function() {
        return $http.get(serviceBase + 'lastYear');
    
    }
    obj.getTenants = function(buildingID){
        return $http.get(serviceBase + 'tenants?id=' + buildingID);
    }
    obj.getTenant = function(tenantID){
        return $http.get(serviceBase + 'tenant?id=' + tenantID);
    }

    obj.insertTenant = function (tenant) {
        return $http.post(serviceBase + 'insertTenant', tenant).then(function (results) {
            return results;
        });
	};

	obj.updateTenant = function (id,tenant) {
	    return $http.post(serviceBase + 'updateTenant', {id:id, tenant:tenant}).then(function (status) {
	        return status.data;
	    });
	};

	obj.deleteTenant = function (id) {
	    return $http.delete(serviceBase + 'deleteTenant?id=' + id).then(function (status) {
	        return status.data;
	    });
	};
    //Buildings	
    obj.getBuildings = function(){
        return $http.get(serviceBase + 'buildings');
    }
    obj.getBuildingsList = function(){
        return $http.get(serviceBase + 'buildingsList');
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
	
    //Rents	
    obj.getRents = function(buildingID){
        return $http.get(serviceBase + 'rents?id=' + buildingID);
    }
    obj.getTenantRents = function(tenantID){
        return $http.get(serviceBase + 'tenant_rents?id=' + tenantID);
    }
    obj.getRentsByUnit = function(unitID){
        return $http.get(serviceBase + 'unit_rents?uid=' + unitID);
    }
    obj.getRentsRange = function(buildingID){
        return $http.get(serviceBase + 'getRentsRange?id=' + buildingID);
    }
    
    obj.getRent = function( rentID ){
        return $http.get(serviceBase + 'rent?id=' + rentID);
    }

    obj.insertRent = function (rent) {       
       return $http.post(serviceBase + 'insertRent', rent).then(function (results) {           
         return results;
        });
	};

	obj.updateRent = function (id,rent) {
	    return $http.post(serviceBase + 'updateRent', {id:id, rent:rent}).then(function (status) {
	        return status.data;
	    });
	};

	obj.deleteRent = function (id) {
	    return $http.delete(serviceBase + 'deleteRent?id=' + id).then(function (status) {
	        return status.data;
	    });
	};
	
	obj.addRents = function (id,m,y) {
	    return $http.get(serviceBase + 'addRents?id=' + id+'&m=' + m + "&y=" + y).then(function (status) {
	        return status.data;
	    });
	};
	
	
    //prices
    obj.getPrices = function( unitid ){
        return $http.get(serviceBase + 'prices?id=' + unitid);
    }
    
    obj.getPrice = function( priceID ){
        return $http.get(serviceBase + 'price?id=' + priceID);
    }
    
    obj.insertPrice = function (price) {       
       return $http.post(serviceBase + 'insertPrice', price)
       .then(function (results) {           
         return results;
        });
	};
    
	obj.updatePrice = function (id,price) {
	    return $http.post(serviceBase + 'updatePrice', {id:id, price:price}).then(function (status) {
	        return status.data;
	    });
	};

	obj.deletePrice = function (id) {
	    return $http.delete(serviceBase + 'deletePrice?id=' + id).then(function (status) {
	        return status.data;
	    });
	};
	
    return obj;   
}]);




app.controller('EditableRowCtrl', function($scope, $filter, $http) {
  $scope.users = [
    {id: 1, name: 'awesome user1', status: 2, group: 4, groupName: 'admin'},
    {id: 2, name: 'awesome user2', status: undefined, group: 3, groupName: 'vip'},
    {id: 3, name: 'awesome user3', status: 2, group: null}
  ]; 

  $scope.statuses = [
    {value: 1, text: 'status1'},
    {value: 2, text: 'status2'},
    {value: 3, text: 'status3'},
    {value: 4, text: 'status4'}
  ]; 



    $scope.groups = [
        {id: 1, text: 'user'},
        {id: 2, text: 'customer'},
        {id: 3, text: 'vip'},
        {id: 4, text: 'admin'}
    ];

//   $scope.groups = [];
//   $scope.loadGroups = function() {
//     return $scope.groups.length ? null : $http.get('/groups').success(function(data) {
//       $scope.groups = data;
//     });
//   };

  $scope.showGroup = function(user) {
    if(user.group && $scope.groups.length) {
      var selected = $filter('filter')($scope.groups, {id: user.group});
      return selected.length ? selected[0].text : 'Not set';
    } else {
      return user.groupName || 'Not set';
    }
  };

  $scope.showStatus = function(user) {
    var selected = [];
    if(user.status) {
      selected = $filter('filter')($scope.statuses, {value: user.status});
    }
    return selected.length ? selected[0].text : 'Not set';
  };

  $scope.checkName = function(data, id) {
    if (id === 2 && data !== 'awesome') {
      return "Username 2 should be `awesome`";
    }
  };

  $scope.saveUser = function(data, id) {
    //$scope.user not updated yet
    angular.extend(data, {id: id});
    return $http.post('/saveUser', data);
  };

  // remove user
  $scope.removeUser = function(index) {
    $scope.users.splice(index, 1);
  };

  // add user
  $scope.addUser = function() {
    $scope.inserted = {
      id: $scope.users.length+1,
      name: '',
      status: null,
      group: null 
    };
    $scope.users.push($scope.inserted);
  };
  
  
});



app.controller('listCtrl', function ($scope, services) {
    services
    .addRents(9)
    .then(function(data){
        $scope.result = data.data;
    });
});

app.controller('listCtrlTenants', function ($scope, services) {
    services.getTenants().then(function(data){
        $scope.tenants = data.data;
    });
});

// app.controller('listCtrlBuildings', function ($scope, services) {
//     services
//     .getBuildings()
//     .then(function(data){
//         $scope.buildings = data.data;
//     });
// 
//     $scope.getUnitsByBuilding = function(bid){
//          services
//          .getUnits(bid)
//          .then(function(data){
//              $scope.units = data.data;
//          });
//     }
// 
//     $scope.getRentsByUnit = function(unitID) {
//            var uid = unitID;
//            services
//            .getRentsByUnit(uid)
//            .then(function(data){
//                $scope.rents = data.data;
//            });
//     }
// 
// 
// });

app.controller('MainCtrl',function ($scope, services, $routeParams, $rootScope, $window) {
  $scope.switchToUnits = function(buildingID) {
    setTimeout(function() {
      $window.location.href="#/edit-building-units/"+buildingID;
    });
  };
  $scope.switchToRents = function(buildingID) {
    setTimeout(function() {
      $window.location.href="#/edit-building-rents/"+buildingID;
    });
  };
  $scope.switchToTenants = function(buildingID) {
    setTimeout(function() {
      $window.location.href="#/edit-building-tenants/"+buildingID;
    });
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
        .getRents(unitID)
        .then(function(data){
            $scope.rents = data.data;
        });
        
      $scope.deleteUnit = function(unit) {
        if(confirm("Are you sure to delete Unit: " + unit.unitid)==true)
            services.deleteUnit(unit);
      };
    
});
app.controller('listCtrlPrices', function ($scope, services, $routeParams, $rootScope) {
    var unitid = ($routeParams.unitid) ? ($routeParams.unitid) : '%';
    services.getPrices(unitid).then(function(data){
            $scope.prices = data.data;
        });
    $scope.search = unitid;   
});


app.directive('monthYear', monthYearDirective)
        .controller('monthYearDirectiveController', monthYearDirectiveController);

    monthYearDirective.$inject = [];

    function monthYearDirective() {
        var directive = {
            templateUrl: 'partials/monthYear-directive.html',
            restrict: 'EA',
            controller: 'monthYearDirectiveController'
        };
        return directive;
    }
    
    monthYearDirectiveController.$inject = ['$scope','services','$cookies','$cookieStore'];

    function monthYearDirectiveController($scope,services,$cookies,$cookieStore){
    $scope.months = [
        { label: 'All', value: ''},
        { label: 'January', value: 'Jan'},
        { label: 'February', value: 'Feb'},
        { label: 'March', value: 'Mar'},
        { label: 'April', value: 'Apr'},
        { label: 'May', value: 'May'},
        { label: 'June', value: 'Jun'},
        { label: 'July', value: 'Jul'},
        { label: 'August', value: 'Aug'},
        { label: 'September', value: 'Sep'},
        { label: 'October', value: 'Oct'},
        { label: 'November', value: 'Nov'},
        { label: 'December', value: 'Dec'}
    ];
      

        var d = new Date(),
            m = d.getMonth(),   
            yearStart = 1991,
            yearEnd = 2015,
            current = d.getFullYear(),
            years = [{ label: 'All', value: ''}],
            year = 0;
            
        while(yearStart < yearEnd+1){ 
           year = yearStart++;
           years.push({'label': year, 'value' : year})  ;
        }
        
        //initialize dropdowns and cookies if needed      
        $scope.m = !$cookieStore.get('month')  ?  _.findIndex($scope.months,{label: m, value: m}) : _.findIndex($scope.months, $cookieStore.get('month'));
        $scope.y = !$cookieStore.get('year')   ?  _.findIndex(years,{label: current, value: current}) : _.findIndex(years, $cookieStore.get('year'));
        $scope.years = years;
        
        // if dropdown is changed set cookies.
        $scope.yearChanged = function(){
            $cookieStore.put('year', $scope.year);
            
        }
        $scope.monthChanged = function(){
            $cookieStore.put('month', $scope.month);
        }
        
    }





// app.controller('editCtrlBuilding', function ($scope, $rootScope, $location, $routeParams, services, building, $log) {
//     var buildingID = ($routeParams.buildingID) ? parseInt($routeParams.buildingID) : 0;
//     $rootScope.title = (buildingID > 0) ? 'Edit Building' : 'Add Building';
//     $scope.buttonText = (buildingID > 0) ? 'Update Building' : 'Add New Building';
//       var original = building.data;
//       original._id = buildingID;
//       $scope.building = angular.copy(original);
//       $scope.building._id = buildingID;
//       
//       $scope.isClean = function() {
//         return angular.equals(original, $scope.building);
//       }
//       
//       $scope.changeInactive = function(val) {
//         if(val == 1) {
//             if(confirm("Are you sure you want to deactivate : "+$scope.building.name)==true){
//                 $scope.building.inactive = '1';
//             }else{
//                 $scope.building.inactive = '0';
//             }
//         }
//       };
//       
//       
//       $scope.deleteBuilding = function(building) {
//         $location.path('/buildings');
//         if(confirm("Are you sure to delete building name: "+$scope.building._id)==true)
//         services.deleteBuilding(building.building_id);
//       };
// 
//       $scope.saveBuilding = function(building) {
//         $location.path('/buildings');
//         if (buildingID <= 0) {
//             $log.log("save building");
//             services.insertBuilding(building);
//         }
//         else {
//             services.updateBuilding(buildingID, building);
//         }
//     };
// });





// app.controller('editCtrlUnit', function ($scope, $rootScope, $location, $routeParams, services, unit, $log, $window) {
//     var buildingID = ($routeParams.buildingID);
//     var unitID = ($routeParams.unitID) ? parseInt($routeParams.unitID) : 0;
//     var building = {};
//     $rootScope.title = (unitID > 0) ? 'Edit Unit' : 'Add Unit';
//     $scope.buttonText = (unitID > 0) ? 'Update Unit' : 'Add Unit';
//     var original = unit.data || {};
//     original._id = unitID;
//     $scope.unit = angular.copy(original);
//     $scope.unit._id = unitID;
//     $scope.unit.building_id = buildingID;
// 
//     services.getBuilding(buildingID).then(function(data){
//         building = data.data;
//         $scope.unit.building = building.name;
//     });
//     services.getBuilding(buildingID).then(function(data){
//         building = data.data;
//         $scope.unit.building = building.name;
//     });
//     
//     $scope.options = [
//         { label: '1 Bedroom', value: '1 Bedroom'},
//         { label: '2 Bedroom', value: '2 Bedroom'}
//     ];
//     $scope.items = [
//         { label: 'Vacant', value: 'Vacant'},
//         { label: 'Occupied', value: 'Occupied'}
//     ];
//    
//     services.getUnits(buildingID).then(function(data){
//         $scope.unitsList = data.data;
//         if(unitID == 0) {
//             if($scope.unitsList.length){
//                 var tmp = (_.max($scope.unitsList,'unitnum')).unitnum;
//                 $scope.unit.unitnum = parseInt(tmp) + 1;
//             }
//             else{
//                 $scope.unit.unitnum = 1;
//             }
//             $scope.unit.unitid = $scope.unit.building+"/"+$scope.unit.unitnum;
//             $scope.unit.price = $rootScope.price || 0;
//             $scope.unit.tenant_id =  0  ;
//             $scope.unit.total_bal_due = 0;
//             $scope.unit.type = $scope.options[0].value;
//             $scope.unit.status = $scope.items[0].value;
//         }
//     });
//         
//       $scope.isClean = function() {
//         return angular.equals(original, $scope.unit);
//       }
// 
//       $scope.deleteUnit = function(unit) {
//         $location.path('/edit-building-units/' + buildingID );
//         if(confirm("Are you sure you want to delete unit name: "+$scope.unit._id)==true)
//             services.deleteUnit(unit.unit_id);
//       };
//       
//       $scope.nextUnit = function(unit, event) {
//         if(unitID > 0) {
//             if(confirm("Do you want to save your changes: "+$scope.unit.unitid)==true)
//                 services.updateUnit(unitID, unit);
//                         setTimeout(function() {
//                         //$window.location.href="#/edit-unit/"+buildingID+"/"+unitID;                        
//             });
//         }
//         else
//         {
//             event.preventDefault();
//         }
//         
//       };
//       
//       $scope.addTenant = function(unitD) {
//         setTimeout(function() {
//           $window.location.href="#/add-tenant/"+buildingID+"/"+unitID+"/0";
//         });
//       };
// 
// 
//             
//       $scope.saveUnit = function(unit, event) {
//         if (unitID <= 0) {
//             var d = new Date();
//             if(event.target.id == 'add'){
//                 $location.path('/edit-unit/' + buildingID + '/0?time=' +  d.getMilliseconds() ); 
//             }else
//             {
//                 $location.path('/edit-building-units/' + buildingID ); 
//             }
//             $rootScope.price = $scope.unit.price;
//             services.insertUnit(unit);
//         }
//         else {
//            $location.path('/edit-building-units/' + buildingID ); 
//            $rootScope.price = $scope.unit.price;
//            services.updateUnit(unitID, unit);
//         }
//     };
// });
app.controller('editCtrlPrice', function ($scope, $rootScope, $location, $routeParams, services, price, $log, $window) {
    var priceID = ($routeParams.priceID) ? parseInt($routeParams.priceID) : 0;
    var buildingID = ($routeParams.buildingID);
    var unitID = ($routeParams.unitID);
    $rootScope.title = (priceID > 0) ? 'Edit Price' : 'Add Price';
    $scope.buttonText = (priceID > 0) ? 'Edit Price' : 'Add Price';   
    var original = price.data || {};
    original._id = priceID;
    $scope.price = angular.copy(original);
    $scope.price._id = priceID;
    $scope.price.building_id = buildingID;
    $scope.price.unit_id = unitID;
    
      $scope.isClean = function() {
        return angular.equals(original, $scope.price);
      }

      $scope.deletePrice = function(price) {
        $location.path('/edit-price/' + unitID );
        if(confirm("Are you sure to delete price name: "+$scope.price._id)==true)
        services.deletePrice(price.price_id);
      };
        
      $scope.savePrice = function(price) {
        $location.path('/prices/'+buildingID + '/' + unitID ); 
        if (priceID <= 0) {
            services.insertPrice(price);
        }
        else {
            services.updatePrice(priceID, price);
        }
                
        
    };
});
// app.controller('editCtrlRents', function ($scope, $rootScope, $location, $routeParams, services, building, $log, $window) {
//     var buildingID = ($routeParams.buildingID) ? parseInt($routeParams.buildingID) : 0;
//     $rootScope.title = (buildingID > 0) ? 'Edit Rents' : 'Add Rents';
//     $scope.buttonText = (buildingID > 0) ? 'Update Rents' : 'Add New Rents';
//       var original = building.data;
//       original._id = buildingID;
//       $scope.building = angular.copy(original);
//       $scope.building._id = buildingID;
//       
//     services
//     .getBuildingsList()
//     .then(function(data){
//         $scope.list = data.data;
//     });
// 
//     
//     services
//     .getRentsRange(buildingID)
//     .then(function(data){
//         $scope.age = data.data;
//     });
// 
//     
//     services.getRents(buildingID)
//     .then(function(data){
//         $scope.rents = data.data;
//     });
//     
//       $scope.isClean = function() {
//         return angular.equals(original, $scope.building);
//       }
//     
//       $scope.addRents = function(building, month, year) {
//       	var month = month;
//       	var year = year;
//        $location.path('/edit-building-rents/' + buildingID);
//         if(confirm("We will now create rents for Building:" + buildingID + "/" + month+"/"+year)==true){
//             services.addRents(buildingID,month,year)
//             .then(function(){  
//             $window.location.reload()
//             });
//         }
//       };
// 
//       $scope.deleteBuilding = function(building) {
//         $location.path('/buildings');
//         if(confirm("Are you sure to delete building name: "+$scope.building._id)==true)
//         services.deleteBuilding(building.building_id);
//       };
// 
//       $scope.saveBuilding = function(building) {
//         $location.path('/buildings');
//         if (buildingID <= 0) {
//             services.insertBuilding(building);
//         }
//         else {
//             services.updateBuilding(buildingID, building);
//         }
//     };
//     
//     
// });
// app.controller('editCtrlUnits', function ($scope, $rootScope, $location, $routeParams, services, building, $log) {
//     var buildingID = ($routeParams.buildingID) ? parseInt($routeParams.buildingID) : 0;
//     $rootScope.title = (buildingID > 0) ? 'Edit Units' : 'Add Units';
//     $scope.buttonText = (buildingID > 0) ? 'Update Units' : 'Add New Units';
//       var original = building.data;
//       original._id = buildingID;
//       $scope.building = angular.copy(original);
//       $scope.building._id = buildingID;
// 
//     services.getUnits(buildingID).then(function(data){
//         $scope.units = data.data;
//     });
//     
//     services
//     .getBuildingsList()
//     .then(function(data){
//         $scope.list = data.data;
//     });
//     
//       $scope.isClean = function() {
//         return angular.equals(original, $scope.building);
//       }
//     
//       $scope.deleteUnit = function(unit) {
//         if(unit.tenant_id == null) {
//             $location.path('#');
//             if(confirm("Are you sure want to delete Unit name: "+unit.unitid)==true){
//                 services.deleteUnit(unit.unit_id);
//             }
//         }
//         else{
//             alert("You cannot delete a unit that has tenants. Delete the tenants first.");
//         }
//       };
// 
//       $scope.saveBuilding = function(building) {
//         $location.path('/buildings');
//         if (buildingID <= 0) {
//             $log.log("save building");
//             services.insertBuilding(building);
//         }
//         else {
//             services.updateBuilding(buildingID, building);
//         }
//     };
// });

// app.controller('editCtrlTenants', function ($scope, $rootScope, $location, $routeParams, services, building, $log) {
//     var buildingID = ($routeParams.buildingID) ? parseInt($routeParams.buildingID) : 0;
//     $rootScope.title = (buildingID > 0) ? 'Edit tenants' : 'Add tenants';
//     $scope.buttonText = (buildingID > 0) ? 'Update tenants' : 'Add New tenants';
//       var original = building.data;
//       original._id = buildingID;
//       $scope.building = angular.copy(original);
//       $scope.building._id = buildingID;
//       
//     services.getTenants(buildingID).then(function(data){
//         $scope.tenants = data.data;
//     });
//     services
//     .getBuildingsList()
//     .then(function(data){
//         $scope.list = data.data;
//     });
//       $scope.isClean = function() {
//         return angular.equals(original, $scope.building);
//       }
//     
//       $scope.deleteTenant = function(building) {
//         $location.path('/buildings');
//         if(confirm("Are you sure to delete tenant name: "+$scope.building._id)==true)
//         services.deleteTenant(building.building_id);
//       };
// 
//       $scope.saveTenant = function(building) {
//         $location.path('/buildings');
//         if (buildingID <= 0) {
//             $log.log("save tenant");
//             services.insertTenant(building);
//         }
//         else {
//             services.updateTenant(buildingID, building);
//         }
//     };
// });

// app.controller('editCtrlTenant', function ($scope, $rootScope, $location, $routeParams, services, tenant) {
//     var tenantID = ($routeParams.tenantID) ? parseInt($routeParams.tenantID) : 0;    
//     var buildingID = ($routeParams.buildingID);
//     var unitID = ($routeParams.unitID);
//     $rootScope.title = (tenantID > 0) ? 'Edit tenant' : 'Add tenant';
//     $scope.buttonText = (tenantID > 0) ? 'Update tenant' : 'Add New tenant';
//     var original = tenant.data || {};
//     original._id = tenantID;
//     $scope.tenant = angular.copy(original);
//     $scope.tenant._id = tenantID;
//     $scope.tenant.building_id = buildingID;
//     $scope.tenant.unit_id = unitID;
// 
// 
//     services.getBuilding(buildingID).then(function(data){
//         $scope.building = data.data;
//     });
//     services.getUnit(unitID).then(function(data){
//         $scope.unit = data.data;
//     });
//     
//     services.getTenantRents(tenantID).then(function(data){
//         $scope.rents = data.data;
//     });
//     
//       $scope.isClean = function() {
//         return angular.equals(original, $scope.tenant);
//       }
//       
//       $scope.moveIn = function() {
//         alert("coming soon");  
//       }
//       
//       $scope.moveOut = function(unit) {
//           if(confirm("Move this tenant out?: #"+unit.tenant_id)==true) {
//             unit.tenant_id = 0;
//             unit.tenant = 'Vacant';
//             services.updateUnit(unit.unit_id, unit);
//         }
//       };
// 
//       $scope.deleteTenant = function(tenantID) {
//         $location.path('/edit-building-units/'+buildingID);
//         if(confirm("Are you sure to delete tenant number: "+tenantID)==true)
//             services.deleteTenant(tenantID);
//       };
// 
//       $scope.saveTenant = function(tenant) {
//         $location.path('/edit-building-units/'+buildingID);
//         if (tenantID <= 0) {
//             services.insertTenant(tenant);
//         }
//         else {
//             services.updateTenant(tenantID, tenant);
//         }
//     };
// });

// app.controller('editCtrlRent', function ($scope, $rootScope, $location, $routeParams, services, rent) {
//     var rentID = ($routeParams.rentID) ? parseInt($routeParams.rentID) : 0;    
//     var buildingID = ($routeParams.buildingID);
//     var unitID = ($routeParams.unitID);
// 
//     $rootScope.title = (rentID > 0) ? 'Edit Rent' : 'Add Rent';
//     $scope.buttonText = (rentID > 0) ? 'Update Rent' : 'Add New Rent';
//     var original = rent.data || {};
//     original._id = rentID;
//     $scope.rent = angular.copy(original);
//     $scope.rent._id = rentID;
//     $scope.rent.unit_id = unitID;
//     $scope.rent.building_id = buildingID;
// 
//     $scope.calcDue = function() { 
//         $scope.rent.due_this_mo = $scope.rent.rent_owed - $scope.rent.rent_paid - $scope.rent.adjustment;
//     }
//     
//     services.getBuilding(buildingID).then(function(data){
//         $scope.building = data.data;
//     });
//     services.getUnit(unitID).then(function(data){
//         $scope.unit = data.data;
//     });
//     
//       $scope.isClean = function() {
//         return angular.equals(original, $scope.rent);
//       }
// 
//       $scope.deleteRent = function(rent) {
//         $location.path('/edit-building-rents/' + buildingID);
//         if(confirm("Are you sure to delete rent id: "+$scope.rent._id)==true)
//         services.deleteRent(rentID);
//       };
// 
//       $scope.saveRent = function(rent) {
//         $location.path('/edit-building-rents/' + buildingID);
//         if (rentID <= 0) {
//             services.insertRent(rent);
//         }
//         else {
//             services.updateRent(rentID, rent);
//         }
//     };
// });
app.controller('DatepickerDemoCtrl', function ($scope) {
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

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 2);
  $scope.events =
    [
      {
        date: tomorrow,
        status: 'full'
      },
      {
        date: afterTomorrow,
        status: 'partially'
      }
    ];

  $scope.getDayClass = function(date, mode) {
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i=0;i<$scope.events.length;i++){
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  };
});
app.controller('DropdownCtrl', function ($scope, $log) {

  $scope.status = {
    isopen: false
  };

//   $scope.toggled = function(open) {  
//     $log.log('Dropdown is now: ', open);
//   };

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
        templateUrl: 'app/buildings/buildings.html',
        controller: 'listCtrlBuildings'
      })
      .when('/dashboard', {
        title: 'Dashboard',
        templateUrl: 'partials/dashboard.html',
        controller: 'listCtrl'
      })      
      .when('/tenants/:buildingID', {
        title: 'Tenants',
        templateUrl: 'app/tenants/tenants.html',
        controller: 'listCtrlTenants'
      })      
      .when('/lastInsertID', {
        title: 'last insert ID',
        templateUrl: 'partials/results.html',
        controller: 'listCtrl'
      })      
      .when('/units/:buildingID', {
        title: 'Units',
        templateUrl: 'app/units/units.html',
        controller: 'listCtrlUnits'
      })      
      .when('/prices/:unitid', {
        title: 'Prices',
        templateUrl: 'app/prices/prices.html',
        controller: 'listCtrlPrices'
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
      .when('/edit-price/:buildingID/:unitID/:priceID', {
        title: 'Edit Price',
        templateUrl: 'app/prices/edit-price.html',
        controller: 'editCtrlPrice',
        resolve: {
          price: function(services, $route){
            var priceID = $route.current.params.priceID;
            return services.getPrice(priceID);
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
      .otherwise({
        redirectTo: '/'
      });
}]);
app.run(['$location', '$rootScope', function($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
    
}]);