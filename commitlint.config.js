export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Fix
        'docs', // Change documentation
        'style', // Change code format (without affecting logic)
        'refactor', // Refactor code
        'perf', // Improve performance
        'test', // Add or fix test
        'chore', // Change build, dependencies
        'ci', // Change CI/CD
        'build', // Change build system
        'revert', // Revert commit before
      ],
    ],
    'subject-case': [2, 'never', ['pascal-case', 'upper-case']],
    'subject-min-length': [2, 'always', 3],
    'subject-max-length': [2, 'always', 100],
    'body-max-line-length': [2, 'always', 100],
    'footer-max-line-length': [2, 'always', 100],
  },
  ignores: [
    // Bỏ qua merge commits
    (commit) => commit.includes('Merge'),

    // Bỏ qua commit từ dependabot
    (commit) => commit.includes('dependabot'),

    // Bỏ qua commit WIP (work in progress)
    (commit) => commit.toLowerCase().includes('wip'),
  ],
}
