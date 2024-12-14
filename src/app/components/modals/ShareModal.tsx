import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { useToast } from "@/app/features/hooks/useToast"
import { Copy, Mail } from "lucide-react"

interface ShareModalProps {
  assetId: number
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function ShareModal({ assetId, isOpen, onOpenChange }: ShareModalProps) {
  const [shareUrl, setShareUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const createShareLink = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/shares", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId,
          expiresIn: 7 * 24 * 60 * 60 * 1000,
        }),
      })

      if (!response.ok) throw new Error("Failed to create share link")
      
      const { data } = await response.json()
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
      const shareUrl = `${baseUrl}/shared/${data}`
      setShareUrl(shareUrl)
      
      toast({
        variant: "default",
        title: "Success",
        description: "Share link created successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create share link",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast({
        variant: "default",
        title: "Success",
        description: "Link copied to clipboard",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy link",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Asset</DialogTitle>
          <DialogDescription>
            Create a shareable link to this asset
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          {!shareUrl ? (
            <Button
              onClick={createShareLink}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Creating..." : "Create share link"}
            </Button>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    void copyToClipboard();
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(`mailto:?body=${encodeURIComponent(shareUrl)}`)}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Share via email
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}