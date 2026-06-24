KỊCH BẢN TƯƠNG TÁC THỰC ĐỊA: Tây Hồ Huyền Tích

Hình thức: Web App di động (Mobile-first) - Quét QR Code thực địa không cần tải app.
Thể loại: Visual Novel kết hợp Scrollytelling & Trò chơi hóa thực địa (Gamification).

I. CẤU HÌNH HỆ THỐNG & BIẾN TOÀN CỤC (STATE MACHINE)

Để AI/Developer dễ dàng lập trình, hệ thống cần quản lý các biến trạng thái (State) sau trong suốt hành trình:

Tên biến

Kiểu dữ liệu

Giá trị mặc định

Giải thích ý nghĩa

current_stage

Integer

0

Chặng hiện tại của người chơi (từ 0 đến 5)

is_verified

Boolean

false

Trạng thái đã vượt qua thử thách/câu hỏi tại chặng đó chưa

ending_chosen

String

null

Nhận giá trị A, B, C, D dựa trên lựa chọn ở Chặng 3 (Hậu Cung)

wish_path

String

null

Nhận giá trị co (Lầu Cô) hoặc cau (Lầu Cậu) ở Chặng 4

countdown_active

Boolean

false

Trạng thái bộ đếm ngược chống tua nhanh (anti-cheat) đang chạy

II. NỘI DUNG CHI TIẾT TỪNG CHẶNG (STAGES SCRIPT)

CHẶNG 0: KHỞI HÀNH (VỊ TRÍ: QUÁN NƯỚC VEN HỒ)

Mục tiêu: Giới thiệu bối cảnh lịch sử, tạo không khí tâm linh huyền bí, kích hoạt di chuyển thực địa đầu tiên.

Tài nguyên thiết lập:

Visual (Ảnh nền): [ảnh 1: Bờ Hồ Tây hoàng hôn, sương mờ dập dềnh]

Character (Nhân vật): [ảnh nhân vật: Silhouette đen mờ ẩn hiện của một bà cụ]

Audio (Nhạc nền): Tiếng đàn nguyệt lững lờ phối hợp tiếng sóng vỗ rì rào nhẹ nhàng.

Lời thoại dẫn dắt (Speaker: Cụ bà bán nước):

"Khách viễn phương ơi, ngồi uống ngụm trà sen ấm lòng đã dã bớt sương lạnh Hồ Tây... Ngươi có biết vùng đất linh kiệt Tây Hồ này từng chứng kiến cuộc hội ngộ bất tử giữa một nàng tiên thơ văn và người hiền tài đất Việt không? Hãy cùng ta bước chân qua cổng phủ để lật giở quá khứ nhé."

Cơ chế tương tác & Chống tua nhanh (Anti-cheat):

Hiển thị nút bấm: [Tôi đã đi bộ tới trước cổng Tam Quan]

Nút này bị khóa (Disabled) và hiển thị bộ đếm ngược 10 giây (Thực tế nên để 30 - 60 giây để tương ứng thời gian đi bộ thật).

Sau khi hết giờ: Nút sáng lên, người chơi bấm để chuyển sang Chặng 1.

CHẶNG 1: TAM QUAN PHỦ (VỊ TRÍ: CỔNG TAM QUAN TRƯỚC PHỦ)

Mục tiêu: Xác thực người chơi đã thực sự đứng trước cổng, giới thiệu kiến trúc tam quan.

Tài nguyên thiết lập:

Visual (Ảnh nền): [ảnh 2: Cổng Tam Quan Phủ cổ kính, rêu phong dưới bóng cây đa cổ thụ]

Character (Nhân vật): [ảnh nhân vật: Cụ bà mặc áo nâu sòng ấm áp, nét mặt hiền từ]

Lời thoại dẫn dắt (Speaker: Cụ bà dẫn lối):

"Ngươi đã đứng trước Cổng Tam Quan oai nghiêm chưa? Hãy nhìn ngắm kiến trúc và trả lời câu hỏi này để chứng minh mắt ngươi đang thực sự hướng về chốn linh thiêng này."

Câu hỏi xác thực thực địa:

Nội dung câu hỏi: "Cổng Tam quan Phủ Tây Hồ có bao nhiêu lối đi vòm cuốn?"

Các lựa chọn đáp án:

Có 1 lối đi duy nhất ở chính giữa. -> Phản hồi hệ thống (Sai): "Chưa đúng rồi, hãy quan sát kỹ lại kiến trúc tam quan cổ kính nhé!"

Có 2 lối đi nhỏ hai bên tả hữu. -> Phản hồi hệ thống (Sai): "Gần đúng rồi, lối đi chính giữa thờ mẫu cũng là lối đi mà!"

Có 3 lối đi (Tam quan). -> Phản hồi hệ thống (Đúng): "Chính xác! Ba lối đi đại diện cho thuyết Tam tài Thiên - Địa - Nhân. Hãy bước tiếp vào sân."

Cơ chế chuyển tiếp:

Trả lời sai: Rung lắc màn hình báo hiệu chọn lại.

