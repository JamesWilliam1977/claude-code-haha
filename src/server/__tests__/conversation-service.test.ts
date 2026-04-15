import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import * as fs from 'node:fs/promises'
import * as os from 'node:os'
import * as path from 'node:path'
import { ConversationService } from '../services/conversationService.js'

describe('ConversationService', () => {
  let tmpDir: string
  let originalConfigDir: string | undefined
  let originalAuthToken: string | undefined
  let originalBaseUrl: string | undefined
  let originalModel: string | undefined

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cc-haha-conversation-service-'))
    originalConfigDir = process.env.CLAUDE_CONFIG_DIR
    originalAuthToken = process.env.ANTHROPIC_AUTH_TOKEN
    originalBaseUrl = process.env.ANTHROPIC_BASE_URL
    originalModel = process.env.ANTHROPIC_MODEL

    process.env.CLAUDE_CONFIG_DIR = tmpDir
    process.env.ANTHROPIC_AUTH_TOKEN = 'test-token'
    process.env.ANTHROPIC_BASE_URL = 'https://example.invalid/anthropic'
    process.env.ANTHROPIC_MODEL = 'test-model'
  })

  afterEach(async () => {
    if (originalConfigDir === undefined) delete process.env.CLAUDE_CONFIG_DIR
    else process.env.CLAUDE_CONFIG_DIR = originalConfigDir

    if (originalAuthToken === undefined) delete process.env.ANTHROPIC_AUTH_TOKEN
    else process.env.ANTHROPIC_AUTH_TOKEN = originalAuthToken

    if (originalBaseUrl === undefined) delete process.env.ANTHROPIC_BASE_URL
    else process.env.ANTHROPIC_BASE_URL = originalBaseUrl

    if (originalModel === undefined) delete process.env.ANTHROPIC_MODEL
    else process.env.ANTHROPIC_MODEL = originalModel

    await fs.rm(tmpDir, { recursive: true, force: true })
  })

  test('keeps inherited provider env when no desktop provider config exists', () => {
    const service = new ConversationService() as any
    const env = service.buildChildEnv('D:\\workspace\\code\\myself_code\\cc-haha') as Record<string, string>

    expect(env.ANTHROPIC_AUTH_TOKEN).toBe('test-token')
    expect(env.ANTHROPIC_BASE_URL).toBe('https://example.invalid/anthropic')
    expect(env.ANTHROPIC_MODEL).toBe('test-model')
  })

  test('strips inherited provider env when desktop provider config exists', async () => {
    const ccHahaDir = path.join(tmpDir, 'cc-haha')
    await fs.mkdir(ccHahaDir, { recursive: true })
    await fs.writeFile(
      path.join(ccHahaDir, 'providers.json'),
      JSON.stringify({ activeId: null, providers: [] }),
      'utf-8',
    )

    const service = new ConversationService() as any
    const env = service.buildChildEnv('D:\\workspace\\code\\myself_code\\cc-haha') as Record<string, string>

    expect(env.ANTHROPIC_AUTH_TOKEN).toBeUndefined()
    expect(env.ANTHROPIC_BASE_URL).toBeUndefined()
    expect(env.ANTHROPIC_MODEL).toBeUndefined()
  })

  test('uses bun entrypoint fallback on Windows dev mode', () => {
    const service = new ConversationService() as any
    const args = service.resolveCliArgs(['--print'])

    if (process.platform === 'win32') {
      expect(args[0]).toBe(process.execPath)
      expect(args[1]).toContain(path.join('src', 'entrypoints', 'cli.tsx'))
    } else {
      expect(args[0]).toContain(path.join('bin', 'claude-haha'))
    }
  })
})
