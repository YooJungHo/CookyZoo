<template>
	<div id="container">
		<video id="vid" :src="this.videoSource" autoplay />
	</div>
</template>

<script>
import * as THREE from "three";

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import EventBus from "../EventBus";

export default {
	data() {
		return {
			stats: undefined,
			camera: undefined,
			scene: undefined,
			renderer: undefined,
			controls: undefined,
			loader: undefined,
			mixer: undefined,
			video: undefined,
			videoImage: undefined,
			videoImageContext: undefined,
			videoTexture: undefined,
			clock: new THREE.Clock(),
			videoSource: undefined,
			videoSources: undefined,
			stage: 0,
		};
	},
	methods: {
		init() {
			const container = document.getElementById("container");

			// document.body.appendChild(container); //이거 새로운 영역을 추가하는 거임

			// // camera
			this.camera = new THREE.PerspectiveCamera(
				45,
				window.innerWidth / window.innerHeight,
				1,
				2000
			);
			this.camera.position.set(100, 200, 300);

			// // scene
			this.scene = new THREE.Scene();
			// this.scene.background = new THREE.Color(  0xa0a0a0 );
			// this.scene.fog = new THREE.Fog(  0xa0a0a0, 200, 1000 );

			// renderer
			this.renderer = new THREE.WebGLRenderer({ alpha: true }); // 투명하게 할때 alpha 사용
			this.renderer.setPixelRatio(window.devicePixelRatio);
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			this.renderer.shadowMap.enabled = true;
			container.appendChild(this.renderer.domElement);

			// light
			// character light
			const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);

			hemiLight.position.set(0, 200, 0);
			this.scene.add(hemiLight);

			const dirLight = new THREE.DirectionalLight(0xffffff);

			dirLight.position.set(0, 200, 100);
			dirLight.castShadow = true;
			dirLight.shadow.camera.top = 180;
			dirLight.shadow.camera.bottom = -100;
			dirLight.shadow.camera.left = -120;
			dirLight.shadow.camera.right = -120;
			this.scene.add(dirLight);

			// test
			const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);

			this.scene.add(ambientLight);

			const pointLight = new THREE.PointLight(0xffffff, 0.8);

			this.camera.add(pointLight);
			this.scene.add(this.camera);

			// ground
			// const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false}));
			// mesh.rotation.x = Math.PI/2;
			// mesh.receiveShadow = true;
			// this.scene.add( mesh );

			// const grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000);
			// grid.material.opacity = 0.2;
			// grid.material.transparent = true;
			// this.scene.add(grid);

			// model
			this.loader = new FBXLoader();
			this.loader.load(
				"./fbx/Capoeira.fbx",
				(model) => {
					this.mixer = new THREE.AnimationMixer(model);

					model.scale.set(2, 2, 2);
					model.position.set(0, 0, -110);

					// character action
					const action = this.mixer.clipAction(model.animations[0]);

					action.play();

					model.traverse((child) => {
						if (child.isMesh) {
							child.castShadow = true;
							child.receiveShadow = true;
						}
					});

					this.scene.add(model);
				},
				undefined,
				(error) => {
					// console.log(error);
				}
			);

			// controls
			this.controls = new OrbitControls(this.camera, this.renderer.domElement);
			this.controls.target.set(0, 100, 0);
			this.controls.update();

			window.addEventListener("resize", this.onWindowResize, false);

			// stats
			// this.stats = new Stats();
			// container.appendChild(this.stats.dom);
		},
		onWindowResize() {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(window.innerWidth, window.innerHeight);
		},
		animate() {
			requestAnimationFrame(this.animate);
			const delta = this.clock.getDelta();

			if (this.mixer) this.mixer.update(delta);

			// background setclear
			// this.renderer.setClearColor( 0xffffff, 0);

			this.renderer.render(this.scene, this.camera);

			// this.stats.update();

			// keyboard
		},
	},
	mounted() {
		this.init();
		this.animate();
		this.videoSources = ["/videos/rolling.mp4", "/videos/tree.mp4"];
		this.videoSource = this.videoSources[this.stage];
	},
	created() {
		EventBus.$on("next-step", () => {
			if (this.stage < 1) {
				this.stage++;
				this.videoSource = this.videoSources[this.stage];
				console.log(this.videoSource);
			}
		});
	},
};
</script>

<style scoped>
#vid {
	position: absolute;
	min-width: 100%;
	min-height: 100%;
	width: auto;
	height: auto;
	z-index: -1;
}
</style>
