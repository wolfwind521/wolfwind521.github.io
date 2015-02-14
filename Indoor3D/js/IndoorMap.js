/**
 * Created by gaimeng on 14/12/27.
 */

var System={};
var js=document.scripts;
js=js[js.length-1].src.substring(0,js[js.length-1].src.lastIndexOf("/"));
System.path = js;
System.libPath = System.path.substring(0,System.path.lastIndexOf("/"));
System.imgPath = System.libPath+"/img";


//---------------------the GeomUtility class--------------------
function GeomUtility(){}

//get the bounding Rect of the points
function Rect(minx,miny,maxx,maxy){
    this.tl = [minx || 0, miny || 0]; //top left point
    this.br = [maxx || 0, maxy || 0]; //bottom right point
}

Rect.prototype.isCollide = function(rect){
    if(rect.br[0] < this.tl[0] || rect.tl[0] > this.br[0] ||
        rect.br[1] < this.tl[1] || rect.tl[1] > this.br[1]){
        return false;
    }
    return true;
}

GeomUtility.getBoundingRect = function(points){
    var rect = new Rect();
    //if there are less than 1 point
    if(points.length < 2){
        return rect;
    }
    var minX = 9999999, minY = 9999999, maxX = -9999999, maxY = -9999999;
    for(var i = 0; i < points.length - 1; i += 2){

        if(points[i] > maxX){
            maxX = points[i];
        }
        if(points[i] < minX){
            minX = points[i];
        }
        if(points[i+1] > maxY){
            maxY = points[i+1];
        }
        if(points[i+1] < minY){
            minY = points[i+1];
        }
    }
    rect.tl = [minX, minY];
    rect.br = [maxX, maxY];
    return rect;
}

