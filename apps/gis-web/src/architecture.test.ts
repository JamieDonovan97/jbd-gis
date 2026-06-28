/// <reference types="node" />
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

// Enforces the ADR-004 rule that a feature never imports another feature.
// Internal imports are relative and never contain "features/<name>"; a
// cross-feature import does, which is what this catches.

const featuresDir = join(dirname(fileURLToPath(import.meta.url)), 'features')

const featureNames = readdirSync(featuresDir).filter((name) =>
  statSync(join(featuresDir, name)).isDirectory(),
)

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return sourceFiles(full)
    return /\.tsx?$/.test(full) ? [full] : []
  })
}

const IMPORT_RE = /(?:import|export)[^'"]*from\s*['"]([^'"]+)['"]/g

function siblingImports(feature: string): string[] {
  const violations: string[] = []
  for (const file of sourceFiles(join(featuresDir, feature))) {
    const contents = readFileSync(file, 'utf8')
    for (const [, specifier] of contents.matchAll(IMPORT_RE)) {
      const sibling = specifier.match(/features\/([\w-]+)/)
      if (sibling && sibling[1] !== feature) {
        violations.push(`${file} imports ${specifier}`)
      }
    }
  }
  return violations
}

describe('feature isolation (ADR-004)', () => {
  for (const feature of featureNames) {
    it(`feature "${feature}" imports no sibling feature`, () => {
      expect(siblingImports(feature)).toEqual([])
    })
  }
})
