import { Color, IUniform, RawShaderMaterial, ShaderMaterial, Texture, Vector4, DoubleSide } from 'three'

const vertexShader = /* glsl */ `
float PI = 3.141592653589793238;

uniform vec2 pixels;
uniform float time;
attribute vec3 a_instance_position;
attribute vec3 a_vertex_color;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 v_color;

void main() {
  vUv = uv;
  v_color = a_vertex_color;
  vec3 fianl_position = position;
  fianl_position += a_instance_position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( fianl_position, 1.0 );
}
`

const fragmentShader = /* glsl */ `
float PI = 3.141592653589793238;

uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 v_color;

void main()	{
	// vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
	gl_FragColor = vec4(v_color,1.);
}
`

export class StartingShaderMateiral extends ShaderMaterial {
  declare uniforms: {
    time: IUniform<number>
    progress: IUniform<number>
    resolution: IUniform<Vector4>
  }

  constructor() {
    const uniforms: StartingShaderMateiral['uniforms'] = {
      time: { value: 0 },
      progress: { value: 0.6 },
      resolution: { value: new Vector4() },
    }

    super({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: DoubleSide,
      uniforms: uniforms,
      // wireframe: true,
      // transparent: true,
    })
  }
}