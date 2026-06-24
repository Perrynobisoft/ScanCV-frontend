import { formatScore } from './utils'

type ScoreCircleProps = {
  score?: number
}

export default function ScoreCircle({ score }: ScoreCircleProps) {
  const scoreText = formatScore(score)
  const scoreLength = scoreText.length
  const scoreSizeClass =
    scoreLength <= 3
      ? 'text-5xl'
      : scoreLength <= 5
        ? 'text-4xl'
        : scoreLength <= 7
          ? 'text-3xl'
          : 'text-2xl'

  return (
    <div className="flex h-36 w-36 items-center justify-center rounded-full border border-dashed border-slate-300 bg-slate-50">
      <div className="flex h-28 w-28 items-center justify-center rounded-full border-[3px] border-accent bg-slate-50">
        <span
          className={`block max-w-24 overflow-hidden text-ellipsis whitespace-nowrap text-center font-bold leading-none text-accent tabular-nums ${scoreSizeClass}`}
          title={scoreText}
        >
          {scoreText}
        </span>
      </div>
    </div>
  )
}