Trả lời đúng: Lưu is_verified = true. Hiện nút [Tôi đã bước chân vào sân Phủ] kèm bộ đếm ngược 5 giây.

CHẶNG 2: SÂN PHỦ (VỊ TRÍ: KHOẢNG SÂN RỘNG TRƯỚC TAM TÒA)

Mục tiêu: Kể câu chuyện lịch sử thăng trầm của phủ, cảm nhận sự giao thoa kiến trúc cũ - mới.

Tài nguyên thiết lập:

Visual (Ảnh nền): [ảnh 3: Khoảng sân phủ rộng lớn, hướng nhìn thẳng vào 3 nếp điện thờ trùng điệp]

Character (Nhân vật): [ảnh nhân vật: Cụ bà dắt tay chỉ lối]

Lời thoại dẫn dắt (Speaker: Cụ bà dẫn lối):

"Phủ Tây Hồ trải qua bao dâu bể, từng bị thiêu hủy năm 1947 rồi lại được nhân dân dựng lại bằng xi măng giả gỗ kiên cố. Hãy ngẩng đầu lên nhìn ba nếp nhà trùng điệp trước mắt và tìm kiếm: Nếp điện thờ nào có vị trí thấp nhất?"

Câu hỏi xác thực thực địa:

Nội dung câu hỏi: "Nếp điện thờ nào thấp nhất trong hệ thống kiến trúc Phủ?"

Các lựa chọn đáp án:

Nếp Tiền Tế ngoài cùng. -> Phản hồi hệ thống (Sai): "Hãy lùi lại một chút và ngẩng đầu quan sát độ cao của mái ngói xem sao nhé."

Nếp Trung Đường ở giữa. -> Phản hồi hệ thống (Sai): "Chưa chính xác, trung đường cao hơn một lớp nữa kìa."

Nếp Hậu Cung trong cùng. -> Phản hồi hệ thống (Đúng): "Rất tinh tế! Hậu cung được đặt thấp nhất và sâu kín nhất để giữ vẻ trang nghiêm bí ẩn nơi thờ Tam Tòa Thánh Mẫu."

Cơ chế chuyển tiếp:

Trả lời đúng: Lưu is_verified = true. Hiện nút [Tôi đã tiến sát trước cửa Hậu Cung] kèm đếm ngược 5 giây.

CHẶNG 3: HẬU CUNG (VỊ TRÍ: TRƯỚC ĐIỆN THỜ THÁNH MẪU)

Mục tiêu: Tạo cao trào cảm xúc, rẽ nhánh câu chuyện dựa trên nội tâm của người chơi.

Tài nguyên thiết lập:

Visual (Ảnh nền): [ảnh 4: Bên trong Hậu Cung huyền bí, ánh nến đỏ lập lòe, hương khói nghi ngút]

Character (Nhân vật): [ảnh nhân vật: Thần Mẫu Liễu Hạnh hiển linh lộng lẫy, trang nghiêm]

Lời thoại dẫn dắt (Speaker: Thần Mẫu hiển linh):

"Ta là Liễu Hạnh, ba lần thác sinh trần thế chịu đủ hỷ nộ ái ố nhân sinh, nay ngự chốn Tây Hồ lộng gió để che chở muôn dân. Đứng trước linh đài khói hương nghi ngút, lòng ngươi có điều chi trăn trở muốn đối thoại trực tiếp với ta?"

Lựa chọn tương tác rẽ nhánh (Tạo 4 kết cục khác nhau):

Lựa chọn 1: "Bà có hối tiếc đã xuống trần ba lần không?"

Lưu biến: ending_chosen = "A"

Phản hồi từ Mẫu: "Mẫu mỉm cười nhẹ nhõm: 'Hối tiếc chi khi trần gian đầy gian khổ nhưng cũng chan chứa tình người. Ta đã sống hết mình, yêu thương hết mình.'"

Lựa chọn 2: "Bà có thấy cô đơn giữa nhân thế không?"

Lưu biến: ending_chosen = "B"

Phản hồi từ Mẫu: "Mẫu rũ mắt trầm ngâm: 'Cô đơn là cái giá của sự bất tử. Nhưng khi thấy vạn gia đỏ lửa cầu an, lòng ta không còn lạnh lẽo nữa.'"

Lựa chọn 3: "Bà có thực sự hạnh phúc không?"

Lưu biến: ending_chosen = "C"

Phản hồi từ Mẫu: "Mẫu nhìn xa xăm ra mặt sóng nước Tây Hồ: 'Hạnh phúc là khi ta được tự do bay nhảy giữa ngàn mây và che chở được cho những mảnh đời lầm lũi.'"

Lựa chọn 4: "Bà vẫn còn đợi chờ một ai đó sao?"

Lưu biến: ending_chosen = "D"

Phản hồi từ Mẫu: "Mẫu khẽ thở dài: 'Ta đợi một tri kỷ hiểu được ý thơ Phùng Khắc Khoan xưa kia, đợi những tâm hồn thấu triệt được di sản ngàn năm.'"

