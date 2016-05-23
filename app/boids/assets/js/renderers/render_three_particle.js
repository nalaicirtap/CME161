// ------------------------------------------------------------------------------------------------
// scene, camera, and renderer go here

var SCENE_WIDTH = SCENE_HEIGHT = 500;

// create a canvas and a renderer, then append to document
var canvas = document.getElementById("three_particle");
var renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true}); // use webgl renderer (GPU!)
renderer.setSize(SCENE_WIDTH, SCENE_HEIGHT); // Resizes the output canvas to (width, height), and also sets the viewport to fit that size, starting in (0, 0).
document.body.appendChild(renderer.domElement); // attach renderer to canvas

// scene - where we put our models
var scene = new THREE.Scene();

// camera - how we look at our scene
var camera = new THREE.PerspectiveCamera( 45, SCENE_WIDTH / SCENE_HEIGHT, 1, 10000 );
camera.position.set( SCENE_WIDTH, SCENE_HEIGHT/2, 2000 );

// orbit controls - how we use our mouse to move the camera
var controls = new THREE.OrbitControls( camera );
controls.addEventListener( 'change', render );

// ------------------------------------------------------------------------------------------------

// parent object (like a sub-scene)
var parent = new THREE.Object3D();

// ------------------------------------------------------------------------------------------------
// add axes
// from: http://soledadpenades.com/articles/three-js-tutorials/drawing-the-coordinate-axes/

function buildAxes( length ) {
    var axes = new THREE.Object3D();
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z
    return axes;

}

function buildAxis( src, dst, colorHex, dashed ) {
    var geom = new THREE.Geometry(),
        mat; 

    if(dashed) {
            mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
    } else {
            mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
    }

    geom.vertices.push( src.clone() );
    geom.vertices.push( dst.clone() );
    geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

    var axis = new THREE.Line( geom, mat, THREE.LinePieces );

    return axis;

}

axes = buildAxes( SCENE_WIDTH );
parent.add( axes );



// ------------------------------------------------------------------------------------------------
// add Bounding box

// http://threejs.org/docs/#Reference/Extras.Helpers/BoundingBoxHelper
var bounding_box = new THREE.BoundingBoxHelper(parent); // can also be tied to scene
                                                        // but since our objects are in the parent we tie it here
bounding_box.update(); // render
parent.add(bounding_box);

// ---------------------------------------------------------
// Particle Render Prototype Methods

Particle.prototype.create_geometry = function(){
    // enable this if you want spheres
    // http://threejs.org/docs/#Reference/Extras.Geometries/SphereGeometry
    // this.geometry = new THREE.SphereGeometry(
    //     this.radius, // radius — sphere radius. Default is 50.
    //     25,          // widthSegments — number of horizontal segments. Minimum value is 3, and the default is 8.
    //     25           // heightSegments — number of vertical segments. Minimum value is 2, and the default is 6.
    // );
    
    // http://threejs.org/docs/#Reference/Extras.Geometries/BoxGeometry
    this.geometry = new THREE.BoxGeometry( this.radius, this.radius, this.radius);
}

Particle.prototype.create_material = function(){
    // http://threejs.org/docs/#Reference/Math/Color
    this.color = new THREE.Color();
    this.color.setHSL( Math.random(), .85, .5 );

    // http://threejs.org/docs/#Reference/Materials/MeshPhongMaterial
    this.material = new THREE.MeshPhongMaterial({
        color: this.color,
        specular: 0x333333,
        shininess: .9
    });
    this.material.transparent = true;
    this.material.opacity = .75;
}

Particle.prototype.create_mesh = function(){
    // http://threejs.org/docs/#Reference/Objects/Mesh
    this.mesh = new THREE.Mesh(
        this.geometry,
        this.material
    );
    this.mesh.position.set(this.x, this.y, this.z);
    console.log(this.mesh);
}

Particle.prototype.init_mesh_obj = function(){
    this.create_geometry();
    this.create_material();
    this.create_mesh();
}

