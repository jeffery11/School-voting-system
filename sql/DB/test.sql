WITH election_results AS (
    SELECT 
        c.id as candidate_id,
        c.name as candidate_name,
        c.position_id,
        p.title as position_name,
        COUNT(v.id) as vote_count,
        MAX(COUNT(v.id)) OVER (PARTITION BY p.id) as max_votes_in_position,
        SUM(COUNT(v.id)) OVER (PARTITION BY p.id) as total_position_votes
    FROM candidates c
    LEFT JOIN votes v ON c.id = v.candidate_id
    LEFT JOIN positions p ON c.position_id = p.id
    GROUP BY c.id, c.name, c.position_id, p.title, p.id
)
SELECT 
    candidate_id,
    candidate_name,
    position_name,
    vote_count,
    
    -- Fun popularity level
    CASE 
        WHEN vote_count = 0 THEN '🎭 Underdog (Zero Votes)'
        WHEN vote_count < 10 THEN '🐣 Rookie Campaigner'
        WHEN vote_count < 50 THEN '🚀 Rising Star'
        WHEN vote_count < 100 THEN '🌟 Popular Choice'
        WHEN vote_count < 200 THEN '🔥 Crowd Favorite'
        ELSE '🏆 ELECTION SUPERSTAR!'
    END as popularity_level,
    
    -- Winner crown or status
    CASE 
        WHEN vote_count = max_votes_in_position THEN '👑 WINNER!'
        WHEN vote_count = 0 THEN '😴 Time for new campaign strategy'
        ELSE '🏃 Still in the race!'
    END as election_status,
    
    -- Vote percentage
    ROUND(vote_count * 100.0 / NULLIF(total_position_votes, 0), 1) as vote_percentage,
    
    -- Fun campaign slogan based on performance
    CASE 
        WHEN vote_count = max_votes_in_position THEN '✅ VICTORY! The people have spoken!'
        WHEN vote_count = 0 THEN '🤔 Maybe next election?'
        WHEN vote_count < total_position_votes * 0.3 THEN '💪 Keep fighting the good fight!'
        ELSE '📈 Momentum is building!'
    END as campaign_message

FROM election_results
ORDER BY position_name, vote_count DESC;