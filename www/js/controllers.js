angular.module('controllers', [])

.controller('WelcomeCtrl', function($scope, $state, $q, UserService, $ionicLoading,$http,$ionicPopup,$ionicSlideBoxDelegate,$ionicHistory) {

  //.controller('AppCtrl',function($scope,$ionicModal,$timeout,$ionicPopup,$http,$state,$ionicHistory){

     var url="http://tomkar.com.mx/alumbrado/app/";

    $scope.loginData={};

//Slider
  $scope.nextSlide = function() {
      $ionicSlideBoxDelegate.next();
   }

  //This is the success callback from the login method
  var fbLoginSuccess = function(response) {
    if (!response.authResponse){
      fbLoginError("No se Pudo encontrar authResponse");
      return;
    }

    var authResponse = response.authResponse;

    getFacebookProfileInfo(authResponse)
    .then(function(profileInfo) {
      //for the purpose of this example I will store user data on local storage
      UserService.setUser({
        authResponse: authResponse,
				userID: profileInfo.id,
				name: profileInfo.name,
				email: profileInfo.email,
        picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
      });

      $ionicLoading.hide();
      $state.go('app.home');

    }, function(fail){
      //fail get profile info
      console.log('Informacion de perfil fallido', fail);
    });
  };


  //This is the fail callback from the login method
  var fbLoginError = function(error){
    console.log('fbLoginError', error);
    $ionicLoading.hide();
  };

  //this method is to get the user profile info from the facebook api
  var getFacebookProfileInfo = function (authResponse) {
    var info = $q.defer();

    facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
      function (response) {
				console.log(response);
        info.resolve(response);
      },
      function (response) {
				console.log(response);
        info.reject(response);
      }
    );
    return info.promise;
  };


// login mysql

$scope.doLogin=function(){
      var admin_user=$scope.loginData.username;
      var admin_password=$scope.loginData.password;

      if(admin_user && admin_password){
          str=url+"login1.php?username="+admin_user+"&password="+admin_password;
          $http.get(str)
            .success(function(response){

                $scope.admin=response.records;
                sessionStorage.setItem('loggedin_status',true);
                sessionStorage.setItem('loggedin_id',$scope.admin.admin_id);
                sessionStorage.setItem('loggedin_status',$scope.admin.admin_user);

                //sessionStorage.setItem('logged','hola');

                //$window.sessionStorage.setItem('Plants', angular.toJson($scope.userPlantList));
// get
               // $scope.user = $window.sessionStorage.getItem('loggedin_status');

                var usern = sessionStorage.getItem('loggedin_status');
                var idd = sessionStorage.getItem('loggedin_id');
//
        UserService.setUser({
            //authResponse: authResponse,
            //userID: profileInfo.id,
            name: usern,
            email: idd,
            //picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
      });

                  $ionicHistory.nextViewOptions({
                  disableAnimate:true,
                  disableBack:true
                })

                $ionicPopup.alert({
                  title:'Bienvenido',
                  template:'Sistema de Gestion de Alumbrado Publico'
                })

                $state.go('app.home',{},{location:"replace",reload:true});
                  //$state.go('app.home');
            })
            .error(function(){

              $ionicPopup.alert({
                title:'Usuario no Valido y/o contrasena',
                template:'Intente, otra vez por favor'
              })
            });

      }else{
        $ionicPopup.alert({
          title:'Error',
          template:'Usuario y/o contraseña no valido'
        })

      }

    }


  //This method is executed when the user press the "Login with facebook" button
  $scope.facebookSignIn = function() {

    facebookConnectPlugin.getLoginStatus(function(success){
     if(success.status === 'connected'){
        // the user is logged in and has authenticated your app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed request, and the time the access token
        // and signed request each expire
        console.log('getLoginStatus', success.status);

				//check if we have our user saved
				var user = UserService.getUser('facebook');

				if(!user.userID)
				{
					getFacebookProfileInfo(success.authResponse)
					.then(function(profileInfo) {

						//for the purpose of this example I will store user data on local storage
						UserService.setUser({
							authResponse: success.authResponse,
							userID: profileInfo.id,
							name: profileInfo.name,
							email: profileInfo.email,
							picture : "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
						});

						$state.go('app.home');

					}, function(fail){
						//fail get profile info
						console.log('profile info fail', fail);
					});
				}else{
					$state.go('app.home');
				}

     } else {
        //if (success.status === 'not_authorized') the user is logged in to Facebook, but has not authenticated your app
        //else The person is not logged into Facebook, so we're not sure if they are logged into this app or not.
        console.log('getLoginStatus', success.status);

			  $ionicLoading.show({
          template: 'Iniciando sesion...'
        });

        //ask the permissions you need. You can learn more about FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
        facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
      }
    });
  };
})



