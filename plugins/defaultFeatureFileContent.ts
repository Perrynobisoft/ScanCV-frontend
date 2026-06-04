import fs from 'fs'
import path from 'path'

export function ensureFileHasDefautCode(
  filePath: string,
  defaultCode: string,
  targetDirs: string[], // specify directories to monitor
) {
  // Check if file belongs to specified directory
  const inTargetDir = targetDirs.some((dir) => {
    return filePath.startsWith(path.resolve(dir))
  })

  if (!inTargetDir) return

  if (!fs.existsSync(filePath)) return

  const content = fs.readFileSync(filePath, 'utf-8')
  if (content.trim() === '') {
    fs.writeFileSync(filePath, defaultCode, 'utf-8')
    // eslint-disable-next-line no-console
    console.log(`✅ Default code inserted into: ${filePath}`)
  }
}
