/* BÀI B — VIẾT CODE: Lọc tin và đăng tin nhanh (news.html)
   Hoàn thiện toàn bộ các chức năng theo đặc tả. */

// ---------- ĐÃ CHO SẴN (không sửa) ----------
// Chặn việc gửi form tìm kiếm khi nhấn Enter, để trang không bị tải lại.
document.querySelector("#searchbar form").addEventListener("submit", (e) => e.preventDefault());

// ---------- PHẦN BẠN VIẾT ----------

const oTimKiem = document.getElementById("o-tim-kiem");
const list = document.getElementById("list");
const boDem = document.getElementById("bo-dem");
const khongThay = document.getElementById("khong-thay");
const oTieuDe = document.getElementById("tin-tieu-de");
const oNoiDung = document.getElementById("tin-noi-dung");
const nutDang = document.getElementById("nut-dang");
const baoLoi = document.getElementById("bao-loi");

// Hàm lấy danh sách tất cả các thẻ <li> chứa tin
function layCacMuc() {
    return Array.from(list.querySelectorAll("li"));
}

// F1. Cập nhật nội dung bộ đếm "Đang hiển thị x/y tin"
function capNhatBoDem() {
    const tatCaMuc = layCacMuc();
    const soHienThi = tatCaMuc.filter(muc => !muc.classList.contains("an")).length;
    boDem.textContent = `Đang hiển thị ${soHienThi}/${tatCaMuc.length} tin`;
}

// Hàm thực hiện lọc tin dựa trên từ khóa hiện tại trong ô tìm kiếm
function xuLyLocTin() {
    const tuKhoa = oTimKiem.value.trim();
    const tatCaMuc = layCacMuc();
    let soKhop = 0;

    tatCaMuc.forEach(muc => {
        const h3 = muc.querySelector("h3");
        const p = muc.querySelector("p");
        const vanBan = (h3 ? h3.textContent : "") + " " + (p ? p.textContent : "");

        if (tuKhoa === "" || vanBan.toLowerCase().includes(tuKhoa.toLowerCase())) {
            muc.classList.remove("an");
            soKhop++;
        } else {
            muc.classList.add("an");
        }
    });

    // F3. Xử lý hiển thị thông báo không tìm thấy
    if (soKhop === 0) {
        khongThay.classList.remove("an");
        khongThay.textContent = `Không tìm thấy tin nào cho "${oTimKiem.value}"`;
    } else {
        khongThay.classList.add("an");
    }

    capNhatBoDem();
}

// F2 + F3. Sự kiện keyup trên #o-tim-kiem để lọc tin tức theo thời gian thực
oTimKiem.addEventListener("keyup", xuLyLocTin);

// F4. Nút "Read more >>" / "Thu gọn <<" — Một trình lắng nghe sự kiện click đặt trên #list (Event Delegation)
list.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("more")) {
        const nut = e.target;
        const doanVan = nut.parentElement.querySelector("p");
        if (doanVan) {
            doanVan.classList.toggle("day-du");
            if (doanVan.classList.contains("day-du")) {
                nut.textContent = "Thu gọn <<";
            } else {
                nut.textContent = "Read more >>";
            }
        }
    }
});

// F5. Đăng tin nhanh: sự kiện click trên #nut-dang
nutDang.addEventListener("click", () => {
    const tieuDeVal = oTieuDe.value;
    const noiDungVal = oNoiDung.value;

    // Kiểm tra dữ liệu rỗng
    if (tieuDeVal === "" || noiDungVal === "") {
        baoLoi.textContent = "Vui lòng nhập đủ tiêu đề và nội dung.";
        return;
    }

    // Xoá thông báo lỗi cũ nếu có
    baoLoi.textContent = "";

    // Tạo phần tử <li> mới chứa cấu trúc giống hệt các tin có sẵn
    const liMoi = document.createElement("li");

    const spanTime = document.createElement("span");
    spanTime.className = "time";
    spanTime.textContent = homNay();

    const h3 = document.createElement("h3");
    h3.textContent = tieuDeVal; // Dùng textContent để hiển thị nguyên văn kể cả thẻ HTML

    const p = document.createElement("p");
    p.textContent = noiDungVal; // Dùng textContent bảo mật và hiển thị đúng nguyên văn ký tự

    const buttonMore = document.createElement("button");
    buttonMore.type = "button";
    buttonMore.className = "more";
    buttonMore.textContent = "Read more >>";

    liMoi.append(spanTime, h3, p, buttonMore);

    // Chèn tin mới vào ĐẦU danh sách #list
    list.prepend(liMoi);

    // Xoá trắng các ô nhập form đăng tin
    oTieuDe.value = "";
    oNoiDung.value = "";

    // Đồng bộ lại bộ lọc tin hiện tại (nếu đang tìm kiếm từ khóa, tin vừa đăng có thể sẽ bị ẩn nếu không khớp)
    xuLyLocTin();
});

// Khởi chạy bộ đếm ngay khi tải trang lần đầu
capNhatBoDem();