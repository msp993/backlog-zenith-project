-- Remove KPI and Bug related tables and references
-- First remove dependent tables that reference main tables

-- Drop activities related to bugs and kpis
DELETE FROM public.activities 
WHERE entity_type IN ('bug', 'kpi');

-- Update activities table to only allow backlog_item entity type
ALTER TABLE public.activities 
DROP CONSTRAINT IF EXISTS activities_entity_type_check;

ALTER TABLE public.activities 
ADD CONSTRAINT activities_entity_type_check 
CHECK (entity_type = 'backlog_item');

-- Update action types to be more backlog-specific
ALTER TABLE public.activities 
DROP CONSTRAINT IF EXISTS activities_action_type_check;

ALTER TABLE public.activities 
ADD CONSTRAINT activities_action_type_check 
CHECK (action_type IN ('created', 'updated', 'deleted', 'commented'));

-- Drop KPI history table
DROP TABLE IF EXISTS public.kpi_history CASCADE;

-- Drop KPIs table
DROP TABLE IF EXISTS public.kpis CASCADE;

-- Drop bugs table
DROP TABLE IF EXISTS public.bugs CASCADE;

-- Clean up any foreign key references in backlog_items that might reference bugs
ALTER TABLE public.backlog_items 
DROP COLUMN IF EXISTS related_bug_id;

-- Update backlog_items to remove any bug-related fields that might exist
-- (keeping the core backlog functionality intact)