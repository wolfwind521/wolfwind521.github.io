/**
 * Created by gaimeng on 14/12/27.
 */

var System={};
var js=document.scripts;
js=js[js.length-1].src.substring(0,js[js.length-1].src.lastIndexOf("/"));
System.path = js;
System.libPath = System.path.substring(0,System.path.lastIndexOf("/"));
System.imgPath = System.libPath+"/img";

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik M ller. fixes from Paul Irish and Tino Zijdel
// MIT license
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] +
            'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };
}());

//IDM namespace
var IDM = {};
IDM.Browser = {};
//Browser detection
(function() {
    var a = "ActiveXObject" in window,
        c = a && !document.addEventListener,
        e = navigator.userAgent.toLowerCase(),
        f = -1 !== e.indexOf("webkit"),
        m = -1 !== e.indexOf("chrome"),
        p = -1 !== e.indexOf("phantom"),
        isAndroid = -1 !== e.indexOf("android"),
        r = -1 !== e.search("android [23]"),
        gecko = -1 !== e.indexOf("gecko"),
        isIphone = -1 !== e.indexOf("iphone"),
        isSymbianOS = -1 !== e.indexOf("symbianos"),
        isWinPhone = -1 !== e.indexOf("windows phone"),
        isIpad =  -1 !== e.indexOf("ipad"),
        k = isIphone || isWinPhone || isSymbianOS || isAndroid ||isIpad,
        q = window.navigator && window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints && !window.PointerEvent,
        t = window.PointerEvent && window.navigator.pointerEnabled && window.navigator.maxTouchPoints || q,
        y = "devicePixelRatio" in window && 1 < window.devicePixelRatio || "matchMedia" in window && window.matchMedia("(min-resolution:144dppi)") &&
            window.matchMedia("(min-resolution:144dppi)").matches,
        l = document.documentElement,
        A = a && "transition" in l.style,
        x = "WebKitCSSMatrix" in window && "m11" in new window.WebKitCSSMatrix && !r,
        B = "MozPerspective" in l.style,
        z = "OTransition" in l.style,
        G = !window.L_DISABLE_3D && (A || x || B || z) && !p,
        p = !window.L_NO_TOUCH && !p && function() {
                if (t || "ontouchstart" in l) return !0;
                var a = document.createElement("div"),
                    c = !1;
                if (!a.setAttribute) return !1;
                a.setAttribute("ontouchstart", "return;");
                "function" === typeof a.ontouchstart && (c = !0);
                a.removeAttribute("ontouchstart");
                return c
            }();
    IDM.Browser = {
        ie: a,
        ielt9: c,
        webkit: f,
        gecko: gecko && !f && !window.opera && !a,
        android: isAndroid,
        android23: r,
        iphone: isIphone,
        ipad: isIpad,
        symbian: isSymbianOS,
        winphone: isWinPhone,
        chrome: m,
        ie3d: A,
        webkit3d: x,
        gecko3d: B,
        opera3d: z,
        any3d: G,
        mobile: k,
        mobileWebkit: k && f,
        mobileWebkit3d: k && x,
        mobileOpera: k && window.opera,
        touch: p,
        msPointer: q,
        pointer: t,
        retina: y
    }
}());

//---------------------the IDM.GeomUtil class--------------------
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
};

