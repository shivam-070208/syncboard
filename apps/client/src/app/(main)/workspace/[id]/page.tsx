import { WorkspaceExperience } from "@/modules/workspace/components/workspace-experience"

interface WorkspacePageProps {
  params: Promise<{ id: string }>
}

const WorkspacePage = async ({ params }: WorkspacePageProps) => {
  const { id: workspaceId } = await params

  return <WorkspaceExperience workspaceId={workspaceId} />
}

export default WorkspacePage
