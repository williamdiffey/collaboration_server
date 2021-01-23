CREATE TABLE project_requirements(
    id SERIAL PRIMARY KEY,
    project_id uuid REFERENCES project(id) ON DELETE CASCADE NOT NULL,
    requirement_id INT NOT NULL
);