import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Venues from "./pages/Venues";
import Gallery from "./pages/Gallery";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home />}>
          {" "}
        </Route>
        <Route path="/services" element={<Services />}>
          {" "}
        </Route>
        <Route path="/venues" element={<Venues />}>
          {" "}
        </Route>
        <Route path="/gallery" element={<Gallery />}>
          {" "}
        </Route>
        <Route path="/aboutus" element={<AboutUs />}>
          {" "}
        </Route>
        <Route path="/contactus" element={<ContactUs />}>
          {" "}
        </Route>
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
