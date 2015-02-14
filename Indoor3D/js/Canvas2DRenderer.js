/**
 * a 2d Canvas renderer for fast rendering
 * Created by gaimeng on 15/2/2.
 */

//---------------------the Sprite class------------------
function CanvasSprite(params){
    var _this = this,
        _ctx = params.ctx,
        _width = params.width,
        _height = params.height,
        _offsetX = 0,
        _offsetY = 0,
        _visible = true,

        _img = new Image();
    _img.src = params.image;

    this.draw = function(x, y){
        if(_visible){
            _ctx.drawImage(_img,_offsetX, _offsetY, _width, _height, x >> 0, y >> 0, _width, _height);
        }
    }

    this.show = function(){
        _visible = true;
    }

    this.hide = function(){
        _visible = false;
    }
}

Canvas2DRenderer = function (param) {
    param = param || {};
    var _canvas = param.canvas !== undefined
                ? param.canvas : document.createElement('canvas');
    var _this = this,
        _canvasWidth = _canvas.width,
        _canvasHeight = _canvas.height,
        _canvasWidthHalf = Math.floor( _canvasWidth / 2),
        _canvasHeightHalf = Math.floor(_canvas.height / 2),
        _padding = 30,

        _centerX = 0,
        _centerY = 0,
        _oldId = 0,

        _clearColor,
        _showNames = true,
        _showPubPoints = true,
        _clickPoint=[0,0],
    _ctx = _canvas.getContext('2d'),
    _clearColor,
    _scale;

    this.domElement = _canvas;
    this.setDefaultView = function(object){
        if(object._id != _oldId) {
            var width = object.rect.br[0] - object.rect.tl[0];
            var height = object.rect.br[1] - object.rect.tl[1];
            var scaleX = _canvasWidth / (width+_padding);
            var scaleY = _canvasHeight / (height+_padding);
            _scale = scaleX < scaleY ? scaleX : scaleY;
            _centerX = (object.rect.br[0] + object.rect.tl[0])/2;
            _centerY = (object.rect.br[1] + object.rect.tl[1])/2;
        }
    }
    this.render = function (scene, camera){
        if(scene.mall === undefined) {
            return;
        }

        //get render data
        var curFloor = scene.mall.getCurFloor();

        _ctx.save();
        _ctx.fillStyle = _clearColor;
        _ctx.fillRect(0,0,_canvasWidth, _canvasHeight);
        _ctx.scale(_scale, _scale);
        _ctx.translate(_canvasWidthHalf/_scale-_centerX, _canvasHeightHalf/_scale - _centerY);
       // _ctx.scale(_scale, _scale);


        var poly = curFloor.Outline[0][0];
        _ctx.beginPath();
        _ctx.moveTo(poly[0], poly[1]);
        for(var i = 2; i < poly.length - 1; i+=2){
            _ctx.lineTo(poly[i],poly[i+1]);
        }
        _ctx.closePath();
        _ctx.strokeStyle = curFloor.strokeColor;
        _ctx.lineWidth = 1;
        _ctx.stroke();
        _ctx.fillStyle = curFloor.fillColor;
        _ctx.fill();


        for(var i = 0 ; i < curFloor.FuncAreas.length; i++){
            var funcArea = curFloor.FuncAreas[i];
            var poly = funcArea.Outline[0][0];
            if(poly.length < 6){ //less than 3 points, return
                return;
            }
            _ctx.beginPath();

            _ctx.moveTo(poly[0], poly[1]);
            for(var j = 2; j < poly.length - 1; j+=2){
                _ctx.lineTo(poly[j],poly[j+1]);
            }
            _ctx.closePath();
            _ctx.strokeStyle = funcArea.strokeColor;
            _ctx.lineWidth = 1;
            _ctx.stroke();


            _ctx.fillStyle = funcArea.fillColor;
            _ctx.fill();

            if(_showNames){//draw shop names

            }
        }
        _ctx.restore();


    }

    this.setClearColor = function(color){
        _clearColor = color;

    }

    this.zoomIn = function(zoomScale){
        if(zoomScale === undefined){
            zoomScale = 0.8;
        }
        _scale /= zoomScale;
    }

    this.zoomOut = function(zoomScale){
        if(zoomScale === undefined){
            zoomScale = 0.8;
        }
        _scale *= zoomScale;
    }

    this.setSize = function(width, height) {
        _canvasWidth = width;
        _canvasHeight = height;
        _canvas.width = _canvasWidth;
        _canvas.height = _canvasHeight;
        _canvasWidthHalf = Math.floor(_canvasWidth / 2);
        _canvasHeightHalf = Math.floor(_canvasHeight / 2);
    }

    function onTouchStart(event){
        _clickPoint[0] = event.touches[0].clientX * _scale;
        _clickPoint[1] = event.touches[0].clientY * _scale;
    }
}