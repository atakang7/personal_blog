import { NavigationItem, CertificationItem, ProjectItem } from "../components/main/MainPageComponents";
import { projects, certifications, navigationLinks } from "../../data/metaData";
import BlogCard from "../components/BlogCard";
import Head from "next/head";

export default function Home({ blogs }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto">
        <Head>
          <title>Atakan Gül | Software Engineering Blog</title>
        </Head>

        {/* Navigation Section */}
        <nav className="flex justify-start mt-3 px-2 sm:px-0">
          <div className="flex gap-1.5 sm:gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            {navigationLinks.map((link) => (
              <NavigationItem key={link.title} {...link} />
            ))}
          </div>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8 px-3">
          {/* Blog Cards Section */}
          <section className="flex-1">
            {blogs.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </section>

          {/* Sidebar */}
          <aside className="w-full lg:w-72 mt-4">
            <div className="space-y-6">
              {/* Musics */}
              <div className="border border-gray-200 ">
                <div className="px-4 py-2 border-b border-gray-200">
                  <h2 className="text-xs font-medium text-gray-900">
                    Listening...
                  </h2>
                </div>
                <div>
                  <script src="https://static.elfsight.com/platform/platform.js" async></script>
                  <div className="elfsight-app-fea6032e-02b4-44dc-aa84-eb5b1b418c35" data-elfsight-app-lazy></div>
                </div>
              </div>

              {/* Certifications */}
              <div className="border border-gray-200 ">
                <div className="px-4 py-2 border-b border-gray-200">
                  <h2 className="text-xs font-medium text-gray-900">
                    Certifications
                  </h2>
                </div>
                <div>
                  {certifications.map((cert) => (
                    <CertificationItem key={cert.title} cert={cert} />
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div className="border border-gray-200 ">
                <div className="px-4 py-2 border-b border-gray-200">
                  <h2 className="text-xs font-medium text-gray-900">
                    Featured Projects
                  </h2>
                </div>
                <div>
                  {projects.map((project) => (
                    <ProjectItem key={project.title} project={project} />
                  ))}
                </div>
              </div>

            </div>  
          </aside>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  try {
    const blogData = await fetch(`https://atakangul.com/api/blogs`);
    const data = await blogData.json();
    const blogs = data?.blogs;

    return {
      props: {
        blogs: JSON.parse(JSON.stringify(blogs)),
      },
      revalidate: 300,
    };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return {
      props: { blogs: [] },
      revalidate: 300,
    };
  }
}