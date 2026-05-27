//global vars
//------------------------------
const colorList = {
  red: "#ff0000",
  green: "#00ff15",
  blue: "#0004ff",
  yellow: "#f0d826",
  neonOrange: "#e34c32",
  purple: "#4f04bf",
  greenBlue: "#04b6bf",
  white: "#ffffff",
  black: "#000000",
};

//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
function getRandomHexColor() {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
}

//----------------------------------------------------
//----------------------------------------------------

function getRandomPosition(
  entityMinPlacementX,
  entityMaxPlacementX,
  entityMinPlacementY,
  entityMaxPlacementY,
  entityMinPlacementZ,
  entityMaxPlacementZ,
) {
  // const x = Math.random() * (maxX - minX) + minX;
  const x = Math.random() * (entityMaxPlacementX - -entityMinPlacementX) + -entityMinPlacementX;
  const y = Math.random() * (entityMaxPlacementY - -entityMinPlacementY) + -entityMinPlacementY;
  const z = Math.random() * (entityMaxPlacementZ - -entityMinPlacementZ) + -entityMinPlacementZ;
  return { x, y, z };
}

//----------------------------------------------------
//----------------------------------------------------
/**
 * Generates a random 3D point within a given box boundary.
 * @param {Object} boundary - An object with x, y, z, w, h, d
 * @returns {Object} {x, y, z}
 */
function getRandomPoint(boundary) {
  return {
    x: boundary.x + Math.random() * boundary.w,
    y: boundary.y + Math.random() * boundary.h,
    z: boundary.z + Math.random() * boundary.d,
  };
}
//----------------------------------------------------
//----------------------------------------------------
function randomSign() {
  return Math.random() < 0.5 ? -1 : 1;
}
//----------------------------------------------------
//----------------------------------------------------
function convertDegreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}
//----------------------------------------------------
//----------------------------------------------------
