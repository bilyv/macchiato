import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface BookingFormDialogProps {
  trigger?: React.ReactNode;
  buttonText?: string;
  buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  buttonSize?: 'default' | 'sm' | 'lg' | 'icon';
  buttonClassName?: string;
  showArrow?: boolean;
}

export function BookingFormDialog({
  trigger,
  buttonText = 'Book Now',
  buttonVariant = 'default',
  buttonSize = 'default',
  buttonClassName = 'bg-[#C45D3A] hover:bg-[#A74B2F] text-white',
  showArrow = false,
}: BookingFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleBookingClick = () => {
    setIsOpen(false);
    toast.info("Online booking is currently unavailable. Please contact us directly to make a reservation.", {
      duration: 5000,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant={buttonVariant} size={buttonSize} className={buttonClassName}>
            {buttonText}
            {showArrow && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[600px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-[#8A5A44]">Book Your Stay</DialogTitle>
          <DialogDescription>
            Online booking is currently unavailable. Please contact us directly to make a reservation.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4 p-4">
          <p className="text-center text-muted-foreground">
            For reservations, please call us at <span className="font-medium">+1 (555) 123-4567</span> or email us at{' '}
            <span className="font-medium">reservations@macchiatosuites.com</span>
          </p>
          <Button onClick={handleBookingClick} className="w-full bg-[#8A5A44] hover:bg-[#6D4836] text-white">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
