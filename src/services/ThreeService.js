import * as THREE from "three";
import image from "../images/2_2.jpg";
let scene, camera, cube, renderer, tile;

export const init = (mount) => {
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        500
    );
    camera.position.set(0, 0, 10);
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
    //scene.add(cube);

    //var geometry = new THREE.PlaneGeometry(1, 1, 32);
    //var plane = new THREE.Mesh(geometry, img);
    //scene.add(plane);

    var roundedRectShape = new THREE.Shape();

    (function roundedRect(ctx, x, y, width, height, radius) {
        ctx.moveTo(x, y + radius);
        ctx.lineTo(x, y + height - radius);
        ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
        ctx.lineTo(x + width - radius, y + height);
        ctx.quadraticCurveTo(
            x + width,
            y + height,
            x + width,
            y + height - radius
        );
        ctx.lineTo(x + width, y + radius);
        ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
        ctx.lineTo(x + radius, y);
        ctx.quadraticCurveTo(x, y, x, y + radius);
    })(roundedRectShape, 0, 0, 1, 1, 0.05);

    geometry = new THREE.ShapeBufferGeometry(roundedRectShape);
    tile = new THREE.Mesh(geometry, img);
    scene.add(tile);
    tile.z = 50;

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    scene.add(directionalLight);

    mount.appendChild(renderer.domElement);
    window.addEventListener("resize", () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
};

export const animate = () => {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
};
