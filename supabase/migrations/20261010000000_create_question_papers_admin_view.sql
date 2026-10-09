-- Create a view for the admin panel to order papers by verification status and created_at
CREATE OR REPLACE VIEW question_papers_admin_view with (security_invoker = on) AS
SELECT *
FROM "questionPapers"
ORDER BY "isVerified" ASC, created_at DESC;
