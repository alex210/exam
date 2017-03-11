$(document).ready(function(){

$('.single-item').slick();

function sortImg(div) {
  var img = $(div).children("img")
  $('.grid').imagesLoaded(function() {
    var height = $(img).height();
    var width = $(img).width();
    if(height < width) {
      $(div).addClass('grid-item--width2')
      $(img).width(300);
    }else{$(img).width(150)};
  });
};

  function appImg(data) {
    for (var i = 0; i < data.hits.length; i++) {

      var tag = '';
      for (var j = 0; j < data.hits[i].tags.length; j++) {
        if(data.hits[i].tags[j] == ',') {
          break
        } else {
        tag += data.hits[i].tags[j];
      }
      }

      $('.grid').append('<div class="grid-item"><div class="grid-wrapper"><p>' + tag + '</p></div><img src="' + data.hits[i].webformatURL + '"></div>')
      sortImg($('.grid-item:last'));
    };
  };

  function createRequest() {
    if (window.XMLHttpRequest) req = new XMLHttpRequest();		// normal browser
    else if (window.ActiveXObject) {							// IE
      try {
        req = new ActiveXObject('Msxml2.XMLHTTP');			// IE разных версий
      } catch (e){}
      try {
        req = new ActiveXObject('Microsoft.XMLHTTP');
      } catch (e){}
    }
    return req;
  }

  function inquiry() {
    $('.grid-item').remove();
    var input = escape($('input').val());
    var handlerPath = 'https://pixabay.com/api/?key=4375014-efb2e0e9f216f3fde943e2808&q='+input+'&image_type=photo&per_page=9';
    var req = createRequest();
    if (req) {
      req.open("GET", handlerPath, true);
      req.send();
      req.onreadystatechange = function() {
        if (req.readyState != 4) return;
        if (req.status == 200) {
          var rData = req.responseText;
          var eData = !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(rData.replace(/"(\\.|[^"\\])*"/g, ''))) && eval('(' + rData + ')');
          var data = new Object(eData);
          appImg(data);
        }
      }
    }
  };
inquiry();

$(function() {
  $('.buttonSearch').click(inquiry);
  $('input').keydown(function(eventObject) {
    if (event.keyCode == 13) {
      inquiry();
      return false;
    };
  });
});

});
