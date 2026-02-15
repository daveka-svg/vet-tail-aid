import FormNavigation from "@/components/FormNavigation";
import { ClipboardCheck, Clock, Upload, FileText } from "lucide-react";

const IntroStep = () => {
  return (
    <div className="animate-fade-in">
      <h1
        className="text-4xl md:text-5xl text-center text-primary mb-3"
        style={{ fontFamily: "'That That New', Georgia, serif", fontWeight: 400, lineHeight: 1.1 }}
      >
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

      <h2
        className="text-2xl text-foreground mb-6"
        style={{ fontFamily: "'That That New', Georgia, serif", fontWeight: 400 }}
      >
        Key Reminders
      </h2>

      <div className="space-y-4 mb-10">
        <div className="flex gap-4 items-center">
          <div className="p-2.5 rounded-xl bg-secondary flex-shrink-0">
            <ClipboardCheck className="w-4 h-4 text-primary" />
          </div>
          <p className="text-sm">Complete the form fully and accurately</p>
        </div>

        <div className="flex gap-4 items-center">
          <div className="p-2.5 rounded-xl bg-secondary flex-shrink-0">
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <p className="text-sm">Submit at least 3 days before your appointment</p>
        </div>

        <div className="flex gap-4 items-center">
          <div className="p-2.5 rounded-xl bg-secondary flex-shrink-0">
            <Upload className="w-4 h-4 text-primary" />
          </div>
          <p className="text-sm">Upload a copy of your rabies certificate if vaccination was done elsewhere</p>
        </div>

        <div className="flex gap-4 items-center">
          <div className="p-2.5 rounded-xl bg-secondary flex-shrink-0">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <p className="text-sm"><strong>Original documents must be brought to the appointment</strong></p>
        </div>
      </div>

      <FormNavigation nextLabel="START FORM →" hideBack />
    </div>
  );
};

export default IntroStep;
