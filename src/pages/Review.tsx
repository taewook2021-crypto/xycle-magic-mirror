import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AppShell from "@/components/layout/AppShell";
import ReviewGrid from "@/components/review/ReviewGrid";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

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

      // Auto-register book if not yet registered
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
      <div className="flex flex-col h-full">
        {/* Compact header */}
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border bg-background sticky top-0 z-20">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-1.5 -ml-1 rounded-lg hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-semibold text-foreground truncate">
              {bookMeta?.title ?? "회독표"}
            </h1>
            {bookMeta?.author && (
              <p className="text-[10px] text-muted-foreground">{bookMeta.author}</p>
            )}
          </div>
        </div>

        {/* Review grid - full width, no extra padding */}
        <div className="flex-1 overflow-y-auto px-2 pt-2 pb-20 md:px-4 md:pb-6">
          <ReviewGrid bookId={bookId} />
        </div>
      </div>
    </AppShell>
  );
}
