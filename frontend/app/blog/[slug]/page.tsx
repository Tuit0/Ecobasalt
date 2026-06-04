import BlogPostView from "@/components/BlogPostView";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <div className="pt-20">
      <BlogPostView slug={params.slug} />
    </div>
  );
}
