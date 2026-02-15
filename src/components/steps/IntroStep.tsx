import FormNavigation from "@/components/FormNavigation";

const IntroStep = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-black mb-2">Animal Health Certificate</h2>
      <p className="text-sm text-gray-500 mb-8">Pre-Appointment Intake Form</p>

      <div className="border border-gray-300 rounded p-4 mb-8 text-sm text-black leading-relaxed">
        Please complete this form at least <strong>3 days before</strong> your appointment.
        The appointment lasts <strong>1 hour</strong>. A <strong>£125 non-refundable deposit</strong> is
        required before booking.
      </div>

      <h3 className="text-lg font-semibold text-black mb-4">Key Reminders</h3>

      <ul className="list-disc pl-5 space-y-2 mb-8 text-sm text-black">
        <li>Complete the form fully and accurately</li>
        <li>Submit at least 3 days before your appointment</li>
        <li>Upload a copy of your rabies certificate if vaccination was done elsewhere</li>
        <li><strong>Original documents must be brought to the appointment</strong></li>
      </ul>

      <FormNavigation nextLabel="START FORM →" hideBack />
    </div>
  );
};

export default IntroStep;
