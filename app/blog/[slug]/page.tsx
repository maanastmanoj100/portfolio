import { BlogPostPage } from "@/modules/blog/blog-post-page";

export default function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  return <BlogPostPage slugPromise={params} />;
}