IDM.GeomUtil = {

    getBoundingRect: function (points) {
        var rect = new Rect();
        //if there are less than 1 point
        if (points.length < 1) {
            return rect;
        }
        var minX = Number.MAX_VALUE, minY = Number.MAX_VALUE, maxX = -Number.MAX_VALUE, maxY = -Number.MAX_VALUE;
        for (var i = 0; i < points.length; ++i) {

            if (points[i][0] > maxX) {
                maxX = points[i][0];
            }
            if (points[i][0] < minX) {
                minX = points[i][0];
            }
            if (points[i][1] > maxY) {
                maxY = points[i][1];
            }
            if (points[i][1] < minY) {
                minY = points[i][1];
            }
        }
        rect.tl = [minX, minY];
        rect.br = [maxX, maxY];
        return rect;
    },

    getCenter:function (rect) {
        return [(rect.tl[0] + rect.br[0])/2.0 , (rect.tl[1] + rect.br[1])/2.0];
    }
};
//---------------------the IDM.DomUtil class--------------------
IDM.DomUtil = {

    getElementLeft: function (element) {
        var actualLeft = element.offsetLeft;
        var current = element.offsetParent;
        while (current !== null) {
            actualLeft += current.offsetLeft;
            current = current.offsetParent;
        }
        return actualLeft;
    },

    getElementTop: function (element) {

        var actualTop = element.offsetTop;
        var current = element.offsetParent;
        while (current !== null) {
            actualTop += current.offsetTop;
            current = current.offsetParent;
        }
        return actualTop;
    },

    getTranslateString: function(point) {
        var dim = IDM.Browser.webkit3d;
        return "translate" + (dim ? "3d" : "") + "(" + point[0] + "px," + point[1] + "px" + ((dim ? ",0" : "") + ")");
    },

    getPos: function (element) {
        return element._idm_pos ? element._idm_pos : [IDM.DomUtil.getElementLeft(element), IDM.DomUtil.getElementTop(element)];
    },
    setPos: function (element, point) {
        element._idm_pos = point;
        IDM.Browser.any3d ? element.style[IDM.DomUtil.TRANSFORM] = IDM.DomUtil.getTranslateString(point) : (element.style.left = point[0] + "px", element.style.top = point[1] + "px")
        //element.style.left = point[0] + "px";
        //element.style.top = point[1] + "px";
    },

    testProp: function(props) {
        for (var c =
            document.documentElement.style, i = 0; i < props.length; i++)
            if (props[i] in c) return props[i];
        return false;
    }
};

IDM.DomUtil.TRANSFORM = IDM.DomUtil.testProp(["transform", "WebkitTransform", "OTransform", "MozTransform", "msTransform"]);
IDM.DomUtil.TRANSITION = IDM.DomUtil.testProp(["webkitTransition", "transition", "OTransition", "MozTransition", "msTransition"]);
IDM.DomUtil.TRANSITION_END = "webkitTransition" === IDM.DomUtil.TRANSITION || "OTransition" === IDM.DomUtil.TRANSITION ? IDM.DomUtil.TRANSITION + "End" : "transitionend";

//---------------------the Building class--------------------

function Building() {
    var _this = this;
    this.floors = {};   //key: FL_ID, value: the floor feature
    this.building = null; //the building feature
    this.root = null; //the root scene

    var _curFloorId;

    //get building id
    this.getBuildingId = function(){
        var buildingId = _this.building.id;
        return buildingId ? buildingId : -1;
    };

    //get default floor id
    this.getDefaultFloorNo = function(){
        var fl_id;
        for(fl_id in _this.floors)
        {
            if(_this.floors[fl_id].properties.FL_NO == 1)
                return 1;
        }
        if(fl_id)
            return _this.floors[fl_id].properties.FL_NO;
        else
            return 0;
    };
    //get current floor id
    this.getCurFloorId = function() {
        return _curFloorId;
    };

    //get floor num
    this.getFloorNum = function(){
        return _this.jsonData.data.Floors.length;
    };

    //get floor by FL_NO
    this.getFloor = function(fl_no) {
        for(var fl_id in _this.floors)
        {
            if(_this.floors[fl_id].properties.FL_NO == fl_no)
                return _this.floors[fl_id];
        }
        return null;
    };

    //get floor by name
    this.getFloorByName = function(name){
        for(var i = 0; i < _this.floors.length; i++) {
            if(_this.floors[i].Name == name) {
                return _this.floors[i];
            }
        }
        return null;
    };

    //get current floor
    this.getCurFloor = function() {
        return _this.getFloor(_curFloorId);
    };

    //get Floor's json data
    this.getFloorJson = function(fid){
        var floorsJson = _this.jsonData.data.Floors;
        for(var i = 0; i < floorsJson.length; i++){
            if(floorsJson[i]._id == fid) {
                return floorsJson[i];
            }
        }
        return null;
    };

    //show the whole building
    this.showAllFloors = function(){
        if(!_this.is3d){ //only the 3d map can show all the floors
            return;
        }

        _this.root.add(_this.building);

        var offset = 4;
        for(var i=0; i<_this.floors.length; i++){
            _this.floors[i].position.set(0,0,i*_this.floors[i].height*offset);
//            if(i == 4){
//                _this.floors[i].position.set(0,-300,i*_this.floors[i].height*offset);
//            }else{
//
//            }
            _this.root.add(this.floors[i]);
        }
        this.building.scale.set(1,1,offset);

        _curFloorId = 0;

        return _this.root;
    }
}


