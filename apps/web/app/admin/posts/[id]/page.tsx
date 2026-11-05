import AdminPostEditor from "@features/blog/admin/components/AdminPostEditor";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminPostEditor key={id} postId={id} />;
}
