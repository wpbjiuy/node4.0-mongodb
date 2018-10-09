var formBox = $('.formBoxIcon');
var sbm = $('.sbm');
var textInput = $('.formBoxIcon .fmlist input');

if(localStorage.OAuth){
    location.href = 'index.html';
}

textInput.focus(function () {
    $(this).parents('.fmlist').addClass('onList')
})
textInput.blur(function () {
    $(this).parents('.fmlist').removeClass('onList')
})

$(window).keypress(function(e){
    if(e.charCode == 13){
        sbm.trigger('click')
    }
})

var loadShowhide;

var isErr = false;
var loginApp = angular.module('loginApp', []);

// 定义一个 Service ，稍等将会把它作为 Interceptors 的处理函数
loginApp    .factory('HttpInterceptor', ['$q', HttpInterceptor]);

function HttpInterceptor($q) {
  return {
    request: function(config){
      $('input:focus').blur()
      $('.sbm').html('登录中 <span class="showhide">.</span>')
      var it = '.'
      loadShowhide = setInterval(function(){
          if(it.length>5){
              it = ''
          }
          it += '.'
          $('.sbm .showhide').text(it)
      },320)
      return config;
    },
    requestError: function(err){
      return $q.reject(err);
    },
    response: function(res){
      clearInterval(loadShowhide);
      $('.sbm').html('登录');
      return res;
    },
    responseError: function(err){
      if(-1 === err.status) {
        // 远程服务器无响应
      } else if(500 === err.status) {
        // 处理各类自定义错误
      } else if(501 === err.status) {
        // ...
      }
      return $q.reject(err);
    }
  };
}

// 添加对应的 Interceptors
loginApp.config(['$httpProvider', function($httpProvider){
  $httpProvider.interceptors.push(HttpInterceptor);
}]);

loginApp.controller('fromCtrl', function ($scope, $http) {
    $scope.isForm = true;
    $scope.login = function () {
        $('.formBoxIcon').find('[data-required]').each(function(){
            if(!$(this).val()){
                $scope.isForm = false;
                isErr = true;
                $(this).addClass('err')
                $(this).parents('.fmlist').addClass('errList')
            }
        })
        if($scope.isForm){
            $scope.isForm = false;
            fnLogin(function(){
                $scope.isForm = true;
            });
        }
    }

    function fnLogin(callback){
        $http.post('/post/login', {username:$scope.username, password:$scope.password})
            .success(function(data,status,headers,config){
                if(status == 200){console.log(data)
                    sessionStorage.username = $scope.username
                    location.href = '/main'+location.hash
                    callback(data)
                }
            })
            .error(function(data,status,headers,config){
                console.log(config)
            })
    }
})
$(".formBoxIcon input").keypress(function(){
    if($(this).val() && isErr){
        $(this).removeClass('err')
        $(this).parents('.fmlist').removeClass('errList')
        if(!$(".formBoxIcon .fmlist").hasClass('errList')){
            isErr = false;
        }
    }
})
