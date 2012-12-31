//animations
window.requestAnimFrame = (function(callback){
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback){
        window.setTimeout(callback, 1000 / 30);
    };
})();

function animate(lastTime){
	
	// update
	var date = new Date();
    var time = date.getTime();
    var timeDiff = time - lastTime;
	var period = timeDiff/1000; //times per second, our period
	//console.log(1000/timeDiff);
	//if(!PAUSE) {
	for (var i = 0; i < UNIT_ARRAY.length; i++) {
		var unit = UNIT_ARRAY[i];
		unit.MoveTo(period);
		unit.SyncShape();
	}
	
    // clear
	lastTime = time;
	
    // draw
	BOARD.stage.layers[0].draw();

	//}
	// request new frame
	requestAnimFrame(function(){
		animate(lastTime);
	});
}

function GetUrlVars()
{
    var vars = {}, hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars[hash[0]] = hash[1];
    }
    return vars;
}

 // Add a script element as a child of the body
 // Use this to 'lazy' load scripts after page load
 function loadJSScript(JSscript, callBack) {
	var js = document.createElement("script");
	//js.type= 'text/javascript';
	js.src = JSscript;
	document.head.appendChild(js);

    js.onload = function () {
        console.log('JS onload fired');
		callBack();
		//removes the call once loaded, script will remain in memory
		//document.head.removeChild(js); 
    }
 }

 
function loadImages(sources, callback){
    var images = {};
    var loadedImages = 0;
    var numImages = 0;
    for (var src in sources) {
        numImages++;
    }
    for (var src in sources) {
        images[src] = new Image();
        images[src].onload = function(){
            if (++loadedImages >= numImages) {
                callback(images);
            }
        };
        images[src].src = sources[src];
    }
    
    //callback(images);
}

function fpsCounter() {
//fps stat---------------------------
	var stats = new Stats();
	stats.domElement.style.position = 'fixed';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';
	$('html').append( stats.domElement );
	setInterval( function () {
		stats.update();
	}, 1000 / 60 );
}
	
$(document).ready(function(){ //main function

	UNIT_ARRAY = [];
	
	fpsCounter();
	
	new Board(({
		id: 'BOARD',
		rowNum: 300,
		colNum: 400,
		top: 10,
		left: 250,
		color: 'gray',
		cellSize: 1, //px by px
	}));
	
	var vars = GetUrlVars();
	
	if(typeof vars['num'] == 'undefined')
		vars['num'] = 1500;
	
	for(var i = 0; i < vars['num']; i++) {
		var rand = Math.ceil(Math.random()*10);
		var rand2 = Math.ceil(Math.random()*10);
		var id = 'sand_'+i;
		var unit = new Unit(({
			id: id,
			board: BOARD,
			array: UNIT_ARRAY,
			row: 4,
			col: 5,
			size: 3,//(11-rand),
			speed: rand*15, //rand 1-10 * 15 cell per sec
			color: (rand2 > 5) ?'white': 'tan',
		}));
		//console.log(unit);
		UNIT_ARRAY[i] = unit;//window[id];
	}
	
	$('#board-canvas').mousemove(function(e){
		var thisObj = BOARD;
			
		var x = e.pageX - this.offsetLeft;
		var y = e.pageY - this.offsetTop;
		var row = Math.floor(y/thisObj.cellSize);
		var col = Math.floor(x/thisObj.cellSize);
		//console.log(row,col);
		for(var i = 0; i < UNIT_ARRAY.length; i++)		
			UNIT_ARRAY[i].SetMoveTo(row,col);	
	});
	
	var date = new Date();
    var time = date.getTime();
	animate(time);
});