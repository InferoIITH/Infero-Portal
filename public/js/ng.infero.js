
var app = angular.module('Infero',[]);

app.controller('InferoController',function($scope,$http){
	$scope.user = {};
	$scope.users = [];
	$scope.user.loggedIn = false;

	$http({
		method : "GET",
		url : '/checkLoginStatus'
	}).then(function mySuccess(res){
		if(res.data.status) {
			$scope.user = res.data.user;
			$scope.user.loggedIn = true;
		}
	},function myError(res){
		console.log("Error in checking login status");
	});

	$http({
		method : "GET",
		url    : '/ranks/getStandings'
	}).then(function mySuccess(res){
		if(res.data.status){
			$scope.users = res.data.users;
			for(var i = 0; i < $scope.users.length; i++)
			{
				var z = (parseFloat($scope.users[i].codeforces.rating)*0.5) + (0.25*(parseFloat($scope.users[i].codechef.rating) + parseFloat($scope.users[i].hackerrank.rating)));
				$scope.users[i].netRating = z.toString();
			}
			
		}
	   },function myError(res){
	   	console.log("Error in getting all users");
	});

	$scope.updateInfo = function() {
		$("#cforces").val($scope.user.codeforces.handle);
		$("#spoj").val($scope.user.spoj.handle);
		$("#hrank").val($scope.user.hackerrank.handle);
		$("#cchef").val($scope.user.codechef.handle);
		$("#a20j").val($scope.user.a20j.handle);
		$("#ghub").val($scope.user.github.handle);
		$("#hearth").val($scope.user.hackerearth.handle);

		$("#updateHandles").modal("open");	
	}

	$scope.updateHandles = function(){
		var info = {
			'codeforces' : $("#cforces").val(),
			'spoj'       : $("#spoj").val(),
			'hackerrank' : $("#hrank").val(),
			'codechef'   : $("#cchef").val(),
			'a20j'       : $("#a20j").val(),
			'github'     : $("#ghub").val(),
			'hackerearth': $('#hearth').val()
		}
		$http({
			method : "POST",
			url : '/profile/updateHandles',
			data: info
		}).then(function mySuccess(res){
			if(res.data.status) {
				Materialize.toast("Updated handle information, please reload to see changes!",2000);
			}
		},function myError(res){
			console.log("Error in updating handles");
		});		
	}
});