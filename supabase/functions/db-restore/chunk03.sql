-- ===== 20260320063136_33861d1e-0070-424b-b181-2dfbef5b1502.sql =====
INSERT INTO public.chapters (id, book_id, title, chapter_number, display_order) VALUES
  ('d61dfa1d-e4d5-4007-aa1f-f5adff122f6c', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '현금및현금성자산과 수취채권', 1, 1),
  ('f0bb630d-04be-455b-a6de-66e14599eacc', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '재고자산', 2, 2),
  ('142f2d1d-c424-4606-af2f-d964ca346669', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '유형자산', 3, 3),
  ('780d8509-914b-4bf4-aa02-27d7acc94398', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '무형자산과 투자부동산', 4, 4),
  ('2518f886-99b2-431c-ab41-0e354d345650', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '금융자산', 5, 5),
  ('57d519ab-d229-4610-ae0c-66ec809e4b9a', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '금융부채', 6, 6),
  ('8fbc63e6-ae53-4ee3-a322-d4f66e6a082f', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '충당부채와 종업원급여', 7, 7),
  ('88ee8f63-b174-4df2-a4d0-369aa8e687e9', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '자본', 8, 8),
  ('17c341bd-ced1-48ac-ac37-635c7bd20c3f', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '수익인식', 9, 9),
  ('c48b46d5-fa7e-420a-a209-c8020adb8792', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '건설계약', 10, 10),
  ('514229a6-ea45-4b7a-a736-cb4bafa6827e', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '법인세회계', 11, 11),
  ('1c258f82-5c3b-48f5-a2ee-285f6be9593c', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '주당이익', 12, 12),
  ('b08f76b4-691e-41d5-a5a5-6380e2fadfc5', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '회계변경과 오류수정', 13, 13),
  ('11945b46-9642-4852-a08b-5d6681241353', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '현금흐름표', 14, 14),
  ('de74e8fb-0212-4b6d-a406-4b6692160a5c', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '리스', 15, 15),
  ('359baef9-afc6-49f1-a50e-ddf5bccde983', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '환율변동효과', 16, 16),
  ('90f2b09e-276b-49c7-a727-d86b23d87c08', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '파생상품과 위험회피회계', 17, 17),
  ('7a84f2d7-e30d-4d3a-a245-f15053b6ca3a', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '재무비율분석', 18, 18),
  ('dc4a8060-5a79-4c0f-a69d-745a5a8b42d8', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '기타 특수회계', 19, 19),
  ('25de8e46-5e97-4886-aecc-87e27d5b0732', '4543e179-d6f1-478d-a7dd-3ee02751cc1a', '사업결합', 20, 20),
  ('bf85b9f0-e98c-4b87-ae0c-45995a30ea48', '4543e179-d6f1-478d-a7dd-3ee02751cc1a', '연결재무제표', 21, 21),
  ('e005476d-2944-4437-a85d-6f2a9dd617fe', '4543e179-d6f1-478d-a7dd-3ee02751cc1a', '관계기업과 공동약정', 22, 22),
  ('6fcdd99c-4559-49fe-a238-70ea32d26c46', '4543e179-d6f1-478d-a7dd-3ee02751cc1a', '종합문제', 23, 23)
ON CONFLICT (id) DO NOTHING;

