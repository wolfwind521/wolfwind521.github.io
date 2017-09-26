/**
 * a canvas renderer for 2d indoor map rendering
 * Created by gaimeng on 15/2/2.
 * Modified by gaimeng on 17/9/11
 */

//---------------------IndoorMap2D class-----------------
IndoorMap2d = function(mapdiv){
    var _this = this;
    var _mapDiv = mapdiv;
    var _controls = null;

    var _curFloorNo = 0;
    var _selectionListener = null;
    var _selected = null; //the selected feature
    var _selectedOldColor;
    var _theme = null;

    //options
    this.options = {
        showNames : true,
        showPubPoints : true,
        selectable : true,
        movable: true
    };

    this.containerSize = [0, 0];
    this.containerHalfSize = [0, 0];
    this.containerPos = [0,0];
    this.mapCenter = [0 ,0];

    this.renderer = null;
    this.is3d = false;
    this.minSize = 200;     //minimum map size when scaling
    this.maxSize = 30000;    //maximum map size when scaling

    //var _marker;

    this.init = function(){
        _this.containerSize[0] = parseInt(_mapDiv.style.width);
        _this.containerSize[1] = parseInt(_mapDiv.style.height);
        _this.containerHalfSize[0] = _this.containerSize[0] / 2;
        _this.containerHalfSize[1] = _this.containerSize[1] / 2;
        _this.containerPos = IDM.DomUtil.getPos(_mapDiv);

        _this.renderer = new Canvas2DRenderer(_this);
        var canvasDiv = _this.renderer.domElement;
        _controls = new Controller2D(_this);
        _mapDiv.appendChild(canvasDiv);
        _mapDiv.style.overflow = "hidden";
    };

    this.reset = function(){
        _controls.reset();
        _this.renderer.reset();
    };

    this.setTheme = function(theme){
        if(_theme == null){
            _theme = theme
        }
        else if(_theme != theme) {
            _theme = theme;
            _this.parse(_this.building.jsonData); //parse
            redraw();
        }
        return _this;
    };

    this.theme = function(){
        return _theme;
    };

    this.getBuilding = function(){
        return _this.building;
    };

    //load the map by the json file name
    this.load = function (fileName, callback) {
        _this.reset();
        _theme = default2dTheme;
        var loader = new IndoorMapLoader();
        loader.load(fileName, function(json){
            _this.building = Parser2D(json);
            _this.showFloor(_this.building.getDefaultFloorNo());
            if(callback) {
                callback();
            }
        });
    };

    this.parse = function(json){
        _this.reset();
        if(_theme == null) {
            _theme = default2dTheme;
        }
        _this.building = Parser2D(json, _theme);
        _this.showFloor(_this.building.getDefaultFloorNo());

        _mapDiv.style.background = _theme.background;
        return _this;
    };

    //reset the camera to default configuration
    this.setDefaultView = function () {
        _this.renderer.setDefaultView(_this.building.getFloor(_curFloorNo));
        _controls.reset();
        _controls.viewChanged = true;
    };

    //TODO:adjust camera to fit the building
    this.adjustCamera = function() {
        _this.setDefaultView();
    };

    this.translate = function(vec){
        _this.renderer.translate(vec);
    };

    //get proper relative scale limited by minSize and maxSize
    this.getProperScale = function (scale) {
        var curFloor = _this.building.getFloor(_curFloorNo);
        var flbbox = curFloor.bbox;
        if(scale < 1)
        {
            var minLen = Math.min(flbbox.br[0] - flbbox.tl[0], flbbox.br[1] - flbbox.tl[1]);
            var minLenScale = minLen * scale;
            scale = minLenScale < _this.minSize ? _this.minSize / minLen : scale;
        }
        else
        {
            var maxLen = Math.max(flbbox.br[0] - flbbox.tl[0], flbbox.br[1] - flbbox.tl[1]);
            var maxLenScale = maxLen * scale;
            scale = maxLenScale > _this.maxSize ? _this.maxSize / maxLen : scale;
        }
        return scale;
    };

    this.zoomIn = function(zoomScale){
        if(zoomScale === undefined){
            zoomScale = 1.25;
        }
        _this.renderer.scale(zoomScale);
    };

    this.zoomOut = function(zoomScale){
        if(zoomScale === undefined){
            zoomScale = 0.8;
        }
        _this.renderer.scale(zoomScale);
    };

    this.showAreaNames = function(show) {
        _this.options.showNames = show == undefined ? true : show;
        redraw();
        return _this;
    };

    //show pubPoints(entries, ATM, escalator...)
    this.showPubPoints = function(show){
        _this.options.showPubPoints = show == undefined ? true: show;
        redraw();
        return _this;
    };

    //get the selected object
    this.getSelectedId = function(){
        if(_selected && _selected.properties.FT_ID) {
            return _selected.properties.FT_ID;
        }else{
            return  "";
        }
    };

    //the callback function when sth is selected
    this.setSelectionListener = function(callback){
        _selectionListener = callback;
        return _this;
    };

    //select object by id
    this.selectById = function(id){
        var floor = _this.building.getFloor(_curFloorNo);
        for(var i = 0; i < floor.rooms.length; i++){
            if(floor.rooms[i].FT_ID && floor.FuncAreas[i].FT_ID == id) {
                _this.deselectAll();
                _this.select(floor.rooms[i]);
            }
        }
    };

    //show floor by id
    this.showFloor = function(floorNo) {
        if(!_this.building){
            return;
        }
        _curFloorNo = floorNo;

        if(_this.options.showNames) {
            _this.renderer.createNameTexts(floorNo, _this.building);
        }

        _this.adjustCamera();

        return _this;
    };

    this.getCurFloorNo = function () {
        return _curFloorNo;
    }

//    this.setSelectionMarker = function(marker){
//        //_marker = marker;
//    }

    //set if the objects are selectable
    this.setSelectable = function (selectable) {
        if(selectable){
            _mapDiv.addEventListener('mouseup', onSelectObject, false);
            _mapDiv.addEventListener('touchend', onSelectObject, false);
        }else{
            _mapDiv.removeEventListener('mouseup', onSelectObject, false);
            _mapDiv.removeEventListener('touchend', onSelectObject, false);
        }
        return _this;
    };

    //set if the user can pan the camera
    this.setMovable = function(movable){
        _controls.enable = movable;
        return _this;
    };

    //focus
    this.focus = function (obj){
        _this.renderer.focus(obj);
    };

    this.deselectAll = function(){
        if (_selected) {
            _selected.properties.fillColor = _selectedOldColor;
            redraw();
        }
    };

    //select object(just hight light it)
    this.select = function(obj){
        if(obj != undefined) {
            _selectedOldColor = obj.properties.fillColor;
            obj.properties.fillColor = _theme.selected;
            //var pos = _this.renderer.localToWorld(obj.Center);
            _selected = obj;
            redraw();

//            _marker.style.left = pos[0] - _marker.width / 2;
//            _marker.style.top = pos[1] - _marker.height / 2;
//            _marker.style.visibility = true;
        }
    };

    function onSelectObject(event){
        event.preventDefault();
        var pos = [0,0];
        if(event.type == "touchend"){
            pos[0] = event.changedTouches[0].clientX;
            pos[1] = event.changedTouches[0].clientY;
        }else {
            pos[0] = event.clientX;
            pos[1] = event.clientY;
        }

        if(Math.abs(pos[0] - _controls.startPoint[0] + pos[1] - _controls.startPoint[1]) <5) {
            //turn browser point into container viewport point
            pos[0] -= IDM.DomUtil.getElementLeft(_mapDiv);
            pos[1] -= IDM.DomUtil.getElementTop(_mapDiv);

            //deselect the old one
            _this.deselectAll();

            _selected = _this.renderer.onSelect(pos);

            if (_selected) {
                _this.select(_selected);
                console.log(_this.getSelectedId());
                if (_selectionListener) {
                    _selectionListener(_selected);
                }

            } else {
                if (_selectionListener) {
                    _selectionListener(null);
                }
            }

        }
        redraw();
    }

    function redraw(){
        _this.renderer.clearBg();
        _this.renderer.render(_this.building);
    }

    function animate () {
        requestAnimationFrame(animate);
        //_controls.update();
        if(_controls.viewChanged) {
            _this.renderer.render(_this.building);
            _controls.viewChanged = false;
        }


    }

    _this.init();
    animate();
};

