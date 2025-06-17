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
  const [started, setStarted] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const volumeBarRef = useRef<HTMLDivElement>(null);

  const handleVolumeScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeBarRef.current) return;

    // Lấy kích thước và vị trí của thanh trượt
    const rect = volumeBarRef.current.getBoundingClientRect();
    // Tính toán vị trí click của chuột so với điểm bắt đầu của thanh trượt
    const clickX = e.clientX - rect.left;
    const barWidth = rect.width;

    // Tính toán âm lượng mới (giá trị từ 0 đến 1)
    // Dùng Math.max/min để đảm bảo giá trị luôn nằm trong khoảng [0, 1]
    const newVolume = Math.max(0, Math.min(1, clickX / barWidth));

    setVolume(newVolume);
  };

  const handleStart = () => {
    if (!audioRef.current) {
      const audio = new Audio("/audio/doro.mp3");
      audio.loop = true;
      audio.volume = volume;

      audio.play().catch((error) => {
        console.error("Lỗi khi phát nhạc:", error);
      });
      audioRef.current = audio;
    }
    setStarted(true);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const changeVolume = (amount: number) => {
    setVolume((prevVolume) => Math.max(0, Math.min(1, prevVolume + amount)));
  };

  const currentTranslation = translations[lang];
  const imageIndex = Math.min(noCount, currentTranslation.images.length - 1);
  const noPhraseIndex = Math.min(
    noCount,
    currentTranslation.noPhrases.length - 1
  );
  const yesButtonSize = noCount * 20 + 16;
  const yesButtonPadding = `${noCount * 5 + 16}px ${noCount * 10 + 24}px`;

  return (
    <>
      {!started && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-pink-100/70 backdrop-blur-sm">
          <div className="text-center p-8 bg-white rounded-3xl shadow-2xl max-w-sm mx-4 ring-1 ring-black ring-opacity-5">
            <div className="text-6xl mb-5 animate-bounce">🤫</div>

            <h1 className="text-3xl font-bold text-gray-800 mb-6 leading-tight">
              {currentTranslation.startScreen.title}
            </h1>

            <button
              onClick={handleStart}
              className="bg-pink-500 text-white font-bold py-4 w-full rounded-2xl transition-all duration-300 transform hover:scale-105 hover:bg-pink-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-pink-300 shadow-lg hover:shadow-xl cursor-pointer"
            >
              {currentTranslation.startScreen.button}
            </button>
          </div>
        </div>
      )}

      <main
        className={`flex w-full min-h-screen flex-col items-center justify-between p-4 sm:p-8 bg-pink-100 font-sans transition-opacity duration-700 ${
          started ? "opacity-100" : "opacity-0"
        }`}
      >
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
                  className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all duration-300 ease-in-out cursor-pointer"
                  style={{ fontSize: yesButtonSize, padding: yesButtonPadding }}
                  onClick={() => setYesPressed(true)}
                >
                  {currentTranslation.yesButton}
                </button>
                <button
                  onClick={() => setNoCount((prev) => prev + 1)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-lg transition-colors w-full md:w-auto cursor-pointer"
                >
                  {currentTranslation.noPhrases[noPhraseIndex]}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center flex-col gap-2 mt-8 p-2">
          <div className="flex items-center gap-3 p-2 bg-white/60 rounded-full backdrop-blur-sm shadow-md ring-1 ring-black ring-opacity-5">
            <button
              onClick={() => changeVolume(-0.1)}
              aria-label="Giảm âm lượng"
              className="text-xl w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-white/70 active:bg-white/90"
            >
              🔉
            </button>

            <div
              ref={volumeBarRef}
              onClick={handleVolumeScrub}
              className="group relative w-28 h-4 flex items-center cursor-pointer"
            >
              <div className="w-full h-1.5 bg-gray-300 rounded-full transition-all duration-300 group-hover:h-2.5"></div>

              <div
                className="absolute top-1/2 -translate-y-1/2 h-1.5 bg-pink-400 rounded-full transition-all duration-300 group-hover:h-2.5"
                style={{ width: `${volume * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-pink-400 transition-transform duration-300 group-hover:scale-110"></div>
              </div>
            </div>

            <button
              onClick={() => changeVolume(0.1)}
              aria-label="Tăng âm lượng"
              className="text-xl w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-white/70 active:bg-white/90"
            >
              🔊
            </button>
          </div>
          <span className="text-xs text-gray-500">
            Made with ❤️ by{" "}
            <Link
              target="_blank"
              href="https://github.com/fumodayo/doro"
              className="font-bold text-gray-700 hover:text-gray-900"
            >
              fumodayo
            </Link>
          </span>
        </div>
      </main>
    </>
  );
}
