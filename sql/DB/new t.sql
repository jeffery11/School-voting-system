SELECT 
    c.id as candidate_id,
    c.name as candidate_name,
    c.position_id,
    p.title as position_name,
    COUNT(v.id) as vote_count
FROM candidates c
LEFT JOIN votes v ON c.id = v.candidate_id
LEFT JOIN positions p ON c.position_id = p.id
GROUP BY c.id, c.name, c.position_id, p.title
ORDER BY p.title, vote_count DESC;