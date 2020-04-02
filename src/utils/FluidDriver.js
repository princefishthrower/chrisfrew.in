// if (document.body.classList.contains('dark-mode')) {
//     var BACK_COLOR = { r: 15, g: 16, b: 13 }
//   } else {
//     var BACK_COLOR = { r: 255, g: 255, b: 255 }
//   }

import pointerPrototype from "./pointerPrototype"

export default class FluidDriver {

  constructor(backgroundRGB, canvasId) {
    this.canvas = document.getElementById(canvasId)
    this.resizeCanvas()
    this.config = {
      SIM_RESOLUTION: 128,
      DYE_RESOLUTION: 512,
      CAPTURE_RESOLUTION: 512,
      DENSITY_DISSIPATION: 0, // 1 for gradual dissipation, 0 for no dissipation
      VELOCITY_DISSIPATION: 0.1,
      PRESSURE: 2,
      PRESSURE_ITERATIONS: 5,
      CURL: 0,
      SPLAT_RADIUS: 0.25,
      SPLAT_FORCE: 10000,
      SHADING: true,
      COLORFUL: true,
      COLOR_UPDATE_SPEED: 1,
      PAUSED: false,
      BACK_COLOR: backgroundRGB,
      TRANSPARENT: false,
      BLOOM: true,
      BLOOM_ITERATIONS: 8,
      BLOOM_RESOLUTION: 256,
      BLOOM_INTENSITY: 0.8,
      BLOOM_THRESHOLD: 0.6,
      BLOOM_SOFT_KNEE: 0.7,
      SUNRAYS: true,
      SUNRAYS_RESOLUTION: 196,
      SUNRAYS_WEIGHT: 1.0,
    }

    this.initialize();

    this.canvas.addEventListener("mousedown", function(e) {
      var posX = this.scaleByPixelRatio(e.offsetX)
      var posY = this.scaleByPixelRatio(e.offsetY)
      var pointer = this.pointers.find(function(p) {
        return p.id === -1
      })
      if (pointer === null) {
        pointer = new pointerPrototype()
      }
      this.updatePointerDownData(pointer, -1, posX, posY)
    })

    this.canvas.addEventListener("mousemove", function(e) {
      var pointer = this.pointers[0]
      var posX = this.scaleByPixelRatio(e.offsetX)
      var posY = this.scaleByPixelRatio(e.offsetY)
      this.updatePointerMoveData(pointer, posX, posY)
    })

    window.addEventListener("mouseup", function() {
      this.updatePointerUpData(this.pointers[0])
    })

    this.canvas.addEventListener("touchstart", function(e) {
      e.preventDefault()
      var touches = e.targetTouches
      while (touches.length >= this.pointers.length) {
        this.pointers.push(new pointerPrototype())
      }
      for (var i = 0; i < touches.length; i++) {
        var posX = this.scaleByPixelRatio(touches[i].pageX)
        var posY = this.scaleByPixelRatio(touches[i].pageY)
        this.updatePointerDownData(
          this.pointers[i + 1],
          touches[i].identifier,
          posX,
          posY
        )
      }
    })

    this.canvas.addEventListener(
      "touchmove",
      function(e) {
        e.preventDefault()
        var touches = e.targetTouches
        for (var i = 0; i < touches.length; i++) {
          var pointer = this.pointers[i + 1]
          if (!pointer.down) {
            continue
          }
          var posX = this.scaleByPixelRatio(touches[i].pageX)
          var posY = this.scaleByPixelRatio(touches[i].pageY)
          this.updatePointerMoveData(pointer, posX, posY)
        }
      },
      false
    )

    window.addEventListener("touchend", function(e) {
      var touches = e.changedTouches
      var loop = function(i) {
        var pointer = this.pointers.find(function(p) {
          return p.id === touches[i].identifier
        })
        if (pointer === null) {
          return
        }
        this.updatePointerUpData(pointer)
      }

      for (var i = 0; i < touches.length; i++) loop(i)
    })

    window.addEventListener("keydown", function(e) {
      // if (e.code === "KeyP") {
      //   this.config.PAUSED = !this.config.PAUSED;
      // }
      if (e.key === " ") {
        this.splatStack.push(parseInt(Math.random() * 20) + 5)
      }
    })

    var baseVertexShader = this.compileShader(
      this.gl.VERTEX_SHADER,
      "\n    precision highp float;\n\n    attribute vec2 aPosition;\n    varying vec2 vUv;\n    varying vec2 vL;\n    varying vec2 vR;\n    varying vec2 vT;\n    varying vec2 vB;\n    uniform vec2 texelSize;\n\n    void main () {\n        vUv = aPosition * 0.5 + 0.5;\n        vL = vUv - vec2(texelSize.x, 0.0);\n        vR = vUv + vec2(texelSize.x, 0.0);\n        vT = vUv + vec2(0.0, texelSize.y);\n        vB = vUv - vec2(0.0, texelSize.y);\n        gl_Position = vec4(aPosition, 0.0, 1.0);\n    }\n"
    )

    var blurVertexShader = this.compileShader(
      this.gl.VERTEX_SHADER,
      "\n    precision highp float;\n\n    attribute vec2 aPosition;\n    varying vec2 vUv;\n    varying vec2 vL;\n    varying vec2 vR;\n    uniform vec2 texelSize;\n\n    void main () {\n        vUv = aPosition * 0.5 + 0.5;\n        float offset = 1.33333333;\n        vL = vUv - texelSize * offset;\n        vR = vUv + texelSize * offset;\n        gl_Position = vec4(aPosition, 0.0, 1.0);\n    }\n"
    )

    var blurShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      "\n    precision mediump float;\n    precision mediump sampler2D;\n\n    varying vec2 vUv;\n    varying vec2 vL;\n    varying vec2 vR;\n    uniform sampler2D uTexture;\n\n    void main () {\n        vec4 sum = texture2D(uTexture, vUv) * 0.29411764;\n        sum += texture2D(uTexture, vL) * 0.35294117;\n        sum += texture2D(uTexture, vR) * 0.35294117;\n        gl_FragColor = sum;\n    }\n"
    )

