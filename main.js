import * as threeJsHelper from "./threeJsHelpers.js";
import * as OctreeHelper from "./octTree.js";
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------

//----------------------------------------------------
//----------------------------------------------------
// SETUP
//-----------------------------
//-----------------------------
// --------------------------------------------------
// --------------------------------------------------
//QQQ DEBUG section
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------

const particleSize = 10;
let totalParticles = 200;
let particlesArr = [];

//size of each cube dimension w,h,d
let boxW = 500;
let boxH = 500;
let boxD = 500;
//----------
//----------
// set camera pos based on box size
threeJsHelper.camera.position.set(boxW / 2, boxH / 2, boxD * 1.5);
//----------
//--- insert first particles
let baseBox = new OctreeHelper.Box3D(0, 0, 0, boxW, boxH, boxD);
for (let i = 0; i < totalParticles; i++) {
  let rp = getRandomPoint(baseBox);
  let pCharge = randomSign();
  let pColor = "";
  if (pCharge > 0) {
    pColor = colorList.neonOrange;
  } else {
    pColor = colorList.greenBlue;
  }
  let p = new OctreeHelper.Point(rp.x, rp.y, rp.z, null, pCharge, "A", particleSize);
  let oct = threeJsHelper.drawOctahedronWithLines(p.size, pColor);
  oct.mesh.position.set(p.x, p.y, p.z);
  oct.wireframe.position.set(p.x, p.y, p.z);
  threeJsHelper.scene.add(oct.mesh);
  threeJsHelper.scene.add(oct.wireframe);
  p.mesh = oct;
  particlesArr.push(p);
}

//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
const updateSimulation = (dt) => {
  //update point's mesh positions
  for (let p of particlesArr) {
    // console.log("QQQ p.vx ", p.vx);
    p.mesh.mesh.position.set(p.x, p.y, p.z);
    p.mesh.wireframe.position.set(p.x, p.y, p.z);
  }

  // 1. Rebuild the Tree
  let rootBox = new OctreeHelper.Box3D(0, 0, 0, boxW, boxH, boxD);
  let tree = new OctreeHelper.OctTree(rootBox);
  for (let p of particlesArr) tree.insert(p);

  // 2. Calculate Forces and Update Physics
  for (let p of particlesArr) {
    let f = tree.calculateForce(p, 0.5);

    // F = ma -> a = F/m (Assuming mass = 1 for simplicity)
    //QQQ add mass later
    p.vx += f.x * dt;
    p.vy += f.y * dt;
    p.vz += f.z * dt;

    // Apply velocity to position
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.z += p.vz * dt;

    // Simple drag/friction so they don't accelerate forever
    p.vx *= 0.98;
    p.vy *= 0.98;
    p.vz *= 0.98;
  }
};
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------

//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//  RENDER LOOP
function main() {
  function resizeRendererToDisplaySize(renderer) {
    const canvas = threeJsHelper.renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      threeJsHelper.renderer.setSize(width, height, false);
    }

    return needResize;
  }

  //----------------------------------------------------
  //----------------------------------------------------
  //----------------------------------------------------
  //  RENDER LOOP
  let intervalId = null;
  let lastTime = 0;
  // 1. Add 'currentTime' as a parameter here
  function renderLoop(currentTime) {
    if (resizeRendererToDisplaySize(threeJsHelper.renderer)) {
      const canvas = threeJsHelper.renderer.domElement;
      threeJsHelper.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      threeJsHelper.camera.updateProjectionMatrix();
    }

    // 2. Calculate dt (currentTime is provided by requestAnimationFrame)
    let dt = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    // 3. Handle the very first frame where lastTime is 0
    // (Otherwise dt will be a massive number)
    if (isNaN(dt) || dt > 0.1) dt = 0.016;

    updateSimulation(dt);

    threeJsHelper.renderer.render(threeJsHelper.scene, threeJsHelper.camera);

    // 4. requestAnimationFrame passes the timestamp to the next call
    intervalId = requestAnimationFrame(renderLoop);
  }

  // Start the loop
  intervalId = requestAnimationFrame(renderLoop);
  // let lastTime = 0;
  // function renderLoop() {
  //   if (resizeRendererToDisplaySize(threeJsHelper.renderer)) {
  //     const canvas = threeJsHelper.renderer.domElement;
  //     threeJsHelper.camera.aspect = canvas.clientWidth / canvas.clientHeight;
  //     threeJsHelper.camera.updateProjectionMatrix();
  //   }

  //   // Convert currentTime to seconds (e.g., 0.016 for 60fps)
  //   let dt = (currentTime - lastTime) / 1000;
  //   lastTime = currentTime;

  //   // Prevent huge jumps if the user switches tabs
  //   if (dt > 0.1) dt = 0.1;

  //   //QQQ
  //   updateSimulation(dt);

  //   //render results on screen
  //   threeJsHelper.renderer.render(threeJsHelper.scene, threeJsHelper.camera);

  //   intervalId = requestAnimationFrame(renderLoop);
  // }

  // intervalId = requestAnimationFrame(renderLoop);
}

main();
