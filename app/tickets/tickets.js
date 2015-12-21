app.config(['$routeProvider',function($routeProvider) {
    $routeProvider
      .when('/tickets', {
        title: 'Tickets',
        templateUrl: 'app/tickets/tickets.html',
        controller: 'listCtrlTickets'
      })      
      .when('/edit-ticket/:ticketID', {
        title: 'Edit Ticket',
        templateUrl: 'app/tickets/edit-ticket.html',
        controller: 'editCtrlTicket',
        resolve: {
          ticket: function(services, $route){
            var ticketID = $route.current.params.ticketID;
            return services.getTicket(ticketID);
          }
        }
      })
}]);


app.controller('listCtrlTickets', function ($scope, services) {
    services
    .getTickets()
    .then(function(data){
        $scope.tickets = data.data;
    });
    
    
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
app.controller('editCtrlTicket', function ($scope, $rootScope, $location, $routeParams, services, ticket, $log) {
    var ticketID = ($routeParams.ticketID) ? parseInt($routeParams.ticketID) : 0;
    var buildingID = ticket.data.building_id;
    var unitID = ticket.data.unit_id;
    var tenantID = ticket.data.tenant_id;
    $rootScope.title = (ticketID > 0) ? 'Edit ticket' : 'Add ticket';
    $scope.buttonText = (ticketID > 0) ? 'Update ticket' : 'Add New ticket';
      var original = ticket.data;
      original._id = ticketID;
      $scope.ticket = angular.copy(original);
      $scope.ticket._id = ticketID;
    
    services.getBuilding(buildingID).then(function(data){
        $scope.building = data.data;
    });
    services.getUnit(unitID).then(function(data){
        $scope.unit = data.data;
    });
    
    $scope.isClean = function() {
        return angular.equals(original, $scope.ticket);
    }
    
      $scope.cancelText = '/dbpm/#/tickets/';
    

      $scope.deleteTicket = function(ticket) {
        $location.path('/tickets');
        if(confirm("Are you sure to delete ticket name: "+$scope.ticket._id)==true)
        services.deleteTicket(ticket.ticket_id);
      };

      $scope.saveTicket = function(ticket) {
        $location.path('/tickets');
        if (ticketID <= 0) {
            $log.log("save ticket");
            services.insertTicket(ticket);
        }
        else {
            services.updateTicket(ticketID, ticket);
        }
    };
});

