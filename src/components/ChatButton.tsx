import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Move, Mail, User, Coffee, Utensils, Bell, Phone, Heart, Map } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

const ChatButton = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [isGuestOpen, setIsGuestOpen] = useState(false);
  const [isGuestFormOpen, setIsGuestFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentGuestService, setCurrentGuestService] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isInDragMode, setIsInDragMode] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [position, setPosition] = useState(() => {
    // Try to get saved position from localStorage
    const savedPosition = localStorage.getItem('chatButtonPosition');
    return savedPosition ? JSON.parse(savedPosition) : { x: 0, y: 0 };
  });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const buttonStartPos = useRef({ x: 0, y: 0 });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Customer Support Request',
    message: '',
  });

  const [guestFormData, setGuestFormData] = useState({
    roomNumber: '',
    name: '',
    email: '',
    gender: '',
    request: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuestFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGuestFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save position to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('chatButtonPosition', JSON.stringify(position));
  }, [position]);

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isInDragMode) return;

    setIsDragging(true);

    // Get starting positions
    if ('touches' in e) {
      // Touch event
      dragStartPos.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    } else {
      // Mouse event
      dragStartPos.current = {
        x: e.clientX,
        y: e.clientY
      };
    }

    buttonStartPos.current = { ...position };

    // Add event listeners for drag and end
    if ('touches' in e) {
      document.addEventListener('touchmove', handleDragMove);
      document.addEventListener('touchend', handleDragEnd);
    } else {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
    }
  };

  // Handle drag move
  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;

    let clientX, clientY;

    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // Calculate new position
    const deltaX = clientX - dragStartPos.current.x;
    const deltaY = clientY - dragStartPos.current.y;

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Get button dimensions
    const buttonWidth = buttonRef.current?.offsetWidth || 56; // Default to 56px (14rem)
    const buttonHeight = buttonRef.current?.offsetHeight || 56;

    // Calculate bounds to keep button within viewport with some padding
    const padding = 16; // Reduced padding to allow button to be closer to the edge
    const minX = -viewportWidth + buttonWidth + padding;
    const maxX = viewportWidth - buttonWidth - padding;
    const minY = -viewportHeight + buttonHeight + padding;
    const maxY = viewportHeight - buttonHeight - padding;

    // Calculate new position with bounds
    const newX = Math.min(Math.max(buttonStartPos.current.x + deltaX, minX), maxX);
    const newY = Math.min(Math.max(buttonStartPos.current.y + deltaY, minY), maxY);

    // Update position
    setPosition({
      x: newX,
      y: newY
    });
  };

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);

    // Remove event listeners
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
    document.removeEventListener('touchmove', handleDragMove);
    document.removeEventListener('touchend', handleDragEnd);
  };

  // Toggle drag mode
  const toggleDragMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsInDragMode(!isInDragMode);
    if (isInDragMode) {
      toast.success('Drag mode disabled');
    } else {
      toast.success('Drag mode enabled. You can now reposition the chat button.');
    }
  };

  // Handle chat button click with animation
  const handleChatButtonClick = () => {
    if (isInDragMode) return;

    // Play click animation
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
      // Open welcome dialog after animation completes
      setIsWelcomeOpen(true);
    }, 300); // Match the animation duration
  };

  // Handle contact us button click
  const handleContactUsClick = () => {
    setIsWelcomeOpen(false);
    setTimeout(() => {
      setIsOpen(true);
    }, 100);
  };

  // Handle guest button click
  const handleGuestClick = () => {
    setIsWelcomeOpen(false);
    setTimeout(() => {
      setIsGuestOpen(true);
    }, 100);
  };

  // Handle guest service options
  const handleRoomServiceClick = () => {
    setIsGuestOpen(false);
    setCurrentGuestService('Room Service');
    setTimeout(() => {
      setGuestFormData({
        roomNumber: '',
        name: '',
        email: '',
        gender: '',
        request: 'I would like to order room service.',
      });
      setIsGuestFormOpen(true);
    }, 100);
  };

  const handleSpecialRequestClick = () => {
    setIsGuestOpen(false);
    setCurrentGuestService('Special Request');
    setTimeout(() => {
      setGuestFormData({
        roomNumber: '',
        name: '',
        email: '',
        gender: '',
        request: '',
      });
      setIsGuestFormOpen(true);
    }, 100);
  };

  const handleAssistanceClick = () => {
    setIsGuestOpen(false);
    setCurrentGuestService('Assistance');
    setTimeout(() => {
      setGuestFormData({
        roomNumber: '',
        name: '',
        email: '',
        gender: '',
        request: 'I need assistance with:',
      });
      setIsGuestFormOpen(true);
    }, 100);
  };

  const handleCallFrontDeskClick = () => {
    setIsGuestOpen(false);
    setCurrentGuestService('Front Desk Call');
    setTimeout(() => {
      setGuestFormData({
        roomNumber: '',
        name: '',
        email: '',
        gender: '',
        request: 'I would like to speak with the front desk about:',
      });
      setIsGuestFormOpen(true);
    }, 100);
  };

  const handleHealthSafetyClick = () => {
    setIsGuestOpen(false);
    setCurrentGuestService('Health & Safety');
    setTimeout(() => {
      setGuestFormData({
        roomNumber: '',
        name: '',
        email: '',
        gender: '',
        request: 'I need health or safety assistance with:',
      });
      setIsGuestFormOpen(true);
    }, 100);
  };

  const handleCityToursClick = () => {
    setIsGuestOpen(false);
    setCurrentGuestService('City Tours & Activities');
    setTimeout(() => {
      setGuestFormData({
        roomNumber: '',
        name: '',
        email: '',
        gender: '',
        request: 'I am interested in booking:',
      });
      setIsGuestFormOpen(true);
    }, 100);
  };

  // Handle guest form submission
  const handleGuestFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!guestFormData.roomNumber.trim() || !guestFormData.name.trim() || !guestFormData.email.trim() || !guestFormData.gender || !guestFormData.request.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestFormData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      // Format the message to include all guest information
      const formattedMessage = `
Room Number: ${guestFormData.roomNumber}
Guest Name: ${guestFormData.name}
Email: ${guestFormData.email}
Gender: ${guestFormData.gender}
Request: ${guestFormData.request}
      `.trim();

      // Create contact message data
      const contactData = {
        name: guestFormData.name,
        email: guestFormData.email, // Use the provided email
        subject: `${currentGuestService} Request`, // Use the service type as subject
        message: formattedMessage,
        phone: '' // Optional field
      };

      // Send to contact API
      await api.contact.submit(contactData);

      toast.success(`Your ${currentGuestService} request has been sent!`);
      setGuestFormData({
        roomNumber: '',
        name: '',
        email: '',
        gender: '',
        request: '',
      });
      setIsGuestFormOpen(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to send request. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.contact.submit(formData);
      toast.success('Your message has been sent! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: 'Customer Support Request',
        message: '',
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-0 right-0 z-50 w-full pointer-events-none">
        <div className="container mx-auto relative">
          <div
            className={`absolute bottom-6 right-[8%] md:right-[6%] lg:right-[4%] pointer-events-auto`}
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`,
              cursor: isInDragMode ? 'move' : 'pointer',
            }}
          >
            <button
              ref={buttonRef}
              onClick={isInDragMode ? undefined : handleChatButtonClick}
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
              className={`flex items-center justify-center w-14 h-14 rounded-full bg-[#C45D3A] text-white shadow-lg hover:bg-[#A74B2F] transition-colors duration-300 relative group
                ${!isInDragMode && !isDragging ? 'animate-float' : ''}
                ${isClicked ? 'animate-click' : ''}
              `}
              aria-label="Chat with us"
            >
              <MessageCircle className="h-6 w-6 relative z-10" />
              {/* Pulse animation (only when not in drag mode) */}
              {!isInDragMode && !isDragging && (
                <span className="absolute w-full h-full rounded-full bg-[#C45D3A] animate-ping opacity-75"></span>
              )}
              {/* Label */}
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-[#C45D3A] text-xs font-medium px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {isInDragMode ? 'Drag to reposition' : 'Chat with us'}
              </span>
            </button>

            {/* Drag toggle button */}
            <button
              onClick={toggleDragMode}
              className={`absolute -top-3 -right-3 w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-colors duration-200 z-20 ${isInDragMode ? 'bg-green-500 text-white' : 'bg-white text-[#C45D3A]'}`}
              aria-label={isInDragMode ? "Disable drag mode" : "Enable drag mode"}
            >
              <Move className="h-3 w-3" />
            </button>

            {/* Reset position button (only visible in drag mode) */}
            {isInDragMode && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPosition({ x: 0, y: 0 });
                  toast.success('Position reset');
                }}
                className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-white text-[#C45D3A] flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors duration-200 z-20"
                aria-label="Reset position"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Welcome Dialog */}
      <Dialog open={isWelcomeOpen} onOpenChange={setIsWelcomeOpen}>
        <DialogContent className="sm:max-w-[450px] max-w-[90vw] data-[state=open]:animate-welcome-in data-[state=closed]:animate-welcome-out bg-white rounded-lg border-none shadow-xl p-5">
          <DialogHeader className="pb-2 text-center">
            <DialogTitle className="text-[#8A5A44] text-2xl font-serif">
              Welcome to Macchiato Suites
            </DialogTitle>
            <DialogDescription className="text-base mt-2 text-[#332A27]">
              What can we help you with?
            </DialogDescription>
          </DialogHeader>

          <div className="mb-3 mt-2 space-y-2 text-center">
            <div className="p-2 rounded-md bg-[#F9F5F2] border border-[#E8C3A3]/30">
              <p className="text-xs text-[#8A5A44] leading-tight">
                <span className="font-medium">Guest Service</span> – For room services, special requests
              </p>
            </div>
            <div className="p-2 rounded-md bg-[#F9F5F2] border border-[#E8C3A3]/30">
              <p className="text-xs text-[#8A5A44] leading-tight">
                <span className="font-medium">Customer Service</span> – For inquiries, reservations, information
              </p>
            </div>
          </div>

          <div className="flex flex-row gap-4 mt-4 justify-center px-2">
            <Button
              onClick={handleContactUsClick}
              className="bg-[#C45D3A] hover:bg-[#A74B2F] text-white h-12 rounded-md transition-all duration-300 transform hover:scale-[1.02] shadow-md flex-1 px-2"
            >
              <Mail className="h-5 w-5 mr-1 flex-shrink-0" />
              <span className="whitespace-nowrap">Customer</span>
            </Button>

            <Button
              onClick={handleGuestClick}
              variant="outline"
              className="border-[#8A5A44] text-[#8A5A44] hover:bg-[#F9F5F2] h-12 rounded-md transition-all duration-300 transform hover:scale-[1.02] shadow-sm flex-1 px-2"
            >
              <User className="h-5 w-5 mr-1 flex-shrink-0" />
              <span className="whitespace-nowrap">Guest</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Guest Services Dialog */}
      <Dialog open={isGuestOpen} onOpenChange={setIsGuestOpen}>
        <DialogContent className="sm:max-w-[500px] max-w-[90vw] data-[state=open]:animate-welcome-in data-[state=closed]:animate-welcome-out bg-white rounded-lg border-none shadow-xl p-5">
          <DialogHeader className="pb-2 text-center">
            <DialogTitle className="text-[#8A5A44] text-2xl font-serif">
              Guest Services
            </DialogTitle>
            <DialogDescription className="text-base mt-2 text-[#332A27]">
              How can we assist you today?
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <Button
              onClick={handleRoomServiceClick}
              variant="outline"
              className="flex flex-col items-center justify-center h-24 p-2 border-[#E8C3A3] hover:bg-[#F9F5F2] hover:border-[#C45D3A] transition-all duration-300 group"
            >
              <Utensils className="h-8 w-8 mb-2 text-[#8A5A44] group-hover:text-[#C45D3A]" />
              <span className="text-xs font-medium text-[#8A5A44] group-hover:text-[#C45D3A]">Room Service</span>
            </Button>

            <Button
              onClick={handleSpecialRequestClick}
              variant="outline"
              className="flex flex-col items-center justify-center h-24 p-2 border-[#E8C3A3] hover:bg-[#F9F5F2] hover:border-[#C45D3A] transition-all duration-300 group"
            >
              <Coffee className="h-8 w-8 mb-2 text-[#8A5A44] group-hover:text-[#C45D3A]" />
              <span className="text-xs font-medium text-[#8A5A44] group-hover:text-[#C45D3A]">Special Request</span>
            </Button>

            <Button
              onClick={handleAssistanceClick}
              variant="outline"
              className="flex flex-col items-center justify-center h-24 p-2 border-[#E8C3A3] hover:bg-[#F9F5F2] hover:border-[#C45D3A] transition-all duration-300 group"
            >
              <Bell className="h-8 w-8 mb-2 text-[#8A5A44] group-hover:text-[#C45D3A]" />
              <span className="text-xs font-medium text-[#8A5A44] group-hover:text-[#C45D3A]">Assistance</span>
            </Button>

            <Button
              onClick={handleCallFrontDeskClick}
              variant="outline"
              className="flex flex-col items-center justify-center h-24 p-2 border-[#E8C3A3] hover:bg-[#F9F5F2] hover:border-[#C45D3A] transition-all duration-300 group"
            >
              <Phone className="h-8 w-8 mb-2 text-[#8A5A44] group-hover:text-[#C45D3A]" />
              <span className="text-xs font-medium text-[#8A5A44] group-hover:text-[#C45D3A]">Call Front Desk</span>
            </Button>

            <Button
              onClick={handleHealthSafetyClick}
              variant="outline"
              className="flex flex-col items-center justify-center h-24 p-2 border-[#E8C3A3] hover:bg-[#F9F5F2] hover:border-[#C45D3A] transition-all duration-300 group"
            >
              <Heart className="h-8 w-8 mb-2 text-[#8A5A44] group-hover:text-[#C45D3A]" />
              <span className="text-xs font-medium text-[#8A5A44] group-hover:text-[#C45D3A]">Health & Safety</span>
            </Button>

            <Button
              onClick={handleCityToursClick}
              variant="outline"
              className="flex flex-col items-center justify-center h-24 p-2 border-[#E8C3A3] hover:bg-[#F9F5F2] hover:border-[#C45D3A] transition-all duration-300 group"
            >
              <Map className="h-8 w-8 mb-2 text-[#8A5A44] group-hover:text-[#C45D3A]" />
              <span className="text-[10px] font-medium text-[#8A5A44] group-hover:text-[#C45D3A] leading-tight">City Tours & Activities</span>
            </Button>
          </div>

          <div className="mt-4 text-center">
            <Button
              onClick={() => setIsGuestOpen(false)}
              variant="ghost"
              className="text-xs text-[#8A5A44] hover:text-[#C45D3A] hover:bg-transparent"
            >
              <X className="h-3 w-3 mr-1" />
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Guest Form Dialog */}
      <Dialog open={isGuestFormOpen} onOpenChange={setIsGuestFormOpen}>
        <DialogContent className="sm:max-w-[400px] max-w-[90vw] data-[state=open]:animate-welcome-in data-[state=closed]:animate-welcome-out bg-white rounded-lg border-none shadow-xl p-5">
          <DialogHeader className="pb-2 text-center">
            <DialogTitle className="text-[#8A5A44] text-xl font-serif">
              {currentGuestService} Request
            </DialogTitle>
            <DialogDescription className="text-sm mt-1 text-[#332A27]">
              Please provide the following information
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleGuestFormSubmit} className="space-y-3 mt-3">
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="roomNumber" className="text-xs">Room Number <span className="text-red-500">*</span></Label>
                <Input
                  id="roomNumber"
                  name="roomNumber"
                  placeholder="e.g. 101"
                  value={guestFormData.roomNumber}
                  onChange={handleGuestFormChange}
                  required
                  className="h-8 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="guestName" className="text-xs">Name <span className="text-red-500">*</span></Label>
                <Input
                  id="guestName"
                  name="name"
                  placeholder="Your full name"
                  value={guestFormData.name}
                  onChange={handleGuestFormChange}
                  required
                  className="h-8 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="guestEmail" className="text-xs">Email <span className="text-red-500">*</span></Label>
                <Input
                  id="guestEmail"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={guestFormData.email}
                  onChange={handleGuestFormChange}
                  required
                  className="h-8 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="gender" className="text-xs">Gender <span className="text-red-500">*</span></Label>
                <select
                  id="gender"
                  name="gender"
                  value={guestFormData.gender}
                  onChange={handleGuestFormChange}
                  required
                  className="h-8 text-sm w-full rounded-md border border-input bg-background px-3 py-1 shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="request" className="text-xs">Request <span className="text-red-500">*</span></Label>
                <Textarea
                  id="request"
                  name="request"
                  placeholder="Please describe your request"
                  value={guestFormData.request}
                  onChange={handleGuestFormChange}
                  rows={3}
                  required
                  className="text-sm min-h-[80px]"
                />
              </div>
            </div>

            <DialogFooter className="pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsGuestFormOpen(false)}
                className="h-8 text-xs"
                size="sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#C45D3A] hover:bg-[#A74B2F] h-8 text-xs"
                disabled={isSubmitting}
                size="sm"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-1">⏳</span>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-3 w-3 mr-1" />
                    Submit
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Chat Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[320px] max-w-[85vw] mx-auto my-auto data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out bg-white rounded-lg border-none shadow-xl p-4">
          <DialogHeader className="pb-1">
            <DialogTitle className="text-[#8A5A44] flex items-center text-sm">
              <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
              Chat with Us
            </DialogTitle>
            <DialogDescription className="text-[10px]">
              Send us a message and we'll get back to you soon.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-2 mt-1">
            <div className="grid grid-cols-1 gap-2">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-[10px]">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="h-7 text-xs py-1"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="email" className="text-[10px]">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-7 text-xs py-1"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="message" className="text-[10px]">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={handleChange}
                  rows={2}
                  required
                  className="text-xs min-h-[60px] py-1"
                />
              </div>
            </div>

            <DialogFooter className="pt-1 gap-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="h-7 text-[10px] px-2"
                size="sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#C45D3A] hover:bg-[#A74B2F] h-7 text-[10px] px-2"
                disabled={isSubmitting}
                size="sm"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-1">⏳</span>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-2.5 w-2.5 mr-1" />
                    Send
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatButton;
