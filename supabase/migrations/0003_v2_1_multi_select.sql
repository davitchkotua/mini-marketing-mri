-- v2.1 — multi-select sales methods + suspected loss points + phone number
ALTER TABLE quiz_submissions
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS sales_methods jsonb,
ADD COLUMN IF NOT EXISTS primary_sales_method text,
ADD COLUMN IF NOT EXISTS suspected_loss_points jsonb,
ADD COLUMN IF NOT EXISTS primary_suspected_loss_point text;

CREATE INDEX IF NOT EXISTS idx_quiz_submissions_primary_loss_point
ON quiz_submissions(primary_suspected_loss_point);
