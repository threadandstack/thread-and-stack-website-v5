SELECT cron.schedule(
  'sync-builds-cache-5min',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://uohhfesyumigbpqjpacl.supabase.co/functions/v1/sync-builds-cache',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvaGhmZXN5dW1pZ2JwcWpwYWNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNTQwNjIsImV4cCI6MjA3OTkzMDA2Mn0.YPZtQPf1w2Y2kFGg_05iqXpOqkcA1NR-Re34hZGqA7c"}'::jsonb,
    body := concat('{"time": "', now(), '"}')::jsonb
  ) AS request_id;
  $$
);