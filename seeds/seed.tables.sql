BEGIN;
TRUNCATE users;
INSERT INTO users (username, email, password, not_verified)
VALUES
    (
        'admin',
        'william.diffey@protonmail.com',
        '$2y$12$R6sg9E77/5c41GJZIGqlH.UH73UPmxFwa6S6U1DMvA4MjSgIyGtVG',
        null
    );

COMMIT;