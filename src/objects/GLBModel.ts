import { BufferGeometry, Mesh, Object3D, Vector2 } from 'three'

// import { TextureMaterial } from '../materials/TextureMaterial'
import { StartingShaderMateiral } from '../materials/StartingShaderMateiral'
import { gltfLoader } from "../glb_loader"

export class GLBModel extends Object3D {
  size: Vector2
  parts: Mesh<BufferGeometry, StartingShaderMateiral>[] = []

  private _opacity = 0

  constructor(parts: { model: string; }[]) {
    super()

    this.size = new Vector2()

    parts.forEach(async part => {
      const [gltf] = await Promise.all([
        gltfLoader.loadAsync(part.model)
      ])

      const mesh = gltf.scene.children[0] as unknown as Mesh<BufferGeometry, StartingShaderMateiral>
      mesh.material = new StartingShaderMateiral()
      // mesh.material.uniforms.u_texture.value = texture
      // mesh.material.uniforms.u_size.value = this.size

      mesh.onBeforeRender = () => {
        mesh.material.uniforms.time.value = 0
      }

      this.add(mesh)
      this.parts.push(mesh)
    })
  }

  // get opacity() {
  //   return this._opacity
  // }

  // set opacity(opacity) {
  //   this._opacity = opacity

  //   this.parts.forEach(part => (part.material.uniforms.u_opacity.value = opacity))
  // }
}
