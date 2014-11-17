/**
 * @author gaimeng
 * @date Oct, 2014
 */


var defaultTheme = {
    name : "default", //theme's name
    clearColor : 0xffffff, //background color
    buildingMat : new THREE.MeshBasicMaterial({color: 0x000000, opacity: 0.1, transparent:true /*, depthTest:false*/}),
    floorMat : new THREE.MeshBasicMaterial({color: 0xc1c1c1, opacity:1, transparent:false, side: THREE.DoubleSide}),
    roomMat : function(type){
        var roomcolor = 0xffffff - parseInt(type);
        return new THREE.MeshBasicMaterial({color: roomcolor, opacity: 1, transparent: false, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1});
    },
    roomWireMat : new THREE.LineBasicMaterial({ color: 0xED7D31, opacity: 1, transparent: false, linewidth: 1.5 }),
    labelImg: function(type){
        switch (type){
            case "000300": //closed area
                return "./img/indoor_floor_normal.png";
            case "11001": //WC
                return "./img/wc.png";
            case "11002": //atm
                return "./img/indoor_pub_atm.png";
            case "11003": //cashier
                return "./img/indoor_pub_cashier.png";
            case "11004": //office
                return "./img/indoor_pub_office.png";
            case "21001": //staircase
                return "./img/indoor_pub_staircase.png";
            case "21002": //escalator
                return "./img/indoor_pub_escalator.png";
            case "21003": //elevator
                return "./img/indoor_pub_elevator.png";
            case "050100": //food
                return "./img/indoor_func_am0010.png";
            case "061102": //shoes
                return "./img/indoor_func_am0006.png";
            case "061103": //bags
                return "./img/indoor_func_am0009.png";
            case "061202": //jewelry
                return "./img/indoor_func_am0002.png";
            case "061400": //toiletry
                return "./img/indoor_func_am0005.png";
            case "22006": //gate
                return "./img/gate.png";

            default : //default
                return "./img/default-point.png";
        }
    }
}

var testTheme = {
    name : "default", //theme's name
    clearColor : 0xffffff, //background color
    buildingMat : new THREE.MeshBasicMaterial({color: 0x000000, opacity: 0.1, transparent:true, depthTest:false}),
    floorMat : new THREE.MeshBasicMaterial({color: 0xc1c1c1, opacity:1, transparent:false, side: THREE.DoubleSide}),
    roomMat : function(type){
        return new THREE.MeshBasicMaterial({color: 0xF8CBAD, opacity: 0.2, transparent: true});
    },
    roomWireMat : new THREE.LineBasicMaterial({ color: 0xED7D31, opacity: 0.8, transparent: true, linewidth: 2 }),
    labelImg: function(type){
        switch (type){
            case "000300": //closed area
                return "./img/indoor_floor_normal.png";
            case "11001": //WC
                return "./img/wc.png";
            case "11002": //atm
                return "./img/indoor_pub_atm.png";
            case "11003": //cashier
                return "./img/indoor_pub_cashier.png";
            case "11004": //office
                return "./img/indoor_pub_office.png";
            case "21001": //staircase
                return "./img/indoor_pub_staircase.png";
            case "21002": //escalator
                return "./img/indoor_pub_escalator.png";
            case "21003": //elevator
                return "./img/indoor_pub_elevator.png";
            case "050100": //food
                return "./img/indoor_func_am0010.png";
            case "061102": //shoes
                return "./img/indoor_func_am0006.png";
            case "061103": //bags
                return "./img/indoor_func_am0009.png";
            case "061202": //jewelry
                return "./img/indoor_func_am0002.png";
            case "061400": //toiletry
                return "./img/indoor_func_am0005.png";
            case "22006": //gate
                return "./img/gate.png";

            default : //default
                return "./img/default-point.png";
        }
    }
}

var techTheme = {
    name : "tech",
    clearColor : 0x000000,
    buildingMat : new THREE.MeshBasicMaterial({color: 0x00B1FF, opacity: 0.2, transparent:true, depthTest:false}),
    floorMat : new THREE.MeshBasicMaterial({color: 0x00B1FF, opacity:0.4, transparent:true, side: THREE.DoubleSide}),
    roomMat : function(type){return new THREE.MeshBasicMaterial({color: 0x00B1FF, opacity: 0.2, transparent: true, side: THREE.DoubleSide});},
    roomWireMat : new THREE.LineBasicMaterial({ color: 0x00B1FF, opacity: 0.7, transparent: true, linewidth: 2 }),
    labelImg: function(type){
        switch (type){
            case "000300": //closed area
                return "./img/indoor_floor_normal.png";
            case "11001": //WC
                return "./img/wc.png";
            case "11002": //atm
                return "./img/indoor_pub_atm.png";
            case "11003": //cashier
                return "./img/indoor_pub_cashier.png";
            case "11004": //office
                return "./img/indoor_pub_office.png";
            case "21001": //staircase
                return "./img/indoor_pub_staircase.png";
            case "21002": //escalator
                return "./img/indoor_pub_escalator.png";
            case "21003": //elevator
                return "./img/indoor_pub_elevator.png";
            case "050100": //food
                return "./img/indoor_func_am0010.png";
            case "061102": //shoes
                return "./img/indoor_func_am0006.png";
            case "061103": //bags
                return "./img/indoor_func_am0009.png";
            case "061202": //jewelry
                return "./img/indoor_func_am0002.png";
            case "061400": //toiletry
                return "./img/indoor_func_am0005.png";
            case "22006": //gate
                return "./img/gate.png";

            default : //default
                return "./img/default-point.png";
        }
    }
}

