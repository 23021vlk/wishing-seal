import { supabaseServer } from "@/lib/supabaseServer";
import BirthdayForm from "@/components/BirthdayForm";

export default async function EditPage({ params }) {
  const supabase = supabaseServer();
  const { data } = await supabase.from("birthdays").select("*").eq("id", params.id).single();

  if (!data) {
    return (
      <main className="min-h-dvh flex items-center justify-center px-4">
        <div className="glass rounded-[26px] p-8 max-w-sm text-center">
          <p className="text-sm text-muted">That surprise no longer exists.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh flex items-center justify-center">
      <BirthdayForm editData={data} />
    </main>
  );
}
