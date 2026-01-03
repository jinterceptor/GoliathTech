<!-- src/components/BootScreen.vue -->
<template>
	<div class="boot-overlay" :class="{ exiting }" @pointerdown.prevent="enter">
		<div class="monitor">
			<div class="monitor-header">
				<span class="dot" />
				<span class="dot" />
				<span class="dot" />
				<div class="title">TASK FORCE INDIGO OMNINET LINK</div>
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
