// src/router/index.js
import { createMemoryHistory, createWebHistory, createRouter } from "vue-router";

import Status from "@/views/StatusView.vue";
import Pilots from "@/views/PilotsView.vue";
import Events from "@/views/EventsView.vue";
import Config from "@/assets/info/general-config.json";
import sfx from "@/services/sfx";

const DEFAULT_TITLE = Config.defaultTitle;

const routes = [
	{ path: "/", redirect: "/status" },
	{
		path: "/status",
		name: "Mission Status",
		component: Status,
		props: true,
		meta: { title: `${DEFAULT_TITLE} MISSION STATUS` },
	},
	{
		path: "/pilots",
		name: "Pilots",
		component: Pilots,
		props: true,
		meta: { title: `${DEFAULT_TITLE} PILOT ROSTER` },
	},
	{
		path: "/events",
		name: "Events",
		component: Events,
		props: true,
		meta: { title: `${DEFAULT_TITLE} EVENTS LOG` },
	},
];

const router = createRouter({
	history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
	routes,
	scrollBehavior(to) {
		if (to.hash) {
			return { el: to.hash, behavior: "smooth" };
		}
	},
});

let hasNavigated = false;

router.beforeEach((to, from, next) => {
	document.title = `${to.meta.title}`;
	next();
});

router.afterEach((to, from) => {
	// Skip first navigation (initial load / redirect)
	if (!hasNavigated) {
		hasNavigated = true;
		return;
	}
	// Only on view switches
	if (to.path !== from.path) sfx.playBrowse();
});

export default router;
