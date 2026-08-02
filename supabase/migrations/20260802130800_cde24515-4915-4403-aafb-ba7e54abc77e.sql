GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT SELECT ON public.subjects TO anon, authenticated;
GRANT SELECT ON public.topics TO anon, authenticated;
GRANT SELECT ON public.sub_topics TO anon, authenticated;
GRANT SELECT ON public.books TO anon, authenticated;
GRANT SELECT ON public.chapters TO anon, authenticated;
GRANT SELECT ON public.questions TO anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.subjects TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.topics TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sub_topics TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.books TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chapters TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.questions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attempts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_books TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_question_memos TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_question_skips TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.follows TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.kudos TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.study_groups TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.study_group_members TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;

GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO anon, authenticated, service_role;