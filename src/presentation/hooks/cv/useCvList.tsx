import { useMemo } from 'react'
import type { CvItem } from '@/domain/models/Cv'

const cvList: CvItem[] = [
  {
    id: 1,
    candidateName: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    position: 'Senior Frontend Architect',
    skills: ['React', 'TypeScript', 'Tailwind'],
    uploadDate: '2024-05-24T12:00:00Z',
    owner: 'Michael R.',
  },
  {
    id: 2,
    candidateName: 'James Blackwell',
    email: 'j.blackwell@techhub.io',
    position: 'DevOps Specialist',
    skills: ['AWS', 'Kubernetes', 'Terraform'],
    uploadDate: '2024-05-22T12:00:00Z',
    owner: 'You',
  },
  {
    id: 3,
    candidateName: 'Amara Miller',
    email: 'amara.m@designstudio.co',
    position: 'Product Designer',
    skills: ['Figma', 'Design Systems', 'UX'],
    uploadDate: '2024-05-20T12:00:00Z',
    owner: 'Linda K.',
  },
]

export const useCvList = () => {
  const data = useMemo(() => cvList, [])
  return { data }
}
