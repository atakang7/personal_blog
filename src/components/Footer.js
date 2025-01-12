const Footer = () => {
  const projects = [
    {
      title: "ProjectPulse",
      url: "https://sprojects.live/"
    },
    {
      title: "ideaLog",
      url: "https://atakangul.com"
    },
    {
      title: "ChatVerse",
      url: "https://chat.atakangul.com/"
    },
    {
      title: "KubernetesInfra",
      url: "https://kubernetes-infra.atakangul.com/"
    },
    {
      title: "Linux Diagnostic Agent",
      url: "https://github.com/AtakanG7/linux-diagnostic-agent"
    }
  ];

  return (
    <footer className="bg-white text-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-gray-900 text-lg font-semibold mb-4">About</h3>
            <p className="text-sm">
              Developer focused on creating innovative solutions and open-source projects.
            </p>
          </div>

          {/* Projects Section */}
          <div>
            <h3 className="text-gray-900 text-lg font-semibold mb-4">Projects</h3>
            <ul className="space-y-2">
              {projects.map((project, index) => (
                <li key={index}>
                  <a 
                    href={project.url}
                    className="text-sm hover:text-gray-600 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-gray-900 text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://github.com/atakang7"
                  className="text-sm hover:text-gray-600 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a 
                  href="https://www.linkedin.com/in/atakan-gul/"
                  className="text-sm hover:text-gray-600 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a 
                  href="https://www.atakangul.com"
                  className="text-sm hover:text-gray-600 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Website
                </a>
              </li>
            </ul>
          </div>

          {/* Copyright Section */}
          <div>
            <h3 className="text-gray-900 text-lg font-semibold mb-4">Legal</h3>
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Atakan Gül.<br />
              All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
