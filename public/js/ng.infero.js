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
			var days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
			var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"]
			$scope.contests.ongoing = res.data.ongoing;
			for(var i = 0; i < $scope.contests.ongoing.length; i++)
			{
				var st = new Date($scope.contests.ongoing[i].starttime);
				var s = days[st.getDay()] + ", " + months[st.getMonth()] + " " + st.getDate() + " "+ st.getFullYear() + "  " + ("00"+st.getHours()).slice(-2) + ":" + ("00"+ st.getMinutes()).slice(-2) + ":" + ("00"+st.getSeconds()).slice(-2) + " hrs";
				$scope.contests.ongoing[i].start = s.toString();
				var en = new Date($scope.contests.ongoing[i].endtime);
				$scope.contests.ongoing[i].end = (days[en.getDay()] + ", " + months[en.getMonth()] + " " + en.getDate()+ " "+ en.getFullYear() + "  " + ("00"+en.getHours()).slice(-2) + ":" + ("00"+ en.getMinutes()).slice(-2) + ":" + ("00"+en.getSeconds()).slice(-2) + " hrs").toString();
			}
			$scope.contests.past = res.data.past;
			for(var i = 0; i < $scope.contests.past.length; i++)
			{
				var st = new Date($scope.contests.past[i].starttime);
				$scope.contests.past[i].start = (days[st.getDay()] + ", " + months[st.getMonth()] + " " + st.getDate() + " " +st.getFullYear() + "  " + ("00"+st.getHours()).slice(-2) + ":" + ("00"+ st.getMinutes()).slice(-2) + ":" + ("00"+st.getSeconds()).slice(-2) + " hrs").toString();
				var en = new Date($scope.contests.past[i].endtime);
				$scope.contests.past[i].end = (days[en.getDay()] + ", " + months[en.getMonth()] + " " + en.getDate()+ " "+ en.getFullYear() + "  " + ("00"+en.getHours()).slice(-2) + ":" + ("00"+ en.getMinutes()).slice(-2) + ":" + ("00"+en.getSeconds()).slice(-2) + " hrs").toString();
			}			
			$scope.contests.future = res.data.future;
			for(var i = 0; i < $scope.contests.future.length; i++)
			{
				var st = new Date($scope.contests.future[i].starttime);
				$scope.contests.future[i].start = (days[st.getDay()] + ", " + months[st.getMonth()] + " " + st.getDate()+ " "+st.getFullYear() + "  " + ("00"+st.getHours()).slice(-2) + ":" + ("00"+ st.getMinutes()).slice(-2) + ":" + ("00"+st.getSeconds()).slice(-2) + " hrs").toString();
				var en = new Date($scope.contests.future[i].endtime);
				$scope.contests.future[i].end = (days[en.getDay()] + ", " + months[en.getMonth()] + " " + en.getDate() + " "+ en.getFullYear() + "  " + ("00"+en.getHours()).slice(-2) + ":" + ("00"+ en.getMinutes()).slice(-2) + ":" + ("00"+en.getSeconds()).slice(-2) + " hrs").toString();
			}			
		}
	},function myError(res){
		console.log("Error in getting contests");
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

function getAssignments($scope,$http){
	$http({
		method : "GET",
		url    : '/assignments/getAssignments'
	}).then(function mySuccess(res){
		if(res.data.status){
			$scope.assignments = res.data.assignments;
			
		}	
	},function myError(res){
		console.log("Error in getting assignments")
	});
}
var app = angular.module('Infero',['ngSanitize']);

app.controller('InferoController',function($scope,$http){
	$scope.user = {};
	$scope.users = [];
	$scope.user.loggedIn = false;
	$scope.blogs = [];
	$scope.contests = {'ongoing': [] , 'past': [] , 'future': []};
	$scope.assignments = [];

	checkLoginStatus($scope,$http);
	getBlog($scope,$http);
	getContests($scope,$http);
	getStandings($scope,$http);
	getAssignments($scope,$http);

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

	
	$scope.submitLink = function(id,qid){
		var link = $('#'+qid).val();
	
		var usr = {'uid':$scope.user.id , 'link': link, 'id': id, 'qid': qid};
		console.log(usr);
		$http({
			method: "POST",
			url : 'assignments/submitLink',
		 	data : usr
					
		}).then(function mySuccess(res){
			if(res.data.status){
			Materialize.toast("Posted solution!",2000);
			getAssignments($scope,$http);
							
			}
					
		},function myError(res){
			console.log("error in posting solution");
					
		});	

			
	}

	$scope.checkSolved = function(problem){
		function checkIt(id){
			return problem.solved.filter(function(data){
				return data.id == id; 
			});
		}
		return checkIt($scope.user.id).length > 0
	}
	$scope.checkRejected = function(problem){
		function checkIt(id){
			return problem.rejected.filter(function(data){
				return data.id == id; 
			});
		}
		return checkIt($scope.user.id).length > 0;
	}
	$scope.postAssComment = function(id){
		var comment  = $('#assignment'+id).val();
		console.log(comment);
		var cmt = {'Name': $scope.user.Name, 'comment': comment, 'id': id};
		$http({
			method: "POST",
			url : 'assignments/newComment',
			data : cmt
		}).then(function mySuccess(res){
			if(res.data.status){
				Materialize.toast("Posted comment!",2000);
				getAssignments($scope,$http);
			}
		},function myError(res){
			console.log("error in posting comment");
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
