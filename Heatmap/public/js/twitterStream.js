function initialize() {
  //Setup Google Map
  var myLatlng = new google.maps.LatLng(17.7850,-12.4183);
  var light_grey_style = [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}];
  var mapOptions = {
    zoom: 3,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    panControl: false,
    zoomControl: false,
    scaleControl: false,
    streetViewControl: false,
    draggable: false,
    keyboardShortcuts: false,
    disableDoubleClickZoom: false,
    styles: light_grey_style
  };
  var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

  var iterator = 0;

  //Setup heat map and link to Twitter array we will append data to
  var heatmap;
  var liveTweets = new google.maps.MVCArray();
  var gradient = [
    'rgba(0, 255, 255, 0)',
    'rgba(0, 0, 255, 1)',
    // 'rgba(0, 191, 255, 1)',
    // 'rgba(0, 127, 255, 1)',
    // 'rgba(0, 63, 255, 1)',
    // 'rgba(0, 0, 255, 1)',
    // 'rgba(0, 0, 223, 1)',
    // 'rgba(0, 0, 191, 1)',
    // 'rgba(0, 0, 159, 1)',
    // 'rgba(0, 0, 127, 1)',
    // 'rgba(63, 0, 91, 1)',
    // 'rgba(127, 0, 63, 1)',
    // 'rgba(191, 0, 31, 1)',
    'rgba(255, 0, 210, 1)'
  ];
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: liveTweets,
    radius: 25,
    gradient: gradient,
    maxIntensity: 2
  });
  heatmap.setMap(map);

  $("#toggle-tweets").on("click", function(){
    $("#tweets").toggle();
  });

  //Flash a heart onto the map quickly
  var image = {
    url: 'css/small-heart-icon.png',
    // This marker is 20 pixels wide by 32 pixels tall.
    size: new google.maps.Size(25, 24),
    // The origin for this image is 0,0.
    origin: new google.maps.Point(0,0),
    // The anchor for this image is the base of the flagpole at 0,32.
    anchor: new google.maps.Point(13,24)
  };

  if(io !== undefined) {
    // Storage for WebSocket connections
    var socket = io.connect('/');

    // This listens on the "twitter-steam" channel and data is
    // received everytime a new tweet is receieved.
    socket.on('twitter-stream', function (data) {

      //Add tweet to the heat map array.
      var tweetLocation = new google.maps.LatLng(data.lng,data.lat);
      liveTweets.push(tweetLocation);
      //console.log(data.text);

      var marker = new google.maps.Marker({
        position: tweetLocation,
        map: map,
        icon: image,
        animation: google.maps.Animation.BOUNCE,
      });
      setTimeout(function(){
        marker.setMap(null);
      },800);
      if(iterator % 2 == 0){
        $("#tweets").append("<p>"+data.text+"</p>").animate({ scrollTop: $("#tweets").prop("scrollHeight") }, "fast");
      }
      iterator++;
    });

    // Listens for a success response from the server to
    // say the connection was successful.
    socket.on("connected", function(r) {

      //Now that we are connected to the server let's tell
      //the server we are ready to start receiving tweets.
      socket.emit("start tweets");
    });
  }
}
