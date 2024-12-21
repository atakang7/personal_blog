// src/pages/_app.js
import AuthProvider from "../components/AuthProvider";
import Header from "../components/headers/Header";
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Header />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