//---------------------the Mall class--------------------
function Mall(){
    var _this = this;
    this.floors = [];   //the floors
    this.building = null; //the building
    this.root = null; //the root scene
    this.theme = defaultTheme; //theme
    this.is3d = true;
    this.jsonData = null;

    var _curFloorId;

    //get default floor id
    this.getDefaultFloorId = function(){
        return _this.jsonData.data.building.DefaultFloor;
    }
    //get current floor id
    this.getCurFloorId = function() {
        return _curFloorId;
    }

    //get floor by id
    this.getFloor = function(id) {
        for(var i = 0; i < _this.floors.length; i++) {
            if(_this.floors[i]._id == id) {
                return _this.floors[i];
            }
        }
        return null;
    }

    //get floor by name
    this.getFloorByName = function(name){
        for(var i = 0; i < _this.floors.length; i++) {
            if(_this.floors[i].Name == name) {
                return _this.floors[i];
            }
        }
        return null;
    }

    //get current floor
    this.getCurFloor = function() {
        return _this.getFloor(_curFloorId);
    }

    //get Floor's json data
    this.getFloorJson = function(fid){
        var floorsJson = _this.jsonData.data.Floors;
        for(var i = 0; i < floorsJson.length; i++){
            if(floorsJson[i]._id == fid) {
                return floorsJson[i];
            }
        }
        return null;
    }

    //show floor by id
    this.showFloor = function(id){
        if(_this.is3d) {
            //set the building outline to invisible
            _this.root.remove(_this.building);
            //set all the floors to invisible
            for (var i = 0; i < _this.floors.length; i++) {
                if (_this.floors[i]._id == id) {
                    //set the specific floor to visible
                    _this.floors[i].position.set(0, 0, 0);
                    _this.root.add(_this.floors[i]);
                } else {
                    _this.root.remove(_this.floors[i]);
                }
            }
        }
        _curFloorId = id;
    }

    //show the whole building
    this.showAllFloors = function(){
        if(!_this.is3d){ //only the 3d map can show all the floors
            return;
        }

        _this.root.add(_this.building);

        var offset = 4;
        for(var i=0; i<_this.floors.length; i++){
            _this.floors[i].position.set(0,0,i*_this.floors[i].height*offset);
            _this.root.add(this.floors[i]);
        }
        this.building.scale.set(1,1,offset);

        _curFloorId = 0;

        return _this.root;
    }
}
//----------------------------theme--------------------------------------
var defaultTheme = {
    name: "test", //theme's name
    background: "#e6e6e6", //background color

    //building's style
    building: {
        color: "#000000",
        opacity: 0.1,
        transparent: true,
        depthTest: false
    },

    //floor's style
    floor: {
        color: "#c1c1c1",
        opacity: 1,
        transparent: false
    },

    //selected room's style
    selected: 0xffff55,

    //rooms' style
    room: function (type, category) {
        switch (type) {

            case "100": //hollow. u needn't change this color. because i will make a hole on the model in the final version.
                return {
                    color: "#e6e6e6",
                    opacity: 0.8,
                    transparent: true
                }
            case "300": //closed area
                return {
                    color: "#9e9e9e",
                    opacity: 0.7,
                    transparent: true
                };
            case "400": //empty shop
                return {
                    color: "#E4E4E4",
                    opacity: 0.7,
                    transparent: true
                };
            default :
        }

        switch(category) {
            case 101: //food
                return {
                    color: "#d8992c",
                    opacity: 0.7,
                    transparent: true
                };
            case 102: //retail
                return {
                    color: "#99455e",
                    opacity: 0.7,
                    transparent: true
                };
            case 103: //toiletry
                return {
                    color: "#17566a",
                    opacity: 0.7,
                    transparent: true
                };
            case 104: //parent-child
                return {
                    color: "#17566a",
                    opacity: 0.7,
                    transparent: true
                };
            case 105: //life services
                return {
                    color: "#e6a1d1",
                    opacity: 0.7,
                    transparent: true
                };
            case 106: //education
                return {
                    color: "#b9b3ff",
                    opacity: 0.7,
                    transparent: true
                };
            case 107: //life style
                return {
                    color: "#d6675b",
                    opacity: 0.7,
                    transparent: true
                };
            case 108: //entertainment
                return {
                    color: "#a1e5e6",
                    opacity: 0.7,
                    transparent: true
                };
            case 109: //others
            default :
                return {
                    color: "#d0641a",
                    opacity: 0.7,
                    transparent: true
                };

        }
    },

    //room wires' style
    strokeStyle: {
        color: "#38291f",
        opacity: 0.5,
        transparent: true,
        linewidth: 1
    },

    fontStyle:{
        fontsize: 40
    },

    pubPointImg: {

        "11001": System.imgPath+"/toilet.png",
        "11002": System.imgPath+"/ATM.png",
        "21001": System.imgPath+"/stair.png",
        "22006": System.imgPath+"/entry.png",
        "21002": System.imgPath+"/escalator.png",
        "21003": System.imgPath+"/lift.png"
    }

    ////icons of the labels
    //pubPointImg: function(type){
    //    switch (type){
    //        case "000300": //closed area
    //            return "./img/indoor_floor_normal.png";
    //        case "11001": //WC
    //            return "./img/toilet.png";
    //        case "11002": //atm
    //            return "./img/ATM.png";
    //        //case "11003": //cashier
    //        //    return "./img/indoor_pub_cashier.png";
    //        //case "11004": //office
    //        //    return "./img/indoor_pub_office.png";
    //        case "21001": //staircase
    //            return "./img/stair.png";
    //        case "21002": //escalator
    //            return "./img/escalator.png";
    //        case "21003": //elevator
    //            return "./img/lift.png";
    //        case "050100": //food
    //            return "./img/indoor_func_am0010.png";
    //        case "061102": //shoes
    //            return "./img/indoor_func_am0006.png";
    //        case "061103": //bags
    //            return "./img/indoor_func_am0009.png";
    //        case "061202": //jewelry
    //            return "./img/indoor_func_am0002.png";
    //        case "061400": //toiletry
    //            return "./img/indoor_func_am0005.png";
    //        case "22006": //gate
    //            return "./img/entry.png";
    //
    //        default : //default
    //            return "./img/default-point.png";
    //    }
    //}
}
//----------------------------the Loader class --------------------------
IndoorMapLoader= function ( is3d ) {
    THREE.Loader.call( this, is3d );

    this.withCredentials = false;
    this.is3d = is3d;
};

IndoorMapLoader.prototype = Object.create( THREE.Loader.prototype );

IndoorMapLoader.prototype.load = function ( url, callback, texturePath ) {

    var scope = this;

    this.onLoadStart();
    this.loadAjaxJSON( this, url, callback );

};

