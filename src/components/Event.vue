<!-- src/components/Event.vue -->
<template>
	<div class="event">
		<div class="name">
			<h1>{{ event.location }} // {{ event.time }}</h1>
			<h2>{{ event.title }}</h2>
		</div>

		<img v-if="thumbnailSrc" class="thumbnail" :src="thumbnailSrc" />

		<div class="preview">
			{{ getPreview }}
		</div>
		<a @click.prevent="selectEvent">Read More</a>
	</div>
</template>

<script>
import EventModal from "@/components/modals/EventModal.vue";
import removeMd from "remove-markdown";

export default {
	name: "Event",
	components: {
		EventModal,
	},
	props: {
		event: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			removeMd,
		};
	},
	computed: {
		getPreview() {
			const raw = String(this.event?.content ?? "");
			const beforeFirstHeader = this.takeBeforeFirstMarkdownHeader(raw);

			const text = this.removeMd(beforeFirstHeader)
				.replace(/\s+/g, " ")
				.trim();

			if (!text) return "";

			const maxLen = 200;
			return text.length > maxLen ? `${text.slice(0, maxLen)}...` : text;
		},

		thumbnailSrc() {
			const line = String(this.event?.thumbnail ?? "").trim();
			if (!line) return "";

			const extracted =
				this.extractFirstMarkdownImage(line) ||
				this.extractFirstMarkdownLink(line) ||
				line;

			return this.toPublicImagesSrc(extracted);
		},
	},
	methods: {
		selectEvent() {
			this.$emit("select-event", this.event);
		},

		// Only show preview content before the first markdown header line (e.g. "#", "##", "###", etc.)
		takeBeforeFirstMarkdownHeader(markdown) {
			const lines = String(markdown).split(/\r?\n/);
			const out = [];

			for (const line of lines) {
				if (/^\s*#{1,6}\s+/.test(line)) break;
				out.push(line);
			}

			return out.join("\n").trim();
		},

		toPublicImagesSrc(input) {
			const s = String(input || "").trim();
			if (!s) return "";

			if (/^(https?:)?\/\//i.test(s) || /^data:/i.test(s)) return s;
			if (s.startsWith("/")) return encodeURI(s);

			const rel = s.replace(/^\.?\/*/, "");
			return encodeURI(`/images/${rel}`);
		},

		extractFirstMarkdownImage(markdown) {
			const re = /!\[[^\]]*]\((<[^>]+>|[^)]+?)\)/;
			const match = re.exec(String(markdown));
			if (!match) return "";

			let url = String(match[1]).trim();
			if (url.startsWith("<") && url.endsWith(">")) url = url.slice(1, -1).trim();
			return url;
		},

		extractFirstMarkdownLink(markdown) {
			const re = /\[[^\]]*]\((<[^>]+>|[^)]+?)\)/;
			const match = re.exec(String(markdown));
			if (!match) return "";

			let url = String(match[1]).trim();
			if (url.startsWith("<") && url.endsWith(">")) url = url.slice(1, -1).trim();
			return url;
		},
	},
};
</script>
