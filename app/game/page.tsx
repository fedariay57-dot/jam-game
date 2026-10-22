
"use client";

import { useEffect, useState } from "react";
import AnswerForm from "@/components/AnswerForm";
import { supabase } from "@/lib/supabase";

type GameSettings = {
  status: string;
  correct_taste: string | null;
};

type PlayerAnswer = {
  result: string;
  taste: string;
};

function getResultMessage(result: string) {
  switch (result) {
    case "winner":
      return {
        emoji: "🏆",
        title: "Ты угадал!",
        text: "Все ингредиенты на месте!",
      };
    case "close":
      return {
        emoji: "🔥",
        title: "Ты был близко!",
        text: "Ты угадал часть ингредиентов!",
      };
    case "wrong":
      return {
        emoji: "😔",
        title: "В этот раз не получилось",
        text: "Ни один ингредиент не совпал.",
      };
    default:
      return {
        emoji: "⏳",
        title: "Ответ принят",
        text: "Результат пока не определён.",
      };
  }
}

export default function GamePage() {
  const [game, setGame] = useState<GameSettings | null>(null);
  const [playerAnswer, setPlayerAnswer] = useState<PlayerAnswer | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const loadGame = async () => {
      setLoading(true);
      setLoadError(false);

      try {
        const { data: gameData, error: gameError } = await supabase
          .from("game_settings")
          .select("status, correct_taste")
          .limit(1)
          .single();

        if (gameError) throw gameError;

        setGame(gameData);

        const playerId = localStorage.getItem("jam_player_id");

        if (playerId) {
          const { data: answerData, error: answerError } = await supabase
            .from("answers")
            .select("result, taste")
            .eq("player_id", playerId)
            .maybeSingle();

          if (answerError) throw answerError;

          setPlayerAnswer(answerData);
        } else {
          setPlayerAnswer(null);
        }
      } catch (error) {
        console.error("Ошибка загрузки игры:", error);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        Загружаем игру...
      </main>
    );
  }

  if (loadError || !game) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-black px-5 text-center text-white">
        <h1 className="text-2xl font-bold">
          Не удалось загрузить игру
        </h1>
        <p className="mt-3 text-white/60">
          Проверь подключение и попробуй обновить страницу.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 rounded-full bg-orange-500 px-6 py-3 font-semibold"
        >
          Обновить страницу
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-5 py-12 text-white bg-gradient-to-b from-[#24120b] via-[#35170c] to-black">
      <div className="w-full max-w-md text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-white/50">
          Джем 1GT
        </p>

        <h1 className="mt-5 text-4xl font-bold">
          Угадай
          <br />
          вкус месяца
        </h1>

        {game.status === "active" && (
          <>
            {playerAnswer ? (
              <div className="mt-10 rounded-3xl bg-white/10 p-8 backdrop-blur-xl">
                {(() => {
                  const message = getResultMessage(playerAnswer.result);
                  return (
                    <>
                      <div className="text-4xl">{message.emoji}</div>
                      <h2 className="mt-4 text-2xl font-bold">
                        {message.title}
                      </h2>
                      <p className="mt-3 text-white/70">
                        {message.text}
                      </p>
                      <p className="mt-6 text-sm text-white/50">
                        Твой вариант:
                      </p>
                      <p className="mt-2 font-semibold">
                        {playerAnswer.taste}
                      </p>
                      <div className="mt-6 border-t border-white/20 pt-6">
                        <p className="text-sm text-white/60">
                          Загаданный вкус:
                        </p>
                        <p className="mt-2 text-xl font-bold">
                          {game.correct_taste}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <>
                <p className="mt-5 text-white/70">
                  Попробуй угадать секретный вкус.
                </p>
                <AnswerForm />
              </>
            )}
          </>
        )}

        {game.status === "closed" && (
          <div className="mt-10 rounded-3xl bg-white/10 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold">
              Игра завершена
            </h2>
            <p className="mt-3 text-white/60">
              Приём ответов закрыт.
            </p>

            {playerAnswer && (
              <>
                <p className="mt-6 text-sm text-white/60">
                  Твой ответ:
                </p>
                <p className="mt-2 font-semibold">
                  {playerAnswer.taste}
                </p>
                <p className="mt-6 text-sm text-white/60">
                  Загаданный вкус:
                </p>
                <p className="mt-2 text-xl font-bold">
                  {game.correct_taste}
                </p>
                <h3 className="mt-6 text-xl font-bold">
                  {getResultMessage(playerAnswer.result).title}
                </h3>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
