/*
Mã nguồn này được chỉnh sửa lại dựa trên XgpNwb
Github：https://github.com/NianBroken/Firework_Simulator
Gitee：https://gitee.com/nianbroken/Firework_Simulator
*/
(function (global) {
    "use strict";

    // Định nghĩa các khóa cho các thuộc tính liên quan đến toàn màn hình
    var key = {
        fullscreenEnabled: 0,      // Kích hoạt chế độ toàn màn hình
        fullscreenElement: 1,      // Phần tử đang ở chế độ toàn màn hình
        requestFullscreen: 2,      // Yêu cầu chuyển sang toàn màn hình
        exitFullscreen: 3,         // Thoát khỏi chế độ toàn màn hình
        fullscreenchange: 4,       // Sự kiện thay đổi chế độ toàn màn hình
        fullscreenerror: 5,        // Sự kiện lỗi chế độ toàn màn hình
    };

    // Các thuộc tính cho trình duyệt sử dụng webkit
    var webkit = [
        "webkitFullscreenEnabled",
        "webkitFullscreenElement",
        "webkitRequestFullscreen",
        "webkitExitFullscreen",
        "webkitfullscreenchange",
        "webkitfullscreenerror"
    ];

    // Các thuộc tính cho trình duyệt sử dụng moz
    var moz = [
        "mozFullScreenEnabled",
        "mozFullScreenElement",
        "mozRequestFullScreen",
        "mozCancelFullScreen",
        "mozfullscreenchange",
        "mozfullscreenerror"
    ];

    // Các thuộc tính cho trình duyệt sử dụng ms
    var ms = [
        "msFullscreenEnabled",
        "msFullscreenElement",
        "msRequestFullscreen",
        "msExitFullscreen",
        "MSFullscreenChange",
        "MSFullscreenError"
    ];

    // Đảm bảo không bị lỗi nếu không có window hoặc document
    // Ngôn ngữ của dự án này đã được dịch sang tiếng Trung bởi Nianbroken
    var doc = typeof window !== "undefined" && typeof window.document !== "undefined" ? window.document : {};

    // Xác định vendor phù hợp với trình duyệt
    var vendor = ("fullscreenEnabled" in doc && Object.keys(key)) ||
        (webkit[0] in doc && webkit) ||
        (moz[0] in doc && moz) ||
        (ms[0] in doc && ms) ||
        [];

    var fscreen = {
        // Yêu cầu chuyển phần tử sang chế độ toàn màn hình
        requestFullscreen: function requestFullscreen(element) {
            return element[vendor[key.requestFullscreen]]();
        },
        // Lấy hàm yêu cầu toàn màn hình của phần tử
        requestFullscreenFunction: function requestFullscreenFunction(element) {
            return element[vendor[key.requestFullscreen]];
        },
        // Thoát khỏi chế độ toàn màn hình
        get exitFullscreen() {
            return doc[vendor[key.exitFullscreen]].bind(doc);
        },
        // Thêm sự kiện lắng nghe
        addEventListener: function addEventListener(type, handler, options) {
            return doc.addEventListener(vendor[key[type]], handler, options);
        },
        // Xóa sự kiện lắng nghe
        removeEventListener: function removeEventListener(type, handler) {
            return doc.removeEventListener(vendor[key[type]], handler);
        },
        // Kiểm tra chế độ toàn màn hình có được hỗ trợ không
        get fullscreenEnabled() {
            return Boolean(doc[vendor[key.fullscreenEnabled]]);
        },
        set fullscreenEnabled(val) {},
        // Lấy phần tử đang ở chế độ toàn màn hình
        get fullscreenElement() {
            return doc[vendor[key.fullscreenElement]];
        },
        set fullscreenElement(val) {},
        // Xử lý sự kiện thay đổi chế độ toàn màn hình
        get onfullscreenchange() {
            return doc[("on" + vendor[key.fullscreenchange]).toLowerCase()];
        },
        set onfullscreenchange(handler) {
            return (doc[("on" + vendor[key.fullscreenchange]).toLowerCase()] = handler);
        },
        // Xử lý sự kiện lỗi chế độ toàn màn hình
        get onfullscreenerror() {
            return doc[("on" + vendor[key.fullscreenerror]).toLowerCase()];
        },
        set onfullscreenerror(handler) {
            return (doc[("on" + vendor[key.fullscreenerror]).toLowerCase()] = handler);
        },
    };

    global.fscreen = fscreen;
})(window);