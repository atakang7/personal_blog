// src/pages/_app.js
import Header from "../components/Header";
import Footer from "@/components/Footer";
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <Header/>
      <Component {...pageProps} />
      <Footer/>
    </>
  );
}
