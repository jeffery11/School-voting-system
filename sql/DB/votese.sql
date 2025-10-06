-- Create votes table
CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    voter_id INTEGER REFERENCES voters(id),
    candidate_id INTEGER REFERENCES candidates(id),
    position VARCHAR(100) NOT NULL,
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Verify the table was created
SELECT * FROM votes;

-- Check if foreign key constraints work
SELECT 
    table_name, 
    column_name, 
    constraint_name,
    foreign_table_name,
    foreign_column_name
FROM information_schema.key_column_usage
WHERE constraint_name LIKE '%fkey%' AND table_name = 'votes';