app.config(['$routeProvider',function($routeProvider) {
    $routeProvider
      .when('/tickets', {
        title: 'tickets',
        templateUrl: 'app/tickets/tickets.html',
        controller: 'listCtrlTickets'
      })
      .when('/edit-ticket/:ticketID', {
        title: 'Edit Buildisng',
        templateUrl: 'app/tickets/edit-ticket.html',
        controller: 'editCtrlticket',
        resolve: {
          ticket: function(services, $route){
            var ticketID = $route.current.params.ticketID;
            return services.getticket(ticketID);
          }
        }
      })
}]);


app.controller('listCtrlTckets', function ($scope, services) {
    services
    .gettickets()
    .then(function(data){
        $scope.tickets = data.data;
    });
    
    
 });
    
app.controller('editCtrlticket', function ($scope, $rootScope, $location, $routeParams, services, ticket, $log) {
    var ticketID = ($routeParams.ticketID) ? parseInt($routeParams.ticketID) : 0;
    $rootScope.title = (ticketID > 0) ? 'Edit ticket' : 'Add ticket';
    $scope.buttonText = (ticketID > 0) ? 'Update ticket' : 'Add New ticket';
      var original = ticket.data;
      original._id = ticketID;
      $scope.ticket = angular.copy(original);
      $scope.ticket._id = ticketID;
      
      $scope.isClean = function() {
        return angular.equals(original, $scope.ticket);
      }
      
      $scope.changeInactive = function(val) {
        if(val == 1) {
            if(confirm("Are you sure you want to deactivate : "+$scope.ticket.name)==true){
                $scope.ticket.inactive = '1';
            }else{
                $scope.ticket.inactive = '0';
            }
        }
      };
      
      
      $scope.deleteticket = function(ticket) {
        $location.path('/tickets');
        if(confirm("Are you sure to delete ticket name: "+$scope.ticket._id)==true)
        services.deleteticket(ticket.ticket_id);
      };

      $scope.saveticket = function(ticket) {
        $location.path('/tickets');
        if (ticketID <= 0) {
            $log.log("save ticket");
            services.insertticket(ticket);
        }
        else {
            services.updateticket(ticketID, ticket);
        }
    };
});

