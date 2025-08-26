/*
Mã nguồn này được chỉnh sửa lại từ XgpNwb
Github：https://github.com/NianBroken/Firework_Simulator
Gitee：https://gitee.com/nianbroken/Firework_Simulator
*/
const Ticker = (function TickerFactory(window) {
	"use strict";

	const Ticker = {};

	// public
	// sẽ gọi hàm callback liên tục sau khi đăng ký, truyền vào thời gian đã trôi qua và hệ số lag
	Ticker.addListener = function addListener(callback) {
		if (typeof callback !== "function") throw "Ticker.addListener() yêu cầu một hàm callback.";

		listeners.push(callback);

		// bắt đầu vòng lặp khung hình một cách lười biếng
		if (!started) {
			started = true;
			queueFrame();
		}
	};

	// private
	let started = false;
	let lastTimestamp = 0;
	let listeners = [];

	// xếp hàng một khung hình mới (gọi frameHandler)
	function queueFrame() {
		if (window.requestAnimationFrame) {
			requestAnimationFrame(frameHandler);
		} else {
			webkitRequestAnimationFrame(frameHandler);
		}
	}

	function frameHandler(timestamp) {
		let frameTime = timestamp - lastTimestamp;
		lastTimestamp = timestamp;
		// đảm bảo không báo thời gian âm (khung hình đầu có thể bị lỗi)
		if (frameTime < 0) {
			frameTime = 17;
		}
		// - giới hạn tốc độ khung hình tối thiểu là 15fps[~68ms] (giả định 60fps[~17ms] là 'bình thường')
		else if (frameTime > 68) {
			frameTime = 68;
		}

		// gọi các listener tùy chỉnh
		listeners.forEach((listener) => listener.call(window, frameTime, frameTime / 16.6667));

		// luôn xếp hàng một khung hình khác
		queueFrame();
	}

	return Ticker;
})(window);

