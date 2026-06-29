import { readFileSync, writeFileSync } from 'fs'

// Resolve index.tsx conflict
const indexPath = 'src/presentation/features/cv/list/index.tsx'
let indexContent = readFileSync(indexPath, 'utf8')
const indexPattern =
  /<<<<<<< HEAD[\s\S]*?>>>>>>> f472bf7 \(fix: change notes to note\)/g
const indexReplacement = `                onUpdated={(updated) =>
                  setSelectedCv((prev) =>
                    prev ? { ...prev, ...updated, cv_file: prev.cv_file } : updated,
                  )
                }`
indexContent = indexContent.replace(indexPattern, indexReplacement)
writeFileSync(indexPath, indexContent, 'utf8')
console.log('index.tsx resolved')

// Resolve CvDetail.tsx conflicts — keep HEAD version (with || '' fallback and buildPayload)
const cvDetailPath = 'src/presentation/features/cv/CvDetail.tsx'
let cvContent = readFileSync(cvDetailPath, 'utf8')

// Pattern for formState initializers (3 occurrences) — keep HEAD side
cvContent = cvContent.replace(
  /<<<<<<< HEAD\n([\s\S]*?)=======\n[\s\S]*?>>>>>>> f472bf7 \(fix: change notes to note\)/g,
  '$1',
)
writeFileSync(cvDetailPath, cvContent, 'utf8')
console.log('CvDetail.tsx resolved')
