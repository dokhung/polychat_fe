import type { RootState, ThreeEvent } from "@react-three/fiber";
import type { StateTuple } from "../../../types/react";
import React, { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

type NetworkSphereProps = { reducedMotion: boolean };
const nodes: THREE.Vector3[] = Array.from({ length: 64 }, (_: unknown, i: number): THREE.Vector3 => {
    const y: number = 1 - (i / 63) * 2;
    const radius: number = Math.sqrt(1 - y * y);
    const angle: number = i * Math.PI * (3 - Math.sqrt(5));
    return new THREE.Vector3(Math.cos(angle) * radius * 2, y * 2, Math.sin(angle) * radius * 2);
});

export function NetworkSphere({ reducedMotion }: NetworkSphereProps): React.JSX.Element {
    const group: React.RefObject<THREE.Group | null> = useRef<THREE.Group>(null);
    const core: React.RefObject<THREE.Mesh | null> = useRef<THREE.Mesh>(null);
    const dots: React.RefObject<THREE.Group | null> = useRef<THREE.Group>(null);
    const [hovered, setHovered]: StateTuple<number | null> = useState<number | null>(null);
    const connections: Float32Array<ArrayBuffer> = useMemo((): Float32Array<ArrayBuffer> => {
        const positions: number[] = [];
        nodes.forEach((a: THREE.Vector3, i: number): void => nodes.slice(i + 1).forEach((b: THREE.Vector3): void => {
            if (a.distanceTo(b) < .92) positions.push(...a.toArray(), ...b.toArray());
        }));
        return new Float32Array(positions);
    }, []);
    const particles: Float32Array<ArrayBuffer> = useMemo((): Float32Array<ArrayBuffer> => new Float32Array(Array.from({ length: 180 }, (_: unknown, i: number): number[] => {
        const a: number = i * 2.399;
        const r: number = 2.7 + (i % 7) * .12;
        return [Math.cos(a) * r, Math.sin(i * 1.73) * 2.6, Math.sin(a) * r];
    }).flat()), []);
    const orbit: THREE.Vector3[] = useMemo((): THREE.Vector3[] => Array.from({ length: 129 }, (_: unknown, i: number): THREE.Vector3 => {
        const a: number = i / 128 * Math.PI * 2;
        return new THREE.Vector3(Math.cos(a) * 2.5, Math.sin(a) * .65, Math.sin(a) * 2.1);
    }), []);

    useFrame((state: RootState, delta: number): void => {
        if (reducedMotion || !group.current) return;
        const t: number = state.clock.elapsedTime;
        group.current.rotation.y += Math.min(delta, .05) * .055;
        group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, state.pointer.y * .08, 3, delta);
        group.current.position.x = THREE.MathUtils.damp(group.current.position.x, state.pointer.x * .12, 3, delta);
        const scale: number = 1 - Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1) * .08;
        group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, scale, 3, delta));
        core.current?.rotation.set(t * .08, t * .12, .3);
        dots.current?.children.forEach((node: THREE.Object3D, i: number): THREE.Vector3 => node.scale.setScalar(i === hovered ? 1.8 : 1 + Math.sin(t * 1.4 + i) * .16));
    });

    return <group ref={group} rotation={[.12, .3, -.12]}>
        <mesh ref={core}>
            <icosahedronGeometry args={[.7, 1]} />
            <meshStandardMaterial color="#9ebdff" metalness={.7} roughness={.22} emissive="#305cbd" emissiveIntensity={.45} />
        </mesh>
        <mesh><icosahedronGeometry args={[.84, 1]} /><meshBasicMaterial color="#9ebdff" wireframe transparent opacity={.26} /></mesh>
        <mesh><sphereGeometry args={[1.97, 32, 24]} /><meshBasicMaterial color="#10254f" transparent opacity={.12} depthWrite={false} /></mesh>
        <lineSegments>
            <bufferGeometry><bufferAttribute attach="attributes-position" args={[connections, 3]} /></bufferGeometry>
            <lineBasicMaterial color="#679bdc" transparent opacity={.3} />
        </lineSegments>
        <group ref={dots}>{nodes.map((point: THREE.Vector3, i: number): React.JSX.Element => <mesh key={i} position={point}
            onPointerOver={(event: ThreeEvent<PointerEvent>): void => { event.stopPropagation(); setHovered(i); }} onPointerOut={(): void => setHovered(null)}>
            <sphereGeometry args={[i % 7 === 0 ? .065 : .032, 12, 8]} />
            <meshBasicMaterial color={hovered === i ? "#ffffff" : i % 5 === 0 ? "#a395ea" : "#88d4ef"} />
        </mesh>)}</group>
        <Line points={orbit} color="#6f92ca" transparent opacity={.34} lineWidth={.7} />
        <group rotation={[1.1, .3, .8]}><Line points={orbit} color="#a196d3" transparent opacity={.2} lineWidth={.6} /></group>
        <points>
            <bufferGeometry><bufferAttribute attach="attributes-position" args={[particles, 3]} /></bufferGeometry>
            <pointsMaterial color="#97b7e2" size={.018} transparent opacity={.45} sizeAttenuation />
        </points>
    </group>;
}
