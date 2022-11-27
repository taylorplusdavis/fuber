import axios from "axios";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const Home: NextPage = () => {
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmpassword.value;
    const name = e.target.name.value;
    const intent = e.target.intent.value;

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!email || !password || !confirmPassword || !name || !intent) {
      setError("Please fill out all fields!");
      return;
    } else {
      axios
        .post("http://localhost:3002/api/addUser", {
          params: {
            email: email,
            password: password,
            confirmPassword: confirmPassword,
            name: name,
            intent: intent,
          },
        })
        .then((res) => {
          axios
            .get("http://localhost:3002/api/getUser", {
              params: {
                email: email,
              },
            })
            .then((res) => {
              localStorage.setItem("session", JSON.stringify(res.data[0]));
            });
          if (intent === "rider") {
            router.push("/fuberhome");
          } else if (intent === "driver") {
            router.push("/fuberhomedriver");
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
        <title>Fuber | Sign Up</title>
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
          <legend className="signup__legend">Sign Up!</legend>
          <form
            className=""
            method="post"
            name="RegForm"
            onSubmit={(e) => handleSubmit(e)}
          >
            <label>Name</label> <input name="name" type="text" />
            <label>Email </label> <input name="email" type="email" />
            <label>Password </label> <input name="password" type="password" />
            <label>Confirm Password </label>
            <input name="confirmpassword" type="password" />
            <p>I'm registering as a</p>
            <div className="radio__container">
              <input type="radio" id="rider" value="rider" name="intent" />
              <label className="radio__label" htmlFor="rider">
                Rider
              </label>
            </div>
            <div className="radio__container">
              <input type="radio" id="driver" value="driver" name="intent" />
              <label className="radio__label" htmlFor="driver">
                Driver
              </label>
            </div>
            <button className="signup__button" type="submit">
              Let's go!
            </button>
            <p className="py-4">
              Already have an account?{" "}
              <Link href="/signin" className="font-bold underline">
                Sign in here.
              </Link>
            </p>
          </form>
        </fieldset>
      </main>
    </div>
  );
};

export default Home;
