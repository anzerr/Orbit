
var angle = function( x1, y1, x2, y2 ) {
	return ( Math.atan2( y2-y1, x2-x1 ) );
}

var distance = function( x1, y1, x2, y2 ) {
	return Math.sqrt( Math.pow( x2-x1, 2 ) + Math.pow( y2-y1, 2 ) );
}

var isset = function( a ) { 
	return ( a && typeof(a) != "undefined" ) 
}

var rgb = function(red, green, blue) { 
	return ( '#' + (0x1000000 + Math.round(blue) + 0x100 * Math.round(green) + 0x10000 * Math.round(red)).toString(16).substr(1) ); 
}

window.onload = function() {
	var canvas = document.getElementById('main');
	var context = canvas.getContext('2d');
		canvas.height = 800;
		canvas.width = 800;
		canvas.style.backgroundColor = "black";

	var orbit = function( i, dist, elliptical, a ) {
		var x = (dist-(dist*elliptical))+(dist * Math.cos(i)), y = ((dist*elliptical) * Math.sin(i));
		return ( { "x":(distance( 0, 0, x, y )*Math.cos(angle( 0, 0, x, y )+a)), "y":(distance( 0, 0, x, y )*Math.sin(angle( 0, 0, x, y )+a)) } );
	}
	
	var sun = {
		'ro':0,
		'p':{
			'x':(canvas.width/2),
			'y':(canvas.height/2)
		}, 
		's':6,
		'render':true
	}
	
	var planet = {}, planetCount = 1;
	for (var i=1; i<=20; i++) {
		planet[planetCount] = {
			'i':0,
			'ro':0,
			'd':25+Math.round( Math.random()*600 ),
			'e':1 - ( Math.round(Math.random()*50)/100 ),
			'r':(Math.PI*2)*Math.random(),
			'c':rgb( 100+(Math.random()*155), 0, 0 ),
			'p':{ 'x':0, 'y':0 },
			's':4,
			'o':sun,
			'render':true
		}
		planetCount++;
	}
	
	for (var i in planet) {
		if ( Math.round(Math.random()*2) == 1) {
			for (var v=0; v<=Math.round(Math.random()*4); v++) {
				var c = Math.random()*255;
				planet[planetCount] = {
					'i':0,
					'ro':0,
					'd':15+Math.round(Math.random()*50),
					'e':1 - ( Math.round(Math.random()*50)/100 ),
					'r':(Math.PI*2)*Math.random(),
					'c':rgb( c, c, c ),
					'p':{ 'x':0, 'y':0 },
					's':2,
					'o':planet[i],
					'render':true
				}
				planetCount++;
			}
		}
	}
	
	var colision = function( id ) {
		if (planet[id].render) {
			if ( distance( planet[id].p.x, planet[id].p.y, sun.p.x, sun.p.y ) < 5 ) {
				return (true);
			}
			for (var i in planet) {
				if ( distance( planet[id].p.x, planet[id].p.y, planet[i].p.x, planet[i].p.y ) < (planet[id].s+planet[i].s) && i != id && planet[id].s <= planet[i].s && planet[i].render ) {
					return (true);
				}
			}
		}
		return (false);
	}
	
	var render = function() {
		context.clearRect ( 0, 0, canvas.width, canvas.height );
		
			context.beginPath();
				context.arc( sun.p.x, sun.p.y, sun.s, 0, 2*Math.PI );
				context.strokeStyle = "white";
				context.stroke();
				context.fillStyle = "yellow";
				context.fill();
			context.closePath();
			
		for (var i in planet) {
			if (planet[i].render) {
				var off = orbit( planet[i].i, planet[i].d, planet[i].e, planet[i].r+planet[i].o.ro );
				planet[i].p = { 'x':(planet[i].o.p.x)+off.x, 'y':(planet[i].o.p.y)+off.y };
				//planet[i].render = ( (colision(i) || planet[i].render == false)? false : true );
				
				context.beginPath();
					//context.rect( planet[i].p.x, planet[i].p.y, planet[i].s,  planet[i].s );
					context.arc( planet[i].p.x, planet[i].p.y, planet[i].s, 0, 2*Math.PI );
					context.strokeStyle = "white";
					context.stroke();
					context.fillStyle = ( (!planet[i].render)? "blue" : planet[i].c );
					context.fill();
				context.closePath();
				planet[i].i = ( (planet[i].i < (2*Math.PI))? planet[i].i+( (Math.PI/180)/(distance( 0, 0, off.x, off.y )/100) ): 0 );
				planet[i].ro = ( (planet[i].ro < (2*Math.PI))? planet[i].ro+(Math.PI/180): 0 );
			}
		}
	}
	
	window.requestAnimFrame = (function(callback) {
		return 	(
			window.requestAnimationFrame || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame || 
			window.oRequestAnimationFrame || 
			window.msRequestAnimationFrame ||
			function(callback) { window.setTimeout(callback, 1000 / 30); }
		);
	})();

	var animate = function() {
		render();
		requestAnimFrame(function() {
			animate();
		});
	};
	animate();
}