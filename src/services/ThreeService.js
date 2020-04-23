import * as THREE from "three";
import image from "../images/2_2.jpg";
let scene, camera, cube, renderer;

export const init = (mount) => {
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        500
    );
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var img = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture(image),
    });
    img.map.needsUpdate = true;
    cube = new THREE.Mesh(geometry, img);
    scene.add(cube);

    mount.appendChild(renderer.domElement);
    window.addEventListener("resize", () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
};

export const animate = () => {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
};