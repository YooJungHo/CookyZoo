<template>
	<div>
		<div id="motion">
			<P5 v-on="{ setup, draw }" />
		</div>
		<div id="video" v-show="this.toggle">
			<Video />
		</div>
	</div>
</template>

<script>
import P5 from "vue-p5";
import ml5 from "ml5";
import Video from "@/components/Video.vue";

import EventBus from "../EventBus";

export default {
	name: "Game",
	components: {
		P5,
		Video,
	},
	data() {
		return {
			video: undefined,
			poseNet: undefined,
			pose: undefined,
			skeleton: undefined,
			brain: undefined,
			learningModel: undefined,
			image: undefined,
			toggle: false,
			modelInfo: {
				model: "/model/nextmodel.json",
				metadata: "/model/nextmodel_meta.json",
				weights: "/model/nextmodel.weights.bin",
			},
			brainInfo: {
				model: "/model/model.json",
				metadata: "/model/model_meta.json",
				weights: "/model/model.weights.bin",
			},
			options: {
				input: 34,
				output: 2,
				task: "classification",
			},
			count: 0,
			modelCount: 0,
		};
	},
	methods: {
		setup(sketch) {
			sketch.createCanvas(750, 750);
			sketch.background(0);

			this.video = sketch.createCapture(sketch.VIDEO);
			this.video.size(750, 750);
			this.video.hide();

			this.poseNet = ml5.poseNet(this.video, this.Loaded);
			this.poseNet.on("pose", this.gotPoses);
			this.brain = ml5.neuralNetwork(this.options);
			this.learningModel = ml5.neuralNetwork(this.options);
			// this.modelInfo = {
			// 	model: "/model/model.json",
			// 	metadata: "/model/model_meta.json",
			// 	weights: "/model/model.weights.bin",
			// };
			this.brain.load(this.brainInfo, this.brainLoaded);
			this.learningModel.load(this.modelInfo, this.modelLoaded);

			//  몽타주 이미지
			this.image = sketch.loadImage("/images/test.png");
		},
		draw(sketch) {
			sketch.push();
			sketch.translate(this.video.width, 0);
			sketch.scale(-1, 1);
			sketch.image(this.video, 0, 0, 750, 750);
			sketch.image(this.image, 0, 0, 750, 750);

			// if (this.pose) {
			// 	for (let i = 0; i < this.skeleton.length; i++) {
			// 		const a = this.skeleton[i][0];
			// 		const b = this.skeleton[i][1];

			// 		sketch.strokeWeight(10);
			// 		sketch.stroke(0);
			// 		sketch.line(a.position.x, a.position.y, b.position.x, b.position.y);
			// 	}
			// }
			sketch.pop();

			sketch.fill(255, 255, 0);
			sketch.noStroke();
		},
		gotPoses(poses) {
			if (poses.length > 0) {
				this.pose = poses[0].pose;
				this.skeleton = poses[0].skeleton;
			}
		},
		Loaded() {},
		brainLoaded() {
			this.classifyPose();
		},
		modelLoaded() {
			this.modelClassifyPose();
		},
		classifyPose() {
			if (this.pose) {
				const inputs = [];

				for (let i = 0; i < this.pose.keypoints.length; i++) {
					const x = this.pose.keypoints[i].position.x;
					const y = this.pose.keypoints[i].position.y;

					inputs.push(x);
					inputs.push(y);
					// inputs.push(x / 7.5);
					// inputs.push(y / 7.5);
				}
				this.brain.classify(inputs, this.gotResult);
			} else {
				setTimeout(this.classifyPose, 100);
			}
		},
		modelClassifyPose() {
			if (this.pose) {
				const inputs = [];

				for (let i = 0; i < this.pose.keypoints.length; i++) {
					const x = this.pose.keypoints[i].position.x;
					const y = this.pose.keypoints[i].position.y;

					inputs.push(x);
					inputs.push(y);
					// inputs.push(x / 7.5);
					// inputs.push(y / 7.5);
				}
				this.learningModel.classify(inputs, this.modelGotResult);
			} else {
				setTimeout(this.modelClassifyPose, 100);
			}
		},
		gotResult(error, results) {
			this.classifyPose();
			let poseLabel;

			if (results[0].confidence > 0.75) {
				poseLabel = results[0].label;
			}
			if (poseLabel === "p") {
				this.count++;
			} else {
				this.count = 0;
				this.toggle = false;
			}
			if (this.count >= 5) {
				this.toggle = true;
			}
		},
		modelGotResult(error, results) {
			this.modelClassifyPose();
			let poseLabel;

			if (!this.toggle) return;
			if (results[0].confidence > 0.75) {
				poseLabel = results[0].label;
			}
			if (poseLabel === "next") {
				this.modelCount++;
			} else {
				this.modelCount = 0;
			}

			if (this.modelCount >= 20) {
				EventBus.$emit("next-step");
			}
		},
	},
};
</script>

<style scoped>
#motion {
	position: absolute;
	z-index: 0;
}

#video {
	position: absolute;
	z-index: 5;
}
</style>
