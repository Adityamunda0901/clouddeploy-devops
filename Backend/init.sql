CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tasks (title, status)
VALUES
    ('Learn Docker', 'completed'),
    ('Deploy application on AWS', 'in-progress'),
    ('Build CI/CD pipeline', 'pending');