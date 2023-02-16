import './style.css'
import { WebGLRenderer, Scene, PerspectiveCamera, ShaderMaterial, PlaneGeometry, Mesh, DoubleSide, Vector4 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Debug } from "./Debug"
import { StartingShaderMateiral } from './/materials/StartingShaderMateiral'
import { GLBModel } from './/objects/GLBModel'
import { DummyInstancedMesh } from './/objects/DummyInstancedMesh'
import MSH_Monkey_url from './model/MSH_Monkey.glb?url'

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
  private _debug: Debug
  private _GLBModel: GLBModel
  private _DummyInstancedMesh: DummyInstancedMesh

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
    this._debug = new Debug()

    this.container.appendChild(this.renderer.domElement)
    this.camera = new PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    )

    this.camera.position.set(0, 0, 3)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.time = 0
    this.isPlaying = true

    this.addObjects()
    this.resize()
    this.render()
    this.setupResize()
  }


  setupResize() {
    window.addEventListener('resize', this.resize.bind(this))
  }

  resize() {
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight
    this.renderer.setSize(this.width, this.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.camera.aspect = this.width / this.height

    this.camera.updateProjectionMatrix()
  }

  addObjects() {
    let that = this

    this.mat_plane = new StartingShaderMateiral()
    this.geo_plane = new PlaneGeometry(1, 1, 10, 10)
    this.msh_plane = new Mesh(this.geo_plane, this.mat_plane)
    // this.scene.add(this.msh_plane)

    // this._GLBModel = new GLBModel([{ model: MSH_Monkey_url}])
    // this.scene.add(this._GLBModel)

    this._DummyInstancedMesh = new DummyInstancedMesh()
    this.scene.add(this._DummyInstancedMesh)
    // console.log(this._DummyInstancedMesh)
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
    this.mat_plane.uniforms.progress.value = this._debug.settings.progress
    requestAnimationFrame(this.render)
    this.renderer.render(this.scene, this.camera)
  }
}

new Sketch({
  dom: document.getElementById('app')!
})