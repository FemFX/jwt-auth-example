import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useHelloQuery, useMeQuery, useUsersQuery } from "../generated/graphql";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  // const { data } = useUsersQuery();
  const { data, loading: meLoading } = useMeQuery({
    fetchPolicy: "network-only",
  });
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    fetch("http://localhost:4000/refresh_token", {
      method: "POST",
      credentials: "include",
    }).then(async (x) => {
      const { accessToken } = await x.json();
      // console.log(accessToken);
      localStorage.setItem("token", accessToken);
      setLoading(false);
    });
  }, []);
  if (meLoading) {
    return <div>Loading...</div>;
  }
  if (data && data.me) {
    return (
      <div className={styles.container}>
        <Navbar />
        <span>Hello {data.me.email}</span>
      </div>
    );
  }
  return (
    <div>
      <Navbar />
      not logged in
    </div>
  );
};

export default Home;
