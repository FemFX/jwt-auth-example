import { NextPage } from "next";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { useRegisterMutation } from "../generated/graphql";
import { useRouter } from "next/router";

const register: NextPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [register] = useRegisterMutation();
  const router = useRouter();
  return (
    <div>
      <Navbar />
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const response = await register({
            variables: {
              email,
              password,
            },
          });
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

export default register;