-- ===== 20260320063354_d683b18b-89e1-4313-91fb-c8e97dafb957.sql =====
INSERT INTO public.questions (id, chapter_id, question_number, question_type, is_essential) VALUES
('3dc541e1-9861-40fa-a200-1284c682d147', 'd61dfa1d-e4d5-4007-aa1f-f5adff122f6c', 1, 'example', false),
('196d649c-5a3e-4827-a38f-378a6523cff8', 'd61dfa1d-e4d5-4007-aa1f-f5adff122f6c', 2, 'example', false),
('7db32041-db4a-4e41-a14e-4a38bd0888d0', 'd61dfa1d-e4d5-4007-aa1f-f5adff122f6c', 3, 'example', false),
('b416e015-b980-47be-a2cf-2e7e6ad1c370', 'd61dfa1d-e4d5-4007-aa1f-f5adff122f6c', 1, 'practice', false),
('5d8aaa86-c3a9-4f0d-a20c-79dc9e858300', 'd61dfa1d-e4d5-4007-aa1f-f5adff122f6c', 2, 'practice', false),
('6262fc5a-71d1-4595-a58a-74012668bc35', 'd61dfa1d-e4d5-4007-aa1f-f5adff122f6c', 3, 'practice', false),
('0f9b1013-084e-4ba6-a6c3-af6000e11843', 'd61dfa1d-e4d5-4007-aa1f-f5adff122f6c', 4, 'practice', false),
('aff1a0f1-0116-491c-ae7b-81fc535565fa', 'f0bb630d-04be-455b-a6de-66e14599eacc', 1, 'example', false),
('94e9cc55-c354-4e05-ab1d-55fb5d813c2d', 'f0bb630d-04be-455b-a6de-66e14599eacc', 2, 'example', false),
('5537eaa0-bad5-4bb4-a119-e982bfa17481', 'f0bb630d-04be-455b-a6de-66e14599eacc', 1, 'practice', false),
('c413c1f0-e281-499e-a6ac-c53f073dbde9', 'f0bb630d-04be-455b-a6de-66e14599eacc', 2, 'practice', false),
('f380c5a2-d54a-44f4-a492-8a20183e67de', '142f2d1d-c424-4606-af2f-d964ca346669', 1, 'example', false),
('13bdff71-a514-41da-aeaf-6092cc57253e', '142f2d1d-c424-4606-af2f-d964ca346669', 2, 'example', false),
('9b8d3184-90ee-45ac-ab24-c7188fe2a4f1', '142f2d1d-c424-4606-af2f-d964ca346669', 3, 'example', false),
('8b257381-f2f3-4269-a3e3-44df754269cb', '142f2d1d-c424-4606-af2f-d964ca346669', 4, 'example', false),
('c41ec865-0211-4558-aa77-cbc826c45843', '142f2d1d-c424-4606-af2f-d964ca346669', 1, 'practice', false),
('3fbf6040-a831-4fdc-a377-d41c6fc7d857', '142f2d1d-c424-4606-af2f-d964ca346669', 2, 'practice', false),
('752980fb-7c06-4b72-a622-b94f6332ef14', '142f2d1d-c424-4606-af2f-d964ca346669', 3, 'practice', false),
('15caf04d-1d78-42f5-ae17-c0071c1deb36', '142f2d1d-c424-4606-af2f-d964ca346669', 4, 'practice', false),
('9ed506bc-482a-439f-a461-27e18def7c7f', '142f2d1d-c424-4606-af2f-d964ca346669', 5, 'practice', false),
('fe9d2c6c-12d1-43ac-a536-3df552ac5f07', '142f2d1d-c424-4606-af2f-d964ca346669', 6, 'practice', false),
('3c707c2a-0ebb-4337-a9d4-a65d88b9e4e5', '142f2d1d-c424-4606-af2f-d964ca346669', 7, 'practice', false),
('d6b0ba5b-b20a-49b6-ad23-92027326868c', '780d8509-914b-4bf4-aa02-27d7acc94398', 1, 'example', false),
('e04508c8-4e8f-48e8-ad43-1323e8245ed7', '780d8509-914b-4bf4-aa02-27d7acc94398', 2, 'example', false),
('6367cd52-0484-4443-a7fd-e01dcf80df0d', '780d8509-914b-4bf4-aa02-27d7acc94398', 3, 'example', false),
('f8418095-7c7c-48dd-a429-30f2d538fa7f', '780d8509-914b-4bf4-aa02-27d7acc94398', 4, 'example', false),
('835fc43c-912c-48ec-a560-603351bc61f1', '780d8509-914b-4bf4-aa02-27d7acc94398', 5, 'example', false),
('207ecc0b-69b2-4eb0-a265-96fc52589906', '780d8509-914b-4bf4-aa02-27d7acc94398', 6, 'example', false),
('53e95a1b-7beb-4682-a7af-12da779d12e7', '780d8509-914b-4bf4-aa02-27d7acc94398', 1, 'practice', false),
('578ae55c-5b93-4a6e-a549-77eb6d23220b', '780d8509-914b-4bf4-aa02-27d7acc94398', 2, 'practice', false),
('d6ea78c0-7835-4667-a211-6a8c915345e7', '780d8509-914b-4bf4-aa02-27d7acc94398', 3, 'practice', false),
('c377a54d-4982-48ed-a1ee-846a8d5c3df0', '780d8509-914b-4bf4-aa02-27d7acc94398', 4, 'practice', false),
('d598b302-43cf-4373-a4e7-ae52321d396c', '780d8509-914b-4bf4-aa02-27d7acc94398', 5, 'practice', false),
('bbdb823d-4718-4cdb-a1b2-88836455b37e', '2518f886-99b2-431c-ab41-0e354d345650', 1, 'example', false),
('9f6a98e0-93d4-4b55-a18e-9d12b9069e7b', '2518f886-99b2-431c-ab41-0e354d345650', 2, 'example', false),
('31b7b65c-c3d1-42f5-aa99-eba08f3a18a0', '2518f886-99b2-431c-ab41-0e354d345650', 3, 'example', false),
('43badc5f-cccd-4a7c-a669-e08094691354', '2518f886-99b2-431c-ab41-0e354d345650', 1, 'practice', false),
('68463ec9-344a-4694-afee-d277bc6f75ef', '2518f886-99b2-431c-ab41-0e354d345650', 2, 'practice', false),
('91c0448a-0332-446f-a093-3a660c2d5f60', '2518f886-99b2-431c-ab41-0e354d345650', 3, 'practice', false),
('aeb9047c-f27d-41c3-ace2-b389b2bc5ac8', '57d519ab-d229-4610-ae0c-66ec809e4b9a', 1, 'example', false),
('7836bbe8-2341-4b28-a38a-08dbe285d8ae', '57d519ab-d229-4610-ae0c-66ec809e4b9a', 2, 'example', false),
('e0bced5f-9a9a-4a58-a385-7727132290dc', '57d519ab-d229-4610-ae0c-66ec809e4b9a', 3, 'example', false),
('abe06d37-7761-4215-ab06-51154f2f4a2c', '57d519ab-d229-4610-ae0c-66ec809e4b9a', 1, 'practice', false),
('9560b4b5-8b1d-489d-ada8-b023d3f09f0c', '57d519ab-d229-4610-ae0c-66ec809e4b9a', 2, 'practice', false),
('ddbecf97-81d3-4725-ab8e-39348c2ce494', '57d519ab-d229-4610-ae0c-66ec809e4b9a', 3, 'practice', false),
('3c4e19b0-0940-4e0f-a9a6-a042bd725365', '8fbc63e6-ae53-4ee3-a322-d4f66e6a082f', 1, 'example', false),
('47bf6b45-ff64-429c-a9b6-cc4dadce53d0', '8fbc63e6-ae53-4ee3-a322-d4f66e6a082f', 2, 'example', false),
('005671fd-4664-4353-af5b-c0d6cbf0038c', '8fbc63e6-ae53-4ee3-a322-d4f66e6a082f', 3, 'example', false),
('eaaaf939-67ca-4514-a921-d90ddde09d22', '8fbc63e6-ae53-4ee3-a322-d4f66e6a082f', 1, 'practice', false),
('4c2d79bf-71be-4cd8-a834-7c91378a9fe8', '8fbc63e6-ae53-4ee3-a322-d4f66e6a082f', 2, 'practice', false),
('eb30d814-e185-4cae-aed1-35c588b544ea', '8fbc63e6-ae53-4ee3-a322-d4f66e6a082f', 3, 'practice', false),
('a45b3ed8-ebf2-4ead-a477-5dad88f43aac', '8fbc63e6-ae53-4ee3-a322-d4f66e6a082f', 4, 'practice', false),
('2d9fdd22-e57c-4b8e-a1f9-43c638fabf88', '88ee8f63-b174-4df2-a4d0-369aa8e687e9', 1, 'example', false),
('9f3a75ea-8f0f-4859-ade6-6649b9bf1002', '88ee8f63-b174-4df2-a4d0-369aa8e687e9', 2, 'example', false),
('e65c1bfc-8207-4280-a28c-3f129324ec1e', '88ee8f63-b174-4df2-a4d0-369aa8e687e9', 3, 'example', false),
('e7ecaf10-c05e-4952-aeeb-7578bd882f7e', '88ee8f63-b174-4df2-a4d0-369aa8e687e9', 4, 'example', false),
('5f6edcdd-2f32-462a-a25e-5b43f4bb59f7', '88ee8f63-b174-4df2-a4d0-369aa8e687e9', 5, 'example', false),
('e2b9e219-9930-4e56-a26f-777ca2e3da13', '88ee8f63-b174-4df2-a4d0-369aa8e687e9', 1, 'practice', false),
('b7a705b0-727f-4997-a2a3-5d0f81ae4fda', '88ee8f63-b174-4df2-a4d0-369aa8e687e9', 2, 'practice', false),
('d50f5038-aad9-4087-a8ad-4f6949190de0', '88ee8f63-b174-4df2-a4d0-369aa8e687e9', 3, 'practice', false),
('cc5307e3-608d-483a-a9fa-15d428dc9037', '88ee8f63-b174-4df2-a4d0-369aa8e687e9', 4, 'practice', false),
('b6d8b9c4-7c9e-4392-a546-fb0566df7ddb', '88ee8f63-b174-4df2-a4d0-369aa8e687e9', 5, 'practice', false),
('43c4f393-0de5-478f-ae13-a04e6469e0d4', '17c341bd-ced1-48ac-ac37-635c7bd20c3f', 1, 'example', false),
('2a5c5721-c79f-425b-a7bb-ca4a21cdd500', '17c341bd-ced1-48ac-ac37-635c7bd20c3f', 2, 'example', false),
('377eb2b9-b3c5-4114-ada8-4bbe50a3a192', '17c341bd-ced1-48ac-ac37-635c7bd20c3f', 3, 'example', false),
('22ffc017-4b67-43a9-a2bd-66c0f9a6d42f', '17c341bd-ced1-48ac-ac37-635c7bd20c3f', 4, 'example', false),
('8919bd78-7a58-44f0-ad9c-353f61660749', '17c341bd-ced1-48ac-ac37-635c7bd20c3f', 1, 'practice', false),
('3cd14a83-527a-45af-ac59-04084ed796ea', '17c341bd-ced1-48ac-ac37-635c7bd20c3f', 2, 'practice', false),
('f38fa651-5f3a-465a-a498-68cb1aea749f', '17c341bd-ced1-48ac-ac37-635c7bd20c3f', 3, 'practice', false),
('6d8dba97-6cb8-49ff-af69-b034cc4f7acd', 'c48b46d5-fa7e-420a-a209-c8020adb8792', 1, 'example', false),
('52852d96-e649-44d9-a1fc-880399767859', 'c48b46d5-fa7e-420a-a209-c8020adb8792', 2, 'example', false),
('63c5879a-2710-450d-a353-06119f171017', 'c48b46d5-fa7e-420a-a209-c8020adb8792', 3, 'example', false),
('78abe88c-e4d7-4072-a6e9-a0e929c3238e', 'c48b46d5-fa7e-420a-a209-c8020adb8792', 4, 'example', false),
('9155ee2c-53a5-430c-a58c-180813db9fcc', 'c48b46d5-fa7e-420a-a209-c8020adb8792', 5, 'example', false),
('bde80fce-8939-4910-aabc-cd8eeca1b36b', 'c48b46d5-fa7e-420a-a209-c8020adb8792', 1, 'practice', false),
('bd9a31c9-4a94-406a-a60a-eb6b9a3ac7be', 'c48b46d5-fa7e-420a-a209-c8020adb8792', 2, 'practice', false),
('94af49da-8c07-4294-ad1a-c842fab24a83', 'c48b46d5-fa7e-420a-a209-c8020adb8792', 3, 'practice', false),
('8b41b717-9754-4c07-a30b-5f7d5dd5fffc', 'c48b46d5-fa7e-420a-a209-c8020adb8792', 4, 'practice', false),
('19cafff0-1282-4911-a7e7-7d2b5de93738', 'c48b46d5-fa7e-420a-a209-c8020adb8792', 5, 'practice', false),
('3ed36ab4-cc12-49ab-a9ca-feb79ab615df', 'c48b46d5-fa7e-420a-a209-c8020adb8792', 6, 'practice', false),
('fc022eb0-11c1-46a9-adde-c9c2c2f7719d', 'c48b46d5-fa7e-420a-a209-c8020adb8792', 7, 'practice', false)
ON CONFLICT (id) DO NOTHING;

