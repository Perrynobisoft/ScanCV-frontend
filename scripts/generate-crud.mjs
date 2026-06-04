#!/usr/bin/env node
// ESM Node script to auto-generate CRUD endpoints and repository wiring
// Usage (always interactive):
//   npm run gen:crud
// or
//   node scripts/generate-crud.mjs

import fs from 'node:fs'
import path from 'node:path'
import { stdin as input, stdout as output } from 'node:process'
import readline from 'node:readline/promises'

const projectRoot = process.cwd()

function parseArgs(argv) {
  const args = {}
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i]
    if (arg.startsWith('--')) {
      const key = arg.slice(2)
      const next = argv[i + 1]
      if (next && !next.startsWith('--')) {
        args[key] = next
        i++
      } else {
        args[key] = true
      }
    }
  }
  return args
}

function toCamelCase(str) {
  return str.charAt(0).toLowerCase() + str.slice(1)
}

function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function parseFields(fieldsStr) {
  if (!fieldsStr) return []
  return fieldsStr
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((pair) => {
      const [name, typeRaw] = pair.split(':').map((x) => x.trim())
      if (!name || !typeRaw) {
        throw new Error(`Invalid field format: "${pair}". Expected name:type`)
      }
      return { name, type: typeRaw }
    })
}

async function promptInteractive(defaults = {}) {
  const rl = readline.createInterface({ input, output })
  try {
    const name =
      (await rl.question(
        `Entity name (PascalCase)${defaults.name ? ` [${defaults.name}]` : ''}: `,
      )) || defaults.name
    if (!name) throw new Error('Entity name is required')
    if (/[^A-Za-z0-9_]/.test(name))
      throw new Error('Entity name must be alphanumeric')

    const baseDefault = defaults.base || name.toLowerCase()
    const base =
      (await rl.question(
        `Base path (will use \${Prefix}/<path>) [${baseDefault}]: `,
      )) || baseDefault

    const entityFieldsStr = await rl.question(
      'Entity fields (e.g., id:number,name:string,isActive:boolean,createdAt:Date) [blank to use id:number]: ',
    )
    const createFieldsStr = await rl.question(
      'Create request fields (e.g., name:string,description?:string,isActive?:boolean): ',
    )

    const addToDiAnswer = (
      await rl.question('Register repository in DI? (Y/n) [Y]: ')
    )
      .trim()
      .toLowerCase()
    const addToDi =
      addToDiAnswer === '' || addToDiAnswer === 'y' || addToDiAnswer === 'yes'

    return {
      name,
      base,
      entityFields: entityFieldsStr || 'id:number',
      createFields: createFieldsStr || '',
      addToDi,
    }
  } finally {
    rl.close()
  }
}

function updateEndpoints(entityName, basePath) {
  const endpointsFile = path.join(projectRoot, 'src', 'shared', 'endpoints.ts')
  if (!fs.existsSync(endpointsFile)) {
    throw new Error(`Not found: ${endpointsFile}`)
  }
  const src = fs.readFileSync(endpointsFile, 'utf8')

  if (src.includes(`${entityName}: {`)) {
    console.log(
      `- Endpoints for ${entityName} already exist. Skipping endpoints update.`,
    )
    return
  }

  const openMarker = 'export const Endpoints = {'
  const openIdx = src.indexOf(openMarker)
  if (openIdx === -1) {
    throw new Error('Cannot locate Endpoints object start')
  }

  const closeIdx = src.lastIndexOf('}')
  if (closeIdx === -1) {
    throw new Error('Cannot locate Endpoints object end')
  }

  // Use pattern consistent with current endpoints - using Prefix variable
  const block =
    `  ${entityName}: {\n` +
    `    CREATE: \`\${Prefix}/${toCamelCase(entityName)}/create\`,\n` +
    `    UPDATE: \`\${Prefix}/${toCamelCase(entityName)}/:id\`,\n` +
    `    DELETE: \`\${Prefix}/${toCamelCase(entityName)}/:id\`,\n` +
    `    GET_ALL: \`\${Prefix}/${toCamelCase(entityName)}/getAll\`,\n` +
    `    GET: \`\${Prefix}/${toCamelCase(entityName)}/:id\`,\n` +
    `  },\n`

  const updated = src.slice(0, closeIdx) + block + src.slice(closeIdx)
  fs.writeFileSync(endpointsFile, updated, 'utf8')
  console.log(`✔ Updated endpoints.ts with ${entityName}`)
}

