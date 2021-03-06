(function() {
    'use strict';
    angular
        .module('upload')
        .controller('SidebarController', SidebarController);

    function SidebarController(searchFilters, $location, $scope, UrlQueryService, sortOrders, dataservice, $window) {
        /*jshint validthis: true */
        var vm = this;
        var _priceRangeMin = 0;
        var _priceRangeMax = 300;
        vm.isCollapsed = true;
        vm.sortOrders = sortOrders;
        vm.reSort = reSort;
        vm.filters = searchFilters;
        vm.checkedItems = {};
        vm.clicked = clicked;
        vm.formatText = formatText;
        vm.setPriceRange = setPriceRange;
        vm.isTouch = isTouch;
        vm.priceRange = {
            step: 10,
            minMax: [_priceRangeMin, _priceRangeMax],
            'options': {
                range: true,
                stop: function() {
                    var min = vm.priceRange.minMax[0];
                    var max = vm.priceRange.minMax[1];
                    var step = vm.priceRange.step;
                    // set a minimum range offset of 10
                    if (min === max) {
                        if ((max + step) <= _priceRangeMax) {
                            max += step;
                        } else {
                            min -= step;
                        }
                    } //end of set range offset
                    $scope.$apply(UrlQueryService.addPriceFilter(min, max));
                }
            }
        };

        initSidebar();

        function initSidebar() {
            initSortSelection();
            initPriceRange();
            initChecks();
            initCollapsed();
        }

        function initSortSelection() {
            vm.currentSortValue = sortOrders[dataservice.getCurrentSortOrder()].value;
        }

        function initPriceRange() {
            var query = $location.search();
            if (query.min >= 0) {
                vm.priceRange.minMax[0] = parseInt(query.min, 10);
            }
            if (query.max >= 0) {
                vm.priceRange.minMax[1] = parseInt(query.max, 10);
            }
        }

        function reSort() {
            // find index of newSortValue in SORT_ORDER
            var pos = sortOrders.map(function(e) {
                return e.value;
            }).indexOf(vm.newSortValue);
            $location.search('sort', pos);
            //$location.path('/1');
        }

        function initChecks() {
            vm.query = $location.search();
            // category filters
            if (vm.query.category) {
                check(vm.query.category);
            }

            // sizes filters
            if (vm.query.sizes) {
                check(vm.query.sizes);
            }

            // color filters
            if (vm.query.colors) {
                check(vm.query.colors);
            }

            function check(list) {
                // see UrlQueryService.removeQuery on why we need to use [].concat
                list = [].concat(list);
                list.forEach(function(option) {
                    vm.checkedItems[option] = true;
                });
            }
        }

        function initCollapsed() {
            // if window width is < desktop
            vm.isCollapsed = ($window.innerWidth < 992);
        }

        function clicked(category, option) {
            if (vm.checkedItems[option]) {
                UrlQueryService.addQuery(category, option);
            } else {
                UrlQueryService.removeQuery(category, option);
            }
        }

        function formatText(string) {
            return string.replace(/_/g, ' ');
        }

        function setPriceRange() {
            var min = (Math.round(vm.priceRange.minMax[0] / 10) * 10);
            var max = (Math.round(vm.priceRange.minMax[1] / 10) * 10);
            if (min > max) {
                // do something
                console.warn('price range min > max');
                return false;
            }
            if (min === max) {
                // do something
                console.warn('price range min === max');
                return false;
            }
            if (vm.priceRangeForm.$valid) {
                UrlQueryService.addPriceFilter(min, max);
            }
        }

        function isTouch() {
            return Modernizr.touch;
        }
    }
})();
