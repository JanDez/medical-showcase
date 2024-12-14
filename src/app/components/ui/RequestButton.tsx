import { Button } from "@/app/components/ui/button"
import { PieChart } from "lucide-react"
import { useState } from "react"
import { RequestModal } from "../modals/RequestModal"

export function RequestButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button 
        onClick={() => setIsModalOpen(true)}
        className="gap-2"
        variant="default"
      >
        <PieChart className="h-4 w-4" />
        Request
      </Button>

      <RequestModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}