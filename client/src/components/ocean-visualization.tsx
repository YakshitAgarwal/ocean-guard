"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Sparkles, Cloud } from "@react-three/drei"
import * as THREE from "three"
import { EffectComposer, Bloom, DepthOfField, Vignette } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"

function WaterSurface() {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()

  // Create a more detailed geometry for the water surface
  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(viewport.width * 3, viewport.height * 3, 256, 256)
  }, [viewport.width, viewport.height])

  // Create a custom shader material for more realistic water
  const waterMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("#0066cc") },
        uDeepColor: { value: new THREE.Color("#001e3c") },
        uSurfaceColor: { value: new THREE.Color("#4fc3f7") },
        uColorStrength: { value: 0.3 },
      },
      vertexShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying float vElevation;
        
        // Simplex 3D Noise 
        // by Ian McEwan, Ashima Arts
        vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
        float snoise(vec3 v){ 
          const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
          const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

          // First corner
          vec3 i  = floor(v + dot(v, C.yyy) );
          vec3 x0 =   v - i + dot(i, C.xxx) ;

          // Other corners
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min( g.xyz, l.zxy );
          vec3 i2 = max( g.xyz, l.zxy );

          //  x0 = x0 - 0. + 0.0 * C 
          vec3 x1 = x0 - i1 + 1.0 * C.xxx;
          vec3 x2 = x0 - i2 + 2.0 * C.xxx;
          vec3 x3 = x0 - 1. + 3.0 * C.xxx;

          // Permutations
          i = mod(i, 289.0 ); 
          vec4 p = permute( permute( permute( 
                    i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                  + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                  + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

          // Gradients
          // ( N*N points uniformly over a square, mapped onto an octahedron.)
          float n_ = 1.0/7.0; // N=7
          vec3  ns = n_ * D.wyz - D.xzx;

          vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);

          vec4 b0 = vec4( x.xy, y.xy );
          vec4 b1 = vec4( x.zw, y.zw );

          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));

          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

          vec3 p0 = vec3(a0.xy,h.x);
          vec3 p1 = vec3(a0.zw,h.y);
          vec3 p2 = vec3(a1.xy,h.z);
          vec3 p3 = vec3(a1.zw,h.w);

          // Normalise gradients
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;

          // Mix final noise value
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                        dot(p2,x2), dot(p3,x3) ) );
        }
        
        void main() {
          vUv = uv;
          
          // Create multiple wave layers with different frequencies and amplitudes
          vec3 pos = position;
          float noiseScale1 = 0.2;
          float noiseScale2 = 0.5;
          float noiseScale3 = 1.0;
          
          // Large slow waves
          float noise1 = snoise(vec3(pos.x * noiseScale1, pos.y * noiseScale1, uTime * 0.1)) * 2.0;
          
          // Medium waves
          float noise2 = snoise(vec3(pos.x * noiseScale2, pos.y * noiseScale2, uTime * 0.2)) * 1.0;
          
          // Small ripples
          float noise3 = snoise(vec3(pos.x * noiseScale3, pos.y * noiseScale3, uTime * 0.3)) * 0.5;
          
          // Combine waves
          float elevation = noise1 + noise2 + noise3;
          
          // Add some variation based on distance from center for a more natural look
          float distanceFromCenter = length(pos.xy) * 0.05;
          elevation *= 1.0 - (distanceFromCenter * 0.1);
          
          // Store elevation for fragment shader
          vElevation = elevation;
          
          // Apply elevation to vertex
          pos.z += elevation;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uDeepColor;
        uniform vec3 uSurfaceColor;
        uniform float uColorStrength;
        uniform float uTime;
        
        varying vec2 vUv;
        varying float vElevation;
        
        void main() {
          // Mix colors based on elevation to create depth effect
          float depthFactor = smoothstep(-2.0, 2.0, vElevation);
          
          // Create foam effect on wave peaks
          float foam = smoothstep(0.7, 1.0, vElevation);
          
          // Create specular highlights
          float specular = pow(max(0.0, vElevation * 0.5 + 0.5), 10.0) * 0.5;
          
          // Mix deep water color with surface color based on elevation
          vec3 waterColor = mix(uDeepColor, uColor, depthFactor * uColorStrength);
          
          // Add foam and specular highlights
          waterColor = mix(waterColor, uSurfaceColor, foam * 0.5);
          waterColor += specular * uSurfaceColor;
          
          gl_FragColor = vec4(waterColor, 0.9);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    })
  }, [])

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const time = clock.getElapsedTime()
      ;(meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = time
    }
  })

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2.5, 0, 0]}
      position={[0, -8, 0]}
      geometry={geometry}
      material={waterMaterial}
    />
  )
}

