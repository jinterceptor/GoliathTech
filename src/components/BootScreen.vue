<!-- src/components/BootScreen.vue -->
<template>
	<div class="boot-overlay" :class="{ exiting }" @pointerdown.prevent="enter">
		<div class="monitor">
			<div class="monitor-header">
				<span class="dot" />
				<span class="dot" />
				<span class="dot" />
				<div class="title">GOLIATH TECH // ORBAT TERMINAL</div>
			</div>

			<div class="monitor-body">
				<div class="scanlines" aria-hidden="true" />
				<div class="flicker" aria-hidden="true" />

				<div class="boot-text">
					<div class="line">INITIALIZING SYSTEMS…</div>
					<div class="line dim">LINK: CRESSIDIUM RELAY</div>

					<div class="progress">
						<div class="bar" :class="{ booting }" />
					</div>

					<div class="line dim" v-if="!booting">CLICK TO ENTER</div>
					<div class="line" v-else>ACCESS GRANTED</div>

					<div class="small dim">
						<span class="caret" /> secure handshake required
					</div>
				</div>
			</div>

			<div class="monitor-footer dim">
				<span>SYS</span>
				<span>OK</span>
				<span>NET</span>
				<span v-if="!booting">IDLE</span>
				<span v-else>BOOT</span>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "BootScreen",
	emits: ["enter", "done"],
	data() {
		return {
			booting: false,
			exiting: false,
		};
	},
	methods: {
		enter() {
			if (this.booting || this.exiting) return;

			this.booting = true;
			this.$emit("enter");

			// Give the user a moment of “boot” feel, then fade out.
			window.setTimeout(() => {
				this.exiting = true;
				window.setTimeout(() => this.$emit("done"), 550);
			}, 800);
		},
	},
};
</script>

<style scoped>
.boot-overlay {
	position: fixed;
	inset: 0;
	z-index: 99999;
	display: grid;
	place-items: center;
	background: radial-gradient(ellipse at center, rgba(12, 25, 20, 0.96), rgba(0, 0, 0, 0.98));
	color: rgba(190, 255, 220, 0.92);
	text-transform: uppercase;
	letter-spacing: 0.08em;
	user-select: none;
	cursor: pointer;
	opacity: 1;
	transition: opacity 550ms ease;
}

.boot-overlay.exiting {
	opacity: 0;
	pointer-events: none;
}

.monitor {
	width: min(860px, 92vw);
	border-radius: 14px;
	border: 1px solid rgba(180, 255, 220, 0.25);
	box-shadow:
		0 0 0 1px rgba(180, 255, 220, 0.07) inset,
		0 0 24px rgba(120, 255, 200, 0.12),
		0 0 90px rgba(0, 0, 0, 0.6);
	background: linear-gradient(180deg, rgba(8, 18, 14, 0.92), rgba(3, 8, 6, 0.95));
	overflow: hidden;
}

.monitor-header {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 10px 14px;
	border-bottom: 1px solid rgba(180, 255, 220, 0.14);
	background: rgba(0, 0, 0, 0.25);
}

.dot {
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background: rgba(180, 255, 220, 0.25);
	box-shadow: 0 0 8px rgba(120, 255, 200, 0.15);
}

.title {
	margin-left: 6px;
	font-size: 12px;
	opacity: 0.9;
}

.monitor-body {
	position: relative;
	padding: 28px 22px 26px;
	min-height: 240px;
}

.boot-text {
	position: relative;
	z-index: 2;
	font-size: 14px;
	line-height: 1.7;
	text-shadow: 0 0 10px rgba(120, 255, 200, 0.12);
}

.line {
	margin: 2px 0;
}

.dim {
	opacity: 0.7;
}

.small {
	margin-top: 12px;
	font-size: 12px;
}

.caret {
	display: inline-block;
	width: 10px;
	height: 14px;
	margin-right: 8px;
	border-left: 2px solid rgba(190, 255, 220, 0.9);
	animation: blink 1.1s infinite;
	transform: translateY(2px);
}

@keyframes blink {
	0%, 45% { opacity: 1; }
	46%, 100% { opacity: 0; }
}

