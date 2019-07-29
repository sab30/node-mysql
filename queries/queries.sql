SELECT 
    c.id AS country_id,
    country_name,
    s.id AS state_id,
    s.state_name,
    ci.id AS city_id,
    ci.city_name,
    a.id AS area,
    a.area_name
FROM
    country c
        INNER JOIN
    state s ON c.id = s.country_id
        INNER JOIN
    city ci ON ci.state_id = s.id
        INNER JOIN
    area a ON a.city_id = ci.id;