function Bubbles() {
  const count = 500
  const positions = useMemo(() => {
    const positions = []
    for (let i = 0; i < count; i++) {
      positions.push(
        (Math.random() - 0.5) * 100, // x
        (Math.random() - 0.5) * 50 - 25, // y (mostly below the surface)
        (Math.random() - 0.5) * 100, // z
      )
    }
    return new Float32Array(positions)
  }, [count])

  const sizes = useMemo(() => {
    const sizes = []
    for (let i = 0; i < count; i++) {
      sizes.push(Math.random() * 0.5 + 0.1)
    }
    return new Float32Array(sizes)
  }, [count])

  const ref = useRef<THREE.Points>(null)

  useFrame(({ clock }) => {
    if (ref.current) {
      const time = clock.getElapsedTime()
      const positions = ref.current.geometry.attributes.position.array as Float32Array

      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        // Slow upward movement with some horizontal drift
        positions[i3 + 1] += 0.02 + Math.sin(time * 0.1 + i) * 0.01
        positions[i3] += Math.sin(time * 0.2 + i) * 0.01
        positions[i3 + 2] += Math.cos(time * 0.2 + i) * 0.01

        // Reset bubbles that go too high
        if (positions[i3 + 1] > 20) {
          positions[i3 + 1] = -30 + Math.random() * 10
          positions[i3] = (Math.random() - 0.5) * 100
          positions[i3 + 2] = (Math.random() - 0.5) * 100
        }
      }

      ref.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function UnderwaterParticles() {
  return <Sparkles count={1000} scale={50} size={0.5} speed={0.3} opacity={0.2} color="#4fc3f7" noise={1} />
}

function LightRays() {
  const mesh = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (mesh.current) {
      const time = clock.getElapsedTime()
      mesh.current.rotation.z = time * 0.05
      mesh.current.material.opacity = 0.3 + Math.sin(time * 0.2) * 0.1
    }
  })

  return (
    <mesh ref={mesh} position={[0, 10, -20]} rotation={[Math.PI / 4, 0, 0]}>
      <planeGeometry args={[100, 100, 1, 1]} />
      <meshBasicMaterial
        color="#4fc3f7"
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

function OceanFloor() {
  const mesh = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()

  return (
    <mesh ref={mesh} position={[0, -30, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[viewport.width * 4, viewport.height * 4, 64, 64]} />
      <meshStandardMaterial color="#0a2a3d" roughness={0.8} metalness={0.2} wireframe={false} />
    </mesh>
  )
}

function OceanScene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 20, 5]} intensity={0.5} color="#ffffff" />
      <directionalLight position={[-10, 15, -5]} intensity={0.3} color="#4fc3f7" />
      <fog attach="fog" args={["#001e3c", 10, 100]} />

      <WaterSurface />
      <Bubbles />
      <UnderwaterParticles />
      <LightRays />
      <OceanFloor />

      {/* Add volumetric clouds for atmosphere */}
      <Cloud opacity={0.5} speed={0.1} width={50} depth={5} segments={20} position={[0, 15, -30]} />

      <EffectComposer>
        <Bloom intensity={0.5} luminanceThreshold={0.2} luminanceSmoothing={0.9} blendFunction={BlendFunction.SCREEN} />
        <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} />
        <Vignette offset={0.5} darkness={0.5} blendFunction={BlendFunction.NORMAL} />
      </EffectComposer>

      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </>
  )
}

export default function OceanVisualization() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 5, 30], fov: 60 }}>
        <OceanScene />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/30 to-slate-950 opacity-80" />
    </div>
  )
}

