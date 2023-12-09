import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const GyroscopePlot = ({ data, scale = 0.1 }) => {
    const mountRef = useRef(null);
    const lineRef = useRef(null);

    useEffect(() => {
        const width = 800;
        const height = 800;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xFFFFFF); // White background like MATLAB

        // Camera setup (MATLAB-like angle)
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(50, 50, 50); // Elevated angle
        camera.lookAt(0, 0, 0);

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        mountRef.current.appendChild(renderer.domElement);

        // Grid Helper (MATLAB style)
        const gridHelper = new THREE.GridHelper(100, 20, 0xBBBBBB, 0xBBBBBB);
        scene.add(gridHelper);

        // Axes setup
        const axesHelper = new THREE.AxesHelper(50);
        scene.add(axesHelper);

        // Line setup
        const material = new THREE.LineBasicMaterial({ color: 0x0000FF }); // Blue line like MATLAB
        const geometry = new THREE.BufferGeometry();
        lineRef.current = new THREE.Line(geometry, material);
        scene.add(lineRef.current);

        // OrbitControls for interactivity (optional)
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = true;
        controls.enableRotate = true;

        // Lighting (subtle to match MATLAB's style)
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
        scene.add(ambientLight);

        // Animation loop
        let frameId;
        const animate = () => {
            frameId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Cleanup
        return () => {
            cancelAnimationFrame(frameId);
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            scene.remove(gridHelper);
            scene.remove(axesHelper);
            scene.remove(lineRef.current);
            geometry.dispose();
            material.dispose();
            if (lineRef.current) {
                lineRef.current.geometry.dispose();
            }
            renderer.dispose();
            controls.dispose(); // Don't forget to dispose the controls as well
        };
    }, []);

    useEffect(() => {
        if (lineRef.current) {
            const points = data.map(d => new THREE.Vector3(d.x * scale, d.y * scale, d.z * scale));
            lineRef.current.geometry.dispose();
            lineRef.current.geometry = new THREE.BufferGeometry().setFromPoints(points);
        }
    }, [data, scale]);

    return <div ref={mountRef} style={{ width: '800px', height: '800px' }} />;
};

export default GyroscopePlot;
