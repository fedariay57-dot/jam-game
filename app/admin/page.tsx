
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Answer = {
  id: number;
  name: string;
  taste: string;
  result: string;
  created_at: string;
};

type GameSettings = {
  id: number;
  status: string;
  correct_taste: string | null;
};

const ADMIN_PASSWORD = "jam2026";

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [game, setGame] = useState<GameSettings | null>(null);
  const [correctTaste, setCorrectTaste] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("jam_admin", "true");
      setIsAdmin(true);
      setLoading(true);
    } else {
      alert("Неверный пароль");
    }
  };

  const logout = () => {
    localStorage.removeItem("jam_admin");
    setIsAdmin(false);
  };

  const loadData = async () => {
    const { data: answersData, error: answersError } =
      await supabase
        .from("answers")
        .select("*")
        .order("created_at", { ascending: false });

    if (answersError) {
      console.log(answersError);
      alert("Не удалось загрузить ответы");
    } else if (answersData) {
      setAnswers(answersData);
    }

    const { data: gameData, error: gameError } =
      await supabase
        .from("game_settings")
        .select("*")
        .limit(1)
        .single();

    if (gameError) {
      console.log(gameError);
      alert("Не удалось загрузить настройки игры");
    } else if (gameData) {
      setGame(gameData);
      setCorrectTaste(gameData.correct_taste || "");
    }

    setLoading(false);
  };

  const updateResult = async (id: number, result: string) => {
    const { error } = await supabase
      .from("answers")
      .update({ result })
      .eq("id", id);

    if (error) {
      console.log(error);
      alert("Не удалось изменить результат");
      return;
    }

    await loadData();
  };

  const startNewGame = async () => {
    if (saving || !game) return;

    const taste = correctTaste.trim();

    if (!taste) {
      alert("Сначала введи правильный состав джема");
      return;
    }

    const confirmed = window.confirm(
      "Начать новую игру? Все ответы предыдущего раунда будут удалены."
    );

    if (!confirmed) return;

    setSaving(true);

    try {
      // Сначала закрываем игру, чтобы никто не отправлял
      // ответы во время подготовки нового раунда.
      const { error: closeError } = await supabase
        .from("game_settings")
        .update({
          status: "closed",
          correct_taste: taste,
        })
        .eq("id", game.id);

      if (closeError) throw closeError;

      // Удаляем ответы предыдущего раунда.
      const { error: deleteError } = await supabase
        .from("answers")
        .delete()
        .neq("id", 0);

      if (deleteError) throw deleteError;

      // Запускаем новый раунд с сохранённым составом.
      const { error: startError } = await supabase
        .from("game_settings")
        .update({ status: "active" })
        .eq("id", game.id);

      if (startError) throw startError;

      await loadData();
      alert("Новая игра запущена!");
    } catch (error) {
      console.log(error);
      await loadData();
      alert(
        "Не удалось полностью запустить новую игру. Проверь статус игры и попробуй ещё раз."
      );
    } finally {
      setSaving(false);
    }
  };

  const finishGame = async () => {
    if (saving || !game) return;

    const confirmed = window.confirm(
      "Завершить игру и закрыть приём ответов?"
    );

    if (!confirmed) return;

    setSaving(true);

    const { error } = await supabase
      .from("game_settings")
      .update({ status: "closed" })
      .eq("id", game.id);

    if (error) {
      console.log(error);
      alert("Не удалось завершить игру");
    } else {
      await loadData();
      alert("Игра завершена. Ответы сохранены.");
    }

    setSaving(false);
  };

  useEffect(() => {
    if (localStorage.getItem("jam_admin") === "true") {
      setIsAdmin(true);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-neutral-950 p-5 text-white">
        <div className="w-full max-w-sm rounded-3xl bg-white/10 p-8">
          <h1 className="text-2xl font-bold text-center">
            Админка
          </h1>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            className="mt-6 w-full rounded-xl bg-white/10 px-4 py-3 outline-none"
          />

          <button
            onClick={login}
            className="mt-5 w-full rounded-full bg-orange-500 py-3 font-semibold"
          >
            Войти
          </button>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black p-10 text-white">
        Загружаем...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-5 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            Панель управления
          </h1>

          <button
            onClick={logout}
            className="rounded-full bg-white/10 px-4 py-2"
          >
            Выйти
          </button>
        </div>

        <section className="mt-8 rounded-3xl bg-white/10 p-6">
          <h2 className="text-xl font-bold">
            Управление игрой
          </h2>

          <p className="mt-2 text-white/60">
            Статус:{" "}
            {game?.status === "active"
              ? "Игра идёт"
              : "Приём ответов закрыт"}
          </p>

          <label className="mt-5 block text-sm text-white/70">
            Загаданный состав джема
          </label>

          <input
            value={correctTaste}
            onChange={(e) => setCorrectTaste(e.target.value)}
            placeholder="Например: яблоко, корица, имбирь"
            className="mt-2 w-full rounded-xl bg-white/10 px-4 py-3"
          />

          <p className="mt-2 text-sm text-white/50">
            Перечисли ингредиенты через запятую или точку с запятой.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={startNewGame}
              disabled={saving}
              className="rounded-full bg-green-500 px-5 py-3 disabled:opacity-50"
            >
              {saving ? "Подожди..." : "🎮 Новая игра"}
            </button>

            <button
              onClick={finishGame}
              disabled={saving || game?.status !== "active"}
              className="rounded-full bg-red-500 px-5 py-3 disabled:opacity-50"
            >
              🏁 Завершить игру
            </button>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold">
            Ответы игроков
          </h2>

          <p className="mt-2 text-white/60">
            Всего: {answers.length}
          </p>

          <div className="mt-6 space-y-5">
            {answers.map((answer) => (
              <div
                key={answer.id}
                className="rounded-3xl bg-white/10 p-6"
              >
                <p className="text-xl font-semibold">
                  {answer.name}
                </p>

                <p className="mt-2 text-white/80">
                  {answer.taste}
                </p>

                <p className="mt-2 text-sm text-white/50">
                  Результат: {answer.result}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={() => updateResult(answer.id, "winner")}
                    className="rounded-full bg-green-500 px-4 py-2"
                  >
                    🏆 Угадал
                  </button>

                  <button
                    onClick={() => updateResult(answer.id, "close")}
                    className="rounded-full bg-yellow-500 px-4 py-2"
                  >
                    🔥 Был близко
                  </button>

                  <button
                    onClick={() => updateResult(answer.id, "wrong")}
                    className="rounded-full bg-red-500 px-4 py-2"
                  >
                    ❌ Не угадал
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