const Stage = (function StageFactory(window, document, Ticker) {
	"use strict";

	// Theo dõi thời gian chạm để tránh sự kiện chuột dư thừa.
	let lastTouchTimestamp = 0;

	// Hàm khởi tạo Stage (canvas có thể là node dom hoặc chuỗi id)
	function Stage(canvas) {
		if (typeof canvas === "string") canvas = document.getElementById(canvas);

		// tham chiếu canvas và context liên quan
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");

		// Ngăn cử chỉ trên stage (cuộn, thu phóng, v.v.)
		this.canvas.style.touchAction = "none";

		// hệ số tốc độ vật lý: cho phép làm chậm hoặc tăng tốc mô phỏng (phải tự cài đặt ở lớp vật lý)
		this.speed = 1;

		// alias devicePixelRatio (chỉ nên dùng cho render, vật lý không cần quan tâm)
		// tránh render pixel không cần thiết mà trình duyệt có thể xử lý qua CanvasRenderingContext2D.backingStorePixelRatio
		this.dpr = Stage.disableHighDPI ? 1 : (window.devicePixelRatio || 1) / (this.ctx.backingStorePixelRatio || 1);

		// kích thước canvas theo DIP và pixel thực
		this.width = canvas.width;
		this.height = canvas.height;
		this.naturalWidth = this.width * this.dpr;
		this.naturalHeight = this.height * this.dpr;

		// chỉnh kích thước canvas khớp với kích thước thực
		if (this.width !== this.naturalWidth) {
			this.canvas.width = this.naturalWidth;
			this.canvas.height = this.naturalHeight;
			this.canvas.style.width = this.width + "px";
			this.canvas.style.height = this.height + "px";
		}

		// To any known illigitimate users...
		// const badDomains = ['bla'+'ckdiam'+'ondfirew'+'orks'+'.de'];
		// const hostname = document.location.hostname;
		// if (badDomains.some(d => hostname.includes(d))) {
		// 	const delay = 60000 * 3; // 3 minutes
		// 	// setTimeout(() => {
		// 	// 	const html = `<style>\n\t\t\t\t\t\tbody { background-color: #000; padding: 20px; text-align: center; color: #ddd; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; overflow: visible; }\n\t\t\t\t\t\th1 { font-size: 1.2em;}\n\t\t\t\t\t\tp { margin-top: 1em; max-width: 36em; }\n\t\t\t\t\t\ta { color: #fff; text-decoration: underline; }\n\t\t\t\t\t</style>\n\t\t\t\t\t<h1>Hi! Sorry to interrupt the fireworks.</h1>\n\t\t\t\t\t<p>My name is Caleb. Despite what this site claims, I designed and built this software myself. I've spent a couple hundred hours of my own time, over two years, making it.</p>\n\t\t\t\t\t<p>The owner of this site clearly doesn't respect my work, and has labeled it as their own.</p>\n\t\t\t\t\t<p>If you were enjoying the show, please check out <a href="https://codepen.io/MillerTime/full/XgpNwb">my&nbsp;official&nbsp;version&nbsp;here</a>!</p>\n\t\t\t\t\t<p>If you're the owner, <a href="mailto:calebdotmiller@gmail.com">contact me</a>.</p>`;
		// 	// 	document.body.innerHTML = html;
		// 	// }, delay);
		// }

		Stage.stages.push(this);

		// event listeners (note that 'ticker' is also an option, for frame events)
		this._listeners = {
			// thay đổi kích thước canvas
			resize: [],
			// sự kiện con trỏ
			pointerstart: [],
			pointermove: [],
			pointerend: [],
			lastPointerPos: { x: 0, y: 0 },
		};
	}

	// theo dõi tất cả các instance Stage
	Stage.stages = [];

	// cho phép tắt hỗ trợ DPI cao vì lý do hiệu năng (bật mặc định)
	// Lưu ý: PHẢI đặt trước khi khởi tạo Stage.
	// Mỗi stage theo dõi DPI riêng (khởi tạo khi tạo), nên có thể cho phép một số Stage render đồ họa độ phân giải cao, số khác thì không.
	Stage.disableHighDPI = false;

	// sự kiện
	Stage.prototype.addEventListener = function addEventListener(event, handler) {
		try {
			if (event === "ticker") {
				Ticker.addListener(handler);
			} else {
				this._listeners[event].push(handler);
			}
		} catch (e) {
			throw "Sự kiện không hợp lệ";
		}
	};

	Stage.prototype.dispatchEvent = function dispatchEvent(event, val) {
		const listeners = this._listeners[event];
		if (listeners) {
			listeners.forEach((listener) => listener.call(this, val));
		} else {
			throw "Sự kiện không hợp lệ";
		}
	};

	// thay đổi kích thước canvas
	Stage.prototype.resize = function resize(w, h) {
		this.width = w;
		this.height = h;
		this.naturalWidth = w * this.dpr;
		this.naturalHeight = h * this.dpr;
		this.canvas.width = this.naturalWidth;
		this.canvas.height = this.naturalHeight;
		this.canvas.style.width = w + "px";
		this.canvas.style.height = h + "px";

		this.dispatchEvent("resize");
	};

	// hàm tiện ích chuyển đổi tọa độ không gian
	Stage.windowToCanvas = function windowToCanvas(canvas, x, y) {
		const bbox = canvas.getBoundingClientRect();
		return {
			x: (x - bbox.left) * (canvas.width / bbox.width),
			y: (y - bbox.top) * (canvas.height / bbox.height),
		};
	};
	// xử lý tương tác
	Stage.mouseHandler = function mouseHandler(evt) {
		// Ngăn sự kiện chuột xảy ra ngay sau sự kiện chạm
		if (Date.now() - lastTouchTimestamp < 500) {
			return;
		}

		let type = "start";
		if (evt.type === "mousemove") {
			type = "move";
		} else if (evt.type === "mouseup") {
			type = "end";
		}

		Stage.stages.forEach((stage) => {
			const pos = Stage.windowToCanvas(stage.canvas, evt.clientX, evt.clientY);
			stage.pointerEvent(type, pos.x / stage.dpr, pos.y / stage.dpr);
		});
	};
	Stage.touchHandler = function touchHandler(evt) {
		lastTouchTimestamp = Date.now();

		// Đặt loại sự kiện chung
		let type = "start";
		if (evt.type === "touchmove") {
			type = "move";
		} else if (evt.type === "touchend") {
			type = "end";
		}

		// Gửi sự kiện "pointer" cho tất cả các touch thay đổi trên mọi stage.
		Stage.stages.forEach((stage) => {
			// Safari không coi TouchList là iterable, nên dùng Array.from()
			for (let touch of Array.from(evt.changedTouches)) {
				let pos;
				if (type !== "end") {
					pos = Stage.windowToCanvas(stage.canvas, touch.clientX, touch.clientY);
					stage._listeners.lastPointerPos = pos;
					// trước sự kiện touchstart, gửi sự kiện move để mô phỏng tốt hơn sự kiện con trỏ
					if (type === "start") stage.pointerEvent("move", pos.x / stage.dpr, pos.y / stage.dpr);
				} else {
					// với touchend, điền thông tin vị trí dựa trên vị trí touch cuối cùng đã biết
					pos = stage._listeners.lastPointerPos;
				}
				stage.pointerEvent(type, pos.x / stage.dpr, pos.y / stage.dpr);
			}
		});
	};

	// gửi sự kiện con trỏ đã chuẩn hóa trên một stage cụ thể
	Stage.prototype.pointerEvent = function pointerEvent(type, x, y) {
		// tạo đối tượng sự kiện để gửi
		const evt = {
			type: type,
			x: x,
			y: y,
		};

		// kiểm tra sự kiện con trỏ có nằm trên canvas không
		evt.onCanvas = x >= 0 && x <= this.width && y >= 0 && y <= this.height;

		// gửi sự kiện
		this.dispatchEvent("pointer" + type, evt);
	};

	document.addEventListener("mousedown", Stage.mouseHandler);
	document.addEventListener("mousemove", Stage.mouseHandler);
	document.addEventListener("mouseup", Stage.mouseHandler);
	document.addEventListener("touchstart", Stage.touchHandler);
	document.addEventListener("touchmove", Stage.touchHandler);
	document.addEventListener("touchend", Stage.touchHandler);

	return Stage;
})(window, document, Ticker);