////removed on 2014.11.5. text sprite is not used any more
////make a text sprite
//function makeTextSprite( message, parameters )
//{
//    if ( parameters === undefined ) parameters = {};
//
//    var fontface = parameters.hasOwnProperty("fontface") ?
//        parameters["fontface"] : "Arial";
//
//    var fontsize = parameters.hasOwnProperty("fontsize") ?
//        parameters["fontsize"] : 18;
//
//    var fontcolor = parameters.hasOwnProperty("color") ?
//        parameters["color"] : "rgb(0,0,0)";
//
//    var borderThickness = parameters.hasOwnProperty("borderThickness") ?
//        parameters["borderThickness"] : 4;
//
//    var borderColor = parameters.hasOwnProperty("borderColor") ?
//        parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
//
//    var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
//        parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };
//
//    //var spriteAlignment = THREE.SpriteAlignment.topLeft;
//
//    var canvas = document.createElement('canvas');
//    var context = canvas.getContext('2d');
//    context.font = "Bold " + fontsize + "px " + fontface;
//
//    // get size data (height depends only on font size)
//    var metrics = context.measureText( message );
//    var textWidth = metrics.width;
//
//    // background color
//    context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
//        + backgroundColor.b + "," + backgroundColor.a + ")";
//    // border color
//    context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
//        + borderColor.b + "," + borderColor.a + ")";
//
//    context.lineWidth = borderThickness;
//    //roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
//    // 1.4 is extra height factor for text below baseline: g,j,p,q.
//
//    // text color
//    context.fillStyle = fontcolor;
//
//    context.fillText( message, borderThickness, fontsize + borderThickness);
//
//    // canvas contents will be used for a texture
//    var texture = new THREE.Texture(canvas)
//    texture.needsUpdate = true;
//
//    var spriteMaterial = new THREE.SpriteMaterial(
//        { map: texture, useScreenCoordinates: false, alignment: new THREE.Vector2( 1, -1 ), depthTest:true } );
//    var sprite = new THREE.Sprite( spriteMaterial );
//    sprite.scale.set(10,5,1.0);
//    return sprite;
//}

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
    this.floors = [];   //the object3d of the floors
    this.building = null; //the building
    this.root = new THREE.Object3D(); //the root scene
    this.theme = defaultTheme;

    //show floor by id
    this.showFloor = function(id){
        //if the id out of range
        if(id<0 || id>=this.floors.length){
            return;
        }
        //set the building outline to invisible
        this.root.remove(this.building);
        //set all the floors to invisible
        for(var i=0; i<this.floors.length; i++){
            this.root.remove(this.floors[i]);
        }
        //set the specific floor to visible
        this.floors[id].position.set(0,0,0);
        this.root.add(this.floors[id]);

        return this.floors[id];
    }

    //show the whole building
    this.showAll = function(){
        var offset = 4;
        for(var i=0; i<this.floors.length; i++){
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
        var underfloors = json.data.building.UnderFloors;

        //floor geometry
        for(var i=0; i<json.data.Floors.length; i++){
            var floorObj = new THREE.Object3D();
            var floor = json.data.Floors[i];
            var floorid = floor._id;
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
            floorObj.points = [];
            if(floorid < 0) { //underfloors
                mall.floors[floorid + underfloors] = floorObj;
            }else{ // ground floors, id starts from 1
                mall.floors[floorid - 1 + underfloors] = floorObj;
            }
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
                floorObj.points.push({ name: funcArea.Name, type: funcArea.Type, position: new THREE.Vector3(center.x * scale, floorHeight * scale, -center.y * scale )});

                //solid model
                extrudeSettings = {amount: floorHeight, bevelEnabled: false};
                geometry = new THREE.ExtrudeGeometry(shape,extrudeSettings);
                material = mall.theme.roomMat(funcArea.Type);
                mesh = new THREE.Mesh(geometry, material);
                mesh.type = "solidroom";
                floorObj.add(mesh);

                geometry = shape.createPointsGeometry();
//                //bottom wireframe
//                wire = new THREE.Line(geometry, mall.theme.roomWireMat);
//                floorObj.add(wire);

                //top wireframe
                wire = new THREE.Line(geometry, mall.theme.roomWireMat);
                wire.position.set(0,0, floorHeight);
                floorObj.add(wire);

//                //verticle lines
//                geometry = new THREE.Geometry();
//                geometry.vertices.push(new THREE.Vector3(0,0,0));
//                geometry.vertices.push(new THREE.Vector3(0,0,floorHeight));
//                for(var k=0; k<points.length; k++){
//                    var line = new THREE.Line(geometry, mall.theme.roomWireMat);
//                    line.position.set(points[k].x, points[k].y, 0);
//                    room.add(line);
//                }


            }

            //pubPoint geometry
            for(var j = 0; j < floor.PubPoint.length; j++){
                var pubPoint = floor.PubPoint[j];
                var point = parsePoints(pubPoint.Outline[0][0])[0];
                floorObj.points.push({name: pubPoint.Name, type: pubPoint.Type, position: new THREE.Vector3(point.x * scale,  floorHeight * scale, -point.y * scale)});
            }
        }

        //building geometry
        building = json.data.building;
        points = parsePoints(building.Outline[0][0]);
        shape = new THREE.Shape(points);
        extrudeSettings = {amount: buildingHeight, bevelEnabled: false};
        geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        mesh = new THREE.Mesh(geometry, mall.theme.buildingMat);

        mall.building = mesh;
        mall.root.name = building.Name;
        mall.floorNames = building.FloorsId.split(",");
        mall.remark = building.Remark;

        //scale the mall
        mall.root.scale.set(scale, scale, scale);
        mall.root.rotateOnAxis(new THREE.Vector3(1, 0, 0 ), -Math.PI/2);

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