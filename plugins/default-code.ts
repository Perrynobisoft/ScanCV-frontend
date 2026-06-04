export const defaultCodeFeature = (fileName: string) => {
  return `export default function ${fileName}() {
    return <div>${fileName} Component</div>
  }
  `
}
