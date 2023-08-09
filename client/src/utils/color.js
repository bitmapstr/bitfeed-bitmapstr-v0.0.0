import { hcl } from 'd3-color'
import { currentHeight } from '../stores'
console.log("currentHeight")
console.log(currentHeight)

export function hlToHex ({h, l}) {
  return hcl(h * 360, 78.225, l * 150).hex()
}

export function mixColor (startColor, endColor, min, max, value) {
  const dx = Math.max(0, Math.min(1, (value - min) / (max - min)))
  return {
    h: startColor.h + (dx *(endColor.h - startColor.h)),
    l: startColor.l + (dx *(endColor.l - startColor.l))
  }
}

export function hexToRgb(hex) {
  // Remove the leading '0x' if it exists
  //hex = hex.startsWith('0x') ? hex.slice(2) : hex;

  // Get Txid

  // Create an array to store the RGB values
  const rgbValues = [];

  // Split the hexadecimal string into 8 equal parts
  for (let i = 0; i < 8; i++) {
    const hexPart = hex.slice(i * 8, (i + 1) * 8);

    // Convert the hexadecimal part to decimal value
    const decimalValue = parseInt(hexPart, 16);

    // Split the decimal value into red, green, and blue components
    const red = (decimalValue >> 16) & 0xFF;
    const green = (decimalValue >> 8) & 0xFF;
    const blue = decimalValue & 0xFF;

    // Push the RGB values as an object to the array
    rgbValues.push({ r: red, g: green, b: blue });
  }

  // Return the array containing 8 RGB values
  return rgbValues;
}

// Example usage:
const hexValue = '0x3FD0A347832D1015AECFAF02A604A21AFC48C586C3F073B27E39B2A22CBA132A';
const rgbValues = hexToRgb(hexValue);
console.log(rgbValues);


export const cZero = { h: 0.03, l: 0.35 }
export const cOne = { h: 0.45, l: 0.4 }
export const cTwo = { h: 0.181, l: 0.472 }
export const cThree = { h: 0.475, l: 0.55 }
export const cFour = { h: 0.5, l: 0.55 }
export const cFive = { h: 0.37, l: 0.35 }
export const cSix = { h: 0.95, l: 0.35 }



export const pink = { h: 0.03, l: 0.35 }
export const bluegreen = { h: 0.45, l: 0.4 }
export const orange = { h: 0.181, l: 0.472 }
export const teal = { h: 0.475, l: 0.55 }
export const blue = { h: 0.5, l: 0.55 }
export const green = { h: 0.37, l: 0.35 }
export const purple = { h: 0.95, l: 0.35 }


export const highlightA = { h: 0.93, l: 0.5 } //pink
export const highlightB = { h: 0.214, l: 0.62 } // green
export const highlightC = { h: 0.30, l: 1.0 } // white
export const highlightD = { h: 0.42, l: 0.35 } // blue
export const highlightE = { h: 0.12, l: 0.375 } // red
