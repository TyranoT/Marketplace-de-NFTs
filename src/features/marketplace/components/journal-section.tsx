import { JOURNAL_POSTS, JOURNAL_SECTION } from '../constants/journal'
import { JournalCard } from './journal-card'

export function JournalSection() {
  const { title, subtitle } = JOURNAL_SECTION

  return (
    <section aria-labelledby="journal-title" className="flex flex-col gap-10">
      <div className="flex flex-col items-center gap-2.5 text-center">
        <h2
          id="journal-title"
          className="text-28 leading-9 font-bold text-foreground"
        >
          {title}
        </h2>
        <p className="text-14 leading-6 text-text-secondary">{subtitle}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {JOURNAL_POSTS.map((post) => (
          <JournalCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}
