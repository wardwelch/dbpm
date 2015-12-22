
var app = angular.module('myApp', ['ui.event','ngRoute','ui.bootstrap','snap','ngCookies',"xeditable","mp.tabTrap"]);
app.factory("services", ['$http', function($http) {
  var serviceBase = 'services/'
    var obj = {};
       
    // tenants
    
    obj.login = function (user) {
        return $http.post(serviceBase + 'login', user).then(function (status) {
            return status.data;
        });
	};
    obj.getSession = function () {
        return $http.get(serviceBase + 'getSession').then(function (status) {
            return status.data;
        });
	};
    obj.destroySession = function () {
        return $http.get(serviceBase + 'destroySession').then(function (status) {
            return status.data;
        });
	};
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
    //Tickets	
    obj.getTickets = function(){
        return $http.get(serviceBase + 'tickets');
    }
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
    
    obj.getUnitsList = function(buildingID){
        return $http.get(serviceBase + 'unitsList?id=' + buildingID);
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
    
    obj.getRentsByDateRange = function(buildingID, unitID, d1, d2){
        return $http.get(serviceBase + 'getRentsByDateRange?id=' + buildingID + '&unit=' + unitID + '&d1=' + d1 + '&d2='+ d2 );
    }
    obj.getRentsByRent = function(rent){
                
        return $http.get(serviceBase + 'getRentsByMonth?id=' + rent.building_id + '& month=' + rent.month);
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


app.filter('unsafe', ['$sce', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
}]);


angular.module("template/popover/popover.html", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("template/popover/popover.html",
      "<div class=\"popover {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
      "  <div class=\"arrow\"></div>\n" +
      "\n" +
      "  <div class=\"popover-inner\">\n" +
      "      <h3 class=\"popover-title\" ng-bind-html=\"title | unsafe\" ng-show=\"title\"></h3>\n" +
      "      <div class=\"popover-content\"ng-bind-html=\"content | unsafe\"></div>\n" +
      "  </div>\n" +
      "</div>\n" +
      "");
}]);






app.controller('DashboardController', function ($scope, $rootScope, $location, $routeParams, $log, $window) {
    $rootScope.title =  'Dashboard';
});

app.controller('listCtrl', function ($scope, services) {
    services
    .addRents(9)
    .then(function(data){
        $scope.result = data.data;
    });
});

app.controller('LoginController', function ($scope, $location, $rootScope, $route, $log, services) {
    $rootScope.title =  'Login';
    $scope.buttonText = 'Login';   
    $scope.user = {};
    
    $scope.login = function (user) {  
        services.login(user).then(function(data) {
            if(data.status == "Success") {
               $location.path("#/buildings"); 
            }else{
               $scope.loginError = "Invalid user/pass.";             
            }
    });
    }
    	
});

app.controller('LogoutController', function ($scope, $location, $rootScope, $log, services) {
    services.destroySession().then(function(data){
        $log.log(data);   
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

app.directive('focusMe', function($timeout) {
  return {
    scope: { trigger: '@focusMe' },
    link: function(scope, element) {
      scope.$watch('trigger', function(value) {
        if(value === "true") { 
          $timeout(function() {
            element[0].focus(); 
          });
        }
      });
    }
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
            yearEnd = d.getFullYear(),
            current = d.getFullYear(),
            years = [{ label: 'All', value: ''}],
            year = 0;
            
        while(yearStart < current+1){ 
           year = yearStart++;
           years.push({'label': year, 'value' : year})  ;
        }
        
        if( !$cookieStore.get('month')){
            $cookieStore.put('month', $scope.months[m+1]);  
        }
        if( !$cookieStore.get('year')){
            $cookieStore.put('year', _.find(years,{label: current, value: current}) );  
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
      .when('/logout', {
        title: "Logout",
        templateUrl: 'partials/logout.html',
        controller: 'LogoutController'
      })      
      .when('/dashboard', {
        title: 'Dashboard',
        templateUrl: 'partials/dashboard.html',
        controller: 'DashboardController'
      })      
      .when('/login', {
        title: 'Login',
        templateUrl: 'partials/login.html',
        controller: 'LoginController'
      })      
      .when('/wo', {
        title: 'Work Orders',
        templateUrl: 'partials/wo.html',
        controller: 'WorkorderController'
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
        redirectTo: '/dashboard'
      });
}]);
app.run(['$location', '$rootScope', '$http', function($location, $rootScope, $http) {
    $rootScope.$on('$routeChangeStart', function (event, current, previous) {
        $rootScope.authenticated = false;
            $http.get('services/getSession').then(function (status) {
            console.log(status);
            var results = status.data;
            if (results.id) {
                $rootScope.authenticated = true;
                $rootScope.uid = results.id;
                $rootScope.username = results.username;
                $rootScope.email = results.email;
            } else {
                var nextUrl = current.$$route.originalPath;
                if (nextUrl == '/signup' || nextUrl == '/login') {

                } else {
                    $location.path("/login");
                }
            }
        });
    });
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
        $rootScope.today = function() {
            var d = new Date();
            return d.toLocaleDateString();
        }
    });
    $rootScope.$on( "$locationChangeStart", function(event, next, current) {
        
    });
}]);