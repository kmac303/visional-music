import { useState } from "react";

function VJLessonRequestForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        message: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("/.netlify/functions/sendVJLessonRequest", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
    
        if (response.ok) {
            alert("VJ Lesson Request submitted successfully!");
            setFormData({ name: "", email: "", phoneNumber: "", message: "" });
        } else {
            alert("Error submitting request.");
        }
    };

    return (
        <section>
            <h1>VJ Lesson Request Form</h1>
            <h4>Lessons are done virtually using the TeamViewer application</h4>
        <form onSubmit={handleSubmit} action="">
            <div className="form-group">
            <label>
                Your Name: 
                <input required type="text" name="name" value={formData.name} onChange={handleChange} />
            </label>
            <label>
                Email: 
                <input required placeholder="email@address.com" type="email" name="email" value={formData.email} onChange={handleChange} />
            </label>
            <label>
                Phone Number: (optional)
                <input placeholder="555-555-5555" type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
            </label>
            <label>
                Message:
                <input requireed placeholder="Goals, experience, etc." name="message" value={formData.message} onChange={handleChange} />
            </label>
            </div>
            <button type="submit">Submit</button>
        </form>
        </section>
    );
}

export default VJLessonRequestForm;