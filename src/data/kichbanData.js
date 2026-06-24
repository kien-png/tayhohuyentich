import anh1 from '../assets/anh1.png';
import anh2 from '../assets/anh2.jpg';
import anh3 from '../assets/anh3.jpg';
import anh4 from '../assets/anh4.jpg';
import anh5 from '../assets/anh5.jpg';
import anh6 from '../assets/anh6.jpg';
import anh7 from '../assets/anh7.jpg';

export const kichbanData = [
  {
    stage: 0,
    title: "Khởi Hành",
    location: "Vị trí: Quán nước ven hồ",
    speaker: "Cô",

    background: anh2,
    character: anh1,
    characterName: "Cô",
    characterStyle: "max-h-[340px] md:max-h-[420px] w-auto drop-shadow-[0_4px_25px_rgba(0,0,0,0.7)] brightness-[0.7] opacity-60",
    dialogues: [
      "Chào con.",
      "Người ta thường nghĩ rằng muốn khám phá một vùng đất thì phải đi thật xa. Nhưng có những câu chuyện lại nằm ngay dưới bước chân mình.",
      "Hôm nay, ta sẽ dẫn con đi qua những mảnh ký ức đang ngủ quên nơi này.",
      "Mỗi điểm dừng là một câu chuyện. Mỗi câu chuyện là một manh mối.",
      "Và chỉ khi ghép đủ chúng lại, con mới nhìn thấy bức tranh hoàn chỉnh.",
      "Con đã sẵn sàng chưa?"
    ],
    choices: [
      {
        text: "BẮT ĐẦU HÀNH TRÌNH",
        reply: ""
      }
    ],
    postChoiceDialogues: [
      "Muốn bước vào một nơi linh thiêng, trước tiên phải đi qua cánh cửa của sự quan sát.",
      "Và cánh cửa đầu tiên đang ở ngay phía trước con.",
      "Ta có những câu hỏi nhưng đáp án không nằm ở đây.",
      "Hãy đi đến Tam Quan của phủ, đứng trước cổng và nhìn thật kỹ.",
      "Trên Tam Quan có rất nhiều chi tiết mà người ta thường vô tình bỏ qua."
    ],
    buttonText: "ĐÃ ĐẾN TAM QUAN PHỦ",
    countdown: 5
  },
  {
    stage: 1,
    title: "Tam Quan Phủ",
    location: "Vị trí: Cổng Tam Quan trước phủ",
    speaker: "Cô",

    background: anh3,
    character: anh1,
    characterName: "Cô",
    characterStyle: "max-h-[340px] md:max-h-[420px] w-auto drop-shadow-[0_4px_25px_rgba(0,0,0,0.7)] brightness-[0.95]",
    dialogues: [
      "Tốt lắm. Con đã bước những bước đầu tiên trên hành trình này.",
      "Nhưng để vào được câu chuyện của Phủ Tây Hồ, con phải đi qua cánh cổng của ký ức.",
      "Hãy ngẩng đầu nhìn về trước mắt, cho ta biết: Cổng Tam Quan có bao nhiêu lối đi?"
    ],
    question: {
      text: "Cổng Tam Quan có bao nhiêu lối đi?",
      choices: [
        {
          text: "1 lối",
          correct: false,
          feedback: "Hãy quan sát lại thật kỹ. Tìm lại đúng vị trí và đếm chính xác hơn nhé."
        },
        {
          text: "2 lối",
          correct: false,
          feedback: "Hãy quan sát lại thật kỹ. Tìm lại đúng vị trí và đếm chính xác hơn nhé."
        },
        {
          text: "3 lối",
          correct: true,
          feedback: "Chính xác! Tam Quan có 3 lối đi. Cửa giữa dành cho bậc tôn quý, hai cửa bên dành cho người thường. Hãy bước qua để vào sân phủ."
        }
      ]
    },
    buttonText: "Tôi đã vào sân phủ",
    countdown: 5
  },

  {
    stage: 2,
    title: "Sân Phủ",
    location: "Vị trí: Khoảng sân rộng trước Tam Tòa",
    speaker: "Cô",
    background: anh4,
    character: anh1,
    characterName: "Cô",
    characterStyle: "max-h-[340px] md:max-h-[420px] w-auto drop-shadow-[0_4px_25px_rgba(0,0,0,0.7)] brightness-[0.95]",
    dialogues: [
      "Con hãy nhìn xuống dưới. Có một câu đối — hai bên trụ cổng.",
      "Câu đối đó kể chuyện về một cuộc gặp gỡ 400 năm trước. Cuộc gặp giữa quan trạng và Công chúa Liễu Hạnh bên quán nước. Con có biết quan trạng tên gì không?"
    ],
    question: {
      text: "Quan trạng trong câu chuyện tên gì?",
      choices: [
        {
          text: "Trần Đạo Lang",
          correct: false,
          feedback: "Đó là Phùng Khắc Khoan. Một vị trạng nguyên nổi tiếng của nước ta. Tương truyền, trên đường trở về sau chuyến đi sứ, ông ghé vào một quán nước bên Hồ Tây. Và tại đó, ông gặp công chúa Liễu Hạnh."
        },
        {
          text: "Phùng Khắc Khoan",
          correct: true,
          feedback: "Đúng rồi. Đó là Phùng Khắc Khoan. Người ta kể rằng ông từng dừng chân bên một quán nước ven Hồ Tây. Đôi câu đối này chính là cách dân gian lưu lại cuộc gặp năm ấy."
        },
        {
          text: "Trạng Quỳnh",
          correct: false,
          feedback: "Đó là Phùng Khắc Khoan. Một vị trạng nguyên nổi tiếng của nước ta. Tương truyền, trên đường trở về sau chuyến đi sứ, ông ghé vào một quán nước bên Hồ Tây. Và tại đó, ông gặp công chúa Liễu Hạnh."
        }
      ]
    },
    postQuestion1Dialogues: [
      "Tốt rồi! Con đã tìm được manh mối đầu tiên.",
      "Nhưng hành trình vẫn chưa hết đâu. Theo ta vào sân phủ nhé.",
      "Ở đây còn giấu một bí mật thú vị về cách người xưa xây dựng ngôi phủ này. Hãy tìm Phủ chính."
    ],
    buttonText: "ĐÃ ĐẾN PHỦ CHÍNH",
    countdown: 5
  },

  {
    stage: 3,
    title: "Tam Tòa Thánh Mẫu",
    location: "Vị trí: Ban thờ Tam Tòa Thánh Mẫu",
    speaker: "Cô",
    background: anh5,
    character: anh1,
    characterName: "Cô",
    characterStyle: "max-h-[340px] md:max-h-[420px] w-auto drop-shadow-[0_4px_25px_rgba(0,0,0,0.7)] brightness-[0.95]",
    dialogues: [
      "Trước mặt con có ngôi nhà 2 tầng nhỏ ở giữa sân gọi là Phủ chính, chia làm 3 nếp — Tiền tế, Trung đường, Hậu cung.",
      "Hãy nhìn vào Tiền tế (lớp đầu) và cho ta biết có bao nhiêu cửa chính phía trước?"
    ],
    question: {
      text: "Tiền tế có bao nhiêu cửa chính phía trước?",
      choices: [
        {
          text: "3 cửa",
          correct: true,
          feedback: "Đúng rồi!"
        },
        {
          text: "2 cửa",
          correct: false,
          feedback: "Hãy quan sát lại thật kỹ nhé. Tìm lại đúng vị trí và đếm chính xác hơn."
        },
        {
          text: "1 cửa",
          correct: false,
          feedback: "Hãy quan sát lại thật kỹ nhé. Tìm lại đúng vị trí và đếm chính xác hơn."
        }
      ]
    },
    postVerifiedDialogues: [
      "Bây giờ hãy nhìn quanh sân phủ xem nào. Con đang đứng trong sân phủ. Phía trước là ba nếp nhà nối tiếp nhau. Người xưa gọi là Tiền tế, Trung đường và Hậu cung.",
      "Ở hành trình trước, con đã được cung cấp thông tin về kiến trúc của không gian này, vậy ta sẽ kiểm tra lại một chút: Trong ba lớp ấy, lớp nào thấp nhất?"
    ],
    question2: {
      text: "Trong ba lớp ấy, lớp nào thấp nhất?",
      choices: [
        {
          text: "Tiền tế",
          correct: false,
          feedback: "Đáp án là Hậu cung. Nhiều người cũng nghĩ như con bởi nơi thờ chính thường khiến ta nghĩ đến vị trí cao và trang nghiêm nhất. Nhưng ở ngôi phủ này, Hậu cung mới là phần thấp nhất trong ba lớp công trình. Đó là một chi tiết mà không phải ai đến đây cũng để ý. Nào, chúng ta hãy tiếp tục khám phá nhé. Ta còn một câu hỏi nữa dành cho con đây."
        },
        {
          text: "Trung đường",
          correct: false,
          feedback: "Đáp án là Hậu cung. Nhiều người cũng nghĩ như con bởi nơi thờ chính thường khiến ta nghĩ đến vị trí cao và trang nghiêm nhất. Nhưng ở ngôi phủ này, Hậu cung mới là phần thấp nhất trong ba lớp công trình. Đó là một chi tiết mà không phải ai đến đây cũng để ý. Nào, chúng ta hãy tiếp tục khám phá nhé. Ta còn một câu hỏi nữa dành cho con đây."
        },
        {
          text: "Hậu cung",
          correct: true,
          feedback: "Chính xác! Nhiều người thường nghĩ nơi thờ chính sẽ nằm cao nhất. Nhưng ở ngôi phủ này, Hậu cung lại là phần thấp nhất trong ba lớp công trình. Mỗi ngôi đền, ngôi phủ đều có những cách bố trí riêng, và đó cũng là điều khiến việc khám phá trở nên thú vị."
        }
      ]
    },
    postQuestion2Dialogues: [
      "Có một điện thờ đặc biệt đang chờ con khám phá. Nào, chúng ta tiếp tục khám phá nhé. Ta còn một câu hỏi nữa dành cho con đây. Hãy đến Điện Sơn Trang."
    ],
    
    buttonText: "ĐÃ ĐẾN ĐIỆN SƠN TRANG",
    countdown: 5
  },

  {
    stage: 4,
    title: "Điện Sơn Trang",
    location: "Vị trí: Điện Sơn Trang",
    speaker: "Cô",
    background: anh7,
    character: anh1,
    characterName: "Cô",
    characterStyle: "max-h-[340px] md:max-h-[420px] w-auto drop-shadow-[0_4px_25px_rgba(0,0,0,0.7)] brightness-[0.95]",
    dialogues: [
      "Hành trình của chúng ta sẽ tiếp tục tại chính nơi con đang đứng. Trước mặt con là hạ ban của điện Sơn Trang thường sẽ có tượng Ngũ Hổ - tượng trưng cho sức mạnh trấn giữ ngũ phương. Tượng hổ to nhất ở chính giữa có màu gì?"
    ],
    question: {
      text: "Tượng hổ to nhất ở chính giữa có màu gì?",
      choices: [
        {
          text: "Trắng",
          correct: false,
          feedback: "Hãy tìm lại đúng vị trí và quan sát kỹ hơn nhé."
        },
        {
          text: "Đỏ",
          correct: false,
          feedback: "Hãy tìm lại đúng vị trí và quan sát kỹ hơn nhé."
        },
        {
          text: "Vàng",
          correct: true,
          feedback: "Đúng vậy! Tượng hổ ở ban thờ Sơn Trang thường được sơn màu vàng."
        }
      ]
    },
    preQuestion2Dialogues: [
      "Khác với những ban thờ khác trong phủ, nơi này mang màu sắc của núi rừng nhiều hơn.",
      "Từ các vị Chúa Sơn Trang, các Cô Sơn Trang cho đến những lễ vật dâng cúng, tất cả đều gợi nhớ đến thế giới của cây cối, khe suối và đại ngàn.",
      "Điều đó không phải ngẫu nhiên. Hãy cho ta biết vì sao người Việt xưa lại lập riêng một Điện Sơn Trang trong phủ?"
    ],
    question2: {
      text: "Vì sao người Việt xưa lại lập riêng một Điện Sơn Trang trong phủ?",
      choices: [
        {
          text: "Để thờ các vị thần núi rừng",
          correct: true,
          feedback: "Chính xác! Đáp án là thờ các vị thần núi rừng. Ngày xưa, mỗi khi vào rừng lấy gỗ, hái thuốc hay mở đất canh tác, người dân đều tin rằng núi rừng có những vị thần cai quản. Vì thế họ lập Điện Sơn Trang để tỏ lòng tôn kính và cầu mong bình an."
        },
        {
          text: "Để tưởng nhớ những người đi khai phá miền núi",
          correct: false,
          feedback: "Đáp án là thờ các vị thần núi rừng. Ngày xưa, mỗi khi vào rừng lấy gỗ, hái thuốc hay mở đất canh tác, người dân đều tin rằng núi rừng có những vị thần cai quản. Vì thế họ lập Điện Sơn Trang để tỏ lòng tôn kính và cầu mong bình an. Đó cũng là lý do trong ngôi phủ bên Hồ Tây này lại có một không gian dành riêng cho miền sơn lâm. Nào, mình tiếp tục hành trình nhé."
        },
        {
          text: "Để thờ các loài thú trong rừng",
          correct: false,
          feedback: "Đáp án là thờ các vị thần núi rừng. Ngày xưa, mỗi khi vào rừng lấy gỗ, hái thuốc hay mở đất canh tác, người dân đều tin rằng núi rừng có những vị thần cai quản. Vì thế họ lập Điện Sơn Trang để tỏ lòng tôn kính và cầu mong bình an. Đó cũng là lý do trong ngôi phủ bên Hồ Tây này lại có một không gian dành riêng cho miền sơn lâm. Nào, mình tiếp tục hành trình nhé."
        }
      ]
    },
    postQuestion2Dialogues: [
      "Hành trình này vẫn còn một mảnh ghép nữa. Đó là những vị Thánh Cô và Thánh Cậu — những người luôn xuất hiện bên cạnh các đấng bề trên trong các tích truyện dân gian. Nào, cùng ta tìm hiểu tiếp nhé."
    ],
    buttonText: "ĐÃ ĐẾN LẦU CÔ - LẦU CẬU",
    countdown: 5
  },

  {
    stage: 5,
    title: "Lầu Cô - Lầu Cậu",
    location: "Vị trí: Hai am thờ nhỏ bên sân",
    speaker: "Cô",
    background: anh6,
    character: anh1,
    characterName: "Cô",
    characterStyle: "max-h-[340px] md:max-h-[420px] w-auto drop-shadow-[0_4px_25px_rgba(0,0,0,0.7)] brightness-[0.8] opacity-70",
    dialogues: [
      "Trước mặt con là Lầu Cô (hoặc Lầu Cậu). Cho ta biết hai bên lầu có gì?"
    ],
    question: {
      text: "Hai bên lầu có gì?",
      choices: [
        {
          text: "Một đôi câu đối chữ Hán",
          correct: true,
          feedback: "Bây giờ con chọn một bên. Lầu Cô hay Lầu Cậu. Nếu điều đó về tình cảm — đứng ở Lầu Cô. Nếu điều đó về công việc — đứng ở Lầu Cậu. Hãy nhắm mắt lại, con nghĩ về một điều mà con mong cầu — một điều con chưa nói được với ai. Chỉ nghĩ trong đầu. Cháu chọn bên nào?"
        },
        {
          text: "Hai bức tranh phong cảnh",
          correct: false,
          feedback: "Hãy tìm lại đúng vị trí và quan sát kỹ hơn nhé."
        },
        {
          text: "Hai con hạc đồng",
          correct: false,
          feedback: "Hãy tìm lại đúng vị trí và quan sát kỹ hơn nhé."
        }
      ]
    },
    postQuestion1Dialogues: [
      "Cháu chọn bên nào?"
    ],
    wishChoices: [
      {
        text: "Tình cảm, gia đạo (Lầu Cô)",
        wish: "co",
        reply: "Con đã đặt câu hỏi của con xuống đây. Ta sẽ giữ cho con. Hành trình của con trong phủ — đã xong. Hãy quay lại quán nước. Ta sẽ đợi con ở đó."
      },
      {
        text: "Công việc, học hành (Lầu Cậu)",
        wish: "cau",
        reply: "Con đã đặt câu hỏi của con xuống đây. Ta sẽ giữ cho con. Hành trình của con trong phủ — đã xong. Hãy quay lại quán nước. Ta sẽ đợi con ở đó."
      }
    ],
    postWishDialogues: [],
    buttonText: "QUAY LẠI QUÁN NƯỚC",
    countdown: 5
  },
  {
    stage: 6,
    title: "Kết Duyên Lành",
    location: "Vị trí: Quán nước đầu hành trình",
    speaker: "Cô",

    background: anh2,
    character: anh1,
    characterName: "Cô",
    characterStyle: "max-h-[340px] md:max-h-[420px] w-auto drop-shadow-[0_4px_25px_rgba(0,0,0,0.7)] brightness-[0.95]",
    dialogues: [
      "Con đã hoàn thành hành trình rồi. Từ câu chuyện của vị trạng nguyên năm xưa, Điện Sơn Trang của núi rừng. Đến Lầu Cô, Lầu Cậu bên hồ. Mỗi nơi con đi qua đều là một mảnh ký ức. Và giờ đây, những mảnh ký ức ấy đã ghép lại thành một câu chuyện hoàn chỉnh. Phủ Tây Hồ không chỉ là một điểm đến để dâng hương. Đó còn là nơi lưu giữ lịch sử, tín ngưỡng và những câu chuyện đã được truyền từ thế hệ này sang thế hệ khác. Khi rời khỏi nơi đây, mong rằng con sẽ mang theo không chỉ những bức ảnh đẹp... Mà còn cả những câu chuyện đang sống dưới mái phủ này.",
      "Hành trình kết thúc. Nhưng việc gìn giữ di sản thì không.\nMỗi câu chuyện được lắng nghe.\nMỗi giá trị được trân trọng.\nMỗi di sản được khám phá.\nĐều là một cách để quá khứ tiếp tục sống trong hiện tại.\nCảm ơn con đã đồng hành cùng Phủ Tây Hồ."
    ]
  }
];
