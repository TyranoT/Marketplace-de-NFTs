import { createFileRoute } from '@tanstack/react-router'
import { Footer } from '@/features/layout'

export const Route = createFileRoute('/')({
  component: App,
  staticData: { header: { active: 'home', divider: true } },
})

function App() {
  return (
    <>
      <main />
      <Footer />
    </>
  )
}
