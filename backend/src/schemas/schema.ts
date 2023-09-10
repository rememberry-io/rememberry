import pool from "./db";

const createUserTableQuery = `
CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT NOT NULL,
    username VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    PRIMARY KEY(user_id)
);
`;

const createStackTableQuery = `
CREATE TABLE IF NOT EXISTS stacks (
    stack_id INTEGER NOT NULL,
    user_id BIGINT NOT NULL,
    stack_name VARCHAR DEFAULT 'stack',
    number_of_cards SMALLINT,
    number_of_learned_cards SMALLINT,
    number_of_unlearned_cards SMALLINT,
    topic VARCHAR NOT NULL,
    total_downloads INTEGER,
    creator VARCHAR NOT NULL,
    created_at DATE NOT NULL,
    last_learned_at DATE NOT NULL,
    PRIMARY KEY(stack_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id)
);
`;

const createFlashcardsTableQuery = `
CREATE TABLE IF NOT EXISTS flashcards (
    flashcard_id INTEGER NOT NULL,
    stack_id INTEGER NOT NULL,
    frontside VARCHAR NOT NULL,
    backside VARCHAR NOT NULL,
    learning_status SMALLINT NOT NULL,
    PRIMARY KEY(flashcard_id),
    FOREIGN KEY(stack_id) REFERENCES stacks(stack_id)
);
`;

const createPeersTableQuery = `
CREATE TABLE IF NOT EXISTS peers (
    peer_id INTEGER NOT NULL,
    number_of_members SMALLINT NOT NULL,
    peer_name VARCHAR,
    UNIQUE(peer_id)
);
`;

const createUserPeersTableQuery = `
CREATE TABLE IF NOT EXISTS users_peers (
    user_id INTEGER NOT NULL,
    peer_id INTEGER NOT NULL,
    points SMALLINT,
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(peer_id) REFERENCES peers(peer_id)
);
`;

export async function createTables() {
  try {
    await pool.query(createUserTableQuery);
    await pool.query(createStackTableQuery);
    await pool.query(createFlashcardsTableQuery);
    await pool.query(createPeersTableQuery);
    await pool.query(createUserPeersTableQuery);
    console.log("Tables created successfully");
  } catch (error) {
    console.error("An error occurred while creating tables:", error);
  } finally {
    pool.end();
  }
}