.progress {
	margin: 14px 0 10px;
	height: 10px;
	border-radius: 999px;
	border: 1px solid rgba(180, 255, 220, 0.22);
	background: rgba(0, 0, 0, 0.35);
	overflow: hidden;
}

.bar {
	height: 100%;
	width: 0%;
	background: linear-gradient(90deg, rgba(120, 255, 200, 0.2), rgba(190, 255, 220, 0.85));
	box-shadow: 0 0 18px rgba(120, 255, 200, 0.22);
	transition: width 700ms ease;
}

.bar.booting {
	width: 100%;
}

.scanlines {
	position: absolute;
	inset: 0;
	background: repeating-linear-gradient(
		to bottom,
		rgba(255, 255, 255, 0.025),
		rgba(255, 255, 255, 0.025) 1px,
		rgba(0, 0, 0, 0) 3px,
		rgba(0, 0, 0, 0) 6px
	);
	mix-blend-mode: overlay;
	opacity: 0.35;
	pointer-events: none;
}

.flicker {
	position: absolute;
	inset: -20%;
	background: radial-gradient(circle at 30% 20%, rgba(120, 255, 200, 0.08), transparent 55%);
	animation: flicker 2.6s infinite;
	pointer-events: none;
	opacity: 0.9;
}

@keyframes flicker {
	0%, 100% { transform: translate3d(0,0,0); opacity: 0.75; }
	10% { transform: translate3d(-1px, 1px, 0); opacity: 0.85; }
	20% { transform: translate3d(1px, -1px, 0); opacity: 0.7; }
	35% { transform: translate3d(0px, 2px, 0); opacity: 0.9; }
	60% { transform: translate3d(2px, 0px, 0); opacity: 0.78; }
}

.monitor-footer {
	display: flex;
	justify-content: space-between;
	padding: 10px 14px;
	border-top: 1px solid rgba(180, 255, 220, 0.14);
	background: rgba(0, 0, 0, 0.22);
	font-size: 12px;
}
</style>


<!-- src/App.vue (only the needed additions/changes shown as a full file) -->
<template>
	<BootScreen v-if="!hasEntered" @enter="onEnterBoot" @done="hasEntered = true" />

	<div v-show="hasEntered">
		<div class="page-wrapper">
			<Header :planet-path="planetPath" :class="{ animate: animate }" :header="header" />
			<Sidebar :animate="animate" :class="{ animate: animate }" />
		</div>
		<div id="router-view-container">
			<router-view
				:animate="animate"
				:initial-slug="initialSlug"
				:missions="missions"
				:events="events"
				:pilots="pilots"
				:clocks="clocks"
				:reserves="reserves"
			/>
		</div>

		<svg
			style="visibility: hidden; position: absolute"
			width="0"
			height="0"
			xmlns="http://www.w3.org/2000/svg"
			version="1.1"
		>
			<defs>
				<filter id="round">
					<feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
					<feColorMatrix
						in="blur"
						mode="matrix"
						values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -5"
						result="goo"
					/>
					<feComposite in="SourceGraphic" in2="goo" operator="atop" />
				</filter>
			</defs>
		</svg>
	</div>
</template>

<script>
import Header from "./components/layout/Header.vue";
import Sidebar from "./components/layout/Sidebar.vue";
import BootScreen from "@/components/BootScreen.vue";
import Config from "@/assets/info/general-config.json";
import sfx from "@/services/sfx";

