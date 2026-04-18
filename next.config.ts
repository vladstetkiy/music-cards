import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",  // Включаем режим статического экспорта [citation:6][citation:10]
  images: {
    unoptimized: true,  // Отключаем оптимизацию изображений (не нужна для статики)
  },
  trailingSlash: true,  // Добавляем слеши в конце URL (рекомендуется для GitHub Pages)
};

export default nextConfig;