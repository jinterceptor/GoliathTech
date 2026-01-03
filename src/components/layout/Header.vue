<!-- src/components/YourHeader.vue (adjust path/name to match your project) -->
<template>
	<header class="deployment-header">
		<div class="title clipped-x-large-forward">
			<img
				class="logo"
				src="/faction-logos/Task%20Force%20Indigo.svg"
				alt="Task Force Indigo"
				decoding="async"
				loading="eager"
				fetchpriority="high"
			/>

			<div class="title-container">
				<div id="title-first-line" class="title-row">
					<span id="title-header">{{ header.headerTitle }}</span>
					<span id="title-subheader">{{ header.headerSubtitle }}</span>
				</div>
				<div class="title-row">
					<span id="subtitle-header">{{ header.subheaderTitle }}</span>
					<span id="subtitle-subheader">// {{ header.subheaderSubtitle }}</span>
				</div>
			</div>
		</div>

		<div class="rhombus"></div>

		<div class="planet-location-container">
			<video class="planet-video" autoplay muted loop playsinline>
				<source :src="planetPath" type="video/webm" />
			</video>

			<div class="location-info">
				<div id="planet-year" class="location-row">
					<div id="year">
						<h4>Year</h4>
						<span class="subtitle">{{ header.year }}</span>
					</div>
					<div id="planet">
						<h4>Deployment Info</h4>
						<span class="subtitle">{{ header.planet }}</span>
					</div>
				</div>

				<div id="system-gate-ring" class="location-row">
					<div id="ring">
						<h4>Ring</h4>
						<span class="subtitle">{{ header.ring }}</span>
					</div>
					<div id="gate">
						<h4>Gate</h4>
						<span class="subtitle">{{ header.gate }}</span>
					</div>
					<div id="system">
						<h4>System</h4>
						<span class="subtitle">{{ header.system }}</span>
					</div>
				</div>
			</div>
		</div>
	</header>
</template>

<script>
export default {
	props: {
		planetPath: {
			type: String,
			required: true,
		},
		header: {
			type: Object,
			required: true,
		},
	},
};
</script>

<style lang="scss" scoped>
/**
 * Logo squishing almost always comes from:
 * - flexbox shrinking the image
 * - global CSS that sets img { width/height: 100% }
 * - setting both width + height on the image
 *
 * These rules make the logo keep its aspect ratio no matter what.
 */

.deployment-header {
	width: 100%;
}

.title {
	display: flex;
	align-items: center;
	gap: 12px;
	min-width: 0;
}

/* Prevent flexbox from shrinking the logo and preserve aspect ratio */
.logo {
	flex: 0 0 auto; /* critical: stops flex from squashing */
	display: block;

	/* Constrain by ONE dimension; let the other be auto */
	height: 72px;
	width: auto;

	/* Safety if some other rule forces both dimensions */
	object-fit: contain;
	object-position: center;

	max-height: 72px;
}

/* Allow text to shrink without pushing/squashing the logo */
.title-container {
	min-width: 0;
}

.title-row {
	display: flex;
	align-items: baseline;
	gap: 8px;
	flex-wrap: nowrap;
}

/* Match your existing hard size but via CSS (more consistent than attributes) */
.planet-video {
	width: 90px;
	height: 90px;
	display: block;
	object-fit: cover;
}

.planet-location-container {
	display: flex;
	align-items: center;
	gap: 12px;
}
</style>
