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

					<!-- Optional: if your event objects have an `image` field -->
					<img
						v-if="selectedEvent.image"
						:src="resolveImageSrc(selectedEvent.image)"
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
			selectedEvent: {}, // ✅ fix: data should be the actual object, not a "type" descriptor
		};
	},
	computed: {
		markdownSource() {
			const src = (this.selectedEvent && this.selectedEvent.content) || "";
			return this.rewriteMarkdownImagePaths(src);
		},
	},
	methods: {
		selectEvent(event) {
			this.selectedEvent = event || {};
		},

		resolveImageSrc(input) {
			if (!input) return "";
			const s = String(input).trim();

			// Keep absolute/external sources untouched
			if (this.isExternalUrl(s) || s.startsWith("/")) return s;

			// Treat as file under public/images/
			return `/images/${s.replace(/^\.?\/*/, "")}`;
		},

		rewriteMarkdownImagePaths(markdown) {
			// Rewrites: ![alt](file.png) -> ![alt](/images/file.png)
			// Leaves:  ![alt](/images/file.png) and ![alt](https://...) as-is
			const re = /!\[([^\]]*)\]\(([^)\s]+)(\s+"[^"]*")?\)/g;

			return String(markdown).replace(re, (full, alt, url, title = "") => {
				const rawUrl = String(url).trim().replace(/^['"]|['"]$/g, "");

				if (this.isExternalUrl(rawUrl) || rawUrl.startsWith("/")) return full;

				const rewritten = `/images/${rawUrl.replace(/^\.?\/*/, "")}`;
				return `![${alt}](${rewritten}${title})`;
			});
		},

		isExternalUrl(value) {
			return /^(https?:)?\/\//i.test(value) || /^data:/i.test(value);
		},
	},
};
</script>