//----------------------------the Loader class --------------------------
IndoorMapLoader= function ( ) {
    this.load = function (url, callback, callbackProgress ) {
        var xhr = new XMLHttpRequest();
        var length = 0;
        xhr.onreadystatechange = function () {
            if ( xhr.readyState === xhr.DONE ) {
                if ( xhr.status === 200 || xhr.status === 0 ) {
                    if ( xhr.responseText ) {
                        try {
                            var json = JSON.parse(xhr.responseText);
                        }
                        catch (e)
                        {
                            console.error( 'IndoorMapLoader: ' + e.name + ":"+e.message );
                        }
                        callback( json );
                    } else {
                        console.error( 'IndoorMapLoader: "' + url + '" seems to be unreachable or the file is empty.' );
                    }
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
        xhr.withCredentials = false;
        xhr.send( null );
    }
};


IndoorMapLoader.prototype.parse = function ( json ) {
    if(this.is3d)
        return Parser3D(json);
    else
        return Parser2D(json);
};

//-----------------------------the IndoorMap class ------------------------------------

var IndoorMap = function (params) {
    var _this = this;
    var _mapDiv, _uiRoot, _uiSelected;
    var _fullScreen = false;
    this.is3d = true;
    var _indoorMap;

    //initialization
    function init(params) {

        //parse the parameters
        if(params != undefined){
            //if the map container is specified
            if (params.hasOwnProperty("mapDiv")) {
                _mapDiv = document.getElementById(params.mapDiv);
                _fullScreen = false;
            }
            //if the map size is specified
            else if(params.hasOwnProperty("size") && params.size.length == 2){
                createMapDiv(params.size);
                _fullScreen = false;
            }
            //else create a full screen map
            else{
                createMapDiv([window.innerWidth,window.innerHeight]);
                _fullScreen = true;
            }
            // 2d or 3d view
            if(params.hasOwnProperty("dim")){
                _this.is3d = params.dim == "2d" ? false : true;
            }else{
                _this.is3d = true;
            }
        }else{
            createMapDiv([window.innerWidth,window.innerHeight]);
            _fullScreen = true;
        }

        // create 2d or 3d map by webgl detection
        if (_this.is3d && Detector.webgl) {
            _indoorMap = new IndoorMap3d(_mapDiv);
        } else {
            _indoorMap = new IndoorMap2d(_mapDiv);
            _this.is3d = false;
        }

        //var marker = document.createElement("image");
        //marker.style.position = "absolute";
        //marker.style.src = System.imgPath+"/marker.png";
        //marker.visibility = false;
        //marker.style.width = "39px";
        //marker.style.height = "54px";
        //document.body.appendChild(marker);
        ////_indoorMap.setSelectionMarker(marker);

    }

    function createMapDiv(size){
        _mapDiv = document.createElement("div");
        _mapDiv.style.width = size[0] + "px";
        _mapDiv.style.height = size[1] + "px";
        _mapDiv.style.top = "0px";
        _mapDiv.style.left = "0px";
        _mapDiv.style.position = "absolute";
        _mapDiv.id = "indoor3d";
        document.body.appendChild(_mapDiv);
        document.body.style.margin = "0";
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
        var curid = _this.building.getCurFloorId();
        if( curid == 0){
            _uiSelected = _uiRoot.children[0];
        }else{
            for(var i = 0; i < ulChildren.length; i++){
                if(ulChildren[i].innerText == _this.building.getCurFloorId().toString() ){
                    _uiSelected = ulChildren[i];
                }
            }
        }
        if(_uiSelected != null){
            _uiSelected.className = "selected";
        }
    }

    init(params);
    return _indoorMap;
};

//get the UI
IndoorMap.getUI = function(indoorMap){
    var _indoorMap = indoorMap;
    if(_indoorMap == undefined || _indoorMap.building == null){
        console.error("the data has not been loaded yet. please call this function in callback");
        return null;
    }
    //create the ul list
    _uiRoot = document.createElement('ul');
    _uiRoot.className = 'floorsUI';

    if(_indoorMap.is3d) {
        var li = document.createElement('li');
        var text = document.createTextNode('All');

        li.appendChild(text);
        _uiRoot.appendChild(li);
        li.onclick = function () {
            _indoorMap.showAllFloors();
        }
    }

    var floors = _indoorMap.building.floors;
    for(var fl_id in floors)
    {
        (function(arg) {
            li = document.createElement('li')
            var name = floors[arg].properties.NAME;
            if(!name)
                name = floors[arg].properties.FL_NO;
            text = document.createTextNode(name);
            li.appendChild(text);
            li.onclick = function () {
                _indoorMap.showFloor(floors[arg].properties.FL_NO);
            };
            _uiRoot.appendChild(li);
        })(fl_id)
    }
    return _uiRoot;
};