import './style.css'
import * as THREE from "three"
import * as dat from "dat.gui"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

import vs_plane from './shader/vs_plane.vert?raw'
import fs_plane from './shader/fs_plane.frag?raw'

  export class Sketch {
    private renderer: THREE.WebGLRenderer
    private scene: THREE.Scene
    private container: HTMLElement
    private width: number
    private height: number
    private camera: THREE.PerspectiveCamera
    private controls: OrbitControls
    private time: number
    private imageAspect: number
    private isPlaying: boolean
    private mat_plane: THREE.ShaderMaterial
    private geo_plane: THREE.PlaneGeometry
    private msh_plane: THREE.Mesh
    private gui: dat.GUI
    private gltf_loader: GLTFLoader
    private draco_loader: DRACOLoader
    private settings: object

    constructor(options: { dom: HTMLElement }) {
      this.scene = new THREE.Scene()
      this.container = options.dom
      this.width = this.container.offsetWidth
      this.height = this.container.offsetHeight
      this.renderer = new THREE.WebGLRenderer()
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(this.width, this.height)
      this.renderer.setClearColor(0x000000, 1)
      this.renderer.physicallyCorrectLights = true
      this.render = this.render.bind(this)
      this.imageAspect = 1

      this.gltf_loader = new GLTFLoader()
      this.draco_loader = new DRACOLoader()
      this.draco_loader.setDecoderConfig({ type: 'js' })
      this.draco_loader.setDecoderPath('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/') // use a full url path
      this.gltf_loader.setDRACOLoader(this.draco_loader)

      this.container.appendChild(this.renderer.domElement)
      this.camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        5
      )

      this.camera.position.set(0, 0, 3)
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.time = 0
      this.isPlaying = true

      this.addObjects()
      this.resize()
      this.render()
      this.setupResize()
      this.datGui()
    }

    datGui() {
      let that = this
      this.settings = {
        progress: 0.6,
      }
      this.gui = new dat.GUI()
      this.gui.add(this.settings, "progress", 0, 5, 0.01)
    }

    setupResize() {
      window.addEventListener("resize", this.resize.bind(this))
    }

    resize() {
      this.width = this.container.offsetWidth
      this.height = this.container.offsetHeight
      this.renderer.setSize(this.width, this.height)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      this.camera.aspect = this.width / this.height
      
  
      // image cover
      let a1; let a2
      if(this.height/this.width>this.imageAspect) {
        a1 = (this.width/this.height) * this.imageAspect
        a2 = 1
      } else{
        a1 = 1
        a2 = (this.height/this.width) / this.imageAspect
      }
  
      this.mat_plane.uniforms.resolution.value.x = this.width
      this.mat_plane.uniforms.resolution.value.y = this.height
      this.mat_plane.uniforms.resolution.value.z = a1
      this.mat_plane.uniforms.resolution.value.w = a2
  
      this.camera.updateProjectionMatrix()
    }

    addObjects() {
      let that = this
      this.mat_plane = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: {
          time: { value: 0 },
          progress: { value: 0.6 },
          resolution: { value: new THREE.Vector4() },
        },
        // wireframe: true,
        // transparent: true,
        vertexShader: vs_plane,
        fragmentShader: fs_plane
      })

      this.geo_plane = new THREE.PlaneGeometry(1, 1, 10, 10)
      this.msh_plane = new THREE.Mesh(this.geo_plane,this.mat_plane)
      this.scene.add(this.msh_plane)
    }

    stop() {
      this.isPlaying = false
    }

    play() {
      if(!this.isPlaying){
        this.render()
        this.isPlaying = true
      }
    }

    render() {
      if (!this.isPlaying) return
      this.time += 0.05
      this.mat_plane.uniforms.time.value = this.time
      requestAnimationFrame(this.render)
      this.renderer.render(this.scene, this.camera)
    }
 }

  new Sketch({
    dom: document.getElementById("app")!
  })