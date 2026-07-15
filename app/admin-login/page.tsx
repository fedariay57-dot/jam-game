"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


const PASSWORD = "jam2026";


export default function AdminLogin() {

  const [password, setPassword] = useState("");

  const router = useRouter();



  const login = () => {

    if (password === PASSWORD) {

      localStorage.setItem(
        "jam_admin",
        "true"
      );


      router.push("/admin");

    } else {

      alert("Неверный пароль");

    }

  };




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
          placeholder="Введите пароль"
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