Cơ chế chuyển tiếp: Sau khi người chơi chọn một câu hỏi, hệ thống ghi nhận giá trị kết cục tương ứng và hiện nút [Tôi đã hiểu, xin bước tiếp] để chuyển sang Chặng 4.

CHẶNG 4: LẦU CÔ - LẦU CẬU (VỊ TRÍ: HAI AM THỜ NHỎ BÊN SÂN)

Mục tiêu: Định tâm cầu nguyện, thực hành hành vi tâm linh thực tế ngoài đời thực.

Tài nguyên thiết lập:

Visual (Ảnh nền): [ảnh 5: Am thờ nhỏ của Lầu Cô Lầu Cậu dưới tán cây mát mẻ]

Character (Nhân vật): [ảnh nhân vật: Bóng hình Thần Mẫu khuất dần vào mây khói]

Lời thoại dẫn dắt (Speaker: Lời vang vọng của Mẫu):

"Trở ra ngoài khoảng sân lộng gió, hãy đi bộ đến khu am nhỏ bên cạnh - Lầu Cô và Lầu Cậu. Nhắm mắt lại và giữ một tâm nguyện thầm kín sâu thẳm nhất trong lòng ngươi. Ý nguyện của ngươi thuộc về nẻo đường nào?"

Tương tác lựa chọn định hướng hành động:

Lựa chọn 1: "Tình cảm, gia đạo (Hãy bước về phía Lầu Cô - bên phải)"

Lưu biến: wish_path = "co"

Phản hồi hệ thống: "Hãy hướng tâm trí về phía Lầu Cô, nơi gìn giữ những sợi dây tơ hồng kết duyên lành."

Lựa chọn 2: "Sự nghiệp, học hành (Hãy bước về phía Lầu Cậu - bên trái)"

Lưu biến: wish_path = "cau"

Phản hồi hệ thống: "Hãy hướng mắt về phía Lầu Cậu, nơi độ trì cho trí tuệ sáng suốt, công danh hiển hách."

Cơ chế chuyển tiếp: Người chơi chọn xong, định tâm cầu nguyện trong 5 giây đếm ngược thực địa trước khi nút [Tôi đã cầu nguyện xong và quay lại quán nước] được mở khóa.

CHẶNG 5: VỀ LẠI QUÁN NƯỚC (VỊ TRÍ: QUÁN NƯỚC ĐẦU HÀNH TRÌNH)

Mục tiêu: Trả về kết quả cá nhân hóa (Personalized Ending), kích hoạt nhận quà O2O (Online-to-Offline).

Tài nguyên thiết lập:

Visual (Ảnh nền): [ảnh 6: Quán nước nhỏ, ấm chè sen tỏa khói nghi ngút bên bờ hồ phẳng lặng]

Character (Nhân vật): [ảnh nhân vật: Cụ bà bán nước cười mến khách]

Lời thoại dẫn dắt (Speaker: Cụ bà bán nước):

"Tốt lắm lữ khách phương xa. Chén trà sen của ta đã nguội nhưng lòng ngươi hẳn đã bớt bão giông. Đây là lời kết duyên lành mà Thần Mẫu gửi gắm riêng cho tâm tình của ngươi hôm nay..."

Hiển thị thông điệp kết cục dựa trên lựa chọn ở Chặng 3 (ending_chosen):

Nếu ending_chosen == "A" (Kết quả: An Yên):

"... 'Buông bỏ phiền não, sống trọn khoảnh khắc trần thế.' Chén trà sen này chính là lộc an nhiên, chúc ngươi vững bước trên đường đời giông bão!"

Nếu ending_chosen == "B" (Kết quả: Thấu Cảm):

"... 'Ngươi không cô đơn, vạn vật linh thiêng vẫn dõi theo lòng thành kính.' Hãy nhận chén trà này để thắp lên ngọn lửa ấm áp sưởi ấm tâm hồn bạn."

Nếu ending_chosen == "C" (Kết quả: Tự Tại):

"... 'Hạnh phúc ở ngay dưới chân mình, trong hơi ấm của đất trời Hồ Tây.' Hãy uống cạn chén trà lành này và trân trọng những điều giản dị quanh mình nhé."

Nếu ending_chosen == "D" (Kết quả: Tri Kỷ):

"... 'Mối duyên nghìn năm nay đã gặp được người hiểu thấu di sản.' Cảm ơn tấm lòng hoài cổ của ngươi đã giúp câu chuyện của Phủ sống mãi."

Hành động O2O (Nhận lộc thực tế):

Giao diện ẩn nút tiếp tục và hiển thị một tấm thẻ quà tặng (Coupon Card) hoạt họa đẹp mắt:

Tiêu đề: LỘC DUYÊN HỒ TÂY

Phần quà: 01 Chén Trà Sen Ấm Áp

Hướng dẫn sử dụng: "Đưa màn hình này cho chủ quán trà đá cổng Tam Quan để đổi lộc kết duyên hành trình."

Mã xác thực ngẫu nhiên chống gian lận: PTH-[ending_chosen]-[Mã số ngẫu nhiên 4 chữ số] (Ví dụ: PTH-A-8392).