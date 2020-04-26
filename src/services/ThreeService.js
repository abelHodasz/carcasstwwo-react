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
} from "three";
import { GUI } from "dat.gui";
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
const HEM_GROUND_COLOR = 0x080820;
const HEM_INTENSITY = 1;
const SPOT_COLOR = 0xffaa95c;
const SPOT_INTENSITY = 1;

export default class ThreeService {
    constructor(mount) {
        this.scene = new Scene();
        this.gui = new GUI();
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

        mount.appendChild(this.renderer.domElement);
    }

    init() {
        const [
            scene,
            gui,
            camera,
            grid,
            renderer,
            axesHelper,
            hemLight,
            spotLight,
            spotLightHelper,
            controls,
        ] = [
            this.scene,
            this.gui,
            this.camera,
            this.grid,
            this.renderer,
            this.axesHelper,
            this.hemLight,
            this.spotLight,
            this.spotLightHelper,
            this.controls,
        ];
        //scene settings
        scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        //gui settings
        //camera settings
        camera.position.set(0.3, 1, 1);
        camera.lookAt(0.5, 0 - 0.5);

        //grid settings
        grid.position.y = 0.001;
        scene.add(grid);

        //renderer settings
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = PCFSoftShadowMap;
        renderer.toneMappingExposure = 2;
        renderer.toneMapping = ReinhardToneMapping;
        renderer.setSize(window.innerWidth, window.innerHeight);

        //axesHelper settings
        scene.add(axesHelper);

        //hemisphere Light setings
        scene.add(hemLight);

        //spotlight Helper settings

        spotLight.castShadow = true;
        scene.add(spotLight);

        //controls settings

        //resize properly
        window.addEventListener("resize", () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        });
    }

    animate = () => {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animate);
    };
}
