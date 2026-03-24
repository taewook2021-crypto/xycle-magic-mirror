import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AppShell from "@/components/layout/AppShell";
import ReviewGrid from "@/components/review/ReviewGrid";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowLeft, Search, BookOpen, User, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

const ADMIN_EMAIL = "wiserlab1@gmail.com";

interface UserProfile {
  id: string;
  display_name: string;
  exam_status: string | null;
  avatar_url: string | null;
  is_public: boolean;
  created_at: string;
}

interface UserBook {
  book_id: string;
  books: { id: string; title: string; author: string | null };
}

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  // Guard: only admin email
  if (authLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-20">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </AppShell>
    );
  }

  if (!user || user.email !== ADMIN_EMAIL) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto pb-24 md:pb-6">
        <div className="flex items-center gap-2 px-4 py-4 border-b border-border sticky top-0 bg-background z-20">
          <button onClick={() => navigate("/profile")} className="p-1.5 -ml-1 rounded-lg hover:bg-accent transition-colors">
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          </button>
          <h1 className="text-base font-bold text-foreground">관리자 페이지</h1>
        </div>

        {selectedBookId && selectedUser ? (
          <ReviewView
            userId={selectedUser.id}
            userName={selectedUser.display_name}
            bookId={selectedBookId}
            onBack={() => setSelectedBookId(null)}
          />
        ) : selectedUser ? (
          <UserBooksView
            user={selectedUser}
            onBack={() => setSelectedUser(null)}
            onSelectBook={(bookId) => setSelectedBookId(bookId)}
          />
        ) : (
          <UserListView search={search} setSearch={setSearch} onSelectUser={setSelectedUser} />
        )}
      </div>
    </AppShell>
  );
}

function UserListView({
  search,
  setSearch,
  onSelectUser,
}: {
  search: string;
  setSearch: (s: string) => void;
  onSelectUser: (u: UserProfile) => void;
}) {
  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, exam_status, avatar_url, is_public, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as UserProfile[];
    },
  });

  const filtered = profiles.filter((p) =>
    p.display_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-4 pt-4 space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="유저 검색..."
          className="pl-9"
        />
      </div>

      <p className="text-xs text-muted-foreground">총 {filtered.length}명</p>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-1">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelectUser(p)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/60 transition-colors text-left group"
            >
              <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                {p.avatar_url ? (
                  <img src={p.avatar_url} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{p.display_name || "사용자"}</p>
                <p className="text-xs text-muted-foreground">
                  {p.exam_status ?? "미설정"} · {p.is_public ? "공개" : "비공개"}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function UserBooksView({
  user,
  onBack,
  onSelectBook,
}: {
  user: UserProfile;
  onBack: () => void;
  onSelectBook: (bookId: string) => void;
}) {
  const { data: books = [], isLoading } = useQuery({
    queryKey: ["admin-user-books", user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_books")
        .select("book_id, books(id, title, author)")
        .eq("user_id", user.id);
      if (error) throw error;
      return (data ?? []) as unknown as UserBook[];
    },
  });

  return (
    <div className="px-4 pt-4 space-y-3">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" />
        유저 목록
      </button>

      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <User className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">{user.display_name || "사용자"}</p>
          <p className="text-xs text-muted-foreground">{user.exam_status ?? "미설정"}</p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground font-medium pt-2">등록된 교재 ({books.length})</p>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : books.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">등록된 교재가 없습니다.</p>
      ) : (
        <div className="space-y-1">
          {books.map((b) => (
            <button
              key={b.book_id}
              onClick={() => onSelectBook(b.book_id)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/60 transition-colors text-left group"
            >
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{b.books.title}</p>
                {b.books.author && <p className="text-xs text-muted-foreground">{b.books.author}</p>}
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewView({
  userId,
  userName,
  bookId,
  onBack,
}: {
  userId: string;
  userName: string;
  bookId: string;
  onBack: () => void;
}) {
  return (
    <div className="pt-2">
      <div className="px-4 pb-2">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          {userName}의 교재 목록
        </button>
      </div>
      <div className="px-2 md:px-4 pb-20 md:pb-6">
        <ReviewGrid bookId={bookId} userId={userId} readOnly />
      </div>
    </div>
  );
}