function createRepositoryImpl(entityName) {
  const repoDir = path.join(
    projectRoot,
    'src',
    'infrastructure',
    'repositories',
  )
  ensureDirSync(repoDir)
  const filePath = path.join(repoDir, `${entityName}RepositoryImpl.ts`)

  if (fs.existsSync(filePath)) {
    console.log(`- RepositoryImpl exists: ${filePath}. Skipping creation.`)
    return
  }

  // Update according to current pattern: use type imports and array instead of List interface
  const content =
    `import { type ResponseCommon } from '@/application/dto/response/ResponseCommon'\n` +
    `import { type ${entityName}Repository } from '@/application/repositories/${entityName}Repository'\n` +
    `import {\n` +
    `  type ${entityName},\n` +
    `  type Create${entityName}Request,\n` +
    `  type Update${entityName}Request,\n` +
    `} from '@/domain/models/${entityName}'\n` +
    `import {\n` +
    `  type DeleteCommonParams,\n` +
    `  type GetByIdCommonParams,\n` +
    `} from '@/domain/models/common/CommonParams'\n` +
    `import { type PaginationParams } from '@/domain/models/common/PaginationParams'\n` +
    `import {\n` +
    `  useDeleteApi,\n` +
    `  useGetApi,\n` +
    `  usePostApi,\n` +
    `  usePutApi,\n` +
    `} from '@/infrastructure/hooks/useApi'\n` +
    `import { Endpoints } from '@/shared/endpoints'\n` +
    `import { type QueryOptions } from '@/shared/types/react-query'\n\n` +
    `export const ${entityName}RepositoryImpl = (): ${entityName}Repository => ({\n` +
    `  getAll: (\n` +
    `    params?: PaginationParams,\n` +
    `    options?: QueryOptions<ResponseCommon<${entityName}[]>>,\n` +
    `  ) => {\n` +
    `    return useGetApi<ResponseCommon<${entityName}[]>>({\n` +
    `      endpoint: Endpoints.${entityName}.GET_ALL,\n` +
    `      queryParams: {\n` +
    `        ...(params || {}),\n` +
    `      },\n` +
    `      options,\n` +
    `    })\n` +
    `  },\n` +
    `  getById: (\n` +
    `    params: GetByIdCommonParams,\n` +
    `    options?: QueryOptions<ResponseCommon<${entityName}>>,\n` +
    `  ) => {\n` +
    `    return useGetApi<ResponseCommon<${entityName}>>({\n` +
    `      endpoint: Endpoints.${entityName}.GET,\n` +
    `      queryParams: {\n` +
    `        ...(params || {}),\n` +
    `      },\n` +
    `      options,\n` +
    `    })\n` +
    `  },\n` +
    `  create: () => {\n` +
    `    return usePostApi<Create${entityName}Request, ResponseCommon<${entityName}>>({\n` +
    `      endpoint: Endpoints.${entityName}.CREATE,\n` +
    `    })\n` +
    `  },\n` +
    `  update: () => {\n` +
    `    return usePutApi<Update${entityName}Request, ResponseCommon<${entityName}>>({\n` +
    `      endpoint: Endpoints.${entityName}.UPDATE,\n` +
    `    })\n` +
    `  },\n` +
    `  delete: (params: DeleteCommonParams) => {\n` +
    `    return useDeleteApi<any, ResponseCommon<boolean>>({\n` +
    `      endpoint: Endpoints.${entityName}.DELETE,\n` +
    `      queryParams: {\n` +
    `        ...(params || {}),\n` +
    `      },\n` +
    `    })\n` +
    `  },\n` +
    `})\n`

  fs.writeFileSync(filePath, content, 'utf8')
  console.log(`✔ Created repository: ${path.relative(projectRoot, filePath)}`)
}

