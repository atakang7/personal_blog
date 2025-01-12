import React from 'react'
import { FaLinkedin, FaGithub, FaEnvelope, FaRss, FaCode, FaUser, } from 'react-icons/fa'
import { LiaProjectDiagramSolid } from "react-icons/lia";
import Link from 'next/link'
export default function Links() {
  const links = [
    {
      icon: <FaUser className="w-6 h-6" />,
      title: "Personal welcome :)",
      description: "Who is Atakan Gül? Let's meet.",
      url: "https://atakangul.com/blogs/atakan-gul-profile"
    },
    {
      icon: <LiaProjectDiagramSolid className="w-6 h-6" />,
      title: "Personal projects",
      description: "You can find my personal projects here.",
      url: "https://atakangul.com/projects"
    },
    {
      icon: <FaGithub className="w-6 h-6" />,
      title: "GitHub",
      description: "Open source projects and contributions",
      url: "https://github.com/AtakanG7"
    },
    {
      icon: <FaLinkedin className="w-6 h-6" />,
      title: "LinkedIn",
      description: "Professional profile and connections",
      url: "https://linkedin.com/in/atakan-gul"
    },
    {
      icon: <FaRss className="w-6 h-6" />,
      title: "Technical Blog",
      description: "Writing about cloud infrastructure and DevOps",
      url: "https://blog.atakangul.com"
    },
    {
      icon: <FaCode className="w-6 h-6" />,
      title: "SmartPDF",
      description: "AI-powered document analysis project",
      url: "https://smartpdf.onrender.com"
    },
    {
      icon: <FaCode className="w-6 h-6" />,
      title: "Linux Diagnostic Agent",
      description: "Real-time system monitoring tool",
      url: "https://github.com/AtakanG7/linux-diagnostic-agent"
    },
    {
      icon: <FaEnvelope className="w-6 h-6" />,
      title: "Email",
      description: "Get in touch",
      url: "mailto:atakan.gul000@gmail.com"
    }
  ]

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-semibold text-gray-900 mb-4">Atakan Gül</h1>
          <p className="text-lg text-gray-600">Software & DevOps Engineer</p>
        </div>
        
        <div className="space-y-4">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <div className="text-gray-700 mr-4">
                  {link.icon}
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900">{link.title}</h2>
                  <p className="text-gray-600">{link.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link 
            href="/" 
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}