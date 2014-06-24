/*
 * Before code
*/
$.getJSON('https://api.twitter.com/1/statuses/user_timeline.json?screen_name=MikeRogers0&count=2', function(d){
// Some magic here
}

/*
 * Change to 
*/
$.getJSON('/twitter-proxy.php?url='+encodeURIComponent('statuses/user_timeline.json?screen_name=MikeRogers0&count=2'), function(d){
// Some magic here
}