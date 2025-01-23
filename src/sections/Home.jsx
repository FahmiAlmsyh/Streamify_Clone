import Card from "../components/Card";
import Carou from "../components/Carou";
import Celebrities from "../components/Celebrities";
import List from "../components/List";
import Motto from "../components/Motto";
import Nav from "../components/Nav";
const Home = () => {
  return (
    <>
      <Motto />
      <Carou />
      <Nav />
      <List title={"Trending Now"} />
      <Card
        title={"Popular"}
        type={"TV Show"}
        link={true}
        url={"/Popular/TV/1"}
      />
      <List
        title={"Top Rated"}
        type={"Movie"}
        link={true}
        url={"/Top_Rated/1"}
      />
      <Card
        title={"On The Air"}
        type={"TV Show"}
        link={true}
        url={"/On_The_Air/1"}
      />
      <Card title={"Action"} type={"Movie"} link={true} url={"/Action/1"} />
      <List title={"Drama"} type={"TV Show"} link={true} url={"/Drama/1"} />
      <Card
        title={"Popular"}
        type={"Movie"}
        link={true}
        url={"/Popular/Movie/1"}
      />
      <Card title={"Horror"} type={"Movie"} link={true} url={"Horror/1"} />
      <List title={"Comedy"} type={"TV Show"} link={true} url={"Comedy/1"} />
      <Celebrities title={"Most popular celebrities"} link={true} url={"Celebrities/1"}/>
    </>
  );
};

export default Home;
