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
						v-for="item in eventsForList"
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
	components: { VueMarkdownIt, Event },
	props: {
		animate: { type: Boolean, required: true },
		events: { type: Array, required: true },
	},
	data() {
		return {
			selectedEvent: {},
		};
	},
	computed: {
		eventsForList() {
			return (this.events || []).map((e) => {
				const extracted = this.extractFirstMarkdownImage(e?.content || "");
				const image = e?.image || extracted || "";
				return {
					...e,
					image: image ? this.resolvePublicImagesSrc(image) : "",
				};
			});
		},
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
			return String(path).trim().replace(/^\.?\/*/, "");
		},
		resolvePublicImagesSrc(input) {
			if (!input) return "";
			const raw = this.stripMarkdownAngleBrackets(String(input).trim()).replace(/^['"]|['"]$/g, "");

			if (this.isExternalUrl(raw) || raw.startsWith("/")) return raw;

			return `/images/${this.normalizeLocalPath(raw)}`;
		},

		extractFirstMarkdownImage(markdown) {
			// Matches: ![alt](url) or ![alt](<url with spaces>)
			const re = /!\[[^\]]*]\((<[^>]+>|[^)]+?)\)/g;
			const m = re.exec(String(markdown));
			if (!m) return "";
			return this.stripMarkdownAngleBrackets(m[1]);
		},

		rewriteMarkdownImagePathsToPublicImages(markdown) {
			const re = /!\[([^\]]*)\]\((<[^>]+>|[^)]+?)(\s+"[^"]*")?\)/g;

			return String(markdown).replace(re, (full, alt, rawUrl, title = "") => {
				let url = String(rawUrl).trim();
				const wasWrapped = url.startsWith("<") && url.endsWith(">");

				url = this.stripMarkdownAngleBrackets(url).replace(/^['"]|['"]$/g, "");

				if (this.isExternalUrl(url) || url.startsWith("/")) return full;

				const rewritten = `/images/${this.normalizeLocalPath(url)}`;
				const finalUrl = wasWrapped || /\s/.test(url) ? `<${rewritten}>` : rewritten;

				return `![${alt}](${finalUrl}${title})`;
			});
		},
	},
};
</script>

<!-- ------------------------------------------------------------ -->

<!-- src/components/Event.vue (add thumbnail support) -->
<template>
	<div class="event-card" @click="$emit('select-event')">
		<img
			v-if="event && event.image"
			:src="event.image"
			alt=""
			class="event-thumb"
			loading="lazy"
		/>
		<div class="event-meta">
			<h3 class="event-title">{{ event.title }}</h3>
			<p class="event-sub">{{ event.location }} // {{ event.time }}</p>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		event: { type: Object, required: true },
		animate: { type: Boolean, required: true },
	},
};
</script>

<style scoped>
.event-card {
	display: flex;
	gap: 12px;
	align-items: center;
	cursor: pointer;
}

.event-thumb {
	width: 72px;
	height: 72px;
	object-fit: cover;
	border-radius: 6px;
	flex: 0 0 auto;
}

.event-meta {
	min-width: 0;
}

.event-title {
	margin: 0;
}

.event-sub {
	margin: 0;
	opacity: 0.8;
}
</style>
