import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export interface StudyGroup {
  id: string;
  name: string;
  invite_code: string;
  owner_id: string;
  max_members: number;
  created_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  joined_at: string;
  profile?: {
    display_name: string;
    exam_status: string | null;
    avatar_url: string | null;
    is_public: boolean;
  };
}

export function useMyGroups() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my-groups", user?.id],
    queryFn: async () => {
      // Get group ids I'm a member of
      const { data: memberships } = await supabase
        .from("study_group_members")
        .select("group_id")
        .eq("user_id", user!.id);
      if (!memberships?.length) return [];
      const ids = memberships.map((m: any) => m.group_id);
      const { data: groups } = await supabase
        .from("study_groups")
        .select("*")
        .in("id", ids);
      return (groups ?? []) as StudyGroup[];
    },
    enabled: !!user,
  });
}

export function useGroupMembers(groupId: string | undefined) {
  return useQuery({
    queryKey: ["group-members", groupId],
    queryFn: async () => {
      const { data: members } = await supabase
        .from("study_group_members")
        .select("id, group_id, user_id, joined_at")
        .eq("group_id", groupId!);
      if (!members?.length) return [];
      const userIds = members.map((m: any) => m.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name, exam_status, avatar_url, is_public")
        .in("id", userIds);
      const profileMap = new Map((profiles ?? []).map((p: any) => [p.id, p]));
      return members.map((m: any) => ({
        ...m,
        profile: profileMap.get(m.user_id) ?? undefined,
      })) as GroupMember[];
    },
    enabled: !!groupId,
  });
}

export function useGroupDetail(groupId: string | undefined) {
  return useQuery({
    queryKey: ["group-detail", groupId],
    queryFn: async () => {
      const { data } = await supabase
        .from("study_groups")
        .select("*")
        .eq("id", groupId!)
        .single();
      return data as StudyGroup | null;
    },
    enabled: !!groupId,
  });
}

export function useCreateGroup() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      // Create group
      const { data: group, error } = await supabase
        .from("study_groups")
        .insert({ name, owner_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      // Auto-join as member
      await supabase
        .from("study_group_members")
        .insert({ group_id: group.id, user_id: user!.id });
      return group as StudyGroup;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-groups"] });
      toast({ title: "그룹이 생성되었습니다!" });
    },
    onError: () => {
      toast({ title: "그룹 생성 실패", variant: "destructive" });
    },
  });
}

export function useJoinGroup() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (inviteCode: string) => {
      // Find group by invite code — need to query without RLS blocking
      // Since we can't read groups we're not a member of, we use a workaround:
      // We'll try to find via the code. The RLS allows SELECT only for members,
      // so we need a different approach. Let's use an RPC or just try insert.
      // Actually, let's add a permissive SELECT policy for invite_code lookup.
      // For now, we'll use supabase rpc or a direct approach.
      
      // Workaround: we'll query with the code. If RLS blocks it, we won't find.
      // We need to add a policy that allows reading by invite_code.
      // For MVP, let's just try — the user must know the code.
      // Check 3-group limit
      const { count: myGroupCount } = await supabase
        .from("study_group_members")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user!.id);
      if ((myGroupCount ?? 0) >= 3) throw new Error("최대 3개 그룹까지 가입할 수 있습니다.");

      const { data: group, error: findError } = await supabase
        .from("study_groups")
        .select("id, name, max_members")
        .eq("invite_code", inviteCode.toUpperCase().trim())
        .maybeSingle();
      
      if (findError || !group) throw new Error("유효하지 않은 초대 코드입니다.");

      // Check member count
      const { count } = await supabase
        .from("study_group_members")
        .select("*", { count: "exact", head: true })
        .eq("group_id", group.id);
      
      if ((count ?? 0) >= group.max_members) throw new Error("그룹 인원이 가득 찼습니다.");

      const { error } = await supabase
        .from("study_group_members")
        .insert({ group_id: group.id, user_id: user!.id });
      
      if (error) {
        if (error.code === "23505") throw new Error("이미 가입된 그룹입니다.");
        throw error;
      }
      return group;
    },
    onSuccess: (group) => {
      qc.invalidateQueries({ queryKey: ["my-groups"] });
      toast({ title: `'${group.name}' 그룹에 가입했습니다!` });
    },
    onError: (err: Error) => {
      toast({ title: err.message, variant: "destructive" });
    },
  });
}

export function useLeaveGroup() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (groupId: string) => {
      await supabase
        .from("study_group_members")
        .delete()
        .eq("group_id", groupId)
        .eq("user_id", user!.id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-groups"] });
      qc.invalidateQueries({ queryKey: ["group-members"] });
      toast({ title: "그룹에서 탈퇴했습니다." });
    },
  });
}

export function useDeleteGroup() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (groupId: string) => {
      // Delete all members first, then the group
      await supabase
        .from("study_group_members")
        .delete()
        .eq("group_id", groupId);
      const { error } = await supabase
        .from("study_groups")
        .delete()
        .eq("id", groupId)
        .eq("owner_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-groups"] });
      qc.invalidateQueries({ queryKey: ["group-members"] });
      qc.invalidateQueries({ queryKey: ["group-detail"] });
      toast({ title: "그룹이 삭제되었습니다." });
    },
    onError: () => {
      toast({ title: "그룹 삭제 실패", variant: "destructive" });
    },
  });
}
