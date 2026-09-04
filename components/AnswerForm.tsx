"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


function getPlayerId() {
  let playerId = localStorage.getItem("jam_player_id");


  if (!playerId) {
    playerId = crypto.randomUUID();

    localStorage.setItem(
      "jam_player_id",
      playerId
    );
  }


  return playerId;
}



export default function AnswerForm() {

  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const [name, setName] = useState("");
  const [taste, setTaste] = useState("");

  const [playerId, setPlayerId] = useState("");



  useEffect(() => {
    setPlayerId(getPlayerId());
  }, []);




  const sendAnswer = async () => {

    if (sending) return;


    if (!name.trim() || !taste.trim()) {
      alert("Заполни оба поля");
      return;
    }


    setSending(true);



    const { error } = await supabase
      .from("answers")
      .insert([
        {
          name: name.trim(),
          taste: taste.trim(),
          player_id: playerId,
        },
      ]);



    if (!error) {
      setSent(true);
    } else {
      console.log(error);
      alert("Не удалось отправить ответ");
    }



    setSending(false);

  };




  if (sent) {

    return (

      <div
        className="
          mt-10
          w-full
          max-w-md
          rounded-[32px]
          bg-white/10
          p-8
          text-center
          text-white
          backdrop-blur-xl
        "
      >

        <div className="text-5xl">
          🎉
        </div>


        <h2
          className="
            mt-5
            text-3xl
            font-bold
          "
        >
          Спасибо!
        </h2>


        <p
          className="
            mt-3
            text-white/80
          "
        >
          Твой ответ принят.
        </p>


        <p
          className="
            mt-6
            text-sm
            text-white/60
          "
        >
          Жди результатов 👀
        </p>


      </div>

    );

  }




  return (

    <div
      className="
        mt-10
        w-full
        max-w-md
        rounded-[32px]
        bg-white/10
        p-6
        backdrop-blur-xl
      "
    >


      <label
        className="
          text-sm
          text-white/70
        "
      >
        Как тебя зовут?
      </label>


      <input
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
        placeholder="Введите имя и фамилию"
        className="
          mt-3
          w-full
          border-b
          border-white/30
          bg-transparent
          pb-3
          text-lg
          text-white
          outline-none
          placeholder:text-white/30
        "
      />



      <label
        className="
          mt-8
          block
          text-sm
          text-white/70
        "
      >
        Какой это вкус?
      </label>



      <input
        value={taste}
        onChange={(e) =>
          setTaste(e.target.value)
        }
        placeholder="Твоя версия"
        className="
          mt-3
          w-full
          border-b
          border-white/30
          bg-transparent
          pb-3
          text-lg
          text-white
          outline-none
          placeholder:text-white/30
        "
      />



      <button
        onClick={sendAnswer}
        disabled={sending || !playerId}
        className="
          mt-10
          w-full
          rounded-full
          bg-gradient-to-r
          from-orange-400
          to-red-500
          py-4
          text-lg
          font-semibold
          text-white
          disabled:opacity-50
        "
      >

        {sending
          ? "Отправляем..."
          : "Отправить"}

      </button>


    </div>

  );

}
