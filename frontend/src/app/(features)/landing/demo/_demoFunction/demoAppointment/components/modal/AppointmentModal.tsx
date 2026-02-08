'use client'
import { useState } from "react";
import { X } from "lucide-react";

interface AppointmentModalProps {
  onClose: () => void;
  onBook: (type: 'today' | 'upcoming', time?: string, date?: string, name?: string, job?: string) => void;
}

const AppointmentModal = ({ onClose, onBook }: AppointmentModalProps) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [job, setJob] = useState("");
  const [reason, setReason] = useState("");
  const today = new Date().toLocaleDateString('en-CA');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !name || !job || !selectedTime) return; 

    const bookingDate = selectedDate;
    const type: 'today' | 'upcoming' = bookingDate === today ? 'today' : 'upcoming';
    onBook(type, selectedTime || undefined, bookingDate, name, job);
  };

  const jobOptions = [
    "2nd Mate",
    "Crew",
    "Cadet",
    "1st Mate",
    "Cook",
    "Electrician Trainee",
    "Bosun"
  ];

  const appointmentOptions = [
    "Document submission",
    "Consultation",
    "Evaluation",
    "Interview",
    "Orientation",
    "Meeting",
    "Claim filing"
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Book Appointment</h2>
          <button onClick={onClose} className="modal-close-btn">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group-holder">
              <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="job">Job Title</label>
              <select
                id="job"
                value={job}
                onChange={(e) => setJob(e.target.value)}
                required
                className="select-option"
              >
                <option value="">Select a job title</option>
                {jobOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="reasong">Purpose of Appointment</label>
            <select 
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            >
              <option value="">Select reason</option>
              {appointmentOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="date">Arrival Date</label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={today}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="time">Arrival Time</label>
            <input
              type="time"
              id="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="book-btn">Book Now</button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;