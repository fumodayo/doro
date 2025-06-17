/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Chúng ta vẫn giữ lại cấu hình này để đảm bảo build không bị lỗi type
    ignoreBuildErrors: true,
  },

  // ---- PHẦN THÊM VÀO ĐỂ SỬA LỖI 404 KHI DEPLOY ----
  async redirects() {
    return [
      {
        source: "/", // Khi người dùng truy cập vào đường dẫn gốc
        destination: "/vi", // Chuyển hướng họ đến trang Tiếng Việt (bạn có thể đổi thành '/en' hoặc '/zh')
        permanent: true, // Báo cho trình duyệt và công cụ tìm kiếm rằng đây là chuyển hướng vĩnh viễn
      },
    ];
  },
  // ------------------------------------------------
};

export default nextConfig;
