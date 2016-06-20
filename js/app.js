var App = angular.module('CarsApp', []);

App.controller('CarsCtrl', function($scope, $http, $compile, $filter) {

  var checkCarsList = function (){

    if(localStorage.getItem('carslist')!==null) {
      //from local storage
      $scope.cars = JSON.parse(localStorage.getItem('carslist'));;

    }

    else {
      //from server
      $http.get('car.json').then(function(result){
        $scope.cars = result.data;
        localStorage.setItem('carslist', JSON.stringify($scope.cars));
      });
    }

  }

  checkCarsList();

  $scope.btns = [];

  var saveChoosedCars = function () {
    if(localStorage.getItem('savedcars')==null) {
      console.log('null');
      localStorage.setItem('savedcars', JSON.stringify($scope.btns));
    }
    else {
      console.log('not-null');
      $scope.btns = JSON.parse(localStorage.getItem('savedcars'));
    }
    console.log($scope.btns);
  }

  saveChoosedCars();

  $scope.choosen = function ($event, team, title) {

    var choosen_element = angular.element($event.currentTarget).parent().parent();

    $scope.btns.push({
      'title': choosen_element.scope().car.title,
      'id': choosen_element.scope().car.id,
      'price': choosen_element.scope().car.price
    });
    localStorage.setItem('savedcars', JSON.stringify($scope.btns));

    var index = -1;
    var comArr = eval( $scope.cars );
    for( var i = 0; i < comArr.length; i++ ) {
      if( comArr[i].title === title ) {
        index = i;
        break;
      }
    }
    if( index === -1 ) {
      alert( "Something gone wrong" );
    }

    $scope.cars.splice( index, 1 );

  }

  $scope.removeBtn = function(index, id, title){

    $scope.btns.splice( index, 1 );
    localStorage.setItem('savedcars', JSON.stringify($scope.btns));

    var cars_list = JSON.parse(localStorage.getItem('carslist'));
    var arr = cars_list;
    var get_car;

    for (var i = 0, len = cars_list.length; i < len; i++) {
        if (cars_list[i].id === id) {
            get_car = cars_list[i];
        }
    }

    $scope.cars.push({
      'title': get_car.title,
      'id': get_car.id,
      'price': get_car.price,
      "popularity":get_car.popularity,
      "description": get_car.description
    });

  };

  $scope.getTimes = function(n){
     return new Array(n);
  };

  $scope.nextStep = function(event) {
    if(($scope.btns.length==0)||($scope.btns==null)) {
      alert('Choose cars, please.');
      event.preventDefault();
    }
    else {
      var element_1 = document.getElementsByClassName("wizard-step-1");
      angular.element(element_1).removeClass('active').addClass('done');
      var element_2 = document.getElementsByClassName("wizard-step-2");
      angular.element(element_2).addClass('active');
    }
  }

  $scope.goBack = function () {
    var element_1 = document.getElementsByClassName("wizard-step-1");
      angular.element(element_1).addClass('active').removeClass('done');
      var element_2 = document.getElementsByClassName("wizard-step-2");
      angular.element(element_2).removeClass('active');
  }

  $scope.sendJson = function(){
    var dataObj = $scope.btns;
    var res = $http.post('/angular-test', dataObj);
    res.success(function(data, status, headers, config) {
      console.log(data);
    });
    res.error(function(data, status, headers, config) {
      alert( "failure message: " + JSON.stringify({data: data}));
    });

    $scope.btns = [];
    localStorage.setItem('savedcars', JSON.stringify($scope.btns));

  };


});

angular.module('CarsApp').config(function($routeProvider, $locationProvider) {
  $routeProvider.
  when('/', {
      templateUrl: 'embedded.index.html',
      controller: 'CarsCtrl'
  }).
  when('/step2', {
      templateUrl: 'embedded.step2.html',
      controller: 'CarsCtrl'
  }).
  otherwise({
      redirectTo: '/'
  });
  $locationProvider.html5Mode(true);
});
