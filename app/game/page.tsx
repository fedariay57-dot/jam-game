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



export default function GamePage() {

  const [game, setGame] = useState<GameSettings | null>(null);
  const [playerAnswer, setPlayerAnswer] = useState<PlayerAnswer | null>(null);

  const [loading, setLoading] = useState(true);




  const loadGame = async () => {


    const { data, error } = await supabase
      .from("game_settings")
      .select("*")
      .limit(1)
      .single();



    if (error) {
      console.log(error);
    }



    if (data) {
      setGame(data);
    }




    const playerId =
      localStorage.getItem("jam_player_id");



    if (playerId) {

      const { data: answerData } = await supabase
        .from("answers")
        .select("*")
        .eq(
          "player_id",
          playerId
        )
        .single();



      if (answerData) {
        setPlayerAnswer(answerData);
      }

    }



    setLoading(false);

  };





  useEffect(() => {
    loadGame();
  }, []);







  if (loading) {

    return (
      <main
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-black
          text-white
        "
      >
        Загружаем игру...
      </main>
    );

  }







  return (

    <main
      className="
        min-h-screen
        flex
        flex-col
        items-center
        px-5
        py-12
        text-white
        bg-gradient-to-b
        from-[#24120b]
        via-[#35170c]
        to-black
      "
    >

      <div
        className="
          w-full
          max-w-md
          text-center
        "
      >



        <p
          className="
            text-xs
            uppercase
            tracking-[0.35em]
            text-white/50
          "
        >
          Джем 1GT
        </p>




        <h1
          className="
            mt-5
            text-4xl
            font-bold
          "
        >
          Угадай
          <br />
          вкус месяца
        </h1>







        {game?.status === "active" && (

          <>

            <p
              className="
                mt-5
                text-white/70
              "
            >
              Попробуй угадать секретный вкус джема.
            </p>


            {playerAnswer ? (

              <div
                className="
                  mt-10
                  rounded-3xl
                  bg-white/10
                  p-8
                  backdrop-blur-xl
                "
              >

                <div className="text-4xl">
                  ✅
                </div>


                <h2
                  className="
                    mt-4
                    text-2xl
                    font-bold
                  "
                >
                  Ответ принят
                </h2>


                <p
                  className="
                    mt-3
                    text-white/70
                  "
                >
                  Твой вариант:
                </p>


                <p
                  className="
                    mt-2
                    font-semibold
                  "
                >
                  {playerAnswer.taste}
                </p>


                <p
                  className="
                    mt-5
                    text-sm
                    text-white/50
                  "
                >
                  Жди результатов 👀
                </p>


              </div>

            ) : (

              <AnswerForm />

            )}

          </>

        )}







        {game?.status === "closed" && (

          <div
            className="
              mt-10
              rounded-3xl
              bg-white/10
              p-8
              backdrop-blur-xl
            "
          >

            <h2
              className="
                text-2xl
                font-bold
              "
            >
              Приём ответов завершён
            </h2>


            <p
              className="
                mt-3
                text-white/60
              "
            >
              Скоро объявим результаты.
            </p>


          </div>

        )}








        {game?.status === "finished" && (

          <div
            className="
              mt-10
              rounded-3xl
              bg-white/10
              p-8
              backdrop-blur-xl
            "
          >

            <h2
              className="
                text-2xl
                font-bold
              "
            >
              Загадка раскрыта 🎉
            </h2>




            <p
              className="
                mt-4
                text-white/80
              "
            >
              Настоящий вкус:
            </p>




            <p
              className="
                mt-2
                text-3xl
                font-bold
              "
            >
              {game.correct_taste}
            </p>





            {playerAnswer && (

              <div
                className="
                  mt-8
                  border-t
                  border-white/20
                  pt-6
                "
              >


                {playerAnswer.result === "winner" && (

                  <>
                    <div className="text-4xl">
                      🏆
                    </div>

                    <h3
                      className="
                        mt-3
                        text-2xl
                        font-bold
                      "
                    >
                      Ты угадал!
                    </h3>
                  </>

                )}




                {playerAnswer.result === "close" && (

                  <>
                    <div className="text-4xl">
                      🔥
                    </div>

                    <h3
                      className="
                        mt-3
                        text-2xl
                        font-bold
                      "
                    >
                      Ты был очень близко!
                    </h3>
                  </>

                )}






                {playerAnswer.result === "wrong" && (

                  <>
                    <div className="text-4xl">
                      😔
                    </div>

                    <h3
                      className="
                        mt-3
                        text-2xl
                        font-bold
                      "
                    >
                      В этот раз не получилось
                    </h3>
                  </>

                )}






                {playerAnswer.result === "pending" && (

                  <>

                    <div className="text-4xl">
                      ⏳
                    </div>


                    <h3
                      className="
                        mt-3
                        text-2xl
                        font-bold
                      "
                    >
                      Результат проверяется
                    </h3>

                  </>

                )}


              </div>

            )}


          </div>

        )}





      </div>


    </main>

  );

}