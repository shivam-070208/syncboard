export type Team = {
  id: string
  name: string
  owner_id: string
  created_at: string
}

export type TeamMember = {
  id: string
  team_id: string
  user_id: string
  role: string
  created_at: string
}

export type Workspace = {
  id: string
  team_id: string
  title: string
  created_by: string
  created_at: string
}

export type WorkspaceMember = {
  id: string
  workspace_id: string
  user_id: string
  created_at: string
}
