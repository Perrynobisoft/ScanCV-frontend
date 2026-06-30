import { m } from '@/paraglide/messages'

type FilterOption = {
  label: string
  value: string
}

const createOption = (value: string): FilterOption => ({
  label: value,
  value,
})

const createOptions = (
  placeholder: string,
  values: string[],
): FilterOption[] => [
  {
    label: placeholder,
    value: '',
  },
  ...values.map(createOption),
]

export function getJobTitleOptions(): FilterOption[] {
  return [
    { label: m.cv_hub_filter_job_titles(), value: '' },

    { label: 'Backend Developer', value: 'Backend Developer' },
    { label: 'Frontend Developer', value: 'Frontend Developer' },
    { label: 'Fullstack Developer', value: 'Fullstack Developer' },
    { label: 'Tech Lead', value: 'Tech Lead' },

    { label: 'Data Analyst', value: 'Data Analyst' },
    { label: 'Data Engineer', value: 'Data Engineer' },
    { label: 'BI Developer', value: 'BI Developer' },

    { label: 'DevOps Engineer', value: 'DevOps Engineer' },
    { label: 'SRE', value: 'SRE' },
    { label: 'Cloud Engineer', value: 'Cloud Engineer' },
    { label: 'Network Engineer', value: 'Network Engineer' },

    { label: 'UI/UX Designer', value: 'UI/UX Designer' },
    { label: 'UX Researcher', value: 'UX Researcher' },

    { label: 'QA Engineer', value: 'QA Engineer' },
    { label: 'QA Lead', value: 'QA Lead' },
    { label: 'Automation Tester', value: 'Automation Tester' },

    { label: 'Business Analyst (BA)', value: 'Business Analyst (BA)' },
    { label: 'Product Owner (PO)', value: 'Product Owner (PO)' },
    { label: 'Project Manager (IT)', value: 'Project Manager (IT)' },
  ]
}

/** Keep backward-compat static export for Fuse.js initialization (labels don't need i18n there) */
export const JOB_TITLE_OPTIONS: FilterOption[] = [
  { label: 'Job Titles', value: '' },

  { label: 'Backend Developer', value: 'Backend Developer' },
  { label: 'Frontend Developer', value: 'Frontend Developer' },
  { label: 'Fullstack Developer', value: 'Fullstack Developer' },
  { label: 'Tech Lead', value: 'Tech Lead' },

  { label: 'Data Analyst', value: 'Data Analyst' },
  { label: 'Data Engineer', value: 'Data Engineer' },
  { label: 'BI Developer', value: 'BI Developer' },

  { label: 'DevOps Engineer', value: 'DevOps Engineer' },
  { label: 'SRE', value: 'SRE' },
  { label: 'Cloud Engineer', value: 'Cloud Engineer' },
  { label: 'Network Engineer', value: 'Network Engineer' },

  { label: 'UI/UX Designer', value: 'UI/UX Designer' },
  { label: 'UX Researcher', value: 'UX Researcher' },

  { label: 'QA Engineer', value: 'QA Engineer' },
  { label: 'QA Lead', value: 'QA Lead' },
  { label: 'Automation Tester', value: 'Automation Tester' },

  { label: 'Business Analyst (BA)', value: 'Business Analyst (BA)' },
  { label: 'Product Owner (PO)', value: 'Product Owner (PO)' },
  { label: 'Project Manager (IT)', value: 'Project Manager (IT)' },
]

