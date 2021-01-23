CREATE TABLE project_messages(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id uuid NOT NULL REFERENCES project(id) ON DELETE CASCADE,
    owner_id INT REFERENCES users(id),
    message_body TEXT NOT NULL,
    time_created TEXT NOT NULL,
    unix_stamp BIGSERIAL NOT NULL,
    edited BOOLEAN NOT NULL DEFAULT FALSE
);