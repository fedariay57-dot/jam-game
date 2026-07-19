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






  const login = () => {

    if (password === ADMIN_PASSWORD) {

      localStorage.setItem(
        "jam_admin",
        "true"
      );

      setIsAdmin(true);

    } else {

      alert("Неверный пароль");

    }

  };







  const logout = () => {

    localStorage.removeItem(
      "jam_admin"
    );

    setIsAdmin(false);

  };








  const loadData = async () => {


    const { data: answersData, error: answersError } =
      await supabase
        .from("answers")
        .select("*")
        .order("created_at", {
          ascending: false,
        });



    if (answersError) {
      console.log(answersError);
    }




    const { data: gameData, error: gameError } =
      await supabase
        .from("game_settings")
        .select("*")
        .limit(1)
        .single();



    if (gameError) {
      console.log(gameError);
    }



    if (answersData) {

      setAnswers(
        answersData
      );

    }




    if (gameData) {

      setGame(
        gameData
      );


      setCorrectTaste(
        gameData.correct_taste || ""
      );

    }



    setLoading(false);

  };









  const updateResult = async (
    id: number,
    result: string
  ) => {


    const { error } =
      await supabase
        .from("answers")
        .update({
          result,
        })
        .eq(
          "id",
          id
        );



    if (error) {

      console.log(error);
      return;

    }



    loadData();

  };









  const updateGame = async (
    status: string,
    taste?: string
  ) => {


    if (!game) return;



    const { error } =
      await supabase
        .from("game_settings")
        .update({

          status,

          correct_taste:
            taste ?? game.correct_taste,

        })
        .eq(
          "id",
          game.id
        );



    if (error) {

      console.log(error);
      return;

    }



    loadData();

  };








  const resetGame = async () => {

    alert("Я начал выполнять сброс");

    const confirmReset =
      window.confirm(
        "Начать новый раунд?"
      );



    if (!confirmReset) {
      return;
    }




    if (!game) return;

const { error: deleteError } = await supabase
  .from("answers")
  .delete()
  .neq("id", 0);

if (deleteError) {
  console.log(deleteError);
  alert("Не удалось удалить ответы");
  return;
}

    const { error } =
      await supabase
        .from("game_settings")
        .update({

          status: "active",

          correct_taste: null,

        })
        .eq(
          "id",
          game.id
        );



    if (error) {

      console.log(error);
      return;

    }



    loadData();

  };








  useEffect(() => {


    const admin =
      localStorage.getItem(
        "jam_admin"
      );


    if (admin === "true") {

      setIsAdmin(true);

    }


  }, []);








  useEffect(() => {

    if (isAdmin) {

      loadData();

    }

}, [isAdmin]);





if (!isAdmin) {

  return (

    <main
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-neutral-950
        p-5
        text-white
      "
    >

      <div
        className="
          w-full
          max-w-sm
          rounded-3xl
          bg-white/10
          p-8
        "
      >

        <h1
          className="
            text-2xl
            font-bold
            text-center
          "
        >
          Админка
        </h1>



        <input
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          placeholder="Пароль"
          className="
            mt-6
            w-full
            rounded-xl
            bg-white/10
            px-4
            py-3
            outline-none
          "
        />



        <button
          onClick={login}
          className="
            mt-5
            w-full
            rounded-full
            bg-orange-500
            py-3
            font-semibold
          "
        >
          Войти
        </button>


      </div>


    </main>

  );

}







if (loading) {

  return (

    <main
      className="
        min-h-screen
        bg-black
        p-10
        text-white
      "
    >
      Загружаем...
    </main>

  );

}








return (

  <main
    className="
      min-h-screen
      bg-neutral-950
      px-5
      py-10
      text-white
    "
  >

    <div
      className="
        mx-auto
        max-w-4xl
      "
    >


      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <h1
          className="
            text-3xl
            font-bold
          "
        >
          Панель управления
        </h1>


        <button
          onClick={logout}
          className="
            rounded-full
            bg-white/10
            px-4
            py-2
          "
        >
          Выйти
        </button>


      </div>








      <section
        className="
          mt-8
          rounded-3xl
          bg-white/10
          p-6
        "
      >

        <h2
          className="
            text-xl
            font-bold
          "
        >
          Управление игрой
        </h2>



        <p
          className="
            mt-2
            text-white/60
          "
        >
          Статус:
          {" "}
          {game?.status}
        </p>





        <input
          value={correctTaste}
          onChange={(e) =>
            setCorrectTaste(
              e.target.value
            )
          }
          placeholder="Правильный вкус"
          className="
            mt-5
            w-full
            rounded-xl
            bg-white/10
            px-4
            py-3
          "
        />





        <div
          className="
            mt-5
            flex
            flex-wrap
            gap-3
          "
        >


          <button
            onClick={() =>
              updateGame("active")
            }
            className="
              rounded-full
              bg-green-500
              px-5
              py-3
            "
          >
            🟢 Открыть игру
          </button>




          <button
            onClick={() =>
              updateGame("closed")
            }
            className="
              rounded-full
              bg-red-500
              px-5
              py-3
            "
          >
            🔴 Закрыть ответы
          </button>





          <button
            onClick={() =>
              updateGame(
                "finished",
                correctTaste
              )
            }
            className="
              rounded-full
              bg-orange-500
              px-5
              py-3
            "
          >
            🏆 Показать вкус
          </button>





          <button
            onClick={resetGame}
            className="
              rounded-full
              bg-purple-500
              px-5
              py-3
            "
          >
            🔄 Новый раунд
          </button>


        </div>


      </section>









      <section
        className="
          mt-10
        "
      >

        <h2
          className="
            text-2xl
            font-bold
          "
        >
          Ответы игроков
        </h2>



        <p
          className="
            mt-2
            text-white/60
          "
        >
          Всего:
          {" "}
          {answers.length}
        </p>





        <div
          className="
            mt-6
            space-y-5
          "
        >



          {answers.map((answer) => (

            <div
              key={answer.id}
              className="
                rounded-3xl
                bg-white/10
                p-6
              "
            >



              <p
                className="
                  text-xl
                  font-semibold
                "
              >
                {answer.name}
              </p>



              <p
                className="
                  mt-2
                  text-white/80
                "
              >
                {answer.taste}
              </p>



              <p
                className="
                  mt-2
                  text-sm
                  text-white/50
                "
              >
                {answer.result}
              </p>





              <div
                className="
                  mt-5
                  flex
                  flex-wrap
                  gap-3
                "
              >



                <button
                  onClick={() =>
                    updateResult(
                      answer.id,
                      "winner"
                    )
                  }
                  className="
                    rounded-full
                    bg-green-500
                    px-4
                    py-2
                  "
                >
                  🏆 Победитель
                </button>




                <button
                  onClick={() =>
                    updateResult(
                      answer.id,
                      "close"
                    )
                  }
                  className="
                    rounded-full
                    bg-yellow-500
                    px-4
                    py-2
                  "
                >
                  🔥 Был близко
                </button>




                <button
                  onClick={() =>
                    updateResult(
                      answer.id,
                      "wrong"
                    )
                  }
                  className="
                    rounded-full
                    bg-red-500
                    px-4
                    py-2
                  "
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