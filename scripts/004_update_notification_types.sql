-- Atualizar tabela notification_logs para suportar tipos de notificação adicionais
-- Isso corrige o erro de violação de restrição permitindo mais tipos de notificação

-- Remover a restrição existente
ALTER TABLE public.notification_logs 
DROP CONSTRAINT IF EXISTS notification_logs_notification_type_check;

-- Adicionar restrição atualizada com mais tipos de notificação
ALTER TABLE public.notification_logs 
ADD CONSTRAINT notification_logs_notification_type_check 
CHECK (notification_type IN (
  'candidate_result',
  'manager_report', 
  'creative_insights',
  'system_report',
  'scheduled_report'
));

-- Adicionar comentário para documentação
COMMENT ON COLUMN public.notification_logs.notification_type IS 
'Tipo de notificação: candidate_result, manager_report, creative_insights, system_report, scheduled_report';
