var app = angular.module('myApp', ['ngRoute','ui.bootstrap','snap','ngCookies']);
app.factory("services", ['$http', function($http) {
  var serviceBase = 'services/'
    var obj = {};
       
    // Tenents
    obj.getLastInsertID = function() {
        return $http.get(serviceBase + 'lastInsertID');
    
    }
    
    obj.getFirstYear = function() {
        return $http.get(serviceBase + 'firstYear');
    
    }
    obj.getLastYear = function() {
        return $http.get(serviceBase + 'lastYear');
    
    }
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
    obj.getTenentRents = function(tenentID){
        return $http.get(serviceBase + 'tenent_rents?id=' + tenentID);
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


app.controller('listCtrl', function ($scope, services) {
    services
    .addRents(9)
    .then(function(data){
        $scope.result = data.data;
    });
});

app.controller('listCtrlTenents', function ($scope, services) {
    services.getTenents().then(function(data){
        $scope.tenents = data.data;
    });
});

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
      $window.location.href="#/edit-building-tenents/"+buildingID;
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





app.controller('editCtrlUnit', function ($scope, $rootScope, $location, $routeParams, services, unit, $log, $window) {
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
     
    services.getUnits(buildingID).then(function(data){
        $scope.unitsList = data.data;
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
      $scope.nextUnit = function(unit) {
        if(confirm("Do you want to save your changes: "+$scope.unit._id)==true)
        services.updateUnit(unitID, unit);
      };
      
      $scope.addTenant = function(unitD) {
        setTimeout(function() {
          $window.location.href="#/add-tenent/"+buildingID+"/"+unitID+"/0";
        });
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
    
      $scope.deleteBuilding = function(building) {
        $location.path('#');
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
    services
    .getBuildingsList()
    .then(function(data){
        $scope.list = data.data;
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
    var unitID = ($routeParams.unitID);
    $rootScope.title = (tenentID > 0) ? 'Edit Tenent' : 'Add Tenent';
    $scope.buttonText = (tenentID > 0) ? 'Update Tenent' : 'Add New Tenent';
    var original = tenent.data || {};
    original._id = tenentID;
    $scope.tenent = angular.copy(original);
    $scope.tenent._id = tenentID;
    $scope.tenent.building_id = buildingID;
    $scope.tenent.unit_id = unitID;


    services.getBuilding(buildingID).then(function(data){
        $scope.building = data.data;
    });
    services.getUnit(unitID).then(function(data){
        $scope.unit = data.data;
    });
    
    services.getTenentRents(tenentID).then(function(data){
        $scope.rents = data.data;
    });
    
      $scope.isClean = function() {
        return angular.equals(original, $scope.tenent);
      }
      
      $scope.moveIn = function() {
        alert("coming soon");  
      }
      
       $scope.moveOut = function() {
        alert("coming soon");  
      }
     

      $scope.deleteTenent = function(tenentID) {
        $location.path('/edit-tenent/'+buildingID+'/'+unitID+'/'+tenentID);
        if(confirm("Are you sure to delete tenent number: "+tenentID)==true)
        services.deleteTenent(tenentID);
      };

      $scope.saveTenent = function(tenent) {
        $location.path('/edit-tenent/'+buildingID+'/'+unitID+'/'+tenentID);
        if (tenentID <= 0) {
            services.insertTenent(tenent);
        }
        else {
            services.updateTenent(tenentID, tenent);
        }
    };
});
app.controller('editCtrlRent', function ($scope, $rootScope, $location, $routeParams, services, rent) {
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
        templateUrl: 'partials/buildings.html',
        controller: 'listCtrlBuildings'
      })
      .when('/dashboard', {
        title: 'Dashboard',
        templateUrl: 'partials/dashboard.html',
        controller: 'listCtrl'
      })      
      .when('/tenents/:buildingID', {
        title: 'Tenents',
        templateUrl: 'partials/tenents.html',
        controller: 'listCtrlTenents'
      })      
      .when('/lastInsertID', {
        title: 'last insert ID',
        templateUrl: 'partials/results.html',
        controller: 'listCtrl'
      })      
      .when('/units/:buildingID', {
        title: 'Units',
        templateUrl: 'partials/units.html',
        controller: 'listCtrlUnits'
      })      
      .when('/prices/:unitid', {
        title: 'prices',
        templateUrl: 'partials/prices.html',
        controller: 'listCtrlPrices'
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
      .when('/edit-building-rents/:buildingID', {
        title: 'Edit Rents',
        templateUrl: 'partials/edit-building-rents.html',
        controller: 'editCtrlRents',
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
      .when('/edit-price/:buildingID/:unitID/:priceID', {
        title: 'Edit Price',
        templateUrl: 'partials/edit-price.html',
        controller: 'editCtrlPrice',
        resolve: {
          price: function(services, $route){
            var priceID = $route.current.params.priceID;
            return services.getPrice(priceID);
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
      .when('/edit-tenent/:buildingID/:unitID/:tenentID', {
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
      .when('/add-tenent/:buildingID/:unitID/:tenentID', {
        title: 'Edit Tenents',
        templateUrl: 'partials/add-tenent.html',
        controller: 'editCtrlTenent',
        resolve: {
          tenent: function(services, $route){
            var tenentID = $route.current.params.tenentID;
            return services.getTenent(tenentID);
          }
        }
      })
      .when('/edit-rent/:buildingID/:unitID/:rentID', {
        title: 'Edit Rent',
        templateUrl: 'partials/edit-rent.html',
        controller: 'editCtrlRent',
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