<!-- src/views/EventsView.vue -->
<template>
	<div
		id="eventsView"
		:class="{ animate: animateView }"
		:style="{ 'animation-delay': animationDelay }"
		class="content-container"
	>
		<section id="events" :class="{ animate: animate }" class="section-container">
			<div class="section-header clipped-medium-backward">
				<img src="/icons/clockwork.svg" />
				<h1>BEATS</h1>
			</div>

			<div class="section-content-container">
				<div class="events-list-container">
					<Event
						v-for="item in events"
						:key="item.title"
						:event="item"
						:animate="animate"
						@select-event="selectEvent(item)"
					/>
				</div>
			</div>
		</section>

		<section id="events-logs" :class="{ animate: animate }" class="section-container">
			<div style="height: 52px; overflow: hidden">
				<div class="section-header clipped-medium-backward-events-logs">
					<img src="/icons/conversation.svg" />
					<h1>EVENT LOG</h1>
				</div>
				<div class="rhombus-back">&nbsp;</div>
			</div>

			<div class="section-content-container extra-margins">
				<div class="event" v-if="selectedEvent && selectedEvent.title">
					<div class="name">
						<h1>{{ selectedEvent.location }} // {{ selectedEvent.time }}</h1>
						<h2>{{ selectedEvent.title }}</h2>
					</div>

					<img
						v-if="selectedEvent.image"
						:src="resolvePublicImagesSrc(selectedEvent.image)"
						alt=""
						style="max-width: 100%; height: auto; display: block; margin: 12px 0;"
					/>

					<vue-markdown-it :source="markdownSource" class="markdown" />
				</div>
			</div>
		</section>
	</div>
</template>

<script>
import { VueMarkdownIt } from "@f3ve/vue-markdown-it";
import Event from "@/components/Event.vue";

export default {
	components: {
		VueMarkdownIt,
		Event,
	},
	props: {
		animate: {
			type: Boolean,
			required: true,
		},
		events: {
			type: Array,
			required: true,
		},
	},
	data() {
		return {
			selectedEvent: {},
		};
	},
	computed: {
		markdownSource() {
			const src = (this.selectedEvent && this.selectedEvent.content) || "";
			return this.rewriteMarkdownImagePathsToPublicImages(src);
		},
	},
	methods: {
		selectEvent(event) {
			this.selectedEvent = event || {};
		},

		isExternalUrl(value) {
			return /^(https?:)?\/\//i.test(value) || /^data:/i.test(value);
		},

		stripMarkdownAngleBrackets(url) {
			const s = String(url).trim();
			if (s.startsWith("<") && s.endsWith(">")) return s.slice(1, -1).trim();
			return s;
		},

		normalizeLocalPath(path) {
			// Remove leading ./ or /, keep inner folders.
			return String(path).trim().replace(/^\.?\/*/, "");
		},

		resolvePublicImagesSrc(input) {
			if (!input) return "";
			const raw = this.stripMarkdownAngleBrackets(String(input).trim());

			// Keep external + already-absolute paths untouched
			if (this.isExternalUrl(raw) || raw.startsWith("/")) return raw;

			return `/images/${this.normalizeLocalPath(raw)}`;
		},

		rewriteMarkdownImagePathsToPublicImages(markdown) {
			/**
			 * Rewrites markdown image URLs:
			 *   ![alt](file.png)           -> ![alt](/images/file.png)
			 *   ![alt](folder/file.png)    -> ![alt](/images/folder/file.png)
			 *   ![alt](<Rio Grande.png>)   -> ![alt](/images/Rio Grande.png) (keeps wrapping)
			 *
			 * Leaves:
			 *   ![alt](/images/file.png)
			 *   ![alt](/anything-absolute)
			 *   ![alt](https://...)
			 *   ![alt](data:...)
			 */
			const re = /!\[([^\]]*)\]\((<[^>]+>|[^)]+?)(\s+"[^"]*")?\)/g;

			return String(markdown).replace(re, (full, alt, rawUrl, title = "") => {
				let url = String(rawUrl).trim();

				const wasWrapped = url.startsWith("<") && url.endsWith(">");
				url = this.stripMarkdownAngleBrackets(url).replace(/^['"]|['"]$/g, "");

				if (this.isExternalUrl(url) || url.startsWith("/")) return full;

				const rewritten = `/images/${this.normalizeLocalPath(url)}`;

				// If the original used <...> or the filename contains spaces, wrap to keep markdown valid.
				const finalUrl = (wasWrapped || /\s/.test(url)) ? `<${rewritten}>` : rewritten;

				return `![${alt}](${finalUrl}${title})`;
			});
		},
	},
};
</script>
