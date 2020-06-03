import {
    PerspectiveCamera,
    Scene,
    GridHelper,
    WebGLRenderer,
    SpotLight,
    AxesHelper,
    HemisphereLight,
    SpotLightHelper,
    PCFSoftShadowMap,
    ReinhardToneMapping,
    CameraHelper,
    MOUSE,
    Raycaster,
    Vector2,
    TextureLoader,
} from "three";
//import { GUI } from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const CAMERA_FOV = 60;
const ASPECT_RATIO = window.innerWidth / window.innerHeight;
const CAMERA_NEAR = 1;
const CAMERA_FAR = 500;
const GRID_SIZE = 100;
const GRID_DIVISIONS = 100;
const RENDERER_SETTINGS = {
    alpha: true,
    antialias: true,
};
const AXES_HELPER_SIZE = 500;
const HEM_SKY_COLOR = 0xffeeb1;
const HEM_GROUND_COLOR = 0x080808;
const HEM_INTENSITY = 1;
const SPOT_COLOR = 0xffaa95c;
const SPOT_INTENSITY = 4;

export default class ThreeService {
    constructor(mount) {
        this.scene = new Scene();
        //this.gui = new GUI();
        this.camera = new PerspectiveCamera(
            CAMERA_FOV,
            ASPECT_RATIO,
            CAMERA_NEAR,
            CAMERA_FAR
        );
        this.grid = new GridHelper(GRID_SIZE, GRID_DIVISIONS);
        this.renderer = new WebGLRenderer(RENDERER_SETTINGS);
        this.axesHelper = new AxesHelper(AXES_HELPER_SIZE);
        this.hemLight = new HemisphereLight(
            HEM_SKY_COLOR,
            HEM_GROUND_COLOR,
            HEM_INTENSITY
        );
        this.spotLight = new SpotLight(SPOT_COLOR, SPOT_INTENSITY);
        this.spotLightHelper = new SpotLightHelper(this.spotLight);
        this.controls = new OrbitControls(this.camera, mount);
        this.cameraHelper = new CameraHelper(this.spotLight.shadow.camera);
        mount.appendChild(this.renderer.domElement);
        this.raycaster = new Raycaster();
        this.mouse = new Vector2(0, 0);
        this.animations = [];
        this.textures = new Map();
    }

    init() {
        const [scene, camera, grid, renderer, hemLight, spotLight, controls] = [
            this.scene,

            this.camera,
            this.grid,
            this.renderer,

            this.hemLight,
            this.spotLight,

            this.controls,
        ];
        //scene settings
        scene.traverse((child) => {
            if (child.isMesh || child.isObject3D) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        //camera settings
        camera.position.set(0.5, 5, 0.5);
        camera.lookAt(0.5, 0, -0.5);

        //grid settings
        grid.position.y = 0.001;
        //scene.add(grid);

        //renderer settings
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = PCFSoftShadowMap;
        renderer.toneMappingExposure = 1;
        renderer.toneMapping = ReinhardToneMapping;
        renderer.setSize(window.innerWidth, window.innerHeight);

        //hemisphere Light setings
        scene.add(hemLight);

        //spotlight settings
        spotLight.castShadow = true;
        spotLight.position.y = 15;
        spotLight.position.z = 8;
        spotLight.position.x = -1;
        //If I leave it in, models shadow dissapears, if I take it out it looks bad
        spotLight.shadow.bias = -0.00001;
        spotLight.shadow.mapSize.width = 1024 * 8;
        spotLight.shadow.mapSize.height = 1024 * 8;
        scene.add(spotLight);

        //controls settings
        controls.enableKeys = false;
        controls.enableRotate = false;
        controls.mouseButtons = {
            RIGHT: MOUSE.PAN,
        };
        controls.target.set(0.5, 0, -0.5);
        //resize properly
        window.addEventListener("resize", () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        });

        //raycaster, mouse
        document.addEventListener("mousemove", (e) => {
            e.preventDefault();
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });
    }

    async loadTexturesAsync(sources) {
        const loader = new TextureLoader();
        console.log("loading images");
        const promises = sources.map(
            (src) =>
                new Promise((resolve) => {
                    loader.load(src, (texture) => {
                        this.textures.set(src, texture);
                        resolve();
                    });
                })
        );
        return Promise.all(promises);
    }

    loadTexture(src) {
        return new TextureLoader().load(src);
    }

    getTexture(src) {
        return this.textures.get(src) || this.loadTexture(src);
    }

    animate = () => {
        this.renderer.render(this.scene, this.camera);
        this.raycaster.setFromCamera(this.mouse, this.camera);
        this.animations.forEach((animate) => animate());
        requestAnimationFrame(this.animate);
    };
}
