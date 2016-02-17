/**
 * @author PradoArturo
 */

angular.module('modalTest', [
    'ui.bootstrap',
    'dialogs'
]).controller('dialogServiceTest', function ($scope, $rootScope, $timeout, $dialogs) {
    $scope.confirmed = 'You have yet to be confirmed!';
    $scope.name = '"Your name here."';
    $scope.launch = function (which) {
        var dlg = null;
        switch (which) {
        case 'error':
            dlg = $dialogs.error('This is my error message');
            break;
        case 'wait':
            dlg = $dialogs.wait(msgs[i++], progress);
            fakeProgress();
            break;
        case 'notify':
            dlg = $dialogs.notify('Something Happened!', 'Something happened that I need to tell you.');
            break;
        case 'confirm':
            dlg = $dialogs.confirm('Please Confirm', 'Is this awesome or what?');
            dlg.result.then(function (btn) {
                $scope.confirmed = 'You thought this quite awesome!';
            }, function (btn) {
                $scope.confirmed = 'Shame on you for not thinking this is awesome!';
            });
            break;
        case 'create':
            dlg = $dialogs.create('/dialogs/whatsyourname.html', 'whatsYourNameCtrl', {}, {
                key: false,
                back: 'static'
            });
            dlg.result.then(function (name) {
                $scope.name = name;
            }, function () {
                $scope.name = 'You decided not to enter in your name, that makes me sad.';
            });
            break;
        }
        ;
    };
    var progress = 25;
    var msgs = [
        'Hey! I\'m waiting here...',
        'About half way done...',
        'Almost there?',
        'Woo Hoo! I made it!'
    ];
    var i = 0;
    var fakeProgress = function () {
        $timeout(function () {
            if (progress < 100) {
                progress += 25;
                $rootScope.$broadcast('dialogs.wait.progress', {
                    msg: msgs[i++],
                    'progress': progress
                });
                fakeProgress();
            } else {
                $rootScope.$broadcast('dialogs.wait.complete');
            }
        }, 1000);
    };
}).controller('whatsYourNameCtrl', function ($scope, $modalInstance, data) {
    $scope.user = { name: '' };
    $scope.cancel = function () {
        $modalInstance.dismiss('canceled');
    };
    $scope.save = function () {
        $modalInstance.close($scope.user.name);
    };
    $scope.hitEnter = function (evt) {
        if (angular.equals(evt.keyCode, 13) && !(angular.equals($scope.name, null) || angular.equals($scope.name, '')))
            $scope.save();
    };
});
