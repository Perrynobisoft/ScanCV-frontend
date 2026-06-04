import { m } from '@/paraglide/messages'
import { useNavigate, useRouter } from '@tanstack/react-router'

type GeneralErrorProps = React.HTMLAttributes<HTMLDivElement> & {
  minimal?: boolean
}

export function GeneralError({ minimal = false }: GeneralErrorProps) {
  const navigate = useNavigate()
  const { history } = useRouter()
  return (
    <div className={'h-svh w-full'}>
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        {!minimal && (
          <h1 className="text-[7rem] leading-tight font-bold">500</h1>
        )}
        <span className="font-medium">{m.error_general_title()}</span>
        <p className="text-muted-foreground text-center">
          {m.error_general_description()}
        </p>
        {!minimal && (
          <div className="mt-6 flex gap-4">
            <button onClick={() => history.go(-1)}>{m.error_go_back()}</button>
            <button onClick={() => navigate({ to: '/' })}>
              {m.error_back_home()}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
