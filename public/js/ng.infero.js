
var app = angular.module('Infero',[]);

app.controller('InferoController',function($scope,$http){
	$scope.user = {};
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
				Materialize.toast("Updated handle information!",2000);
			}
		},function myError(res){
			console.log("Error in updating handles");
		});		
	}
});