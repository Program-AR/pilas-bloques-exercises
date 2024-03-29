const jsdom = require("jsdom")
const { JSDOM } = jsdom
const fs = require( 'fs' )

const pilasweb = fs.readFileSync( __dirname + '/../node_modules/pilasweb/dist/pilasweb.js' ).toString()
const pilasBloquesExercises = fs.readFileSync( __dirname + '/../dist/pilas-bloques-exercises.js' ).toString()

class FakeResourceLoader extends jsdom.ResourceLoader {
  fetch(url, options) {
    return Promise.resolve({})
  }
}

var dom = new JSDOM( `
  <canvas id="canvas" width="420" height="480"></canvas>
` , {
  "url": "http://test/",
  "resources": new FakeResourceLoader(),
  "runScripts": "outside-only"
})

dom.window.createjs = {}
dom.window.eval(pilasweb)
dom.window.eval(pilasBloquesExercises)

global.window = dom.window  // Not working?
global.win = dom.window     // Hackazo
