<!-- src/components/BootScreen.vue -->
<template>
	<div class="boot" :class="{ exiting }" @pointerdown.prevent="enter">
		<div class="monitor">
			<div class="hdr">
				<span class="dot"></span><span class="dot"></span><span class="dot"></span>
				<div class="title">TASK FORCE INDIGO OMNINET LINK</div>
			</div>

			<div class="body">
				<div class="scanlines" aria-hidden="true"></div>
				<div class="flicker" aria-hidden="true"></div>

				<div class="txt">
					<div v-for="(l, i) in typedMainLines" :key="`m-${i}`" class="line" :class="{ dim: l.dim }">
						{{ l.text }}
					</div>

					<div class="spacer"></div>

					<div class="flavor" ref="flavorEl">
						<div v-for="(l, i) in typedFlavorLines" :key="`f-${i}`" class="line dim">
							{{ l.text }}
						</div>
						<div class="line dim" v-if="!typedDone"><span class="caret"></span></div>
					</div>

					<div class="progress">
						<div class="bar" :class="{ booting }"></div>
					</div>

					<div class="line">CLICK TO ESTABLISH HANDSHAKE</div>
					<div class="line" v-if="booting">HANDSHAKE ACCEPTED // CHANNEL OPEN</div>

					<div class="small dim">
						<span class="caret"></span>
						LOCAL AUDIO LOCKOUT ACTIVE UNTIL USER INPUT
					</div>
				</div>
			</div>

			<div class="ftr dim">
				<span>SYS: OK</span>
				<span>NHP: CAGED</span>
				<span>NET: {{ booting ? "LINK" : "IDLE" }}</span>
				<span>SEC: GREEN</span>
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

			mainLines: [
				{ text: "BOOT SEQUENCE: GMS/UNION FIELD TERMINAL", dim: false },
				{ text: "ROUTE: DEEP SPACE RELAY // CRESSIDIUM VECTOR", dim: true },
				{ text: "AUTHORITY: UNION NAVCOM // TF INDIGO", dim: true },
			],
			flavorLines: [
				"» NHP INTERFACE: CAGED // STABLE",
				"» BLINKSPACE LATENCY: VARIABLE // ACCEPTABLE",
				"» CORPRO STATE TRAFFIC: FILTERED // MONITORED",
				"» PILOT BIOMETRICS: REQUIRED FOR AUDIO CHANNEL",
			],

			typedMainLines: [],
			typedFlavorLines: [],

			mainIndex: 0,
			flavorIndex: 0,
			charIndex: 0,
			section: "main",
			typedDone: false,
			timer: null,
		};
	},
	mounted() {
		this.startTyping();
	},
	beforeUnmount() {
		if (this.timer) window.clearTimeout(this.timer);
	},
	methods: {
		enter() {
			if (this.booting || this.exiting) return;

			this.booting = true;
			this.$emit("enter");

			if (this.timer) {
				window.clearTimeout(this.timer);
				this.timer = null;
			}

			window.setTimeout(() => {
				this.exiting = true;
				window.setTimeout(() => this.$emit("done"), 520);
			}, 850);
		},

		startTyping() {
			const minDelay = 14;
			const maxDelay = 34;

			const tick = async () => {
				if (this.typedDone || this.exiting) {
					this.timer = null;
					return;
				}

				if (this.section === "main") {
					if (this.mainIndex >= this.mainLines.length) {
						this.section = "flavor";
						this.charIndex = 0;
						this.timer = window.setTimeout(tick, 120);
						return;
					}

					const target = this.mainLines[this.mainIndex];
					if (this.typedMainLines.length <= this.mainIndex) {
						this.typedMainLines.push({ text: "", dim: target.dim });
					}

					this.typedMainLines[this.mainIndex].text = target.text.slice(0, this.charIndex + 1);
					this.charIndex += 1;

					if (this.charIndex >= target.text.length) {
						this.mainIndex += 1;
						this.charIndex = 0;
						this.timer = window.setTimeout(tick, 220);
						return;
					}
				} else {
					if (this.flavorIndex >= this.flavorLines.length) {
						this.typedDone = true;
						this.timer = null;
						return;
					}

					const target = this.flavorLines[this.flavorIndex];
					if (this.typedFlavorLines.length <= this.flavorIndex) {
						this.typedFlavorLines.push({ text: "" });
					}

					this.typedFlavorLines[this.flavorIndex].text = target.slice(0, this.charIndex + 1);
					this.charIndex += 1;

					await this.$nextTick();
					if (this.$refs.flavorEl) {
						this.$refs.flavorEl.scrollTop = this.$refs.flavorEl.scrollHeight;
					}

					if (this.charIndex >= target.length) {
						this.flavorIndex += 1;
						this.charIndex = 0;
						this.timer = window.setTimeout(tick, 220);
						return;
					}
				}

				const jitter = Math.floor(minDelay + Math.random() * (maxDelay - minDelay));
				const extra = Math.random() < 0.06 ? 90 : 0;
				this.timer = window.setTimeout(tick, jitter + extra);
			};

			tick();
		},
	},
};
</script>

