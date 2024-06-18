import { BrowserRouter as Browser, Routes, Route } from "react-router-dom";
import Content from "./components/Content";
import Contact from "./pages/Contact.tsx";
import Homepage from "./pages/homepage";
import Dashboard from "./pages/dashboard";
import WalletsContextProvider from "./contexts/ClientWalletProvider.tsx";
import VoteList from "./pages/VoteList.tsx";
import NFTSubmit from "./pages/NFTSubmit.tsx";
import PrivacyPolicy from "./pages/privacyPolicy";
import MyVote from "./pages/myvote.tsx";
import TokenSetup from "./pages/TokenSetup.tsx";
import LPsetup from "./pages/setupLP.tsx";
import PoolList from "./pages/PoolList.tsx";
import MyPool from "./pages/MyPool.tsx";
import { JwtTokenProvider } from "./contexts/JWTTokenProvider.tsx";
import SetupMarket from "./pages/SetupMarket.tsx";

function App() {
  return (
    <div className="App " theme-controller="dark">
      <JwtTokenProvider>
        <WalletsContextProvider>
          <Browser>
            <Routes>
              <Route element={<Content />}>
                <Route path="/" element={<Homepage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/myvote" element={<MyVote />} />
                <Route path="/tokenSetup" element={<TokenSetup />} />
                <Route path="/setupLP" element={<LPsetup />} />
                <Route path="/SetupMarket" element={<SetupMarket />} />
                <Route path="/poolList" element={<PoolList />} />
                <Route path="/myPool" element={<MyPool />} />
                <Route path="/NFTSubmit" element={<NFTSubmit />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
                <Route path="/voteList" element={<VoteList />} />
              </Route>
            </Routes>
          </Browser>
        </WalletsContextProvider>
      </JwtTokenProvider>
    </div>
  );
}

export default App;
