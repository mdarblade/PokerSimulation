var epsilon = 0.00001;
var games = [];
var currentGame = 0;
var speed = 200;

function getGame() {
	if(currentGame + 1 >= games.length){
		$.ajax({
			url: 'controllers/getGame.php',
			dataType: 'json',
			async: false,
			success: function(data) {
				games = data;
			}
		});
		currentGame = 0;
	} 
	currentGame = currentGame + 1;
	return games[currentGame];
}

function sendResult(result) {
	var response;
	var postForm = { //Fetch form data
		'result'     : JSON.stringify(result)
	};	
	$.ajax({
		url: 'controllers/sendResult.php',
		type: "POST",
		dataType:'json',
		async: true,
		data: postForm
	});
}

function backToDefault() {
	$('.handc').css({backgroundPosition: '16.66% 100%'});
	setSliderTo('50');
}

function setSliderTo(value) {
	setTimeout("$('#slider-thumb').css('left', '".concat(value.concat("%');")),speed / 10);  
	setTimeout("$('#slider').slider('value', ".concat(value.concat(");")), speed);
	$('#slider-thumb').text(value.concat(' %'));	
}

function signalCorrection(hit) {
	var colorHL;
	if(hit){
		colorHL = 'green';
	} else {
		colorHL = 'red';
	}
	$('#slider-thumb').toggle( "highlight", {color: colorHL} );
	$('#slider-thumb').toggle( "highlight", {color: colorHL} );
}

function updateScore(yi, pi, n) {
	yi = Math.min(Math.max(epsilon, yi), 1-epsilon);
	pi = Math.min(Math.max(epsilon, pi), 1-epsilon);
	var CurrentLogLoss = parseInt($('#currentll').text()) / 100 * (n - 1) - (pi * Math.log(yi) + (1 - pi) * Math.log(1- yi));	

	$('#currentll').text(Math.round(100 * CurrentLogLoss / n).toString().concat('%'));
	
	if(Math.abs(yi-pi) < 0.05){
		$('#hit').text(parseInt($('#hit').text()) + 1);
	}
	$('#guesses').text(parseInt($('#guesses').text()) + 1);
}

$(document).ready(function() {
	var ready = true;
	var turn = 0;
	var game = getGame();
	var globalResult = [];	
	var currentResult = [game.IdDeck];	
	
	backToDefault();
	$('#C1').css({backgroundPosition: game.Hand1X.concat('% ').concat(game.Hand1Y.concat('%'))});
	$('#C2').css({backgroundPosition: game.Hand2X.concat('% ').concat(game.Hand2Y.concat('%'))});	

    $('#slider').slider({
        min: 0,
        max: 100,
        animate: "normal",
        step: 1,
        value: 50,
        animate: true,
		
        change: function(event, ui) {
			if (event.originalEvent && ready) {
				ready = false;
				turn = turn + 1;
				$( "#amount" ).val( ui.value );
				$('#slider-thumb').text(ui.value.toString().concat(' %'));
				$('#slider-thumb').css('left', ui.value.toString().concat('%'));		
				
				var Prediction = ui.value;
				var Proba;
				switch(turn) {
					case 1:
						Proba = game.Probability1;
						break;
					case 2:
						Proba = game.Probability2;
						break;
					case 3:
						Proba = game.Probability3;
						break;		
					case 4:
						Proba = game.Probability4;
						break;						
					default:
						console.log('turn out of rules');
				}
				Proba = Math.min(Math.max(epsilon, Proba), 100-epsilon).toString();
				
				setSliderTo(Proba);	
				signalCorrection(Math.abs(Prediction / 100 - parseInt(Proba) / 100 ) < 0.05);
				updateScore(Prediction / 100, parseInt(Proba) / 100, turn + 4 * parseInt($('#ngame').text()));
				currentResult.push(Prediction.toString());
				
				/* Card management */
				setTimeout(function(){
					switch(turn) {
						case 1:
							$('#B1').css({backgroundPosition: game.Board1X.concat('% ').concat(game.Board1Y.concat('%'))});
							$('#B2').css({backgroundPosition: game.Board2X.concat('% ').concat(game.Board2Y.concat('%'))});
							$('#B3').css({backgroundPosition: game.Board3X.concat('% ').concat(game.Board3Y.concat('%'))});
							break;
						case 2:
							$('#B4').css({backgroundPosition: game.Board4X.concat('% ').concat(game.Board4Y.concat('%'))});
							break;
						case 3:
							$('#B5').css({backgroundPosition: game.Board5X.concat('% ').concat(game.Board5Y.concat('%'))});
							break;		
						case 4:			
							setTimeout(
								function(){
									globalResult.push(currentResult);
									if(globalResult.length >= 2){
										sendResult(globalResult);
										globalResult = [];
									}
									
									$('#ngame').text(parseInt($('#ngame').text()) + 1);									
									game = getGame();
									currentResult = [game.IdDeck];
									backToDefault();
									$('#C1').css({backgroundPosition: game.Hand1X.concat('% ').concat(game.Hand1Y.concat('%'))});
									$('#C2').css({backgroundPosition: game.Hand2X.concat('% ').concat(game.Hand2Y.concat('%'))});
									turn = 0;
								},3*speed); 
							break;
						default:
							console.log('turn out of rules');
					}
					}, speed);
			}	
			ready = true;
		},
        slide: function( event, ui ) {
            $( "#amount" ).val( ui.value );
            $('#slider-thumb').text(ui.value.toString().concat(' %'));
			$('#slider-thumb').css('left', ui.value.toString().concat('%'));
        },
        create: function(event, ui) {
            var v=$(this).slider('value');
			$('#slider-thumb').text(v.toString().concat(' %'));
        }
    });	
});