function createDomainModels(entityName, entityFieldsStr, createFieldsStr) {
  const modelsDir = path.join(projectRoot, 'src', 'domain', 'models')
  ensureDirSync(modelsDir)
  const filePath = path.join(modelsDir, `${entityName}.ts`)

  if (fs.existsSync(filePath)) {
    console.log(`- Domain model exists: ${filePath}. Skipping creation.`)
    return
  }

  const entityFields = parseFields(entityFieldsStr || 'id:number')
  const createFields = parseFields(createFieldsStr || '')

  const entityBody = entityFields
    .map((f) => `  ${f.name}: ${f.type};`)
    .join('\n')
  const createBody = createFields.length
    ? createFields.map((f) => `  ${f.name}: ${f.type};`).join('\n')
    : ''

  const content =
    `export interface ${entityName} {\n` +
    (entityBody ? entityBody + '\n' : '') +
    `}\n\n` +
    `export interface Create${entityName}Request {\n` +
    (createBody ? createBody + '\n' : '') +
    `}\n\n` +
    `export interface Update${entityName}Request extends Partial<Create${entityName}Request> {\n` +
    `  id: number;\n` +
    `}\n`

  fs.writeFileSync(filePath, content, 'utf8')
  console.log(
    `✔ Created domain models: ${path.relative(projectRoot, filePath)}`,
  )
}

function updateRepositoriesProvider(entityName) {
  const providerFile = path.join(
    projectRoot,
    'src',
    'di',
    'RepositoriesProvider.tsx',
  )
  if (!fs.existsSync(providerFile)) {
    throw new Error(`Not found: ${providerFile}`)
  }
  let src = fs.readFileSync(providerFile, 'utf8')

  const implImport = `import { ${entityName}RepositoryImpl } from '@/infrastructure/repositories/${entityName}RepositoryImpl';`
  if (!src.includes(implImport)) {
    // Insert after the last import from infrastructure/repositories
    const importBlockEndIdx = (() => {
      const lines = src.split('\n')
      let idx = -1
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('import ')) idx = i
        if (lines[i].trim() === '') break // stop at first empty line after imports
      }
      return idx
    })()
    if (importBlockEndIdx >= 0) {
      const lines = src.split('\n')
      lines.splice(importBlockEndIdx + 1, 0, implImport)
      src = lines.join('\n')
    } else {
      src = implImport + '\n' + src
    }
  }

  const repoPropName = `${toCamelCase(entityName)}Repository`

  // Update RepositoryContainer interface
  const interfaceStart = src.indexOf('export interface RepositoryContainer {')
  if (interfaceStart === -1)
    throw new Error('Cannot find RepositoryContainer interface')
  const interfaceEnd = src.indexOf('}', interfaceStart)
  const beforeInterface = src.slice(0, interfaceEnd)
  const afterInterface = src.slice(interfaceEnd)
  if (
    !beforeInterface.includes(
      `${repoPropName}: ReturnType<typeof ${entityName}RepositoryImpl>;`,
    )
  ) {
    src =
      beforeInterface +
      `  ${repoPropName}: ReturnType<typeof ${entityName}RepositoryImpl>;\n` +
      afterInterface
  }

  // Update repositories object in useMemo
  const memoStart = src.indexOf('useMemo<RepositoryContainer>(')
  if (memoStart === -1) throw new Error('Cannot find useMemo for repositories')
  const objStart = src.indexOf('({', memoStart)
  const objEnd = src.indexOf('})', objStart)
  const objBefore = src.slice(0, objEnd)
  const objAfter = src.slice(objEnd)
  if (!objBefore.includes(`${repoPropName}: ${entityName}RepositoryImpl(),`)) {
    // Insert before closing
    const insertionPoint = objBefore.lastIndexOf('  ')
    const updatedObjBefore =
      objBefore + `\n      ${repoPropName}: ${entityName}RepositoryImpl(),`
    src = updatedObjBefore + objAfter
  }

  fs.writeFileSync(providerFile, src, 'utf8')
  console.log(`✔ Updated RepositoriesProvider with ${repoPropName}`)
}

