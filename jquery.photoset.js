(function($,sr){
  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  var debounce = function (func, threshold, execAsap) {
      var timeout;

      return function debounced () {
          var obj = this, args = arguments;
          function delayed () {
              if (!execAsap)
                  func.apply(obj, args);
              timeout = null;
          };

          if (timeout)
              clearTimeout(timeout);
          else if (execAsap)
              func.apply(obj, args);

          timeout = setTimeout(delayed, threshold || 100);
      };
  }
  // smartresize
  jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');

;(function( $ ) {
/*  Original Source of Photoset by http://terrymun.com/ */
  var contentSelector = '> *:first-child():not(a), > a img';
  
  $.fn.photoset = function( options ) {

    return this.each(function() {
      var settings = $.extend({}, $.fn.photoset.defaults, options);

      // if simple layout is provided, generate photoset layout
      //if(!$('> :first-child', this).is('.photoset-row')) {
      if($(this).children().first().is('.photoset-row') == false) {
        makePhotoSetLayout(this, settings);
      }
      if($(this).find(".photoset-item").length > 1) {
        photoSetInit(this, settings);
      }
    }); // end this.each

    function photoSetInit(that, settings) {
      console.log('photoSetInit');
        
      // Store original image dimensions
      $('img', that).each(function () {
        $(this)
          .data('org-width', $(this)[0].naturalWidth)
          .data('org-height', $(this)[0].naturalHeight)
          .parent('a');
      });
      $('video, iframe', that).each(function () {
        $(this)
          .data('org-width', $(this).attr('width'))
          .data('org-height', $(this).attr('height'))
          .parent('a');
      });      

      photoSetResize(that, settings);

      // Detect resize event
      if(typeof $.fn.smartresize == "function") {
        $(window).smartresize(function () {
          photoSetResize(that, settings);
        });
      }else{
        $(window).resize(function () {
          photoSetResize(that, settings);
        });
      }
    }

    function photoSetResize(that, settings) {
      // Detect viewport size
      // Set photoset image size
      $('.photoset-row', that).each(function () {
        var $pi    = $(this).find('.photoset-item'),
            cWidth = $(this).parent('.photoset').width();

        // Generate array containing all image aspect ratios
        var ratios = $pi.map(function () {
          var ratio;
          if($(this).find(contentSelector).attr('data-ratio')) {
            ratio = $(this).find(contentSelector).attr('data-ratio');
          }else{
            ratio = $(this).find(contentSelector).data('org-width') / $(this).find(contentSelector).data('org-height');
          }
          return ratio;
        }).get();

        // Get sum of widths
        var sumRatios = 0, sumMargins = 0,
            minRatio  = Math.min.apply(Math, ratios);
        for (var i = 0; i < $pi.length; i++) {
          sumRatios += ratios[i]/minRatio;
        };

        $pi.each(function (){
          sumMargins += parseInt($(this).css('margin-left')) + parseInt($(this).css('margin-right'));
        });

        // Calculate dimensions
        $pi.each(function (i) {
          var minWidth = (cWidth - sumMargins)/sumRatios;
          $(this).find(contentSelector)
            .height(Math.ceil(minWidth/minRatio))
            .width(Math.ceil(minWidth/minRatio * ratios[i]));
        });
      });
    }

    function makePhotoSetLayout(that, settings) {
      var lines = $(that).html().trim().split('\n');

      var $photoset = $(that).empty();
      var $photosetRow = $('<div class="photoset-row" />').appendTo($photoset);

      $.each(lines, function(i, line) {
        line = line.trim();
        if(line == "") { // new Row
          $photosetRow = $('<div class="photoset-row" />').appendTo($photoset);
          return;
        }
        $('<div class="photoset-item"/>').html(line).appendTo($photosetRow);
      });
    }

  }

  $.fn.photoset.defaults = {};
})( jQuery );