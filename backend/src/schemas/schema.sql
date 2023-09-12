CREATE TABLE IF NOT EXISTS public.backsides
(
    backside_id uuid NOT NULL DEFAULT gen_random_uuid(),
    flashcard_id uuid NOT NULL,
    content_text character varying COLLATE pg_catalog."default",
    CONSTRAINT backsides_pkey PRIMARY KEY (backside_id)
);

CREATE TABLE IF NOT EXISTS public.flashcards
(
    flashcard_id uuid NOT NULL DEFAULT gen_random_uuid(),
    stack_id uuid NOT NULL,
    learning_status smallint NOT NULL,
    CONSTRAINT flashcards_pkey PRIMARY KEY (flashcard_id)
);

CREATE TABLE IF NOT EXISTS public.frontsides
(
    frontside_id uuid NOT NULL DEFAULT gen_random_uuid(),
    flashcard_id uuid NOT NULL,
    content_text character varying COLLATE pg_catalog."default",
    CONSTRAINT frontsides_pkey PRIMARY KEY (frontside_id)
);

CREATE TABLE IF NOT EXISTS public.peers
(
    peer_id uuid NOT NULL DEFAULT gen_random_uuid(),
    number_of_members smallint NOT NULL,
    peer_name character varying COLLATE pg_catalog."default",
    CONSTRAINT peers_peer_id_key UNIQUE (peer_id)
);

CREATE TABLE IF NOT EXISTS public.stacks
(
    stack_id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    stack_name character varying COLLATE pg_catalog."default" DEFAULT 'stack'::character varying,
    number_of_cards smallint,
    number_of_learned_cards smallint,
    number_of_unlearned_cards smallint,
    topic character varying COLLATE pg_catalog."default" NOT NULL,
    total_downloads integer,
    creator character varying COLLATE pg_catalog."default" NOT NULL,
    created_at date NOT NULL,
    last_learned_at date NOT NULL,
    CONSTRAINT stacks_pkey PRIMARY KEY (stack_id)
);

CREATE TABLE IF NOT EXISTS public.topics
(
    tag_id uuid NOT NULL DEFAULT gen_random_uuid(),
    stack_id uuid,
    topic character varying COLLATE pg_catalog."default",
    CONSTRAINT topics_pkey PRIMARY KEY (tag_id)
);

CREATE TABLE IF NOT EXISTS public.users
(
    user_id uuid NOT NULL DEFAULT gen_random_uuid(),
    username character varying COLLATE pg_catalog."default" NOT NULL,
    email character varying COLLATE pg_catalog."default" NOT NULL,
    user_password character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (user_id),
    CONSTRAINT users_email_key UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS public.users_peers
(
    user_id uuid NOT NULL,
    peer_id uuid NOT NULL,
    points smallint
);

ALTER TABLE IF EXISTS public.backsides
    ADD CONSTRAINT backsides_flashcard_id_fkey FOREIGN KEY (flashcard_id)
    REFERENCES public.flashcards (flashcard_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.flashcards
    ADD CONSTRAINT flashcards_stack_id_fkey FOREIGN KEY (stack_id)
    REFERENCES public.stacks (stack_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;
CREATE INDEX IF NOT EXISTS idx_flashcards
    ON public.flashcards(stack_id);


ALTER TABLE IF EXISTS public.frontsides
    ADD CONSTRAINT frontsides_flashcard_id_fkey FOREIGN KEY (flashcard_id)
    REFERENCES public.flashcards (flashcard_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.stacks
    ADD CONSTRAINT stacks_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.users (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.topics
    ADD CONSTRAINT topics_stack_id_fkey FOREIGN KEY (stack_id)
    REFERENCES public.stacks (stack_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.users_peers
    ADD CONSTRAINT users_peers_peer_id_fkey FOREIGN KEY (peer_id)
    REFERENCES public.peers (peer_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.users_peers
    ADD CONSTRAINT users_peers_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.users (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;
