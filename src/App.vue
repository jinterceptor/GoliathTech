<!-- src/App.vue -->
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
			// unlock other UI SFX on first user gesture
			try {
				await sfx.unlock();
			} catch {
				// ignore
			}

			// play startup sound on user gesture (autoplay-policy safe)
			try {
				const base = import.meta.env.BASE_URL || "/";
				const audio = new Audio(encodeURI(`${base}sounds/startup.ogg`));
				audio.preload = "auto";
				audio.currentTime = 0;
				await audio.play();
			} catch {
				// ignore
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

		// --- added (needed for event thumbnails) ---
		isExternalUrl(value) {
			return /^(https?:)?\/\//i.test(value) || /^data:/i.test(value);
		},
		normalizeEventThumbnailToUrl(thumbnailLine) {
			const line = String(thumbnailLine ?? "").trim();
			if (!line) return "";

			let url = line;

			const mdImage = /!\[[^\]]*]\((<[^>]+>|[^)]+?)\)/.exec(line);
			const mdLink = /\[[^\]]*]\((<[^>]+>|[^)]+?)\)/.exec(line);

			if (mdImage?.[1]) url = mdImage[1];
			else if (mdLink?.[1]) url = mdLink[1];

			url = String(url).trim();

			if (url.startsWith("<") && url.endsWith(">")) url = url.slice(1, -1).trim();

			if (this.isExternalUrl(url)) return url;

			if (url.startsWith("/")) return encodeURI(url);

			const rel = url.replace(/^\.?\/*/, "");
			return encodeURI(`/images/${rel}`);
		},
		// --- end added ---

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
				const lines = String(content).split(/\r?\n/);

				let event = {};
				event["title"] = lines[0] ?? "";
				event["location"] = lines[1] ?? "";
				event["time"] = lines[2] ?? "";
				event["thumbnail"] = this.normalizeEventThumbnailToUrl(lines[3] ?? "");
				event["content"] = lines.slice(4).join("\n");

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
	/* border-right: 1px solid #ff0;
	border-bottom: 1px solid #ff0; */
}
</style>
