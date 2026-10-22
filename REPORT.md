# BÁO CÁO THI THỰC HÀNH (PRACTICAL EXAM REPORT)
**Môn học:** MMA301 - Mobile Application Development  
**Kỳ học:** FALL 2026  
**Dự án:** BookShelf Application  

---

## 1. THÔNG TIN BÀI NỘP (SUBMISSION INFORMATION)
*(Bạn hãy sao chép phần này vào đầu file `<StudentCode>.docx`)*

- **Student Code:** [Điền Mã SV của bạn, ví dụ: QE180000]
- **Full Name:** [Điền Họ và Tên của bạn, ví dụ: Nguyễn Văn A]
- **GitHub Repository URL:** https://github.com/ThanhNam7791aaa/PE-Test-MMA
- **Expo Project Link:** [Điền Link Expo / EAS Build của bạn nếu có, ví dụ: https://expo.dev/accounts/.../builds/...]
- **Firebase Project ID:** `bookshelf-mma301`
- **Test account email:** `grader.qe200012@example.com` *(hoặc email test bạn đã tạo trên Firebase)*
- **Test account password:** `Test1234!` *(hoặc mật khẩu bạn đã đặt)*

---

## 2. DANH SÁCH 16 ẢNH CHỤP MÀN HÌNH BẮT BUỘC (SCREENSHOTS CHECKLIST)
> **LƯU Ý CỰC KỲ QUAN TRỌNG TỪ GIÁM THỊ:**
> - Chèn đầy đủ 16 ảnh theo **đúng thứ tự từ 1 đến 16** vào file Word.
> - Mỗi ảnh **bắt buộc phải có Caption (chú thích) chính xác từng từ** như phần in đậm dưới đây. Ảnh thiếu caption hoặc sai nội dung sẽ bị 0 điểm phần đó!
> - Ảnh chụp từ app phải chụp từ thiết bị thật hoặc máy ảo (Emulator/Browser) đã đăng nhập bằng tài khoản test.

---

### [Ảnh 1] Firebase console — Authentication
- **Caption chính xác:** `Firebase console — Authentication`
- **Cách chụp:** Vào Firebase Console $\rightarrow$ **Authentication** $\rightarrow$ tab **Users**. Chụp rõ dòng hiển thị tài khoản test của giám khảo.

---

### [Ảnh 2] Firebase console — Firestore data
- **Caption chính xác:** `Firebase console — Firestore data`
- **Cách chụp:** Vào Firebase Console $\rightarrow$ **Firestore Database** $\rightarrow$ tab **Data**. Chụp rõ collection `books` có ít nhất 3 documents thuộc tài khoản test.

---

### [Ảnh 3] Firebase console — Security Rules
- **Caption chính xác:** `Firebase console — Security Rules`
- **Cách chụp:** Vào Firebase Console $\rightarrow$ **Firestore Database** $\rightarrow$ tab **Rules**. Chụp rõ mã nguồn rules đã được bấm nút **Publish** thành công.

---

### [Ảnh 4] Register screen — validation
- **Caption chính xác:** `Register screen — validation`
- **Cách chụp:** Mở màn hình Register trên app, để trống cả 3 ô (Email, Password, Confirm Password) rồi bấm nút **Register**. Chụp màn hình hiện đầy đủ các câu báo lỗi màu đỏ.

---

### [Ảnh 5] Register screen — success
- **Caption chính xác:** `Register screen — success`
- **Cách chụp:** Nhập thông tin đăng ký một tài khoản mới hợp lệ và bấm **Register**. Chụp màn hình ngay khi hiện khung xanh thông báo `Registration successful`.

---

### [Ảnh 6] Login screen
- **Caption chính xác:** `Login screen`
- **Cách chụp:** Mở màn hình Login với form đăng nhập để trống ban đầu.

---

### [Ảnh 7] List screen — after login
- **Caption chính xác:** `List screen — after login`
- **Cách chụp:** Đăng nhập thành công vào app bằng tài khoản test. Chụp màn hình hiển thị email trên Header, nút Logout màu đỏ và danh sách bên dưới đã có ít nhất 3 cuốn sách.

---

### [Ảnh 8] Add Book form — validation
- **Caption chính xác:** `Add Book form — validation`
- **Cách chụp:** Tại màn hình List, cuộn đến form **Add a Book**, để trống các trường và bấm nút **Add Book**. Chụp màn hình hiển thị các thông báo lỗi: `Title is required`, `Author is required`, `Please choose a genre`, `Please choose a status`.

---

### [Ảnh 9] Add Book form — success
- **Caption chính xác:** `Add Book form — success`
- **Cách chụp:** Nhập đầy đủ thông tin một cuốn sách mới và bấm **Add Book**. Chụp màn hình ngay khi hiện thông báo màu xanh `Book added` và cuốn sách mới xuất hiện ngay trong danh sách bên dưới.

---

### [Ảnh 10] Filters and search
- **Caption chính xác:** `Filters and search`
- **Cách chụp:** Thao tác trên thanh bộ lọc: Chọn 1 thể loại (Genre chip), chọn 1 trạng thái (Status chip), hoặc nhập từ khóa tìm kiếm trên Search box để thấy danh sách sách bên dưới tự động lọc tương ứng.

---

### [Ảnh 11] Summary
- **Caption chính xác:** `Summary`
- **Cách chụp:** Chụp khu vực khung **Summary** hiển thị: số lượng tổng `Books`, số lượng `Favorites`, và danh sách **Status Breakdown** (hiển thị số lượng theo từng trạng thái như To Read, Reading, Finished).

---

### [Ảnh 12] Detail screen — view mode
- **Caption chính xác:** `Detail screen — view mode`
- **Cách chụp:** Nhấn vào 1 cuốn sách bất kỳ trong danh sách để mở màn hình chi tiết. Chụp toàn bộ thông tin sách ở chế độ xem: Title, Author, Genre, Status, Rating, Notes, nút ngôi sao Favorite, và 2 nút Edit / Delete.

---

### [Ảnh 13] Detail screen — edit mode, validation
- **Caption chính xác:** `Detail screen — edit mode, validation`
- **Cách chụp:** Trên màn hình Detail, bấm nút **Edit**. Xóa trắng ô Title hoặc Author rồi bấm **Save**. Chụp màn hình hiển thị thông báo lỗi validation.

---

### [Ảnh 14] Detail screen — after Save
- **Caption chính xác:** `Detail screen — after Save`
- **Cách chụp:** Sửa lại thông tin hợp lệ (ví dụ đổi Status từ Reading sang Finished hoặc tăng Rating) rồi bấm **Save**. Chụp màn hình đã cập nhật giá trị mới và quay về chế độ View.

---

### [Ảnh 15] Favorite toggle and Delete
- **Caption chính xác:** `Favorite toggle and Delete`
- **Cách chụp:** Ghép 2 ảnh before/after hoặc chụp 2 ảnh:
  - Ảnh A: Bấm vào ngôi sao để bật/tắt Favorite (sao đổi màu vàng $\leftrightarrow$ xám).
  - Ảnh B: Bấm nút **Delete**, chọn xác nhận xóa, và màn hình quay về danh sách với cuốn sách đã biến mất hoàn toàn.

---

### [Ảnh 16] Empty state
- **Caption chính xác:** `Empty state`
- **Cách chụp:** Đăng xuất tài khoản hiện tại, đăng ký hoặc đăng nhập bằng một tài khoản mới tinh chưa thêm sách nào. Chụp màn hình hiển thị icon khay rỗng cùng dòng chữ `No books found`.

---

## 3. CHECKLIST TỰ KIỂM TRA TRƯỚC KHI NỘP (SELF-CHECK)
- [ ] Chạy lệnh `npm install && npx expo start` hoạt động trơn tru không lỗi.
- [ ] Đăng ký tài khoản mới thành công; đăng ký lại email cũ báo lỗi trong `error-auth`.
- [ ] Màn hình Home hiển thị khi chưa login; sau login nhảy thẳng vào List screen.
- [ ] Thêm trùng sách (cùng Title + Author) bị từ chối và báo lỗi trong `error-book`.
- [ ] Bật "Favorites only" rồi bỏ chọn sao của 1 cuốn sách thì sách đó lập tức biến mất khỏi danh sách.
- [ ] Đăng xuất và đăng nhập tài khoản khác hiển thị danh sách rỗng (dữ liệu được phân quyền độc lập theo từng user).
- [ ] Repo GitHub ở chế độ **Public** và đã push đầy đủ mã nguồn mới nhất.
- [ ] File `.env` chứa private key **không** bị đẩy lên Git và **không** nằm trong file zip nộp bài.
- [ ] File template [.env.example](file:///d:/PE-Test_MMA/.env.example) và [firestore.rules](file:///d:/PE-Test_MMA/firestore.rules) có đầy đủ trong thư mục gốc.

---

## 4. QUY CÁCH ĐÓNG GÓI BÀI THI (SUBMISSION PACKAGING)

Tạo một thư mục mang tên Mã số sinh viên của bạn (ví dụ `QE180000`), bên trong gồm đúng 2 file:

1. **`<StudentCode>.docx`** (ví dụ `QE180000.docx`):
   - Chứa thông tin ở Mục 1 và dán đủ 16 ảnh chụp màn hình ở Mục 2 theo đúng thứ tự và caption.
   - Định dạng chuẩn file Word (`.docx`), tuyệt đối không đổi sang `.pdf`.

2. **`<StudentCode>.zip`** (ví dụ `QE180000.zip`):
   - Nén mã nguồn của dự án với `package.json` nằm ở ngay thư mục gốc của file zip.
   - **Bao gồm:** `src/`, `package.json`, `package-lock.json`, `app.json`, `tsconfig.json`, `App.tsx`, `firestore.rules`, `.env.example`.
   - **TUYỆT ĐỐI KHÔNG BAO GỒM:** `node_modules`, `.expo`, `.git`, và file `.env` thật.
