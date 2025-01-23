import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Home from "./sections/Home.jsx";
import Serial from "./sections/Serial.jsx";
import CardContent from "./sections/CardContent.jsx";
import ListContent from "./sections/ListContent.jsx";
import Search from "./sections/Search.jsx";
import Movies from "./sections/Movies.jsx";
import Favorites from "./sections/Favorites.jsx";
import CelebritiesPage from "./sections/CelebritiesPage.jsx";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/Serial",
        element: (
          <Serial
            title={"TV Shows"}
            dropdown={true}
            type={"TV Show"}
            size={"Full"}
          />
        ),
      },
      {
        path: "/Search",
        element: <Search size={"Full"} />,
      },
      {
        path: "/Movies",
        element: (
          <Movies
            title={"Movies"}
            type={"Movie"}
            size={"Full"}
            dropdown={true}
          />
        ),
      },
      {
        path: "/Favorites/:id",
        element: <Favorites title={"Favorites"} size={"Full"} url={"Favorites"}/>,
      },
      {
        path: "/Celebrities/:id",
        element: <CelebritiesPage title={"Celebrities"} url={"Celebrities"}/>,
      },
      {
        path: "/Top_Rated/:id",
        element: (
          <ListContent
            title={"Top Rated"}
            type={"Movie"}
            size={"Full"}
            url={"Top_Rated"}
          />
        ),
      },
      {
        path: "/Drama/:id",
        element: (
          <ListContent
            title={"Drama"}
            type={"TV Show"}
            size={"Full"}
            url={"Drama"}
          />
        ),
      },
      {
        path: "/Comedy/:id",
        element: (
          <ListContent
            title={"Comedy"}
            type={"TV Show"}
            size={"Full"}
            url={"Comedy"}
          />
        ),
      },
      {
        path: "/Popular/TV/:id",
        element: (
          <CardContent
            title={"Popular"}
            url={"Popular/TV"}
            type={"TV Show"}
            size={"Full"}
          />
        ),
      },
      {
        path: "/On_The_Air/:id",
        element: (
          <CardContent
            title={"On The Air"}
            url={"On_The_Air"}
            type={"TV Show"}
            size={"Full"}
          />
        ),
      },
      {
        path: "/Action/:id",
        element: (
          <CardContent
            title={"Action"}
            url={"Action"}
            type={"Movie"}
            size={"Full"}
          />
        ),
      },
      {
        path: "/Horror/:id",
        element: (
          <CardContent
            title={"Horror"}
            url={"Horror"}
            type={"Movie"}
            size={"Full"}
          />
        ),
      },
      {
        path: "/Popular/Movie/:id",
        element: (
          <CardContent
            title={"Popular"}
            url={"Popular/Movie"}
            type={"Movie"}
            size={"Full"}
          />
        ),
      },
    ],
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "*",
    element: (
      <div className="justify-center flex items-center h-screen">
        404 - Page Not Found.
      </div>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
