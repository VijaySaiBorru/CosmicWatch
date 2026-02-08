import React, { useMemo, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Line } from '@react-three/drei';
import * as THREE from 'three';

const EARTH_VISUAL_RADIUS = 3.2;
const MIN_ASTEROID_SIZE = 0.4;
const MAX_ASTEROID_SIZE = 1.0;
const BASE_DISTANCE = 7;
const DISTANCE_SCALE_FACTOR = 0.00005;

function RotatingAsteroid({ position, diameter, isHazardous }) {
    const meshRef = useRef();
    const glowRef = useRef();

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.3;
            meshRef.current.rotation.y += delta * 0.2;
            meshRef.current.rotation.z += delta * 0.05;
        }
        if (glowRef.current) {
            glowRef.current.rotation.y += delta * 0.5;
        }
    });

    const visualSize = useMemo(() => {
        const rawSize = Math.log10(Math.max(diameter * 1000, 1)) * 0.2;
        return Math.min(Math.max(rawSize, MIN_ASTEROID_SIZE), MAX_ASTEROID_SIZE);
    }, [diameter]);

    const color = isHazardous ? '#ef4444' : '#94a3b8';
    const emissiveColor = isHazardous ? '#991b1b' : '#1e293b';

    return (
        <group position={position}>
            <mesh ref={meshRef}>
                <dodecahedronGeometry args={[visualSize, 1]} />
                <meshStandardMaterial
                    color={color}
                    emissive={emissiveColor}
                    emissiveIntensity={0.3}
                    roughness={0.8}
                    metalness={0.3}
                    flatShading
                />
            </mesh>
            {isHazardous && (
                <mesh ref={glowRef}>
                    <sphereGeometry args={[visualSize * 1.4, 16, 16]} />
                    <meshBasicMaterial
                        color="#ff0000"
                        transparent
                        opacity={0.15}
                        side={THREE.BackSide}
                    />
                </mesh>
            )}
        </group>
    );
}

function Earth(props) {
    const earthRef = useRef();
    const cloudsRef = useRef();
    const groupRef = useRef();

    useFrame((state, delta) => {
        if (earthRef.current) {
            earthRef.current.rotation.y += delta * 0.05;
        }
        if (cloudsRef.current) {
            cloudsRef.current.rotation.y += delta * 0.07;
        }
        if (groupRef.current) {
             groupRef.current.rotation.y += delta * 0.05;
        }
    });

    return (
        <group {...props}>
            <mesh ref={earthRef}>
                <sphereGeometry args={[EARTH_VISUAL_RADIUS, 64, 64]} />
                <meshStandardMaterial
                    color="#1e3a8a"
                    roughness={0.5}
                    metalness={0.1}
                />
                
                <group ref={groupRef}>
                    <mesh position={[-1.5, 1.5, 2]} rotation={[0.5, -0.5, 0]}>
                         <dodecahedronGeometry args={[0.8, 0]} />
                         <meshStandardMaterial color="#15803d" roughness={0.8} />
                    </mesh>
                     <mesh position={[-2, 0.5, 1.8]} rotation={[0.2, -0.2, 0]}>
                         <dodecahedronGeometry args={[0.6, 0]} />
                         <meshStandardMaterial color="#166534" roughness={0.8} />
                    </mesh>
                    
                    <mesh position={[-1.2, -1.5, 2.2]} rotation={[0.2, 0, 0.5]}>
                         <dodecahedronGeometry args={[0.7, 0]} />
                         <meshStandardMaterial color="#15803d" roughness={0.8} />
                    </mesh>
                    
                    <mesh position={[2, 1, 1.5]} rotation={[0, 0.5, 0]}>
                         <dodecahedronGeometry args={[1.2, 0]} />
                         <meshStandardMaterial color="#16a34a" roughness={0.8} />
                    </mesh>
                     <mesh position={[1.5, -0.5, 2.5]} rotation={[0, 0.3, 0]}>
                         <dodecahedronGeometry args={[0.9, 0]} />
                         <meshStandardMaterial color="#15803d" roughness={0.8} />
                    </mesh>
                    
                     <mesh position={[2.5, -1.5, 0]} rotation={[0, 1, 0]}>
                         <dodecahedronGeometry args={[0.5, 0]} />
                         <meshStandardMaterial color="#16a34a" roughness={0.8} />
                    </mesh>
                </group>
            </mesh>
            
            <mesh ref={cloudsRef} scale={[1.02, 1.02, 1.02]}>
                <sphereGeometry args={[EARTH_VISUAL_RADIUS, 32, 32]} />
                <meshStandardMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.35}
                    roughness={0.9}
                />
            </mesh>
            <mesh>
                <sphereGeometry args={[EARTH_VISUAL_RADIUS * 1.2, 32, 32]} />
                <meshBasicMaterial
                    color="#3b82f6"
                    transparent
                    opacity={0.15}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
        </group>
    );
}

