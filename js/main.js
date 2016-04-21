var color_abbr = ['R', 'G', 'B', 'Y', 'O', 'P', 'S'];
var pickables = [];

var PickBox = {
	color: "",
	pX:0.0,
	pY:0.0,
	pR:0.0
}

function check(pick) {
  for (var i = 0; i < pickables.length; i++) {
    var tPick = pickables[i];
    if (pick != tPick) {
      var p0 = pick.position();
      var p1 = tPick.position();

      var tooClose = true;
      if (p0.left + 3 < p1.left) {
        tooClose = false;
      }

      if (p0.top + 3 < p1.top) {
        tooClose = false;
      }

      if (p0.left > p1.left + 3) {
        tooClose = false;
      }

      if (p0.top > p1.top + 3) {
        tooClose = false;
      }

      if (tooClose) {
        var mX = p0.left - (Math.random() * 10 - 5);
        var mY = p0.top - (Math.random() * 10 - 5);

        if (mX < 5) { mX = 5; }
        if (mX > 530) { mX = 530; }
        if (mY < 5) { mY = 5; }
        if (mY > 225) { mY = 225; }
        move(pick, mX, mY);
      }
    }
  } 
}

function move(pick, dX, dY) {
  dX = dX || Math.random() * 510 + 5;
  dY = dY || Math.random() * 210 + 5;

  pick.animate({
    opacity:0.75,
    top: dY,
    left: dX
  }, {
    duration: Math.floor(Math.random()*1000)+1000,
    specialEasing: {
      width: "easeIn",
      height: "easeOut"
    },
    complete: function() {
      check(pick); 
    }
  });
}

function reset() {
  $('#bag_canvas').html('');
  pickables = [];
  $('.color-pick input').each(function() {
    var color = $(this).data('color');
    var num = Number($(this).val());

    var color_init = color.charAt(0).toUpperCase(); 
    for (var i = 0; i < num; i++) {
      var pX = (545/2) + (Math.random() * 10 - 5);
      var pY = (240/2) + (Math.random() * 10 - 5);

      var pick = new $('<div class="swatch ' + color + ' small" style="top:' + pY + 'px; left:' + pX +'px; opacity:0.10;" data-colorid="' + color_init +''+ (i+1) + '">');
      pickables.push(pick);
      $('#bag_canvas').append(pick);
      move(pick);
    }
  });	
}

function createResults() {
  $('.results').html('');

  var trials = Number($('#trials').val());
  var draws = Number($('#draws').val());
  var replace = $('#replace').prop('checked');

  var possibilities = [];
  var total = 0;

  for (var t = 0; t < trials; t++) {
    var trial = new $('<div class="row trial-result">');
    $(trial).append(new $('<div class="col-md-1" style="text-align:right">Trial #'+(t+1)+'</div>'));
    var trialInner = new $('<div class="col-md-11"></div>');
    
    var clonePicks = pickables.slice(0);
    
    for (var d = 0; d < draws; d++) {
      var i = Math.floor(Math.random() * clonePicks.length);
      var draw = $(clonePicks[i]).clone();
      $(draw).removeClass('small');
      $(draw).addClass('mini');
      $(trialInner).append(draw);

      if (!replace) {
        clonePicks.splice(i, 1);
      }
    }

    $(trial).append(trialInner);
    $('.results').append(trial);
  }

  $('.results').append('<div class="row trial-export"><div class="col-md-offset-10 col-md-2"><button id="export" type="button" class="btn btn-primary" style="float:right" onclick="exportCSV()">Export to CSV</button></div></div>');
}

function exportCSV() {
  var csv = "";
  trial = 1;

  $('.trial-result').each(function() {
    var $this = $(this);
    csv += "" + trial + ",";
    $this.children('.col-md-11').children().each(function() {
      var colorid = $(this).data('colorid');
      csv += "" + colorid + ",";
    });
    csv = csv.slice(0, -1);
    csv += "\n";
    trial++;
  });

  filename = "objectpicking.csv";
  var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
}

$(function() {
  reset();

  $('.color-pick input').change(function() {
    reset();
  });

  $('#submit').click(function() {
    createResults();
  });
});