//---------------------2D Renderer class ----------------
Canvas2DRenderer = function (map) {

    var _this = this,
        _map = map,
        _ctx;
    var _canvas = document.createElement('canvas');

    var _padding = 0.2;  //padding between map bounding box and the div boundary

    var _floorSize = [0, 0];

    //canvas real size
    var _canvasPos = [0, 0], //in the browser coordinate
        _canvasSize = [0, 0],
        _canvasHalfSize = [0, 0],
        _bounds = null,

        _nameTexts = [],
        _sprites = [],
        _pubPoints = [0,0],


        _scale = 1.0;
    var _curFloor = null;
    var _objSize = [0,0];
    var _translate = [0,0];

    this.domElement = _canvas;
    this.mapCenter = [];
    var _devicePixelRatio = 1;

    function _init(){
        _canvas.style.position = "absolute";
        _ctx = _canvas.getContext('2d');
        _this.updateViewport();


    }

    this.updateViewport = function(isZoom){
        var clippadding = clipPadding();
        var clipSize = [(_map.containerSize[0]*clippadding) >> 0, (_map.containerSize[1]*clippadding) >> 0];
        _canvasPos[0] = _map.containerPos[0] - clipSize[0];
        _canvasPos[1] = _map.containerPos[1] - clipSize[1];
        var realRatio = 1 + 2*clippadding;
        _canvasSize[0] = (realRatio * _map.containerSize[0]) >> 0;
        _canvasSize[1] = (realRatio * _map.containerSize[1]) >> 0;
        _canvasHalfSize[0] = _canvasSize[0]*.5;
        _canvasHalfSize[1] = _canvasSize[1]*.5;
        _bounds = new Rect(-_canvasHalfSize[0],-_canvasHalfSize[1],_canvasHalfSize[0], _canvasHalfSize[1]);
        _canvasPos[0] = -clipSize[0];
        _canvasPos[1] = -clipSize[1];
        IDM.DomUtil.setPos(_canvas, _canvasPos);
        _devicePixelRatio = window.devicePixelRatio || 1;
        var area = _canvasSize[0]*_canvasSize[1]*_devicePixelRatio*_devicePixelRatio;
        _devicePixelRatio = (IDM.Browser.mobile && !IDM.Browser.android || IDM.Browser.android23) && (area > 5E6) ? 1 : _devicePixelRatio;
        _canvas.width = _canvasSize[0] * _devicePixelRatio;
        _canvas.height = _canvasSize[1] * _devicePixelRatio;
        _canvas.style.width = _canvasSize[0] + "px";
        _canvas.style.height = _canvasSize[1] + "px";
        _ctx.scale(_devicePixelRatio, _devicePixelRatio);
        _ctx.translate(_canvasHalfSize[0], _canvasHalfSize[1]);
        if(isZoom){
            _ctx.translate(_translate[0],_translate[1]);
        }
    };

    function clipPadding(){
        var ratio = ((IDM.Browser.mobile ? 1280 : 2000) / Math.max(window.innerWidth, window.innerHeight) - 1) / 2;
        return Math.max(0, Math.min(.5, ratio));
    }

    this.translate = function(vec){
        //TODO: clip polygons if necessary

        _translate[0] += vec[0];
        _translate[1] += vec[1];
        _ctx.translate(_translate[0], _translate[1]);
        _this.clearBg();
        _this.render();
    };

    this.scale = function(scale){
        _scale *= _map.getProperScale(scale);
        _curFloor = _map.building.getFloor(_map.getCurFloorNo());
        updateOutline(_curFloor, _scale);
        var rooms = _curFloor.rooms;
        for(var i = 0; i < rooms.length; i++){
            updateOutline(rooms[i], _scale);
        }
        var pubPoints = _curFloor.pubPoints;
        for(var i = 0; i < pubPoints.length ; i++){
            updateOutline(pubPoints[i], _scale);
        }
        _ctx.translate(-_translate[0], -_translate[1]);
        _translate[0] *= scale;
        _translate[1] *= scale;
        _ctx.translate(_translate[0], _translate[1]);
        _this.clearBg();
        _this.render();
    };
    function updateOutline(obj, scale){
        var outline;
        if(obj.geometry.type == "Point")
            outline = [obj.geometry.coordinates];
        else
            outline = obj.geometry.coordinates[0];
        obj.newOutline = [];
        for(var i = 0; i < outline.length; ++i){
            var newPoint = updatePoint(outline[i], scale);
            obj.newOutline.push(newPoint);
        }
        obj.bbox = IDM.GeomUtil.getBoundingRect(obj.newOutline);
        //if(!obj.bbox.isCollide(_bounds)){
        //    obj.newOutline = [];
        //    obj.bbox = new Rect();
        //}
        if(obj.properties.center) {
            obj.properties.center = [((obj.bbox.br[0]+obj.bbox.tl[0])/2) >> 0 , ((obj.bbox.br[1]+obj.bbox.tl[1])/2) >> 0];
        }
    }

    function updatePoint(point, scale){
        return [((point[0] - _this.mapCenter[0])*scale), ((point[1] - _this.mapCenter[1])*scale)];
    }

    this.setDefaultView = function (floor) {
        if(!floor)
            return;
        floor.bbox = IDM.GeomUtil.getBoundingRect(floor.geometry.coordinates[0]);

        var floorSize = [0, 0];
        floorSize[0] = floor.bbox.br[0] - floor.bbox.tl[0];
        floorSize[1] = floor.bbox.br[1] - floor.bbox.tl[1];
        var scaleX = (_map.containerSize[0]*(1 - _padding)) / floorSize[0];
        var scaleY = (_map.containerSize[1]*(1 - _padding)) / floorSize[1];


        _this.mapCenter[0] = (floor.bbox.br[0] + floor.bbox.tl[0]) / 2;
        _this.mapCenter[1] = (floor.bbox.br[1] + floor.bbox.tl[1]) / 2;

        _ctx.translate(-_translate[0], -_translate[1]);
        _scale = 1.0;
        _translate = [0, 0];
        _this.scale(Math.min(scaleX , scaleY));
    };

    this.reset = function(){
        _nameTexts.length = 0;


    };

    this.focus = function (object) {
        //if(object._id != _oldId) {

        var width = object.bbox.br[0] - object.bbox.tl[0];
        var height = object.bbox.br[1] - object.bbox.tl[1];
        var floor = _map.getBuilding().getFloor(_map.getCurFloorNo());
        var floorSize = [0, 0];
        floorSize[0] = floor.bbox.br[0] - floor.bbox.tl[0];
        floorSize[1] = floor.bbox.br[1] - floor.bbox.tl[1];
        var ratio = (width+height) / (floorSize[0]+floorSize[1]);
        //var padding = ratio > 0.005? _mapWidth * 0.5 : _mapWidth * 0.85;


        var minSize = Math.min(_map.containerSize[0], _map.containerSize[1]);
        var padding = (-1.42*ratio + 0.9) * minSize; //empirical value
        minSize /= 2;
        padding < minSize? padding = minSize : padding;
        var scaleX = (_map.containerSize[0] - padding) / width;
        var scaleY = (_map.containerSize[1] - padding) / height;
        _objSize[0] = width;
        _objSize[1] = height;
        var tmpScale = scaleX < scaleY ? scaleX : scaleY;
        _this.scale(tmpScale);

        var center = [];
        center[0] = (object.bbox.br[0] + object.bbox.tl[0]) / 2;
        center[1] = - (object.bbox.br[1] + object.bbox.tl[1]) / 2;
        var curCenter = _this.worldToLocal([_map.containerHalfSize[0], _map.containerHalfSize[1]]);
        var vec = [curCenter[0]-center[0], curCenter[1]-center[1]];
        _this.updateViewport();
        _this.translate(vec);
    };

    this.screenShot = function(type){
        var tmpCanvas = document.createElement("canvas");
        tmpCanvas.width = _map.containerSize[0], tmpCanvas.height = _map.containerSize[1];

        var tmpCtx = tmpCanvas.getContext('2d');
        tmpCtx.drawImage(_canvas,_canvasPos[0],_canvasPos[1]);
        return tmpCanvas.toDataURL(type);
    };

    this.render = function (){
        if(_map.building === undefined) {
            return;
        }

        var theme = _map.theme();

        //get render data
        _curFloor = _map.building.getFloor(_map.getCurFloorNo());
        if(!_curFloor)
            return;
        _ctx.save();

        //draw floor
        var poly = _curFloor.newOutline;
        _ctx.beginPath();
        _ctx.lineJoin="round";
        _ctx.moveTo(poly[0][0], -poly[0][1]);
        for(var i = 1; i < poly.length; ++i){
            _ctx.lineTo(poly[i][0],-poly[i][1]);
        }
        _ctx.closePath();

        _ctx.fillStyle = _curFloor.properties.fillColor;
        _ctx.fill();
        _ctx.strokeStyle = theme.strokeStyle.color;
        _ctx.lineWidth = theme.strokeStyle.linewidth;
        _ctx.stroke();

        //draw rooms
        var rooms = _curFloor.rooms;
        for(var i = 0 ; i < rooms.length; i++){
            var room = rooms[i];
            var poly = room.newOutline;
            if(poly.length < 3){ //less than 3 points, return
                continue;
            }
            _ctx.beginPath();
            _ctx.lineJoin="round";
            _ctx.moveTo(poly[0][0], -poly[0][1]);
            for(var j = 1; j < poly.length; ++j){
                _ctx.lineTo(poly[j][0],-poly[j][1]);
            }
            _ctx.closePath();

            _ctx.fillStyle = room.properties.fillColor;
            _ctx.fill();
            _ctx.stroke();
        }

        ////test for selection
        //_ctx.fillStyle="#FF0000";
        //_ctx.beginPath();
        //_ctx.arc(_pubPoints[0],_pubPoints[1],5,0,Math.PI*2,true);
        //_ctx.closePath();
        //_ctx.fill();

        _ctx.restore();

        var options = _map.options;
        if(options.showNames){
            var fontStyle = theme.fontStyle;
            //_ctx.textAlign = fontStyle.textAlign;
            _ctx.textBaseline = fontStyle.textBaseline;
            _ctx.fillStyle = theme.fontStyle.color;
            _ctx.font =  fontStyle.fontsize + "px/1.4 " + fontStyle.fontface;
            var textRects = [];
            for(var i = 0 ; i < rooms.length; i++){
                var nameText = _nameTexts[i];

                var center = rooms[i].properties.center;

                var rect = new Rect(center[0] - nameText.halfWidth, -center[1] - nameText.halfHeight, center[0] + nameText.halfWidth, -center[1] + nameText.halfHeight);
                textRects.push(rect);

                nameText.visible = true;

                //for(var j = 0; j < i; j++){
                //    if(_nameTexts[j].visible && textRects[j].isCollide(bbox)){
                //        nameText.visible = false;
                //        break;
                //    }
                //}
                if((rooms[i].bbox.br[0]-rooms[i].bbox.tl[0]) < nameText.halfWidth*2)
                    nameText.visible = false;
                if(nameText.visible) {
                    _ctx.fillText(nameText.text, (center[0] - nameText.halfWidth) >> 0, (-center[1]) >> 0);
//                _ctx.beginPath();
//                _ctx.arc(center[0], center[1], 3, 0, Math.PI * 2, true);
//                _ctx.closePath();
//
//                _ctx.fill();
//                    _ctx.strokeRect(bbox.tl[0], bbox.tl[1], bbox.br[0] - bbox.tl[0], bbox.br[1] - bbox.tl[1]);
                }
            }
        }

        if(options.showPubPoints){
            var pubPoints = _curFloor.pubPoints;
            var imgWidth = 20 , imgHeight = 20 ;
//            if(_scale < 0.1){
//                imgWidth = imgHeight = 12;
//            }

            var imgWidthHalf = imgWidth/2, imgHeightHalf = imgHeight/2;
            var pubPointRects = [];
            for(var i = 0; i < pubPoints.length; i++){
                var pubPoint = pubPoints[i];
                var center = pubPoint.newOutline[0];
                var rect = new Rect(center[0] - imgWidthHalf, -center[1] - imgHeightHalf, center[0] + imgWidthHalf, -center[1] + imgHeightHalf);
                pubPointRects.push(rect);

                pubPoint.visible = true;
                for(var j = 0; j < i; j++){
                    if(pubPoints[j].visible && pubPointRects[j].isCollide(rect)){
                        pubPoint.visible = false;
                        break;
                    }
                }
                if(pubPoint.visible) {
                    var imgUrl = theme.pubPoint(pubPoints[i].properties.TYPE);
                    var image = _sprites[imgUrl];
                    if(image !== undefined)
                        _ctx.drawImage(image, (center[0] - imgWidthHalf) >> 0, (-center[1] - imgHeightHalf) >> 0, imgWidth, imgHeight);
                    else
                    {
                        var img = new Image();
                        img.src = imgUrl;
                        img.onload = function()
                        {
                            _this.render(_map.building);
                        }
                        _sprites[imgUrl] = img;
                    }
                }
            }
        }
    };

    //map the coordinate in the map to the viewport
    //!!hasnt been tested yet
    this.localToWorld = function(pt){
        var worldPoint = [0,0];
        worldPoint[0] = pt[0]+_translate[0]+_map.containerHalfSize[0] >> 0;
        worldPoint[1] = pt[1]+_translate[1]+_map.containerHalfSize[1] >> 0;
        return worldPoint;
    };

    //map the coordinate in the viewport to the map (with -y)
    this.worldToLocal = function(pt){
        var localPoint = [0,0];
        localPoint[0] = (pt[0]-_translate[0]-_map.containerHalfSize[0]) >> 0;
        localPoint[1] = (pt[1]-_translate[1]-_map.containerHalfSize[1]) >> 0;
        return localPoint;
    };

    this.onSelect = function(point){
        var tmpPos = _this.worldToLocal(point);
        //_pubPoints = tmpPos;
        return hitTest(tmpPos);
    };

    this.setSize = function(width, height) {
        _canvas.style.width = width + "px";
        _canvas.style.height = height + "px";
        _canvasSize[0] = width * _devicePixelRatio;
        _canvasSize[1] = height * _devicePixelRatio;
        _canvas.width = _canvasSize[0];
        _canvas.height = _canvasSize[1];
        _canvasHalfSize[0] = Math.floor(width / 2);
        _canvasHalfSize[1] = Math.floor(height / 2);
        _ctx.scale(_devicePixelRatio, _devicePixelRatio);
    };

    function exceed(scale){
        //var curWidth = _objSize[0] * scale;
        //var curHeight = _objSize[1] * scale;
        //var maxSize = MAX_CANVAS_SIZE * _devicePixelRatio;
        //if(curWidth > maxSize || curHeight > maxSize){
        //    return true;
        //}else{
        //    return false;
        //}
        return false;
    }

    this.clearBg = function(){
        //clear background
        _ctx.save();
        _ctx.setTransform(1,0,0,1,0,0);
        _ctx.fillStyle = _map.theme().background;
        _ctx.fillRect(0,0,_canvasSize[0]*_devicePixelRatio, _canvasSize[1]*_devicePixelRatio);
        _ctx.restore();
    };

    function hitTest(point){
        _ctx.save();
        _ctx.setTransform(1,0,0,1,0,0);
        for(var i = 0 ; i < _curFloor.rooms.length; i++) {
            var room = _curFloor.rooms[i];
            if(room.properties.TYPE == "000100"){ //hollow area can not be selectd
                continue;
            }

            var bbox = room.bbox;
            if((point[0]<bbox.tl[0] && point[0] < -bbox.br[1]) || (point[0]>bbox.br[0] && point[0] > -bbox.tl[1]))
                continue;

            var poly = room.newOutline;
            if (poly.length < 3) { //less than 3 points, return
                continue;
            }
            _ctx.beginPath();

            _ctx.moveTo(poly[0][0], -poly[0][1]);
            for (var j = 1; j < poly.length; ++j) {
                _ctx.lineTo(poly[j][0], -poly[j][1]);
            }
            _ctx.closePath();

            if (_ctx.isPointInPath(point[0], point[1])) {
                _ctx.restore();
                return room;
            }
        }

        _ctx.restore();
        return null;
    }

    this.createNameTexts = function(floorNo, building){
        if(floorNo == 0)
            return;
        if(_nameTexts.length != 0){
            _nameTexts.length = 0;
        }
        var rooms = building.getFloor(floorNo).rooms;
        var fontStyle = _map.theme().fontStyle;
        _ctx.font =  fontStyle.fontsize + "px/1.4 " + fontStyle.fontface;
        for(var i = 0 ; i < rooms.length; i++){
            var name = {};
            var room = rooms[i];
            if(!room.properties.hasOwnProperty("NAME")){
                name.text = "";
                name.halfWidth = 0;
                name.halfHeight = 0;
                name.visible = false;
            }else {
                name.text = room.properties.NAME;
                name.halfWidth = _ctx.measureText(name.text).width / 2;
                name.halfHeight = fontStyle.fontsize  / 4;
                name.visible = true;
            }

            _nameTexts.push(name);
        }
    };

    _init();
};

