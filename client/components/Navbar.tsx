import Link from "next/link";
import { useEffect, useState } from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

const Navbar = () => {
  const { data, loading } = useMeQuery();
  const [logout, { client }] = useLogoutMutation();
  const [isLogout, setIsLogout] = useState<boolean>(false);
  if (loading) {
    return <div>loading...</div>;
  }
  useEffect(() => {
    if (data && data.me) {
      setIsLogout(true);
    }
  }, [data, data.me]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
      }}
    >
      <Link href={`/`}>
        <a>home</a>
      </Link>
      <Link href={`/login`}>
        <a>login</a>
      </Link>
      <Link href={`/register`}>
        <a>register</a>
      </Link>
      <Link href={`/bye`}>
        <a>bye</a>
      </Link>
      {isLogout && (
        <button
          onClick={async () => {
            await logout();
            localStorage.removeItem("token");
            await client.resetStore();
          }}
        >
          logout
        </button>
      )}
    </div>
  );
};

export default Navbar;
