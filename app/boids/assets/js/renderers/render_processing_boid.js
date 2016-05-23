// create a simple visualization
function processing_render($p) {

    // canvas size
    // $p.size(window.innerWidth, window.innerHeight, $p.WEBGL);    //z

    $p.size(500, 500, $p.WEBGL);
    $p.frameRate(3000);
    
    // ---------------------------------------------------------
    // Boid Render Prototype Methods

    // add properties
    Boid.prototype.set_hue  = function(){ this.hue = 180 * Math.random(); }
    Boid.prototype.set_radius = function(){ this.radius = Math.random() * 40; }
    Boid.prototype.set_rotation = function(){ 
        this.rotation   = new THREE.Vector3();
        this.rotation.x = this.rotation.y = this.rotation.z = 0;

        this.rotation_v = new THREE.Vector3();
        this.rotation_v.x = Math.random()/10;
        this.rotation_v.y = Math.random()/10;
        this.rotation_v.z = Math.random()/10;
     }

    // draw method
    Boid.prototype.draw = function(){
        // color
        // var velocity_length = Math.sqrt( Math.pow(this.velocity.x,2) + Math.pow(this.velocity.y,2) + Math.pow(this.velocity.z,2) );
        var momentum = this.velocity.length() * this.radius;
        var intensity = momentum/150 * 360;
        $p.fill(intensity, intensity, intensity, 270);

        // rotate
        this.rotation.add(this.rotation_v);
        
        // 3D shape
        $p.translate(this.position.x, this.position.y, this.position.z);
        $p.rotate(this.rotation.x, this.rotation.y, this.rotation.z);
        $p.box(this.radius);
        $p.rotate(-this.rotation.x, -this.rotation.y, -this.rotation.z);
        $p.translate(-this.position.x, -this.position.y, -this.position.z);
    }

    // add boids
    var n = 200, data = [];
    for (var i = 0; i < n; i++){
        data[i] = new Boid();
        data[i].set_hue();
        data[i].set_radius();
        data[i].set_rotation();
        data[i].setWorldSize($p.width, $p.height, $p.width * 1.5);
    }
    
    // ---------------------------------------------------------
    // setup
    
    // graphical parameters
    $p.noStroke();
    $p.colorMode($p.HSB, 360, 100, 100);
    $p.ellipseMode($p.CENTER);
    $p.background(0,0,0); // dark

    // ---------------------------------------------------------
    // draw
    
    var world_rotate = 0;
    $p.draw = function () {
        
        // opaque bg
        $p.background(0,0,0); // dark
        
        // center
        $p.translate($p.width / 2, $p.height / 2 + 50, -2*$p.width);
        
        // rotate
        $p.rotateX(-0.5); // tilt forward
        //$p.rotateY(world_rotate); // rotate
        //world_rotate += .015
        
        // lights (draw after translating world)
        $p.directionalLight(360, 0, 100, 1, 0, 0);
        $p.directionalLight(360, 0, 40, 0, 1, 0);
        $p.directionalLight(360, 0, 70, 0, 0, 1);
        $p.directionalLight(360, 0, 60, -1, 0, 0);
        
        // draw axis
        //draw_axis();
        
        for (var i = 0; i < data.length; i++) {
            data[i].run( data );
            data[i].draw();
        }
    }
    
    // ---------------------------------------------------------
    // interaction
    
    $p.mouseMoved = function () {
        var vector = new THREE.Vector3( $p.mouseX, $p.mouseY, 0 );
        for (var i = 0; i < data.length; i++) {
            vector.z = data[ i ].position.z;
            data[ i ].repulse( vector );
        }
    }
}

// create a canvas
var canvas = document.getElementById("processing_boid");
ctx = canvas.getContext('webgl', { antialias: true});

// bind basic_bar_chart to canvas
var processing_sim = new Processing(canvas, processing_render);