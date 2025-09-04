import React, { useEffect } from 'react';
import { setCurrentSkin } from '../utils/skinManager';
import Logo from './Logo';

function HelpGuideHealth() {
  useEffect(() => {
    setCurrentSkin('rehabilitation');
    return () => {
      setCurrentSkin('entitledto');
    };
  }, []);

  return (
    <div className="help-guide-page">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <Logo />
          </div>
          <div className="header-text">
            <h1>Health Services Guide</h1>
            <p className="subtitle">How to register with a GP and access healthcare services</p>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="help-content">
          <div className="help-section">
            <h2>GP Registration Without a Fixed Address</h2>
            <p>You can register with a GP even if you don't have a permanent address. This is important for accessing healthcare services and prescriptions.</p>
            
            <div className="info-box">
              <h3>How to Register:</h3>
              <ul>
                <li>You can use a temporary address, hostel address, or even a friend's address</li>
                <li>Some GPs accept "no fixed address" as an address</li>
                <li>You don't need proof of address to register with a GP</li>
                <li>You can register with any GP practice in your area</li>
                <li>If you're refused registration, you can complain to NHS England</li>
              </ul>
            </div>

            <div className="action-box">
              <h3>What You Need:</h3>
              <ul>
                <li>Your name and date of birth</li>
                <li>An address (can be temporary or a friend's address)</li>
                <li>Your NHS number if you have it (but it's not essential)</li>
                <li>Details of any ongoing medical conditions or medications</li>
              </ul>
            </div>
          </div>

          <div className="help-section">
            <h2>Mental Health Support Services</h2>
            <p>Mental health support is crucial when leaving prison. There are many services available to help you cope with the challenges of reintegration.</p>
            
            <div className="info-box">
              <h3>Available Services:</h3>
              <ul>
                <li><strong>GP services:</strong> Your GP can refer you to mental health services</li>
                <li><strong>Community Mental Health Teams:</strong> Specialist support for mental health conditions</li>
                <li><strong>Crisis teams:</strong> 24/7 support if you're in mental health crisis</li>
                <li><strong>Counseling services:</strong> Talking therapies and psychological support</li>
                <li><strong>Peer support groups:</strong> Support from others who have similar experiences</li>
              </ul>
            </div>

            <div className="action-box">
              <h3>Getting Help:</h3>
              <ul>
                <li>Speak to your GP about your mental health concerns</li>
                <li>Contact your local mental health services directly</li>
                <li>Use the NHS 111 service for urgent mental health support</li>
                <li>Contact charities like Mind or Samaritans for support</li>
                <li>Ask your probation officer about local mental health services</li>
              </ul>
            </div>
          </div>

          <div className="help-section">
            <h2>Substance Misuse Support</h2>
            <p>If you have issues with drugs or alcohol, there are specialist services that can help you maintain your recovery.</p>
            
            <div className="info-box">
              <h3>Support Services:</h3>
              <ul>
                <li><strong>Drug and alcohol services:</strong> Specialist support for substance misuse</li>
                <li><strong>Methadone and other treatments:</strong> Medical support for addiction</li>
                <li><strong>Counseling and therapy:</strong> Psychological support for recovery</li>
                <li><strong>Support groups:</strong> AA, NA, and other peer support groups</li>
                <li><strong>Residential treatment:</strong> Inpatient support if needed</li>
              </ul>
            </div>
          </div>

          <div className="help-section">
            <h2>Dental Care and Prescriptions</h2>
            <p>Accessing dental care and getting prescriptions can be challenging without a fixed address, but there are ways to get the help you need.</p>
            
            <div className="info-box">
              <h3>Dental Care:</h3>
              <ul>
                <li>You can register with any NHS dentist</li>
                <li>Emergency dental care is available through NHS 111</li>
                <li>Some areas have mobile dental services</li>
                <li>Dental treatment is free if you're on certain benefits</li>
              </ul>
            </div>

            <div className="info-box">
              <h3>Prescriptions:</h3>
              <ul>
                <li>Prescriptions are free if you're on certain benefits</li>
                <li>You can get a prescription prepayment certificate to save money</li>
                <li>Some pharmacies offer delivery services</li>
                <li>You can collect prescriptions from any pharmacy</li>
              </ul>
            </div>
          </div>

          <div className="help-section">
            <h2>Hospital Treatment and Referrals</h2>
            <p>If you need hospital treatment, you have the same rights as anyone else to access NHS services.</p>
            
            <div className="info-box">
              <h3>Your Rights:</h3>
              <ul>
                <li>You're entitled to the same NHS treatment as anyone else</li>
                <li>You can't be refused treatment because of your criminal record</li>
                <li>Your medical information is confidential</li>
                <li>You can choose which hospital to be treated at</li>
                <li>You can get a second opinion if you're not happy with your treatment</li>
              </ul>
            </div>
          </div>

          <div className="help-section">
            <h2>Health Insurance and NHS Services</h2>
            <p>Understanding your rights to NHS services and any additional support available.</p>
            
            <div className="action-box">
              <h3>Important Information:</h3>
              <ul>
                <li>All NHS services are free at the point of use</li>
                <li>You don't need health insurance to access NHS services</li>
                <li>Some services may have waiting lists</li>
                <li>You can access NHS services anywhere in the UK</li>
                <li>If you're not eligible for free NHS treatment, you may still be able to get help</li>
              </ul>
            </div>
          </div>

          <div className="help-section">
            <h2>Getting Help and Support</h2>
            <p>Don't be afraid to ask for help with your health. There are many people and services that want to support you.</p>
            
            <div className="action-box">
              <h3>Where to Get Help:</h3>
              <ul>
                <li><strong>Your GP:</strong> First point of contact for most health issues</li>
                <li><strong>NHS 111:</strong> For urgent health advice and support</li>
                <li><strong>Your probation officer:</strong> Can help you access health services</li>
                <li><strong>Local charities:</strong> Many provide health advocacy and support</li>
                <li><strong>Citizens Advice:</strong> Help with health service problems</li>
                <li><strong>Patient Advice and Liaison Service (PALS):</strong> Help with NHS service issues</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="navigation-links">
          <a href="/help-guide" className="btn btn-secondary">← Back to Help Guide</a>
          <a href="/rehabilitation-calculator" className="btn btn-primary">Calculate My Benefits</a>
        </div>
      </div>
    </div>
  );
}

export default HelpGuideHealth;
