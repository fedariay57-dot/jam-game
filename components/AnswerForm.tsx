
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type AnswerResult = "winner" | "close" | "wrong" | "pending";

function getPlayerId() {
  let playerId = localStorage.getItem("jam_player_id");

  if (!playerId) {
    playerId = crypto.randomUUID();
    localStorage.setItem("jam_player_id", playerId);
  }

  return playerId;
}

function getResultMessage(result: AnswerResult) {
  switch (result) {
    case "winner":
      return {
        emoji: "🏆",
        title: "Ты угадал!",
        text: "Все ингредиенты на месте. Получи награду!",
      };
    case "close":
      return {
        emoji: "🔥",
        title: "Ты был близко!",
        text: "Ты угадал часть ингредиентов. Получи награду!",
      };
    case "wrong":
      return {
        emoji: "😔",
        title: "В этот раз не получилось",
        text: "Ни один ингредиент не совпал. Попробуй в следующий раз!",
      };
    default:
      return {
        emoji: "⏳",
        title: "Ответ принят",
        text: "Результат пока не определён. Попробуй обновить страницу чуть позже.",
      };
  }
}

export default function AnswerForm() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [name, setName] = useState("");
  const [taste, setTaste] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [result, setResult] = useState<AnswerResult>("pending");

  useEffect(() => {
    setPlayerId(getPlayerId());
  }, []);

  const sendAnswer = async () => {
    if (sending) return;

    if (!name.trim() || !taste.trim()) {
      alert("Заполни оба поля");
      return;
    }

    if (!playerId) {
      alert("Подожди немного и попробуй ещё раз");
      return;
    }

    setSending(true);

    const { data, error } = await supabase
      .from("answers")
      .insert([
        {
          name: name.trim(),
          taste: taste.trim(),
          player_id: playerId,
        },
      ])
      .select("result")
      .single();

    if (error) {
      console.log(error);
      alert("Не удалось отправить ответ. Попробуй ещё раз.");
      setSending(false);
      return;
    }

    const answerResult = data?.result as AnswerResult | undefined;

    setResult(answerResult || "pending");
    setSent(true);
    setSending(false);
  };

  if (sent) {
    const message = getResultMessage(result);

    return (
      <div className="mt-10 w-full max-w-md rounded-[32px] bg-white/10 p-8 text-center text-white backdrop-blur-xl">
        <div className="text-5xl">{message.emoji}</div>

        <h2 className="mt-5 text-3xl font-bold">
          {message.title}
        </h2>

        <p className="mt-3 text-white/80">
          {message.text}
        </p>

        <p className="mt-6 text-sm text-white/60">
          Твой вариант:
        </p>

        <p className="mt-2 font-semibold">
          {taste}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 w-full max-w-md rounded-[32px] bg-white/10 p-6 text-white backdrop-blur-xl">
      <label className="text-sm text-white/70">
        Как тебя зовут?
      </label>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Укажи имя и фамилию"
        className="mt-3 w-full border-b border-white/30 bg-transparent pb-3 text-lg text-white outline-none placeholder:text-white/30"
      />

      <label className="mt-8 block text-sm text-white/70">
        Какой это вкус?
      </label>

      <input
        value={taste}
        onChange={(e) => setTaste(e.target.value)}
        placeholder="Ингредиенты через запятую"
        className="mt-3 w-full border-b border-white/30 bg-transparent pb-3 text-lg text-white outline-none placeholder:text-white/30"
      />

      <button
        onClick={sendAnswer}
        disabled={sending || !playerId}
        className="mt-10 w-full rounded-full bg-gradient-to-r from-orange-400 to-red-500 py-4 text-lg font-semibold text-white disabled:opacity-50"
      >
        {sending ? "Проверяем ответ..." : "Отправить"}
      </button>
    </div>
  );
}
