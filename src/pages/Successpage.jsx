import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const SuccessPage = ({ nav }) => {
  const { checkPremiumStatus } = useAuth();

  useEffect(() => {
    // Uppdatera Premium-status efter betalning
    const timer = setTimeout(() => {
      checkPremiumStatus();
    }, 2000);

    return () => clearTimeout(timer);
  }, [checkPremiumStatus]);

  return (
    <div className="page-content">
      <div style={{
        maxWidth:'600px',
        margin:'5rem auto',
        padding:'3rem',
        textAlign:'center',
        background:'var(--white)',
        borderRadius:'24px',
        boxShadow:'var(--shadow-lg)'
      }}>
        <div style={{fontSize:'4rem',marginBottom:'1rem'}}>🎉</div>
        <h1 style={{fontSize:'2rem',marginBottom:'1rem',color:'var(--primary)'}}>
          Välkommen till Premium!
        </h1>
        <p style={{color:'var(--text-medium)',fontSize:'1.1rem',marginBottom:'2rem',lineHeight:'1.7'}}>
          Din betalning är genomförd och ditt Premium-konto är nu aktiverat. 
          Du har nu tillgång till alla funktioner!
        </p>

        <div style={{
          background:'linear-gradient(135deg,rgba(123,175,142,0.1),rgba(244,214,204,0.1))',
          borderRadius:'16px',
          padding:'2rem',
          marginBottom:'2rem',
          textAlign:'left'
        }}>
          <h3 style={{fontSize:'1.2rem',marginBottom:'1rem'}}>✨ Nu har du tillgång till:</h3>
          <ul style={{listStyle:'none',padding:0}}>
            <li style={{padding:'0.5rem 0',fontSize:'0.95rem'}}>✅ Mående-dagbok med grafer</li>
            <li style={{padding:'0.5rem 0',fontSize:'0.95rem'}}>✅ Alla artiklar och guider</li>
            <li style={{padding:'0.5rem 0',fontSize:'0.95rem'}}>✅ Skriva och kommentera i Community</li>
            <li style={{padding:'0.5rem 0',fontSize:'0.95rem'}}>✅ AI-rådgivning obegränsat</li>
            <li style={{padding:'0.5rem 0',fontSize:'0.95rem'}}>✅ Alla meditationer och andningsövningar</li>
          </ul>
        </div>

        <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
          <button 
            className="btn-primary"
            onClick={() => nav('mood')}
          >
            Börja med Mående-dagbok
          </button>
          <button 
            className="btn-secondary"
            onClick={() => nav('community')}
          >
            Utforska Community
          </button>
        </div>

        <p style={{fontSize:'0.85rem',color:'var(--text-light)',marginTop:'2rem'}}>
          📧 Ett kvitto har skickats till din email
        </p>
      </div>
    </div>
  );
};

export default SuccessPage;
