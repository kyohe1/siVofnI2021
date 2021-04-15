class Vec3 {
    // Constructor
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // Add method
    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    // Sum method
    sum() {
        return this.x + this.y + this.z;
    }

    // Min method
    min() {
        var minimum = this.x;
        if (minimum > this.y) minimum = this.y;
        if (minimum > this.z) minimum = this.z;
        return minimum;

        /*  The case of using ternary operators.
                const m =  this.x < this.y ? this.x : this.y;
                return m < this.z ? m : this.z;
         *  The case of using the Math module.
                return Math.min( this.x, this.y, this.z );
        */
    }

    // Mid method
    mid() {
        return this.sum() - this.max() - this.min();

        /* The case of not using other methods.
            if (this.x >= this.y) {
                if (this.y >= this.z)       return this.y;
                else if (this.x <= this.z)  return this.x;
                else                        return this.z;
            }
            else if (this.x > this.z)       return this.x;
            else if (this.y > this.z)       return this.z;
            else                            return this.y;
        */
    }

    // Max method
    max() {
        var maximum = this.x;
        if (maximum < this.y)   maximum = this.y;
        if (maximum < this.z)   maximum = this.z;
        return maximum;
        /*  The case of using ternary operators.
                const m = this.x > this.y ? this.x : this.y;
                return m > this.z ? m : this.z;
        *   The case of using the Math module.
                return Math.max( this.x, this.y, this.z );
        */
    }

    // Calculate the length between edges(static method).
    static edgeLength(v, w){
        var x = v.x - w.x;
        var y = v.y - w.y;
        var z = v.z - w.z;
        return Math.sqrt(x * x + y * y + z * z);
    }

    // Calculate the area of triangle(static method).
    static AreaOfTriangle(v0, v1, v2) {
        var len01 = Vec3.edgeLength(v0, v1);
        var len02 = Vec3.edgeLength(v0, v2);
        var len12 = Vec3.edgeLength(v1, v2);
        var S = (len01 + len02 + len12) / 2;

        // Heron's formula
        return Math.sqrt(S * (S - len01) * (S - len02) * (S - len12));
    }
}