-- ===== 20260320063559_7e5260cc-f510-41df-9614-e0c201e375f2.sql =====
INSERT INTO public.questions (id, chapter_id, question_number, question_type, is_essential) VALUES
('8ec8b0ca-4f1e-44cb-a83e-49e24ee5ee0f', '514229a6-ea45-4b7a-a736-cb4bafa6827e', 1, 'example', false),
('b287faf1-64f8-40b0-a73e-6144e1653dca', '514229a6-ea45-4b7a-a736-cb4bafa6827e', 2, 'example', false),
('e32853ce-5a7b-449b-a9a5-38d37cd5d257', '514229a6-ea45-4b7a-a736-cb4bafa6827e', 3, 'example', false),
('2687d13f-8f16-4969-a6b3-eef35939b963', '514229a6-ea45-4b7a-a736-cb4bafa6827e', 4, 'example', false),
('4047329b-47c5-4e9e-a10c-1bc8f2b1c9e7', '514229a6-ea45-4b7a-a736-cb4bafa6827e', 5, 'example', false),
('acbc3c08-ba84-4f54-ae95-53e3bc8b71b4', '514229a6-ea45-4b7a-a736-cb4bafa6827e', 6, 'example', false),
('c9de958e-718e-43eb-aae6-519a494c4ea6', '514229a6-ea45-4b7a-a736-cb4bafa6827e', 1, 'practice', false),
('426a1721-b812-43c8-a9a1-77091568b26c', '514229a6-ea45-4b7a-a736-cb4bafa6827e', 2, 'practice', false),
('b0966c2c-e90c-4943-ad88-49e8740b59f3', '514229a6-ea45-4b7a-a736-cb4bafa6827e', 3, 'practice', false),
('26e0cea2-2ca9-4155-a2b2-81ecc4b5f8c7', '514229a6-ea45-4b7a-a736-cb4bafa6827e', 4, 'practice', false),
('da8182d0-f2c4-40d0-ae19-b7f7e1b92d28', '514229a6-ea45-4b7a-a736-cb4bafa6827e', 5, 'practice', false),
('37cb3b1f-2e7b-416c-a16f-dbd5f438e72e', '1c258f82-5c3b-48f5-a2ee-285f6be9593c', 1, 'example', false),
('6e84587f-4368-4eaa-a726-dd80448393a9', '1c258f82-5c3b-48f5-a2ee-285f6be9593c', 2, 'example', false),
('b8657f90-7cbf-41d4-a78c-60af2334c2b2', '1c258f82-5c3b-48f5-a2ee-285f6be9593c', 3, 'example', false),
('ea1fa6ae-37f8-43f6-a7d9-40fa5ee234bf', '1c258f82-5c3b-48f5-a2ee-285f6be9593c', 1, 'practice', false),
('ff501a8f-7057-4575-a01e-b6875e0b60fd', '1c258f82-5c3b-48f5-a2ee-285f6be9593c', 2, 'practice', false),
('7aa7c3e2-9172-463d-adfe-f6b6609396ce', '1c258f82-5c3b-48f5-a2ee-285f6be9593c', 3, 'practice', false),
('a0a1413c-fc88-465c-a0b3-35f47a6babdf', '1c258f82-5c3b-48f5-a2ee-285f6be9593c', 4, 'practice', false),
('66b4be3f-3f08-4bee-a90c-9e4e39c48054', 'b08f76b4-691e-41d5-a5a5-6380e2fadfc5', 1, 'example', false),
('c14a4026-f852-4440-ae25-366dde22d5f2', 'b08f76b4-691e-41d5-a5a5-6380e2fadfc5', 2, 'example', false),
('13d04a57-76a5-44c9-a5dc-cbee153c6294', 'b08f76b4-691e-41d5-a5a5-6380e2fadfc5', 3, 'example', false),
('8b99f4d9-658f-40c4-a926-032aa0e85abe', 'b08f76b4-691e-41d5-a5a5-6380e2fadfc5', 4, 'example', false),
('30158fbd-94db-4bfb-ae90-5f7533d270ca', 'b08f76b4-691e-41d5-a5a5-6380e2fadfc5', 5, 'example', false),
('46f5c28e-aa5b-4076-a022-f1b46dd6c1d0', 'b08f76b4-691e-41d5-a5a5-6380e2fadfc5', 1, 'practice', false),
('29c484e1-11e2-42c3-ae97-c99bbd59e684', 'b08f76b4-691e-41d5-a5a5-6380e2fadfc5', 2, 'practice', false),
('b695e647-215b-4848-a8ce-fea251947367', 'b08f76b4-691e-41d5-a5a5-6380e2fadfc5', 3, 'practice', false),
('aa23d458-181d-4348-a645-a2c14dfdf07a', 'b08f76b4-691e-41d5-a5a5-6380e2fadfc5', 4, 'practice', false),
('350db464-b251-4593-a7eb-f7b8b955d8ed', '11945b46-9642-4852-a08b-5d6681241353', 1, 'example', false),
('8db98617-31f0-4369-aa76-cd0dd3f7d643', '11945b46-9642-4852-a08b-5d6681241353', 2, 'example', false),
('a4864bbe-525f-4e96-a9aa-9b0d70c109cb', '11945b46-9642-4852-a08b-5d6681241353', 3, 'example', false),
('c6998f86-602d-497a-a0a0-f5c2c6d5fcef', '11945b46-9642-4852-a08b-5d6681241353', 4, 'example', false),
('1eac1029-d84a-4b16-a01a-44383fd8f99d', '11945b46-9642-4852-a08b-5d6681241353', 5, 'example', false),
('e0d1fef3-3e9f-49e8-a265-9173f8263116', '11945b46-9642-4852-a08b-5d6681241353', 1, 'practice', false),
('e5a85f65-3046-446f-a6e9-faafec5f8f7b', '11945b46-9642-4852-a08b-5d6681241353', 2, 'practice', false),
('278fc213-0e0d-4d42-a324-fbec07a90b71', '11945b46-9642-4852-a08b-5d6681241353', 3, 'practice', false),
('3b0fd7f2-64be-4406-a763-2a29cb9fffb5', '11945b46-9642-4852-a08b-5d6681241353', 4, 'practice', false),
('82e9c558-8896-4cae-aa57-1c974178c9ff', 'de74e8fb-0212-4b6d-a406-4b6692160a5c', 1, 'example', false),
('5a4f77cc-9f37-43a7-a791-6b26f7661634', 'de74e8fb-0212-4b6d-a406-4b6692160a5c', 2, 'example', false),
('d33e922d-cb87-4f77-ac76-8e854e95f98f', 'de74e8fb-0212-4b6d-a406-4b6692160a5c', 3, 'example', false),
('3ef8619a-8b09-4957-a7e9-f830f2e0dd92', 'de74e8fb-0212-4b6d-a406-4b6692160a5c', 4, 'example', false),
('80e7eff4-7ca3-4c7e-ac12-b28b772f3219', 'de74e8fb-0212-4b6d-a406-4b6692160a5c', 5, 'example', false),
('dc5a78c8-c1ce-41af-af84-dd684445c16c', 'de74e8fb-0212-4b6d-a406-4b6692160a5c', 1, 'practice', false),
('27f8c6c2-1493-4b85-af77-e95650fe048f', 'de74e8fb-0212-4b6d-a406-4b6692160a5c', 2, 'practice', false),
('305899c3-3fbc-42d5-a4c7-6b633b0a5238', 'de74e8fb-0212-4b6d-a406-4b6692160a5c', 3, 'practice', false),
('ed59a63d-db3a-4373-a144-a2cee8efed0f', 'de74e8fb-0212-4b6d-a406-4b6692160a5c', 4, 'practice', false),
('88292ccf-9f30-4e7b-a811-8fab48bcfac0', '359baef9-afc6-49f1-a50e-ddf5bccde983', 1, 'example', false),
('5421fb52-e6ad-43b1-afb7-32447659470e', '359baef9-afc6-49f1-a50e-ddf5bccde983', 2, 'example', false),
('6131ee76-4f1a-4525-af9e-216fce5e9006', '359baef9-afc6-49f1-a50e-ddf5bccde983', 3, 'example', false),
('8595e880-4219-48be-aeae-99be90ad4e91', '359baef9-afc6-49f1-a50e-ddf5bccde983', 4, 'example', false),
('aa14c066-7dcc-4e09-af77-037f1f191a79', '359baef9-afc6-49f1-a50e-ddf5bccde983', 1, 'practice', false),
('f201d49e-754c-4063-acfc-c90b56f33acc', '359baef9-afc6-49f1-a50e-ddf5bccde983', 2, 'practice', false),
('33f2af94-fd43-4d30-a658-c6ad693c1256', '359baef9-afc6-49f1-a50e-ddf5bccde983', 3, 'practice', false),
('fdcb6899-af46-4901-a19e-676ce4f77d80', '359baef9-afc6-49f1-a50e-ddf5bccde983', 4, 'practice', false),
('6b943ce6-278d-49a7-ac5d-ae3c199dae09', '359baef9-afc6-49f1-a50e-ddf5bccde983', 5, 'practice', false),
('53450ff2-2d0d-4ecf-a67e-255aa5768325', '359baef9-afc6-49f1-a50e-ddf5bccde983', 6, 'practice', false),
('1f10c8af-26af-431f-abf6-32f45a0cda0e', '90f2b09e-276b-49c7-a727-d86b23d87c08', 1, 'example', false),
('b5df8ba0-6b8a-413b-aa63-4aaae17cd846', '90f2b09e-276b-49c7-a727-d86b23d87c08', 2, 'example', false),
('1c74c455-c873-4697-a356-a00531c37cd5', '90f2b09e-276b-49c7-a727-d86b23d87c08', 3, 'example', false),
('f6ae93ad-82c4-4f54-a580-b14e3a26ff6e', '90f2b09e-276b-49c7-a727-d86b23d87c08', 4, 'example', false),
('afcf79b0-6e0f-4eed-ad8f-bc17022e4a0b', '90f2b09e-276b-49c7-a727-d86b23d87c08', 5, 'example', false),
('c1999f8e-3ce2-41e4-a8ee-84d4ba9cb754', '90f2b09e-276b-49c7-a727-d86b23d87c08', 1, 'practice', false),
('29e7d8e4-bc59-431b-aeb0-ce6adb2e0bc1', '90f2b09e-276b-49c7-a727-d86b23d87c08', 2, 'practice', false),
('ec898f38-606d-49f1-acb2-1e259839c33b', '90f2b09e-276b-49c7-a727-d86b23d87c08', 3, 'practice', false),
('503d938f-8032-40d9-a0e2-4ee30e9426ae', '7a84f2d7-e30d-4d3a-a245-f15053b6ca3a', 1, 'example', false),
('e835931d-a613-476f-a75f-1ecf458d58dc', '7a84f2d7-e30d-4d3a-a245-f15053b6ca3a', 2, 'example', false),
('e1bfc993-934d-4fcb-a1bf-ef964c4feb0f', '7a84f2d7-e30d-4d3a-a245-f15053b6ca3a', 3, 'example', false),
('da3e42a9-2e8b-46cf-ad6d-2f5a3dd7dfe7', '7a84f2d7-e30d-4d3a-a245-f15053b6ca3a', 4, 'example', false),
('78724776-0ae3-43e9-a0d9-d32e5189f281', '7a84f2d7-e30d-4d3a-a245-f15053b6ca3a', 5, 'example', false),
('4b8395c0-d55a-4741-a156-09f8f9336512', '7a84f2d7-e30d-4d3a-a245-f15053b6ca3a', 6, 'example', false),
('03551001-580b-4de7-a2d3-a03f0129589a', '7a84f2d7-e30d-4d3a-a245-f15053b6ca3a', 1, 'practice', false),
('91c4c29d-aa9f-4e00-a927-c0cb920418d0', '7a84f2d7-e30d-4d3a-a245-f15053b6ca3a', 2, 'practice', false),
('205bfb64-4a6b-4e2c-ab01-6de13b18eca2', '7a84f2d7-e30d-4d3a-a245-f15053b6ca3a', 3, 'practice', false),
('a6c0f95c-8c54-40ee-a123-de270b3e9351', '7a84f2d7-e30d-4d3a-a245-f15053b6ca3a', 4, 'practice', false),
('27a0f1b0-2704-424a-a280-7582f28c0761', 'dc4a8060-5a79-4c0f-a69d-745a5a8b42d8', 1, 'example', false),
('7fe49261-95e6-497f-a845-b2d6a14cadaa', 'dc4a8060-5a79-4c0f-a69d-745a5a8b42d8', 1, 'practice', false),
('d297c211-2bd7-401a-a4d9-09a20229b35b', 'dc4a8060-5a79-4c0f-a69d-745a5a8b42d8', 2, 'practice', false),
('e6901bff-ec4f-4f9b-aaed-4855eb244dec', '25de8e46-5e97-4886-aecc-87e27d5b0732', 1, 'example', false),
('2c66a800-2bc4-4e69-a395-65deb67ec05a', '25de8e46-5e97-4886-aecc-87e27d5b0732', 2, 'example', false),
('1bf17488-65f2-419e-a87a-4846a765ee61', '25de8e46-5e97-4886-aecc-87e27d5b0732', 3, 'example', false)
ON CONFLICT (id) DO NOTHING;

