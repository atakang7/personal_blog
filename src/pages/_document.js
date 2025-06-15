import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  // Create the schema object separately for better readability
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Atakan Gül",
    "jobTitle": "Software Engineer",
    "description": "Software engineer and technical blogger from Istanbul/Turkey, specializing in DevOps, Kubernetes, and software development practices.",
    "url": "https://atakangul.com",
    "image": "https://media.licdn.com/dms/image/v2/D4D03AQE8Ea7pNUhJWg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1725493477020?e=1741824000&v=beta&t=tlBI34erc3JCQ6dBtYDgTJgF-EQkVHNVtpJT5ybgSUU",
    "sameAs": [
      "https://www.linkedin.com/in/atakan-gul",
      "https://atakangul.com/gallery",
      "https://www.instagram.com/atakan_yta/",
      "https://github.com/atakang7"
    ],
    "knowsLanguage": ["Java", "JavaScript", "Python", "Go"],
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "Istanbul Bilgi University",
      "department": "Computer Engineering"
    },
    "award": [
      "Full scholarship recipient - Top 0.3% among 2M+ candidates",
      "Microsoft Cloud Technologies Certification",
      "IBM System Administration Certificate",
      "Google Technical Foundations Program"
    ],
    "worksFor": {
      "@type": "Organization",
      "name": "Orion Innovation"
    }
  };

  return (
    <Html lang="en">
      <Head>
        {/* Primary Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="description" content="Atakan Gül - Software engineer from Istanbul specializing in DevOps and Kubernetes. Top 0.3% in national university entrance exam. Expert in container orchestration and software development." />
        <meta name="keywords" content="Atakan Gül, Software Engineer, DevOps, Kubernetes, Istanbul, Container Orchestration, Technical Blog" />
        <meta name="author" content="Atakan Gül" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="profile" />
        <meta property="og:title" content="Atakan Gül - Software Engineer & DevOps Specialist" />
        <meta property="og:description" content="Software engineer and technical blogger from Istanbul/Turkey, specializing in DevOps, Kubernetes, and software development practices." />
        <meta property="og:image" content="https://media.licdn.com/dms/image/v2/D4D03AQE8Ea7pNUhJWg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1725493477020?e=1741824000&v=beta&t=tlBI34erc3JCQ6dBtYDgTJgF-EQkVHNVtpJT5ybgSUU" />
        <meta property="og:url" content="https://atakangul.com" />
        <meta property="og:site_name" content="Atakan Gül's Technical Blog" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Atakan Gül - Software Engineer" />
        <meta name="twitter:description" content="DevOps specialist and software engineer sharing insights on Kubernetes and container orchestration." />
        <meta name="twitter:image" content="https://media.licdn.com/dms/image/v2/D4D03AQE8Ea7pNUhJWg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1725493477020?e=1741824000&v=beta&t=tlBI34erc3JCQ6dBtYDgTJgF-EQkVHNVtpJT5ybgSUU" />
        
        {/* Schema.org for Google */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />

        {/* Favicon */}
        <link rel="icon" href="/img/favicon.ico" />
        
        {/* Analytics */}
        <script defer src="https://cloud.umami.is/script.js" data-website-id="97859527-919b-443b-a9cc-8cbb01c0035d"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}