//---------------------Controller2D class-----------------

Controller2D = function(map){
    var _map = map;
    var _renderer = map.renderer;
    var domElement = _renderer.domElement;
    this.domElement = ( domElement !== undefined ) ? domElement : document;
    this.viewChanged = true;
    this.enable = true;

    var _startPos = [];
    var _curPos = [];

    var _this = this;

    this.startPoint = [0, 0];
    this.endPoint = [0, 0];
    var _panVector = [0, 0];
    var _zoomDistStart = 0, _zoomDistEnd = 0;
    var _zoomScale = 1;
    var STATE = {NONE: -1, ZOOM: 1, PAN: 2};
    var _state = STATE.NONE;

    this.reset = function(){
        _this.startPoint = [0,0];
        _this.endPoint = [0,0];
    };

    this.translate = function(){
        _curPos[0] = (_startPos[0] + _panVector[0]);
        _curPos[1] = (_startPos[1] + _panVector[1]);
        IDM.DomUtil.setPos(domElement, [_curPos[0], _curPos[1]]);
    };

    this.zoom = function(){
        var pos = IDM.DomUtil.getPos(domElement);
        domElement.style[IDM.DomUtil.TRANSFORM] = IDM.DomUtil.getTranslateString(pos) + " scale(" + _zoomScale + ") ";
    };

    function touchStart(event){

        event.preventDefault();

        var touches = event.touches;
        if(touches.length == 1){ //pan
            _this.startPoint[0] = touches[0].clientX;
            _this.startPoint[1] = touches[0].clientY;
            var point = IDM.DomUtil.getPos(domElement);
            _startPos[0] = point[0];
            _startPos[1] = point[1];

        }
        else if( touches.length == 2){ //zoom
            var dx = touches[1].clientX - touches[0].clientX;
            var dy = touches[1].clientY - touches[0].clientY;
            _zoomDistEnd = _zoomDistStart = Math.sqrt( dx * dx + dy * dy );


        }
        else{
            _state = STATE.NONE;
            return;
        }
        if(_this.enable === false) return;

        document.addEventListener('touchend', touchEnd, false);
        document.addEventListener('touchmove', touchMove, false);


    }

    function mouseDown(event){

        event.preventDefault();
        _this.startPoint[0] = event.clientX;
        _this.startPoint[1] = event.clientY;

        if(_this.enable === false) return;

        document.addEventListener('mouseup', mouseUp, false);
        document.addEventListener('mousemove', mouseMove, false);

        var point = IDM.DomUtil.getPos(domElement);
        _startPos[0] = point[0];
        _startPos[1] = point[1];



    }

    function touchMove(event){
        if(_this.enable === false) return;
        event.preventDefault();
        event.stopPropagation();

        var touches = event.touches;
        if(touches.length == 1) {
            _this.endPoint[0] = touches[0].clientX;
            _this.endPoint[1] = touches[0].clientY;

            _panVector = [_this.endPoint[0]-_this.startPoint[0], _this.endPoint[1]-_this.startPoint[1]];
            _this.translate();
            _state = STATE.PAN;

        }else if( touches.length == 2){
            var dx = touches[1].clientX - touches[0].clientX;
            var dy = touches[1].clientY - touches[0].clientY;
            _zoomDistEnd = Math.sqrt( dx * dx + dy * dy );
            _zoomScale = _zoomDistEnd / _zoomDistStart;

            _zoomScale = _map.getProperScale(_zoomScale);
            _this.zoom( );
            _state = STATE.ZOOM;
        }
    }

    function mouseMove(event){
        if(_this.enable === false) return;
        event.preventDefault();
        event.stopPropagation();

        _this.endPoint[0] = event.clientX;
        _this.endPoint[1] = event.clientY;

        _panVector = [_this.endPoint[0] - _this.startPoint[0], _this.endPoint[1] - _this.startPoint[1]];

        if(event.button === 0) {


            _this.translate();
            _state = STATE.PAN;
        }
        else if(event.button === 1){

            _zoomScale = (Math.abs(_panVector[0])+Math.abs(_panVector[1]))/1000;
            if(_panVector[1] < 0){
                _zoomScale = -_zoomScale;
            }
            _zoomScale += 1;
            _zoomScale = _map.getProperScale(_zoomScale);
            _this.zoom( );
            _state = STATE.ZOOM;
        }

    }

    function mouseWheel(event){
        if(_this.enable === false) return;
        var delta = 0;
        delta = event.wheelDelta ? (event.wheelDelta / 120) : (- event.detail / 3);
        delta > 0 ? delta *= 1.25 : delta *= -0.8;
        delta = _map.getProperScale(delta);
        _renderer.scale(delta);
    }

    function touchEnd(event){
        if(_this.enable === false) return;
        if(_state == STATE.PAN) {
            panEnd();
        }else if(_state == STATE.ZOOM) {
            zoomEnd();
        }
        _state = STATE.NONE;
        document.removeEventListener('touchend', touchEnd, false);
        document.removeEventListener('touchmove', touchMove, false);
    }

    function mouseUp(event){
        if(_this.enable === false) return;
        if(_state == STATE.PAN) {
            panEnd();
        }else if(_state == STATE.ZOOM) {
            zoomEnd();
        }
        _state = STATE.NONE;
        document.removeEventListener('mouseup', mouseUp, false);
        document.removeEventListener('mousemove', mouseMove, false);
    }

    function panEnd(){
        if(Math.abs(_panVector[0]+_panVector[1]) < 5) return;

        _renderer.updateViewport();
        _renderer.translate(_panVector);
    }

    function zoomEnd(){
        _renderer.updateViewport(true);
        _renderer.scale(_zoomScale);
    }

    this.domElement.addEventListener('touchstart', touchStart, false);
    this.domElement.addEventListener('mousedown', mouseDown, false);
    this.domElement.addEventListener('mousewheel', mouseWheel,false);


};
//-----------------------------the 2D Parser class ---------------------------------------

