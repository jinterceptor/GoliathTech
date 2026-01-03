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
			return this.removeMd(this.event.content).substring(0, 200) + "...";
		},

		thumbnailSrc() {
			// In this repo, `event.thumbnail` is the *raw 4th line* of the md file,
			// often like: ![](Rio Grande.png)
			const raw = (this.event && this.event.thumbnail) || "";

			const urlFromThumbLine =
				this.extractFirstMarkdownImage(raw) || this.extractFirstMarkdownLink(raw) || raw;

			const extracted = urlFromThumbLine.trim()
				? urlFromThumbLine
				: this.extractFirstMarkdownImage(this.event?.content || "");

			return extracted ? this.toPublicImagesSrc(extracted) : "";
		},
	},
	methods: {
		selectEvent() {
			this.$emit("select-event", this.event);
		},

		toPublicImagesSrc(input) {
			const s = String(input || "").trim();
			if (!s) return "";

			// external/data URLs stay as-is
			if (/^(https?:)?\/\//i.test(s) || /^data:/i.test(s)) return s;

			// absolute paths should be URL-encoded (handles "/images/Rio Grande.png")
			if (s.startsWith("/")) return encodeURI(s);

			// relative file -> served from public/images (encode spaces, etc.)
			const rel = s.replace(/^\.?\/*/, "");
			return encodeURI(`/images/${rel}`);
		},

		extractFirstMarkdownImage(markdown) {
			// ![](file.png) or ![](<file with spaces.png>)
			const re = /!\[[^\]]*]\((<[^>]+>|[^)]+?)\)/;
			const match = re.exec(String(markdown));
			if (!match) return "";

			let url = String(match[1]).trim();
			if (url.startsWith("<") && url.endsWith(">")) url = url.slice(1, -1).trim();
			return url;
		},

		extractFirstMarkdownLink(markdown) {
			// [](file.png) or [text](file.png) as a fallback
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
