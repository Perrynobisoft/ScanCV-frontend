import { m } from '@/paraglide/messages'

export function MaintenanceError() {
  return (
    <div className="h-svh">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] leading-tight font-bold">503</h1>
        <span className="font-medium">{m.error_maintenance_title()}</span>
        <p className="text-muted-foreground text-center">
          {m.error_maintenance_description()}
        </p>
        <div className="mt-6 flex gap-4">
          <button>{m.error_learn_more()}</button>
        </div>
      </div>
    </div>
  )
}
