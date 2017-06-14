function checkLoginStatus($scope,$http){
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

}

function getBlog($scope,$http){
	$http({
		method : "GET",
		url : '/getBlogs'
	}).then(function mySuccess(res){
		if(res.data.status) {
			$scope.blogs = res.data.blogs;

		}
	},function myError(res){
		console.log("Error in getting blogs");
	});

}

function getContests($scope,$http){
	$http({
		method : "GET",
		url : '/contests/getContests'
	}).then(function mySuccess(res){
		if(res.data.status) {
			$scope.contests.ongoing = res.data.ongoing;
			$scope.contests.past = res.data.past;
			$scope.contests.future = res.data.future;
		}
	},function myError(res){
		console.log("Error in getting blogs");
	});
}

function getStandings($scope,$http){
	$http({
		method : "GET",
		url    : '/ranks/getStandings'
	}).then(function mySuccess(res){
		if(res.data.status){
			$scope.users = res.data.users;
			for(var i = 0; i < $scope.users.length; i++)
			{
				var z = (parseFloat($scope.users[i].spoj.points)*300.0) + (parseFloat($scope.users[i].codeforces.rating)*0.5) + (0.25*(parseFloat($scope.users[i].codechef.rating) + parseFloat($scope.users[i].hackerrank.rating)));
				$scope.users[i].netRating = z.toString();
			}
			
		}
	   },function myError(res){
	   	console.log("Error in getting all users");
	});


}
var app = angular.module('Infero',['ngSanitize']);

app.controller('InferoController',function($scope,$http){
	$scope.user = {};
	$scope.users = [];
	$scope.user.loggedIn = false;
	$scope.blogs = [];
	$scope.contests = {'ongoing': [] , 'past': [] , 'future': []};

	checkLoginStatus($scope,$http);
	getBlog($scope,$http);
	getContests($scope,$http);
	getStandings($scope,$http);
	
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
	$scope.openBlogModal = function(){
		$("#newBlogModal").modal("open");	
	}

	$scope.newBlog = function() {
		var desc = $('#new_blog_desc').val(); 
		var nBlog = {
			title : $('#new_blog_title').val(),
			description : desc,
			author : $scope.user.Name
		}
		$http({
			method: "POST",
			url : '/newBlog',
			data : nBlog
		}).then(function mySuccess(res){
			if(res.data.status){
				Materialize.toast("Posted new blog!",2000);
				getBlog($scope,$http);
			}
		},function myError(res){
			console.log("error in posting new blog");
		});
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
				getStandings($scope,$http);

			}
		},function myError(res){
			console.log("Error in updating handles");
		});		
	}

	$scope.postComment = function(id) {
		var comment  = $('#comment'+id).val();

		var cmt = {'Name': $scope.user.Name, 'comment': comment, 'id': id};
		$http({
			method: "POST",
			url : '/newComment',
			data : cmt
		}).then(function mySuccess(res){
			if(res.data.status){
				Materialize.toast("Posted comment!",2000);
				getBlog($scope,$http);
			}
		},function myError(res){
			console.log("error in posting comment");
		});
		
	}
});
