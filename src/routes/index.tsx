import { createFileRoute } from '@tanstack/react-router'
import { Footer } from '@/features/layout'
import { HomeScreen } from '@/features/marketplace'

export const Route = createFileRoute('/')({
  component: HomeRoute,
  staticData: { header: { active: 'home', divider: true } },
})

function HomeRoute() {
  return (
    <div className="pb-32 md:pb-0">
      <HomeScreen />
      <Footer />
    </div>
  )
}