-- ===== 20260320063732_3707d82f-648c-4021-8f64-53f5e5a6cac9.sql =====
INSERT INTO public.questions (id, chapter_id, question_number, question_type, is_essential) VALUES
('00f11819-c072-4a44-a5a2-b07eb1084380', '25de8e46-5e97-4886-aecc-87e27d5b0732', 4, 'example', false),
('e0dafcc2-cb86-4a8a-aba3-25f37a3e2695', '25de8e46-5e97-4886-aecc-87e27d5b0732', 5, 'example', false),
('701adb55-b365-4d97-a400-d52a710990ab', '25de8e46-5e97-4886-aecc-87e27d5b0732', 6, 'example', false),
('26728cbf-8aff-483f-a6a3-0b952828c896', '25de8e46-5e97-4886-aecc-87e27d5b0732', 7, 'example', false),
('e68b5840-f0b3-462f-aa35-64a7aaf6a11b', '25de8e46-5e97-4886-aecc-87e27d5b0732', 8, 'example', false),
('5fd1c95e-aef7-459a-a051-3f8f0d752278', '25de8e46-5e97-4886-aecc-87e27d5b0732', 9, 'example', false),
('7ab7fed1-5012-48b5-ad10-87afd9122e9c', '25de8e46-5e97-4886-aecc-87e27d5b0732', 10, 'example', false),
('d18dbbfb-8c2f-46d8-a864-1f71296b6949', '25de8e46-5e97-4886-aecc-87e27d5b0732', 1, 'practice', false),
('db1ccdf4-e7bd-403a-a222-9b09503f69d1', '25de8e46-5e97-4886-aecc-87e27d5b0732', 2, 'practice', false),
('003b87ab-36fd-43f9-a93f-5ca01629f0da', '25de8e46-5e97-4886-aecc-87e27d5b0732', 3, 'practice', false),
('b1e902cb-0beb-451a-ab56-75c096b78271', '25de8e46-5e97-4886-aecc-87e27d5b0732', 4, 'practice', false),
('14bbb520-806f-4bd6-a6c5-4b08368a21a1', '25de8e46-5e97-4886-aecc-87e27d5b0732', 5, 'practice', false),
('f5ea8e94-4b51-47d0-ae46-b2880e054283', '25de8e46-5e97-4886-aecc-87e27d5b0732', 6, 'practice', false),
('d3d2f003-75ed-4ad2-acf3-2bc143fed116', 'bf85b9f0-e98c-4b87-ae0c-45995a30ea48', 1, 'example', false),
('9716e71f-07aa-40b0-a0af-5231106fd1d8', 'bf85b9f0-e98c-4b87-ae0c-45995a30ea48', 2, 'example', false),
('37e409dc-a894-42eb-a71c-25309e363fa8', 'bf85b9f0-e98c-4b87-ae0c-45995a30ea48', 3, 'example', false),
('0aad6910-6501-4225-a2d6-a226ff88f155', 'bf85b9f0-e98c-4b87-ae0c-45995a30ea48', 4, 'example', false),
('7adcc99d-7cda-4221-a9a0-de298be19f3e', 'bf85b9f0-e98c-4b87-ae0c-45995a30ea48', 5, 'example', false),
('25886170-cc7e-4363-a311-516199e4f642', 'bf85b9f0-e98c-4b87-ae0c-45995a30ea48', 1, 'practice', false),
('4fadeea0-4bab-4e39-a76c-259b07ff4730', 'bf85b9f0-e98c-4b87-ae0c-45995a30ea48', 2, 'practice', false),
('7e809b7b-2db9-47ed-a471-90330ff67406', 'bf85b9f0-e98c-4b87-ae0c-45995a30ea48', 3, 'practice', false),
('56eecc75-2aa6-42e7-ada0-4022ce4ff875', 'bf85b9f0-e98c-4b87-ae0c-45995a30ea48', 4, 'practice', false),
('ba689888-6312-43f3-ad89-71d695fead81', 'bf85b9f0-e98c-4b87-ae0c-45995a30ea48', 5, 'practice', false),
('2ad91eae-c152-4b72-a4b7-0a1e21b20812', 'bf85b9f0-e98c-4b87-ae0c-45995a30ea48', 6, 'practice', false),
('db708794-55f2-4e3d-a0b1-bbb7793507d1', 'e005476d-2944-4437-a85d-6f2a9dd617fe', 1, 'example', false),
('9fba275b-6942-4f31-ae66-3f992dc6cd79', 'e005476d-2944-4437-a85d-6f2a9dd617fe', 2, 'example', false),
('d8a37ff2-342b-46f4-a631-c35cd7ede876', 'e005476d-2944-4437-a85d-6f2a9dd617fe', 3, 'example', false),
('d4dcee99-556a-4a9c-abbf-5fdabf0c2665', 'e005476d-2944-4437-a85d-6f2a9dd617fe', 4, 'example', false),
('5f8bf4c5-19e7-490e-a770-fe411a1678a9', 'e005476d-2944-4437-a85d-6f2a9dd617fe', 1, 'practice', false),
('44a4587f-7c02-4a23-a271-c356caa654de', 'e005476d-2944-4437-a85d-6f2a9dd617fe', 2, 'practice', false),
('88a9a0d6-1fa6-475e-a352-5962579dfab9', 'e005476d-2944-4437-a85d-6f2a9dd617fe', 3, 'practice', false),
('f1cea639-f6c1-48bb-a078-08a3e5399f33', 'e005476d-2944-4437-a85d-6f2a9dd617fe', 4, 'practice', false),
('a1df47ec-b5aa-4201-a231-0d03adab921c', 'e005476d-2944-4437-a85d-6f2a9dd617fe', 5, 'practice', false),
('62c670f3-4bad-4c2c-aa3e-cc50f1437164', '6fcdd99c-4559-49fe-a238-70ea32d26c46', 1, 'example', false),
('b2c57403-9d0f-4220-af45-f1724c065dff', '6fcdd99c-4559-49fe-a238-70ea32d26c46', 2, 'example', false),
('5684ef47-84d6-4354-a7cb-937151aea645', '6fcdd99c-4559-49fe-a238-70ea32d26c46', 3, 'example', false),
('c284d9d9-1bac-47f5-a2d5-67ca7d7c13a4', '6fcdd99c-4559-49fe-a238-70ea32d26c46', 4, 'example', false),
('71bb6e41-f3aa-48b1-ad43-528bc7854e7b', '6fcdd99c-4559-49fe-a238-70ea32d26c46', 5, 'example', false),
('b8d14bec-dc78-46d3-aeaa-0edd813facf7', '6fcdd99c-4559-49fe-a238-70ea32d26c46', 6, 'example', false),
('c4a37354-e2c9-498a-ae78-20ede305d756', '6fcdd99c-4559-49fe-a238-70ea32d26c46', 1, 'practice', false),
('24e3fb1a-54bb-43eb-a6dc-14c0edd2291b', '6fcdd99c-4559-49fe-a238-70ea32d26c46', 2, 'practice', false),
('9340caa1-96b2-4dc1-a30a-d6378e77ff99', '6fcdd99c-4559-49fe-a238-70ea32d26c46', 3, 'practice', false),
('927bdb86-11df-4e40-a950-ec79bfd9e4f5', '6fcdd99c-4559-49fe-a238-70ea32d26c46', 4, 'practice', false),
('943a719f-a4fd-4c06-af7d-574f8b23aa57', '6fcdd99c-4559-49fe-a238-70ea32d26c46', 5, 'practice', false),
('9d9c5268-db26-4211-a168-72f89ab1b12f', '6fcdd99c-4559-49fe-a238-70ea32d26c46', 6, 'practice', false),
('6e004a6f-a980-4a18-af0c-d667818a074c', '6fcdd99c-4559-49fe-a238-70ea32d26c46', 7, 'practice', false),
('603a869b-7bc2-4f7d-acc2-ad40c6e9c79c', '6fcdd99c-4559-49fe-a238-70ea32d26c46', 8, 'practice', false),
('0dfe179d-78c0-4ca1-a8b2-c8338e0ddd8e', '6fcdd99c-4559-49fe-a238-70ea32d26c46', 9, 'practice', false),
('8469aa5d-2471-4f47-aabb-78d462330246', '6fcdd99c-4559-49fe-a238-70ea32d26c46', 10, 'practice', false),
('719484d5-ab6e-42a7-acf5-8b79f39c2001', '6fcdd99c-4559-49fe-a238-70ea32d26c46', 11, 'practice', false),
('2aceba5e-ae6a-4008-a2e1-3d2d349c8f60', '6fcdd99c-4559-49fe-a238-70ea32d26c46', 12, 'practice', false),
('84f45992-fd54-478f-ae66-ec9f15a9ba84', '6fcdd99c-4559-49fe-a238-70ea32d26c46', 13, 'practice', false),
('1b76f32f-7cbe-4d65-a9f0-2f6b9a1d7541', '6fcdd99c-4559-49fe-a238-70ea32d26c46', 14, 'practice', false),
('4c387f47-20c2-4c43-a8c7-9ccb085a7b9e', '6fcdd99c-4559-49fe-a238-70ea32d26c46', 15, 'practice', false),
('10636793-1184-400b-a279-99ceb22c8d5e', '6fcdd99c-4559-49fe-a238-70ea32d26c46', 16, 'practice', false),
('2320a433-c0fb-4f55-a457-7f77f1280c17', '6fcdd99c-4559-49fe-a238-70ea32d26c46', 17, 'practice', false),
('19cc2e1b-99d5-4005-a27f-16931ca1cb47', '6fcdd99c-4559-49fe-a238-70ea32d26c46', 18, 'practice', false),
('fce46dad-b9a8-4241-a2f4-0169aa60ba25', '6fcdd99c-4559-49fe-a238-70ea32d26c46', 19, 'practice', false),
('0766b996-74dc-4c0b-a0ed-98c87c321a4c', '6fcdd99c-4559-49fe-a238-70ea32d26c46', 20, 'practice', false)
ON CONFLICT (id) DO NOTHING;