function Parser2D(json, theme) {
    var building = new Building();

    function parse()
    {
        if(json && json.type == "FeatureCollection" && json.features)
        {
            if (theme == undefined) {
                theme = default2dTheme;
            }

            for (var i = 0; i < json.features.length; i++) {
                var ft = json.features[i];
                if (ft.properties && ft.properties.FL_NO) //the floor
                {
                    if(!ft.bbox)
                        ft.bbox = IDM.GeomUtil.getBoundingRect(ft.geometry.coordinates[0]);
                    if(!ft.properties.center)
                        ft.properties.center = IDM.GeomUtil.getCenter(ft.bbox);

                    ft.properties.strokeColor = theme.strokeStyle.color;
                    ft.properties.fillColor = theme.floor.color;

                    var floor = building.floors[ft.properties["FL_ID"]];
                    if(floor && floor.rooms)
                        ft.rooms = floor.rooms;
                    else
                        ft.rooms = [];
                    if(floor && floor.pubPoints)
                        ft.pubPoints = floor.pubPoints;
                    else
                        ft.pubPoints = [];

                    building.floors[ft.properties["FL_ID"]] = ft;
                }
                else if (ft.properties && ft.properties.FL_ID) //floor features
                {
                    var floor = building.floors[ft.properties["FL_ID"]];
                    if (floor == undefined)
                    {
                        floor = {rooms:[], pubPoints: []};
                    }

                    if (ft.geometry.type == "Polygon") //room
                    {
                        if(!ft.bbox)
                            ft.bbox = IDM.GeomUtil.getBoundingRect(ft.geometry.coordinates[0]);
                        if(!ft.properties.center)
                            ft.properties.center = IDM.GeomUtil.getCenter(ft.bbox);
                        ft.properties.fillColor = theme.room(ft.properties.TYPE).color;
                        ft.properties.strokeColor = theme.strokeStyle.color;

                        floor.rooms.push(ft);
                    }
                    else if (ft.geometry.type == "Point") //pubpoints
                    {
                        floor.pubPoints.push(ft);
                    }
                }
            }
        }
        return building;
    }

    return parse();
}

