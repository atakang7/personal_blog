import {
    FolderIcon,
    ImageIcon,
    LinkIcon,
    Terminal,
    FileText,
    Cloud,
    Github
} from "lucide-react";


export const navigationLinks = [
    {
      icon: FolderIcon,
      title: "Projects",
      href: "/projects",
      isExternal: false
    },
    {
      icon: ImageIcon,
      title: "Gallery",
      href: "/gallery",
      isExternal: false
    },
    {
      icon: Github,
      title: "GitHub",
      href: "https://github.com/AtakanG7",
      isExternal: true
    },
    {
      icon: LinkIcon,
      title: "Links",
      href: "/links",
      isExternal: false
    }
];

export const projects = [
{
    title: "Linux Diagnostic Agent",
    tech: "Go, React, WebSocket",
    link: "https://github.com/AtakanG7/linux-diagnostic-agent",
    icon: Terminal
},
{
    title: "SmartPDF",
    tech: "LangChain, OpenAI, Python",
    link: "https://smartpdf.onrender.com/",
    icon: FileText
},
{
    title: "Cloud-Agnostic Infrastructure",
    tech: "Terraform, Kubernetes",
    link: "https://github.com/AtakanG7/KubernetesInfra",
    icon: Cloud
}
];

export const certifications = [
{
    title: "Microsoft Cloud Technologies Certification",
    link: "https://learn.microsoft.com/en-us/users/AtakanG7/credentials/A46DF79C8D4EB3D5",
},
{
    title: "IBM System Administration Certificate",
    link: "https://www.coursera.org/account/accomplishments/certificate/ZPK2NQRF2A3E",
},
{
    title: "Google Technical Foundations Program",
    link: "https://www.coursera.org/account/accomplishments/certificate/EVWGK9ZEG843",
},
{
    title: "Google Network Engineering Fundamentals",
    link: "https://www.coursera.org/account/accomplishments/certificate/7Y5XDPNS9FPQ",
}
];