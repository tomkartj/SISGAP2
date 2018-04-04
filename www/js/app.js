// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'controllers', 'services', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('welcome', {
    url: '/welcome',
    templateUrl: "views/welcome.html",
    controller: 'WelcomeCtrl'
  })

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "views/sidemenu.html",
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: "/home",
    views: {
      'menuContent': {
        templateUrl: "views/home.html",
        controller: 'HomeCtrl'
      }
    }
  })

    .state('app.reporte', {
    url: "/reporte",
    views: {
      'menuContent': {
        templateUrl: "views/reporte.html",
        controller: 'ReporteCtrl'
      }
    }
  })

    .state('app.formulario', {
    url: "/formulario",
    views: {
      'menuContent': {
        templateUrl: "views/formulario.html",
        controller: 'FormularioCtrl'
      }
    }
  })

    .state('app.foto', {
    url: "/foto",
    params:{id: null},
    views: {
      'menuContent': {
        templateUrl: "views/foto.html",
        controller: 'FotoCtrl'
      }
    }
  })
  
      .state('app.queja', {
    url: "/queja",
    params:{IdSiat: null},
    views: {
      'menuContent': {
        templateUrl: "views/queja.html",
        controller: 'QuejaCtrl'
      }
    }
  })

    .state('app.listarep', {
    url: "/listarep",
    views: {
      'menuContent': {
        templateUrl: "views/listarep.html",
        controller: 'ListaRepCtrl'
      }
    }
  })

    .state('app.comofunciono', {
    url: "/comofunciono",
    views: {
      'menuContent': {
        templateUrl: "views/comofunciono.html",
        controller: 'ComoFuncionoCtrl'
      }
    }
  })

    .state('app.geo', {
    url: "/geo",
    params:{tipo: null},
    views: {
      'menuContent': {
        templateUrl: "views/geo.html",
        controller: 'GeoCtrl'
      }
    }
  })

    .state('app.geo2', {
    url: "/geo2",
    params:{tipo: null},
    views: {
      'menuContent': {
        templateUrl: "views/geo2.html",
        controller: 'Geo2Ctrl'
      }
    }
  })

    .state('app.geo3', {
    url: "/geo3",
    params:{tipo: null},
    views: {
      'menuContent': {
        templateUrl: "views/geo3.html",
        controller: 'Geo3Ctrl'
      }
    }
  })

    .state('app.description', {
    url: "/description",
    params:{id: null},
    views: {
      'menuContent': {
        templateUrl: "views/description.html",
        controller: 'DescriptionCtrl'
      }
    }
  })

    .state('app.mantenimiento', {
    url: "/mantenimiento",
    params:{id: null},
    views: {
      'menuContent': {
        templateUrl: "views/mantenimiento.html",
        controller: 'MantenimientoCtrl'
      }
    }
  })

  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/welcome');
})