Particle.prototype.update_mesh = function(){
    // update rotation ( rotation is a vector of type Euler http://threejs.org/docs/#Reference/Math/Euler )
    this.mesh.position.set(this.x, this.y, this.z);
    this.mesh.rotation.setFromVector3(new THREE.Vector3(this.rx, this.ry, this.rz));

    // calculate momentum and apply it to the color
    var momentum = Math.sqrt( Math.pow(this.x_v,2) + Math.pow(this.y_v,2) + Math.pow(this.z_v,2) ) * this.radius;
    var intensity = momentum/200;
    if(intensity < 0) intensity = 0;
    if(intensity > 1) intensity = 1;
    this.mesh.material.color.setHSL( intensity, .1 + intensity * .85, .2 + intensity * .4);
}

Particle.prototype.set_parameters = function(){
    // gravity is a downward force, -.1 makes the objects fly around longer
    this.gravity = -.1;
}

// add particles
var n = 500;

var data = [];
for (var i = 0; i < n; i++){
    var p = new Particle(SCENE_WIDTH, SCENE_HEIGHT);
    p.set_parameters();
    p.init_mesh_obj();

    parent.add(p.mesh);
    data.push(p);
}

scene.add(parent);

// ------------------------------------------------------------------------------------------------
// Light

var ambientLight = new THREE.AmbientLight(0x444444);
scene.add(ambientLight);

var directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(10, 10, 10).normalize();
scene.add(directionalLight);

var directionalLight2 = new THREE.DirectionalLight(0xffffff);
directionalLight2.position.set(-10, -10, -10).normalize();
scene.add(directionalLight2);

// ------------------------------------------------------------------------------------------------
// add FPS using Stats.js

var stats = new Stats();
stats.setMode(0); // 0: fps, 1: ms
document.body.appendChild(stats.domElement);

// align top-left
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

// ------------------------------------------------------------------------------------------------
// add controls and GUI

var controls = new function () {
    // add your params here
    this.x_rot_v = 0.02;
    this.y_rot_v = 0.02;
    this.z_rot_v = 0.02;
    this.p_x_rot_v = 0;
    this.p_y_rot_v = 0.01;
    this.p_z_rot_v = 0;
    this.ambient_light = true;
    this.direction_light = true;
    this.direction_light_2 = true;
}

var gui = new dat.GUI();
gui.add(controls, 'x_rot_v', 0, 0.5);
gui.add(controls, 'y_rot_v', 0, 0.5);
gui.add(controls, 'z_rot_v', 0, 0.5);
gui.add(controls, 'p_x_rot_v', 0, 0.5);
gui.add(controls, 'p_y_rot_v', 0, 0.5);
gui.add(controls, 'p_z_rot_v', 0, 0.5);


ambient_light = gui.add(controls, 'ambient_light');
ambient_light.onChange(function (value) {
    if (value) {
        scene.add(ambientLight);
    } else {
        scene.remove(ambientLight);
    }
});

direction_light = gui.add(controls, 'direction_light');
direction_light.onChange(function (value) {
    if (value) {
        scene.add(directionalLight);
    } else {
        scene.remove(directionalLight);
    }
});

direction_light_2 = gui.add(controls, 'direction_light_2');
direction_light_2.onChange(function (value) {
    if (value) {
        scene.add(directionalLight2);
    } else {
        scene.remove(directionalLight2);
    }
});


// ------------------------------------------------------------------------------------------------
// draw loop

function draw() {

    // start stats recording
    stats.begin();

    for (var i = 0; i <n; i++) {
        data[i].update();
        data[i].update_mesh();
    }

    parent.rotation.x += controls.p_x_rot_v;
    parent.rotation.y += controls.p_y_rot_v;
    parent.rotation.z += controls.p_z_rot_v;

    // render scene
    renderer.render(scene, camera);

    // end stats recording
    stats.end();

    // run again
    requestAnimationFrame(draw);
}

function render() {
  renderer.render( scene, camera );
}

// ------------------------------------------------------------------------------------------------
// start animation

requestAnimationFrame(draw);

// ------------------------------------------------------------------------------------------------