.controller('AppCtrl', function($scope, UserService, $ionicActionSheet, $state, $ionicLoading,$ionicPopup,$ionicHistory){

    //sessionStorage.setItem('loggedin_status',$scope.admin.admin_user);
    //$scope.name = sessionStorage.getItem(admin_user);
//var usern = sessionStorage.getItem(logged);

$scope.homepage = function() {
       $state.go('app.home');
   }

   $scope.misreportes = function() {
      $state.go('app.listarep');
   }

   $scope.comofunciono = function() {
      $state.go('app.comofunciono');
   }

$scope.user = UserService.getUser();

  $scope.showLogOutMenu = function() {
    var hideSheet = $ionicActionSheet.show({
      destructiveText: 'Salir',
      titleText: 'Estas seguro que deseas salir?\n Esta app es asombrosa asi que te recomendamos quedarte.',
      cancelText: 'Cancelar',
      cancel: function() {},
      buttonClicked: function(index) {
        return true;
      },
      destructiveButtonClicked: function(){
        $ionicLoading.show({
          template: 'Saliendo...'
        });

        sessionStorage.removeItem('loggedin_status');
      sessionStorage.removeItem('loggedin_id');
      sessionStorage.removeItem('loggedin_status');

        $ionicHistory.nextViewOptions({
        disableAnimate:true,
        disableBack:true
      })

          $ionicLoading.hide();
          $state.go('welcome');


        //facebook logout
        /*
        facebookConnectPlugin.logout(function(){
          $ionicLoading.hide();
          $state.go('welcome');
        },
        function(fail){
          $ionicLoading.hide();
        });
        */
      }
    });
  };
})


.controller('ReporteCtrl', function($scope, UserService, $ionicActionSheet, $state, $ionicLoading){

$scope.user = UserService.getUser();

$scope.reportelum = function() {
       $state.go('app.geo',{tipo:'alumbrado'});
   }

$scope.reportebaches = function() {
       $state.go('app.geo2',{tipo:'baches'});
   }

$scope.reportebasura = function() {
       $state.go('app.geo2',{tipo:'basura'});
   }

$scope.reporteanimales = function() {
       $state.go('app.geo2',{tipo:'animales'});
   }

$scope.reportetransporte = function() {
       $state.go('app.geo3',{tipo:'numero'});
   }
})


.controller('MantenimientoCtrl', function($scope, UserService, $ionicActionSheet, $state, $ionicLoading){

$scope.user = UserService.getUser();

$scope.reportelum = function() {
       $state.go('app.listarep',{tipo:'alumbrado'});
   }

$scope.reportebaches = function() {
       $state.go('app.geo2',{tipo:'instalacion'});
   }

$scope.reportebasura = function() {
       $state.go('app.geo3',{tipo:'mantenimiento'});
   }

$scope.reporteanimales = function() {
       $state.go('app.geo2',{tipo:'animales'});
   }

$scope.reportetransporte = function() {
       $state.go('app.geo2',{tipo:'Transporte'});
   }
})


