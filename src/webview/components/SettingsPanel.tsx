import React from 'react';

const SETTING_GROUPS = [
  {
    title: 'Chat',
    settings: [
      { key: 'apex.chat.fontSize', label: 'Font Size', type: 'number', default: 14 },
      {
        key: 'apex.chat.theme',
        label: 'Theme',
        type: 'select',
        options: ['dark', 'light', 'high-contrast', 'custom'],
        default: 'dark',
      },
      {
        key: 'apex.chat.showLineNumbers',
        label: 'Show Line Numbers',
        type: 'boolean',
        default: true,
      },
      { key: 'apex.chat.autoScroll', label: 'Auto Scroll', type: 'boolean', default: true },
      { key: 'apex.chat.enterToSend', label: 'Enter to Send', type: 'boolean', default: true },
    ],
  },
  {
    title: 'Modes',
    settings: [
      {
        key: 'apex.modes.default',
        label: 'Default Mode',
        type: 'select',
        options: ['plan', 'code'],
        default: 'plan',
      },
      { key: 'apex.modes.autoSwitch', label: 'Auto-Switch Mode', type: 'boolean', default: false },
      {
        key: 'apex.modes.showConfirmation',
        label: 'Show Confirmation',
        type: 'boolean',
        default: true,
      },
      {
        key: 'apex.modes.rememberLast',
        label: 'Remember Last Mode',
        type: 'boolean',
        default: true,
      },
    ],
  },
  {
    title: 'Learning',
    settings: [
      { key: 'apex.learning.enabled', label: 'Learning Enabled', type: 'boolean', default: true },
      {
        key: 'apex.learning.autoDetectPatterns',
        label: 'Auto-Detect Patterns',
        type: 'boolean',
        default: true,
      },
      {
        key: 'apex.learning.learnFromEdits',
        label: 'Learn from Edits',
        type: 'boolean',
        default: true,
      },
      {
        key: 'apex.learning.maxStoredRules',
        label: 'Max Stored Rules',
        type: 'number',
        default: 1000,
      },
      {
        key: 'apex.learning.confidenceThreshold',
        label: 'Confidence Threshold',
        type: 'number',
        default: 0.7,
      },
    ],
  },
  {
    title: 'Agentic Mode',
    settings: [
      { key: 'apex.agentic.enabled', label: 'Agentic Mode', type: 'boolean', default: true },
      { key: 'apex.agentic.maxRequests', label: 'Max Requests', type: 'number', default: 25 },
      { key: 'apex.agentic.timeout', label: 'Timeout (s)', type: 'number', default: 300 },
    ],
  },
  {
    title: 'Skills',
    settings: [
      {
        key: 'apex.skills.autoInstall',
        label: 'Auto-Install Skills',
        type: 'boolean',
        default: true,
      },
      {
        key: 'apex.skills.autoImprove',
        label: 'Auto-Improve Skills',
        type: 'boolean',
        default: true,
      },
      { key: 'apex.skills.maxActive', label: 'Max Active Skills', type: 'number', default: 5 },
      {
        key: 'apex.skills.github.enabled',
        label: 'GitHub Skill Source',
        type: 'boolean',
        default: true,
      },
    ],
  },
  {
    title: 'Sub-Agents',
    settings: [
      { key: 'apex.subAgents.maxConcurrent', label: 'Max Concurrent', type: 'number', default: 3 },
      { key: 'apex.subAgents.timeout', label: 'Timeout (s)', type: 'number', default: 120 },
    ],
  },
  {
    title: 'Advanced',
    settings: [
      {
        key: 'apex.advanced.autoSummarize',
        label: 'Auto-Summarize',
        type: 'boolean',
        default: true,
      },
      {
        key: 'apex.advanced.language',
        label: 'Language',
        type: 'select',
        options: ['en', 'de', 'fr', 'es', 'ja', 'zh', 'pt'],
        default: 'en',
      },
      { key: 'apex.advanced.debugMode', label: 'Debug Mode', type: 'boolean', default: false },
    ],
  },
];

export function SettingsPanel(): React.ReactElement {
  return (
    <div style={{ padding: '12px 16px', overflowY: 'auto', height: '100%' }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Settings</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {SETTING_GROUPS.map((group) => (
          <div key={group.title}>
            <h3
              style={{
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 8,
                paddingBottom: 4,
                borderBottom: '1px solid var(--vscode-panel-border)',
                color: 'var(--vscode-settings-headerForeground)',
              }}
            >
              {group.title}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {group.settings.map((setting) => (
                <div
                  key={setting.key}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '4px 0',
                  }}
                >
                  <label
                    style={{
                      fontSize: 12,
                      color: 'var(--vscode-settings-labelForeground)',
                    }}
                  >
                    {setting.label}
                  </label>
                  {setting.type === 'boolean' ? (
                    <input
                      type="checkbox"
                      defaultChecked={setting.default as boolean}
                      style={{ margin: 0 }}
                    />
                  ) : setting.type === 'number' ? (
                    <input
                      type="number"
                      defaultValue={setting.default as number}
                      style={{
                        width: 80,
                        padding: '2px 6px',
                        borderRadius: 3,
                        border: '1px solid var(--vscode-input-border)',
                        background: 'var(--vscode-input-background)',
                        color: 'var(--vscode-input-foreground)',
                        fontSize: 12,
                      }}
                    />
                  ) : (
                    <select
                      defaultValue={setting.default as string}
                      style={{
                        padding: '2px 6px',
                        borderRadius: 3,
                        border: '1px solid var(--vscode-dropdown-border)',
                        background: 'var(--vscode-dropdown-background)',
                        color: 'var(--vscode-dropdown-foreground)',
                        fontSize: 12,
                      }}
                    >
                      {setting.options?.map((opt: string) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