function OrbitalPath({ radius }) {
    const points = useMemo(() => {
        const pts = [];
        const segments = 128;
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            pts.push(new THREE.Vector3(x, 0, z));
        }
        return pts;
    }, [radius]);

    return (
        <group rotation={[Math.PI / 6, 0, 0]}>
            <Line
                points={points}
                color="#8b5cf6"
                lineWidth={2}
                opacity={0.5}
                transparent
            />
            {[0, 32, 64, 96].map((i) => {
                const angle = (i / 128) * Math.PI * 2;
                return (
                    <mesh key={i} position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}>
                        <sphereGeometry args={[0.1, 8, 8]} />
                        <meshBasicMaterial color="#a78bfa" opacity={0.6} transparent />
                    </mesh>
                );
            })}
        </group>
    );
}

function AsteroidLabel({ position, isHazardous, missDistanceKm }) {
    return (
        <Html position={position} center distanceFactor={12} zIndexRange={[100, 0]}>
            <div
                className="bg-black/80 backdrop-blur-md text-white px-3 py-2 rounded-lg border shadow-xl min-w-[150px]"
                style={{
                    borderColor: isHazardous ? '#ef4444' : '#8b5cf6',
                    boxShadow: isHazardous ? '0 0 15px rgba(239, 68, 68, 0.4)' : '0 0 10px rgba(139, 92, 246, 0.2)'
                }}
            >
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs">{isHazardous ? '🔴' : '🟢'}</span>
                    <span className="font-bold text-sm uppercase tracking-wider">
                        {isHazardous ? 'Hazardous' : 'Safe Orbit'}
                    </span>
                </div>
                <div className="text-[10px] uppercase text-gray-400 tracking-wide">Miss Distance</div>
                <div className="text-base font-mono font-bold text-blue-300">
                    {Number(missDistanceKm).toLocaleString()} km
                </div>
            </div>
        </Html>
    );
}

function SunLight() {
    return (
        <group>
            <ambientLight intensity={0.2} />
            <directionalLight
                position={[50, 20, 30]}
                intensity={1.5}
                color="#ffffff"
            />
            <pointLight position={[-20, 10, -20]} intensity={0.5} color="#4c1d95" />
        </group>
    );
}

const AsteroidVis3D = forwardRef(({
    missDistanceKm = 75000,
    diameterMaxKm = 1,
    isHazardous = false,
    orbitalData = null,
    className = '',
    style = {},
    showTitle = true
}, ref) => {
    const cameraPosition = [25, 15, 25];
    const controlsRef = useRef();

    const handleResetView = () => {
        if (controlsRef.current) {
            controlsRef.current.reset();
        }
    };

    useImperativeHandle(ref, () => ({
        resetView: handleResetView
    }));

    return (
        <div 
            className={`w-full h-full min-h-[500px] relative bg-black rounded-xl overflow-hidden shadow-2xl border border-purple-500/20 ${className}`}
            style={{ ...style, isolation: 'isolate' }}
        >
            <Canvas
                camera={{ position: cameraPosition, fov: 50 }}
                className="w-full h-full"
                dpr={[1, 2]}
                gl={{
                    antialias: true,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.2
                }}
            >
                <Scene
                    missDistanceKm={Number(missDistanceKm)}
                    diameterMaxKm={Number(diameterMaxKm)}
                    isHazardous={isHazardous}
                    orbitalData={orbitalData}
                />
                <OrbitControls
                    ref={controlsRef}
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    minDistance={4}
                    maxDistance={100}
                    autoRotate={!orbitalData}
                    autoRotateSpeed={0.5}
                />
            </Canvas>
        </div>
    );
});

export default AsteroidVis3D;

