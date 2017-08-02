
  // Note: This example requires that you consent to location sharing when
  // prompted by your browser. If you see the error "The Geolocation service
  // failed.", it means you probably did not give permission for the browser to
  // locate you.

  const config = {
      apiKey: "AIzaSyBVujRzh16eLZq5zceOl53B6O8QS6mUbdY",
      authDomain: "devicetracker-31792.firebaseapp.com",
      databaseURL: "https://devicetracker-31792.firebaseio.com",
      projectId: "devicetracker-31792",
      storageBucket: "devicetracker-31792.appspot.com",
      messagingSenderId: "799447247436"
  };
  firebase.initializeApp(config);

  var map, infoWindow;
  var database = firebase.database();
  var pos;
  function initMap() {
      const auth = firebase.auth();
      auth.signInWithEmailAndPassword('chileshemartin@gmail.com', '1234567890').catch(function (error) {
      });

      firebase.auth().onAuthStateChanged(function (firebaseUser) {
          if (firebaseUser) {
              console.log(firebaseUser.email);
              //load the home page if logged in else show the error message


              map = new google.maps.Map(document.getElementById('map'), {
                  center: {lat: -34.397, lng: 150.644},
                  zoom: 15
              });
              infoWindow = new google.maps.InfoWindow;

              // Try HTML5 geolocation.
              //    console.log(firebase.auth().currentUser);
              var coordinatesRef = firebase.database().ref('devices/' + firebaseUser.uid);
              coordinatesRef.on('value', function (snapshot) {

                  pos = {
                      lat: Number(snapshot.val().lat),
                      lng: Number(snapshot.val().lng)

                  };
                  infoWindow.setPosition(pos);
                  infoWindow.setContent('Location found.');
                  infoWindow.open(map);
                  map.setCenter(pos);
              });
          }

      });
  }

      // Try HTML5 geolocation.
  //     if (navigator.geolocation) {
  //         navigator.geolocation.getCurrentPosition(function(position) {
  //             var pos = {
  //                 lat: position.coords.latitude,
  //                 lng: position.coords.longitude
  //             };
  //
  //             infoWindow.setPosition(pos);
  //             infoWindow.setContent('Location found.');
  //             infoWindow.open(map);
  //             map.setCenter(pos);
  //         }, function() {
  //             handleLocationError(true, infoWindow, map.getCenter());
  //         });
  //     } else {
  //         // Browser doesn't support Geolocation
  //         handleLocationError(false, infoWindow, map.getCenter());
  //     }
  // }

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }