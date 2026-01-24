import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle, Mail, Send } from "lucide-react";

interface ContactMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    name: string;
    email: string;
    phone: string;
    company: string;
    message: string;
  };
  onComplete: () => void;
}

const ContactMethodDialog = ({
  open,
  onOpenChange,
  formData,
  onComplete,
}: ContactMethodDialogProps) => {
  const whatsappNumber = "919423840960";

  const createWhatsAppMessage = () => {
    return encodeURIComponent(
      `*New Inquiry from XView Global Website*\n\n` +
        `*Name:* ${formData.name}\n` +
        `*Email:* ${formData.email}\n` +
        `${formData.phone ? `*Phone:* ${formData.phone}\n` : ""}` +
        `${formData.company ? `*Company:* ${formData.company}\n` : ""}` +
        `*Message:*\n${formData.message}`
    );
  };

  const createEmailContent = () => {
    const subject = encodeURIComponent(`New Inquiry from ${formData.name} - XView Global Website`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `${formData.phone ? `Phone: ${formData.phone}\n` : ""}` +
        `${formData.company ? `Company: ${formData.company}\n` : ""}` +
        `\nMessage:\n${formData.message}`
    );
    return { subject, body };
  };

  const handleWhatsApp = () => {
    const message = createWhatsAppMessage();
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
    onComplete();
    onOpenChange(false);
  };

  const handleEmail = () => {
    const { subject, body } = createEmailContent();
    window.location.href = `mailto:contact@xviewglobal.com?subject=${subject}&body=${body}`;
    onComplete();
    onOpenChange(false);
  };

  const handleBoth = () => {
    // Open WhatsApp first
    const message = createWhatsAppMessage();
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");

    // Then open email with a slight delay
    setTimeout(() => {
      const { subject, body } = createEmailContent();
      window.location.href = `mailto:contact@xviewglobal.com?subject=${subject}&body=${body}`;
    }, 500);

    onComplete();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How would you like to contact us?</DialogTitle>
          <DialogDescription>
            Your inquiry has been saved. Choose how you'd like to send your message.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            variant="outline"
            className="w-full justify-start h-auto py-4"
            onClick={handleWhatsApp}
          >
            <MessageCircle className="h-5 w-5 mr-3 text-primary" />
            <div className="text-left">
              <div className="font-semibold">WhatsApp</div>
              <div className="text-sm text-muted-foreground">
                Quick response via WhatsApp chat
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start h-auto py-4"
            onClick={handleEmail}
          >
            <Mail className="h-5 w-5 mr-3 text-secondary" />
            <div className="text-left">
              <div className="font-semibold">Email</div>
              <div className="text-sm text-muted-foreground">
                Send via your email client
              </div>
            </div>
          </Button>

          <Button
            className="w-full justify-start h-auto py-4"
            onClick={handleBoth}
          >
            <Send className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-semibold">Send Both</div>
              <div className="text-sm text-muted-foreground">
                Contact via WhatsApp and Email
              </div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactMethodDialog;
