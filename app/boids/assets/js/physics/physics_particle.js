var Particle = function(width_in, height_in) {
    
    this.type = "particle";
    this.gravity = .5;
    this.drag = .995;
    this.radius = Math.random() * 40;

    this.x_max = width_in - (this.radius / 2);
    this.y_max = height_in - (this.radius / 2);
    this.z_max = width_in - (this.radius / 2);

    this.x = -1*this.x_max + Math.random() * this.x_max;
    this.y = -1*this.y_max + Math.random() * this.y_max;
    this.z = -1*this.z_max + Math.random() * this.z_max;

    this.x_v = Math.random() * 20;
	this.y_v = Math.random() * 20;
    this.z_v = Math.random() * 20;
    
    this.rx = 0;
	this.ry = 0;
    this.rz = 0;
    this.rx_v = Math.random()/10;
	this.ry_v = Math.random()/10;
    this.rz_v = Math.random()/10;
    
    this.hue = 180 * Math.random();
    

    this.constrain_x = function () {

        // x
        if (this.x >= this.x_max) {
            this.x = this.x_max;
            this.x_v *= -1;
        }

        if (this.x <= -this.x_max) {
            this.x = -this.x_max;
            this.x_v *= -1;
        }
    }
    this.constrain_y = function () {
        // y
        if (this.y >= this.y_max) {
            this.y = this.y_max;
            this.y_v *= -1;
        }

        if (this.y <= -this.y_max) {
            this.y = -this.y_max;
            this.y_v *= -1;
        }

    }
    
    this.constrain_z = function () {        //z
        // z
        if (this.z >= this.z_max) {
            this.z = this.z_max;
            this.z_v *= -1;
        }

        if (this.z <= -this.z_max) {
            this.z = -this.z_max;
            this.z_v *= -1;
        }

    }

    this.update = function () {
        // lazy Euler integration

        // y direction
        if ((Math.abs(this.y_v) > 0)) {

            this.y_v *= this.drag;
            this.y_v += this.gravity;
            this.y += this.y_v;
            this.constrain_y();

        }

        // x direction
        if ((Math.abs(this.x_v) > 0)) {

            this.x_v *= this.drag;
            this.x += this.x_v;
            this.constrain_x();
        }
        
        // z direction                        //z
        if ((Math.abs(this.z_v) > 0)) {

            this.z_v *= this.drag;
            this.z += this.z_v;
            this.constrain_z();
        }
        
        // hue
        this.hue += 1;
	    this.hue = this.hue % 360;
        
        // rotate
        this.rx += this.rx_v;
	    this.ry += this.ry_v;
        this.rz += this.rz_v;
    }
    
    // boost current direction of particle
    this.boost = function() {
        var y_sign = this.y_v > 0 ? 1 : -1;
        var x_sign = this.x_v > 0 ? 1 : -1;
        if(Math.abs( this.y_v) < 1 ){
            
            // random amount of boost
            var ky = Math.random() * 2.5;
            var kx = Math.random() * 1.5;
            
            this.y_v += ky * y_sign;
            this.y -= ky;
            this.x_v += kx * x_sign;
            this.x += kx;
        } else {
            this.y_v *= 1.1;
        }
    }
    
}