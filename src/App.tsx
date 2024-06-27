import { BrowserRouter as Browser, Routes, Route } from "react-router-dom";
import WalletsContextProvider from "./contexts/ClientWalletProvider.tsx";
import { JwtTokenProvider } from "./contexts/JWTTokenProvider.tsx";
import Content from "./components/Content";
import Contact from "./pages/Contact.tsx";
import Homepage from "./pages/homepage";
import Dashboard from "./pages/dashboard";
import VoteList from "./pages/VoteList.tsx";
import NFTSubmit from "./pages/NFTSubmit.tsx";
import PrivacyPolicy from "./pages/privacyPolicy";
import MyVote from "./pages/myvote.tsx";
import TokenSetup from "./pages/TokenSetup.tsx";
import LPsetup from "./pages/setupLP.tsx";
import SetupMarket from "./pages/SetupMarket.tsx";
import LaunchList from "./pages/LaunchList.tsx";
import ProjectDetails from "./components/ProjectDetails.tsx";
import TokenSubmit from "./pages/tokenSubmit.tsx";

function App() {
  return (
    <div className="App " theme-controller="dark">
      <JwtTokenProvider>
        <WalletsContextProvider>
          <Browser>
            <Routes>
              <Route element={<Content />}>
                {/* -- Page Routing -- */}
                <Route path="/" element={<Homepage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/myvote" element={<MyVote />} />
                <Route path="/tokenSetup" element={<TokenSetup />} />
                <Route path="/tokenSubmit" element={<TokenSubmit />} />
                <Route path="/setupLP" element={<LPsetup />} />
                <Route path="/SetupMarket" element={<SetupMarket />} />
                <Route path="/LaunchList" element={<LaunchList />} />

                <Route path="/NFTSubmit" element={<NFTSubmit />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
                <Route path="/voteList" element={<VoteList />} />

                {/* -- Project Routing via ID-- */}
                <Route path="/" element={<LaunchList />} />
                <Route
                  path="/project/:presaleKey"
                  element={<ProjectDetails />}
                />
              </Route>
            </Routes>
          </Browser>
        </WalletsContextProvider>
      </JwtTokenProvider>
    </div>
  );
}

export default App;
