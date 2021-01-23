CREATE TABLE archived_messages(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    party_id uuid NOT NULL,
    owner_id INT NOT NULL,
    message_body TEXT NOT NULL,
    time_created TEXT NOT NULL,
    unix_stamp BIGSERIAL NOT NULL
);