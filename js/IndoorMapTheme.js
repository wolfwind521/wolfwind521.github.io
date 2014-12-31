/**
 * @author gaimeng
 * @date Oct, 2014
 */

//this is a default theme. it turns the "type" string into color directly
var defaultTheme = {
    name : "default", //theme's name

    background : 0xffffff, //background color

    //building's style
    building : {
        color: 0x000000,
        opacity: 0.1,
        transparent:true
        //, depthTest:false
    },

    //floor's style
    floor : {
        color: 0xc1c1c1,
        side: THREE.DoubleSide
    },

    //selected room's style
    selected : 0xffff55,

    //rooms' style.
    room : function(type){
        var roomcolor = 0xffffff - parseInt(type);
        return {
            color: roomcolor,

            //just ignore the following lines. u don't have to understand them.
            //basically, it offsets the rooms so that they won't obscure the wires
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1
        };
    },

    //room wires' style
    roomWire : {
        color: 0xED7D31,
        opacity: 0,//opacity 0 is same as invisible
        transparent: true,
        linewidth: 1.5
    },

    //the icons of the labels
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

//this is a theme using blue to represent technology
var techTheme = {
    name : "tech", //theme's name
    background : 0x000000, //background color

    //building's style
    building : {
        color: 0x00B1FF,
        opacity: 0.2,
        transparent:true,
        depthTest:false
    },

    //floor's style
    floor : {
        color: 0x00B1FF,
        opacity:0.4,
        transparent:true,
        side: THREE.DoubleSide
    },

    //selected room's style
    selected : 0xffff55,

    //rooms' style
    room : function(type){
        return {
            color: 0x00B1FF,
            opacity: 0.2,
            transparent: true,
            side: THREE.DoubleSide
        }
    },

    //room wires' style
    roomWire : {
        color: 0x00B1FF,
        opacity: 0.7,
        transparent: true,
        linewidth: 2
    },

    //icons
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



//this is a theme just for test. feel free to modify it as you like
var testTheme = {
    name : "test", //theme's name
    background : 0xe6e6e6, //background color

    //building's style
    building : {
        color: 0x000000,
        opacity: 0.1,
        transparent:true,
        depthTest:false
    },

    //floor's style
    floor : {
        color: 0xc1c1c1,
        opacity:1,
        transparent:false
    },

    //selected room's style
    selected : 0xffff55,

    //rooms' style
    room : function(type){
        switch (type){

            case "000100": //hollow. u needn't change this color. because i will make a hole on the model in the final version.
                return {
                    color: 0x212121,
                    opacity: 0.8,
                    transparent: true
                }
            case "000300": //closed area
                return {
                    color: 0x9e9e9e,
                    opacity: 0.7,
                    transparent: true
                };
            case "000400": //empty shop
                return{
                    color: 0xE4E4E4,
                    opacity: 0.7,
                    transparent: true
                };
            case "050100": //chinese food
                return {
                    color: 0xd8992c,
                    opacity: 0.7,
                    transparent: true
                };
            case "050117": //hotpot
                return {
                    color: 0xe6a1d1,
                    opacity: 0.7,
                    transparent: true
                };
            case "050201": //i don't know. some kinds of food...
                return {
                    color: 0xb9b3ff,
                    opacity: 0.7,
                    transparent: true
                };
            case "050300": //western food
                return {
                    color: 0xa1e5e6,
                    opacity: 0.7,
                    transparent: true
                };
            case "050300": //western food
                return {
                    color: 0x9e9323,
                    opacity: 0.7,
                    transparent: true
                };
            case "061102": //shoes
                return {
                    color: 0x99455e,
                    opacity: 0.7,
                    transparent: true
                };
            case "061103": //bags
                return {
                    color: 0x17566a,
                    opacity: 0.7,
                    transparent: true
                };
            case "061202": //jewelry
                return {
                    color: 0xd6675b,
                    opacity: 0.7,
                    transparent: true
                };
            case "061400": //toiletry
                return {
                    color: 0x17566a,
                    opacity: 0.7,
                    transparent: true
                };

            default : //default
                return {
                    color: 0xd0641a,
                    opacity: 0.7,
                    transparent: true
                };
        }
    },

    //room wires' style
    roomWire : {
        color: 0x38291f,
        opacity: 0.5,
        transparent: true,
        linewidth: 1
    },

    //icons of the labels
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

