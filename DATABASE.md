# Kiến Trúc Cơ Sở Dữ Liệu (MySQL)

Hệ thống sử dụng Cơ sở dữ liệu quan hệ (Relational Database) bao gồm 8 bảng, đạt chuẩn thiết kế 3NF, phục vụ luồng nghiệp vụ đánh giá tâm lý và ghi chú nhật ký.

## 🗄️ Danh sách các bảng (Tables)

### Nhóm 1: Quản lý Người dùng & Cảm xúc
* **`users`**: Lưu thông tin định danh của người dùng 
(id(Khóa chính), email, password_hash, full_name, gender, dob (ngày sinh), avatar_url, created_at, status(trạng thái hoạt động), role(Vai trò: 'user', 'admin')).
* **`emotions`**: Lưu danh mục các biểu tượng cảm xúc để chuẩn hóa dữ liệu thống kê 
(id(Khóa chính), name, icon_url).
* **`diaries`**: Lưu trữ các bài viết nhật ký hằng ngày 
(id(Khóa chính), user_id(Khóa ngoại trỏ về `users`), emotion_id(Khóa ngoại trỏ về `emotions`),title, content, image_url, created_at).

### Nhóm 2: Quản lý Bài Test (Dynamic Tests)
Thiết kế lưu trữ câu hỏi và đáp án độc lập giúp hệ thống linh hoạt mở rộng các bài test (ZUNG, BECK, YOUNG) mà không cần sửa code.
* **`tests`**: Lưu thông tin chung của bộ test 
(id(Khóa chính), name, description, created_at).
* **`questions`**: Lưu nội dung từng câu hỏi 
(id(Khóa chính), test_id(Khóa ngoại trỏ về `tests`), content, question_order (số thứ tự câu hỏi)).
* **`options`**: Lưu các lựa chọn đáp án và điểm số tương ứng. Thiết kế này giải quyết triệt để vấn đề "tính điểm ngược" hoặc "điểm nhảy cóc" của các thang đo y khoa. 
(id(Khóa chính), question_id(Khóa ngoại trỏ về `questions`), content (nội dung đáp án), score (điểm số tương ứng với đáp án)).

### Nhóm 3: Lưu trữ Kết quả & Phác đồ
* **`test_results`**: Lưu lịch sử làm bài (Tổng điểm, Phân loại mức độ), phục vụ vẽ biểu đồ tiến triển.
(id (Khóa chính), user_id (Khóa ngoại trỏ về `users`), test_id (Khóa ngoại trỏ về `tests`), total_score, category, is_roadmap_completed (true/false - Kiểm tra hoàn thành lộ trình hay chưa), created_at).
* **`treatments`**: Lưu trữ các lộ trình hỗ trợ theo từng tuần, được ánh xạ (map) với kết quả phân loại của người dùng.
(id (Khóa chính), category (Mức độ bệnh để map với test_results), week_number, title (Tiêu đề tuần), content(Nội dung, Task))
* **`user_treatment_progress`**: Bảng cầu nối quản lý tiến độ thực hiện lộ trình của người dùng theo từng tuần cụ thể.
(progress_id (Khóa chính), user_id (Khóa ngoại trỏ về `users`), test_result_id (Khóa ngoại trỏ về `test_results`), treatment_id (Khóa ngoại trỏ về `treatments`), completed_tasks (Mảng JSON các task đã làm trong tuần này), status (Trạng thái tuần), updated_at)

## 🔗 Mối quan hệ (Relationships)
* `users` (1) --- (N) `diaries`
* `users` (1) --- (N) `test_results`
* `tests` (1) --- (N) `questions`
* `questions` (1) --- (N) `options`
* `emotions` (1) --- (N) `diaries`
* `users` (1) --- (N) `user_treatment_progress`
* `test_results` (1) --- (N) `user_treatment_progress`
* `treatments` (1) --- (N) `user_treatment_progress`