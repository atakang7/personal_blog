// pages/projects.js
import Head from "next/head";
import Link from "next/link";
import { projects } from "../../data/projectsData";

const ProjectResult = ({ project }) => (
  <div className="mb-8">
    <Link 
      href={project.projectUrl}
      className="group"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="mb-1 text-sm text-[#202124]">
        {project.tags.slice(0, 3).join(" · ")}
      </div>
      <h2 className="text-[#1a0dab] text-xl group-hover:underline mb-1">
        {project.title}
      </h2>
    </Link>
    <p className="text-[#4d5156] text-sm leading-6 mb-1">
      {project.description}
    </p>
    {project.tags.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-2">
        {project.tags.map(tag => (
          <span 
            key={tag}
            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    )}
  </div>
);

export default function ProjectsPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
      <Head>
        <title>Projects | Atakan Gül</title>
      </Head>

      {/* Search Info */}
      <div className="text-sm text-[#70757a] mb-6">
        About {projects.length} results
      </div>

      {/* Results List */}
      <div className="divide-y divide-gray-100">
        {projects.map((project) => (
          <div key={project._id} className="py-4">
            <ProjectResult project={project} />
          </div>
        ))}
      </div>
    </div>
  );
}