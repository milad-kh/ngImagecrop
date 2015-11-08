(function(ng)
{
  'use strict';
  var
  init = function()
  {
    ng
    .module('ishia-imager', [])
    .directive('ishiaImager', directiveProvider)
    .directive('customOnChange', function() {
      return {
        restrict: 'A',
        scope: {},
        link: function (scope, element, attrs) {
          var con = angular.element(document.querySelector(".wrap-image"));
          console.info('customOnChange initialized', scope);
          console.info(element);
          element.bind('change', function(event)
          {
            console.info(event);
            if (this.files && this.files[0]) {
                var reader = new FileReader();
                reader.onload = function (event) {
                  var img = con.children('img');
                  img[0].src = event.target.result;
                };
                reader.readAsDataURL(this.files[0]);
            }
          });
        }
      };
    })
  },

  link = function(scope, elm, attr)
  {

    var
    canvas = document.getElementById("canvas"),
    ctx = canvas.getContext('2d');

    var con = angular.element(document.querySelector(".wrap-image"));

    scope.openDialoge = function()
    {
      var of = angular.element(elm.find('input'));
      of[0].click();
    };

    scope.showCrop = function()
    {
      var cropMask = document.createElement("div");
      cropMask.style.width = "50px";
      cropMask.style.height = "50px";
      cropMask.style.backgroundColor = "#3F616D";
      cropMask.style.position = "absolute";
      cropMask.style.opacity = "0.6";
      cropMask.style.top = "500px";
      cropMask.setAttribute("draggable", "true");
      cropMask.addEventListener("drag", scope.makeDraggable);
      con.append(cropMask);
    };

    scope.makeDraggable = function(e)
    {
      console.info(e);
    };

    con.bind("dragover", function(event){
      event.preventDefault();
      return false;
    });

    con.bind("drop", function(event){
      event.preventDefault();
      var fileExtension = event.dataTransfer.files[0].type;
      var imageUploadedInfo = event.dataTransfer.files[0];
      var file = event.dataTransfer.files[0];
      var reader = new FileReader();
      reader.onload = function (event)
      {
        var img = con.children('img');
        img[0].src = event.target.result;
        img[0].onload = function()
        {
          // alert('image loaded');
          ctx.drawImage(img[0],0,0);
        }
        console.info('img:', img);
        var imgHeight = con[0].clientHeight + "px";
        var imgWidth = con[0].clientWidth + "px";
        img[0].style.width = imgWidth;
        img[0].style.height = imgHeight;
      };
      reader.readAsDataURL(file);
      return false;
    });
  },

  directiveProvider = function()
  {
    return {
      restrict: "E",
      scope: {
        width: "=",
        height: "="
      },
      link: link,
      templateUrl:'iShiaImagecrop.html'
    }
  }
  ;
  init();

})(this.angular);
