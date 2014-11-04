/**
 * @author gaimeng
 * @date Oct, 2014
 */


var defaultTheme = {
    name : "default",
    clearColor : 0xffffff,
    buildingMat : new THREE.MeshBasicMaterial({color: 0x000000, opacity: 0.1, transparent:true, depthTest:false}),
    floorMat : new THREE.MeshBasicMaterial({color: 0xc1c1c1, opacity:1, transparent:true, side: THREE.DoubleSide, polygonOffset: false, polygonOffsetFactor: -1, polygonOffsetUnits: -2}),
    roomMat : function(type){
        var roomcolor = 0xffffff - parseInt(type);
        return new THREE.MeshBasicMaterial({color: roomcolor, opacity: 1, transparent: true, polygonOffset: false, polygonOffsetFactor: 1, polygonOffsetUnits: 1});
        //return new THREE.MeshBasicMaterial({color: 0xEFE5D9, opacity: 1, transparent: true})
    },
    roomWireMat : new THREE.LineBasicMaterial({ color: 0xED7D31, opacity: 0.5, transparent: true, linewidth: 2 }),
    fontMat: {fontsize: 50, color:"rgb(0,0,0)"}
}

var techTheme = {
    name : "tech",
    clearColor : 0x000000,
    buildingMat : new THREE.MeshBasicMaterial({color: 0x00B1FF, opacity: 0.2, transparent:true, depthTest:false}),
    floorMat : new THREE.MeshBasicMaterial({color: 0x00B1FF, opacity:0.1, transparent:true, side: THREE.DoubleSide}),
    roomMat : function(type){return new THREE.MeshBasicMaterial({color: 0x00B1FF, opacity: 0.2, transparent: true, side: THREE.DoubleSide});},
    roomWireMat : new THREE.LineBasicMaterial({ color: 0x00B1FF, opacity: 0.7, transparent: true, linewidth: 2 })
}

//make a text sprite
function makeTextSprite( message, parameters )
{
    if ( parameters === undefined ) parameters = {};

    var fontface = parameters.hasOwnProperty("fontface") ?
        parameters["fontface"] : "Arial";

    var fontsize = parameters.hasOwnProperty("fontsize") ?
        parameters["fontsize"] : 18;

    var fontcolor = parameters.hasOwnProperty("color") ?
        parameters["color"] : "rgb(0,0,0)";

    var borderThickness = parameters.hasOwnProperty("borderThickness") ?
        parameters["borderThickness"] : 4;

    var borderColor = parameters.hasOwnProperty("borderColor") ?
        parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };

    var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
        parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

    //var spriteAlignment = THREE.SpriteAlignment.topLeft;

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = "Bold " + fontsize + "px " + fontface;

    // get size data (height depends only on font size)
    var metrics = context.measureText( message );
    var textWidth = metrics.width;

    // background color
    context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
        + backgroundColor.b + "," + backgroundColor.a + ")";
    // border color
    context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
        + borderColor.b + "," + borderColor.a + ")";

    context.lineWidth = borderThickness;
    //roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
    // 1.4 is extra height factor for text below baseline: g,j,p,q.

    // text color
    context.fillStyle = fontcolor;

    context.fillText( message, borderThickness, fontsize + borderThickness);

    // canvas contents will be used for a texture
    var texture = new THREE.Texture(canvas)
    texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial(
        { map: texture, useScreenCoordinates: false, alignment: new THREE.Vector2( 1, -1 ), depthTest:true } );
    var sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set(10,5,1.0);
    return sprite;
}

//get the center of some points
function getCenter(points){
    var center = new THREE.Vector3(0,0,0);
    for(var i=0; i<points.length; i++){
        center.add(points[i]);
    }
    center.divideScalar(points.length);
    return center;
}

//the Mall class
function Mall(){
    this.floorNames = []; //the floor names
    this.floors = [];   //the object3d of the floors
    this.building = null; //the building
    this.root = new THREE.Object3D(); //the root scene
    this.theme = defaultTheme;

    //get the floor object3d by its name
    this.getFloor = function(floorName){
        for(var i=0; i<this.floorNames.length; i++){
            if(this.floorNames[i] == floorName){
                return this.floors[i];
            }
        }
        return null;
    }

    //show floor by id
    this.showFloor = function(id){
        //if the id out of range
        if(id<0 || id>=this.floors.length){
            return;
        }
        //set the building outline to invisible
        this.building.visible = false;
        this.root.remove(this.building);
        //set all the floors to invisible
        for(var i=0; i<this.floors.length; i++){
            this.floors[i].visible = false;
            this.root.remove(this.floors[i]);
        }
        //set the specific floor to visible
        this.floors[id].visible = true;
        this.floors[id].position.set(0,0,0);
        this.root.add(this.floors[id]);

        return this.floors[id];
    }

    //show the whole building
    this.showAll = function(){
        var offset = 4;
        this.building.visible = true;
        for(var i=0; i<this.floors.length; i++){
            this.floors[i].visible = true;
            this.floors[i].position.set(0,0,i*this.floors[i].height*offset);
            this.root.add(this.floors[i]);
        }
        this.building.scale.set(1,1,offset);
        this.root.add(this.building);
        return this.root;
    }
}

