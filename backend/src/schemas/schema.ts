import pool from "./db";

const createUserTableQuery = `
CREATE TABLE users(
    user_id uuid UNIQUE NOT NULL,
    username VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL
);
`

const createStackTableQuery = `
    CREATE TABLE stacks (
        stack_id uuid UNIQUE NOT NULL,
        stack_name VARCHAR DEFAULT='stack',
        number_of_cards SMALLINT,
        number_of_learned_cards SMALLINT,
        number_of_unlearned_cards SMALLINT,
        topic VARCHAR NOT NULL,
        total_downloads INT,
        creator VARCHAR NOT NULL,
        created_at DATE NOT NULL,
        last_learned_at DATE NOT NULL,

    );
`

const createPeersTableQuery = `
        CREATE TABLE peers(
            peer_id UUID UNIQUE NOT NULL,
            number_of_members SMALLINT NOT NULL,
            peer_name VARCHAR,

        );
`

const createFlashcardsTableQuery = `
            CREATE TABLE flashcards(
                flashcard_id UUID UNIQUE NOT NULL,
                frontside VARCHAR NOT NULL,
                backside VARCHAR NOT NULL,
                learning_status SMALLINT NOT NULL
            );
`


