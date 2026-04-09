import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { Settings } from '../pages/Settings'
import { useAgentStore } from '../stores/agentStore'
import { useSkillStore } from '../stores/skillStore'
import { useSettingsStore } from '../stores/settingsStore'

// Mock the API module so no real HTTP calls are made
vi.mock('../api/agents', () => ({
  agentsApi: {
    list: vi.fn().mockResolvedValue({ agents: [] }),
  },
}))

const noopFetch = vi.fn()

vi.mock('../stores/providerStore', () => ({
  useProviderStore: () => ({
    providers: [],
    activeId: null,
    isLoading: false,
    fetchProviders: vi.fn(),
    deleteProvider: vi.fn(),
    activateProvider: vi.fn(),
    activateOfficial: vi.fn(),
    testProvider: vi.fn(),
    createProvider: vi.fn(),
    updateProvider: vi.fn(),
    testConfig: vi.fn(),
  }),
}))

vi.mock('../pages/AdapterSettings', () => ({
  AdapterSettings: () => <div>Adapter Settings Mock</div>,
}))

vi.mock('../components/chat/CodeViewer', () => ({
  CodeViewer: ({ code }: { code: string }) => <pre data-testid="code-viewer">{code}</pre>,
}))

const MOCK_AGENTS = [
  {
    name: 'code-reviewer',
    description: 'Reviews code for quality and security',
    model: 'claude-sonnet-4-6',
    tools: ['Read', 'Grep', 'Glob'],
    systemPrompt: '# Code Reviewer\n\nYou are an expert code reviewer.',
    color: 'blue',
  },
  {
    name: 'doc-writer',
    description: 'Writes technical documentation',
    model: 'claude-haiku-4-5-20251001',
    systemPrompt: 'You write clear and concise docs.',
    color: 'green',
  },
  {
    name: 'plain-agent',
    description: undefined,
    model: undefined,
    systemPrompt: undefined,
    color: undefined,
  },
]

const MOCK_SKILL_DETAIL = {
  meta: {
    name: 'skill-docs',
    displayName: 'Skill Docs',
    description: 'A rich skill readme',
    source: 'user' as const,
    userInvocable: true,
    contentLength: 200,
    hasDirectory: true,
  },
  tree: [
    { name: 'SKILL.md', path: 'SKILL.md', type: 'file' as const },
    { name: 'helper.ts', path: 'helper.ts', type: 'file' as const },
  ],
  files: [
    {
      path: 'SKILL.md',
      language: 'markdown',
      content: '# Heading\n\nParagraph with `inline code`.\n\n## Section\n\n- First item\n- Second item\n\n> Helpful quote',
      body: '# Heading\n\nParagraph with `inline code`.\n\n## Section\n\n- First item\n- Second item\n\n> Helpful quote',
      isEntry: true,
      frontmatter: {
        description: 'A rich skill readme',
        model: 'sonnet',
      },
    },
    {
      path: 'helper.ts',
      language: 'typescript',
      content: 'export const helper = true',
      isEntry: false,
    },
  ],
  skillRoot: '/tmp/skill-docs',
}

function switchToAgentsTab() {
  fireEvent.click(screen.getByText('Agents'))
}

function switchToSkillsTab() {
  fireEvent.click(screen.getByText('Skills'))
}