.controller('ListaRepCtrl', function($scope, UserService, $ionicActionSheet, $state, $ionicLoading, $http){

$scope.user = UserService.getUser();

//$http.get("http://tomkar.201.139.231.229/reportes/reportes.php?idFb="+$scope.user.userID)
$http.get("http://tomkar.com.mx/alumbrado/app/lista_reportes.php")
    //.then(function (response) {$scope.names = response.data.records;});
    .then(function (response) {$scope.names = response.data;});
    
    $scope.hacerQueja = function(resp){
        $state.go('app.queja',{idSiat:resp});    
    }

})

.controller('ComoFuncionoCtrl', function($scope, UserService, $ionicActionSheet, $state, $ionicLoading, $ionicHistory, $ionicSlideBoxDelegate, $cordovaStatusbar){

$cordovaStatusbar.overlaysWebView(true);
$cordovaStatusbar.style(1);

$scope.user = UserService.getUser();

$scope.nextSlide = function() {
      $ionicSlideBoxDelegate.next();
   }

$scope.terminado = function() {
   $ionicHistory.nextViewOptions({disableBack: true});

   $state.go('app.home');

}

})


.controller('QuejaCtrl', function($scope, UserService, $ionicActionSheet, $state, $ionicLoading, $http,$ionicHistory, $ionicPopup){

var id = $state.params.IdSiat;

$http.get("http://200.38.19.29/reportes/queja.php?IdSiat="+id)
    .then(function (response) {$scope.names = response.data.records;});
    
    $scope.registQueja = function(resp){
     var fecha = $scope.names.Fecha;
     var idSiat = resp;
    }

})

