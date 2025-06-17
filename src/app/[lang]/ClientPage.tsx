"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { translations } from "@/lib/translations";
import { Locale } from "@/lib/i18n-config";

interface MainPageProps {
  lang: Locale;
}

export default function MainPage({ lang }: MainPageProps) {
  const [isClient, setIsClient] = useState(false);

  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);

  const [volume, setVolume] = useState(0.5); // Âm lượng mặc định 50%
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsClient(true);

    const audio = new Audio("/audio/doro.mp3");
    audio.loop = true;
    audio.volume = volume;
    audio
      .play()
      .catch(() =>
        console.log("Cần tương tác của người dùng để phát âm thanh.")
      );

    audioRef.current = audio;

    return () => {
      audio.pause();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Hàm để thay đổi âm lượng, giới hạn giá trị từ 0 đến 1
  const changeVolume = (amount: number) => {
    setVolume((prevVolume) => Math.max(0, Math.min(1, prevVolume + amount)));
  };

  if (!isClient) {
    return null;
  }

  // Lấy bộ dịch ngôn ngữ hiện tại dựa trên 'lang' từ URL
  const currentTranslation = translations[lang];

  // Logic để nút "No" không bị lặp lại hình ảnh và text
  // Sử dụng Math.min để "ghim" ở index cuối cùng của mảng
  const imageIndex = Math.min(noCount, currentTranslation.images.length - 1);
  const noPhraseIndex = Math.min(
    noCount,
    currentTranslation.noPhrases.length - 1
  );

  // Logic để nút "Yes" ngày càng to ra
  const yesButtonSize = noCount * 20 + 16;
  const yesButtonPadding = `${noCount * 5 + 16}px ${noCount * 10 + 24}px`;

  return (
    <main className="flex w-full min-h-screen flex-col items-center justify-between p-4 sm:p-8 bg-pink-100 font-sans">
      <nav className="flex self-end gap-2">
        <Link
          href="/vi"
          className={`px-3 py-1 rounded-md text-sm transition-colors ${
            lang === "vi"
              ? "bg-pink-400 text-white"
              : "bg-white/80 text-gray-700 hover:bg-white"
          }`}
        >
          Tiếng Việt
        </Link>
        <Link
          href="/en"
          className={`px-3 py-1 rounded-md text-sm transition-colors ${
            lang === "en"
              ? "bg-pink-400 text-white"
              : "bg-white/80 text-gray-700 hover:bg-white"
          }`}
        >
          English
        </Link>
        <Link
          href="/zh"
          className={`px-3 py-1 rounded-md text-sm transition-colors ${
            lang === "zh"
              ? "bg-pink-400 text-white"
              : "bg-white/80 text-gray-700 hover:bg-white"
          }`}
        >
          中文
        </Link>
      </nav>

      <div className="flex flex-col items-center text-center">
        {yesPressed ? (
          <>
            <Image
              src={currentTranslation.yesImage}
              width={200}
              height={200}
              alt="Yayy"
              unoptimized
            />
            <p className="text-2xl md:text-4xl font-bold my-4 text-pink-500">
              {currentTranslation.yesConfirmation}
            </p>
          </>
        ) : (
          <>
            <Image
              className="mb-4"
              src={currentTranslation.images[imageIndex]}
              width={200}
              height={200}
              alt="Please"
              unoptimized
            />

            <h1 className="text-2xl md:text-4xl font-bold my-4 text-gray-800">
              {currentTranslation.question}
            </h1>

            <div className="flex flex-col md:flex-row gap-4 mt-4 items-center">
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all duration-300 ease-in-out"
                style={{ fontSize: yesButtonSize, padding: yesButtonPadding }}
                onClick={() => setYesPressed(true)}
              >
                {currentTranslation.yesButton}
              </button>
              <button
                onMouseOver={() => setNoCount((prev) => prev + 1)}
                // Đảm bảo nút chiếm đủ chiều rộng trên mobile
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-lg transition-colors w-full md:w-auto"
              >
                {currentTranslation.noPhrases[noPhraseIndex]}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center flex-col gap-2 mt-8 p-2">
        <div className="flex items-center p-2 bg-white/50 rounded-lg backdrop-blur-sm">
          <button
            onClick={() => changeVolume(-0.1)}
            aria-label="Giảm âm lượng"
            className="text-xl w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-white/70"
          >
            🔉
          </button>
          <div className="w-24 h-2 bg-gray-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-pink-400"
              style={{ width: `${volume * 100}%` }}
            ></div>
          </div>
          <button
            onClick={() => changeVolume(0.1)}
            aria-label="Tăng âm lượng"
            className="text-xl w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-white/70"
          >
            🔊
          </button>
        </div>
        <span className="text-xs text-gray-500">
          Made with ❤️ by{" "}
          <Link
            href="https://github.com/fumodayo/doro"
            className="font-bold text-gray-700 hover:text-gray-900"
          >
            fumodayo
          </Link>
        </span>
      </div>
    </main>
  );
}
