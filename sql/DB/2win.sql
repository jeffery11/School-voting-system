SELECT 
    c.name as candidate,
    p.title as position,
    COUNT(v.id) as votes,
    CASE 
        WHEN COUNT(v.id) = (SELECT MAX(vote_count) 
                           FROM (SELECT COUNT(v2.id) as vote_count 
                                FROM votes v2 
                                JOIN candidates c2 ON v2.candidate_id = c2.id 
                                WHERE c2.position_id = c.position_id 
                                GROUP BY c2.id) sub) 
        THEN '🥇 WINNER'
        ELSE ''
    END as status
FROM candidates c
LEFT JOIN votes v ON c.id = v.candidate_id
LEFT JOIN positions p ON c.position_id = p.id
GROUP BY c.id, p.title, p.id
ORDER BY p.title, votes DESC;