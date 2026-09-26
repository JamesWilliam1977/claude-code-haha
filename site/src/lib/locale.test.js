import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { DEFAULT_LOCALE, normalizeStoredLocale, resolveRootRedirect } from './locale.js'

describe('normalizeStoredLocale', () => {
  it('只接受 zh / en', () => {
    assert.equal(normalizeStoredLocale('zh'), 'zh')
    assert.equal(normalizeStoredLocale('en'), 'en')
    assert.equal(normalizeStoredLocale('fr'), null)
    assert.equal(normalizeStoredLocale(''), null)
    assert.equal(normalizeStoredLocale(null), null)
  })
})

describe('resolveRootRedirect', () => {
  it('没有保存偏好时始终默认英文，不受浏览器语言影响', () => {
    assert.equal(DEFAULT_LOCALE, 'en')
    for (const languages of [['zh-CN'], ['en-US'], ['ja-JP'], []]) {
      assert.equal(resolveRootRedirect({ languages, pathname: '/' }), '/en')
    }
    assert.equal(resolveRootRedirect({ pathname: '/' }), '/en')
  })

  it('根路径的尾斜杠和空串都算根', () => {
    for (const pathname of ['/', '', '//']) {
      assert.equal(resolveRootRedirect({ pathname }), '/en', JSON.stringify(pathname))
    }
  })

  it('只动根路径，明确访问的中英文文档都保持原路由', () => {
    for (const pathname of ['/en', '/en/', '/start', '/en/start', '/desktop/pets', '/internals']) {
      assert.equal(resolveRootRedirect({ pathname }), null, pathname)
    }
  })

  it('手动选择中文后保留中文首页，选择英文后进入英文首页', () => {
    assert.equal(resolveRootRedirect({ pathname: '/', stored: 'zh' }), null)
    assert.equal(resolveRootRedirect({ pathname: '/', stored: 'en' }), '/en')
  })

  it('保存值无效时按英文默认值处理', () => {
    assert.equal(resolveRootRedirect({ pathname: '/', stored: 'garbage' }), '/en')
    assert.equal(resolveRootRedirect({ pathname: '/', stored: '' }), '/en')
  })
})
