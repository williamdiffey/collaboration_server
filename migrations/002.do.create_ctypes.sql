CREATE TABLE ctypes(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    tags TEXT[]
)