    var copyShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      "\n    precision mediump float;\n    precision mediump sampler2D;\n\n    varying highp vec2 vUv;\n    uniform sampler2D uTexture;\n\n    void main () {\n        gl_FragColor = texture2D(uTexture, vUv);\n    }\n"
    )

    var clearShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      "\n    precision mediump float;\n    precision mediump sampler2D;\n\n    varying highp vec2 vUv;\n    uniform sampler2D uTexture;\n    uniform float value;\n\n    void main () {\n        gl_FragColor = value * texture2D(uTexture, vUv);\n    }\n"
    )

    var colorShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      "\n    precision mediump float;\n\n    uniform vec4 color;\n\n    void main () {\n        gl_FragColor = color;\n    }\n"
    )

    var checkerboardShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      "\n    precision highp float;\n    precision highp sampler2D;\n\n    varying vec2 vUv;\n    uniform sampler2D uTexture;\n    uniform float aspectRatio;\n\n    #define SCALE 25.0\n\n    void main () {\n        vec2 uv = floor(vUv * SCALE * vec2(aspectRatio, 1.0));\n        float v = mod(uv.x + uv.y, 2.0);\n        v = v * 0.1 + 0.8;\n        gl_FragColor = vec4(vec3(v), 1.0);\n    }\n"
    )

    var displayShaderSource =
      "\n    precision highp float;\n    precision highp sampler2D;\n\n    varying vec2 vUv;\n    varying vec2 vL;\n    varying vec2 vR;\n    varying vec2 vT;\n    varying vec2 vB;\n    uniform sampler2D uTexture;\n    uniform sampler2D uBloom;\n    uniform sampler2D uSunrays;\n    uniform sampler2D uDithering;\n    uniform vec2 ditherScale;\n    uniform vec2 texelSize;\n\n    vec3 linearToGamma (vec3 color) {\n        color = max(color, vec3(0));\n        return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));\n    }\n\n    void main () {\n        vec3 c = texture2D(uTexture, vUv).rgb;\n\n    #ifdef SHADING\n        vec3 lc = texture2D(uTexture, vL).rgb;\n        vec3 rc = texture2D(uTexture, vR).rgb;\n        vec3 tc = texture2D(uTexture, vT).rgb;\n        vec3 bc = texture2D(uTexture, vB).rgb;\n\n        float dx = length(rc) - length(lc);\n        float dy = length(tc) - length(bc);\n\n        vec3 n = normalize(vec3(dx, dy, length(texelSize)));\n        vec3 l = vec3(0.0, 0.0, 1.0);\n\n        float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);\n        c *= diffuse;\n    #endif\n\n    #ifdef BLOOM\n        vec3 bloom = texture2D(uBloom, vUv).rgb;\n    #endif\n\n    #ifdef SUNRAYS\n        float sunrays = texture2D(uSunrays, vUv).r;\n        c *= sunrays;\n    #ifdef BLOOM\n        bloom *= sunrays;\n    #endif\n    #endif\n\n    #ifdef BLOOM\n        float noise = texture2D(uDithering, vUv * ditherScale).r;\n        noise = noise * 2.0 - 1.0;\n        bloom += noise / 255.0;\n        bloom = linearToGamma(bloom);\n        c += bloom;\n    #endif\n\n        float a = max(c.r, max(c.g, c.b));\n        gl_FragColor = vec4(c, a);\n    }\n"

    var bloomPrefilterShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      "\n    precision mediump float;\n    precision mediump sampler2D;\n\n    varying vec2 vUv;\n    uniform sampler2D uTexture;\n    uniform vec3 curve;\n    uniform float threshold;\n\n    void main () {\n        vec3 c = texture2D(uTexture, vUv).rgb;\n        float br = max(c.r, max(c.g, c.b));\n        float rq = clamp(br - curve.x, 0.0, curve.y);\n        rq = curve.z * rq * rq;\n        c *= max(rq, br - threshold) / max(br, 0.0001);\n        gl_FragColor = vec4(c, 0.0);\n    }\n"
    )

    var bloomBlurShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      "\n    precision mediump float;\n    precision mediump sampler2D;\n\n    varying vec2 vL;\n    varying vec2 vR;\n    varying vec2 vT;\n    varying vec2 vB;\n    uniform sampler2D uTexture;\n\n    void main () {\n        vec4 sum = vec4(0.0);\n        sum += texture2D(uTexture, vL);\n        sum += texture2D(uTexture, vR);\n        sum += texture2D(uTexture, vT);\n        sum += texture2D(uTexture, vB);\n        sum *= 0.25;\n        gl_FragColor = sum;\n    }\n"
    )

    var bloomFinalShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      "\n    precision mediump float;\n    precision mediump sampler2D;\n\n    varying vec2 vL;\n    varying vec2 vR;\n    varying vec2 vT;\n    varying vec2 vB;\n    uniform sampler2D uTexture;\n    uniform float intensity;\n\n    void main () {\n        vec4 sum = vec4(0.0);\n        sum += texture2D(uTexture, vL);\n        sum += texture2D(uTexture, vR);\n        sum += texture2D(uTexture, vT);\n        sum += texture2D(uTexture, vB);\n        sum *= 0.25;\n        gl_FragColor = sum * intensity;\n    }\n"
    )

    var sunraysMaskShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      "\n    precision highp float;\n    precision highp sampler2D;\n\n    varying vec2 vUv;\n    uniform sampler2D uTexture;\n\n    void main () {\n        vec4 c = texture2D(uTexture, vUv);\n        float br = max(c.r, max(c.g, c.b));\n        c.a = 1.0 - min(max(br * 20.0, 0.0), 0.8);\n        gl_FragColor = c;\n    }\n"
    )

    var sunraysShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      "\n    precision highp float;\n    precision highp sampler2D;\n\n    varying vec2 vUv;\n    uniform sampler2D uTexture;\n    uniform float weight;\n\n    #define ITERATIONS 16\n\n    void main () {\n        float Density = 0.3;\n        float Decay = 0.95;\n        float Exposure = 0.7;\n\n        vec2 coord = vUv;\n        vec2 dir = vUv - 0.5;\n\n        dir *= 1.0 / float(ITERATIONS) * Density;\n        float illuminationDecay = 1.0;\n\n        float color = texture2D(uTexture, vUv).a;\n\n        for (int i = 0; i < ITERATIONS; i++)\n        {\n            coord -= dir;\n            float col = texture2D(uTexture, coord).a;\n            color += col * illuminationDecay * weight;\n            illuminationDecay *= Decay;\n        }\n\n        gl_FragColor = vec4(color * Exposure, 0.0, 0.0, 1.0);\n    }\n"
    )

    var splatShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      "\n    precision highp float;\n    precision highp sampler2D;\n\n    varying vec2 vUv;\n    uniform sampler2D uTarget;\n    uniform float aspectRatio;\n    uniform vec3 color;\n    uniform vec2 point;\n    uniform float radius;\n\n    void main () {\n        vec2 p = vUv - point.xy;\n        p.x *= aspectRatio;\n        vec3 splat = exp(-dot(p, p) / radius) * color;\n        vec3 base = texture2D(uTarget, vUv).xyz;\n        gl_FragColor = vec4(base + splat, 1.0);\n    }\n"
    )

    var advectionShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      "\n    precision highp float;\n    precision highp sampler2D;\n\n    varying vec2 vUv;\n    uniform sampler2D uVelocity;\n    uniform sampler2D uSource;\n    uniform vec2 texelSize;\n    uniform vec2 dyeTexelSize;\n    uniform float dt;\n    uniform float dissipation;\n\n    vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {\n        vec2 st = uv / tsize - 0.5;\n\n        vec2 iuv = floor(st);\n        vec2 fuv = fract(st);\n\n        vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);\n        vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);\n        vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);\n        vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);\n\n        return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);\n    }\n\n    void main () {\n    #ifdef MANUAL_FILTERING\n        vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;\n        vec4 result = bilerp(uSource, coord, dyeTexelSize);\n    #else\n        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;\n        vec4 result = texture2D(uSource, coord);\n    #endif\n        float decay = 1.0 + dissipation * dt;\n        gl_FragColor = result / decay;\n    }",
      this.ext.supportLinearFiltering ? null : ["MANUAL_FILTERING"]
    )

    var divergenceShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      "\n    precision mediump float;\n    precision mediump sampler2D;\n\n    varying highp vec2 vUv;\n    varying highp vec2 vL;\n    varying highp vec2 vR;\n    varying highp vec2 vT;\n    varying highp vec2 vB;\n    uniform sampler2D uVelocity;\n\n    void main () {\n        float L = texture2D(uVelocity, vL).x;\n        float R = texture2D(uVelocity, vR).x;\n        float T = texture2D(uVelocity, vT).y;\n        float B = texture2D(uVelocity, vB).y;\n\n        vec2 C = texture2D(uVelocity, vUv).xy;\n        if (vL.x < 0.0) { L = -C.x; }\n        if (vR.x > 1.0) { R = -C.x; }\n        if (vT.y > 1.0) { T = -C.y; }\n        if (vB.y < 0.0) { B = -C.y; }\n\n        float div = 0.5 * (R - L + T - B);\n        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);\n    }\n"
    )

    var curlShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      "\n    precision mediump float;\n    precision mediump sampler2D;\n\n    varying highp vec2 vUv;\n    varying highp vec2 vL;\n    varying highp vec2 vR;\n    varying highp vec2 vT;\n    varying highp vec2 vB;\n    uniform sampler2D uVelocity;\n\n    void main () {\n        float L = texture2D(uVelocity, vL).y;\n        float R = texture2D(uVelocity, vR).y;\n        float T = texture2D(uVelocity, vT).x;\n        float B = texture2D(uVelocity, vB).x;\n        float vorticity = R - L - T + B;\n        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);\n    }\n"
    )

    var vorticityShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      "\n    precision highp float;\n    precision highp sampler2D;\n\n    varying vec2 vUv;\n    varying vec2 vL;\n    varying vec2 vR;\n    varying vec2 vT;\n    varying vec2 vB;\n    uniform sampler2D uVelocity;\n    uniform sampler2D uCurl;\n    uniform float curl;\n    uniform float dt;\n\n    void main () {\n        float L = texture2D(uCurl, vL).x;\n        float R = texture2D(uCurl, vR).x;\n        float T = texture2D(uCurl, vT).x;\n        float B = texture2D(uCurl, vB).x;\n        float C = texture2D(uCurl, vUv).x;\n\n        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));\n        force /= length(force) + 0.0001;\n        force *= curl * C;\n        force.y *= -1.0;\n\n        vec2 vel = texture2D(uVelocity, vUv).xy;\n        gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);\n    }\n"
    )

    var pressureShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      "\n    precision mediump float;\n    precision mediump sampler2D;\n\n    varying highp vec2 vUv;\n    varying highp vec2 vL;\n    varying highp vec2 vR;\n    varying highp vec2 vT;\n    varying highp vec2 vB;\n    uniform sampler2D uPressure;\n    uniform sampler2D uDivergence;\n\n    void main () {\n        float L = texture2D(uPressure, vL).x;\n        float R = texture2D(uPressure, vR).x;\n        float T = texture2D(uPressure, vT).x;\n        float B = texture2D(uPressure, vB).x;\n        float C = texture2D(uPressure, vUv).x;\n        float divergence = texture2D(uDivergence, vUv).x;\n        float pressure = (L + R + B + T - divergence) * 0.25;\n        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);\n    }\n"
    )

    var gradientSubtractShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      "\n    precision mediump float;\n    precision mediump sampler2D;\n\n    varying highp vec2 vUv;\n    varying highp vec2 vL;\n    varying highp vec2 vR;\n    varying highp vec2 vT;\n    varying highp vec2 vB;\n    uniform sampler2D uPressure;\n    uniform sampler2D uVelocity;\n\n    void main () {\n        float L = texture2D(uPressure, vL).x;\n        float R = texture2D(uPressure, vR).x;\n        float T = texture2D(uPressure, vT).x;\n        float B = texture2D(uPressure, vB).x;\n        vec2 velocity = texture2D(uVelocity, vUv).xy;\n        this.velocity.xy -= vec2(R - L, T - B);\n        gl_FragColor = vec4(velocity, 0.0, 1.0);\n    }\n"
    )

    var blit = (function() {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer())
      this.gl.bufferData(
        this.gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
        this.gl.STATIC_DRAW
      )
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.gl.createBuffer())
      this.gl.bufferData(
        this.gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array([0, 1, 2, 0, 2, 3]),
        this.gl.STATIC_DRAW
      )
      this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 0, 0)
      this.gl.enableVertexAttribArray(0)

      return function(destination) {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, destination)
        this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0)
      }
    })()

    var dye
    var velocity
    var divergence
    var curl
    var pressure
    var bloom
    this.bloomFramebuffers = []
    var sunrays
    var sunraysTemp

    var ditheringTexture = this.createTextureAsync("./assets/scripts/LDR_LLL1_0.png")

    var Program = function Program(vertexShader, fragmentShader) {
      this.uniforms = {}
      this.program = this.createProgram(vertexShader, fragmentShader)
      this.uniforms = this.getUniforms(this.program)
    }

    Program.prototype.bind = function bind() {
      this.gl.useProgram(this.program)
    }

    var blurProgram = new Program(blurVertexShader, blurShader)
    var copyProgram = new Program(baseVertexShader, copyShader)
    var clearProgram = new Program(baseVertexShader, clearShader)
    var colorProgram = new Program(baseVertexShader, colorShader)
    var checkerboardProgram = new Program(baseVertexShader, checkerboardShader)
    var bloomPrefilterProgram = new Program(
      baseVertexShader,
      bloomPrefilterShader
    )
    var bloomBlurProgram = new Program(baseVertexShader, bloomBlurShader)
    var bloomFinalProgram = new Program(baseVertexShader, bloomFinalShader)
    var sunraysMaskProgram = new Program(baseVertexShader, sunraysMaskShader)
    var sunraysProgram = new Program(baseVertexShader, sunraysShader)
    var splatProgram = new Program(baseVertexShader, splatShader)
    var advectionProgram = new Program(baseVertexShader, advectionShader)
    var divergenceProgram = new Program(baseVertexShader, divergenceShader)
    var curlProgram = new Program(baseVertexShader, curlShader)
    var vorticityProgram = new Program(baseVertexShader, vorticityShader)
    var pressureProgram = new Program(baseVertexShader, pressureShader)
    var gradienSubtractProgram = new Program(
      baseVertexShader,
      gradientSubtractShader
    )

    var displayMaterial = new Material(baseVertexShader, displayShaderSource)

    var Material = function Material(vertexShader, fragmentShaderSource) {
      this.vertexShader = vertexShader
      this.fragmentShaderSource = fragmentShaderSource
      this.programs = []
      this.activeProgram = null
      this.uniforms = []
    }

    Material.prototype.setKeywords = function setKeywords(keywords) {
      var hash = 0
      for (var i = 0; i < keywords.length; i++) {
        hash += this.hashCode(keywords[i])
      }

      var program = this.programs[hash]
      if (program === null) {
        var fragmentShader = this.compileShader(
          this.gl.FRAGMENT_SHADER,
          this.fragmentShaderSource,
          keywords
        )
        program = this.createProgram(this.vertexShader, fragmentShader)
        this.programs[hash] = program
      }

      if (program === this.activeProgram) {
        return
      }

      this.uniforms = this.getUniforms(program)
      this.activeProgram = program
    }

    Material.prototype.bind = function bind() {
      this.gl.useProgram(this.activeProgram)
    }

    this.updateKeywords()
    this.initFramebuffers()
    this.multipleSplats(parseInt(Math.random() * 20) + 5)

    var lastUpdateTime = Date.now()
    var colorUpdateTimer = 0.0

    this.update()
  }

  initialize() {
    var pointers = []
    var splatStack = []
    pointers.push(new pointerPrototype())

    var ref = this.getWebGLContext(this.canvas)
    this.gl = ref.gl
    this.ext = ref.ext

    if (this.isMobile()) {
      this.config.DYE_RESOLUTION = 512
    }
    if (!this.ext.supportLinearFiltering) {
      this.config.DYE_RESOLUTION = 512
      this.config.SHADING = false
      this.config.BLOOM = false
      this.config.SUNRAYS = false
    }
  }

  getWebGLContext(canvas) {
    var params = {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    }

    var gl = canvas.getContext("webgl2", params)
    var isWebGL2 = !!gl
    if (!isWebGL2) {
      gl =
        canvas.getContext("webgl", params) ||
        canvas.getContext("experimental-webgl", params)
    }

    var halfFloat
    var supportLinearFiltering
    if (isWebGL2) {
      this.gl.getExtension("EXT_color_buffer_float")
      supportLinearFiltering = this.gl.getExtension("OES_texture_float_linear")
    } else {
      halfFloat = this.gl.getExtension("OES_texture_half_float")
      supportLinearFiltering = this.gl.getExtension(
        "OES_texture_half_float_linear"
      )
    }

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0)

    var halfFloatTexType = isWebGL2
      ? this.gl.HALF_FLOAT
      : halfFloat.HALF_FLOAT_OES
    var formatRGBA
    var formatRG
    var formatR

    if (isWebGL2) {
      formatRGBA = this.getSupportedFormat(
        gl,
        this.gl.RGBA16F,
        this.gl.RGBA,
        halfFloatTexType
      )
      formatRG = this.getSupportedFormat(
        gl,
        this.gl.RG16F,
        this.gl.RG,
        halfFloatTexType
      )
      formatR = this.getSupportedFormat(
        gl,
        this.gl.R16F,
        this.gl.RED,
        halfFloatTexType
      )
    } else {
      formatRGBA = this.getSupportedFormat(
        gl,
        this.gl.RGBA,
        this.gl.RGBA,
        halfFloatTexType
      )
      formatRG = this.getSupportedFormat(
        gl,
        this.gl.RGBA,
        this.gl.RGBA,
        halfFloatTexType
      )
      formatR = this.getSupportedFormat(
        gl,
        this.gl.RGBA,
        this.gl.RGBA,
        halfFloatTexType
      )
    }

    //ga('send', 'event', isWebGL2 ? 'webgl2' : 'webgl', formatRGBA === null ? 'not supported' : 'supported');

    return {
      gl: gl,
      ext: {
        formatRGBA: formatRGBA,
        formatRG: formatRG,
        formatR: formatR,
        halfFloatTexType: halfFloatTexType,
        supportLinearFiltering: supportLinearFiltering,
      },
    }
  }

  getSupportedFormat(gl, internalFormat, format, type) {
    if (!this.supportRenderTextureFormat(gl, internalFormat, format, type)) {
      switch (internalFormat) {
        case this.gl.R16F:
          return this.getSupportedFormat(gl, this.gl.RG16F, this.gl.RG, type)
        case this.gl.RG16F:
          return this.getSupportedFormat(
            gl,
            this.gl.RGBA16F,
            this.gl.RGBA,
            type
          )
        default:
          return null
      }
    }

    return {
      internalFormat: internalFormat,
      format: format,
    }
  }

  supportRenderTextureFormat(gl, internalFormat, format, type) {
    var texture = this.gl.createTexture()
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.NEAREST
    )
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      this.gl.NEAREST
    )
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      this.gl.CLAMP_TO_EDGE
    )
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      this.gl.CLAMP_TO_EDGE
    )
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      internalFormat,
      4,
      4,
      0,
      format,
      type,
      null
    )

    var fbo = this.gl.createFramebuffer()
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fbo)
    this.gl.framebufferTexture2D(
      this.gl.FRAMEBUFFER,
      this.gl.COLOR_ATTACHMENT0,
      this.gl.TEXTURE_2D,
      texture,
      0
    )

    var status = this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER)
    return status === this.gl.FRAMEBUFFER_COMPLETE
  }

  isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent)
  }

  createProgram(vertexShader, fragmentShader) {
    var program = this.gl.createProgram()
    this.gl.attachShader(program, vertexShader)
    this.gl.attachShader(program, fragmentShader)
    this.gl.linkProgram(program)

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      throw this.gl.getProgramInfoLog(program)
    }

    return program
  }

  getUniforms(program) {
    var uniforms = []
    var uniformCount = this.gl.getProgramParameter(
      program,
      this.gl.ACTIVE_UNIFORMS
    )
    for (var i = 0; i < uniformCount; i++) {
      var uniformName = this.gl.getActiveUniform(program, i).name
      uniforms[uniformName] = this.gl.getUniformLocation(program, uniformName)
    }
    return uniforms
  }

  compileShader(type, source, keywords) {
    source = this.addKeywords(source, keywords)

    var shader = this.gl.createShader(type)
    this.gl.shaderSource(shader, source)
    this.gl.compileShader(shader)

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      throw this.gl.getShaderInfoLog(shader)
    }

    return shader
  }

  addKeywords(source, keywords) {
    if (keywords === null) {
      return source
    }
    var keywordsString = ""
    keywords.forEach(function(keyword) {
      keywordsString += "#define " + keyword + "\n"
    })
    return keywordsString + source
  }

  initFramebuffers() {
    var simRes = this.getResolution(this.config.SIM_RESOLUTION)
    var dyeRes = this.getResolution(this.config.DYE_RESOLUTION)

    var texType = this.ext.halfFloatTexType
    var rgba = this.ext.formatRGBA
    var rg = this.ext.formatRG
    var r = this.ext.formatR
    var filtering = this.ext.supportLinearFiltering
      ? this.gl.LINEAR
      : this.gl.NEAREST

    if (this.dye === null) {
      this.dye = this.createDoubleFBO(
        dyeRes.width,
        dyeRes.height,
        rgba.internalFormat,
        rgba.format,
        texType,
        filtering
      )
    } else {
      this.dye = this.resizeDoubleFBO(
        this.dye,
        dyeRes.width,
        dyeRes.height,
        rgba.internalFormat,
        rgba.format,
        texType,
        filtering
      )
    }

    if (this.velocity === null) {
      this.velocity = this.createDoubleFBO(
        simRes.width,
        simRes.height,
        rg.internalFormat,
        rg.format,
        texType,
        filtering
      )
    } else {
      this.velocity = this.resizeDoubleFBO(
        this.velocity,
        simRes.width,
        simRes.height,
        rg.internalFormat,
        rg.format,
        texType,
        filtering
      )
    }

    this.divergence = this.createFBO(
      simRes.width,
      simRes.height,
      r.internalFormat,
      r.format,
      texType,
      this.gl.NEAREST
    )
    this.curl = this.createFBO(
      simRes.width,
      simRes.height,
      r.internalFormat,
      r.format,
      texType,
      this.gl.NEAREST
    )
    this.pressure = this.createDoubleFBO(
      simRes.width,
      simRes.height,
      r.internalFormat,
      r.format,
      texType,
      this.gl.NEAREST
    )

    this.initBloomFramebuffers()
    this.initSunraysFramebuffers()
  }

  initBloomFramebuffers() {
    var res = this.getResolution(this.config.BLOOM_RESOLUTION)

    var texType = this.ext.halfFloatTexType
    var rgba = this.ext.formatRGBA
    var filtering = this.ext.supportLinearFiltering
      ? this.gl.LINEAR
      : this.gl.NEAREST

      this.bloom = this.createFBO(
      res.width,
      res.height,
      rgba.internalFormat,
      rgba.format,
      texType,
      filtering
    )

    this.this.bloomFramebuffers.length = 0
    for (var i = 0; i < this.config.BLOOM_ITERATIONS; i++) {
      var width = res.width >> (i + 1)
      var height = res.height >> (i + 1)

      if (width < 2 || height < 2) {
        break
      }

      var fbo = this.createFBO(
        width,
        height,
        rgba.internalFormat,
        rgba.format,
        texType,
        filtering
      )
      this.this.bloomFramebuffers.push(fbo)
    }
  }

  initSunraysFramebuffers() {
    var res = this.getResolution(this.config.SUNRAYS_RESOLUTION)

    var texType = this.ext.halfFloatTexType
    var r = this.ext.formatR
    var filtering = this.ext.supportLinearFiltering
      ? this.gl.LINEAR
      : this.gl.NEAREST

      this.sunrays = this.createFBO(
      res.width,
      res.height,
      r.internalFormat,
      r.format,
      texType,
      filtering
    )
    this.sunraysTemp = this.createFBO(
      res.width,
      res.height,
      r.internalFormat,
      r.format,
      texType,
      filtering
    )
  }

  createFBO(w, h, internalFormat, format, type, param) {
    this.gl.activeTexture(this.gl.TEXTURE0)
    var texture = this.gl.createTexture()
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, param)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, param)
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      this.gl.CLAMP_TO_EDGE
    )
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      this.gl.CLAMP_TO_EDGE
    )
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      internalFormat,
      w,
      h,
      0,
      format,
      type,
      null
    )

    var fbo = this.gl.createFramebuffer()
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fbo)
    this.gl.framebufferTexture2D(
      this.gl.FRAMEBUFFER,
      this.gl.COLOR_ATTACHMENT0,
      this.gl.TEXTURE_2D,
      texture,
      0
    )
    this.gl.viewport(0, 0, w, h)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)

    var texelSizeX = 1.0 / w
    var texelSizeY = 1.0 / h

    return {
      texture: texture,
      fbo: fbo,
      width: w,
      height: h,
      texelSizeX: texelSizeX,
      texelSizeY: texelSizeY,
      attach: function attach(id) {
        this.gl.activeTexture(this.gl.TEXTURE0 + id)
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
        return id
      },
    }
  }

  createDoubleFBO(w, h, internalFormat, format, type, param) {
    var fbo1 = this.createFBO(w, h, internalFormat, format, type, param)
    var fbo2 = this.createFBO(w, h, internalFormat, format, type, param)

    return {
      width: w,
      height: h,
      texelSizeX: fbo1.texelSizeX,
      texelSizeY: fbo1.texelSizeY,
      get read() {
        return fbo1
      },
      set read(value) {
        fbo1 = value
      },
      get write() {
        return fbo2
      },
      set write(value) {
        fbo2 = value
      },
      swap: function swap() {
        var temp = fbo1
        fbo1 = fbo2
        fbo2 = temp
      },
    }
  }

  resizeFBO(target, w, h, internalFormat, format, type, param) {
    var newFBO = this.createFBO(w, h, internalFormat, format, type, param)
    this.copyProgram.bind()
    this.gl.uniform1i(this.copyProgram.uniforms.uTexture, target.attach(0))
    this.blit(newFBO.fbo)
    return newFBO
  }

  resizeDoubleFBO(target, w, h, internalFormat, format, type, param) {
    if (target.width === w && target.height === h) {
      return target
    }
    target.read = this.resizeFBO(
      target.read,
      w,
      h,
      internalFormat,
      format,
      type,
      param
    )
    target.write = this.createFBO(w, h, internalFormat, format, type, param)
    target.width = w
    target.height = h
    target.texelSizeX = 1.0 / w
    target.texelSizeY = 1.0 / h
    return target
  }

  createTextureAsync(url) {
    var texture = this.gl.createTexture()
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.LINEAR
    )
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      this.gl.LINEAR
    )
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      this.gl.REPEAT
    )
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      this.gl.REPEAT
    )
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGB,
      1,
      1,
      0,
      this.gl.RGB,
      this.gl.UNSIGNED_BYTE,
      new Uint8Array([255, 255, 255])
    )

    var obj = {
      texture: texture,
      width: 1,
      height: 1,
      attach: function attach(id) {
        this.gl.activeTexture(this.gl.TEXTURE0 + id)
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
        return id
      },
    }

    var image = new Image()
    image.onload = function() {
      obj.width = image.width
      obj.height = image.height
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGB,
        this.gl.RGB,
        this.gl.UNSIGNED_BYTE,
        image
      )
    }
    image.src = url

    return obj
  }

  updateKeywords() {
    var displayKeywords = []
    if (this.config.SHADING) {
      displayKeywords.push("SHADING")
    }
    if (this.config.BLOOM) {
      displayKeywords.push("BLOOM")
    }
    if (this.config.SUNRAYS) {
      displayKeywords.push("SUNRAYS")
    }
    this.displayMaterial.setKeywords(displayKeywords)
  }

  update() {
    var dt = this.calcDeltaTime()
    if (this.resizeCanvas()) {
      this.initFramebuffers()
    }
    this.updateColors(dt)
    this.applyInputs()
    if (!this.config.PAUSED) {
      this.step(dt)
    }
    this.render(null)
    this.requestAnimationFrame(this.update)
  }

  calcDeltaTime() {
    var now = Date.now()
    var dt = (now - this.lastUpdateTime) / 1000
    dt = Math.min(dt, 0.016666)
    this.lastUpdateTime = now
    return dt
  }

  resizeCanvas() {
    var width = this.scaleByPixelRatio(this.canvas.clientWidth)
    var height = this.scaleByPixelRatio(this.canvas.clientHeight)
    if (this.canvas.width != width || this.canvas.height != height) {
      this.canvas.width = width
      this.canvas.height = height
      return true
    }
    return false
  }

  updateColors(dt) {
    if (!this.config.COLORFUL) {
      return
    }

    this.colorUpdateTimer += dt * this.config.COLOR_UPDATE_SPEED
    if (this.colorUpdateTimer >= 1) {
      this.colorUpdateTimer = this.wrap(this.colorUpdateTimer, 0, 1)
      this.pointers.forEach(function(p) {
        p.color = this.generateColor()
      })
    }
  }

  applyInputs() {
    if (this.splatStack.length > 0) {
      this.multipleSplats(this.splatStack.pop())
    }

    this.pointers.forEach(function(p) {
      if (p.moved) {
        p.moved = false
        this.splatPointer(p)
      }
    })
  }

  step(dt) {
    this.gl.disable(this.gl.BLEND)
    this.gl.viewport(0, 0, this.velocity.width, this.velocity.height)

    this.curlProgram.bind()
    this.gl.uniform2f(
      this.curlProgram.uniforms.texelSize,
      this.velocity.texelSizeX,
      this.velocity.texelSizeY
    )
    this.gl.uniform1i(this.curlProgram.uniforms.uVelocity, this.velocity.read.attach(0))
    this.blit(this.curl.fbo)

    this.vorticityProgram.bind()
    this.gl.uniform2f(
      this.vorticityProgram.uniforms.texelSize,
      this.velocity.texelSizeX,
      this.velocity.texelSizeY
    )
    this.gl.uniform1i(
      this.vorticityProgram.uniforms.uVelocity,
      this.velocity.read.attach(0)
    )
    this.gl.uniform1i(this.vorticityProgram.uniforms.uCurl, this.curl.attach(1))
    this.gl.uniform1f(this.vorticityProgram.uniforms.curl, this.config.CURL)
    this.gl.uniform1f(this.vorticityProgram.uniforms.dt, dt)
    this.blit(this.velocity.write.fbo)
    this.velocity.swap()

    this.divergenceProgram.bind()
    this.gl.uniform2f(
      this.divergenceProgram.uniforms.texelSize,
      this.velocity.texelSizeX,
      this.velocity.texelSizeY
    )
    this.gl.uniform1i(
      this.divergenceProgram.uniforms.uVelocity,
      this.velocity.read.attach(0)
    )
    this.blit(this.divergence.fbo)

    this.clearProgram.bind()
    this.gl.uniform1i(this.clearProgram.uniforms.uTexture, this.pressure.read.attach(0))
    this.gl.uniform1f(this.clearProgram.uniforms.value, this.config.PRESSURE)
    this.blit(this.pressure.write.fbo)
    this.pressure.swap()

    this.pressureProgram.bind()
    this.gl.uniform2f(
      this.pressureProgram.uniforms.texelSize,
      this.velocity.texelSizeX,
      this.velocity.texelSizeY
    )
    this.gl.uniform1i(
      this.pressureProgram.uniforms.uDivergence,
      this.divergence.attach(0)
    )
    for (var i = 0; i < this.config.PRESSURE_ITERATIONS; i++) {
      this.gl.uniform1i(
        this.pressureProgram.uniforms.uPressure,
        this.pressure.read.attach(1)
      )
      this.blit(this.pressure.write.fbo)
      this.pressure.swap()
    }

    this.gradienSubtractProgram.bind()
    this.gl.uniform2f(
      this.gradienSubtractProgram.uniforms.texelSize,
      this.velocity.texelSizeX,
      this.velocity.texelSizeY
    )
    this.gl.uniform1i(
      this.gradienSubtractProgram.uniforms.uPressure,
      this.pressure.read.attach(0)
    )
    this.gl.uniform1i(
      this.gradienSubtractProgram.uniforms.uVelocity,
      this.velocity.read.attach(1)
    )
    this.blit(this.velocity.write.fbo)
    this.velocity.swap()

    this.advectionProgram.bind()
    this.gl.uniform2f(
      this.advectionProgram.uniforms.texelSize,
      this.velocity.texelSizeX,
      this.velocity.texelSizeY
    )
    if (!this.ext.supportLinearFiltering) {
      this.gl.uniform2f(
        this.advectionProgram.uniforms.dyeTexelSize,
        this.velocity.texelSizeX,
        this.velocity.texelSizeY
      )
    }
    var velocityId = this.velocity.read.attach(0)
    this.gl.uniform1i(this.advectionProgram.uniforms.uVelocity, velocityId)
    this.gl.uniform1i(this.advectionProgram.uniforms.uSource, velocityId)
    this.gl.uniform1f(this.advectionProgram.uniforms.dt, dt)
    this.gl.uniform1f(
      this.advectionProgram.uniforms.dissipation,
      this.config.VELOCITY_DISSIPATION
    )
    this.blit(this.velocity.write.fbo)
    this.velocity.swap()

    this.gl.viewport(0, 0, this.dye.width, this.dye.height)

    if (!this.ext.supportLinearFiltering) {
      this.gl.uniform2f(
        this.advectionProgram.uniforms.dyeTexelSize,
        this.dye.texelSizeX,
        this.dye.texelSizeY
      )
    }
    this.gl.uniform1i(
      this.advectionProgram.uniforms.uVelocity,
      this.velocity.read.attach(0)
    )
    this.gl.uniform1i(this.advectionProgram.uniforms.uSource, this.dye.read.attach(1))
    this.gl.uniform1f(
      this.advectionProgram.uniforms.dissipation,
      this.config.DENSITY_DISSIPATION
    )
    this.blit(this.dye.write.fbo)
    this.dye.swap()
  }

  render(target) {
    if (this.config.BLOOM) {
      this.applyBloom(this.dye.read, this.bloom)
    }
    if (this.config.SUNRAYS) {
      this.applySunrays(this.dye.read, this.dye.write, this.sunrays)
      this.blur(this.sunrays, this.sunraysTemp, 1)
    }

    if (target === null || !this.config.TRANSPARENT) {
      this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA)
      this.gl.enable(this.gl.BLEND)
    } else {
      this.gl.disable(this.gl.BLEND)
    }

    var width = target === null ? this.gl.drawingBufferWidth : target.width
    var height = target === null ? this.gl.drawingBufferHeight : target.height
    this.gl.viewport(0, 0, width, height)

    var fbo = target === null ? null : target.fbo
    if (!this.config.TRANSPARENT) {
      this.drawColor(fbo, this.normalizeColor(this.config.BACK_COLOR))
    }
    if (target === null && this.config.TRANSPARENT) {
      this.drawCheckerboard(fbo)
    }
    this.drawDisplay(fbo, width, height)
  }

  drawColor(fbo, color) {
    this.colorProgram.bind()
    this.gl.uniform4f(this.colorProgram.uniforms.color, color.r, color.g, color.b, 1)
    this.blit(fbo)
  }

  drawCheckerboard(fbo) {
    this.checkerboardProgram.bind()
    this.gl.uniform1f(
      this.checkerboardProgram.uniforms.aspectRatio,
      this.canvas.width / this.canvas.height
    )
    this.blit(fbo)
  }

  drawDisplay(fbo, width, height) {
    this.displayMaterial.bind()
    if (this.config.SHADING) {
      this.gl.uniform2f(
        this.displayMaterial.uniforms.texelSize,
        1.0 / width,
        1.0 / height
      )
    }
    this.gl.uniform1i(this.displayMaterial.uniforms.uTexture, this.dye.read.attach(0))
    if (this.config.BLOOM) {
      this.gl.uniform1i(this.displayMaterial.uniforms.uBloom, this.bloom.attach(1))
      this.gl.uniform1i(
        this.displayMaterial.uniforms.uDithering,
        this.ditheringTexture.attach(2)
      )
      var scale = this.getTextureScale(this.ditheringTexture, width, height)
      this.gl.uniform2f(this.displayMaterial.uniforms.ditherScale, scale.x, scale.y)
    }
    if (this.config.SUNRAYS) {
      this.gl.uniform1i(this.displayMaterial.uniforms.uSunrays, this.sunrays.attach(3))
    }
    this.blit(fbo)
  }

  applyBloom(source, destination) {
    if (this.bloomFramebuffers.length < 2) {
      return
    }

    var last = destination

    this.gl.disable(this.gl.BLEND)
    this.bloomPrefilterProgram.bind()
    var knee =
      this.config.BLOOM_THRESHOLD * this.config.BLOOM_SOFT_KNEE + 0.0001
    var curve0 = this.config.BLOOM_THRESHOLD - knee
    var curve1 = knee * 2
    var curve2 = 0.25 / knee
    this.gl.uniform3f(
      this.bloomPrefilterProgram.uniforms.curve,
      curve0,
      curve1,
      curve2
    )
    this.gl.uniform1f(
      this.bloomPrefilterProgram.uniforms.threshold,
      this.config.BLOOM_THRESHOLD
    )
    this.gl.uniform1i(this.bloomPrefilterProgram.uniforms.uTexture, source.attach(0))
    this.gl.viewport(0, 0, last.width, last.height)
    this.blit(last.fbo)

    this.bloomthis.BlurProgram.bind()
    for (var i = 0; i < this.bloomFramebuffers.length; i++) {
      var dest = this.bloomFramebuffers[i]
      this.gl.uniform2f(
        this.bloomthis.BlurProgram.uniforms.texelSize,
        last.texelSizeX,
        last.texelSizeY
      )
      this.gl.uniform1i(this.bloomthis.BlurProgram.uniforms.uTexture, last.attach(0))
      this.gl.viewport(0, 0, dest.width, dest.height)
      this.blit(dest.fbo)
      last = dest
    }

    this.gl.blendFunc(this.gl.ONE, this.gl.ONE)
    this.gl.enable(this.gl.BLEND)

    for (var i$1 = this.bloomFramebuffers.length - 2; i$1 >= 0; i$1--) {
      var baseTex = this.bloomFramebuffers[i$1]
      this.gl.uniform2f(
        this.bloomthis.BlurProgram.uniforms.texelSize,
        last.texelSizeX,
        last.texelSizeY
      )
      this.gl.uniform1i(this.bloomthis.BlurProgram.uniforms.uTexture, last.attach(0))
      this.gl.viewport(0, 0, baseTex.width, baseTex.height)
      this.blit(baseTex.fbo)
      last = baseTex
    }

    this.gl.disable(this.gl.BLEND)
    this.bloomFinalProgram.bind()
    this.gl.uniform2f(
      this.bloomFinalProgram.uniforms.texelSize,
      last.texelSizeX,
      last.texelSizeY
    )
    this.gl.uniform1i(this.bloomFinalProgram.uniforms.uTexture, last.attach(0))
    this.gl.uniform1f(
      this.bloomFinalProgram.uniforms.intensity,
      this.config.BLOOM_INTENSITY
    )
    this.gl.viewport(0, 0, destination.width, destination.height)
    this.blit(destination.fbo)
  }

  applySunrays(source, mask, destination) {
    this.gl.disable(this.gl.BLEND)
    this.sunraysMaskProgram.bind()
    this.gl.uniform1i(this.sunraysMaskProgram.uniforms.uTexture, source.attach(0))
    this.gl.viewport(0, 0, mask.width, mask.height)
    this.blit(mask.fbo)

    this.sunraysProgram.bind()
    this.gl.uniform1f(
      this.sunraysProgram.uniforms.weight,
      this.config.SUNRAYS_WEIGHT
    )
    this.gl.uniform1i(this.sunraysProgram.uniforms.uTexture, mask.attach(0))
    this.gl.viewport(0, 0, destination.width, destination.height)
    this.blit(destination.fbo)
  }

  blur(target, temp, iterations) {
    this.blurProgram.bind()
    for (var i = 0; i < iterations; i++) {
      this.gl.uniform2f(this.blurProgram.uniforms.texelSize, target.texelSizeX, 0.0)
      this.gl.uniform1i(this.blurProgram.uniforms.uTexture, target.attach(0))
      this.blit(temp.fbo)

      this.gl.uniform2f(this.blurProgram.uniforms.texelSize, 0.0, target.texelSizeY)
      this.gl.uniform1i(this.blurProgram.uniforms.uTexture, temp.attach(0))
      this.blit(target.fbo)
    }
  }

  splatPointer(pointer) {
    var dx = pointer.deltaX * this.config.SPLAT_FORCE
    var dy = pointer.deltaY * this.config.SPLAT_FORCE
    this.splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color)
  }

  multipleSplats(amount) {
    for (var i = 0; i < amount; i++) {
      var color = this.generateColor()
      color.r *= 10.0
      color.g *= 10.0
      color.b *= 10.0
      var x = Math.random()
      var y = Math.random()
      var dx = 1000 * (Math.random() - 0.5)
      var dy = 1000 * (Math.random() - 0.5)
      this.splat(x, y, dx, dy, color)
    }
  }

  splat(x, y, dx, dy, color) {
    this.gl.viewport(0, 0, this.velocity.width, this.velocity.height)
    this.splatProgram.bind()
    this.gl.uniform1i(this.splatProgram.uniforms.uTarget, this.velocity.read.attach(0))
    this.gl.uniform1f(
      this.splatProgram.uniforms.aspectRatio,
      this.canvas.width / this.canvas.height
    )
    this.gl.uniform2f(this.splatProgram.uniforms.point, x, y)
    this.gl.uniform3f(this.splatProgram.uniforms.color, dx, dy, 0.0)
    this.gl.uniform1f(
      this.splatProgram.uniforms.radius,
      this.correctRadius(this.config.SPLAT_RADIUS / 100.0)
    )
    this.blit(this.velocity.write.fbo)
    this.velocity.swap()

    this.gl.viewport(0, 0, this.dye.width, this.dye.height)
    this.gl.uniform1i(this.splatProgram.uniforms.uTarget, this.dye.read.attach(0))
    this.gl.uniform3f(this.splatProgram.uniforms.color, color.r, color.g, color.b)
    this.blit(this.dye.write.fbo)
    this.dye.swap()
  }

  correctRadius(radius) {
    var aspectRatio = this.canvas.width / this.canvas.height
    if (aspectRatio > 1) {
      radius *= aspectRatio
    }
    return radius
  }

  updatePointerDownData(pointer, id, posX, posY) {
    pointer.id = id
    pointer.down = true
    pointer.moved = false
    pointer.texcoordX = posX / this.canvas.width
    pointer.texcoordY = 1.0 - posY / this.canvas.height
    pointer.prevTexcoordX = pointer.texcoordX
    pointer.prevTexcoordY = pointer.texcoordY
    pointer.deltaX = 0
    pointer.deltaY = 0
    pointer.color = this.generateColor()
  }

  updatePointerMoveData(pointer, posX, posY) {
    pointer.prevTexcoordX = pointer.texcoordX
    pointer.prevTexcoordY = pointer.texcoordY
    pointer.texcoordX = posX / this.canvas.width
    pointer.texcoordY = 1.0 - posY / this.canvas.height
    pointer.deltaX = this.correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX)
    pointer.deltaY = this.correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY)
    pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0
  }

  updatePointerUpData(pointer) {
    pointer.down = false
  }

  correctDeltaX(delta) {
    var aspectRatio = this.canvas.width / this.canvas.height
    if (aspectRatio < 1) {
      delta *= aspectRatio
    }
    return delta
  }

  correctDeltaY(delta) {
    var aspectRatio = this.canvas.width / this.canvas.height
    if (aspectRatio > 1) {
      delta /= aspectRatio
    }
    return delta
  }

  generateColor() {
    var c = this.HSVtoRGB(Math.random(), 1.0, 1.0)
    c.r *= 0.15
    c.g *= 0.15
    c.b *= 0.15
    return c
  }

  HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t
    i = Math.floor(h * 6)
    f = h * 6 - i
    p = v * (1 - s)
    q = v * (1 - f * s)
    t = v * (1 - (1 - f) * s)

    switch (i % 6) {
      case 0:
        r = v
        g = t
        b = p
        break
      case 1:
        r = q
        g = v
        b = p
        break
      case 2:
        r = p
        g = v
        b = t
        break
      case 3:
        r = p
        g = q
        b = v
        break
      case 4:
        r = t
        g = p
        b = v
        break
      case 5:
        r = v
        g = p
        b = q
        break
    }

    return {
      r: r,
      g: g,
      b: b,
    }
  }

  normalizeColor(input) {
    var output = {
      r: input.r / 255,
      g: input.g / 255,
      b: input.b / 255,
    }
    return output
  }

  wrap(value, min, max) {
    var range = max - min
    if (range === 0) {
      return min
    }
    return ((value - min) % range) + min
  }

  getResolution(resolution) {
    var aspectRatio = this.gl.drawingBufferWidth / this.gl.drawingBufferHeight
    if (aspectRatio < 1) {
      aspectRatio = 1.0 / aspectRatio
    }

    var min = Math.round(resolution)
    var max = Math.round(resolution * aspectRatio)

    if (this.gl.drawingBufferWidth > this.gl.drawingBufferHeight) {
      return { width: max, height: min }
    } else {
      return { width: min, height: max }
    }
  }

  getTextureScale(texture, width, height) {
    return {
      x: width / texture.width,
      y: height / texture.height,
    }
  }

  scaleByPixelRatio(input) {
    var pixelRatio = window.devicePixelRatio || 1
    return Math.floor(input * pixelRatio)
  }

  hashCode(s) {
    if (s.length === 0) {
      return 0
    }
    var hash = 0
    for (var i = 0; i < s.length; i++) {
      hash = (hash << 5) - hash + s.charCodeAt(i)
      hash |= 0 // Convert to 32bit integer
    }
    return hash
  }
}
