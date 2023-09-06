import pool from "./db";

const createUserTableQuery = `
CREATE TABLE users(
    user_id uuid UNIQUE NOT NULL,
    username VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL
    PRIMARY KEY(user_id)
);
`;

const createStackTableQuery = `
CREATE TABLE stacks (
    stack_id uuid UNIQUE NOT NULL,
    user_id uuid NOT NULL,
    stack_name VARCHAR DEFAULT='stack',
    number_of_cards SMALLINT,
    number_of_learned_cards SMALLINT,
    number_of_unlearned_cards SMALLINT,
    topic VARCHAR NOT NULL,
    total_downloads INT,
    creator VARCHAR NOT NULL,
    created_at DATE NOT NULL,
    last_learned_at DATE NOT NULL,
    PRIMARY KEY(stack_id),
    FOREIGN KEY(user_id) REFERNECES users(user_id)

    );
`;

const createFlashcardsTableQuery = `
CREATE TABLE flashcards(
    flashcard_id UUID UNIQUE NOT NULL,
    stack_id UUID NOT NULL,
    frontside VARCHAR NOT NULL,
    backside VARCHAR NOT NULL,
    learning_status SMALLINT NOT NULL,
    PRIMARY KEY(flashcard_id),
    FOREIGN KEY(stack_id) REFERENCES stacks(stack_id)
            );
`;

const createPeersTableQuery = `
CREATE TABLE peers(
    peer_id UUID UNIQUE NOT NULL,
    number_of_members SMALLINT NOT NULL,
    peer_name VARCHAR,
        );
`;

const usersPeersTableQuery = `
CREATE TABLE users_peers(
    user_id uuid NOT NULL,
    peer_id uuid NOT NULL,
    points SMALLINT,
    FOREIGN KEY(user_id) REFERENCES users(user_id)
    FOREIGN KEY(peer_id) REFERENCES peers(peer_id)
            )
`;


