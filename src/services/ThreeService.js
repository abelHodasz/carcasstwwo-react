import {
    PerspectiveCamera,
    Scene,
    GridHelper,
    WebGLRenderer,
    SpotLight,
    AxesHelper,
    HemisphereLight,
    SpotLightHelper,
} from "three";
import { GUI } from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class ThreeService {
    constructor(mount) {
        this.scene = new Scene();
        this.gui = new GUI();
        this.camera = new PerspectiveCamera();
        this.grid = new GridHelper();
        this.render = new WebGLRenderer();
        this.axesHelper = new AxesHelper();
        this.hemLifht = new HemisphereLight();
        this.spotlight = new SpotLight();
        this.spotlightHelper = new SpotLightHelper();
        this.controls = new OrbitControls();

        mount.appendChild(this.render.domElement);
    }

    init() {
        //scene settings
        //gui settings
        //camera settings
        //grid settings
        //renderer settings
        //axesHelper settings
        //hemisphere Light setings
        //spotlight Helper settings
        //controls settings
    }

    animate = () => {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animate);
    };
}