IndoorMapLoader.prototype.loadAjaxJSON = function ( context, url, callback, callbackProgress ) {

    var xhr = new XMLHttpRequest();

    var length = 0;

    xhr.onreadystatechange = function () {

        if ( xhr.readyState === xhr.DONE ) {

            if ( xhr.status === 200 || xhr.status === 0 ) {

                if ( xhr.responseText ) {

                    var json = JSON.parse( xhr.responseText );

                    var result = context.parse( json );
                    callback( result );

                } else {

                    console.error( 'IndoorMapLoader: "' + url + '" seems to be unreachable or the file is empty.' );

                }

                // in context of more complex asset initialization
                // do not block on single failed file
                // maybe should go even one more level up

                context.onLoadComplete();

            } else {

                console.error( 'IndoorMapLoader: Couldn\'t load "' + url + '" (' + xhr.status + ')' );

            }

        } else if ( xhr.readyState === xhr.LOADING ) {

            if ( callbackProgress ) {

                if ( length === 0 ) {

                    length = xhr.getResponseHeader( 'Content-Length' );

                }

                callbackProgress( { total: length, loaded: xhr.responseText.length } );

            }

        } else if ( xhr.readyState === xhr.HEADERS_RECEIVED ) {

            if ( callbackProgress !== undefined ) {

                length = xhr.getResponseHeader( 'Content-Length' );

            }

        }

    };

    xhr.open( 'GET', url, true );
    xhr.withCredentials = this.withCredentials;
    xhr.send( null );

};

IndoorMapLoader.prototype.parse = function ( json ) {
    return ParseModel(json, this.is3d);
};

//-----------------------------the Parser class ---------------------------------------
function ParseModel(json, is3d){

    var mall = new Mall();

    function parse() {

        mall.jsonData = json;
        mall.is3d = is3d;

        var building,shape, extrudeSettings, geometry, material, mesh, wire, points;
        var scale = 0.1, floorHeight, buildingHeight = 0;

        //floor geometry
        for(var i=0; i<json.data.Floors.length; i++){
            var floor = json.data.Floors[i];
            floor.rect = GeomUtility.getBoundingRect(floor.Outline[0][0]);

            if(is3d) { // for 3d model
                var floorObj = new THREE.Object3D();

                floorHeight = floor.High / scale;
                if (floorHeight == 0.0) { //if it's 0, set to 50.0
                    floorHeight = 50.0;
                }
                buildingHeight += floorHeight;
                points = parsePoints(floor.Outline[0][0]);
                shape = new THREE.Shape(points);
                geometry = new THREE.ShapeGeometry(shape);
                mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial(mall.theme.floor));
                mesh.position.set(0, 0, -5);

                floorObj.height = floorHeight;
                floorObj.add(mesh);
                floorObj.points = [];
                floorObj._id = floor._id;

                mall.floors.push(floorObj);
            }else{//for 2d model
                floor.strokeStyle = mall.theme.strokeStyle.color;
                floor.fillColor = mall.theme.floor.color;
                mall.floors.push(floor);
            }

            //funcArea geometry
            for(var j=0; j<floor.FuncAreas.length; j++){

                var funcArea = floor.FuncAreas[j];
                funcArea.rect = GeomUtility.getBoundingRect(funcArea.Outline[0][0]);

                if(is3d) {
                    points = parsePoints(funcArea.Outline[0][0]);
                    shape = new THREE.Shape(points);

                    var center = funcArea.Center;
                    floorObj.points.push({ name: funcArea.Name, type: funcArea.Type, position: new THREE.Vector3(center[0] * scale, floorHeight * scale, -center[1] * scale)});

                    //solid model
                    extrudeSettings = {amount: floorHeight, bevelEnabled: false};
                    geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
                    material = new THREE.MeshLambertMaterial(mall.theme.room(funcArea.Type, funcArea.Category));
                    mesh = new THREE.Mesh(geometry, material);
                    mesh.type = "solidroom";
                    mesh.id = funcArea._id;

                    floorObj.add(mesh);

                    //top wireframe
                    geometry = shape.createPointsGeometry();
                    wire = new THREE.Line(geometry, new THREE.LineBasicMaterial(mall.theme.strokeStyle));
                    wire.position.set(0, 0, floorHeight);

                    floorObj.add(wire);
                }else{
                    funcArea.fillColor = mall.theme.room(funcArea.Type, funcArea.Category).color;
                    funcArea.strokeColor = mall.theme.strokeStyle.color;

                }
            }

            if(is3d) {
                //pubPoint geometry
                for (var j = 0; j < floor.PubPoint.length; j++) {
                    var pubPoint = floor.PubPoint[j];
                    var point = parsePoints(pubPoint.Outline[0][0])[0];
                    floorObj.points.push({name: pubPoint.Name, type: pubPoint.Type, position: new THREE.Vector3(point.x * scale, floorHeight * scale, -point.y * scale)});
                }
            }
        }

        if(is3d) {
            mall.root = new THREE.Object3D(); //if is 3d, create a root object3D

            //building geometry
            building = json.data.building;
            points = parsePoints(building.Outline[0][0]);

            if (points.length > 0) {
                shape = new THREE.Shape(points);
                extrudeSettings = {amount: buildingHeight, bevelEnabled: false};
                geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
                mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial(mall.theme.building));

                mall.building = mesh;
            }

            //scale the mall
            mall.root.scale.set(scale, scale, scale);
            mall.root.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
        }

        return mall;
    };

    //parse the points to THREE.Vector2 (remove duplicated points)
    function parsePoints(pointArray){
        var shapePoints = [];
        for(var i=0; i < pointArray.length; i+=2){
            var point = new THREE.Vector2(pointArray[i], pointArray[i+1]);
            if(i>0) {
                var lastpoint = shapePoints[shapePoints.length - 1];
                if (point.x != lastpoint.x || point.y != lastpoint.y) { //there are some duplicate points in the original data
                    shapePoints.push(point);
                }
            }else{
                shapePoints.push(point);
            }
        }
        return shapePoints;
    }

    return parse();
}
//-----------------------------the IndoorMap class ------------------------------------

