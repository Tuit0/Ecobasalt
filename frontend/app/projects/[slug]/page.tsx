import ProjectDetail from "@/components/ProjectDetail";

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div className="pt-20">
      <ProjectDetail slug={params.slug} />
    </div>
  );
}
