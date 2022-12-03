import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const index = () => {
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email || !password) {
      setError("Please fill out all fields!");
      return;
    } else {
      axios
        .post("https://fuber.herokuapp.com/api/signInUser", {
          params: {
            email: email,
            password: password,
          },
        })
        .then((res) => {
          if (res.data.length > 0) {
            localStorage.setItem("session", JSON.stringify(res.data[0]));

            if (res.data[0].intent === "rider") {
              router.push("/fuberhome");
            } else {
              router.push("/fuberhomedriver");
            }
          } else {
            setError("Unable to find your account. Please try again.");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center py-2 bg-[var(--darkest-gray)] text-white">
      <Head>
        <title>Fuber | Sign In</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col w-full">
        {/* logo */}
        <div className="logo__container">
          <h1 className="logo__logo">Fuber</h1>
        </div>
        {/* login */}
        <fieldset className="form__container">
          {error && <h1 className="form__error">{error}</h1>}
          <legend className="signup__legend">Sign In!</legend>
          <form
            className=""
            method="post"
            name="RegForm"
            onSubmit={(e) => handleSubmit(e)}
          >
            <label>Email </label> <input name="email" type="email" />
            <label>Password </label> <input name="password" type="password" />
            <button className="signup__button" type="submit">
              Sign In
            </button>
            <p className="py-4">
              Don't have an account?{" "}
              <Link href="/" className="font-bold underline">
                Sign up here.
              </Link>
            </p>
          </form>
        </fieldset>
      </main>
    </div>
  );
};

export default index;