function ensurePackageScript() {
  const packageJsonPath = path.join(projectRoot, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  pkg.scripts = pkg.scripts || {}
  if (!pkg.scripts['gen:api']) {
    pkg.scripts['gen:api'] = 'node scripts/generate-crud.mjs'
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(pkg, null, 2) + '\n',
      'utf8',
    )
    console.log('✔ Added npm script: gen:api')
  } else {
    console.log('- npm script gen:api already exists.')
  }
}

function createRepositoryInterface(entityName) {
  const appRepoDir = path.join(
    projectRoot,
    'src',
    'application',
    'repositories',
  )
  ensureDirSync(appRepoDir)
  const filePath = path.join(appRepoDir, `${entityName}Repository.ts`)

  if (fs.existsSync(filePath)) {
    console.log(
      `- Application repository exists: ${filePath}. Skipping creation.`,
    )
    return
  }

  // Update according to current pattern: consistent path aliases and type imports
  const content =
    `import {\n` +
    `  type ${entityName},\n` +
    `  type Create${entityName}Request,\n` +
    `  type Update${entityName}Request,\n` +
    `} from '@/domain/models/${entityName}'\n` +
    `import {\n` +
    `  type DeleteCommonParams,\n` +
    `  type GetByIdCommonParams,\n` +
    `} from '@/domain/models/common/CommonParams'\n` +
    `import {\n` +
    `  type useDeleteApi,\n` +
    `  type useGetApi,\n` +
    `  type usePostApi,\n` +
    `  type usePutApi,\n` +
    `} from '@/infrastructure/hooks/useApi'\n` +
    `import { type QueryOptions } from '@/shared/types/react-query'\n` +
    `import { type ResponseCommon } from '@/application/dto/response/ResponseCommon'\n` +
    `import type { PaginationParams } from '@/domain/models/common/PaginationParams'\n\n` +
    `export interface ${entityName}Repository {\n` +
    `  getAll: (\n` +
    `    params?: PaginationParams,\n` +
    `    options?: QueryOptions<ResponseCommon<${entityName}[]>>,\n` +
    `  ) => ReturnType<typeof useGetApi<ResponseCommon<${entityName}[]>>>\n` +
    `  getById: (\n` +
    `    params: GetByIdCommonParams,\n` +
    `    options?: QueryOptions<ResponseCommon<${entityName}>>,\n` +
    `  ) => ReturnType<typeof useGetApi>\n` +
    `  create: () => ReturnType<\n` +
    `    typeof usePostApi<Create${entityName}Request, ResponseCommon<${entityName}>>\n` +
    `  >\n` +
    `  update: () => ReturnType<\n` +
    `    typeof usePutApi<Update${entityName}Request, ResponseCommon<${entityName}>>\n` +
    `  >\n` +
    `  delete: (\n` +
    `    params: DeleteCommonParams,\n` +
    `  ) => ReturnType<typeof useDeleteApi<any, ResponseCommon<boolean>>>\n` +
    `}\n`

  fs.writeFileSync(filePath, content, 'utf8')
  console.log(
    `✔ Created application repository interface: ${path.relative(projectRoot, filePath)}`,
  )
}

