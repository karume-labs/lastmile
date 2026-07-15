import { redirect } from "next/navigation";

const Home = () => {
  redirect("/admin/dashboard");
};

export default Home;