export const SKILL_OPTIONS_BY_JOB_TITLE: Record<string, FilterOption[]> = {
  'Backend Developer': createOptions('Skills', [
    'Node.js',
    'Python',
    'Java',
    'Go',
    'REST API',
    'SQL',
    'PostgreSQL',
    'Redis',
    'Docker',
    'Microservices',
  ]),

  'Frontend Developer': createOptions('Skills', [
    'React',
    'Vue.js',
    'TypeScript',
    'HTML/CSS',
    'Webpack',
    'Redux',
    'Figma',
    'REST API',
    'Jest',
  ]),

  'Fullstack Developer': createOptions('Skills', [
    'React',
    'Node.js',
    'TypeScript',
    'SQL',
    'Docker',
    'REST API',
    'Git',
    'MongoDB',
    'AWS',
  ]),

  'Tech Lead': createOptions('Skills', [
    'Technical Leadership',
    'Architecture',
    'Code Review',
    'Agile',
    'Mentoring',
    'System Design',
    'Stakeholder Mgmt',
  ]),

  'Data Analyst': createOptions('Skills', [
    'SQL',
    'Python',
    'Excel',
    'Power BI',
    'Tableau',
    'Google Analytics',
    'Statistics',
    'Data Cleaning',
  ]),

  'Data Engineer': createOptions('Skills', [
    'Python',
    'Spark',
    'Airflow',
    'Kafka',
    'SQL',
    'AWS/GCP',
    'ETL',
    'dbt',
    'BigQuery',
    'Redshift',
  ]),

  'BI Developer': createOptions('Skills', [
    'Power BI',
    'Tableau',
    'SQL',
    'DAX',
    'Data Modeling',
    'ETL',
    'Storytelling',
  ]),

  'DevOps Engineer': createOptions('Skills', [
    'Docker',
    'Kubernetes',
    'CI/CD',
    'Jenkins',
    'GitHub Actions',
    'Terraform',
    'Ansible',
    'Linux',
    'AWS/GCP/Azure',
  ]),

  SRE: createOptions('Skills', [
    'Linux',
    'Monitoring',
    'Prometheus',
    'Grafana',
    'Incident Management',
    'Python',
    'SLO/SLA',
    'Kubernetes',
  ]),

  'Cloud Engineer': createOptions('Skills', [
    'AWS',
    'GCP',
    'Azure',
    'Terraform',
    'IAM',
    'VPC',
    'Cost Optimization',
    'CloudFormation',
  ]),

  'Network Engineer': createOptions('Skills', [
    'Cisco',
    'Routing/Switching',
    'Firewall',
    'VPN',
    'TCP/IP',
    'VLAN',
    'Network Security',
    'Wireshark',
  ]),

  'UI/UX Designer': createOptions('Skills', [
    'Figma',
    'User Research',
    'Wireframing',
    'Prototyping',
    'Usability Testing',
    'Design System',
    'Adobe XD',
  ]),

  'UX Researcher': createOptions('Skills', [
    'User Interviews',
    'Usability Testing',
    'Surveys',
    'Affinity Mapping',
    'Figma',
    'Report Writing',
    'Insight Synthesis',
  ]),

  'QA Engineer': createOptions('Skills', [
    'Test Cases',
    'Selenium',
    'Postman',
    'JIRA',
    'Regression Testing',
    'SQL',
    'Bug Reporting',
    'API Testing',
  ]),

  'QA Lead': createOptions('Skills', [
    'Test Strategy',
    'Team Lead',
    'CI/CD',
    'Automation Framework',
    'Performance Testing',
    'Mentoring',
    'Risk Analysis',
  ]),

  'Automation Tester': createOptions('Skills', [
    'Selenium',
    'Cypress',
    'Python',
    'Java',
    'CI/CD',
    'API Testing',
    'Playwright',
    'TestNG',
  ]),

  'Business Analyst (BA)': createOptions('Skills', [
    'Requirements Gathering',
    'Use Case',
    'User Stories',
    'BPMN',
    'SQL',
    'Jira',
    'Wireframing',
    'Stakeholder Mgmt',
    'Gap Analysis',
    'Agile',
  ]),

  'Product Owner (PO)': createOptions('Skills', [
    'Backlog Grooming',
    'User Stories',
    'Sprint Planning',
    'Acceptance Criteria',
    'Jira',
    'Agile',
    'Stakeholder Mgmt',
    'Roadmap',
  ]),

  'Project Manager (IT)': createOptions('Skills', [
    'Project Planning',
    'Agile/Waterfall',
    'Risk Management',
    'Stakeholder Mgmt',
    'Jira',
    'Budget',
    'PMP',
  ]),
}

export const ALL_SKILL_OPTIONS: FilterOption[] = [
  { label: 'Skills', value: '' },
  ...Array.from(
    new Set(
      Object.values(SKILL_OPTIONS_BY_JOB_TITLE)
        .flat()
        .map((item) => item.value)
        .filter(Boolean),
    ),
  ).map(createOption),
]

export function getAllSkillOptions(): FilterOption[] {
  return [
    { label: m.cv_hub_filter_skills(), value: '' },
    ...Array.from(
      new Set(
        Object.values(SKILL_OPTIONS_BY_JOB_TITLE)
          .flat()
          .map((item) => item.value)
          .filter(Boolean),
      ),
    ).map(createOption),
  ]
}

export function getSkillOptionsByJobTitle(jobTitle: string): FilterOption[] {
  const raw = SKILL_OPTIONS_BY_JOB_TITLE[jobTitle]
  if (!raw) return getAllSkillOptions()
  // Replace the static 'Skills' placeholder with the translated one
  return [{ label: m.cv_hub_filter_skills(), value: '' }, ...raw.slice(1)]
}

export function getYearsOfExperienceOptions(): FilterOption[] {
  return [
    { label: m.cv_hub_filter_experience(), value: '' },
    { label: 'Under 1 year', value: 'Under 1 year' },
    { label: '1-3 years', value: '1-3 years' },
    { label: '3-5 years', value: '3-5 years' },
    { label: '5+ years', value: '5+ years' },
  ]
}

export const YEARS_OF_EXPERIENCE_OPTIONS: FilterOption[] = [
  {
    label: 'Years of Experience',
    value: '',
  },
  {
    label: 'Under 1 year',
    value: 'Under 1 year',
  },
  {
    label: '1-3 years',
    value: '1-3 years',
  },
  {
    label: '3-5 years',
    value: '3-5 years',
  },
  {
    label: '5+ years',
    value: '5+ years',
  },
]

export function getLocationOptions(): FilterOption[] {
  return [
    { label: m.cv_hub_filter_location(), value: '' },
    { label: 'Hà Nội', value: 'Hà Nội' },
    { label: 'Đà Nẵng', value: 'Đà Nẵng' },
    { label: 'TP. HCM', value: 'TP. HCM' },
  ]
}

export const LOCATION_OPTIONS: FilterOption[] = [
  {
    label: 'Locations',
    value: '',
  },
  {
    label: 'Hà Nội',
    value: 'Hà Nội',
  },
  {
    label: 'Đà Nẵng',
    value: 'Đà Nẵng',
  },
  {
    label: 'TP. HCM',
    value: 'TP. HCM',
  },
]

export const WORK_TYPE_OPTIONS: FilterOption[] = [
  {
    label: 'Work Types',
    value: '',
  },
  {
    label: 'Remote',
    value: 'Remote',
  },
  {
    label: 'Onsite',
    value: 'Onsite',
  },
  {
    label: 'In-house',
    value: 'In-house',
  },
]

export function getWorkTypeOptions(): FilterOption[] {
  return [
    { label: m.cv_hub_filter_work_type(), value: '' },
    { label: 'Remote', value: 'Remote' },
    { label: 'Onsite', value: 'Onsite' },
    { label: 'In-house', value: 'In-house' },
  ]
}