.controller('FormularioCtrl', function($scope, UserService, $ionicActionSheet, $state, $ionicLoading, $http,$ionicHistory, $ionicPopup){

$scope.user = UserService.getUser();

$http.post("http://201.139.231.229/reportes/forma.php", {'id':$scope.user.userID})
.success(function(data,status,headers,config){
    if(data == 1){
    var alertPopup = $ionicPopup.alert({
      title: data,
      template:'Bienvenido'
    });
    $state.go('app.reporte');
  }

    })
   .error(function(data,status){
    // nada
    });

    $scope.saveform = function(){

var nombre = document.getElementById('Nombre').value;
var paterno = document.getElementById('Paterno').value;
var materno = document.getElementById('Materno').value;
var sexo = document.getElementById('sexo').value;
var Edad = document.getElementById('Edad').value;
var Correo = document.getElementById('Correo').value;
var numeroTel = document.getElementById('NumeroTel').value;
var Colonia = document.getElementById('Colonia').value;
var Calle = document.getElementById('Calle').value;
var NoCasa = document.getElementById('NoCasa').value;
    
if(numeroTel.length==10 && nombre != '' && paterno != '' && materno != '' && sexo != '' && Edad != '' && Correo != '' && Colonia != '' && Calle != '' && NoCasa != ''){
$ionicLoading.show({
    content: 'Guardando',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

    $http.post("http://201.139.231.229/reportes/forma.php", {
    'nombre':nombre,
    'paterno':paterno,
    'materno':materno,
    'sexo':sexo,
    'Edad':Edad,
    'Correo':Correo,
    'numeroTel':numeroTel,
    'Colonia':Colonia,
    'Calle':Calle,
    'NoCasa':NoCasa,
    'idFace':$scope.user.userID
     })
    .success(function(data,status,headers,config){
    $ionicLoading.hide();
    var alertPopup = $ionicPopup.alert({
      title: data,
      template: data + '\n Continuemos con tu Primer Reporte'
    });
    $state.go('app.reporte');
    })
    .error(function(data,status){
    var alertPopup = $ionicPopup.alert({
      title: 'Error',
      template: 'No se pudo Registrar la informacion. \n' + data
    });
    $ionicLoading.hide();  
    });
  }
  else{
      var alertPopup = $ionicPopup.alert({
      title: 'Error',
      template: 'debes ingresar un numero valido de 10 digitos y agregar una descripcion'
    });
    setTimeout(function() {alertPopup.close();}, 4000); 
  }

    }

})

.controller('DescriptionCtrl', function($scope, UserService, $ionicActionSheet, $state, $ionicLoading,$http, $ionicHistory, $ionicPopup){

$scope.user = UserService.getUser();
$ionicHistory.clearCache();
var id = $state.params.id;

$scope.savedesc = function(){

var desc = document.getElementById('descripcion').value;
var telefono = document.getElementById('telefono').value;
var correo = document.getElementById('correo').value;
    
    if(telefono.length==10 && desc != '' && correo != ''){
    
$ionicLoading.show({
    content: 'Guardando',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

    $http.post("http://201.139.231.229/reportes/desc2.php", {
    'id':id,
    'desc':desc,
    'telefono':telefono,
    'correo':correo
     })
    .success(function(data,status,headers,config){
    $ionicLoading.hide();
    var alertPopup = $ionicPopup.alert({
      title: data,
      template: 'Podras ver tu reporte en la seccion de Mis Reportes.'
    });
    $ionicHistory.nextViewOptions({disableBack: true});
    $state.go('app.home');
    })
    .error(function(data,status){
    var alertPopup = $ionicPopup.alert({
      title: 'Error',
      template: 'No se pudo Registrar la informacion. \n' + data
    });
    $ionicLoading.hide();  
    });
    
   }
    else{
       var alertPopup = $ionicPopup.alert({
      title: 'Error',
      template: 'debes llenar todos los campos para completar el reporte'
    }); 
    }
  
}

})

.controller('Geo2Ctrl', function($scope, UserService, $ionicActionSheet, $state, $ionicLoading,$cordovaGeolocation,$http, $ionicPopup){

$scope.user = UserService.getUser();
var lat;
var long;
var boton = document.getElementById("map");
var tipo = $state.params.tipo;

var options = {timeout: 10000, enableHighAccuracy: true};
 
  $cordovaGeolocation.getCurrentPosition(options).then(function(position){

     lat  = position.coords.latitude;
     long = position.coords.longitude;
 
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

      //Wait until the map is loaded
google.maps.event.addListenerOnce($scope.map, 'idle', function(){
 
  var marker = new google.maps.Marker({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      icon:'img/point.png',
      position: latLng
  });      
 
  var infoWindow = new google.maps.InfoWindow({
      content: "Estas Aqui!"
  });                            
 
      google.maps.event.addListener(marker, 'click', function () {
      infoWindow.open($scope.map, marker);
      });

  });
 
  }, function(error){
    var alertPopup = $ionicPopup.alert({
      title: 'Alerta',
      template: 'Necesitas habilitar/activar tu gps para poder utilizar esta opcion.'
    });
  });

   $scope.regist2 = function() {

    $ionicLoading.show({
    content: 'Guardando',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

    $http.post("http://201.139.231.229/reportes/test2.php", {
    'lat':lat,
    'lon':long,
    'tipo':tipo,
    'id':$scope.user.userID})
    .success(function(data,status,headers,config){
    $ionicLoading.hide();
    $state.go('app.foto',{id:data});
    })
    .error(function(data,status){
    var alertPopup = $ionicPopup.alert({
      title: 'Error',
      template: 'No se pudo insertar informacion' + data
    });
    $ionicLoading.hide(); 
    });

  }

})


.controller('Geo3Ctrl', function($scope, UserService, $ionicActionSheet, $state, $ionicLoading,$cordovaGeolocation,$http, $ionicPopup){

    $scope.loginData={};
  
  var url="http://tomkar.com.mx/alumbrado/app/";

document.getElementById("button").disabled = true;
document.getElementById("button").style.filter = "grayscale(100%)";

$scope.buscar_luminaria = function() {

    
    //$scope.loginData={};
    
    var admin_user=$scope.loginData.username;   

     $ionicLoading.show({
    content: 'Buscando...',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 100
  }); 

    //$http.get("http://201.139.231.229/reportes/luminarias.php?lat="+lat+"&lon="+long)
  $http.get("http://tomkar.com.mx/alumbrado/app/traer_luminaria.php?poste="+admin_user)
//$ionicLoading.hide();
    .then(function (response) {

     
      
      var ar = response.data.records;
      var contenido = ar.length;
      var markers = new Array();
/*
      var lumLat1 ='32.4466405';
      var lumLon1 = '-117.0246735';

      var latLng3 = new google.maps.LatLng(lumLat1, lumLon1);

      var marker2 = new google.maps.Marker({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      icon:'img/street-light.png',
      position: latLng3
     });

*/

   for(i=0; i<contenido; i++){
     //var lumLat = response.data.records[i].Lat;
     //var lumLon = response.data.records[i].Lng;

     var lumLat = '32.4466405';
     var lumLon = '-117.0246735';

     var latLng2 = new google.maps.LatLng(lumLat, lumLon);

      var marker2 = new google.maps.Marker({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      icon:'img/street-light.png',
      position: latLng2
  });



      markers.push(marker2);

      var infoWindow2 = new google.maps.InfoWindow();

      google.maps.event.addListener(marker2, 'click', (function(marker2, i) {
        return function() {
          document.getElementById("button").disabled = false;
          document.getElementById("button").style.marginTop = "4%";
          document.getElementById("button").style.filter = "grayscale(0%)";
          document.getElementById("leyenda").style.display = "none"; 
          var lumId = response.data.records[i].Id;
          num_lum = lumId;
          infoWindow2.setContent("No. Luminaria: " + lumId);
          infoWindow2.open($scope.map, marker2);
        }
      })(marker2, i));

      $ionicLoading.hide();
    }

  });   
                

}

$scope.user = UserService.getUser();
var lat;
var long;
var boton = document.getElementById("map");
var tipo = $state.params.tipo;
var num_lum;

var options = {timeout: 10000, enableHighAccuracy: true};
 
  $cordovaGeolocation.getCurrentPosition(options).then(function(position){

     lat  = position.coords.latitude;
     long = position.coords.longitude;
 
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

      //Wait until the map is loaded
google.maps.event.addListenerOnce($scope.map, 'idle', function(){
 
  var marker = new google.maps.Marker({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      icon:'img/point.png',
      position: latLng
  });      
 
  var infoWindow = new google.maps.InfoWindow({
      content: "Estas Aqui!"
  });

  //$http.get("http://201.139.231.229/reportes/luminarias.php?lat="+lat+"&lon="+long)
  $http.get("http://tomkar.com.mx/alumbrado/app/traer_luminaria.php?poste="+luminaria)

    .then(function (response) {
      
      var ar = response.data.records;
      var contenido = ar.length;
      var markers = new Array();

   for(i=0; i<contenido; i++){
     var lumLat = response.data.records[i].Lat;
     var lumLon = response.data.records[i].Lng;

     var latLng2 = new google.maps.LatLng(lumLat, lumLon);

      var marker2 = new google.maps.Marker({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      icon:'img/street-light.png',
      position: latLng2
  });

      markers.push(marker2);

      var infoWindow2 = new google.maps.InfoWindow();

      google.maps.event.addListener(marker2, 'click', (function(marker2, i) {
        return function() {
          document.getElementById("button").disabled = false;
          document.getElementById("button").style.marginTop = "4%";
          document.getElementById("button").style.filter = "grayscale(0%)";
          document.getElementById("leyenda").style.display = "none"; 
          var lumId = response.data.records[i].Id;
          num_lum = lumId;
          infoWindow2.setContent("No. Luminaria: " + lumId);
          infoWindow2.open($scope.map, marker2);
        }
      })(marker2, i));

      /*google.maps.event.addListener(marker2, 'click', function () {
      infoWindow2.close();
      infoWindow2.setContent( "No. Luminaria: "+ lumId);
      infoWindow2.open($scope.map, marker2);
  }); */

    }

});                            
 
  /*google.maps.event.addListener(marker, 'click', function () {
      infoWindow.open($scope.map, marker);
  });*/

  });
 
  }, function(error){
    var alertPopup = $ionicPopup.alert({
      title: 'Alerta',
      template: 'Necesitas habilitar/activar tu gps para poder utilizar esta opcion.'
    });
  });


   $scope.regist_mnto = function() {

    $ionicLoading.show({
    content: 'Guardando',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

    $http.post("http://201.139.231.229/reportes/test.php", {
    'lat':lat,
    'lon':long,
    'tipo':tipo,
    'num_lum':num_lum,
    'id':$scope.user.userID})
    .success(function(data,status,headers,config){
    $ionicLoading.hide();
    $state.go('app.foto',{id:data});
    })
    .error(function(data,status){
    var alertPopup = $ionicPopup.alert({
      title: 'Error',
      template: 'No se pudo insertar informacion' + data
    });
    $ionicLoading.hide(); 
    });

  }

})


.controller('GeoCtrl', function($scope, UserService, $ionicActionSheet, $state, $ionicLoading,$cordovaGeolocation,$http, $ionicPopup){

document.getElementById("button").disabled = true;
document.getElementById("button").style.filter = "grayscale(100%)";

$scope.user = UserService.getUser();
var lat;
var long;
var boton = document.getElementById("map");
var tipo = $state.params.tipo;
var num_lum;

var options = {timeout: 10000, enableHighAccuracy: true};
 
  $cordovaGeolocation.getCurrentPosition(options).then(function(position){

     lat  = position.coords.latitude;
     long = position.coords.longitude;
 
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

      //Wait until the map is loaded
google.maps.event.addListenerOnce($scope.map, 'idle', function(){
 
  var marker = new google.maps.Marker({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      icon:'img/point.png',
      position: latLng
  });      
 
  var infoWindow = new google.maps.InfoWindow({
      content: "Estas Aqui!"
  });

  $http.get("http://tomkar.com.mx/alumbrado/app/luminarias.php?lat="+lat+"&lon="+long)
    .then(function (response) {
      
      var ar = response.data.records;
      var contenido = ar.length;
      var markers = new Array();

   for(i=0; i<contenido; i++){
     var lumLat = response.data.records[i].Lat;
     var lumLon = response.data.records[i].Lng;

     var latLng2 = new google.maps.LatLng(lumLat, lumLon);

      var marker2 = new google.maps.Marker({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      icon:'img/street-light.png',
      position: latLng2
  });

      markers.push(marker2);

      var infoWindow2 = new google.maps.InfoWindow();

      google.maps.event.addListener(marker2, 'click', (function(marker2, i) {
        return function() {
          document.getElementById("button").disabled = false;
          document.getElementById("button").style.marginTop = "4%";
          document.getElementById("button").style.filter = "grayscale(0%)";
          document.getElementById("leyenda").style.display = "none"; 
          var lumId = response.data.records[i].Id;
          num_lum = lumId;
          infoWindow2.setContent("No. Luminaria: " + lumId);
          infoWindow2.open($scope.map, marker2);
        }
      })(marker2, i));

      /*google.maps.event.addListener(marker2, 'click', function () {
      infoWindow2.close();
      infoWindow2.setContent( "No. Luminaria: "+ lumId);
      infoWindow2.open($scope.map, marker2);
  }); */

    }

});                            
 
  /*google.maps.event.addListener(marker, 'click', function () {
      infoWindow.open($scope.map, marker);
  });*/

  });
 
  }, function(error){
    var alertPopup = $ionicPopup.alert({
      title: 'Alerta',
      template: 'Necesitas habilitar/activar tu gps para poder utilizar esta opcion.'
    });
  });

   $scope.regist = function() {

    $ionicLoading.show({
    content: 'Guardando',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

    $http.post("http://201.139.231.229/reportes/test.php", {
    'lat':lat,
    'lon':long,
    'tipo':tipo,
    'num_lum':num_lum,
    'id':$scope.user.userID})
    .success(function(data,status,headers,config){
    $ionicLoading.hide();
    $state.go('app.foto',{id:data});
    })
    .error(function(data,status){
    var alertPopup = $ionicPopup.alert({
      title: 'Error',
      template: 'No se pudo insertar informacion' + data
    });
    $ionicLoading.hide(); 
    });

  }

})

.controller('FotoCtrl', function($scope, UserService, $ionicActionSheet, $state, $ionicLoading,$cordovaFile, $cordovaFileTransfer, $cordovaCamera, $ionicPopup){

$scope.user = UserService.getUser();

var id1 = $state.params.id;

var imagen;

$scope.takepic = function () {


    var options = {
      quality: 60,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation:true
    };
    $cordovaCamera.getPicture(options).then(function(imageData) {
      var image = document.getElementById('fotoLocal');
      image.src = "data:image/jpeg;base64," + imageData;
      imagen = image.src;
      FileUpload(imageData);
    }, function(err) {
      // error
    });

    function FileUpload(imageData){
    $ionicLoading.show({
    content: 'Guardando',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

     var options = new FileUploadOptions();
                options.fileKey = "imagen";
                options.fileName = id1+".jpg";

$cordovaFileTransfer.upload(encodeURI("http://201.139.231.229/reportes/fotos/subir_foto.php?id="+id1),imagen,options).then(function (result) {
     var alertPopup = $ionicPopup.alert({
      title: 'Listo',
      template: 'Tu Imagen se subio con exito'
    });
     $ionicLoading.hide();
     $state.go('app.description',{id:id1});
 }, function (err) {
     var alertPopup = $ionicPopup.alert({
      title: 'Error',
      template: 'Favor de intentarlo de nuevo'
    });
     $ionicLoading.hide();
 }, function (progress) {
 });

    }


}

})


.controller('HomeCtrl', function($scope, UserService, $ionicActionSheet, $state, $ionicLoading, $cordovaBarcodeScanner,$ionicHistory, $ionicPopup, $http){

  $scope.qrscanner = function() {
     $state.go('app.mantenimiento');
    }

    $scope.pagsind = function() {
      var ref = cordova.InAppBrowser.open('http://www.sisgap.com', '_blank', 'location=yes');
   }

   $scope.pagdir = function() {
      var ref = cordova.InAppBrowser.open('http://www.tijuana.gob.mx/directorio/index.aspx', '_blank', 'location=yes');
   }

   $scope.pagayun = function() {
      var ref = cordova.InAppBrowser.open('http://www.tijuana.gob.mx', '_blank', 'location=yes');
   }

   $scope.pagubic = function() {
      var ref = cordova.InAppBrowser.open('http://www.tijuana.gob.mx/Dependencias', '_blank', 'location=yes');
   }

   $scope.pagreg = function() {
      var ref = cordova.InAppBrowser.open('http://www.tijuana.gob.mx/Reglamentos', '_blank', 'location=yes');
   }

   $scope.pagrep = function() {
      $state.go('app.reporte');
   }

  $scope.user = UserService.getUser();

  $http.post("http://201.139.231.229/reportes/saveUser.php", {
    'id':$scope.user.userID,
    'name':$scope.user.name,
    'email':$scope.user.email,
    'picture':$scope.user.picture})
    .success(function(data,status,headers,config){

    })
    .error(function(data,status){

    });

	$scope.showLogOutMenu = function() {
		var hideSheet = $ionicActionSheet.show({
			destructiveText: 'Salir',
			titleText: 'Estas seguro que deseas salir?\n Esta app es asombrosa asi que te recomendamos quedarte.',
			cancelText: 'Cancelar',
			cancel: function() {},
			buttonClicked: function(index) {
				return true;
			},
			destructiveButtonClicked: function(){
				$ionicLoading.show({
					template: 'Saliendo...'
				});

        //facebook logout
        facebookConnectPlugin.logout(function(){
          $ionicLoading.hide();
          $state.go('welcome');
        },
        function(fail){
          $ionicLoading.hide();
        });
			}
		});
	};
})

;
