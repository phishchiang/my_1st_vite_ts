import './style.css'
import { WebGLRenderer, Scene, PerspectiveCamera, ShaderMaterial, PlaneGeometry, Mesh, DoubleSide, Vector4 } from 'three'
import { GUI } from "dat.gui"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { gltf_loader } from "./glb_loader"

import vs_plane from './shader/vs_plane.vert?raw'
import fs_plane from './shader/fs_plane.frag?raw'
import MSH_Monkey from "./model/MSH_Monkey.glb?url"

export class Sketch {
  private renderer: WebGLRenderer
  private scene: Scene
  private container: HTMLElement
  private width: number
  private height: number
  private camera: PerspectiveCamera
  private controls: OrbitControls
  private time: number
  private imageAspect: number
  private isPlaying: boolean
  private mat_plane: ShaderMaterial
  private geo_plane: PlaneGeometry
  private msh_plane: Mesh
  private gui: dat.GUI
  private settings: object
  private msh_monkey: Mesh

  constructor(options: { dom: HTMLElement }) {
    this.scene = new Scene()
    this.container = options.dom
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight
    this.renderer = new WebGLRenderer()
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.width, this.height)
    this.renderer.setClearColor(0x000000, 1)
    this.renderer.physicallyCorrectLights = true
    this.render = this.render.bind(this)
    this.imageAspect = 1

    this.container.appendChild(this.renderer.domElement)
    this.camera = new PerspectiveCamera(
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
    this.gui = new GUI()
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
    this.mat_plane = new ShaderMaterial({
      side: DoubleSide,
      uniforms: {
        time: { value: 0 },
        progress: { value: 0.6 },
        resolution: { value: new Vector4() },
      },
      // wireframe: true,
      // transparent: true,
      vertexShader: vs_plane,
      fragmentShader: fs_plane
    })

    this.geo_plane = new PlaneGeometry(1, 1, 10, 10)
    this.msh_plane = new Mesh(this.geo_plane,this.mat_plane)
    this.scene.add(this.msh_plane)

    gltf_loader.load(MSH_Monkey, glb => {
      this.msh_monkey = glb.scenes[0].children[0] as Mesh
      this.msh_monkey.traverse(o=>{
        if(o instanceof Mesh){
          // console.log(o);
          o.material = this.mat_plane;
        }
      })
      this.scene.add(this.msh_monkey)
    })
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