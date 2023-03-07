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
  // gl_PointSize = 1000. * ( 1. / - mvPosition.z );
  gl_PointSize = 10.0;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
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
	gl_FragColor = vec4(1.0);
}
`

export class PointsShaderMateiral extends ShaderMaterial {
  declare uniforms: {
    time: IUniform<number>
    progress: IUniform<number>
    resolution: IUniform<Vector4>
  }

  constructor() {
    const uniforms: PointsShaderMateiral['uniforms'] = {
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