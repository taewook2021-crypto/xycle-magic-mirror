import { useState, useEffect, useCallback, useRef } from "react";
import AppShell from "@/components/layout/AppShell";
import TimerHeader from "@/components/dashboard/TimerHeader";
import SubjectTimer, { type StudySubject } from "@/components/dashboard/SubjectTimer";
import AddSubjectSheet from "@/components/dashboard/AddSubjectSheet";
import { Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const STORAGE_KEY = "xycle_timer_v1";
const D_DAY_TARGET = new Date("2026-11-14"); // CPA 시험일 하드코딩

function getDDay() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((D_DAY_TARGET.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

interface SavedState {
  date: string;
  subjects: StudySubject[];
}

function loadState(): StudySubject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: SavedState = JSON.parse(raw);
    if (parsed.date !== todayKey()) {
      // New day — reset elapsed but keep subjects
      return parsed.subjects.map((s) => ({ ...s, elapsed: 0 }));
    }
    return parsed.subjects;
  } catch {
    return [];
  }
}

function saveState(subjects: StudySubject[]) {
  const state: SavedState = { date: todayKey(), subjects };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export default function Dashboard() {
  const [subjects, setSubjects] = useState<StudySubject[]>(loadState);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Save to localStorage on change
  useEffect(() => {
    saveState(subjects);
  }, [subjects]);

  // Timer tick
  useEffect(() => {
    if (activeId) {
      intervalRef.current = setInterval(() => {
        setSubjects((prev) =>
          prev.map((s) => (s.id === activeId ? { ...s, elapsed: s.elapsed + 1 } : s))
        );
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeId]);

  const totalSeconds = subjects.reduce((sum, s) => sum + s.elapsed, 0);

  const handleToggle = useCallback((id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  }, []);

  const handleAdd = useCallback((name: string, color: string) => {
    setSubjects((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name, color, elapsed: 0 },
    ]);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      if (activeId === id) setActiveId(null);
      setSubjects((prev) => prev.filter((s) => s.id !== id));
    },
    [activeId]
  );

  return (
    <AppShell>
      <TimerHeader dDay={getDDay()} totalSeconds={totalSeconds} />

      <Tabs defaultValue="timer" className="px-4 pt-3 pb-8">
        <TabsList className="w-full">
          <TabsTrigger value="timer" className="flex-1">타이머</TabsTrigger>
          <TabsTrigger value="todo" className="flex-1">To-do</TabsTrigger>
          <TabsTrigger value="books" className="flex-1">교재</TabsTrigger>
        </TabsList>

        <TabsContent value="timer" className="mt-3 space-y-1">
          {subjects.map((subject) => (
            <SubjectTimer
              key={subject.id}
              subject={subject}
              isActive={activeId === subject.id}
              onToggle={() => handleToggle(subject.id)}
              onDelete={() => handleDelete(subject.id)}
              onRename={() => {}}
            />
          ))}

          {subjects.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              과목을 추가하고 공부를 시작하세요
            </div>
          )}

          <button
            onClick={() => setSheetOpen(true)}
            className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm text-muted-foreground hover:bg-accent/40 transition-colors"
          >
            <Plus className="h-4 w-4" />
            과목 추가
          </button>
        </TabsContent>

        <TabsContent value="todo">
          <div className="text-center py-16 text-muted-foreground text-sm">
            준비 중입니다
          </div>
        </TabsContent>

        <TabsContent value="books">
          <div className="text-center py-16 text-muted-foreground text-sm">
            준비 중입니다
          </div>
        </TabsContent>
      </Tabs>

      <AddSubjectSheet open={sheetOpen} onOpenChange={setSheetOpen} onAdd={handleAdd} />
    </AppShell>
  );
}