export default {
	components: {
		Header,
		Sidebar,
		BootScreen,
	},

	data() {
		return {
			hasEntered: false,

			animate: Config.animate,
			initialSlug: Config.initialSlug,
			planetPath: Config.planetPath,
			header: Config.header,
			pilotSpecialInfo: Config.pilotSpecialInfo,
			clocks: [],
			events: [],
			missions: [],
			pilots: [],
			reserves: [],
			bonds: [],
		};
	},
	created() {
		this.setTitleFavicon(Config.defaultTitle + " MISSION BRIEFING", Config.icon);
		this.importMissions(import.meta.glob("@/assets/missions/*.md", { query: "?raw", import: "default" }));
		this.importEvents(import.meta.glob("@/assets/events/*.md", { query: "?raw", import: "default" }));
		this.importClocks(import.meta.glob("@/assets/clocks/*.json"));
		this.importReserves(import.meta.glob("@/assets/reserves/*.json"));
		this.importPilots(import.meta.glob("@/assets/pilots/*.json"));
	},
	mounted() {
		this.$router.push("/status");
	},
	methods: {
		async onEnterBoot() {
			// Unlock SFX on first user gesture (safe even if already unlocked)
			try {
				await sfx.unlock();
			} catch {
				// ignore
			}

			// Play startup sound on user gesture (autoplay policy compliant)
			try {
				const a = new Audio(encodeURI("/sounds/startup.ogg"));
				a.preload = "auto";
				a.currentTime = 0;
				await a.play();
			} catch {
				// ignore (browser policy / missing codec)
			}
		},

		setTitleFavicon(title, favicon) {
			document.title = title;
			let headEl = document.querySelector("head");
			let faviconEl = document.createElement("link");
			faviconEl.setAttribute("rel", "shortcut icon");
			faviconEl.setAttribute("href", favicon);
			headEl.appendChild(faviconEl);
		},

		async importMissions(files) {
			let filePromises = Object.keys(files).map((path) => files[path]());
			let fileContents = await Promise.all(filePromises);
			fileContents.forEach((content) => {
				let mission = {};
				mission["slug"] = content.split("\n")[0];
				mission["name"] = content.split("\n")[1];
				mission["status"] = content.split("\n")[2];
				mission["content"] = content.split("\n").splice(3).join("\n");
				this.missions = [...this.missions, mission];
			});
			this.missions = this.missions.sort(function (a, b) {
				return b["slug"] - a["slug"];
			});
		},

		async importEvents(files) {
			let filePromises = Object.keys(files).map((path) => files[path]());
			let fileContents = await Promise.all(filePromises);
			fileContents.forEach((content) => {
				let event = {};
				event["title"] = content.split("\n")[0];
				event["location"] = content.split("\n")[1];
				event["time"] = content.split("\n")[2];
				event["thumbnail"] = content.split("\n")[3];
				event["content"] = content.split("\n").splice(4).join("\n");
				this.events = [...this.events, event];
			});
			this.events = this.events.reverse();
		},

		async importClocks(files) {
			let filePromises = Object.keys(files).map((path) => files[path]());
			let fileContents = await Promise.all(filePromises);
			fileContents.forEach((content) => {
				this.clocks = JSON.parse(JSON.stringify(content)).default;
			});
		},
		async importReserves(files) {
			let filePromises = Object.keys(files).map((path) => files[path]());
			let fileContents = await Promise.all(filePromises);
			fileContents.forEach((content) => {
				this.reserves = JSON.parse(JSON.stringify(content)).default;
			});
		},
		async importPilots(files) {
			let filePromises = Object.keys(files).map((path) => files[path]());
			let fileContents = await Promise.all(filePromises);
			fileContents.forEach((content) => {
				let pilotFromJson = JSON.parse(JSON.stringify(content));
				pilotFromJson.name = pilotFromJson.name.replace("※", "");
				pilotFromJson.callsign = pilotFromJson.callsign.replace("※", "");
				let pilotFromVue = this.pilotSpecialInfo[pilotFromJson.callsign.toUpperCase()];
				let pilot = {
					...pilotFromJson,
					...pilotFromVue,
				};
				this.pilots = [...this.pilots, pilot];
				pilot.clocks.forEach((content) => {
					let clock = {};
					clock["type"] = `Pilot Project // ${pilot.callsign}`;
					clock["result"] = "";
					clock["name"] = content.title;
					clock["description"] = content.description;
					clock["value"] = content.progress;
					clock["max"] = content.segments;
					clock["color"] = "#3CB043";
					this.clocks = [...this.clocks, clock];
				});

				pilot.reserves.forEach((content) => {
					let reserve = {};
					reserve["type"] = content.type;
					reserve["name"] = content.name;
					reserve["description"] = content.description;
					reserve["label"] = content.label;
					reserve["cost"] = content.cost;
					reserve["notes"] = content.notes;
					reserve["callsign"] = pilot.callsign.toUpperCase();
					this.reserves = [...this.reserves, reserve];
				});
			});
		},
	},
};
</script>

<style>
#app {
	min-height: 100vh;
	overflow: hidden !important;
}
</style>
