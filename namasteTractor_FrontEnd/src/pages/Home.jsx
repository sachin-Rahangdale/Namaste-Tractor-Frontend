import { useEffect } from "react";
import { getTractors } from "../api/tractorApi";

const Home = () => {
  useEffect(() => {
    getTractors()
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  }, []);

  return <div>Home</div>;
};

export default Home;