import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { useState } from "react"
import { useToast } from "@/app/features/hooks/useToast"
import { useRequestStore } from "@/app/features/stores/useRequestStore"

interface RequestModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RequestModal({ isOpen, onClose }: RequestModalProps) {
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const addRequest = useRequestStore((state) => state.addRequest)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      addRequest(name, description)
      toast({
        title: "Request submitted",
        description: "We'll review your request and get back to you soon.",
      })
      onClose()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit request",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request New Asset</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Asset name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">Submit Request</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 