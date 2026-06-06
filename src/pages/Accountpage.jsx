import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AccountPage = ({ nav }) => {
  const { currentUser, isPremium, logout, updateUserProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!displayName.trim()) {
      setError('Namnet kan inte vara tomt');
      return;
    }

    try {
      setError('');
      setSuccess(false);
      setLoading(true);
      await updateUserProfile({ displayName: displayName.trim() });
      setSuccess(true);
      setEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Update profile error:', error);
      setError('Kunde inte uppdatera profil. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      nav('home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!currentUser) {
    return (
      <div className="page-content">
        <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <h2>Du måste vara inloggad</h2>
          <button className="btn-primary" onClick={() => nav('login')} style={{ marginTop: '1rem' }}>
            Logga in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-hero">
        <h1>Min profil</h1>
        <p>Hantera ditt konto och dina inställningar</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 5%' }}>
        
        {/* Premium Status */}
        <div style={{
          background: isPremium 
            ? 'linear-gradient(135deg,rgba(123,175,142,0.15),rgba(244,214,204,0.15))' 
            : 'rgba(0,0,0,0.02)',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem',
          border: isPremium ? '2px solid var(--accent)' : '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.3rem' }}>
                {isPremium ? '✨ Premium-medlem' : '🆓 Gratis-användare'}
              </h3>
              <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>
                {isPremium 
                  ? 'Du har full tillgång till alla funktioner' 
                  : 'Uppgradera för att få tillgång till alla funktioner'}
              </p>
            </div>
            {!isPremium && (
              <button className="btn-primary" onClick={() => nav('profil')}>
                Uppgradera
              </button>
            )}
          </div>
        </div>

        {/* Profilinformation */}
        <div style={{
          background: 'var(--white)',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Profilinformation</h3>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent)',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Redigera
              </button>
            )}
          </div>

          {success && (
            <div style={{
              background: 'rgba(123,175,142,0.1)',
              border: '1px solid rgba(123,175,142,0.3)',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.5rem',
              color: 'var(--accent)',
              fontSize: '0.9rem'
            }}>
              ✅ Profilen uppdaterades!
            </div>
          )}

          {error && (
            <div style={{
              background: 'rgba(212,117,111,0.1)',
              border: '1px solid rgba(212,117,111,0.3)',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.5rem',
              color: 'var(--primary-dark)',
              fontSize: '0.9rem'
            }}>
              ⚠️ {error}
            </div>
          )}

          {editing ? (
            <form onSubmit={handleUpdateProfile}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
                  Namn
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.9rem 1.2rem',
                    border: '2px solid var(--border)',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Sparar...' : 'Spara ändringar'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setEditing(false);
                    setDisplayName(currentUser.displayName || '');
                    setError('');
                  }}
                  disabled={loading}
                >
                  Avbryt
                </button>
              </div>
            </form>
          ) : (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                  Namn
                </label>
                <p style={{ fontSize: '1rem', fontWeight: '500' }}>
                  {currentUser.displayName || 'Inget namn angivet'}
                </p>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                  Email
                </label>
                <p style={{ fontSize: '1rem', fontWeight: '500' }}>
                  {currentUser.email}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Kontoinställningar */}
        <div style={{
          background: 'var(--white)',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Kontoinställningar</h3>
          
          <button
            onClick={() => nav('forgot-password')}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'var(--bg-light)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              fontSize: '1rem',
              cursor: 'pointer',
              textAlign: 'left',
              marginBottom: '1rem',
              transition: 'background 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(123,175,142,0.05)'}
            onMouseLeave={(e) => e.target.style.background = 'var(--bg-light)'}
          >
            🔒 Ändra lösenord
          </button>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'rgba(212,117,111,0.08)',
              border: '1px solid rgba(212,117,111,0.2)',
              borderRadius: '12px',
              fontSize: '1rem',
              color: 'var(--primary-dark)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(212,117,111,0.15)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(212,117,111,0.08)'}
          >
            🚪 Logga ut
          </button>
        </div>

        {/* Konto-ID */}
        <div style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: '0.8rem' }}>
          Konto-ID: {currentUser.uid.substring(0, 8)}...
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
