import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AppShell from "@/components/layout/AppShell";
import ReviewGrid from "@/components/review/ReviewGrid";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, BookOpen } from "lucide-react";

interface BookMeta {
  title: string;
  author: string | null;
}

export default function Review() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookMeta, setBookMeta] = useState<BookMeta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookId) { navigate("/dashboard"); return; }

    const fetch = async () => {
      const { data } = await supabase
        .from("books")
        .select("title, author")
        .eq("id", bookId)
        .single();
      if (data) setBookMeta(data);

      if (user) {
        const { data: existing } = await supabase
          .from("user_books")
          .select("id")
          .eq("user_id", user.id)
          .eq("book_id", bookId)
          .maybeSingle();
        if (!existing) {
          await supabase.from("user_books").insert({ user_id: user.id, book_id: bookId });
        }
      }
      setLoading(false);
    };
    fetch();
  }, [bookId, user, navigate]);

  if (!bookId) return null;

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-20">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex flex-col h-full min-h-screen bg-[#f5f5f5]">
        {/* Header bar */}
        <div className="sticky top-0 z-20 bg-[#f5f5f5]">
          <div className="max-w-full px-4 md:px-8 py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 rounded-xl bg-white border border-border/60 hover:bg-accent transition-colors"
              >
                <ArrowLeft className="h-4 w-4 text-foreground" />
              </button>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-9 w-9 rounded-xl bg-[#DA77D1]/10 flex items-center justify-center shrink-0">
                  <BookOpen className="h-4 w-4 text-[#DA77D1]" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-base font-semibold text-foreground truncate">
                    {bookMeta?.title ?? "회독표"}
                  </h1>
                  {bookMeta?.author && (
                    <p className="text-xs text-muted-foreground">{bookMeta.author}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 px-4 md:px-8 pb-20 md:pb-8">
          <div className="bg-white rounded-2xl border border-border/60 overflow-hidden">
            <div className="p-3 md:p-5">
              <ReviewGrid bookId={bookId} />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
