CREATE TABLE project(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4()
    project_id UUID NOT NULL REFERENCES ctypes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    require_app BOOLEAN,
    owner_id INT NOT NULL UNIQUE REFERENCES user(id) ON DELETE CASCADE,
    description VARCHAR(140),
    ctypemode INT NOT NULL,
    ready BOOLEAN default false,
    date_posted TIMESTAMP DEFAULT now() NOT NULL
);