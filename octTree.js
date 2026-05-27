//3d version of a quadTree
// --------------------------------------------------
// --------------------------------------------------
class Point {
  constructor(x, y, z, mesh, charge, type = null, size) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.vx = 0;
    this.vy = 0;
    this.vz = 0;
    this.charge = charge;
    this.type = type;
    this.size = size;
    this.mesh = mesh;
  }
}
// --------------------------------------------------
// --------------------------------------------------
class Box3D {
  //x,y,z, width, height, depth
  constructor(x, y, z, w, h, d) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    this.h = h;
    this.d = d;
  }

  // ---------------------------
  // ---------------------------
  //is point inside this cube?
  contains(point) {
    let px = point.x;
    let py = point.y;
    let pz = point.z;
    let rx = this.x;
    let ry = this.y;
    let rz = this.z;
    let rw = this.w;
    let rh = this.h;
    let rd = this.d;
    return px >= rx && px < rx + rw && py >= ry && py < ry + rh && pz >= rz && pz < rz + rd;
  }
  // ---------------------------
  // ---------------------------
  // Checks if another cube overlaps with this one
  intersects(range) {}
}
// --------------------------------------------------
// --------------------------------------------------
// the quadtree works like this :
//*  it starts at the root with a boundary with size equal to the canvas (or the screen size, or the container of the simulation)
//* you insert points into the quadtree at random positions
//* when you insert points, check the current boundary capacity
//  ---> if its full , subdivide, creating 4 new boundaries inside the current one
//  ---> after creating the boundaries, check where the point is located and insert it
//       in the correct boundary (top left, top right, botton left, bottom right)
// the division is taking a rectangle and dividing that rectangle into 4 small rectangles, each one a new quadtree.
//* this process repeats, untill the point/all points are inserted into a quadtree
//* each quadTree has a list of points to keep track of, along with a variable to check if its full



class OctTree {
  // ---------------------------
  // ---------------------------
  constructor(boundary) {
    this.boundary = boundary;
    this.capacity = 4;
    this.boundaryPoints = [];
    this.boundaryBranches = [];
    this.hasDivided = false;

    // Barnes-Hut properties
    this.totalCharge = 0;
    this.centerOfChargeX = 0;
    this.centerOfChargeY = 0;
    this.centerOfChargeZ = 0;
  }

