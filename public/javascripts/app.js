angular.module('app', [])
    .controller('adminCtrl',[
    '$scope',
    '$http',
    function($scope, $http) {
        $http.get("/admin")
        .success(function(response) {
            console.log(response);

            $scope.candidates = response;
        });
        $scope.addCandidate = function() {
            var candidate = {Name:$scope.name, Votes:0}
            $http.post("/admin",candidate)
                .success(function(response) {
                    console.log("Candidate Posted");
                });
        };

        $scope.deleteCandidate = function(candidate) {
            $http.delete("/admin/" + candidate._id)
                .success(function(response) {
                    console.log(response);
                });
        };

    }])
    .controller('voterCtrl',[
    '$scope',
    '$http',
    function($scope, $http) {
        $http.get("/voter")
        .success(function(response) {
            console.log(response);

            $scope.candidates = response;

            for (var i = 0; i < $scope.candidates.length; i++)
            {
                $scope.candidates[i].checked = false;
            }
        })

        $scope.incrementVote = function() {
            console.log($scope.candidates);

            angular.forEach($scope.candidates, function(candidate,key){
                if (candidate.checked == true){
                    $http.put("/admin/" + candidate._id + '/incrementVotes')
                        .success(function(response) {
                            console.log(response);
                        });
                }
            })

        };

    }])
