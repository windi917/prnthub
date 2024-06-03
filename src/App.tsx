import { BrowserRouter as Browser, Routes, Route } from "react-router-dom";
import Content from "./components/Content";
import Contact from "./pages/Contact.tsx";
import TokenSubmit from "./pages/tokenSubmit";
import Homepage from "./pages/homepage";
import Dashboard from "./pages/dashboard";
import WalletsContextProvider from "./contexts/ClientWalletProvider.tsx";
import VoteList from "./pages/VoteList.tsx";
import NFTSubmit from "./pages/NFTSubmit.tsx";
import PrivacyPolicy from "./pages/privacyPolicy";

function App() {
  return (
    <div className="App">
      <WalletsContextProvider>
        <Browser>
          <Routes>
            <Route element={<Content />}>
              <Route path="/" element={<Homepage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/submitToken" element={<TokenSubmit />} />
              <Route path="/NFTSubmit" element={<NFTSubmit />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
              <Route path="/voteList" element={<VoteList />} />
            </Route>
          </Routes>
        </Browser>
      </WalletsContextProvider>
    </div>
  );
}

export default App;
