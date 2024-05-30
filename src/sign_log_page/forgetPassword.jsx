import React, { useState } from "react";
import './App.css';
import axios from 'axios';
import forget from '/forgetPassword.svg';

export default function ForgetPassword() {
    const [emails, setEmails] = useState("");
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSendResetEmail = async (e) => {
        e.preventDefault();
        const emailList = emails.split(',').map(email => email.trim());
        try {
            const response = await axios.post("https://localhost:7125/send-reset-email", { emails: emailList });
            if (response.status === 200) {
                setIsEmailSent(true);
                setErrorMessage("");
            } else {
                setErrorMessage(response.data.message || "An unexpected error occurred.");
            }
        } catch (error) {
            console.error("Error:", error);
            setErrorMessage("An unexpected error occurred.");
        }
    };

    return (
        <div className="container">
            <div className="forms-container">
                <div className="signin-signup">
                    <form className="sign-in-form" onSubmit={handleSendResetEmail}>
                        <h2 className="title">Reset Password</h2>
                        <div className="input-field">
                            <i className="fas fa-user"></i>
                            <textarea
                                placeholder="Emails (comma separated)"
                                value={emails}
                                onChange={(e) => setEmails(e.target.value)}
                                required
                            />
                        </div>
                        <input
                            type="submit"
                            value="Send Reset Email"
                            className="btni solid"
                        />
                        {errorMessage && <div className="error-message">{errorMessage}</div>}
                    </form>
                </div>
            </div>
            <div className="panels-container">
                <div className="panel left-panel">
                    <div className="content">
                        {isEmailSent ? (
                            <h3>Emails Sent Successfully</h3>
                        ) : (
                            <>
                                <h3>Forget Password?</h3>
                                <p>
                                    Resetting your password helps users regain access, balancing security and ease of use, ensuring account safety.
                                </p>
                            </>
                        )}
                    </div>
                    <img src={forget} className="image" alt="" />
                </div>
            </div>
        </div>
    );
}
