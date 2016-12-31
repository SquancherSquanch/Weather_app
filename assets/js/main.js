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

function validateField() {
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
    var lastDes = $scope.Data.des;
    $scope.Data.des = data.weather[0].main;
    $scope.Data.Fah = Math.round( ($scope.Data.temp * 9)/5 + 32 );
    return IconGen(lastDes, $scope.Data.des);
  }

  function chosenWeather(data) {
    $scope.Data.Cel = Math.round(data.main.temp);
    $scope.Data.Fah = Math.round( (data.main.temp * 9)/5 + 32 );
    $scope.Data.temp = $scope.Data.unit === 'C' ? $scope.Data.Cel : $scope.Data.Fah;
    var lastDes = $scope.Data.des;
    $scope.Data.des = data.weather[0].main;
    return IconGen(lastDes, $scope.Data.des);
  }

  function IconGen(lastCity, city) {
    var city = city.toLowerCase()
    var lastCity = lastCity === undefined ? city : lastCity.toLowerCase();
    switch (city) {
      case 'drizzle':
        addIcon(lastCity, city);
        document.getElementsByClassName("mainContainer")[0].style.backgroundImage = "url(images/drizzle.png)";
        break;
      case 'clouds':
        addIcon(lastCity, city);
        document.getElementsByClassName("mainContainer")[0].style.backgroundImage = "url( images/cloudy.png)";
        break;
      case 'rain':
        addIcon(lastCity, city);
        document.getElementsByClassName("mainContainer")[0].style.backgroundImage = "url( images/rain.png)";
        break;
      case 'snow':
        addIcon(lastCity, city);
        document.getElementsByClassName("mainContainer")[0].style.backgroundImage = "url( images/snow.png)";
        break;
      case 'clear':
        addIcon(lastCity, city);
        document.getElementsByClassName("mainContainer")[0].style.backgroundImage = "url( images/clear.png)";
        break;
      case 'thunderstom':
        addIcon(lastCity, city);
        document.getElementsByClassName("mainContainer")[0].style.backgroundImage = "url( images/thunder.png)";
        break;
      case 'mist':
      document.getElementsByClassName("mainContainer")[0].style.backgroundImage = "url( images/foggy.png)";
        addIcon(lastCity, city);
        break;
      default:
    $('div.clouds').removeClass('hide');
    }
  }

  function addIcon(lastCity, city) {
    console.log(lastCity + ", " + city);
    $('div.' + lastCity).addClass('hide');
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
    if (!validateField()){
      return;
    }

    WeatherApi.getLoc().success(function(data) {
      var newLoc = document.getElementById('cityPick').value.replace(" ", "").split(',');
        newLoc[0] = newLoc[0].replace(newLoc[0][0],newLoc[0][0].toUpperCase());
        newLoc[1] = newLoc[1].toUpperCase();

      var unit = $scope.Data.temp;

      city = newLoc[0] + ',' + newLoc[1];
      $scope.Data.city = newLoc[0];
      $scope.Data.country = newLoc[1];
      $(".city").text($scope.Data.city);
      togglePages('hide');
      WeatherApi.getCurrent(city).success(function(data) {
        chosenWeather(data);
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
        chosenWeather(data);
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