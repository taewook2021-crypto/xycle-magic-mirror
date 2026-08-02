export default "ALTER TABLE public.books ADD COLUMN filter_config jsonb NOT NULL DEFAULT '{\"show_type_filters\": true, \"show_star_filter\": false}'::jsonb;";