<style scoped>
/* Light blue theme */
.boot {
	position: fixed;
	inset: 0;
	z-index: 99999;
	display: grid;
	place-items: center;
	cursor: pointer;
	user-select: none;
	background: radial-gradient(ellipse at center, rgba(10, 18, 32, 0.96), rgba(0, 0, 0, 0.98));
	color: rgba(205, 230, 255, 0.94);
	text-transform: uppercase;
	letter-spacing: 0.08em;
	opacity: 1;
	transition: opacity 520ms ease;
}

.boot.exiting {
	opacity: 0;
	pointer-events: none;
}

.monitor {
	width: min(860px, 92vw);
	border-radius: 14px;
	border: 1px solid rgba(170, 210, 255, 0.22);
	background: linear-gradient(180deg, rgba(8, 14, 28, 0.92), rgba(3, 6, 14, 0.96));
	overflow: hidden;
	box-shadow:
		0 0 0 1px rgba(170, 210, 255, 0.06) inset,
		0 0 24px rgba(120, 170, 255, 0.10),
		0 0 90px rgba(0, 0, 0, 0.6);
}

.hdr {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 12px 14px;
	border-bottom: 1px solid rgba(170, 210, 255, 0.12);
	background: rgba(0, 0, 0, 0.16);
}

.dot {
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background: rgba(170, 210, 255, 0.22);
	box-shadow: 0 0 8px rgba(120, 170, 255, 0.12);
}

.title {
	margin-left: 6px;
	font-size: 12px;
	opacity: 0.9;
	background: transparent;
	padding: 0;
	border: 0;
	border-radius: 0;
}

.body {
	position: relative;
	padding: 28px 22px 26px;
	min-height: 260px;
}

.txt {
	position: relative;
	z-index: 2;
	font-size: 14px;
	line-height: 1.7;
	text-shadow: 0 0 10px rgba(120, 170, 255, 0.10);
}

.line {
	margin: 2px 0;
}

.dim {
	opacity: 0.7;
}

.spacer {
	height: 10px;
}

/* Flavor block scrolls as it types */
.flavor {
	margin: 6px 0 2px;
	max-height: 110px;
	overflow-y: auto;
	padding-right: 6px;
}

/* Optional: hide scrollbar without breaking scroll (keeps it clean) */
.flavor::-webkit-scrollbar {
	width: 6px;
}
.flavor::-webkit-scrollbar-thumb {
	background: rgba(170, 210, 255, 0.15);
	border-radius: 999px;
}
.flavor::-webkit-scrollbar-track {
	background: transparent;
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
	border-left: 2px solid rgba(205, 230, 255, 0.92);
	animation: blink 1.1s infinite;
	transform: translateY(2px);
}

@keyframes blink {
	0%,
	45% {
		opacity: 1;
	}
	46%,
	100% {
		opacity: 0;
	}
}

.progress {
	margin: 14px 0 10px;
	height: 10px;
	border-radius: 999px;
	border: 1px solid rgba(170, 210, 255, 0.20);
	background: rgba(0, 0, 0, 0.34);
	overflow: hidden;
}

.bar {
	height: 100%;
	width: 0%;
	background: linear-gradient(90deg, rgba(120, 170, 255, 0.18), rgba(205, 230, 255, 0.80));
	box-shadow: 0 0 18px rgba(120, 170, 255, 0.18);
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
		rgba(255, 255, 255, 0.02),
		rgba(255, 255, 255, 0.02) 1px,
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
	background: radial-gradient(circle at 30% 20%, rgba(120, 170, 255, 0.07), transparent 55%);
	animation: flicker 2.6s infinite;
	pointer-events: none;
	opacity: 0.9;
}

@keyframes flicker {
	0%,
	100% {
		transform: translate3d(0, 0, 0);
		opacity: 0.75;
	}
	10% {
		transform: translate3d(-1px, 1px, 0);
		opacity: 0.85;
	}
	20% {
		transform: translate3d(1px, -1px, 0);
		opacity: 0.7;
	}
	35% {
		transform: translate3d(0px, 2px, 0);
		opacity: 0.9;
	}
	60% {
		transform: translate3d(2px, 0px, 0);
		opacity: 0.78;
	}
}

.ftr {
	display: flex;
	justify-content: space-between;
	padding: 10px 14px;
	border-top: 1px solid rgba(170, 210, 255, 0.12);
	background: rgba(0, 0, 0, 0.16);
	font-size: 12px;
}
</style>
