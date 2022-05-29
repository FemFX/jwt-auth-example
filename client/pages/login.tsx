import { NextPage } from "next";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { useLoginMutation } from "../generated/graphql";
import { useRouter } from "next/router";

const login: NextPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [login] = useLoginMutation();
  const router = useRouter();
  return (
    <div>
      <Navbar />
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const response = await login({
            variables: {
              email,
              password,
            },
          });
          if (response && response.data) {
            localStorage.setItem("token", response.data.login.accessToken);
          }
          router.push("/");
        }}
      >
        <div>
          <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default login;
