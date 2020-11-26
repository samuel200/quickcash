import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import $ from "jquery";
import "./App.css";

import Home from "./components/HomePage/Home";
import Contact from "./components/ContactPage/Contact";
import Login from "./components/LoginSignup/Login";
import Signup from "./components/LoginSignup/Signup";
import NewsRoom from "./components/NewsColumn/NewsRoom";
import Dashboard from "./components/DashboardPage/Dashboard";
import Wallet from "./components/WalletPage/Wallet";
import Referral from "./components/ReferralPage/Referral";
import ManageProfile from "./components/ManageProfilePage/ManageProfile";
import Activities from "./components/ActivitiesPage/Activities";
import GameRoom from "./components/GameRoomPage/GameRoom";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import Privacy from "./components/HowItWorks/Privacy";
import FAQ from "./components/HowItWorks/FAQ";
import { ToTopProvider } from "./Store/ToTopStore";
import ToTop from "./components/ToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import Forgot from "./components/ResetPage/Forgot";
import Reset from "./components/ResetPage/Reset";
import domainName from "./DomainName";

import SudokuGame from "./components/GameRoomPage/SudokuGame/js/index";
import TriviaGame from "./components/GameRoomPage/TriviaGame/TriviaGame";
import ImagePuzzleGame from "./components/GameRoomPage/ImagePuzzleGame/ImagePuzzleGame";
import Auth from "./Auth";

const NewsSectionComponents = (news) => {
  return (
    <>
      <Route
        exact
        path="/"
        render={(props) => <Home {...props} news={news} />}
      />
      {/* <Route path="/news/:slug" render={props=><NewsPage {...props} news={ news } changeNews={ changeNews }/>} /> */}
      <Route
        path="/news-room"
        render={(props) => <NewsRoom {...props} news={news} />}
      />
    </>
  );
};

const DashboardComponent = (props) => {
  let page = <></>;
  const {match} = props;
  const changeCurrentPage = (pageName) => {
    localStorage.setItem("currentPage", pageName);
  };

  switch (match.params.page) {
    case "index":
      changeCurrentPage(match.params.page);
      page = (
        <Dashboard {...props} />
      );
      break;

    case "wallet":
      changeCurrentPage(match.params.page);
      page = (
        <Wallet
          {...props} />
      );
      break;

    case "referrals":
      changeCurrentPage(match.params.page);
      page = <Referral {...props} />;
      break;

    case "manage":
      changeCurrentPage(match.params.page);
      page = (
        <ManageProfile {...props} />
      );
      break;

    case "activities":
      changeCurrentPage(match.params.page);
      page = (
        <Activities {...props} />
      );
      break;

    case "game-room":
      changeCurrentPage(match.params.page);
      page = <GameRoom {...props} />;
      break;

    case "game":
      page = (
        <Route
          path="/dashboard/game/:page"
          render={(props) => (
            <GamesComponent {...props} />
          )}
        />
      );
      break;

    default:
      page = (
        <Dashboard {...props} />
      );
  }

  return page
};

const GamesComponent = (props) => {
  let page = <Redirect to="/dashboard/game-room" />;

  switch (props.match.params.page) {
    case "trivia":
      return <TriviaGame {...props} />;

    case "sudoku":
      return <SudokuGame {...props} />;

    case "image-puzzle":
      return <ImagePuzzleGame {...props} />;

    default:
      return page;
  }
};

const ToTopSectionComponents = ({ showMessage, news }) => (
  <ToTopProvider>
    <Route component={ToTop} />
    <NewsSectionComponents news={news} />
    <Route
      path="/contact"
      render={(props) => (
        <Contact
          {...props}
          token={Auth.authenicationToken}
          showMessage={showMessage}
        />
      )}
    />
    <Route
      path="/signin"
      render={(props) => <Login {...props} showMessage={showMessage} />}
    />
    <Route
      exact
      path="/signup"
      render={(props) => <Signup {...props} showMessage={showMessage} />}
    />
    <Route
      path="/signup/:username/"
      render={(props) => <Signup {...props} showMessage={showMessage} />}
    />
    <ProtectedRoute
      path="/dashboard/:page"
      component={DashboardComponent}
      showMessage={showMessage}
    />
    <Route
      path="/dashboard"
      exact
      render={(props) => <Redirect to="/dashboard/index" />}
    />
    <Route path="/how-it-works" component={HowItWorks} />
    <Route path="/faq" component={FAQ} />
    <Route path="/privacy-policy" component={Privacy} />
    <Route
      path="/forgot"
      render={(props) => <Forgot {...props} showMessage={showMessage} />}
    />
    <Route
      path="/reset/:id"
      render={(props) => <Reset {...props} showMessage={showMessage} />}
    />
  </ToTopProvider>
);

function App() {
  const [news, setNews] = useState([]);

  const showMessage = (type, message) => {
    if (type === "error") {
      window.M.toast({ html: message, classes: "red white-text" });
    } else {
      window.M.toast({ html: message, classes: "green white-text" });
    }
  };

  const changeNews = (data) => {
    localStorage.setItem("news", JSON.stringify(data));
    setNews(data);
  };

  useEffect(() => {
    const currentNews = JSON.parse(localStorage.getItem("news"));

    if (currentNews && currentNews !== "null" && currentNews !== "undefined") {
      console.log(`currentNews ${currentNews}`);
      setNews(currentNews);
    } else {
      fetch(`${domainName}/api/news`, {
        "Content-Type": "application/json",
        method: "get",
      })
        .then((res) => res.json())
        .then((data) => {
          changeNews(data);
        })
        .catch((err) => console.log(err));
    }

    $(window).on("beforeunload", function () {
      /**
       * Remember to change to the upload url domain name
       */
      if (!document.activeElement.href.includes("localhost:3000")) {
        localStorage.removeItem("news");
        return "Are you sure you want to leave?";
      }
    });
  }, []);

  return (
    <Router className="App">
      <Switch>
        <ToTopSectionComponents showMessage={showMessage} news={news} />
      </Switch>
    </Router>
  );
}

export default App;
