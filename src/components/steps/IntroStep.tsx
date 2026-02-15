import FormNavigation from "@/components/FormNavigation";
import logo from "@/assets/logo.png";
import { ClipboardCheck, Clock, Upload, FileText } from "lucide-react";

const IntroStep = () => {
  return (
    <div className="animate-fade-in">
      <div className="flex justify-center mb-6">
        <img src={logo} alt="Every Tail Vets" className="h-10 object-contain" />
      </div>

      <h1 className="text-4xl md:text-5xl text-center mb-2">
        Animal Health Certificate
      </h1>
      <p className="text-center text-sm text-muted-foreground mb-10 tracking-wide">
        Pre-Appointment Intake Form
      </p>

      <div className="reminder-box mb-10">
        <p className="text-sm leading-relaxed">
          Please complete this form at least <strong>3 days before</strong> your appointment. 
          The appointment lasts <strong>1 hour</strong>. A <strong>£125 non-refundable deposit</strong> is 
          required before booking.
        </p>
      </div>

      <div className="space-y-5 mb-12">
        <h2 className="text-2xl mb-4">Key Reminders</h2>
        
        <div className="flex gap-4 items-start">
          <div className="p-2.5 rounded-xl bg-secondary flex-shrink-0">
            <ClipboardCheck className="w-4 h-4 text-primary" />
          </div>
          <p className="text-sm pt-1">Complete the form fully and accurately</p>
        </div>

        <div className="flex gap-4 items-start">
          <div className="p-2.5 rounded-xl bg-secondary flex-shrink-0">
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <p className="text-sm pt-1">Submit at least 3 days before your appointment</p>
        </div>

        <div className="flex gap-4 items-start">
          <div className="p-2.5 rounded-xl bg-secondary flex-shrink-0">
            <Upload className="w-4 h-4 text-primary" />
          </div>
          <p className="text-sm pt-1">Upload a copy of your rabies certificate if vaccination was done elsewhere</p>
        </div>

        <div className="flex gap-4 items-start">
          <div className="p-2.5 rounded-xl bg-secondary flex-shrink-0">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <p className="text-sm pt-1"><strong>Original documents must be brought to the appointment</strong></p>
        </div>
      </div>

      <FormNavigation nextLabel="Start Form →" hideBack />
    </div>
  );
};

export default IntroStep;