-- ===== 20260320070002_a58af44e-eec1-488e-89bc-21660683fc07.sql =====
DELETE FROM questions WHERE chapter_id IN (SELECT id FROM chapters WHERE book_id = 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5');
DELETE FROM questions WHERE chapter_id IN (SELECT id FROM chapters WHERE book_id = '4543e179-d6f1-478d-a7dd-3ee02751cc1a');
DELETE FROM chapters WHERE book_id = 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5';
DELETE FROM chapters WHERE book_id = '4543e179-d6f1-478d-a7dd-3ee02751cc1a';
INSERT INTO chapters (id, book_id, title, chapter_number, display_order) VALUES ('68a27164-6518-5a57-890a-f6a7dc93d0ed', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '재무보고를 위한 개념체계', 1, 1);
INSERT INTO chapters (id, book_id, title, chapter_number, display_order) VALUES ('de0f1536-d319-5723-867a-92619574f04f', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '현금과 수취채권', 2, 2);
INSERT INTO chapters (id, book_id, title, chapter_number, display_order) VALUES ('a924ff9c-f142-56be-89a7-7e1ffce68ceb', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '재고자산과 농립어업자산', 3, 3);
INSERT INTO chapters (id, book_id, title, chapter_number, display_order) VALUES ('1b409d08-511f-58e0-9c87-c65d72c42555', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '유형자산과 투자부동산', 4, 4);
INSERT INTO chapters (id, book_id, title, chapter_number, display_order) VALUES ('2dbd6f50-8f58-5158-91c0-571e5eed5788', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '차입원가의 자본화', 5, 5);
INSERT INTO chapters (id, book_id, title, chapter_number, display_order) VALUES ('9543e664-6f7c-51f7-9bce-1c163bcfb06e', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '무형자산과 기타자산', 6, 6);
INSERT INTO chapters (id, book_id, title, chapter_number, display_order) VALUES ('9ce442c4-ba68-5368-9071-a4c782d19b20', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '금융부채와 사채', 7, 7);
INSERT INTO chapters (id, book_id, title, chapter_number, display_order) VALUES ('ca192efa-dd52-5602-9d8f-a6ca83250b7a', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '충당부채와 종업원급여', 8, 8);
INSERT INTO chapters (id, book_id, title, chapter_number, display_order) VALUES ('ad09d870-95c9-56d8-a1c2-8416e62cc494', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '자본', 9, 9);
INSERT INTO chapters (id, book_id, title, chapter_number, display_order) VALUES ('3ba8d5f1-cd18-5a6b-9f3f-204e958fe041', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '수익인식', 10, 10);
INSERT INTO chapters (id, book_id, title, chapter_number, display_order) VALUES ('386664d7-81d4-5da3-8503-74242edc5b1a', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '투자목적 금융자산', 11, 11);
INSERT INTO chapters (id, book_id, title, chapter_number, display_order) VALUES ('5515526d-3f23-5967-8c70-03b40aecc329', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '복합금융상품', 12, 12);
INSERT INTO chapters (id, book_id, title, chapter_number, display_order) VALUES ('6a64d9fd-4cb3-50e1-bc18-319e6fccf2d8', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '주식기준보상', 13, 13);
INSERT INTO chapters (id, book_id, title, chapter_number, display_order) VALUES ('d0c0118e-5833-586c-81fb-fb943d54e44d', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '주당이익', 14, 14);
INSERT INTO chapters (id, book_id, title, chapter_number, display_order) VALUES ('ea5c484a-0825-5919-8fd4-0560e236ff78', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '리스', 15, 15);
INSERT INTO chapters (id, book_id, title, chapter_number, display_order) VALUES ('56a35437-12b9-5174-9ada-14645aefa6b1', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '법인세 회계', 16, 16);
INSERT INTO chapters (id, book_id, title, chapter_number, display_order) VALUES ('0e1e6d77-4087-519b-af68-c339c1e8d169', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '회계변경과 오류수정', 17, 17);
INSERT INTO chapters (id, book_id, title, chapter_number, display_order) VALUES ('6c2304b5-37a0-54a2-a997-882bdba38d9a', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '현금흐름표', 18, 18);
INSERT INTO chapters (id, book_id, title, chapter_number, display_order) VALUES ('0a37b5f8-1fa5-52e5-8a10-a3c36e451805', 'cb92a72a-7b2e-49b3-ba83-faf988d41fc5', '재무회계의 기타사항', 19, 19);
INSERT INTO chapters (id, book_id, title, chapter_number, display_order) VALUES ('333e61d8-09f8-59a1-b102-2a3210327bd4', '4543e179-d6f1-478d-a7dd-3ee02751cc1a', '환율변동효과와 파생상품', 20, 20);
INSERT INTO chapters (id, book_id, title, chapter_number, display_order) VALUES ('42158099-c559-5ade-9a9c-3db8c2f5142f', '4543e179-d6f1-478d-a7dd-3ee02751cc1a', '관계기업과 공동기업투자', 21, 21);
INSERT INTO chapters (id, book_id, title, chapter_number, display_order) VALUES ('36ced8ae-c1f9-5a22-bae7-529f3f4ead1e', '4543e179-d6f1-478d-a7dd-3ee02751cc1a', '사업결합과 합병회계', 22, 22);
INSERT INTO chapters (id, book_id, title, chapter_number, display_order) VALUES ('bf5f9234-22f8-520f-8988-16cd9a9f3879', '4543e179-d6f1-478d-a7dd-3ee02751cc1a', '연결회계', 23, 23);

-- ===== 20260320070359_a1ad45f0-37d1-4ab6-b9ef-4edc54d1cf6c.sql =====
INSERT INTO questions (id, chapter_id, question_number, question_type, topic, exam_year, is_essential, correct_answer) SELECT * FROM (VALUES
('7d960416-dad3-55a9-8f4d-a3a770911170'::uuid, '68a27164-6518-5a57-890a-f6a7dc93d0ed'::uuid, 1, 'example', '회계의 정의', NULL::text, false, NULL::int),
('f16a3220-5f19-517a-8516-ca2d4610e7aa'::uuid, '68a27164-6518-5a57-890a-f6a7dc93d0ed'::uuid, 2, 'example', '회계의 사회적 기능', NULL, false, NULL),
('e69f9bb9-549c-5ec5-ac7e-f3fe806c189b'::uuid, '68a27164-6518-5a57-890a-f6a7dc93d0ed'::uuid, 3, 'example', 'GAAP과 K-IFRS', NULL, false, NULL)
) AS t(id, chapter_id, question_number, question_type, topic, exam_year, is_essential, correct_answer)
WHERE false;

-- ===== 20260322040201_151a7350-d229-47b4-af8e-be1865d83392.sql =====

-- Update seed attempts to spread across recent days including today
-- Spread each user's attempts across recent 7 days with some today
UPDATE attempts
SET attempted_at = now() - (random() * interval '6 days')
WHERE user_id::text LIKE 'dddd%';

-- ===== 20260322040303_09a82b73-facd-440a-942e-028f23fe5e0b.sql =====

-- Move some seed attempts to today so "오늘 풀이 수" ranking shows data
UPDATE attempts
SET attempted_at = now() - (random() * interval '12 hours')
WHERE user_id::text LIKE 'dddd%'
AND id IN (
  SELECT id FROM attempts 
  WHERE user_id::text LIKE 'dddd%' 
  ORDER BY random() 
  LIMIT 40
);

-- ===== 20260322041348_fa7122ff-d2a9-4b42-8d76-1082339ad9eb.sql =====

-- Remove seed attempts for fake users
DELETE FROM attempts WHERE user_id::text LIKE 'dddd%';

-- Remove seed profiles for fake users
DELETE FROM profiles WHERE id::text LIKE 'dddd%';

-- ===== 20260322043515_e1395585-cac4-42b6-a215-5559ddc3e633.sql =====
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;

-- ===== 20260323060425_a75cf0ba-7a68-4484-a7fb-1b8e1816baae.sql =====
UPDATE profiles SET display_name = '수험생A' WHERE id = 'a4c8631b-5197-48f1-beb1-6ab9fe40dbc4';
UPDATE profiles SET display_name = '수험생B' WHERE id = '226727a5-2e77-45cc-8ab3-36bd76c9f5d7';
UPDATE profiles SET display_name = '수험생C' WHERE id = '772a90dc-5280-4795-ac36-a7a67993e2dc';

-- ===== 20260323062323_be1e4aba-90ae-4520-861a-83f64ad4ce7b.sql =====
-- 강경태 세무회계연습(소득세법·부가세법·상증세법) 부가가치세 1~5단원 topic 업데이트

-- Ch1: 부가가치세 및 매출세액 계산구조
UPDATE questions SET topic = '매출세액의 계산구조' WHERE chapter_id = 'dfbdf66a-5b9c-52d6-915f-d3dc613e13dd' AND question_number = 1;
UPDATE questions SET topic = '면세와 과세 구분' WHERE chapter_id = 'dfbdf66a-5b9c-52d6-915f-d3dc613e13dd' AND question_number = 2;
UPDATE questions SET topic = '재화·용역의 실질적 공급' WHERE chapter_id = 'dfbdf66a-5b9c-52d6-915f-d3dc613e13dd' AND question_number = 3;
UPDATE questions SET topic = '실질적 공급과 부수공급' WHERE chapter_id = 'dfbdf66a-5b9c-52d6-915f-d3dc613e13dd' AND question_number = 4;
UPDATE questions SET topic = '무상공급·저가공급' WHERE chapter_id = 'dfbdf66a-5b9c-52d6-915f-d3dc613e13dd' AND question_number = 5;
UPDATE questions SET topic = '간주공급' WHERE chapter_id = 'dfbdf66a-5b9c-52d6-915f-d3dc613e13dd' AND question_number = 6;
UPDATE questions SET topic = '간주공급 - 직매장 반출' WHERE chapter_id = 'dfbdf66a-5b9c-52d6-915f-d3dc613e13dd' AND question_number = 7;
UPDATE questions SET topic = '간주공급' WHERE chapter_id = 'dfbdf66a-5b9c-52d6-915f-d3dc613e13dd' AND question_number = 8;
UPDATE questions SET topic = '간주공급 - 실전종합문제' WHERE chapter_id = 'dfbdf66a-5b9c-52d6-915f-d3dc613e13dd' AND question_number = 9;
UPDATE questions SET topic = '공급시기 - 할부판매와 중간지급조건부 공급' WHERE chapter_id = 'dfbdf66a-5b9c-52d6-915f-d3dc613e13dd' AND question_number = 10;
UPDATE questions SET topic = '공급시기' WHERE chapter_id = 'dfbdf66a-5b9c-52d6-915f-d3dc613e13dd' AND question_number = 11;
UPDATE questions SET topic = '공급시기 - 실전문제' WHERE chapter_id = 'dfbdf66a-5b9c-52d6-915f-d3dc613e13dd' AND question_number = 12;
UPDATE questions SET topic = '영세율과 세금계산서' WHERE chapter_id = 'dfbdf66a-5b9c-52d6-915f-d3dc613e13dd' AND question_number = 13;
UPDATE questions SET topic = '영세율과 세금계산서' WHERE chapter_id = 'dfbdf66a-5b9c-52d6-915f-d3dc613e13dd' AND question_number = 14;
UPDATE questions SET topic = '위탁판매수출·외국인도수출' WHERE chapter_id = 'dfbdf66a-5b9c-52d6-915f-d3dc613e13dd' AND question_number = 15;
UPDATE questions SET topic = '부동산의 공급' WHERE chapter_id = 'dfbdf66a-5b9c-52d6-915f-d3dc613e13dd' AND question_number = 16;
UPDATE questions SET topic = '부동산의 공급 - 실전문제' WHERE chapter_id = 'dfbdf66a-5b9c-52d6-915f-d3dc613e13dd' AND question_number = 17;
UPDATE questions SET topic = '부동산임대' WHERE chapter_id = 'dfbdf66a-5b9c-52d6-915f-d3dc613e13dd' AND question_number = 18;
UPDATE questions SET topic = '겸용주택' WHERE chapter_id = 'dfbdf66a-5b9c-52d6-915f-d3dc613e13dd' AND question_number = 19;
UPDATE questions SET topic = '겸용주택 - 실전문제' WHERE chapter_id = 'dfbdf66a-5b9c-52d6-915f-d3dc613e13dd' AND question_number = 20;
UPDATE questions SET topic = '대손세액공제' WHERE chapter_id = 'dfbdf66a-5b9c-52d6-915f-d3dc613e13dd' AND question_number = 21;
UPDATE questions SET topic = '대손세액공제' WHERE chapter_id = 'dfbdf66a-5b9c-52d6-915f-d3dc613e13dd' AND question_number = 22;
UPDATE questions SET topic = '매출세액 - 실전문제' WHERE chapter_id = 'dfbdf66a-5b9c-52d6-915f-d3dc613e13dd' AND question_number = 23;
UPDATE questions SET topic = '매출세액 - 실전문제' WHERE chapter_id = 'dfbdf66a-5b9c-52d6-915f-d3dc613e13dd' AND question_number = 24;
UPDATE questions SET topic = '매출세액 - 실전문제' WHERE chapter_id = 'dfbdf66a-5b9c-52d6-915f-d3dc613e13dd' AND question_number = 25;

-- Ch2: 매입세액
UPDATE questions SET topic = '매입세액공제액 - 계산구조' WHERE chapter_id = '4339a9c1-c81b-5be0-ae84-b00a33f2ac51' AND question_number = 1;
UPDATE questions SET topic = '매입세액공제액 - 계산구조' WHERE chapter_id = '4339a9c1-c81b-5be0-ae84-b00a33f2ac51' AND question_number = 2;
UPDATE questions SET topic = '의제매입세액' WHERE chapter_id = '4339a9c1-c81b-5be0-ae84-b00a33f2ac51' AND question_number = 3;
UPDATE questions SET topic = '의제매입세액 - 겸영사업자' WHERE chapter_id = '4339a9c1-c81b-5be0-ae84-b00a33f2ac51' AND question_number = 4;
UPDATE questions SET topic = '의제매입세액' WHERE chapter_id = '4339a9c1-c81b-5be0-ae84-b00a33f2ac51' AND question_number = 5;
UPDATE questions SET topic = '의제매입세액 - 겸영사업자의 정산' WHERE chapter_id = '4339a9c1-c81b-5be0-ae84-b00a33f2ac51' AND question_number = 6;
UPDATE questions SET topic = '의제매입세액 - 실전문제' WHERE chapter_id = '4339a9c1-c81b-5be0-ae84-b00a33f2ac51' AND question_number = 7;
UPDATE questions SET topic = '의제매입세액 - 실전문제' WHERE chapter_id = '4339a9c1-c81b-5be0-ae84-b00a33f2ac51' AND question_number = 8;
UPDATE questions SET topic = '의제매입세액' WHERE chapter_id = '4339a9c1-c81b-5be0-ae84-b00a33f2ac51' AND question_number = 9;
UPDATE questions SET topic = '의제매입세액' WHERE chapter_id = '4339a9c1-c81b-5be0-ae84-b00a33f2ac51' AND question_number = 10;
UPDATE questions SET topic = '재활용폐자원 등에 대한 매입세액공제' WHERE chapter_id = '4339a9c1-c81b-5be0-ae84-b00a33f2ac51' AND question_number = 11;
UPDATE questions SET topic = '매입세액 - 실전문제' WHERE chapter_id = '4339a9c1-c81b-5be0-ae84-b00a33f2ac51' AND question_number = 12;
UPDATE questions SET topic = '매입세액 - 실전문제' WHERE chapter_id = '4339a9c1-c81b-5be0-ae84-b00a33f2ac51' AND question_number = 13;
UPDATE questions SET topic = '매입세액 - 실전문제' WHERE chapter_id = '4339a9c1-c81b-5be0-ae84-b00a33f2ac51' AND question_number = 14;

-- Ch3: 겸영사업자의 안분계산
UPDATE questions SET topic = '면세전용과 공통사용재화의 공급' WHERE chapter_id = '171b0f03-b707-5913-b934-18eea40af43f' AND question_number = 1;
UPDATE questions SET topic = '면세사업용 재화의 과세사업 전환' WHERE chapter_id = '171b0f03-b707-5913-b934-18eea40af43f' AND question_number = 2;
UPDATE questions SET topic = '면세전용과 과세전환' WHERE chapter_id = '171b0f03-b707-5913-b934-18eea40af43f' AND question_number = 3;
UPDATE questions SET topic = '공통매입세액의 안분계산' WHERE chapter_id = '171b0f03-b707-5913-b934-18eea40af43f' AND question_number = 4;
UPDATE questions SET topic = '공통매입세액의 안분계산' WHERE chapter_id = '171b0f03-b707-5913-b934-18eea40af43f' AND question_number = 5;
UPDATE questions SET topic = '공통매입세액의 안분계산' WHERE chapter_id = '171b0f03-b707-5913-b934-18eea40af43f' AND question_number = 6;
UPDATE questions SET topic = '공통매입세액의 정산' WHERE chapter_id = '171b0f03-b707-5913-b934-18eea40af43f' AND question_number = 7;
UPDATE questions SET topic = '공통매입세액의 정산 - 실전문제' WHERE chapter_id = '171b0f03-b707-5913-b934-18eea40af43f' AND question_number = 8;
UPDATE questions SET topic = '공통매입세액의 정산' WHERE chapter_id = '171b0f03-b707-5913-b934-18eea40af43f' AND question_number = 9;
UPDATE questions SET topic = '공통매입세액의 정산' WHERE chapter_id = '171b0f03-b707-5913-b934-18eea40af43f' AND question_number = 10;
UPDATE questions SET topic = '공통매입세액의 정산' WHERE chapter_id = '171b0f03-b707-5913-b934-18eea40af43f' AND question_number = 11;
UPDATE questions SET topic = '공통매입세액의 정산 - 실전문제' WHERE chapter_id = '171b0f03-b707-5913-b934-18eea40af43f' AND question_number = 12;
UPDATE questions SET topic = '공통매입세액의 정산' WHERE chapter_id = '171b0f03-b707-5913-b934-18eea40af43f' AND question_number = 13;
UPDATE questions SET topic = '공통매입세액의 정산' WHERE chapter_id = '171b0f03-b707-5913-b934-18eea40af43f' AND question_number = 14;
UPDATE questions SET topic = '과세사업전환 매입세액과 그 정산' WHERE chapter_id = '171b0f03-b707-5913-b934-18eea40af43f' AND question_number = 15;
UPDATE questions SET topic = '겸영사업자 - 실전문제(건설업자)' WHERE chapter_id = '171b0f03-b707-5913-b934-18eea40af43f' AND question_number = 16;
UPDATE questions SET topic = '겸영사업자 - 실전문제' WHERE chapter_id = '171b0f03-b707-5913-b934-18eea40af43f' AND question_number = 17;
UPDATE questions SET topic = '겸영사업자 - 실전문제' WHERE chapter_id = '171b0f03-b707-5913-b934-18eea40af43f' AND question_number = 18;
UPDATE questions SET topic = '겸영사업자 - 실전문제' WHERE chapter_id = '171b0f03-b707-5913-b934-18eea40af43f' AND question_number = 19;
UPDATE questions SET topic = '겸영사업자 - 실전문제' WHERE chapter_id = '171b0f03-b707-5913-b934-18eea40af43f' AND question_number = 20;
UPDATE questions SET topic = '겸영사업자 - 실전문제' WHERE chapter_id = '171b0f03-b707-5913-b934-18eea40af43f' AND question_number = 21;

-- Ch4: 차가감납부세액
UPDATE questions SET topic = '차가감납부세액' WHERE chapter_id = '3be66c2b-146a-5088-a96d-e9d6e531f738' AND question_number = 1;
UPDATE questions SET topic = '가산세' WHERE chapter_id = '3be66c2b-146a-5088-a96d-e9d6e531f738' AND question_number = 2;
UPDATE questions SET topic = '가산세 - 종합문제' WHERE chapter_id = '3be66c2b-146a-5088-a96d-e9d6e531f738' AND question_number = 3;
UPDATE questions SET topic = '가산세' WHERE chapter_id = '3be66c2b-146a-5088-a96d-e9d6e531f738' AND question_number = 4;
UPDATE questions SET topic = '가산세 - 실전문제' WHERE chapter_id = '3be66c2b-146a-5088-a96d-e9d6e531f738' AND question_number = 5;
UPDATE questions SET topic = '가산세 - 실전문제' WHERE chapter_id = '3be66c2b-146a-5088-a96d-e9d6e531f738' AND question_number = 6;
UPDATE questions SET topic = '가산세 - 실전문제' WHERE chapter_id = '3be66c2b-146a-5088-a96d-e9d6e531f738' AND question_number = 7;
UPDATE questions SET topic = '대리납부세액' WHERE chapter_id = '3be66c2b-146a-5088-a96d-e9d6e531f738' AND question_number = 8;

-- Ch5: 간이과세
UPDATE questions SET topic = '간이과세자' WHERE chapter_id = '673e8f18-27c5-5154-8058-724bb7d2b1ef' AND question_number = 1;
UPDATE questions SET topic = '간이과세자' WHERE chapter_id = '673e8f18-27c5-5154-8058-724bb7d2b1ef' AND question_number = 2;
UPDATE questions SET topic = '간이과세자' WHERE chapter_id = '673e8f18-27c5-5154-8058-724bb7d2b1ef' AND question_number = 3;
UPDATE questions SET topic = '간이과세자' WHERE chapter_id = '673e8f18-27c5-5154-8058-724bb7d2b1ef' AND question_number = 4;
UPDATE questions SET topic = '간이과세자 - 실전문제' WHERE chapter_id = '673e8f18-27c5-5154-8058-724bb7d2b1ef' AND question_number = 5;
UPDATE questions SET topic = '재고매입세액과 재고납부세액' WHERE chapter_id = '673e8f18-27c5-5154-8058-724bb7d2b1ef' AND question_number = 6;
UPDATE questions SET topic = '재고매입세액과 재고납부세액 - 실전문제' WHERE chapter_id = '673e8f18-27c5-5154-8058-724bb7d2b1ef' AND question_number = 7;
UPDATE questions SET topic = '간이과세자 - 실전문제' WHERE chapter_id = '673e8f18-27c5-5154-8058-724bb7d2b1ef' AND question_number = 8;
UPDATE questions SET topic = '간이과세자 - 실전문제' WHERE chapter_id = '673e8f18-27c5-5154-8058-724bb7d2b1ef' AND question_number = 9;
UPDATE questions SET topic = '간이과세자 - 실전문제' WHERE chapter_id = '673e8f18-27c5-5154-8058-724bb7d2b1ef' AND question_number = 10;

-- ===== 20260323063123_1ab3a175-8564-48e4-a730-6668142ada25.sql =====
UPDATE chapters SET title = '부가가치세법 - 1. 매출세액 계산구조' WHERE id = 'dfbdf66a-5b9c-52d6-915f-d3dc613e13dd';
UPDATE chapters SET title = '부가가치세법 - 2. 매입세액' WHERE id = '4339a9c1-c81b-5be0-ae84-b00a33f2ac51';
UPDATE chapters SET title = '부가가치세법 - 3. 겸영사업자의 안분계산' WHERE id = '171b0f03-b707-5913-b934-18eea40af43f';
UPDATE chapters SET title = '부가가치세법 - 4. 차가감납부세액' WHERE id = '3be66c2b-146a-5088-a96d-e9d6e531f738';
UPDATE chapters SET title = '부가가치세법 - 5. 간이과세' WHERE id = '673e8f18-27c5-5154-8058-724bb7d2b1ef';

-- ===== 20260323063302_49333eb7-0a5e-4041-b17d-5722dac2eec9.sql =====
UPDATE chapters SET chapter_number = 1, title = '소득세법 - 1. 이자소득 및 배당소득' WHERE id = 'e464780c-dd35-5c9d-b15f-3da8c4bc2abd';
UPDATE chapters SET chapter_number = 2, title = '소득세법 - 2. 사업소득' WHERE id = '8cc4df33-6f4c-584a-9cf0-6e527f897a37';
UPDATE chapters SET chapter_number = 3, title = '소득세법 - 3. 근로소득' WHERE id = '4b9aeb1d-a035-5b5d-8da0-95b8164b2584';
UPDATE chapters SET chapter_number = 4, title = '소득세법 - 4. 연금소득, 기타소득' WHERE id = '6d53a3f2-1d36-5634-b20f-3069b63dd85e';
UPDATE chapters SET chapter_number = 5, title = '소득세법 - 5. 소득금액 계산의 특례' WHERE id = 'f2c88e9b-8623-5ff0-9804-395822c68215';
UPDATE chapters SET chapter_number = 6, title = '소득세법 - 6. 종합소득과세표준의 계산' WHERE id = '84fef968-2455-5e3b-9a1d-9b2ee8ce047f';
UPDATE chapters SET chapter_number = 7, title = '소득세법 - 7. 종합소득 차감납부세액의 계산' WHERE id = '0a14c943-7bf4-5f33-931a-6875c0ec42c8';
UPDATE chapters SET chapter_number = 8, title = '소득세법 - 8. 퇴직소득' WHERE id = '9feb0adc-ba5d-5059-bb76-d6a12c1358a1';
UPDATE chapters SET chapter_number = 9, title = '소득세법 - 9. 양도소득' WHERE id = '233a733e-8067-5d1a-acc6-16d9b4c62055';
UPDATE chapters SET chapter_number = 10, title = '소득세법 - 10. 동업기업에 대한 조세특례' WHERE id = 'c95b9245-7226-5486-b3b4-f0e99c74a65d';
