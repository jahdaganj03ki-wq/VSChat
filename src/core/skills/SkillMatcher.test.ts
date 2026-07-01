import { describe, it, expect } from 'vitest';
import { SkillMatcher } from './SkillMatcher';
import type { Skill } from './schemas/SkillSchema';

describe('SkillMatcher', () => {
  const matcher = new SkillMatcher();

  const mockSkills: Skill[] = [
    {
      id: 'react-ts-component@1.0.0',
      manifest: {
        name: 'react-ts-component',
        version: '1.0.0',
        type: 'micro',
        description: 'React + TypeScript Component Patterns',
        triggers: ['react', 'typescript', 'component', 'jsx', 'tsx', 'hook'],
        tags: ['frontend', 'web', 'react', 'typescript'],
        dependencies: [],
        permissions: [],
        instructions: 'Create React TypeScript components',
        source: 'local',
        author: 'apex-community',
        improvements: [],
      },
      enabled: true,
      installedAt: new Date(),
    },
    {
      id: 'azure-bicep@1.0.0',
      manifest: {
        name: 'azure-bicep',
        version: '1.0.0',
        type: 'micro',
        description: 'Azure Bicep Infrastructure Patterns',
        triggers: ['azure', 'bicep', 'infrastructure', 'iac'],
        tags: ['azure', 'infrastructure', 'bicep'],
        dependencies: [],
        permissions: [],
        instructions: 'Write Azure Bicep templates',
        source: 'local',
        author: 'apex-community',
        improvements: [],
      },
      enabled: true,
      installedAt: new Date(),
    },
  ];

  it('should match skills by trigger keywords', () => {
    const result = matcher.match('Create a React component with TypeScript', mockSkills);
    expect(result.length).toBe(1);
    expect(result[0].manifest.name).toBe('react-ts-component');
  });

  it('should match by tags', () => {
    const result = matcher.match('Deploy to Azure', mockSkills);
    expect(result.length).toBe(1);
    expect(result[0].manifest.name).toBe('azure-bicep');
  });

  it('should return empty for non-matching prompts', () => {
    const result = matcher.match('How do I cook pasta?', mockSkills);
    expect(result.length).toBe(0);
  });
});
