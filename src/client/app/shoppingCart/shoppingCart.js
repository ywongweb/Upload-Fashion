(function() {
    'use strict';
    angular.module('upload')
        .controller('ShoppingCartController', ShoppingCartController);

    function ShoppingCartController($scope, ShoppingCart, $modalInstance, $state, cartEvents) {
        var vm = this;
        vm.cartContents =  ShoppingCart.getCartContents();
        vm.total = total;
        vm.detailView = detailView;
        vm.checkout = checkout;

        function total() {
            var totalCost = 0;
            angular.forEach(vm.cartContents, function(item) {
                totalCost += item.qty * item.price;
            });
            return totalCost;
        }

        function detailView(item) {
            $modalInstance.dismiss('go to detail view');
            $state.go('detail', {itemUid: item.uid});
        }

        function checkout() {
            ShoppingCart.checkout();
        }

        $scope.$on(cartEvents.checkout, function() {
            $modalInstance.dismiss('checkout complete');
            $state.go('thankyou');
        });

    }

}());
