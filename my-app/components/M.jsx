import { useTexture } from '@react-three/drei'
import React from 'react'

const vertexShader = `
  varying vec3 vNormal;
  varying vec2 vUv;
  void main()
    {
        vNormal = normalize(normalMatrix * normal);
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`

const fragmentShader = `
  uniform sampler2D uTexture;   
    varying vec3 vNormal;
    varying vec2 vUv;
    void main()
    {
        float r = texture2D(uTexture, vUv).r;
        vec3 color = vec3(0.0,0.9,1.0);
        gl_FragColor = vec4( vec3(r), r);
    }
`

const M = () => {
    const MainSymbolTexture = useTexture("M_symbol.png")
  return (
    <mesh rotation={[0, -Math.PI / 6,0]}>
        <planeGeometry args={[2.5, 2.5, 32, 32]} />
        <shaderMaterial
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            transparent
            depthWrite={false}
            uniforms={{
                uTexture: { value: MainSymbolTexture },
            }}
        />
    </mesh>
  )
}

export default M