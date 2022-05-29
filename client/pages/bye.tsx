import { NextPage } from "next";
import Navbar from "../components/Navbar";
import { useByeQuery } from "../generated/graphql";

const bye: NextPage = () => {
  const { data, error, loading } = useByeQuery({
    fetchPolicy: "network-only",
  });
  if (loading) {
    return (
      <div>
        <Navbar />
        Loading...
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <Navbar />
        {error.message}
      </div>
    );
  }
  return (
    <div>
      <Navbar />
      {data.bye}
    </div>
  );
};

export default bye;
