(function(ng, $)
{
  'use strict';
  var
  img = new Image(),
  init = function()
  {
    ng
    .module('ishia-imager', ['iShiaAutocomplete', 'L17rFilter'])
    .directive('ishiaImager', ['$http', directiveProvider])
    .directive('customOnChange', function() {
      return {
        restrict: 'A',
        scope: {},
        link: function (scope, element, attrs) {
          element.css("display", "none");
          var con = angular.element(document.querySelector(".wrap-image"));
          element.bind('change', function(event)
          {
            if (this.files && this.files[0]) {
                var reader = new FileReader();
                reader.onload = function (event) {
                  var canvas = document.getElementById("canvas");
                  var ctx = canvas.getContext('2d');
                  img.src = event.target.result;
                  var width = $(img).prop("width");
                  var height = $(img).prop("height");
                  ctx.drawImage(img, 0, 0, width, height, 0, 0, 200, 200);
                };
                reader.readAsDataURL(this.files[0]);
            }
          });
        }
      };
    })
  },

  directiveProvider = function($http)
  {
    return {
      restrict: "E",
      scope: {
        width: "=",
        height: "="
      },

      link: function(scope, elm, attr)
      {
        scope.autocompleteObject = {};
        scope.data = scope.data || {};
        scope.autocompleteObject.url =  attr.autocompleteurl;
        var
        cropMask = document.createElement("div"),
        canvas = document.getElementById("canvas"),
        ctx = canvas.getContext('2d'),
        con = angular.element(document.querySelector(".wrap-image"));

        scope.openDialoge = function()
        {
          var of = angular.element(elm.find('input'));
          of[0].click();
        };

        scope.doCrop = function()
        {
          var image = new Image();
          image.src = canvas.toDataURL();
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          var width = parseInt(cropMask.style.width);
          var height = parseInt(cropMask.style.height);
          var sx = parseInt(cropMask.style.top);
          var sy = parseInt(cropMask.style.left);
          ctx.drawImage(image, sy, sx, width, height, sy, sx, width, height);
          scope.data.imageData = canvas.toDataURL();
          img.src = canvas.toDataURL();
        }

        scope.showCrop = function()
        {
          cropMask.style.resize = "both";
          cropMask.style.overflow = "auto";
          cropMask.style.width = "50px";
          cropMask.style.height = "50px";
          cropMask.style.backgroundColor = "#3F616D";
          cropMask.style.position = "absolute";
          cropMask.style.opacity = "0.6";
          cropMask.style.top = "0px";
          cropMask.style.left = "0px";
          cropMask.style.cursor = "move";
          cropMask.setAttribute("draggable", "true");
          $(cropMask).draggable({
            containment: "#canvas"
          });
          con.append(cropMask);
        };

        scope.sendData = function()
        {
          console.info(scope.data);
          var request = $http({
            method: "post",
            url: attr.resourceurl,
            data: scope.data
          });
          request.success(
            function( html ) {
              $scope.cfdump = html;
            }
          );
        }

        scope.makeDraggable = function(e)
        {
          cropMask.style.top = e.offsetY +"px";
          cropMask.style.left = e.offsetX + "px";
          return false;
        };

        con.bind("dragover", function(event){
          event.preventDefault();
          return false;
        });

        // con.bind("drop", function(event){
        //   event.preventDefault();
        //   // var fileExtension = event.dataTransfer.files[0].type;
        //   var imageUploadedInfo = event.dataTransfer.files[0];
        //   var file = event.dataTransfer.files[0];
        //   var reader = new FileReader();
        //   reader.onload = function (event)
        //   {
        //     var img = con.children('img');
        //     img[0].src = event.target.result;
        //     img[0].onload = function()
        //     {
        //       // alert('image loaded');
        //       ctx.drawImage(img[0],0,0);
        //     }
        //     console.info('img:', img);
        //     var imgHeight = con[0].clientHeight + "px";
        //     var imgWidth = con[0].clientWidth + "px";
        //     img[0].style.width = imgWidth;
        //     img[0].style.height = imgHeight;
        //   };
        //   reader.readAsDataURL(file);
        //   return false;
        // });
      },
      templateUrl:'iShiaImagecrop.html'
    }
  }
  ;
  init();

})(this.angular, this.jQuery);