function createPresentationHooks(entityName) {
  const hooksBaseDir = path.join(
    projectRoot,
    'src',
    'presentation',
    'hooks',
    toCamelCase(entityName),
  )
  ensureDirSync(hooksBaseDir)

  const repoProp = `${toCamelCase(entityName)}Repository`

  const listHookPath = path.join(
    hooksBaseDir,
    `useGetAll${toCamelCase(entityName)}.tsx`,
  )
  if (!fs.existsSync(listHookPath)) {
    const listContent =
      `import { useRepository } from '@/di/RepositoriesProvider'\n` +
      `import { type PaginationParams } from '@/domain/models/common/PaginationParams'\n` +
      `import { type QueryOptions } from '@/shared/types/react-query'\n` +
      `export const useGetAll${toCamelCase(entityName)} = (\n` +
      `  params?: PaginationParams,\n` +
      `  options?: QueryOptions,\n` +
      `) => {\n` +
      `  const { ${repoProp} } = useRepository()\n` +
      `  const query = ${repoProp}.getAll(params, options)\n\n` +
      `  return {\n` +
      `    result: query.data,\n` +
      `    ...query,\n` +
      `  }\n` +
      `}\n`
    fs.writeFileSync(listHookPath, listContent, 'utf8')
    console.log(`✔ Created hook: ${path.relative(projectRoot, listHookPath)}`)
  }

  const detailHookPath = path.join(
    hooksBaseDir,
    `useGet${toCamelCase(entityName)}ById.tsx`,
  )
  if (!fs.existsSync(detailHookPath)) {
    const detailContent =
      `import { useRepository } from '@/di/RepositoriesProvider'\n` +
      `import { type GetByIdCommonParams } from '@/domain/models/common/CommonParams'\n` +
      `import { type QueryOptions } from '@/shared/types/react-query'\n` +
      `export const useGet${toCamelCase(entityName)}ById = (\n` +
      `  params: GetByIdCommonParams,\n` +
      `  options?: QueryOptions,\n` +
      `) => {\n` +
      `  const { ${repoProp} } = useRepository()\n` +
      `  const query = ${repoProp}.getById(params, options)\n\n` +
      `  return {\n` +
      `    result: query.data,\n` +
      `    ...query,\n` +
      `  }\n` +
      `}\n`
    fs.writeFileSync(detailHookPath, detailContent, 'utf8')
    console.log(`✔ Created hook: ${path.relative(projectRoot, detailHookPath)}`)
  }

  const createHookPath = path.join(
    hooksBaseDir,
    `useCreate${toCamelCase(entityName)}.tsx`,
  )
  if (!fs.existsSync(createHookPath)) {
    const createContent =
      `import { type ResponseCommon } from '@/application/dto/response/ResponseCommon'\n` +
      `import { useRepository } from '@/di/RepositoriesProvider'\n` +
      `import { type Create${entityName}Request, type ${entityName} } from '@/domain/models/${entityName}'\n\n` +
      `export const useCreate${toCamelCase(entityName)} = () => {\n` +
      `  const { ${repoProp} } = useRepository()\n` +
      `  const { mutate: create, ...rest } = ${repoProp}.create()\n\n` +
      `  return {\n` +
      `    create: (\n` +
      `      requestData: Create${entityName}Request,\n` +
      `      onSuccess?: () => void,\n` +
      `    ) => {\n` +
      `      create(requestData, {\n` +
      `        onSuccess: (_data: ResponseCommon<${entityName}>) => {\n` +
      `          onSuccess?.()\n` +
      `        },\n` +
      `        onError: (_error: any) => {},\n` +
      `      })\n` +
      `    },\n` +
      `    ...rest,\n` +
      `  }\n` +
      `}\n`
    fs.writeFileSync(createHookPath, createContent, 'utf8')
    console.log(`✔ Created hook: ${path.relative(projectRoot, createHookPath)}`)
  }

  const updateHookPath = path.join(
    hooksBaseDir,
    `useUpdate${toCamelCase(entityName)}.tsx`,
  )
  if (!fs.existsSync(updateHookPath)) {
    const updateContent =
      `import { type ResponseCommon } from '@/application/dto/response/ResponseCommon'\n` +
      `import { useRepository } from '@/di/RepositoriesProvider'\n` +
      `import { type Update${entityName}Request, type ${entityName} } from '@/domain/models/${entityName}'\n\n` +
      `export const useUpdate${toCamelCase(entityName)} = () => {\n` +
      `  const { ${repoProp} } = useRepository()\n` +
      `  const { mutate: update, ...rest } = ${repoProp}.update()\n\n` +
      `  return {\n` +
      `    update: (requestData: Update${entityName}Request, onSuccess?: () => void) => {\n` +
      `      update(requestData, {\n` +
      `        onSuccess: (_data: ResponseCommon<${entityName}>) => {\n` +
      `          onSuccess?.()\n` +
      `        },\n` +
      `        onError: (_error: any) => {},\n` +
      `      })\n` +
      `    },\n` +
      `    ...rest,\n` +
      `  }\n` +
      `}\n`
    fs.writeFileSync(updateHookPath, updateContent, 'utf8')
    console.log(`✔ Created hook: ${path.relative(projectRoot, updateHookPath)}`)
  }

  const deleteHookPath = path.join(
    hooksBaseDir,
    `useDelete${toCamelCase(entityName)}.tsx`,
  )
  if (!fs.existsSync(deleteHookPath)) {
    const deleteContent =
      `import { type ResponseCommon } from '@/application/dto/response/ResponseCommon'\n` +
      `import { useRepository } from '@/di/RepositoriesProvider'\n` +
      `import { type DeleteCommonParams } from '@/domain/models/common/CommonParams'\n\n` +
      `export const useDelete${toCamelCase(entityName)} = (params: DeleteCommonParams) => {\n` +
      `  const { ${repoProp} } = useRepository()\n` +
      `  const { mutate: remove, ...rest } = ${repoProp}.delete(params)\n` +
      `  return {\n` +
      `    remove: (params: DeleteCommonParams, onSuccess?: () => void) => {\n` +
      `      remove(params, {\n` +
      `        onSuccess: (_data: ResponseCommon<boolean>) => {\n` +
      `          onSuccess?.()\n` +
      `        },\n` +
      `        onError: (_error: any) => {},\n` +
      `      })\n` +
      `    },\n` +
      `    ...rest,\n` +
      `  }\n` +
      `}\n`
    fs.writeFileSync(deleteHookPath, deleteContent, 'utf8')
    console.log(`✔ Created hook: ${path.relative(projectRoot, deleteHookPath)}`)
  }
}

async function main() {
  // Always ask interactively
  const answers = await promptInteractive({})
  const entityName = answers.name
  let base = answers.base
  const entityFields = answers.entityFields
  const createFields = answers.createFields
  const addToDi = answers.addToDi

  if (!entityName || /[^A-Za-z0-9_]/.test(entityName)) {
    console.error(
      'Error: Entity name is required and must be alphanumeric (e.g., Product)',
    )
    process.exit(1)
  }
  base = base || entityName.toLowerCase()

  updateEndpoints(entityName, base)
  createRepositoryInterface(entityName)
  createDomainModels(entityName, entityFields, createFields)
  createRepositoryImpl(entityName)
  createPresentationHooks(entityName)
  if (addToDi) updateRepositoriesProvider(entityName)
  ensurePackageScript()

  console.log('\nDone. Next steps:')
  console.log(
    `- Use in components via useRepository(): const { ${toCamelCase(entityName)}Repository } = useRepository();`,
  )
  console.log(
    `- Example: const query = ${toCamelCase(entityName)}Repository.getAll({ skipCount: 0, maxResultCount: 10 });`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
