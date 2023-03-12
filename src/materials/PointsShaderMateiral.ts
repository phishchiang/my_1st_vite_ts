import { Color, IUniform, RawShaderMaterial, ShaderMaterial, Texture, Vector2, DoubleSide } from 'three'

const vertexShader = /* glsl */ `
precision highp float;
float PI = 3.141592653589793238;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
attribute vec3 position;
attribute vec2 uv;

uniform vec2 pixels;
uniform float time;
attribute vec3 a_instance_position;
attribute vec3 a_vertex_color;
uniform vec2 u_viewport;

varying vec3 vPosition;
varying vec3 v_color;

float particleSize (vec4 screenPos, mat4 mtxProj, vec2 viewport, float radius){
  return viewport.y * mtxProj[1][1] * radius / screenPos.w;
}

void main() {
  v_color = a_vertex_color;

  vec4 mvPosition = modelViewMatrix * vec4( position, 1. );
  // gl_PointSize = 100. * ( 1. / - mvPosition.z );
  // gl_PointSize = 10.0;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  gl_PointSize = particleSize(gl_Position, projectionMatrix, u_viewport, 0.01);
}
`

const fragmentShader = /* glsl */ `
precision highp float;
float PI = 3.141592653589793238;

uniform float time;
uniform float progress;

varying vec3 vPosition;
varying vec3 v_color;

void main()	{
  float uv_center = distance(gl_PointCoord, vec2(0.5));
  if(uv_center > 0.5) discard;

	gl_FragColor = vec4(gl_PointCoord, 0.0, 1.0);
}
`

export class PointsShaderMateiral extends RawShaderMaterial {
  declare uniforms: {
    time: IUniform<number>
    progress: IUniform<number>
    u_viewport: IUniform<Vector2>
  }

  constructor() {
    const uniforms: PointsShaderMateiral['uniforms'] = {
      time: { value: 0 },
      progress: { value: 0.6 },
      u_viewport: { value: new Vector2() },
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