var IndoorMap = function (params) {
    var _this = this;
    var _scene, _controls, _renderer, _projector, _rayCaster;
    var _mapDiv, _canvasDiv, _labelsRoot, _uiRoot, _uiSelected;
    var _selected;
    var _showNames = true, _showPubPoints = true;
    var _curFloorId = 0;
    var _fullScreen = false;
    var _selectionListener = null;
    var _sceneOrtho, _cameraOrtho;//for 2d
    var _canvasWidth, _canvasHeight, _canvasWidthHalf, _canvasHeightHalf;
    this.is3d = true;
    var _spriteMaterials = [], _pubPointSprites=null, _nameSprites = null;

    //initialization
    this.init = function (params) {

        // get the map div
        if (!(typeof params === "undefined") && params.hasOwnProperty("mapDiv")) {
            _mapDiv = document.getElementById(params.mapDiv);
        }
        if(!(typeof params === "undefined") && params.hasOwnProperty("dim")){
            if(params.dim == "2d"){
                _this.is3d = false;
            }
        }

        if(_mapDiv != null){
            _fullScreen = false;
        } else {
            //if the mapDiv undefined, create a fullscreen map
            _mapDiv = document.createElement("div");
            _mapDiv.style.width = window.innerWidth + "px";
            _mapDiv.style.height = window.innerHeight + "px";
            _mapDiv.id = "indoor3d";
            document.body.appendChild(_mapDiv);
            document.body.style.margin = "0";
            _fullScreen = true;
            window.addEventListener('resize', onWindowResize, false);
        }

        _canvasWidth = _mapDiv.clientWidth;
        _canvasWidthHalf = _canvasWidth / 2;
        _canvasHeight = _mapDiv.clientHeight;
        _canvasHeightHalf = _canvasHeight / 2;

        // set up the scene
        _scene = new THREE.Scene();
        _this.camera = new THREE.PerspectiveCamera(20, _canvasWidth / _canvasHeight, 0.1, 2000);

        _sceneOrtho = new THREE.Scene();
        _cameraOrtho = new THREE.OrthographicCamera(- _canvasWidthHalf, _canvasWidthHalf, _canvasHeightHalf, -_canvasHeightHalf, 1, 10);
        _cameraOrtho.position.z = 10;
        _controls = new THREE.OrbitControls(_this.camera);

        // webgl detection
        if (Detector.webgl && _this.is3d) {
            _renderer = new THREE.WebGLRenderer({ antialias: true });
            _renderer.autoClear = false;
            var light = new THREE.DirectionalLight(0xffffff);
            light.position.set(-500, 500, -500);
            _scene.add(light);

        } else {
            _renderer = new Canvas2DRenderer();
            _controls.is3d = false;
            _this.is3d = false;
        }

        //set up the lights
        var light = new THREE.DirectionalLight(0xffffff);
        light.position.set(500, 500, 500);
        _scene.add(light);

        _renderer.setSize(_mapDiv.clientWidth, _mapDiv.clientHeight);
        _canvasDiv = _renderer.domElement
        _mapDiv.appendChild(_canvasDiv);
        _mapDiv.style.overflow = "hidden";
        _canvasDiv.style.width = "100%";
        _canvasDiv.style.height = "100%";


    }

    //load the map by the jason file name
    this.load = function (fileName, callback) {
        var loader = new IndoorMapLoader(_this.is3d);
        loader.load(fileName, function(mall){
            _this.mall = mall;
            _scene.add(_this.mall.root);
            _scene.mall = mall;
            if(callback) {
                callback();
            }
            _renderer.setClearColor(_this.mall.theme.background);
            if(_curFloorId == 0){
               _this.showAllFloors();
            }else{
                _this.showFloor(_curFloorId);
            }

        });
    }

    //parse the json file
    this.parse = function(json){
        _this.mall = ParseModel(json, _this.is3d);
        _scene.mall = _this.mall;
        _this.showFloor(_this.mall.getDefaultFloorId());
        _renderer.setClearColor(_this.mall.theme.background);
        if(_this.is3d) {
            _scene.add(_this.mall.root);
        }
    }

    //reset the camera to default configuration
    this.setDefaultView = function () {
        if(_this.is3d) {
            _this.camera.position.set(0, 150, 400);//TODO: adjust the position automatically
            _this.camera.lookAt(_scene.position);
        }else{
            _renderer.setDefaultView(_this.mall.getCurFloor());
        }

        _controls.reset();
        _controls.viewChanged = true;
    }

    this.setTopView = function(){
        _this.camera.position.set(0, 500, 0);
    }

    //TODO:adjust camera to fit the building
    this.adjustCamera = function() {
        _this.setDefaultView();

    }

    this.zoomIn = function(zoomScale){
        if(_this.is3d) {
            _controls.zoomOut(zoomScale);
        }else{
            _renderer.zoomIn();
        }
        redraw();
    }

    this.zoomOut = function(zoomScale){
        if(_this.is3d) {
            _controls.zoomIn(zoomScale);
        }else{
            _renderer.zoomOut();
        }
        redraw();
    }

    //resize the map
    this.resize = function (width, height){
        if(_fullScreen) {
            _mapDiv.style.width = width + "px";
            _mapDiv.style.height = height + "px";
        }
        _this.camera.aspect = width / height;
        _this.camera.updateProjectionMatrix();

        _renderer.setSize( width, height );
        _controls.viewChanged = true;
    }

    //set if the objects are selectable
    this.setSelectable = function (selectable) {
        if(selectable){
            _projector = new THREE.Projector();
            _rayCaster = new THREE.Raycaster();
            _mapDiv.addEventListener('mousedown', onSelectObject, false);
            _mapDiv.addEventListener('touchstart', onSelectObject, false);
        }else{
            _mapDiv.removeEventListener('mousedown', onSelectObject, false);
            _mapDiv.removeEventListener('touchstart', onSelectObject, false);
        }
    }

    //show the labels
    this.showAreaNames = function(show) {
        _showNames = show == undefined ? true : show;
    }

    //show pubPoints(entries, ATM, escalator...)
    this.showPubPoints = function(show){
        _showPubPoints = show == undefined ? true: show;
    }

    //get the UI
    this.getUI = function() {
        if(_this.mall == null){
            console.error("the data has not been loaded yet. please call this function in callback")
            return null;
        }
        //create the ul list
        _uiRoot = document.createElement('ul');
        _uiRoot.className = 'floorsUI';

        var li = document.createElement('li');
        var text = document.createTextNode('All');

        li.appendChild(text);
        _uiRoot.appendChild(li);
        li.onclick = function(){
            _this.showAllFloors();
        }

        for(var i = 0; i < this.mall.jsonData.data.Floors.length; i++){
            (function(arg){
                li = document.createElement('li');
                text = document.createTextNode(_this.mall.jsonData.data.Floors[i].Name);
                li.appendChild(text);
                li.onclick = function () {
                    _this.showFloor(_this.mall.floors[arg]._id);
                }
                _uiRoot.appendChild(li);
            })(i);
        }
        return _uiRoot;
    }

    //get the selected object
    this.getSelected = function(){
        return _selected;
    }

    //get the selected object
    this.getSelectedId = function(){
        return _selected.id;
    }

    //the callback function when sth is selected
    this.setSelectionListener = function(callback){
        _selectionListener = callback;
    }

    //select object by id
    this.selectById = function(id){
        var floor = _this.getCurFloor();
        for(var i = 0; i < floor.children.length; i++){
            if(floor.children[i].id && floor.children[i].id == id) {
                if (_selected) {
                    _selected.material.color.setHex(_selected.currentHex);
                }
                _this.select(floor.children[i]);
            }
        }
    }

    //select object(just hight light it)
    this.select = function(obj){
        obj.currentHex = _selected.material.color.getHex();
        obj.material.color.setHex(_this.mall.theme.selected);
    }

    //show the floor by id
    this.showFloor = function(floorid) {
        _curFloorId = floorid;
        if(_this.mall == null){
            return;
        }
        _this.mall.showFloor(floorid);
        _this.adjustCamera();
        if(_showPubPoints) {
            createPubPointSprites(floorid);
        }
        if(_showNames) {
            createNameSprites(floorid);
        }
        updateUI();
        redraw();
    }

    //show all floors
    this.showAllFloors = function(){
        _curFloorId = 0; //0 for showing all
        if(_this.mall == null){
            return;
        }
        _this.mall.showAllFloors();
        _this.adjustCamera();
        if(_labelsRoot != null){
            _labelsRoot.innerHTML = ""; //clear the labels when showing all
        }
        clearPubPointSprites();
        clearNameSprites();
        updateUI();
    }

    //create the labels by floor id
    function createNameSprites(floorId){
        //create the root
        if(typeof _labelsRoot === "undefined") {
            _labelsRoot = document.createElement("div");
            _labelsRoot.className = "mapLabels";
            _mapDiv.appendChild(_labelsRoot);
        }
        _labelsRoot.innerHTML = "";

        if(typeof _this.mall === "undefined"){
            return;
        }

        var floorPoints = _this.mall.getFloor(floorId).points;
        for(var i=0 ; i < floorPoints.length; i++) {
            var div = document.createElement('div');
            var imgsrc = _this.mall.theme.pubPointImg(floorPoints[i].type);
            if(imgsrc != null && imgsrc != "") {
                var img = document.createElement('img');
                img.setAttribute('src', imgsrc);
                div.appendChild(img);
            }

            if(floorPoints[i].type[0] == '2')//stairs,gates...
            {
                div.className = 'pubPoints';
            }else{
                var text = document.createTextNode(floorPoints[i].name);
                div.appendChild(text);
            }
            _labelsRoot.appendChild(div);
        }

    }

    //labels includes pubPoints and shop names
    function updateLabels() {
        var mall = _this.mall;
        if(mall == null || _controls == null || !_controls.viewChanged){
            return;
        }
        var curFloor = mall.getCurFloor();
        if(curFloor == null){
            return;
        }

        var projectMatrix = null;

        if(_showNames) {
            if(_nameSprites != undefined){
                projectMatrix = new THREE.Matrix4();
                projectMatrix.multiplyMatrices(_this.camera.projectionMatrix, _this.camera.matrixWorldInverse);

                updateSprites(_nameSprites, projectMatrix);
            }

        }

        if(_showPubPoints){
            if(_pubPointSprites != undefined){
                if(!projectMatrix){
                    projectMatrix = new THREE.Matrix4();
                    projectMatrix.multiplyMatrices(_this.camera.projectionMatrix, _this.camera.matrixWorldInverse);
                }
                updateSprites(_pubPointSprites, projectMatrix);
            }
        }
        _controls.viewChanged = false;
    };

    function updateSprites(spritelist, projectMatrix){
        for(var i = 0 ; i < spritelist.children.length; i++){
            var sprite = spritelist.children[i];
            var vec = new THREE.Vector3(sprite.oriX * 0.1, 0, -sprite.oriY * 0.1);
            vec.applyProjection(projectMatrix);

            var x = Math.round(vec.x * _canvasWidthHalf);
            var y = Math.round(vec.y * _canvasHeightHalf);
            sprite.position.set(x, y, 1);

            //check collision with the former sprites
            var visible = true;
            var visibleMargin = 5;
            for(var j = 0; j < i; j++){
                var img = sprite.material.map.image;
                if(!img){ //if img is undefined (the img has not loaded)
                    visible = false;
                    break;
                }

                var imgWidthHalf1 = sprite.width / 2;
                var imgHeightHalf1 = sprite.height / 2;
                var rect1 = new Rect(sprite.position.x - imgWidthHalf1, sprite.position.y - imgHeightHalf1,
                    sprite.position.x + imgHeightHalf1, sprite.position.y + imgHeightHalf1 );

                var sprite2Pos = spritelist.children[j].position;
                var imgWidthHalf2 = spritelist.children[j].width / 2;
                var imgHeightHalf2 = spritelist.children[j].height / 2;
                var rect2 = new Rect(sprite2Pos.x - imgWidthHalf2, sprite2Pos.y - imgHeightHalf2,
                        sprite2Pos.x + imgHeightHalf2, sprite2Pos.y + imgHeightHalf2 );

                if(rect1.isCollide(rect2)){
                    visible = false;
                    break;
                }

                rect1.tl[0] -= visibleMargin;
                rect1.tl[1] -= visibleMargin;
                rect2.tl[0] -= visibleMargin;
                rect2.tl[1] -= visibleMargin;


                if(sprite.visible == false && rect1.isCollide(rect2)){
                    visible = false;
                    break;
                }
            }
            sprite.visible = visible;
        }
    }

    function updateUI() {
        if(_uiRoot == null){
            return;
        }
        var ulChildren = _uiRoot.children;
        if(ulChildren.length == 0){
            return;
        }
        if(_uiSelected != null){
            _uiSelected.className = "";
        }
        var curid = _this.mall.getCurFloorId();
        if( curid == 0){
            _uiSelected = _uiRoot.children[0];
        }else{
            for(var i = 0; i < ulChildren.length; i++){
                if(ulChildren[i].innerText == _this.mall.getCurFloorId().toString() ){
                    _uiSelected = ulChildren[i];
                }
            }
        }
        if(_uiSelected != null){
            _uiSelected.className = "selected";
        }
    }

    function animate () {
        requestAnimationFrame(animate);
        _controls.update();
        if(_controls.viewChanged) {

            if(_this.is3d) {
                _renderer.clear();
                _renderer.render(_scene, _this.camera);


                if (_showNames || _showPubPoints) {
                    updateLabels();
                }
                _renderer.clearDepth();
                _renderer.render(_sceneOrtho, _cameraOrtho);
            }else{
                _renderer.render(_scene, _this.camera);
            }
        }

        _controls.viewChanged = false;
    }

    function redraw(){
        _controls.viewChanged = true;
    }

    function onSelectObject() {

        // find intersections
        event.preventDefault();
        var mouse = new THREE.Vector2();
        if(event.type == "touchstart"){
            mouse.x = ( event.touches[0].clientX / _canvasDiv.clientWidth ) * 2 - 1;
            mouse.y = -( event.touches[0].clientY / _canvasDiv.clientHeight ) * 2 + 1;
        }else {
            mouse.x = ( event.clientX / _canvasDiv.clientWidth ) * 2 - 1;
            mouse.y = -( event.clientY / _canvasDiv.clientHeight ) * 2 + 1;
        }
        var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
        vector.unproject( _this.camera);

        _rayCaster.set( _this.camera.position, vector.sub( _this.camera.position ).normalize() );

        var intersects = _rayCaster.intersectObjects( _this.mall.root.children[0].children );

        if ( intersects.length > 0 ) {

            if ( _selected != intersects[ 0 ].object ) {

                if ( _selected ) {
                    _selected.material.color.setHex( _selected.currentHex );
                }
                for(var i=0; i<intersects.length; i++) {
                    _selected = intersects[ i ].object;
                    if(_selected.type && _selected.type == "solidroom") {
                        _this.select(_selected);
                        if(_selectionListener) {
                            _selectionListener(_selected.id); //notify the listener
                        }
                        break;
                    }else{
                        _selected = null;
                    }
                    if(_selected == null && _selectionListener != null){
                        _selectionListener(-1);
                    }
                }
            }

        } else {

            if ( _selected ) {
                _selected.material.color.setHex( _selected.currentHex );
            }

            _selected = null;
            if(_selectionListener) {
                _selectionListener(-1); //notify the listener
            }
        }
        redraw();

    }

    function onWindowResize(){
        _this.resize(window.innerWidth, window.innerHeight);
    }

    //load Sprites
    function loadSprites(){
        if(_this.mall != null && _spriteMaterials.length == 0){
            var images = _this.mall.theme.pubPointImg;
            for(var key in images){
                var texture = THREE.ImageUtils.loadTexture(images[key], undefined, redraw);
                var material = new THREE.SpriteMaterial({map:texture});
                _spriteMaterials[key] = material;
            }
        }
        _spriteMaterials.isLoaded = true;
    }

    //creat the funcArea Name sprites of a floor
    function createNameSprites(floorId){
        if(!_nameSprites){
            _nameSprites = new THREE.Object3D();
        }else{
            clearNameSprites();
        }
        var funcAreaJson = _this.mall.getFloorJson(_this.mall.getCurFloorId()).FuncAreas;
        for(var i = 0 ; i < funcAreaJson.length; i++){
            var sprite = makeTextSprite(funcAreaJson[i].Name, _this.mall.theme.fontStyle);
            sprite.oriX = funcAreaJson[i].Center[0];
            sprite.oriY = funcAreaJson[i].Center[1];
            _nameSprites.add(sprite);
        }
        _sceneOrtho.add(_nameSprites);
    }

    //create the pubpoint sprites in a floor by the floor id
    function createPubPointSprites(floorId){
        if(!_spriteMaterials.isLoaded){
            loadSprites();
        }

        if(!_pubPointSprites) {

            _pubPointSprites = new THREE.Object3D();
        }else{
            clearPubPointSprites();
        }

        var pubPointsJson = _this.mall.getFloorJson(_this.mall.getCurFloorId()).PubPoint;
        var imgWidth, imgHeight;
        for(var i = 0; i < pubPointsJson.length; i++){
            var spriteMat = _spriteMaterials[pubPointsJson[i].Type];
            if(spriteMat !== undefined) {
                imgWidth = 30, imgHeight = 30;
                var sprite = new THREE.Sprite(spriteMat);
                sprite.scale.set(imgWidth, imgHeight, 1);
                sprite.oriX = pubPointsJson[i].Outline[0][0][0];
                sprite.oriY = pubPointsJson[i].Outline[0][0][1];
                sprite.width = imgWidth;
                sprite.height = imgHeight;
                _pubPointSprites.add(sprite);
            }
        }
        _sceneOrtho.add(_pubPointSprites);
    }

    function clearNameSprites(){
        _nameSprites.remove(_nameSprites.children);
        _nameSprites.children.length = 0;
    }
    function clearPubPointSprites(){
        _pubPointSprites.remove(_pubPointSprites.children);
        _pubPointSprites.children.length = 0;
    }
    function makeTextSprite( message, parameters )
    {
        if ( parameters === undefined ) parameters = {};

        var fontface = parameters.hasOwnProperty("fontface") ?
            parameters["fontface"] : "Arial";

        var fontsize = parameters.hasOwnProperty("fontsize") ?
            parameters["fontsize"] : 18;

        var borderThickness = parameters.hasOwnProperty("borderThickness") ?
            parameters["borderThickness"] : 2;

        var borderColor = parameters.hasOwnProperty("borderColor") ?
            parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };

        var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
            parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

        //var spriteAlignment = parameters.hasOwnProperty("alignment") ?
        //	parameters["alignment"] : THREE.SpriteAlignment.topLeft;

        var spriteAlignment = new THREE.Vector2( 0, 0 );


        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        context.font = "Bold " + fontsize + "px " + fontface;

        // get size data (height depends only on font size)
        var metrics = context.measureText( message );
//
//        // background color
//        context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
//            + backgroundColor.b + "," + backgroundColor.a + ")";
//        // border color
        context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
            + borderColor.b + "," + borderColor.a + ")";
//
//        context.lineWidth = borderThickness;
//        context.strokeRect(borderThickness/2, borderThickness/2, metrics.width + borderThickness, fontsize * 1.4 + borderThickness);

        // text color
        context.fillStyle = "rgba(0, 0, 0, 1.0)";

        context.fillText( message, borderThickness, fontsize + borderThickness);

        // canvas contents will be used for a texture
        var texture = new THREE.Texture(canvas)
        texture.needsUpdate = true;


        var spriteMaterial = new THREE.SpriteMaterial(
            { map: texture, useScreenCoordinates: false } );
        var sprite = new THREE.Sprite( spriteMaterial );
        sprite.scale.set(100,50,1.0);
        sprite.width = metrics.width;
        sprite.height = fontsize * 1.4;
        return sprite;
    }

    _this.init(params);
    animate();
}