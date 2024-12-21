// src/pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Meta tags */}
        <meta name="description" content="Join Atakan Gül on a journey through the tech world. Get the latest on tech trends, programming insights, and hands-on guides." />
        <meta name="keywords" content="Technology Blog, Tech Articles, Programming, Tech Trends, Atakan Gül" />
        <meta name="author" content="Atakan Gül" />
        
        {/* OpenGraph */}
        <meta property="og:title" content="Atakan Gül | Latest Tech Articles and Insights" />
        <meta property="og:description" content="Explore the latest technology articles on Atakan Gül's blog." />
        <meta property="og:url" content="https://www.atakangul.com/" />
        <meta property="og:site_name" content="Atakan Gül's Technology Blog" />
        <meta property="og:image" content="/img/avatar.webp" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />

        {/* External Resources */}
        <script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          async
          defer
        />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        />
        <link rel="icon" type="image/png" href="/img/favicon.ico" />
     
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}