  // ---------------------------
  // ---------------------------
  /*
    // Use a loop or explicit naming to create the 8 children
    // The pattern is: (x, y, z), (x+w, y, z), (x, y+h, z), etc.
    * OCTREE SUBDIVISION REFERENCE TABLE
    * -------------------------------------------------------
    * Octant                     | X Off | Y Off | Z Off
    * ---------------------------|-------|-------|-------
    * 0 (Front-Top-Left)         |   0   |   0   |   0   
    * 1 (Front-Top-Right)        |  +w   |   0   |   0   
    * 2 (Front-Bottom-Left)      |   0   |  +h   |   0   
    * 3 (Front-Bottom-Right)     |  +w   |  +h   |   0   
    * 4 (Back-Top-Left)          |   0   |   0   |  +d   
    * 5 (Back-Top-Right)         |  +w   |   0   |  +d   
    * 6 (Back-Bottom-Left)       |   0   |  +h   |  +d   
    * 7 (Back-Bottom-Right)      |  +w   |  +h   |  +d   
    * -------------------------------------------------------
    * Note: w, h, d represent half-width, half-height, and half-depth.
 */
  subdivide() {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let z = this.boundary.z;
    let w = this.boundary.w / 2;
    let h = this.boundary.h / 2;
    let d = this.boundary.d / 2;
    
    // LAYER 1: Front (Z)
    this.boundaryBranches.push(new OctTree(new Box3D(x, y, z, w, h, d)));
    this.boundaryBranches.push(new OctTree(new Box3D(x + w, y, z, w, h, d)));
    this.boundaryBranches.push(new OctTree(new Box3D(x, y + h, z, w, h, d)));
    this.boundaryBranches.push(new OctTree(new Box3D(x + w, y + h, z, w, h, d)));
    // LAYER 2: Back (Z + D)
    this.boundaryBranches.push(new OctTree(new Box3D(x, y, z + d, w, h, d)));
    this.boundaryBranches.push(new OctTree(new Box3D(x + w, y, z + d, w, h, d)));
    this.boundaryBranches.push(new OctTree(new Box3D(x, y + h, z + d, w, h, d)));
    this.boundaryBranches.push(new OctTree(new Box3D(x + w, y + h, z + d, w, h, d)));

    //---
    this.hasDivided = true;
  }
  // ---------------------------
  // ---------------------------
  insert(point) {
    // //check if point position falls into current boundary before inserting
    if (!this.boundary.contains(point)) return;

    // Barnes-Hut: Update center of charge properties as we insert
    // We calculate a weighted average: (charge * position)
    let newTotalCharge = this.totalCharge + point.charge;

    if (newTotalCharge !== 0) {
      this.centerOfChargeX = (this.centerOfChargeX * this.totalCharge + point.x * point.charge) / newTotalCharge;
      this.centerOfChargeY = (this.centerOfChargeY * this.totalCharge + point.y * point.charge) / newTotalCharge;
      this.centerOfChargeZ = (this.centerOfChargeZ * this.totalCharge + point.z * point.charge) / newTotalCharge;
    }
    this.totalCharge = newTotalCharge;

    //----
    if (this.boundaryPoints.length < this.capacity && !this.hasDivided) {
      this.boundaryPoints.push(point);
    } else {
      if (!this.hasDivided) {
        //subdivide the current boundary
        this.subdivide();
        // QQQ test
        // Move existing points to branches to keep leaves clean
        while (this.boundaryPoints.length > 0) {
          let p = this.boundaryPoints.pop();
          for (let branch of this.boundaryBranches) branch.insert(p);
        }
      }
      //insert point in subdivision, this is recursive
      for (let i = 0; i < this.boundaryBranches.length; i++) {
        this.boundaryBranches[i].insert(point);
      }
    }
  }
  // ---------------------------
  // ---------------------------
  // theta is the 'threshold' (usually 0.5).
  // Higher = faster but less accurate. Lower = slower but more accurate.
  // for Exploding Particles increase the softening from 0.1 to .5 or more
  // increase k for realistic pull between particles
  calculateForce(point, theta = 0.5) {
    let force = { x: 0, y: 0, z: 0 };

    // Don't calculate force on self
    if (this.totalCharge === 0 || (this.boundaryPoints.length === 1 && this.boundaryPoints[0] === point)) {
      return force;
    }

    let dx = this.centerOfChargeX - point.x;
    let dy = this.centerOfChargeY - point.y;
    let dz = this.centerOfChargeZ - point.z;
    let distanceSq = dx * dx + dy * dy + dz * dz + 1.5; // 0.01 is 'softening' to prevent infinity
    let distance = Math.sqrt(distanceSq);

    // Barnes-Hut Criterion: s / d < theta
    // s is the width of the current box, d is the distance
    if (this.boundary.w / distance < theta || !this.hasDivided) {
      // Treat this node as a single point charge
      const K = 50000; // Coulomb Constant (Adjusted for simulation scale)
      let fMag = (K * (point.charge * this.totalCharge)) / distanceSq;

      // We use negative fMag because like charges repel (vector points away)
      force.x = (dx / distance) * fMag;
      force.y = (dy / distance) * fMag;
      force.z = (dz / distance) * fMag;
    } else {
      // Too close! Dive into children for more detail
      for (let branch of this.boundaryBranches) {
        let f = branch.calculateForce(point, theta);
        force.x += f.x;
        force.y += f.y;
        force.z += f.z;
      }
    }
    return force;
  }
}

//----------------------------------------------------
//----------------------------------------------------
export { OctTree, Point, Box3D };
