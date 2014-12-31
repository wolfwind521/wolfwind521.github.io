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

    //get the center of some points
    function getCenter(points){
        var center = new THREE.Vector3(0,0,0);
        for(var i=0; i<points.length; i++){
            center.add(points[i]);
        }
        center.divideScalar(points.length);
        return center;
    }

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
            mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial(mall.theme.floor));
            mesh.position.set(0,0,-5);

            floorObj.height = floorHeight;
            floorObj.add(mesh);
            floorObj.points = [];
            floorObj.id = floor._id;
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

                var center = getCenter(points);
                floorObj.points.push({ name: funcArea.Name, type: funcArea.Type, position: new THREE.Vector3(center.x * scale, floorHeight * scale, -center.y * scale )});

                //solid model
                extrudeSettings = {amount: floorHeight, bevelEnabled: false};
                geometry = new THREE.ExtrudeGeometry(shape,extrudeSettings);
                material = new THREE.MeshLambertMaterial(mall.theme.room(funcArea.Type));
                mesh = new THREE.Mesh(geometry, material);
                mesh.type = "solidroom";
                mesh.name = funcArea.Name;
                floorObj.add(mesh);

                geometry = shape.createPointsGeometry();
//                //bottom wireframe
//                wire = new THREE.Line(geometry, mall.theme.roomWireMat);
//                floorObj.add(wire);

                //top wireframe
                wire = new THREE.Line(geometry, new THREE.LineBasicMaterial(mall.theme.roomWire));
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
        mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial(mall.theme.building));

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
};