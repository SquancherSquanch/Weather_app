/*
Note this example will work only over
http and NOT https because of a http resource used below.
*/

function keydownFunction(evt) {
  evt = evt || window.event;
  if (evt.keyCode == 13) {
      evt.preventDefault();
      ajaxResultPost();
  }
};

function ajaxResultPost() {
    var scope = angular.element(document.getElementsByClassName('mainContainer')[0]).scope();
    scope.$apply(function () {
        scope.Data.changeLoc();
    });
}

$(document).keyup(function(evt) {
     if (evt.keyCode == 27) {
        if (document.getElementById("chooseContainer").style.display === "block"){
          togglePages('hide');
        }
    }
});

var pageShow;

function loadingScreen() {
    pageShow = setTimeout(togglePages('default'), 200);
}

function togglePages(visibility) {
  switch (visibility) {
      case 'show':
        document.getElementById('chooseContainer').style.display = "block";
        document.getElementById('loaded').style.display = "none";
        break;
      case 'hide':
        document.getElementById('chooseContainer').style.display = "none";
        document.getElementById('loaded').style.display = "block";
        document.getElementById("cityPick").value = "";
        break;
      default:
        document.getElementById("loader").style.display = "none";
        document.getElementsByClassName("mainContainer")[0].style.display = "block";
        document.getElementsByClassName("footer")[0].style.display = "block";
      }
}

function check_empty() {
  var regEx = /^[0-9a-zA-Z,]+$/;
    
  if (document.getElementById('cityPick').value == "") {
    alert('Please Fill Field With "City, Country"!');
    return false;
  } else if (regEx.test(document.getElementById('cityPick').value)){
    alert('Please Fill Field With "City, Country"!');
    return false;
  } else {
    return true;
  }
}

var app = angular.module('Weather', []);

app.factory('WeatherApi', function($http) {
  var obj = {};
  
  obj.getLoc = function() {
    return $http.jsonp("http://ipinfo.io/json?callback=JSON_CALLBACK");
  };

  obj.getCurrent = function(city) {
    var api = "http://api.openweathermap.org/data/2.5/weather?q=";
    var units = "&units=metric";
    var appid = "&APPID=2eebfd27313e255383fa39b208894b1e"
    var cb = "&callback=JSON_CALLBACK";
    
    return $http.jsonp(api + city + units+ appid + cb);
  };

  return obj
});

app.controller('MainCtrl', function($scope, WeatherApi) {
  $scope.Data = {};
  $scope.Data.unit ='C';
  $scope.Data.sysChange = false;
  WeatherApi.getLoc().success(function(data) {
    var city = data.city + ',' + data.country;
    $scope.Data.city = data.city;
    $scope.Data.country = data.country;
    //document.getElementById("cityPick").value = $scope.Data.city;
    WeatherApi.getCurrent(city).success(function(data) {
      CurrentWeather(data);
    });
  });

  function CurrentWeather(data) {
    $scope.Data.temp = Math.round(data.main.temp);
    $scope.Data.Cel = Math.round(data.main.temp);
    $scope.Data.des = data.weather[0].main;
    $scope.Data.Fah = Math.round( ($scope.Data.temp * 9)/5 + 32 );
    return IconGen($scope.Data.des);
  }

  function IconGen(city) {
    var city = city.toLowerCase()
    switch (city) {
      case 'dizzle':
        addIcon(city)
        break;
      case 'clouds':
        addIcon(city)
        break;
      case 'rain':
        addIcon(city)
        break;
      case 'snow':
        addIcon(city)
        break;
      case 'clear':
        addIcon(city)
        break;
      case 'thunderstom':
        addIcon(city)
        break;
      default:
    $('div.clouds').removeClass('hide');
    }
  }

  function addIcon(city) {
    $('div.' + city).removeClass('hide');
  }
  
  $(document).click(function(event) {
      var text = $(event.target);
      if (text.hasClass("city"))
      {
        $(".city").text($scope.Data.city);
      }
    });

   $scope.Data.changeLoc = function(){
    if (!check_empty()){
      return;
    }

    WeatherApi.getLoc().success(function(data) {
      var newLoc = document.getElementById('cityPick').value.replace(" ", "").split(',');
        newLoc[0] = newLoc[0].replace(newLoc[0][0],newLoc[0][0].toUpperCase());
        newLoc[1] = newLoc[1].toUpperCase();

      city = newLoc[0] + ',' + newLoc[1];
      $scope.Data.city = newLoc[0];
      $scope.Data.country = newLoc[1];
      $(".city").text($scope.Data.city);
      togglePages('hide');
      WeatherApi.getCurrent(city).success(function(data) {
        CurrentWeather(data);
      });
    });
  }

  $scope.Data.currentLoc = function(){
    WeatherApi.getLoc().success(function(data) {
      $scope.Data.unit =  $scope.Data.unit;
      city = data.city + ',' + data.country;
      $scope.Data.city = data.city;
      $scope.Data.country = data.country;
      //document.getElementById("cityPick").value = $scope.Data.city;
      $(".city").text($scope.Data.city);
      WeatherApi.getCurrent(city).success(function(data) {
        CurrentWeather(data);
      });
    });
  }

  $scope.Data.changeTemp = function(){
   if($scope.Data.sysChange){
     $scope.Data.unit ='C';
     $scope.Data.temp = $scope.Data.Cel;
     return $scope.Data.sysChange = false;
     }
    $scope.Data.unit ='F';
    $scope.Data.temp = $scope.Data.Fah;
    return $scope.Data.sysChange = true;
  }

});