//the Loader
IndoorMapLoader= function ( showStatus ) {

    THREE.Loader.call( this, showStatus );

    this.withCredentials = false;

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

    var scope = this,
        mall = new Mall();


    function parseModels() {
        var building,shape, extrudeSettings, geometry, material, mesh, wire, color, points;
        var scale = 0.1, floorHeight, buildingHeight = 0;

        //floor geometry
        for(var i=0; i<json.data.Floors.length; i++){
            var floorObj = new THREE.Object3D();
            var floor = json.data.Floors[i];
            floorHeight = floor.High / scale;
            if(floorHeight == 0.0){ //if it's 0, set to 50.0
                floorHeight = 50.0;
            }
            buildingHeight += floorHeight;
            points = parsePoints(floor.Outline[0][0]);
            shape = new THREE.Shape(points);
            geometry = new THREE.ShapeGeometry(shape);
            mesh = new THREE.Mesh(geometry, mall.theme.floorMat);
            mesh.position.set(0,0,-5);

            floorObj.height = floorHeight;
            floorObj.add(mesh);
            floorObj.texts = [];
            floorObj.points = [];

            mall.floors.push(floorObj);

            //funcArea geometry
            for(var j=0; j<floor.FuncAreas.length; j++){

                var funcArea = floor.FuncAreas[j];
                points = parsePoints(funcArea.Outline[0][0]);
                shape = new THREE.Shape(points);

                //text of the shop name
                //var spritey = makeTextSprite(funcArea.Name, mall.theme.fontMat);
                var center = getCenter(points);
                //spritey.position.set(center.x, center.y, floorHeight*1.5);
                //floorObj.add(spritey);
                floorObj.texts.push({ name: funcArea.Name, position: new THREE.Vector3(center.x * scale, center.y * scale, floorHeight * scale)});


                //wireframe
                geometry = shape.createPointsGeometry();
                wire = new THREE.Line(geometry, mall.theme.roomWireMat);
                mall.floors[i].add(wire);

                wire = new THREE.Line(geometry, mall.theme.roomWireMat);
                wire.position.set(0,0, floorHeight);
                mall.floors[i].add(wire);

//                //verticle lines
//                geometry = new THREE.Geometry();
//                geometry.vertices.push(new THREE.Vector3(0,0,0));
//                geometry.vertices.push(new THREE.Vector3(0,0,floorHeight));
//                for(var k=0; k<points.length; k++){
//                    var line = new THREE.Line(geometry, mall.theme.roomWireMat);
//                    line.position.set(points[k].x, points[k].y, 0);
//                    room.add(line);
//                }

                //solid model
                extrudeSettings = {amount: floorHeight, bevelEnabled: false};
                geometry = new THREE.ExtrudeGeometry(shape,extrudeSettings);
                material = mall.theme.roomMat(funcArea.Type);
                mesh = new THREE.Mesh(geometry, material);
                mall.floors[i].add(mesh);
            }
            mall.root.add(mall.floors[i]);
        }

        //building geometry
        building = json.data.building;
        points = parsePoints(building.Outline[0][0]);
        shape = new THREE.Shape(points);
        extrudeSettings = {amount: buildingHeight, bevelEnabled: false};
        geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        mesh = new THREE.Mesh(geometry, mall.theme.buildingMat);

        mall.building = mesh;
        mall.root.add(mall.building);
        mall.root.name = building.Name;
        mall.floorNames = building.FloorsId.split(",");
        mall.remark = building.Remark;

        //scale the mall
        mall.root.scale.set(scale, scale, scale);

        return mall;


    };


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

    return parseModels( );

//    if ( json.materials === undefined || json.materials.length === 0 ) {
//
//        return { geometry: geometry };
//
//    } else {
//
//        var materials = this.initMaterials( json.materials, texturePath );
//
//        if ( this.needsTangents( materials ) ) {
//
//            geometry.computeTangents();
//
//        }
//
//        return { geometry: geometry, materials: materials };
//
//    }

};
