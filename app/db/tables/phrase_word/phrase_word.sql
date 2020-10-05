CREATE OR REPLACE VIEW phrase_word AS (
  SELECT phrase_id, word, ordinality AS index
  FROM phrase p, unnest(string_to_array(p.phrase, ' ')) WITH ORDINALITY word
)