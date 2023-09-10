BEGIN;


CREATE TABLE IF NOT EXISTS public.flashcards
(
    flashcard_id integer NOT NULL,
    stack_id integer NOT NULL,
    frontside character varying COLLATE pg_catalog."default" NOT NULL,
    backside character varying COLLATE pg_catalog."default" NOT NULL,
    learning_status smallint NOT NULL,
    CONSTRAINT flashcards_pkey PRIMARY KEY (flashcard_id)
);

CREATE TABLE IF NOT EXISTS public.peers
(
    peer_id integer NOT NULL,
    number_of_members smallint NOT NULL,
    peer_name character varying COLLATE pg_catalog."default",
    CONSTRAINT peers_peer_id_key UNIQUE (peer_id)
);

CREATE TABLE IF NOT EXISTS public.stacks
(
    stack_id integer NOT NULL,
    user_id integer NOT NULL,
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

CREATE TABLE IF NOT EXISTS public.users
(
    user_id bigint NOT NULL,
    username character varying COLLATE pg_catalog."default" NOT NULL,
    email character varying COLLATE pg_catalog."default" NOT NULL,
    password character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (user_id),
    CONSTRAINT users_email_key UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS public.users_peers
(
    user_id integer NOT NULL,
    peer_id integer NOT NULL,
    points smallint
);

ALTER TABLE IF EXISTS public.flashcards
    ADD CONSTRAINT flashcards_stack_id_fkey FOREIGN KEY (stack_id)
    REFERENCES public.stacks (stack_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;
CREATE INDEX IF NOT EXISTS idx_flashcards
    ON public.flashcards(stack_id);


ALTER TABLE IF EXISTS public.stacks
    ADD CONSTRAINT stacks_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.users (user_id) MATCH SIMPLE
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

END;