describe('Settings > Agents tab', () => {
  beforeEach(() => {
    useSettingsStore.setState({ locale: 'en' })
    useAgentStore.setState({
      agents: [],
      isLoading: false,
      error: null,
      selectedAgent: null,
      fetchAgents: noopFetch,
    })
    useSkillStore.setState({
      skills: [],
      selectedSkill: null,
      isLoading: false,
      isDetailLoading: false,
      error: null,
      fetchSkills: noopFetch,
      fetchSkillDetail: noopFetch,
      clearSelection: () => useSkillStore.setState({ selectedSkill: null }),
    })
  })

  it('renders the Agents tab button in sidebar', () => {
    render(<Settings />)
    expect(screen.getByText('Agents')).toBeInTheDocument()
  })

  it('shows loading spinner when fetching agents', () => {
    useAgentStore.setState({ isLoading: true, agents: [], fetchAgents: noopFetch })
    render(<Settings />)
    switchToAgentsTab()

    expect(screen.getByText('Installed Agents')).toBeInTheDocument()
    const spinner = document.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('shows empty state when no agents installed', () => {
    useAgentStore.setState({ agents: [], isLoading: false, fetchAgents: noopFetch })
    render(<Settings />)
    switchToAgentsTab()

    expect(screen.getByText('No agents installed yet.')).toBeInTheDocument()
    expect(screen.getByText(/Create .md or .yaml files/)).toBeInTheDocument()
  })

  it('shows error state with retry button when API fails', () => {
    useAgentStore.setState({ agents: [], isLoading: false, error: 'Network error', fetchAgents: noopFetch })
    render(<Settings />)
    switchToAgentsTab()

    expect(screen.getByText('Network error')).toBeInTheDocument()
    expect(screen.getByText('Retry')).toBeInTheDocument()
  })

  it('renders agent list with names and descriptions', () => {
    useAgentStore.setState({ agents: MOCK_AGENTS, isLoading: false, fetchAgents: noopFetch })
    render(<Settings />)
    switchToAgentsTab()

    expect(screen.getByText('code-reviewer')).toBeInTheDocument()
    expect(screen.getByText('Reviews code for quality and security')).toBeInTheDocument()
    expect(screen.getByText('doc-writer')).toBeInTheDocument()
    expect(screen.getByText('Writes technical documentation')).toBeInTheDocument()
    expect(screen.getByText('3 agents')).toBeInTheDocument()
  })

  it('shows model badge for agents with model defined', () => {
    useAgentStore.setState({ agents: MOCK_AGENTS, isLoading: false, fetchAgents: noopFetch })
    render(<Settings />)
    switchToAgentsTab()

    expect(screen.getByText('claude-sonnet-4-6')).toBeInTheDocument()
    expect(screen.getByText('claude-haiku-4-5-20251001')).toBeInTheDocument()
  })

  it('shows "No description" for agents without description', () => {
    useAgentStore.setState({ agents: MOCK_AGENTS, isLoading: false, fetchAgents: noopFetch })
    render(<Settings />)
    switchToAgentsTab()

    expect(screen.getByText('No description')).toBeInTheDocument()
  })

  it('navigates to agent detail view when clicking an agent', () => {
    useAgentStore.setState({ agents: MOCK_AGENTS, isLoading: false, fetchAgents: noopFetch })
    render(<Settings />)
    switchToAgentsTab()

    fireEvent.click(screen.getByText('code-reviewer'))

    expect(screen.getByText('Back to list')).toBeInTheDocument()
    expect(screen.getByText('Reviews code for quality and security')).toBeInTheDocument()
    expect(screen.getByText(/claude-sonnet-4-6/)).toBeInTheDocument()
    expect(screen.getByText(/Read, Grep, Glob/)).toBeInTheDocument()
  })

  it('renders system prompt as Markdown in detail view', () => {
    useAgentStore.setState({ agents: MOCK_AGENTS, isLoading: false, fetchAgents: noopFetch })
    render(<Settings />)
    switchToAgentsTab()

    fireEvent.click(screen.getByText('code-reviewer'))

    expect(screen.getByRole('heading', { name: 'Code Reviewer' })).toBeInTheDocument()
    expect(screen.getByText('You are an expert code reviewer.')).toBeInTheDocument()
  })

  it('shows "no system prompt" message when agent has no prompt', () => {
    useAgentStore.setState({ agents: MOCK_AGENTS, isLoading: false, fetchAgents: noopFetch })
    render(<Settings />)
    switchToAgentsTab()

    fireEvent.click(screen.getByText('plain-agent'))

    expect(screen.getByText('No system prompt defined.')).toBeInTheDocument()
  })

  it('navigates back to list from detail view', () => {
    useAgentStore.setState({ agents: MOCK_AGENTS, isLoading: false, fetchAgents: noopFetch })
    render(<Settings />)
    switchToAgentsTab()

    fireEvent.click(screen.getByText('code-reviewer'))
    expect(screen.getByText('Back to list')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Back to list'))

    expect(screen.getByText('code-reviewer')).toBeInTheDocument()
    expect(screen.getByText('doc-writer')).toBeInTheDocument()
    expect(screen.getByText('plain-agent')).toBeInTheDocument()
  })
})

describe('Settings > Skills tab', () => {
  beforeEach(() => {
    useSettingsStore.setState({ locale: 'en' })
    useSkillStore.setState({
      skills: [],
      selectedSkill: null,
      isLoading: false,
      isDetailLoading: false,
      error: null,
      fetchSkills: noopFetch,
      fetchSkillDetail: noopFetch,
      clearSelection: () => useSkillStore.setState({ selectedSkill: null }),
    })
  })

  it('renders markdown skills with document styling in detail view', () => {
    useSkillStore.setState({
      selectedSkill: MOCK_SKILL_DETAIL,
      clearSelection: () => useSkillStore.setState({ selectedSkill: null }),
    })

    render(<Settings />)
    switchToSkillsTab()

    expect(screen.getByText('Skill metadata')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Heading' })).toBeInTheDocument()

    const rendererRoot = screen.getByRole('heading', { name: 'Heading' }).closest('div[class*="prose"]')
    expect(rendererRoot?.className).toContain('max-w-[72ch]')
    expect(rendererRoot?.className).toContain('prose-h2:border-b')
    expect(rendererRoot?.className).toContain('prose-p:text-[15px]')
    expect(screen.getByText('Helpful quote')).toBeInTheDocument()
  })

  it('keeps code files rendered in CodeViewer instead of markdown prose', () => {
    useSkillStore.setState({
      selectedSkill: MOCK_SKILL_DETAIL,
      clearSelection: () => useSkillStore.setState({ selectedSkill: null }),
    })

    render(<Settings />)
    switchToSkillsTab()

    fireEvent.click(screen.getAllByText('helper.ts')[0]!)

    expect(screen.getByTestId('code-viewer')).toHaveTextContent('export const helper = true')
    expect(screen.queryByRole('heading', { name: 'Heading' })).not.toBeInTheDocument()
  })
})
