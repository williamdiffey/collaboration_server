CREATE TABLE project_apps(
    id SERIAL PRIMARY KEY,
    user_id int REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    project_id uuid REFERENCES project(id) ON DELETE CASCADE NOT NULL,
    spot_id uuid REFERENCES spots(id) ON DELETE CASCADE NOT NULL,
    description VARCHAR(140)
);