function Scene({ missDistanceKm, diameterMaxKm, isHazardous, orbitalData }) {
    const visualDistance = useMemo(() => {
        const logDist = Math.log(Math.max(missDistanceKm, 1000));
        return BASE_DISTANCE + (logDist * 0.8);
        }, [missDistanceKm]);

    const labelPosition = orbitalData ? [10, 5, 0] : [visualDistance, 1.5, 0];

    return (
        <>
            <Stars radius={300} depth={100} count={10000} factor={6} saturation={0} fade speed={0.5} />
            <SunLight />

            {orbitalData ? (
                <KeplerianOrbit
                    data={orbitalData}
                    diameter={diameterMaxKm}
                    isHazardous={isHazardous}
                    missDistanceKm={missDistanceKm}
                />
            ) : (
                <group>
                    <Earth />
                    <group rotation={[Math.PI / 6, 0, 0]}>
                        <OrbitalPath radius={visualDistance} />
                        <RotatingAsteroid
                            position={[visualDistance, 0, 0]}
                            diameter={diameterMaxKm}
                            isHazardous={isHazardous}
                        />
                    </group>
                </group>
            )}

            {!orbitalData && (
                <AsteroidLabel
                    position={labelPosition}
                    isHazardous={isHazardous}
                    missDistanceKm={missDistanceKm}
                />
            )}
        </>
    );
}

function KeplerianOrbit({ data, diameter, isHazardous, missDistanceKm }) {
    const {
        eccentricity,
        semi_major_axis,
        inclination,
        ascending_node,
        perihelion_argument,
        mean_anomaly,
        epoch_osculation,
        period_yr
    } = data;

    const AU_SCALE = 20;

    const points = useMemo(() => {
        const pts = [];
        const segments = 256;

        const i = (inclination * Math.PI) / 180;
        const omega = (ascending_node * Math.PI) / 180;
        const w = (perihelion_argument * Math.PI) / 180;

        const a = semi_major_axis * AU_SCALE;
        const e = eccentricity;
        const b = a * Math.sqrt(1 - e * e);

        for (let j = 0; j <= segments; j++) {
            const E = (j / segments) * 2 * Math.PI;

            const P = a * (Math.cos(E) - e);
            const Q = b * Math.sin(E);

            const cos_w = Math.cos(w);
            const sin_w = Math.sin(w);
            const cos_omega = Math.cos(omega);
            const sin_omega = Math.sin(omega);
            const cos_i = Math.cos(i);
            const sin_i = Math.sin(i);

            const x_helio = P * (cos_w * cos_omega - sin_w * sin_omega * cos_i) - Q * (sin_w * cos_omega + cos_w * sin_omega * cos_i);
            const y_helio = P * (sin_w * sin_i) + Q * (cos_w * sin_i);
            const z_helio = P * (cos_w * sin_omega + sin_w * cos_omega * cos_i) - Q * (sin_w * sin_omega - cos_w * cos_omega * cos_i);

            pts.push(new THREE.Vector3(x_helio - 20, y_helio, z_helio));
        }
        return pts;
    }, [eccentricity, semi_major_axis, inclination, ascending_node, perihelion_argument]);

    const asteroidPos = useMemo(() => {
        if (points.length === 0) return new THREE.Vector3(0, 0, 0);

        const ma_rad = (mean_anomaly * Math.PI) / 180;
        const totalSegments = points.length - 1;

        let E = ma_rad;
        for (let k = 0; k < 5; k++) {
            E = ma_rad + eccentricity * Math.sin(E);
        }

        let normE = (E % (2 * Math.PI));
        if (normE < 0) normE += 2 * Math.PI;

        const index = Math.floor((normE / (2 * Math.PI)) * totalSegments);
        return points[index % points.length];

    }, [points, mean_anomaly, eccentricity]);

    return (
        <group>
            <Line
                points={points}
                color={isHazardous ? "#ef4444" : "#8b5cf6"}
                lineWidth={1.5}
                opacity={0.6}
                transparent
            />
            <group position={[-20, 0, 0]}>
                <mesh>
                    <sphereGeometry args={[2, 32, 32]} />
                    <meshBasicMaterial color="#FFD700" />
                </mesh>
                <mesh>
                    <sphereGeometry args={[2.8, 32, 32]} />
                    <meshBasicMaterial
                        color="#fbbf24"
                        transparent
                        opacity={0.4}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
                <mesh>
                    <sphereGeometry args={[4, 32, 32]} />
                    <meshBasicMaterial
                        color="#f59e0b"
                        transparent
                        opacity={0.15}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            </group>

            <group position={[0, 0, 0]}>
                <Earth scale={[0.3, 0.3, 0.3]} />
                <Html position={[0, 1.5, 0]} center distanceFactor={10}>
                    <div className="text-xs text-blue-300 font-mono">Earth</div>
                </Html>
            </group>

            <RotatingAsteroid
                position={asteroidPos}
                diameter={diameter}
                isHazardous={isHazardous}
            />

            <AsteroidLabel
                position={[asteroidPos.x, asteroidPos.y + 2, asteroidPos.z]}
                isHazardous={isHazardous}
                missDistanceKm={missDistanceKm}
            />
        </group>
    );
}
