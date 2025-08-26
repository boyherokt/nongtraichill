/*
Mã nguồn này được chỉnh sửa lần hai dựa trên XgpNwb
Github：https://github.com/NianBroken/Firework_Simulator
Gitee：https://gitee.com/nianbroken/Firework_Simulator
*/
const MyMath = (function MyMathFactory(Math) {
    const MyMath = {};

    // Hằng số chuyển đổi độ/radian
    MyMath.toDeg = 180 / Math.PI;
    MyMath.toRad = Math.PI / 180;
    MyMath.halfPI = Math.PI / 2;
    MyMath.twoPI = Math.PI * 2;

    // Tính khoảng cách theo định lý Pythagoras
    MyMath.dist = (width, height) => {
        return Math.sqrt(width * width + height * height);
    };

    // Tính khoảng cách giữa hai điểm theo định lý Pythagoras
    // Giống như trên, nhưng nhận vào tọa độ thay vì kích thước.
    // Ngôn ngữ của dự án này đã được Nianbroken dịch sang tiếng Trung
    MyMath.pointDist = (x1, y1, x2, y2) => {
        const distX = x2 - x1;
        const distY = y2 - y1;
        return Math.sqrt(distX * distX + distY * distY);
    };

    // Trả về góc (radian) của một vector 2D
    MyMath.angle = (width, height) => MyMath.halfPI + Math.atan2(height, width);

    // Trả về góc (radian) giữa hai điểm
    // Giống như trên, nhưng nhận vào tọa độ thay vì kích thước.
    MyMath.pointAngle = (x1, y1, x2, y2) => MyMath.halfPI + Math.atan2(y2 - y1, x2 - x1);

    // Tách một vector vận tốc thành thành phần x và y (góc tính bằng radian)
    MyMath.splitVector = (speed, angle) => ({
        x: Math.sin(angle) * speed,
        y: -Math.cos(angle) * speed,
    });

    // Sinh số ngẫu nhiên trong khoảng min (bao gồm) đến max (không bao gồm)
    MyMath.random = (min, max) => Math.random() * (max - min) + min;

    // Sinh số nguyên ngẫu nhiên trong khoảng min đến max (có thể bao gồm cả hai)
    MyMath.randomInt = (min, max) => ((Math.random() * (max - min + 1)) | 0) + min;

    // Trả về một phần tử ngẫu nhiên từ một mảng, hoặc từ các đối số truyền vào
    MyMath.randomChoice = function randomChoice(choices) {
        if (arguments.length === 1 && Array.isArray(choices)) {
            return choices[(Math.random() * choices.length) | 0];
        }
        return arguments[(Math.random() * arguments.length) | 0];
    };

    // Giới hạn một số trong khoảng min và max
    MyMath.clamp = function clamp(num, min, max) {
        return Math.min(Math.max(num, min), max);
    };

    /**
     * Chuyển chữ thành ma trận điểm
     * @param {string} text Nội dung văn bản
     * @param {number} density Mật độ điểm, mặc định là 3
     * @param {string} fontFamily Font, mặc định Georgia
     * @param {string} fontSize Kích thước font, mặc định 60px
     * @returns {Array} Mảng điểm
     */
    MyMath.literalLattice = function literalLattice(text, density = 3, fontFamily = "Georgia", fontSize = "60px") {
        // Tạo một mảng điểm rỗng
        var dots = [];
        // Tạo một canvas
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");

        var font = `${fontSize} ${fontFamily}`;

        ctx.font = font;
        var width = ctx.measureText(text).width;
        var fontSize = parseInt(fontSize.match(/(\d+)px/)[1]);
        canvas.width = width + 20;
        canvas.height = fontSize + 20;

        ctx.font = font;
        ctx.fillText(text, 10, fontSize + 10);

        // Lấy dữ liệu pixel trên canvas
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        for (var y = 0; y < imageData.height; y += density) {
            for (var x = 0; x < imageData.width; x += density) {
                var i = (y * imageData.width + x) * 4;
                // Nếu giá trị alpha của pixel lớn hơn 0, tức là pixel đó là một phần của văn bản
                if (imageData.data[i + 3] > 0) {
                    // Thêm một điểm vào mảng dots và lưu lại tọa độ
                    dots.push({ x: x, y: y });
                }
            }
        }

        // // Xóa canvas, vẽ lại các điểm trong dots lên canvas
        // ctx.clearRect(0, 0, canvas.width, canvas.height);
        // ctx.fillStyle = 'red';
        // dots.forEach(function (dot) {
        //     ctx.fillRect(dot.x, dot.y, 1, 1);
        // });

        // // Tạo phần tử img, gán ảnh từ canvas và thêm vào body cửa sổ mới
        // var img = document.createElement('img');
        // img.src = canvas.toDataURL();
        // img.style.width = canvas.width + 'px';
        // img.style.height = canvas.height + 'px';
        // document.body.appendChild(img);
        // window.open().document.body.appendChild(img);

        // Xuất canvas thành ảnh

        return {
            width: canvas.width,
            height: canvas.height,
            points: dots,
        };
    };

    return MyMath;
})(Math);