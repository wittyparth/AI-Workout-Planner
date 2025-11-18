"import GoalsIntegrated from "./goals-integrated"

export default function GoalsPage() {
  return <GoalsIntegrated />
}"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function GoalsPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to progress page where goals are now managed
    router.replace('/progress')
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Redirecting to Progress...</p>
      </div>
    </div>
  )
}