import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const GyroscopePlot = ({ data }) => {
    const mountRef = useRef(null);
    const lineRef = useRef(null);

    useEffect(() => {
        const width = 400; // Adjust width as needed
        const height = 400; // Adjust height as needed

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(0, 0, 15);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setClearColor(0xffffff, 1); // Set background color to white
        mountRef.current.appendChild(renderer.domElement);

        // Add GridHelper
        const gridHelper = new THREE.GridHelper(10, 10);
        scene.add(gridHelper);

        // Create an initial empty line
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
        lineRef.current = new THREE.Line(geometry, material);
        scene.add(lineRef.current);

        // OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement);

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update(); // Only required if controls.enableDamping or controls.autoRotate are set to true
            renderer.render(scene, camera);
        };

        animate();

        // Clean up
        return () => {
            mountRef.current.removeChild(renderer.domElement);
        };
    }, []); // Empty dependency array, so this effect runs only once

    useEffect(() => {
        // Update line geometry with new data
        if (lineRef.current) {
            const points = data.map(d => new THREE.Vector3(d.x, d.y, d.z));
            lineRef.current.geometry.dispose(); // Dispose old geometry
            lineRef.current.geometry = new THREE.BufferGeometry().setFromPoints(points);
        }
    }, [data]); // This effect runs when data changes

    return <div ref={mountRef} style={{ width: '400px', height: '400px' }} />;
};

export default GyroscopePlot;
