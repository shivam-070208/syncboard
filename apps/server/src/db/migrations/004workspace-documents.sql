CREATE TABLE workspace_documents (
  workspace_id UUID PRIMARY KEY REFERENCES workspaces(id) ON DELETE CASCADE,
  editor_data JSONB NOT NULL DEFAULT '{}',
  canvas_data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_workspace_documents_updated ON workspace_documents(updated_at);
