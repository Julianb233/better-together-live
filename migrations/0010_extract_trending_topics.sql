-- Extract trending hashtags from recent posts using PostgreSQL regexp_matches
-- Used by /api/explore/topics endpoint instead of fetching 1000 rows for JS processing
CREATE OR REPLACE FUNCTION extract_trending_topics(p_days INTEGER DEFAULT 7, p_limit INTEGER DEFAULT 20)
RETURNS TABLE(topic TEXT, post_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    LOWER(match[1]) as topic,
    COUNT(*)::BIGINT as post_count
  FROM posts,
    LATERAL regexp_matches(content, '#(\w+)', 'g') AS match
  WHERE created_at >= NOW() - (p_days || ' days')::INTERVAL
    AND deleted_at IS NULL
    AND is_hidden = FALSE
    AND visibility = 'public'
  GROUP BY LOWER(match[1])
  ORDER BY post_count DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;
