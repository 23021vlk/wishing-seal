import { supabaseServer } from "@/lib/supabaseServer";
import { idFromSlugParam, unescapeHtml } from "@/lib/utils";
import BirthdayExperience from "@/components/BirthdayExperience";

export async function generateMetadata({ params }) {
  const id = idFromSlugParam(params.slug);
  const supabase = supabaseServer();
  const { data } = await supabase.from("birthdays").select("name").eq("id", id).single();
  return {
    title: data ? `A birthday surprise for ${unescapeHtml(data.name)} 🎂` : "VLKify",
  };
}

export default async function RecipientPage({ params }) {
  const id = idFromSlugParam(params.slug);
  const supabase = supabaseServer();
  const { data } = await supabase.from("birthdays").select("*").eq("id", id).single();

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="glass rounded-[26px] p-8 max-w-sm text-center">
          <h1 className="font-display font-semibold text-2xl mb-2">This surprise couldn&apos;t be found</h1>
          <p className="text-sm text-muted mb-4">The link may be mistyped, or the surprise was removed.</p>
          <a href="/" className="text-gold underline text-sm">Create a new one</a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <BirthdayExperience
        record={{
          name: unescapeHtml(data.name),
          message: unescapeHtml(data.message),
          photoUrl: data.photo_url,
          musicUrl: data.music_url,
          settings: data.settings,
        }}
      />
    </main>
  );
}
