import { getContent } from "@/lib/content";
import { isAuthenticated } from "@/lib/auth";
import { getSubmissions } from "@/lib/submissions";
import { AdminPanel } from "@/components/admin/AdminPanel";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const authed = await isAuthenticated();
  const content = await getContent();
  const submissions = await getSubmissions();

  return (
    <div className="min-h-screen bg-ivory pt-20">
      <AdminPanel
        initialAuthed={authed}
        initialContent={content}
        initialSubmissions={submissions}
      />
    </div>
  );
}
