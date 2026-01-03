// src/services/sfx.js

const SOURCES = {
	browse: [
		"/sounds/Orbat Main Menu Browse.ogg",
		"/sounds/Orbat%20Main%20Menu%20Browse.ogg",
	],
	click: [
		"/sounds/Ortbat Main Menu Click.ogg",
		"/sounds/Ortbat%20Main%20Menu%20Click.ogg",
		"/sounds/Orbat Main Menu Click.ogg", // fallback in case filename differs
		"/sounds/Orbat%20Main%20Menu%20Click.ogg",
	],
};

function isBrowser() {
	return typeof window !== "undefined" && typeof Audio !== "undefined";
}

class Sfx {
	constructor() {
		this._audios = new Map();
		this._unlocked = false;

		if (isBrowser()) {
			const unlock = () => this.unlock();
			window.addEventListener("pointerdown", unlock, { once: true, passive: true });
			window.addEventListener("keydown", unlock, { once: true });
		}
	}

	_createAudio(key) {
		const audio = new Audio();
		audio.preload = "auto";

		const candidates = (SOURCES[key] || []).map((s) => encodeURI(s));
		let i = 0;

		const setSrc = () => {
			if (i >= candidates.length) return;
			audio.src = candidates[i++];
		};

		audio.addEventListener("error", () => setSrc());
		setSrc();

		return audio;
	}

	_get(key) {
		if (!this._audios.has(key)) this._audios.set(key, this._createAudio(key));
		return this._audios.get(key);
	}

	async unlock() {
		if (!isBrowser() || this._unlocked) return;
		this._unlocked = true;

		for (const key of Object.keys(SOURCES)) {
			const a = this._get(key);
			const prevVol = a.volume;
			try {
				a.volume = 0;
				a.currentTime = 0;
				await a.play();
				a.pause();
				a.currentTime = 0;
			} catch {
				// best-effort unlock
			} finally {
				a.volume = prevVol;
			}
		}
	}

	async playBrowse() {
		return this._play("browse");
	}

	async playClick() {
		return this._play("click");
	}

	async _play(key) {
		if (!isBrowser()) return;

		const a = this._get(key);

		try {
			a.pause();
			a.currentTime = 0;
		} catch {
			// ignore
		}

		try {
			await a.play();
		} catch {
			// autoplay policy / unsupported audio: ignore
		}
	}
}

export default new Sfx();
