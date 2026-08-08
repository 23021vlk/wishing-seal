import { supabaseServer } from "@/lib/supabaseServer";
import ResultActions from "@/components/ResultActions";

export default async function ResultPage({ params }) {
  const supabase = supabaseServer();
  const { data } = await supabase.from("birthdays").select("*").eq("id", params.id).single();

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="glass rounded-[26px] p-8 max-w-sm text-center">
          <p className="text-sm text-muted">
            No surprise found. <a href="/" className="text-gold underline">Create one</a>.
          </p>
        </div>
      </main>
    );
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL || "";
  const link = `${site}/b/${data.slug}-${data.id}`;

  return (
    <main className="min-h-screen flex items-center justify-center">
      <ResultActions record={data} link={link} />
    </main>
  );
}
