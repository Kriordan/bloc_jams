//var pointsArray = document.getElementsByClassName('point');

//var animatePoints = function(points) {
var animatePoints = function() {

//	var revealPoint = function(index) {
//		points[index].style.opacity = 1;
//		points[index].style.transform = "scaleX(1) translateY(0) rotateX(0)";
  var revealPoint = function() {
    $(this).css({
      opacity: 1,
      transform: 'scaleX(1) translateY(0)'
    });
	};

//	for(var i = 0; i < points.length; i++) {
//		revealPoint(i);
//	}
  $.each($('.point'), revealPoint);
};

// window.onload = function() {
$(window).load(function() {
//	if (window.innerHeight > 950) {
  if ($(window).height() > 950) {
//		animatePoints(pointsArray);
    animatePoints();
	}

//	var sellingPoints = document.getElementsByClassName('selling-points')[0];
//	var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;
  var scrollDistance = $('.selling-points').offset().top - $(window).height() + 200;

//	window.addEventListener('scroll', function(event) {
  $(window).scroll(function(event) {
//		if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance) {
    if ($(window).scrollTop() >= scrollDistance) {
//			animatePoints(pointsArray);
      animatePoints();
		}
	});
// }
});
