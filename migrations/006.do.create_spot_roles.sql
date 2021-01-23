CREATE TABLE spot_roles(
    id SERIAL PRIMARY KEY,
    spot_id uuid REFERENCES spots(id) ON DELETE CASCADE NOT NULL,
    role_id int NOT NULL
);