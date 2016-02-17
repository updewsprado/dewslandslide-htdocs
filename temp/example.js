/**
 * @author PradoArturo
 */

angular.module('plunker', ['ui.bootstrap']);
var ModalDemoCtrlx = function ($scope, $modal, $log) {

  $scope.items = ['item1', 'item2', 'item3'];
  //$scope.node = "";

  $scope.open = function () {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: ModalInstanceCtrl,
      resolve: {
      	/*
        node: function () {
          return $scope.node;
        }
        */
      }
    });

    modalInstance.result.then(function (node) {
      //$scope.node = node;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
};

var ModalInstanceCtrlx = function ($scope, $modalInstance, node) {
  $scope.ok = function () {	
  	//$scope.node = node;
    $modalInstance.close($scope.node);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

var ModalDemoCtrl = function ($scope, $modal, $log) {

  $scope.items = ['item1', 'item2', 'item3'];
  $scope.name = "";

  $scope.open = function () {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: ModalInstanceCtrl,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
};

var ModalInstanceCtrl = function ($scope, $modalInstance, items) {
  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {	
  	
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};