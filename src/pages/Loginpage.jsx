const LoginPage = ({ nav }) => {
  const { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      nav('home');
    } catch (err) {
      if (err.code === 'auth/user-not-found') setError('Ingen användare med den e-posten.');
      else if (err.code === 'auth/wrong-password') setError('Fel lösenord.');
      else if (err.code === 'auth/email-already-in-use') setError('E-posten används redan.');
      else if (err.code === 'auth/weak-password') setError('Lösenordet måste vara minst 6 tecken.');
      else setError('Något gick fel. Försök igen.');
    }
    setLoading(false);
  };

  return (
    <div style={{minHeight:'80vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem'}}>
      <div style={{background:'#fff',borderRadius:'24px',padding:'2.5rem',maxWidth:'440px',width:'100%',boxShadow:'0 4px 24px rgba(212,117,111,0.12)'}}>
        <h2 style={{fontFamily:'Playfair Display,serif',fontSize:'2rem',marginBottom:'0.5rem',textAlign:'center'}}>
          {isLogin ? 'Logga in' : 'Skapa konto'}
        </h2>
        <p style={{color:'#8B7B7B',textAlign:'center',marginBottom:'2rem'}}>
          {isLogin ? 'Välkommen tillbaka 🌸' : 'Välkommen till Trygga Kvinnor 🌸'}
        </p>

        {error && <div style={{background:'rgba(212,117,111,0.1)',border:'1px solid rgba(212,117,111,0.3)',borderRadius:'12px',padding:'1rem',color:'#B85E58',marginBottom:'1.5rem',fontSize:'0.9rem'}}>{error}</div>}

        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1.2rem'}}>
          <div>
            <label style={{fontWeight:600,fontSize:'0.9rem',display:'block',marginBottom:'0.4rem'}}>E-post</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="din@epost.se"
              style={{width:'100%',padding:'0.85rem 1.2rem',border:'2px solid rgba(212,117,111,0.2)',borderRadius:'14px',fontSize:'0.95rem',fontFamily:'inherit',boxSizing:'border-box'}}/>
          </div>
          <div>
            <label style={{fontWeight:600,fontSize:'0.9rem',display:'block',marginBottom:'0.4rem'}}>Lösenord</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Minst 6 tecken"
              style={{width:'100%',padding:'0.85rem 1.2rem',border:'2px solid rgba(212,117,111,0.2)',borderRadius:'14px',fontSize:'0.95rem',fontFamily:'inherit',boxSizing:'border-box'}}/>
          </div>
          <button type="submit" disabled={loading}
            style={{background:'linear-gradient(135deg,#D4756F,#C66D67)',color:'#fff',border:'none',borderRadius:'50px',padding:'0.95rem',fontSize:'1rem',fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>
            {loading ? 'Laddar...' : isLogin ? 'Logga in' : 'Skapa konto'}
          </button>
        </form>

        <p style={{textAlign:'center',marginTop:'1.5rem',color:'#8B7B7B',fontSize:'0.92rem'}}>
          {isLogin ? 'Inget konto?' : 'Redan medlem?'}{' '}
          <button onClick={()=>setIsLogin(!isLogin)} style={{background:'none',border:'none',color:'#D4756F',fontWeight:600,cursor:'pointer',fontFamily:'inherit',fontSize:'0.92rem'}}>
            {isLogin ? 'Skapa konto' : 'Logga in'}
          </button>
        </p>
        <p style={{textAlign:'center',marginTop:'0.5rem'}}>
          <button onClick={()=>nav('home')} style={{background:'none',border:'none',color:'#8B7B7B',cursor:'pointer',fontFamily:'inherit',fontSize:'0.88rem'}}>
            Tillbaka till startsidan
          </button>
        </p>
      </div>
    </div>
  );
};