//----------------------------default 2d theme--------------------------------------
var default2dTheme = {
    name: "test", //theme's name
    background: "#F2F2F2", //background color

    //building's style
    building: {
        color: "#000000",
        opacity: 0.1,
        transparent: true,
        depthTest: false
    },

    //floor's style
    floor: {
        color: "#E0E0E0",
        opacity: 1,
        transparent: false
    },

    //selected room's style
    selected: "#ffff55",

    //rooms' style
    room: function (type) {
        var roomStyle;
        switch (type) {
            case "000100": //hollow.
                return {
                    color: "#F2F2F2",
                    opacity: 0.8,
                    transparent: true
                };
            case "000300": //closed area
                return {
                    color: "#AAAAAA",
                    opacity: 0.7,
                    transparent: true
                };
            case "000400": //empty shop
                return {
                    color: "#D3D3D3",
                    opacity: 0.7,
                    transparent: true
                };
            case "000900": //auxiliary plane
            case "000901": //auxiliary plane
                return {
                    color: "#c49c94",
                    opacity: 0.7,
                    transparent: true
                };
            case "110000": //green area
                return {
                    color: "#98df8a",
                    opacity: 0.7,
                    transparent: true
                };
            case "980447": //path
                return {
                    color: "#ffbb78",
                    opacity: 0.7,
                    transparent: true
                };
            case "140200":
            case "070000": //sign in
                return {
                    color: "#aec7e8",
                    opacity: 0.7,
                    transparent: true
                };
            //add more cases here
            default :
                roomStyle = {
                    color: "#f29e7b",
                    opacity: 0.7,
                    transparent: true
                };
                break;
        }
        return roomStyle;
    },

    //room wires' style
    strokeStyle: {
        color: "#666666",
        opacity: 0.5,
        transparent: true,
        linewidth: 0.8
    },

    fontStyle:{
        opacity: 1,
        textAlign: "center",
        textBaseline: "middle",
        color: "#333333",
        fontsize: 12,
        fontface: "'Lantinghei SC', 'Microsoft YaHei', 'Hiragino Sans GB', 'Helvetica Neue', Helvetica, STHeiTi, Arial, sans-serif  "
    },

    pubPoint:function(type) {
        var imgUrl;
        switch(type){
            case "200300":
            case "200301":
            case "200302":
                imgUrl = System.imgPath+"/toilet.png";
                break;
            case "11002":
                imgUrl = System.imgPath+"/ATM.png";
                break;
            case "990100":
                imgUrl = System.imgPath+"/stair.png";
                break;
            case "990200":
                imgUrl = System.imgPath+"/lift.png";
                break;
            case "990300":
                imgUrl = System.imgPath+"/escalator.png";
                break;
            case "990700":
            case "991000":
            case "991001":
                imgUrl = System.imgPath+"/entry.png";
                break;
            default:
                imgUrl = System.imgPath+"/default-point.png";
        }
        return imgUrl;
    }
};