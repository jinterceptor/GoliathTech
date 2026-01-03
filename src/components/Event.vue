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
			const explicit = this.event?.thumbnail;
			if (explicit) return this.toPublicImagesSrc(explicit);

			const extracted = this.extractFirstMarkdownImage(this.event?.content || "");
			if (extracted) return this.toPublicImagesSrc(extracted);

			return "";
		},
	},
	methods: {
		selectEvent() {
			this.$emit("select-event", this.event);
		},

		toPublicImagesSrc(input) {
			const s = String(input || "").trim();
			if (!s) return "";

			// external/data URLs and already-absolute paths stay as-is
			if (/^(https?:)?\/\//i.test(s) || /^data:/i.test(s) || s.startsWith("/")) return s;

			// relative file -> served from public/images
			return `/images/${s.replace(/^\.?\/*/, "")}`;
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
	},
};
</script>
