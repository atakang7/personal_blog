import Link from "next/link";
import {
  ExternalLink,
  AwardIcon,
} from "lucide-react";

export const NavigationItem = ({ icon: Icon, title, href, isExternal }) => {
  const Content = () => (
    <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 text-gray-900 border bg-white hover:bg-gray-100 whitespace-nowrap">
      <Icon className="w-4 h-4 sm:w-4 sm:h-4" />
      <span className="text-xs sm:text-sm hidden sm:inline">{title}</span>
      <span className="text-xs inline sm:hidden">{title}</span>
    </div>
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        <Content />
      </a>
    );
  }

  return (
    <Link href={href}>
      <Content />
    </Link>
  );
};

export const CertificationItem = ({ cert }) => (
  <a
    href={cert.link}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-50"
  >
    <AwardIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <span className="text-sm">
          {cert.title}
        </span>
        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
      </div>
    </div>
  </a>
);

export const ProjectItem = ({ project }) => (
  <a
    href={project.link}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-50"
  >
    <project.icon className="w-4 h-4 text-gray-500 flex-shrink-0" />
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <h3 className="text-sm leading-5">{project.title}</h3>
        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
      </div>
      <p className="text-xs text-gray-500 mt-0.5 leading-4">{project.tech}</p>
    </div>
  </a>
);