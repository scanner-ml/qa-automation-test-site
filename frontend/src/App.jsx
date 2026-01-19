import { useState, useEffect } from 'react';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    idFile: null
  });
  const [validationRules, setValidationRules] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch('/api/validation-rules')
      .then(res => res.json())
      .then(data => setValidationRules(data))
      .catch(err => console.error("Failed to load rules", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
    // Clear error for field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const rules = validationRules || { min_age: 18 }; // fallback

    if (!formData.name) newErrors.name = "Name is required";

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email format is invalid";
    }

    if (!formData.dob) {
      newErrors.dob = "Date of Birth is required";
    } else {
      const dob = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      if (age < rules.min_age) {
        newErrors.dob = `You must be at least ${rules.min_age} years old`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitStatus('submitting');

    // 1. Check user status (Simulated check before submission or part of flow)
    try {
      const verifyRes = await fetch(`/api/user-verification?email=${encodeURIComponent(formData.email)}`);
      const verifyData = await verifyRes.json();
      setVerificationStatus(verifyData);

      // 2. Submit form
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('dob', formData.dob);
      if (formData.idFile) {
        submitData.append('id_file', formData.idFile);
      } else {
        // Mock empty file if not required or handle error? 
        // The prompt says "Upload ID – file input (simulate upload)". 
        // I'll ensure we handle it gracefully if user didn't upload, or mark it required?
        // "Task Requirements -> Validate that form fields behave correctly (required fields...)"
        // Usually ID is required for verification.
        // I'll leave it optional in code but maybe strictly required by rules if I had returned that from API.
      }

      const res = await fetch('/api/submit', {
        method: 'POST',
        body: submitData
      });
      const data = await res.json();

      if (res.ok) {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
      }

    } catch (err) {
      console.error(err);
      setSubmitStatus('error');
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Customer Verification</h1>
      </header>

      <main>
        {submitStatus === 'success' ? (
          <div className="success-message" id="success-message">
            <h2>Submission Successful!</h2>
            <p>Thank you, {formData.name}.</p>
            {verificationStatus && (
              <p>Status: <strong>{verificationStatus.status}</strong></p>
            )}
            <button onClick={() => setSubmitStatus(null)}>Reset</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="name">Name <span className="required">*</span></label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email <span className="required">*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="dob">Date of Birth <span className="required">*</span></label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={errors.dob ? 'error' : ''}
              />
              {errors.dob && <span className="error-text">{errors.dob}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="idFile">Upload ID</label>
              <input
                type="file"
                id="idFile"
                name="idFile"
                onChange={handleChange}
                accept=".jpg,.junit,.png,.pdf"
              />
            </div>

            <div className="form-actions">
              <button type="submit" disabled={submitStatus === 'submitting'}>
                {submitStatus === 'submitting' ? 'Verifying...' : 'Submit'}
              </button>
            </div>

            {submitStatus === 'error' && <p className="error-message">Something went wrong. Please try again.</p>}
          </form>
        )}
      </main>
    </div>
  );
}

export default App;
