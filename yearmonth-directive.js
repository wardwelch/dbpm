(function() {
    'use strict';

    angular
        .module('directives.monthYear', [])
        .directive('monthYear', monthYearDirective)
        .controller('monthYearDirectiveController', monthYearDirectiveController);

    monthYearDirective.$inject = ['componentPath'];

    function monthYearDirective(componentPath) {
        var directive = {
            scope: {},
            templateUrl: componentPath + '/policy-select/policy-select.html',
            restrict: 'EA',
            controller: 'monthYearDirectiveController as model'
        };
        return directive;
    }
    
    monthYearDirectiveController.$inject = ['PolicyFactory'];

    function monthYearDirectiveController(PolicyFactory){
        var model = this;
        model.monthYearOptions = PolicyFactory.monthYearOptions;
        model.selectedPolicyKey = PolicyFactory.selectedPolicy.key;

        model.selectPolicy = function(){
            PolicyFactory.setSelectedPolicy(model.selectedPolicyKey);
        }
    }
})();