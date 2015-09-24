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
            
        while(yearStart < current+1){ 
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
    $routeProvider
      .when('/dashboard', {
        title: 'Dashboard',
        templateUrl: 'partials/dashboard.html',
        controller: 'listCtrl'
      })      
      .when('/lastInsertID', {
        title: 'last insert ID',
        templateUrl: 'partials/results.html',
        controller: 'listCtrl'
      })      
      .when('/prices/:unitid', {
        title: 'Prices',
        templateUrl: 'app/prices/prices.html',
        controller: 'listCtrlPrices'
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
      .otherwise({
        redirectTo: '/'
      });
}]);
app.run(['$location', '$rootScope', function($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
    
}]);