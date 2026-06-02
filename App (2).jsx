import { useState, useEffect, useRef, createContext, useContext } from "react";
import { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, setDoc, getDocs, getDoc, updateDoc } from "./firebase";
import { useStripe } from './useStripe';
const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);
const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isTherapist, setIsTherapist] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async user => {
      setCurrentUser(user);
      if (user) {
        try {
          const response = await fetch('/.netlify/functions/check-premium?userId=' + user.uid);
          const data = await response.json();
          setIsPremium(data.isPremium || false);
        } catch (err) {
          setIsPremium(false);
        }
        try {
          const therapistSnap = await getDocs(collection(db, 'Therapists'));
          const isT = therapistSnap.docs.some(d => d.data().uid === user.uid);
          setIsTherapist(isT);
        } catch (err) {
          setIsTherapist(false);
        }
      } else {
        setIsPremium(false);
        setIsTherapist(false);
      }
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isPremium, isTherapist, setIsPremium, auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
/* ============================================================
   CSS
   ============================================================ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
:root {
  --primary:#D4756F;--primary-dark:#B85E58;--secondary:#E8B4A8;
  --accent:#7BAF8E;--accent-light:#A0C8B0;--accent-warm:#F4D6CC;
  --cream:#FBF8F5;--sand:#F0E9E0;--text-dark:#2D2424;
  --text-medium:#5A4F4F;--text-light:#8B7B7B;--white:#FFFFFF;
  --border:rgba(212,117,111,0.12);
  --shadow-sm:0 2px 12px rgba(212,117,111,0.08);
  --shadow-md:0 4px 24px rgba(212,117,111,0.12);
  --shadow-lg:0 8px 40px rgba(212,117,111,0.18);
}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',-apple-system,sans-serif;background:var(--cream);color:var(--text-dark);line-height:1.7;-webkit-font-smoothing:antialiased}
h1,h2,h3,h4{font-family:'Playfair Display',serif;font-weight:600;line-height:1.3;color:var(--text-dark)}
a{text-decoration:none}
.app{min-height:100vh;display:flex;flex-direction:column}

/* NAVBAR */
.navbar{position:sticky;top:0;z-index:1000;background:rgba(255,255,255,0.95);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);padding:1.2rem 5%;display:flex;justify-content:space-between;align-items:center;box-shadow:0 2px 10px rgba(0,0,0,0.04)}
.logo{font-family:'Playfair Display',serif;font-size:1.7rem;font-weight:700;background:linear-gradient(135deg,var(--primary),var(--accent));-webkit-background-clip:text;-webkit-text-fill-color:transparent;cursor:pointer;border:none;background-clip:text}
.nav-links{display:flex;align-items:center;gap:1.8rem}
.nav-btn{background:none;border:none;color:var(--text-medium);font-size:0.92rem;font-weight:500;position:relative;padding:0.4rem 0;transition:color 0.3s;cursor:pointer;font-family:inherit}
.nav-btn:hover{color:var(--primary)}
.nav-btn.active{color:var(--primary);font-weight:600}
.nav-btn.active::after{content:'';position:absolute;bottom:-2px;left:0;right:0;height:3px;background:var(--primary);border-radius:3px}
.nav-cta{background:linear-gradient(135deg,var(--primary),#C66D67) !important;color:var(--white) !important;padding:0.65rem 1.4rem !important;border-radius:50px;font-weight:600 !important;box-shadow:0 4px 14px rgba(212,117,111,0.3);transition:transform 0.3s,box-shadow 0.3s}
.nav-cta:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(212,117,111,0.4)}
.nav-cta::after{display:none !important}
/* USER MENU */
.user-menu{cursor:pointer;padding:0.6rem 1.2rem;background:rgba(123,175,142,0.1);border-radius:50px;font-weight:600;color:var(--accent);transition:background 0.3s;font-size:0.9rem;border:none;font-family:inherit}
.user-menu:hover{background:rgba(123,175,142,0.2)}
.mobile-menu-btn{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:6px;z-index:1001}
.mobile-menu-btn span{display:block;width:26px;height:3px;background:var(--primary);border-radius:3px;transition:all 0.3s}

@media(max-width:900px){
  .mobile-menu-btn{display:flex}
  .nav-links{display:none;position:fixed;top:0;right:0;width:260px;height:100vh;background:#ffffff;flex-direction:column;align-items:flex-start;padding:5rem 2rem 2rem;gap:0;box-shadow:-6px 0 24px rgba(0,0,0,0.12);z-index:999}
  .nav-links.mobile-open{display:flex}
  .nav-btn{width:100%;padding:0.9rem 0;border-bottom:1px solid var(--border);font-size:1.05rem;text-align:left}
  .nav-cta{margin-top:1.5rem;width:100%;text-align:center;padding:0.85rem 0 !important}
  .user-menu{width:100%;margin-top:1rem;text-align:center}
}
/* MAIN */
.main-content{flex:1}
.page-content{max-width:1400px;margin:0 auto}

/* BUTTONS */
.btn-primary,.btn-secondary,.btn-text{font-family:inherit;font-size:0.95rem;font-weight:600;border:none;cursor:pointer;transition:all 0.3s;display:inline-block;text-align:center}
.btn-primary{background:linear-gradient(135deg,var(--primary),#C66D67);color:var(--white);padding:0.9rem 2rem;border-radius:50px;box-shadow:0 4px 14px rgba(212,117,111,0.3)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(212,117,111,0.4)}
.btn-secondary{background:var(--white);color:var(--primary);padding:0.9rem 2rem;border-radius:50px;border:2px solid var(--primary)}
.btn-secondary:hover{background:var(--primary);color:var(--white);transform:translateY(-2px)}
.btn-text{background:none;color:var(--primary);padding:0.4rem 0}
.btn-text:hover{color:var(--primary-dark)}
.full-width{width:100%}

/* HERO */
.hero-section{display:grid;grid-template-columns:1fr 1fr;min-height:520px;background:linear-gradient(135deg,#FBF8F5,#F4E9E0)}
.hero-content{display:flex;flex-direction:column;justify-content:center;padding:5rem 5% 5rem 8%;max-width:640px}
.hero-title{font-size:3.8rem;margin-bottom:0.8rem;background:linear-gradient(135deg,var(--primary),var(--accent));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero-subtitle{font-family:'Inter',sans-serif;font-size:1.4rem;font-weight:300;color:var(--text-medium);margin-bottom:1.2rem}
.hero-text{font-size:1.1rem;color:var(--text-light);margin-bottom:2.5rem;line-height:1.8}
.cta-buttons{display:flex;gap:1rem;flex-wrap:wrap}
.hero-image{background-size:cover;background-position:center;min-height:400px}

/* PAGE HEROES */
.page-hero{padding:5rem 5% 3.5rem;text-align:center;background:linear-gradient(135deg,rgba(212,117,111,0.07),rgba(123,175,142,0.07))}
.page-hero h1{font-size:3rem;margin-bottom:0.8rem}
.page-hero p{font-size:1.2rem;color:var(--text-medium);max-width:650px;margin:0 auto}
.meditation-hero{background:linear-gradient(135deg,rgba(123,175,142,0.12),rgba(244,214,204,0.12))}
.mood-hero{background:linear-gradient(135deg,rgba(232,180,168,0.15),rgba(212,117,111,0.08))}
.workshops-hero{background:linear-gradient(135deg,rgba(244,214,204,0.2),rgba(232,180,168,0.12))}
.articles-hero{background:linear-gradient(135deg,rgba(212,117,111,0.06),rgba(123,175,142,0.1))}
.expert-hero{background:linear-gradient(135deg,rgba(232,180,168,0.18),rgba(212,117,111,0.1))}
.resources-hero{background:linear-gradient(135deg,rgba(123,175,142,0.14),rgba(244,214,204,0.14))}
.privacy-hero{background:linear-gradient(135deg,rgba(212,117,111,0.08),rgba(123,175,142,0.08))}
.about-hero{background:linear-gradient(135deg,rgba(244,214,204,0.2),rgba(123,175,142,0.1))}
.community-hero{background:linear-gradient(135deg,rgba(232,180,168,0.15),rgba(123,175,142,0.12))}
.profile-hero{background:linear-gradient(135deg,rgba(212,117,111,0.07),rgba(244,214,204,0.15))}

/* SECTIONS */
.content-section{padding:3.5rem 5%}
.content-section h2{font-size:2.2rem;margin-bottom:0.6rem}
.section-intro{font-size:1.05rem;color:var(--text-light);margin-bottom:2.2rem}

/* FEATURE CARDS */
.features-section{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:1.8rem;padding:3.5rem 5%}
.feature-card{background:var(--white);border-radius:20px;overflow:hidden;border:1px solid var(--border);box-shadow:var(--shadow-sm);transition:transform 0.3s,box-shadow 0.3s;cursor:pointer}
.feature-card:hover{transform:translateY(-6px);box-shadow:var(--shadow-lg)}
.feature-image{height:200px;background-size:cover;background-position:center}
.feature-card h3{font-size:1.4rem;margin:1.3rem 1.5rem 0.6rem}
.feature-card p{color:var(--text-light);padding:0 1.5rem;margin-bottom:1.2rem}
.feature-link{display:inline-block;color:var(--primary);font-weight:600;font-size:0.95rem;margin:0 1.5rem 1.5rem;transition:color 0.3s}
.feature-link:hover{color:var(--primary-dark)}

/* MEDITATION */
.meditation-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:1.8rem}
.meditation-card{background:var(--white);border-radius:20px;overflow:hidden;box-shadow:var(--shadow-sm);border:1px solid var(--border);transition:transform 0.3s,box-shadow 0.3s}
.meditation-card:hover{transform:translateY(-6px);box-shadow:var(--shadow-md)}
.meditation-image{height:200px;background-size:cover;background-position:center}
.meditation-content{padding:1.5rem}
.meditation-category{display:inline-block;background:rgba(123,175,142,0.14);color:var(--accent);padding:0.35rem 0.9rem;border-radius:20px;font-size:0.82rem;font-weight:600;margin-bottom:0.8rem}
.meditation-card h3{font-size:1.3rem;margin-bottom:0.5rem}
.med-desc{color:var(--text-light);font-size:0.95rem;margin-bottom:1.2rem}
.meditation-footer{display:flex;justify-content:space-between;align-items:center}
.duration{color:var(--text-medium);font-weight:600;font-size:0.9rem}
.meditation-steps{margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid var(--border)}
.meditation-steps h4{font-size:1rem;margin-bottom:1rem;color:var(--primary)}
.meditation-step{display:flex;gap:1rem;align-items:flex-start;margin-bottom:0.9rem}
.step-number{background:linear-gradient(135deg,var(--primary),#C66D67);color:var(--white);width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;flex-shrink:0}
.meditation-step p{color:var(--text-medium);font-size:0.93rem;line-height:1.6}

/* BREATHING */
.breathing-section{background:linear-gradient(135deg,rgba(123,175,142,0.07),rgba(244,214,204,0.1));border-radius:28px;margin:0 5% 2rem;padding:3rem 3rem 3.5rem}
.breathing-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.8rem}
.breathing-card{background:var(--white);border-radius:18px;overflow:hidden;box-shadow:var(--shadow-sm);padding-bottom:1.5rem;text-align:center;transition:transform 0.3s,box-shadow 0.3s}
.breathing-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-md)}
.breathing-image{height:170px;background-size:cover;background-position:center;margin-bottom:1.3rem}
.breathing-card h3{font-size:1.3rem;margin-bottom:0.4rem;padding:0 1rem}
.breathing-purpose{display:inline-block;background:rgba(212,117,111,0.1);color:var(--primary);padding:0.3rem 0.8rem;border-radius:16px;font-size:0.82rem;font-weight:600;margin-bottom:0.8rem}
.breathing-card p{color:var(--text-light);font-size:0.93rem;padding:0 1.2rem;margin-bottom:1.2rem}

/* BREATHING OVERLAY */
.breathing-overlay{position:fixed;inset:0;background:rgba(45,36,36,0.7);backdrop-filter:blur(6px);z-index:2000;display:flex;align-items:center;justify-content:center;padding:1rem}
.breathing-modal{background:var(--white);border-radius:28px;padding:2.5rem 2rem 3rem;max-width:440px;width:100%;text-align:center;position:relative;box-shadow:var(--shadow-lg)}
.breathing-modal h2{font-size:1.8rem;margin-bottom:0.3rem}
.exercise-subtitle{color:var(--text-light);margin-bottom:2rem;font-size:1rem}
.close-btn{position:absolute;top:1rem;right:1.2rem;background:none;border:none;font-size:1.8rem;color:var(--text-light);cursor:pointer;line-height:1;transition:color 0.2s}
.close-btn:hover{color:var(--primary)}
.breath-circle-container{display:flex;align-items:center;justify-content:center;height:280px;margin:1rem 0}
.breath-circle{border:4px solid var(--accent);border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.3rem;background:linear-gradient(135deg,rgba(123,175,142,0.06),rgba(212,117,111,0.06))}
.breath-phase-label{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:600}
.breath-countdown{font-size:2.2rem;font-weight:700;color:var(--text-dark)}
.remaining-time-text{color:var(--text-light);font-size:0.95rem;margin-bottom:1.2rem}
.phase-indicators{display:flex;justify-content:center;gap:1rem;margin-bottom:1.8rem;flex-wrap:wrap}
.phase-dot{font-size:0.82rem;color:var(--text-light);font-weight:500}
.phase-dot.active{color:var(--primary);font-weight:700}
.exercise-complete{padding:1rem 0}
.complete-circle{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent-light));color:var(--white);font-size:2.2rem;display:flex;align-items:center;justify-content:center;margin:0 auto 1.2rem}
.exercise-complete h3{margin-bottom:0.6rem}
.exercise-complete p{color:var(--text-light);margin-bottom:1.5rem}

/* SPOTIFY */
.spotify-section{background:linear-gradient(135deg,rgba(212,117,111,0.05),rgba(123,175,142,0.06));border-radius:28px;margin:2rem 5% 3rem;padding:3rem;text-align:center}
.spotify-section h2{font-size:2rem;margin-bottom:2rem}
.spotify-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:1.5rem;max-width:900px;margin:0 auto}
.spotify-embed{background:var(--white);padding:1.5rem;border-radius:18px;box-shadow:var(--shadow-sm);text-align:left}
.spotify-embed h4{font-size:1.1rem;margin-bottom:1rem}

/* ARTICLES */
.articles-filter-section{padding:2rem 5% 0;display:flex;align-items:center;gap:1.5rem}
.category-select{padding:0.7rem 1.2rem;border:2px solid var(--border);border-radius:50px;font-family:inherit;font-size:0.95rem;background:var(--white);color:var(--text-dark);cursor:pointer;transition:border-color 0.3s;min-width:200px}
.category-select:focus{outline:none;border-color:var(--primary)}
.articles-count{color:var(--text-light);font-size:0.9rem}
.articles-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:1.8rem;padding:2rem 5% 3rem}
.article-card{background:var(--white);border-radius:20px;overflow:hidden;box-shadow:var(--shadow-sm);border:1px solid var(--border);cursor:pointer;transition:transform 0.3s,box-shadow 0.3s}
.article-card:hover{transform:translateY(-6px);box-shadow:var(--shadow-md)}
.article-image{height:190px;background-size:cover;background-position:center}
.article-text-content{padding:1.5rem}
.article-category-tag{display:inline-block;background:rgba(212,117,111,0.1);color:var(--primary);padding:0.3rem 0.8rem;border-radius:16px;font-size:0.8rem;font-weight:600;margin-bottom:0.7rem}
.article-card h3{font-size:1.25rem;margin-bottom:0.6rem;line-height:1.4}
.article-intro{color:var(--text-light);font-size:0.9rem;margin-bottom:0.8rem;line-height:1.6}
.read-time{color:var(--primary);font-size:0.88rem;font-weight:600}
.article-view{padding:2rem 5%;max-width:820px;margin:0 auto}
.back-btn{margin-bottom:1.5rem}
.article-hero-image{height:320px;background-size:cover;background-position:center;border-radius:20px;margin-bottom:2rem}
.article-view-content{max-width:720px}
.article-view-content h1{font-size:2.4rem;margin-bottom:0.5rem}
.article-meta{color:var(--text-light);font-size:0.9rem;margin-bottom:2rem}
.article-body p{color:var(--text-medium);font-size:1.05rem;line-height:1.9;margin-bottom:1.4rem}
.back-btn-bottom{margin-top:2rem}

/* MOOD */
.mood-form-card{background:var(--white);border-radius:24px;box-shadow:var(--shadow-md);padding:2.5rem;max-width:680px;margin:2.5rem auto;width:calc(100% - 10%)}
.mood-form-card h3{font-size:1.8rem;text-align:center;margin-bottom:1.8rem}
.mood-form{display:flex;flex-direction:column;gap:1.4rem}
.form-group{display:flex;flex-direction:column;gap:0.5rem}
.form-group label{font-weight:600;color:var(--text-dark);font-size:0.95rem}
.mood-select,.mood-textarea{padding:0.85rem 1.2rem;border:2px solid var(--border);border-radius:14px;font-family:inherit;font-size:0.95rem;transition:border-color 0.3s;background:var(--white)}
.mood-select:focus,.mood-textarea:focus{outline:none;border-color:var(--primary)}
.mood-textarea{min-height:100px;resize:vertical}
.energy-slider{-webkit-appearance:none;width:100%;height:8px;border-radius:4px;background:linear-gradient(to right,var(--accent),var(--primary));outline:none}
.energy-slider::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:var(--primary);cursor:pointer;box-shadow:0 2px 8px rgba(212,117,111,0.3)}
.slider-labels{display:flex;justify-content:space-between;font-size:0.8rem;color:var(--text-light);margin-top:0.2rem}
.mood-history{background:var(--white);border-radius:24px;box-shadow:var(--shadow-sm);padding:2.5rem;margin:0 5% 3rem}
.mood-history h3{font-size:1.8rem;margin-bottom:1.5rem}
.mood-entry{display:flex;gap:1.5rem;padding:1.2rem 0;border-bottom:1px solid var(--border)}
.mood-entry:last-child{border-bottom:none}
.mood-date{color:var(--text-light);font-size:0.88rem;font-weight:600;min-width:110px}
.mood-top{display:flex;align-items:center;gap:1rem;flex-wrap:wrap}
.mood-info strong{color:var(--primary);font-size:1.15rem}
.energy-badge{display:inline-block;background:rgba(123,175,142,0.14);color:var(--accent);padding:0.25rem 0.7rem;border-radius:12px;font-size:0.8rem;font-weight:600}
.mood-info p{color:var(--text-medium);font-size:0.92rem;margin-top:0.4rem}

/* WORKSHOPS */
.workshops-coming{padding:2.5rem 5%;max-width:900px;margin:0 auto}
.workshops-coming h2{font-size:2rem;margin-bottom:1.5rem}
.workshop-preview-card{background:var(--white);border-radius:20px;overflow:hidden;box-shadow:var(--shadow-sm);border:1px solid var(--border);display:grid;grid-template-columns:1fr 1fr;margin-bottom:1.8rem;transition:transform 0.3s,box-shadow 0.3s}
.workshop-preview-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-md)}
.workshop-preview-image{height:100%;min-height:240px;background-size:cover;background-position:center}
.workshop-preview-content{padding:2rem;display:flex;flex-direction:column;justify-content:center}
.workshop-tag{display:inline-block;background:rgba(232,180,168,0.25);color:var(--primary);padding:0.3rem 0.8rem;border-radius:16px;font-size:0.8rem;font-weight:700;text-transform:uppercase;margin-bottom:0.8rem;width:fit-content}
.workshop-preview-content h3{font-size:1.4rem;margin-bottom:0.6rem}
.workshop-preview-content p{color:var(--text-light);font-size:0.93rem;margin-bottom:1.2rem}

/* CHAT */
.chat-page{padding:2rem 5%;max-width:900px;margin:0 auto}
.chat-container{background:var(--white);border-radius:24px;overflow:hidden;box-shadow:var(--shadow-lg);height:72vh;display:flex;flex-direction:column}
.chat-header{padding:1.5rem 2rem;background:linear-gradient(135deg,var(--primary),#C66D67);display:flex;justify-content:space-between;align-items:center}
.chat-header h2{color:var(--white);font-size:1.5rem}
.online-badge{background:rgba(255,255,255,0.2);color:var(--white);padding:0.45rem 1rem;border-radius:20px;font-size:0.85rem;font-weight:600}
.messages-container{flex:1;overflow-y:auto;padding:2rem;background:var(--cream);display:flex;flex-direction:column;gap:1.2rem}
.message{display:flex}
.message.assistant{justify-content:flex-start}
.message.user{justify-content:flex-end}
.message-content{max-width:78%;padding:1rem 1.4rem;border-radius:18px;font-size:0.95rem;line-height:1.6;animation:msgIn 0.3s ease}
@keyframes msgIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.message.assistant .message-content{background:var(--white);color:var(--text-dark);box-shadow:var(--shadow-sm);border-bottom-left-radius:4px}
.message.user .message-content{background:linear-gradient(135deg,var(--primary),#C66D67);color:var(--white);border-bottom-right-radius:4px}
.chat-input-form{padding:1.2rem 1.5rem;background:var(--white);border-top:1px solid var(--border);display:flex;gap:0.8rem}
.chat-input{flex:1;padding:0.9rem 1.4rem;border:2px solid var(--border);border-radius:50px;font-size:0.95rem;font-family:inherit;transition:border-color 0.3s}
.chat-input:focus{outline:none;border-color:var(--primary)}
.send-button{padding:0.9rem 1.8rem;background:linear-gradient(135deg,var(--primary),#C66D67);color:var(--white);border:none;border-radius:50px;font-weight:600;font-family:inherit;cursor:pointer;box-shadow:0 4px 12px rgba(212,117,111,0.3);transition:transform 0.3s,box-shadow 0.3s}
.send-button:hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(212,117,111,0.4)}
.typing-indicator{color:var(--text-light);font-style:italic;font-size:0.9rem;padding:0.5rem 1.4rem}

/* DISCLAIMER MODAL */
.disclaimer-overlay{position:fixed;inset:0;background:rgba(45,36,36,0.75);backdrop-filter:blur(4px);z-index:3000;display:flex;align-items:center;justify-content:center;padding:1rem;overflow-y:auto}
.disclaimer-modal{background:var(--white);border-radius:28px;padding:2.8rem 2.4rem;max-width:520px;width:100%;box-shadow:var(--shadow-lg);text-align:center;max-height:90vh;overflow-y:auto;margin:auto}
.disclaimer-modal-icon{font-size:2.8rem;margin-bottom:1rem}
.disclaimer-modal h2{font-size:1.7rem;margin-bottom:0.8rem;color:var(--text-dark)}
.disclaimer-modal p{color:var(--text-medium);font-size:0.95rem;line-height:1.8;margin-bottom:1rem}
.disclaimer-modal .disclaimer-box{background:rgba(212,117,111,0.08);border:1px solid rgba(212,117,111,0.2);border-radius:14px;padding:1.2rem 1.4rem;margin:1.2rem 0;text-align:left}
.disclaimer-modal .disclaimer-box p{color:var(--primary);font-weight:600;font-size:0.92rem;margin-bottom:0.3rem}
.disclaimer-modal .disclaimer-box p:last-child{margin-bottom:0}
.disclaimer-modal .crisis-line{font-weight:700;font-size:1rem;color:var(--text-dark)}
.disclaimer-modal button{margin-top:0.8rem}

/* CHAT DISCLAIMER BANNER */
.chat-disclaimer-banner{background:rgba(212,117,111,0.09);border-bottom:1px solid rgba(212,117,111,0.18);padding:0.75rem 1.5rem;text-align:center;font-size:0.84rem;color:var(--primary);font-weight:600;display:flex;align-items:center;justify-content:center;gap:0.5rem}
.chat-disclaimer-banner span.crisis-link{color:var(--primary-dark);font-weight:700;cursor:pointer;text-decoration:underline;text-underline-offset:2px}

/* CHAT CRISIS NOTICE */
.chat-crisis-notice{text-align:center;padding:0.5rem 1.5rem 0.7rem;font-size:0.78rem;color:var(--text-light);background:var(--white)}
.chat-crisis-notice strong{color:var(--text-medium)}

/* EXPERT */
.expert-info{display:grid;grid-template-columns:repeat(auto-fit,minmax(380px,1fr));gap:2.5rem;padding:3rem 5%;max-width:1100px;margin:0 auto}
.expert-card{background:var(--white);border-radius:24px;padding:2.5rem;box-shadow:var(--shadow-sm);border:2px solid var(--border);position:relative;transition:transform 0.3s,box-shadow 0.3s}
.expert-card:hover{transform:translateY(-6px);box-shadow:var(--shadow-lg)}
.expert-card.featured{border-color:var(--primary);box-shadow:var(--shadow-md)}
.expert-badge{position:absolute;top:-14px;right:2rem;background:linear-gradient(135deg,var(--primary),#C66D67);color:var(--white);padding:0.5rem 1.2rem;border-radius:20px;font-size:0.82rem;font-weight:700;box-shadow:0 4px 12px rgba(212,117,111,0.4)}
.expert-card h3{font-size:1.7rem;margin-bottom:0.6rem}
.expert-card>p{color:var(--text-light);margin-bottom:1.5rem}
.expert-card ul{list-style:none;margin-bottom:2rem}
.expert-card li{padding:0.75rem 0;color:var(--text-dark);border-bottom:1px solid var(--border);font-size:0.95rem}
.expert-card li:last-child{border-bottom:none}
.price{font-family:'Playfair Display',serif;font-size:3rem;font-weight:700;color:var(--primary);margin-bottom:1.5rem}
.price span{font-size:1.1rem;color:var(--text-light);font-family:'Inter',sans-serif;font-weight:400}

/* RESOURCES */
.resources-notice{background:rgba(212,117,111,0.1);border-left:4px solid var(--primary);padding:1.2rem 1.5rem;margin:2rem 5% 0;border-radius:0 12px 12px 0}
.resources-notice p{color:var(--primary);font-weight:600;font-size:0.95rem}
.resources-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:1.5rem;padding:2rem 5% 3rem}
.resource-card{background:var(--white);border-radius:18px;padding:1.8rem;box-shadow:var(--shadow-sm);border:1px solid var(--border);transition:transform 0.3s,box-shadow 0.3s}
.resource-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-md)}
.resource-header{margin-bottom:0.8rem}
.resource-type{display:inline-block;background:rgba(123,175,142,0.14);color:var(--accent);padding:0.25rem 0.7rem;border-radius:12px;font-size:0.78rem;font-weight:700;text-transform:uppercase;margin-bottom:0.5rem}
.resource-card h3{font-size:1.2rem}
.resource-description{color:var(--text-medium);font-size:0.9rem;margin-bottom:1rem;line-height:1.6}
.resource-details{display:flex;flex-direction:column;gap:0.4rem}
.resource-phone{color:var(--primary);font-weight:700;font-size:1.1rem;text-decoration:none}
.resource-phone:hover{color:var(--primary-dark)}
.resource-link{color:var(--accent);font-weight:600;font-size:0.9rem;text-decoration:none}
.resource-link:hover{color:var(--text-dark)}
.resource-hours{color:var(--text-light);font-size:0.82rem}

/* PRIVACY */
.privacy-content{max-width:780px;margin:0 auto;padding:2.5rem 5% 4rem}
.privacy-section{margin-bottom:2.5rem}
.privacy-section h2{font-size:1.8rem;margin-bottom:0.8rem}
.privacy-section p{color:var(--text-medium);margin-bottom:1rem;font-size:0.98rem;line-height:1.8}
.privacy-section ul{list-style:none;margin-top:0.8rem}
.privacy-section li{padding:0.6rem 0;color:var(--text-dark);border-bottom:1px solid var(--border);font-size:0.95rem;padding-left:1.5rem;position:relative}
.privacy-section li::before{content:'✓';position:absolute;left:0;color:var(--accent);font-weight:700}
.privacy-section li:last-child{border-bottom:none}
.privacy-email{color:var(--primary);font-weight:600;font-size:1.05rem}
.privacy-promise{background:linear-gradient(135deg,rgba(123,175,142,0.08),rgba(244,214,204,0.1));border-radius:20px;padding:2.2rem;margin-top:2rem}
.privacy-promise h3{font-size:1.5rem;margin-bottom:0.8rem}
.privacy-promise p{color:var(--text-medium);margin-bottom:1rem}
.privacy-promise ul{list-style:none}
.privacy-promise li{padding:0.4rem 0;color:var(--text-dark);font-size:0.95rem}

/* ABOUT */
.about-content{padding:2rem 5% 4rem;max-width:1100px;margin:0 auto}
.about-hero-section{display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:center;margin-bottom:3.5rem}
.about-image{height:420px;border-radius:24px;background-size:cover;background-position:center;box-shadow:var(--shadow-md)}
.about-text h2{font-size:2.2rem;margin-bottom:1rem}
.about-text p{color:var(--text-medium);font-size:1rem;line-height:1.8;margin-bottom:1rem}
.about-values-section{margin-bottom:3rem}
.about-values-section h2{font-size:2.2rem;margin-bottom:1.5rem;text-align:center}
.values-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.5rem}
.value-card{background:var(--white);border-radius:18px;padding:2rem;box-shadow:var(--shadow-sm);border:1px solid var(--border);text-align:center;transition:transform 0.3s,box-shadow 0.3s}
.value-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-md)}
.value-card h4{font-size:1.2rem;margin-bottom:0.6rem;color:var(--primary)}
.value-card p{color:var(--text-light);font-size:0.9rem}
.about-vision{text-align:center;background:linear-gradient(135deg,rgba(212,117,111,0.06),rgba(123,175,142,0.06));border-radius:24px;padding:3rem}
.about-vision h2{font-size:2rem;margin-bottom:1rem}
.about-vision p{color:var(--text-medium);max-width:700px;margin:0 auto;line-height:1.9;font-size:1.05rem}

/* COMMUNITY */
.coming-soon-card{background:var(--white);border-radius:24px;box-shadow:var(--shadow-md);padding:3rem 2.5rem;max-width:720px;margin:2.5rem auto 4rem;text-align:center}
.coming-soon-card h3{font-size:2rem;margin-bottom:1rem}
.coming-soon-card>p{color:var(--text-medium);margin-bottom:1.5rem}
.coming-soon-card ul{list-style:none;text-align:left;display:inline-block;margin-bottom:1.5rem}
.coming-soon-card li{padding:0.7rem 0;color:var(--text-dark);border-bottom:1px solid var(--border);font-size:0.97rem;padding-left:1.5rem;position:relative}
.coming-soon-card li::before{content:'✓';position:absolute;left:0;color:var(--accent);font-weight:700}
.coming-soon-card li:last-child{border-bottom:none}
.coming-soon-note{background:rgba(212,117,111,0.08);padding:1rem 1.5rem;border-radius:14px;color:var(--primary);font-weight:600;font-size:0.95rem;margin:1.5rem 0}

/* PRICING */
.pricing-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(380px,1fr));gap:2.5rem;padding:2.5rem 5%;max-width:1050px;margin:0 auto}
.pricing-card{background:var(--white);border-radius:24px;padding:2.5rem;box-shadow:var(--shadow-sm);border:2px solid var(--border);position:relative;transition:transform 0.3s,box-shadow 0.3s}
.pricing-card:hover{transform:translateY(-6px);box-shadow:var(--shadow-lg)}
.pricing-card.featured{border-color:var(--primary);box-shadow:var(--shadow-md)}
.badge{position:absolute;top:-14px;right:2rem;background:linear-gradient(135deg,var(--primary),#C66D67);color:var(--white);padding:0.5rem 1.2rem;border-radius:20px;font-size:0.82rem;font-weight:700;box-shadow:0 4px 12px rgba(212,117,111,0.4)}
.pricing-card h3{font-size:1.8rem;margin-bottom:0.8rem}
.pricing-card ul{list-style:none;margin-bottom:2rem}
.pricing-card li{padding:0.7rem 0;color:var(--text-dark);border-bottom:1px solid var(--border);font-size:0.95rem}
.pricing-card li:last-child{border-bottom:none}
.guarantee-section{text-align:center;padding:1rem 5% 3rem;color:var(--text-light);font-size:0.95rem}

/* FOOTER */
.footer{background:var(--text-dark);color:rgba(255,255,255,0.7);padding:2.5rem 5%;margin-top:auto}
.footer-content{max-width:1100px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1.5rem}
.footer-brand h3{color:var(--white);font-size:1.3rem;margin-bottom:0.3rem}
.footer-brand p{font-size:0.85rem}
.footer-links{display:flex;gap:1.5rem}
.footer-link{color:rgba(255,255,255,0.6);font-size:0.88rem;cursor:pointer;background:none;border:none;font-family:inherit;transition:color 0.3s}
.footer-link:hover{color:var(--white)}
.footer-crisis{color:rgba(255,255,255,0.5);font-size:0.85rem}
.footer-crisis p{font-weight:500}

/* RESPONSIVE */
@media(max-width:900px){
  .hero-section{grid-template-columns:1fr}
  .hero-image{min-height:300px;order:-1}
  .hero-content{padding:3rem 5%;max-width:100%}
  .hero-title{font-size:3rem}
  .about-hero-section{grid-template-columns:1fr}
  .about-image{height:300px}
  .workshop-preview-card{grid-template-columns:1fr}
  .workshop-preview-image{min-height:200px}
}
@media(max-width:700px){
  .page-hero h1{font-size:2.2rem}
  .page-hero p{font-size:1.05rem}
  .hero-title{font-size:2.4rem}
  .features-section,.meditation-grid,.articles-grid,.resources-grid,.breathing-grid{grid-template-columns:1fr}
  .expert-info,.pricing-cards{grid-template-columns:1fr}
  .chat-container{height:60vh}
  .breathing-section{margin:0 3%;padding:2rem 1.5rem}
  .spotify-section{margin:2rem 3%;padding:2rem 1.5rem}
  .spotify-grid{grid-template-columns:1fr}
}
@media(max-width:480px){
  .page-hero{padding:3.5rem 5% 2.5rem}
  .page-hero h1{font-size:1.9rem}
  .hero-title{font-size:2rem}
  .cta-buttons{flex-direction:column}
  .btn-primary,.btn-secondary{width:100%}
  .chat-input-form{flex-direction:column}
  .send-button{width:100%}
  .mood-form-card{padding:1.8rem}
  .mood-history{padding:1.8rem}
  .breathing-modal{padding:2rem 1.2rem 2.5rem}
  .breath-circle-container{height:230px}
  .footer-content{flex-direction:column;text-align:center}
  .footer-links{flex-wrap:wrap;justify-content:center}
  .disclaimer-modal{padding:1.8rem 1.5rem;max-height:85vh;font-size:0.9rem}
  .disclaimer-modal h2{font-size:1.4rem}
  .disclaimer-modal p{font-size:0.88rem}
  .disclaimer-modal-icon{font-size:2.2rem}
  .disclaimer-modal .disclaimer-box{padding:1rem;font-size:0.85rem}
}

/* SCROLL ANIMATIONS */
@keyframes fadeInUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.fade-in-up{animation:fadeInUp 0.8s ease forwards;opacity:0}
.fade-in{animation:fadeIn 0.6s ease forwards;opacity:0}
.delay-1{animation-delay:0.1s}
.delay-2{animation-delay:0.2s}
.delay-3{animation-delay:0.3s}
.delay-4{animation-delay:0.4s}
.delay-5{animation-delay:0.5s}
.delay-6{animation-delay:0.6s}

/* TESTIMONIALS */
.testimonials-section{padding:4rem 5%;background:linear-gradient(135deg,rgba(212,117,111,0.04),rgba(123,175,142,0.06))}
.testimonials-section h2{text-align:center;font-size:2.2rem;margin-bottom:2.5rem}
.testimonials-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:2rem;max-width:1200px;margin:0 auto}
.testimonial-card{background:var(--white);border-radius:20px;padding:2rem;box-shadow:var(--shadow-sm);border:1px solid var(--border);position:relative;transition:transform 0.3s,box-shadow 0.3s}
.testimonial-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-md)}
.quote-icon{font-size:2.5rem;color:var(--primary);opacity:0.3;line-height:1;margin-bottom:0.8rem}
.testimonial-text{color:var(--text-medium);font-size:0.95rem;line-height:1.7;margin-bottom:1.5rem;font-style:italic}
.testimonial-author{display:flex;align-items:center;gap:0.8rem}
.testimonial-avatar{width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--accent))}
.testimonial-name{font-weight:600;color:var(--text-dark);font-size:0.95rem}
.testimonial-role{font-size:0.82rem;color:var(--text-light)}
.stars{color:var(--accent);font-size:1.1rem;margin-bottom:0.8rem}

/* FAQ */
.faq-section{padding:4rem 5%;max-width:900px;margin:0 auto}
.faq-section h2{text-align:center;font-size:2.2rem;margin-bottom:2.5rem}
.faq-item{background:var(--white);border-radius:16px;padding:1.5rem 1.8rem;margin-bottom:1rem;box-shadow:var(--shadow-sm);border:1px solid var(--border);cursor:pointer;transition:all 0.3s}
.faq-item:hover{box-shadow:var(--shadow-md)}
.faq-question{display:flex;justify-content:space-between;align-items:center;font-weight:600;color:var(--text-dark);font-size:1.05rem}
.faq-toggle{font-size:1.4rem;color:var(--primary);transition:transform 0.3s}
.faq-toggle.open{transform:rotate(180deg)}
.faq-answer{max-height:0;overflow:hidden;transition:max-height 0.4s ease,padding 0.4s ease;color:var(--text-medium);font-size:0.92rem;line-height:1.7}
.faq-answer.open{max-height:500px;padding-top:1rem}

/* MOOD TRACKER GRAPHS */
.mood-chart-section{background:var(--white);border-radius:24px;padding:2.5rem;margin:2rem 5%;box-shadow:var(--shadow-sm)}
.mood-chart-section h3{font-size:1.8rem;margin-bottom:1.5rem}
.chart-container{height:300px;margin-bottom:2rem;position:relative}
.chart-canvas{width:100%;height:100%}
.mood-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1.5rem;margin-top:2rem}
.stat-card{background:linear-gradient(135deg,rgba(123,175,142,0.08),rgba(212,117,111,0.06));border-radius:16px;padding:1.5rem;text-align:center}
.stat-number{font-size:2.2rem;font-weight:700;color:var(--primary);margin-bottom:0.3rem}
.stat-label{font-size:0.9rem;color:var(--text-light)}
.slider-value-display{text-align:center;font-weight:600;color:var(--primary);font-size:1.1rem;margin-top:0.3rem}

/* COMMUNITY */
.community-feed{padding:2rem 5%;max-width:900px;margin:0 auto}
.post-card{background:var(--white);border-radius:20px;padding:2rem;margin-bottom:1.5rem;box-shadow:var(--shadow-sm);border:1px solid var(--border);transition:box-shadow 0.3s}
.post-card:hover{box-shadow:var(--shadow-md)}
.post-header{display:flex;align-items:center;gap:1rem;margin-bottom:1rem}
.post-avatar{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent-light))}
.post-author-info h4{font-size:1rem;margin-bottom:0.2rem}
.post-time{font-size:0.82rem;color:var(--text-light)}
.post-content{color:var(--text-medium);font-size:0.95rem;line-height:1.7;margin-bottom:1.2rem}
.post-tags{display:flex;gap:0.6rem;flex-wrap:wrap;margin-bottom:1.2rem}
.post-tag{background:rgba(123,175,142,0.12);color:var(--accent);padding:0.3rem 0.8rem;border-radius:16px;font-size:0.8rem;font-weight:600}
.post-actions{display:flex;gap:1.5rem;padding-top:1rem;border-top:1px solid var(--border)}
.post-action-btn{background:none;border:none;color:var(--text-light);font-size:0.9rem;cursor:pointer;display:flex;align-items:center;gap:0.4rem;transition:color 0.3s;font-family:inherit}
.post-action-btn:hover{color:var(--primary)}
.post-action-btn.active{color:var(--primary);font-weight:600}
.comment-section{padding-left:1rem;margin-top:1rem;border-left:3px solid var(--border)}
.comment{padding:0.8rem 0;font-size:0.9rem}
.comment-author{font-weight:600;color:var(--text-dark);margin-right:0.5rem}
.comment-text{color:var(--text-medium)}
.new-post-btn{position:fixed;bottom:2rem;right:2rem;width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,var(--primary),#C66D67);color:var(--white);border:none;font-size:2rem;box-shadow:0 4px 20px rgba(212,117,111,0.4);cursor:pointer;transition:transform 0.3s,box-shadow 0.3s;z-index:100}
.new-post-btn:hover{transform:scale(1.1);box-shadow:0 6px 24px rgba(212,117,111,0.5)}
.community-guidelines{background:rgba(212,117,111,0.08);border-left:4px solid var(--primary);padding:1.2rem 1.5rem;margin:0 5% 2rem;border-radius:0 12px 12px 0;max-width:900px}
.community-guidelines h3{font-size:1.1rem;margin-bottom:0.6rem;color:var(--primary)}
.community-guidelines p{color:var(--text-medium);font-size:0.88rem;margin-bottom:0.4rem}

/* NEW POST FORM */
.new-post-form{background:linear-gradient(135deg,rgba(123,175,142,0.05),rgba(244,214,204,0.08));border-radius:24px;padding:2.5rem;margin:0 5% 2rem;box-shadow:var(--shadow-md);max-width:900px;border:2px solid rgba(123,175,142,0.2)}
.new-post-form h3{font-size:1.5rem;margin-bottom:0.5rem;color:var(--primary)}
.new-post-subtitle{color:var(--text-light);font-size:0.9rem;margin-bottom:1.5rem}
.post-form-group{margin-bottom:1.5rem}
.post-form-group label{display:block;font-weight:600;color:var(--text-dark);margin-bottom:0.5rem;font-size:0.95rem}
.post-textarea{width:100%;min-height:140px;padding:1rem 1.2rem;border:2px solid var(--border);border-radius:16px;font-family:inherit;font-size:0.95rem;resize:vertical;transition:border-color 0.3s;background:var(--white)}
.post-textarea:focus{outline:none;border-color:var(--accent)}
.category-pills{display:flex;gap:0.8rem;flex-wrap:wrap}
.category-pill{padding:0.65rem 1.3rem;border:2px solid var(--border);border-radius:50px;background:var(--white);cursor:pointer;transition:all 0.3s;font-size:0.9rem;font-weight:500;color:var(--text-dark)}
.category-pill:hover{border-color:var(--accent);transform:translateY(-2px);box-shadow:0 2px 8px rgba(123,175,142,0.2)}
.category-pill.selected{background:linear-gradient(135deg,var(--accent),var(--accent-light));color:var(--white);border-color:var(--accent);box-shadow:0 4px 12px rgba(123,175,142,0.3)}
.post-actions-row{display:flex;gap:1rem;align-items:center;justify-content:space-between;flex-wrap:wrap}
.char-count{color:var(--text-light);font-size:0.85rem}

/* CATEGORY FILTER */
.category-filter{display:flex;gap:0.8rem;padding:1.5rem 5% 1rem;max-width:900px;margin:0 auto;flex-wrap:wrap;justify-content:center}
.filter-pill{padding:0.5rem 1.2rem;border:2px solid var(--border);border-radius:50px;background:var(--white);cursor:pointer;transition:all 0.3s;font-size:0.88rem;font-weight:500;color:var(--text-dark)}
.filter-pill:hover{border-color:var(--accent);transform:translateY(-2px)}
.filter-pill.active{background:var(--accent);color:var(--white);border-color:var(--accent);box-shadow:0 2px 8px rgba(123,175,142,0.3)}

/* WARMER POST CARDS */
.post-card{background:var(--white);border-radius:20px;padding:2rem;margin-bottom:1.5rem;box-shadow:var(--shadow-sm);border:1px solid var(--border);transition:box-shadow 0.3s,transform 0.2s}
.post-card:hover{box-shadow:var(--shadow-md);transform:translateY(-2px)}
.post-card.category-Ångest{border-left:4px solid #E8B4A8}
.post-card.category-Depression{border-left:4px solid #A0C8B0}
.post-card.category-Relationer{border-left:4px solid #F4D6CC}
.post-card.category-Våld{border-left:4px solid #D4756F}
.post-card.category-Beroende{border-left:4px solid #7BAF8E}

/* ARTICLE HEADERS */
.article-body h2{font-size:1.6rem;margin:2rem 0 1rem;color:var(--text-dark)}
.article-body h3{font-size:1.3rem;margin:1.5rem 0 0.8rem;color:var(--primary)}
.article-body h4{font-size:1.1rem;margin:1.2rem 0 0.6rem;color:var(--text-medium)}
.article-body ul{margin:1rem 0 1.5rem 2rem;list-style:disc}
.article-body ul li{margin-bottom:0.6rem;color:var(--text-medium)}
.article-body strong{color:var(--text-dark);font-weight:600}
.practice-box{background:linear-gradient(135deg,rgba(123,175,142,0.08),rgba(244,214,204,0.1));border-radius:14px;padding:1.5rem;margin:1.5rem 0;border-left:4px solid var(--accent)}
.practice-box h4{color:var(--accent);margin-top:0;margin-bottom:0.8rem}
.practice-box p{margin-bottom:0.6rem}

@media(max-width:700px){
  .testimonials-grid,.mood-stats{grid-template-columns:1fr}
  .chart-container{height:250px}
  .new-post-btn{bottom:1.5rem;right:1.5rem;width:56px;height:56px}
}
.therapy-page{max-width:860px;margin:0 auto;padding:2.5rem 5%}
.therapy-header{display:flex;align-items:center;gap:1.5rem;padding:1.8rem 2rem;background:white;border-bottom:1px solid rgba(212,117,111,0.1)}
.therapist-avatar-lg{width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#D4756F,#7BAF8E);display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;box-shadow:0 4px 12px rgba(212,117,111,0.3)}
.therapist-info h3{font-family:'Playfair Display',serif;font-size:1.2rem;color:#2D2424;margin-bottom:3px}
.therapist-info p{font-size:0.82rem;color:#8B7B7B}
.online-dot{width:8px;height:8px;border-radius:50%;background:#7BAF8E;display:inline-block;margin-right:5px}
.therapy-messages{background:#FBF8F5;min-height:420px;max-height:420px;overflow-y:auto;padding:2rem;display:flex;flex-direction:column;gap:1.2rem}
.therapy-message{display:flex;gap:0.8rem;align-items:flex-end}
.therapy-message.user{flex-direction:row-reverse}
.msg-avatar{width:32px;height:32px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;color:white}
.msg-avatar.therapist-av{background:linear-gradient(135deg,#D4756F,#C66D67)}
.msg-avatar.user-av{background:linear-gradient(135deg,#7BAF8E,#5a9e7a)}
.msg-bubble{max-width:72%;padding:1rem 1.3rem;border-radius:18px;font-size:0.93rem;line-height:1.6}
.msg-bubble.therapist-bubble{background:white;color:#2D2424;border-bottom-left-radius:4px;box-shadow:0 2px 12px rgba(0,0,0,0.06)}
.msg-bubble.user-bubble{background:linear-gradient(135deg,#7BAF8E,#5a9e7a);color:white;border-bottom-right-radius:4px}
.msg-time{font-size:0.72rem;color:#B0A0A0;margin-top:4px;display:block}
.therapy-message.user .msg-time{text-align:right}
.therapy-input-area{background:white;border-top:1px solid rgba(212,117,111,0.1);padding:1.2rem 1.5rem;display:flex;gap:0.8rem;align-items:center}
.therapy-input{flex:1;padding:0.85rem 1.3rem;border:2px solid rgba(212,117,111,0.15);border-radius:50px;font-size:0.93rem;font-family:inherit;background:#FBF8F5;color:#2D2424;transition:border-color 0.3s;outline:none}
.therapy-input:focus{border-color:#D4756F;background:white}
.therapy-send-btn{width:46px;height:46px;border-radius:50%;background:linear-gradient(135deg,#D4756F,#C66D67);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(212,117,111,0.35);transition:transform 0.2s;flex-shrink:0}
.therapy-send-btn:hover{transform:scale(1.08)}
.therapy-send-btn svg{width:18px;height:18px;stroke:white}
.therapy-disclaimer{text-align:center;font-size:0.75rem;color:#C0B0B0;padding:0.7rem}
.therapist-dashboard{display:grid;grid-template-columns:300px 1fr;height:76vh;margin:1rem 5% 2rem;gap:0;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(212,117,111,0.12)}
.client-sidebar{background:#2D2424;display:flex;flex-direction:column}
.sidebar-header{padding:1.5rem;border-bottom:1px solid rgba(255,255,255,0.08)}
.sidebar-header h3{font-family:'Playfair Display',serif;font-size:1.1rem;color:white;margin-bottom:4px}
.sidebar-header p{font-size:0.78rem;color:rgba(255,255,255,0.4)}
.client-list{flex:1;overflow-y:auto}
.client-item{padding:1rem 1.2rem;border-bottom:1px solid rgba(255,255,255,0.06);cursor:pointer;transition:background 0.2s;display:flex;gap:0.9rem;align-items:center}
.client-item:hover{background:rgba(255,255,255,0.05)}
.client-item.active{background:rgba(212,117,111,0.15);border-left:3px solid #D4756F}
.client-avatar{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#D4756F,#E8B4A8);display:flex;align-items:center;justify-content:center;font-size:0.9rem;font-weight:700;color:white;flex-shrink:0}
.client-meta{flex:1;min-width:0}
.client-name{font-size:0.88rem;font-weight:600;color:white;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.client-last-msg{font-size:0.75rem;color:rgba(255,255,255,0.4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.empty-sidebar{padding:2rem 1.5rem;text-align:center;color:rgba(255,255,255,0.3);font-size:0.85rem;line-height:1.6}
.therapist-chat-area{background:white;display:flex;flex-direction:column}
.therapist-chat-header{padding:1.2rem 1.8rem;background:white;border-bottom:1px solid rgba(212,117,111,0.1);display:flex;align-items:center;justify-content:space-between}
.therapist-chat-header h3{font-family:'Playfair Display',serif;font-size:1.1rem;color:#2D2424}
.therapist-chat-header p{font-size:0.78rem;color:#8B7B7B;margin-top:2px}
.therapist-messages{flex:1;overflow-y:auto;padding:1.5rem;background:#FBF8F5;display:flex;flex-direction:column;gap:1rem}
.therapist-input-area{padding:1rem 1.5rem;background:white;border-top:1px solid rgba(212,117,111,0.1);display:flex;gap:0.8rem;align-items:center}
.no-chat-selected{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#C0B0B0;gap:1rem}
`;
/* ============================================================
   DATA
   ============================================================ */
const meditations = [
  { id:1, title:"Morgonmeditation", duration:"10 min", category:"Energi", description:"Starta dagen med fokus och närvarokänsla", image:"https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800", steps:["Sitt bekvämt och rak i ryggen och blunda","Ta tre djupa andetag – in genom näsan, ut genom munnen","Känn hur din kropp börjar lugna sig med varje utandning","Fokusera på din andning – notera hur luften rör sig","Om tankarna flödar, notera dem utan att döma och gå tillbaka till andningen","Tänk på tre saker du är tacksam för idag","Avsluta med tre djupa andetag och öppna ögonen sakta"] },
  { id:2, title:"Middag-paus", duration:"5 min", category:"Återhämtning", description:"Kort break för att ladda om mitt på dagen", image:"https://images.unsplash.com/photo-1545389336-cf090694435e?w=800", steps:["Stäng ögonen och ta tre djupa andetag","Känn vikten av din kropp mot stolen","Skanna din kropp från huvud till tå – notera var du håller spänning","Med varje utandning, föreställ dig att spänningen lämnar kroppen","Tänk på en plats som gör dig lugn – vatten, skog eller hemma","Ta tre sista djupa andetag och öppna ögonen"] },
  { id:3, title:"Kvällsavslappning", duration:"15 min", category:"Sömn", description:"Varva ner och förbered kroppen för djup sömn", image:"https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800", steps:["Lägg dig bekvämt på din sida eller på ryggen","Blunda och ta fem långsamma andetag","Börja med tårna – spänn i 5 sekunder, sedan släpp dem","Gör samma sak med vader, lår, mage, händer och armar","Känn hur din kropp sjunker allt djupare","Tänk på en lugn bild – en strand vid solnedgången","Du behöver inte göra något alls. Du är säker. Du är lugn."] },
  { id:4, title:"Andning för ångest", duration:"8 min", category:"Ångesthantering", description:"Lugnande andningsövningar när du behöver det mest", image:"https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800", steps:["Hitta en bekväm position – sittande eller liggande","Lägg en hand på magen och en på bröstet","Andas in genom näsan – känn magen fylla sig (4 sekunder)","Håll andan i 7 sekunder","Andas ut genom munnen i 8 sekunder","Upprepa detta mönster 4 till 5 gånger","Med varje varv känn ångesten minska lite. Du är säker."] },
  { id:5, title:"Body scan", duration:"20 min", category:"Djup avslappning", description:"Systematisk avslappning av hela kroppen", image:"https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800", steps:["Lägg dig på ryggen, armar längs kroppen","Blunda och ta fem djupa andetag","Börja med fötterna – uppmärksamma dem utan att döma","Flytta uppmärksamheten till vader och sedan lår","Känn höfterna och magen – notera din andning","Flytta till händerna, armar och axlarna","Notera hals och ansikte. Ta tre djupa andetag och öppna ögonen sakta."] },
  { id:6, title:"Kärleksfull medkänsla", duration:"12 min", category:"Självkärlek", description:"Öva på att vara snäll mot dig själv", image:"https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800", steps:["Sitt bekvämt och blunda","Tänk på en person du älskar – känn kärleken i ditt hjärta","Nu rikta samma kärlek mot dig själv","Upprepa tanken: Jag är värd kärlek och lycka","Tänk på en situation som var svär för dig","I stället för att döma dig, ge dig medkänsla","Det här är svårt. Alla kämpar ibland. Jag är inte ensam."] }
];

const breathingExercises = [
  { id:1, title:"4-7-8 Andning", purpose:"Snabb avslappning", description:"En av de kraftfullaste tekniken för att lugna nervsystemet. Perfekt när ångesten tränger sig på.", image:"https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600", totalDuration:120, phases:[{label:'Andas IN',duration:4},{label:'HÅLL',duration:7},{label:'Andas UT',duration:8}] },
  { id:2, title:"Box Breathing", purpose:"Fokus och koncentration", description:"Tekniken som militär och räddningstjänst använder för att hålla lugnet under press.", image:"https://images.unsplash.com/photo-1528319725582-ddc096101511?w=600", totalDuration:120, phases:[{label:'Andas IN',duration:4},{label:'HÅLL',duration:4},{label:'Andas UT',duration:4},{label:'HÅLL',duration:4}] },
  { id:3, title:"Djup buk-andning", purpose:"Stresskontroll", description:"Långsam andning från magen för att aktivera kroppens naturliga lugna läge.", image:"https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600", totalDuration:90, phases:[{label:'Andas IN',duration:5},{label:'HÅLL',duration:2},{label:'Andas UT',duration:7}] }
];

const articles = [
  { id:1, title:"Att hantera ångest: Verktyg som faktiskt fungerar", category:"Mental hälsa", readTime:"12 min", image:"https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800", intro:"Ångest är en av de vanligaste upplevelserna hos kvinnor idag. Men med rätta verktyg kan du lära dig hantera den.", content:"Ångest är kroppens naturliga varningssystem – ett evolutionärt verktyg designat att skydda dig från fara. När våra förfäder mötte ett rovdjur aktiverades fight-or-flight-systemet: hjärtat slog snabbare, musklerna spändes, sinnet blev hyperalert. Det här systemet räddade liv.\n\nMen idag lever vi inte bland rovdjur. Istället möter vi deadlines, ekonomisk stress, relationsproblem och social press. Problemet? Din hjärna kan inte skilja på ett rovdjur och en mail från chefen. Resultatet blir att ditt varningssystem är på konstant – och det är utmattande.\n\n## Förstå din ångest\n\nFörsta steget i att hantera ångest är att förstå DIN specifika ångest. Ångest är inte en-size-fits-all. För en person sitter den i bröstet som en tyngd. För en annan är det darriga händer och snabba andetag. För någon tredje är det tankar som snurrar i loop.\n\nBörja kartlägga:\n• **Var känner du ångesten?** Mage? Bröst? Huvud? Hals?\n• **När kommer den?** Morgon? Kväll? Vid specifika situationer?\n• **Vad utlöser den?** Sociala situationer? Ensamhet? Prestationskrav?\n• **Hur länge varar den?** Minuter? Timmar? Dagar?\n\nGenom att notera dina mönster i 2 veckor börjar du se kopplingar. Kanske märker du att ångesten alltid kommer efter dålig sömn. Eller efter att du druckit för mycket kaffe. Eller efter samtal med en viss person. Den här kunskapen är guld.\n\n## Kontrollerad andning: Det kraftfullaste verktyget\n\nDet här låter för enkelt för att vara sant, men forskning är tydlig: kontrollerad andning är ett av de mest effektiva verktygen mot akut ångest.\n\n### 4-7-8 Metoden\n\nAndas in genom näsan i 4 sekunder. Håll andan i 7 sekunder. Andas ut genom munnen i 8 sekunder. Upprepa 4 gånger.\n\nVarför funkar det? När du andas ut långsamt aktiveras din parasympatiska nervsystem – systemet som lugnar kroppen. Samtidigt minskar stresshormonet kortisol i blodet. Efter bara 2 minuter känner de flesta en märkbar skillnad.\n\n## Rörelse som medicin\n\nForskning från Uppsala Universitet visar att 30 minuters promenad minskar ångestsymptom lika effektivt som låg dos SSRI-medicin. Det här är inte litet. Rörelse är medicin.\n\nMen du behöver inte springa maraton. Du behöver inte ens gå på gym. En promenad i lugn takt räcker. Varför? Rörelse:\n• Minskar kortisol (stresshormon)\n• Ökar endorfiner (må-bra-hormon)\n• Ger distans från tankar\n• Hjälper dig sova bättre\n• Ökar self-efficacy (tron att du kan hantera saker)\n\n### Praktiska Tips\n\n**Morgonpromenad:** 20 minuter innan frukost. Det sätter tonen för hela dagen.\n**Lunch-walk:** Byt lunch-scrolling mot 15 minuters promenad. Kom tillbaka mer fokuserad.\n**Kväll-stretching:** 10 minuter yoga eller stretching före sömn lugnar nervsystemet.\n\n## Gränssättning: Den underskattade hjälten\n\nMånga kvinnor med ångest är people-pleasers. Vi säger ja när vi menar nej. Vi tar på oss mer än vi orkar. Vi prioriterar andras behov före våra egna. Och kroppen? Den registrerar det som stress.\n\nGränser är inte egoism. Gränser är självvård. När du säger \"Jag kan inte ta det här mötet\" eller \"Jag behöver vara ensam ikväll\" kommunicerar du till dig själv: Mina behov är viktiga.\n\n### Börja här\n\nIdentifiera EN situation där du regelbundet ger för mycket: Tar du alltid extra skift? Fixar du alltid allt hemma? Säger du ja till sociala event du inte orkar?\n\nÖva på att säga: \"Tack för att du frågade, men jag kan inte just nu.\" Det är en komplett mening. Du behöver inte förklara. Du behöver inte ursäkta dig.\n\n## Sömn: Grundstenen\n\nDålig sömn och ångest är en ond cirkel. Ångest gör att du inte kan sova. Dålig sömn gör ångesten värre. Men cirkeln kan brytas.\n\n**3 Basics:**\n1. **Samma tid varje dag** – Kroppen älskar rutiner\n2. **Inga skärmar 1h före sömn** – Blått ljus hämmar melatonin\n3. **Kall rum** – 16–18 grader är optimalt\n\n## När söka professionell hjälp?\n\nIbland räcker inte självhjälp. Sök hjälp om:\n• Ångesten hindrar dig från att leva ditt liv\n• Du undviker saker du behöver eller vill göra\n• Du känner dig konstant orolig i flera veckor\n• Du har panikattacker\n• Du får självmordstankar\n\nKBT (Kognitiv Beteendeterapi) har stark evidens för ångest. Läkemedel kan också hjälpa, särskilt kombinerat med terapi. Det finns hjälp. Du behöver inte lida i onödan.\n\n## Sammanfattning: Din Verktygslåda\n\n✓ **Kartlägg** – Var, när, varför kommer ångesten?\n✓ **Andas** – 4-7-8 metoden, 2 min\n✓ **Rör dig** – 20–30 min promenad dagligen\n✓ **Sätt gränser** – Öva på att säga nej\n✓ **Sov** – Samma tid, inget skärm, kallt rum\n✓ **Sök hjälp** – Vid behov, tveka inte\n\nÅngest kan kännas överväldigande. Men med rätt verktyg och lite träning kan du lära dig hantera den. Du är starkare än du tror." },
  { id:2, title:"Gränssättning utan skuldkänslor", category:"Relationer", readTime:"10 min", image:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800", intro:"Att sätta gränser är en av de viktigaste sakerna du kan göra för din hälsa. Men det kan vara otroligt svårt.", content:"Vi får lära oss tidigt att vara snälla. Att hjälpa till. Att inte vara besvärliga. För många kvinnor blir det här en levnadsregel: alltid tillmötesgående, alltid hjälpsam, alltid den som fixar. Och gränser? De känns egoistiska.\n\nMen sanningen är tvärt om. Gränser är inte egoism – gränser är självrespekt. När du sätter en gräns säger du: \"Det här är vad jag behöver för att må bra.\" Det är inte ett angrepp mot den andra personen. Det är omsorg om dig själv.\n\n## Varför är det så svårt?\n\nDet finns flera anledningar till att gränssättning känns svårt:\n\n**Socialisering:** Flickor lärs att vara snälla och tillmötesgående. Pojkar lärs att vara assertiva. Resultatet? Vuxna kvinnor som kämpar med att säga nej.\n\n**Rädsla för konflikt:** \"Tänk om personen blir arg?\" \"Tänk om de tycker jag är elak?\" Rädslan för att såra eller förlora relationen håller oss tysta.\n\n**Skuldkänslor:** När vi väl sätter en gräns dyker skuldkänslorna upp. \"Kanske borde jag ändå ha hjälpt till...\" \"Jag är säkert självisk...\"\n\n**People-pleasing:** För många har det här blivit en identitet. \"Jag är den som alltid ställer upp.\" Att ändra det känns som att förlora sig själv.\n\n## Vad är en gräns egentligen?\n\nEn gräns är en tydlig kommunikation om vad som fungerar för dig och vad som inte fungerar. Det kan vara:\n\n• **Tidsgränser:** \"Jag kan inte jobba övertid idag.\"\n• **Känslomässiga gränser:** \"Jag orkar inte prata om det här just nu.\"\n• **Fysiska gränser:** \"Jag vill inte kramas, en high-five räcker.\"\n• **Mentala gränser:** \"Jag delar inte dina åsikter om det här.\"\n\nGränser handlar om att respektera dina egna behov lika mycket som du respekterar andras.\n\n## Börja smått: Identifiera EN gräns\n\nDu behöver inte förändra allt på en gång. Börja med att identifiera EN situation där du regelbundet ger mer än du får tillbaka:\n\n• Tar du alltid extra sk ift på jobbet?\n• Säger du ja till sociala event du inte orkar?\n• Fixar du alltid allt hemma medan andra slappar?\n• Lånar du ut pengar du inte har råd att förlora?\n• Lyssnar du alltid när vänner behöver prata men ingen lyssnar på dig?\n\nVälj en. Bara en. Det här är din träningsgrund.\n\n## Hur sätta en gräns: Konkreta fraser\n\nNär du sätter en gräns, håll det enkelt och tydligt:\n\n**Bra exempel:**\n• \"Jag kan inte hjälpa dig med det här.\"\n• \"Jag behöver lite tid för mig själv ikväll.\"\n• \"Det passar inte mig just nu.\"\n• \"Tack för erbjudandet, men jag tackar nej.\"\n\n**Undvik:**\n• Långa förklaringar (\"Det är för att jag har så mycket att göra och...\")\n• Ursäkter (\"Förlåt förlåt förlåt men...\")\n• Lögner (\"Jag är sjuk\" när du inte är det)\n\nEn gräns är en komplett mening. \"Nej\" är en komplett mening. Du behöver inte motivera ditt nej.\n\n## Hantera skuldkänslorna\n\nSkuldkänslor kommer. Det är normalt. Din hjärna är van vid att säga ja, och nu gör du något nytt. Hjärnan tycker inte om nytt – den tycker om bekant.\n\nNär skuldkänslorna kommer:\n\n1. **Påminn dig själv:** \"Gränser är inte egoism. Jag tar hand om mig.\"\n2. **Andas:** Tre djupa andetag. Skuldkänslor är bara känslor. De går över.\n3. **Ge det tid:** Efter en vecka känns det lättare. Efter en månad känns det naturligt.\n\n## När relationen försämras av dina gränser\n\nIbland händer det. Du sätter en gräns och personen blir arg, sur eller distanserar sig. Det här säger inte något om dig – det säger något om relationen.\n\nEn sund relation respekterar gränser. En osund relation kräver att du överger dina behov för att hålla personen nöjd.\n\nOm någon inte kan respektera dina gränser är frågan: Är det här en relation du vill ha?\n\n## Sammanfattning: Din guide\n\n✓ **Gränser är självrespekt** – inte egoism\n✓ **Börja smått** – en gräns i taget\n✓ **Var tydlig** – inga långa förklaringar\n✓ **Acceptera skulden** – den går över\n✓ **Respektera dig själv** – du förtjänar det\n\nÖva. Det blir lättare. Och ett år från nu kommer du se tillbaka och undra varför du väntade så länge." },
  { id:3, title:"Sömnhygien för stressade hjärnor", category:"Självvård", readTime:"5 min", image:"https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800", intro:"God sömn är grunden för mental hälsa. Men när hjärnan inte stänger av blir det svårt att vila.", content:"Dålig sömn och mental hälsa påverkar varandra i en ond cirkel. Stress gör att du inte kan sova, och brist på sömn gör att stress blir värre.\n\nFörsta steget är rutiner. Din kropp älskar mönster. Försök gå och lägga dig och stiga upp samma tid varje dag. Din inre klocka reglerar sömndjupt och hormoner.\n\nSkärmar är en stor brottsling. Blått ljus från telefoner och datorer hämmar produktionen av melatonin – hormonet som gör dig trött. Försök lägga undan alla skärmar 1 till 2 timmar innan du ska sova.\n\nSkapa ett lugnt rum. Din sovrummet ska vara kall, kring 16 till 19 grader, mörkt och tysta.\n\nRörelse under dagen hjälper också enormt. Bara 20 minuters promenad på morningen kan förbättra din sömn på natten." },
  { id:4, title:"När perfektionism blir ett hinder", category:"Mental hälsa", readTime:"7 min", image:"https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800", intro:"Perfektionism ser ut som ambition utifrån, men inifrån kan den vara utmattande och paralyserande.", content:"Perfektionism är inte samma sak som att vara ambitiös. Ambitiös är att vilja växa och nå sina mål. Perfektionism är känslan att du alltid behöver göra bättre, vara bättre, prestera bättre.\n\nForskning visar att perfektionism är vanlig hos kvinnor och den är starkt kopplad till ångest och utmattning.\n\nFörsta steget är att identifiera din perfektionism. Det kan visa sig som att alltid dubbelkolla allt, svårt att delegera, eller rädsla för kritik.\n\nÖva på att done is better than perfect. Börja med små saker – skicka ett e-post utan att läsa det tre gånger.\n\nKom ihäg: misstag är inte misslyckanden. De är inlärningstillfälle. Den bästa versionen av dig är inte den som gör allt perfekt – det är den som mår bra och kan njuta av livet." },
  { id:5, title:"Kommunikation i nära relationer", category:"Relationer", readTime:"9 min", image:"https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=800", intro:"God kommunikation är fundamentet i alla hälsosamma relationer. Men det är en konst som behöver övas.", content:"De flesta konflikter i relationer beror inte på att vi saknar ord – de beror på att vi inte lyssnar på rätt sätt. Vi lyssnar för att svara, inte för att förstå.\n\nFörsta regeln: lyssna aktivt. Det innebär att du ger din fulla uppmärksamhet och väntar tills den andra personen är klar innan du talar.\n\nAndra regeln: tala från jag-perspektiv. I stället för \"Du gör alltid...\" sä \"Jag känslar stressad när...\". Det sänker den andra personens försvar.\n\nTredje regeln: timing matters. Det är inte alltid rätt att ta upp svåra samtal. Om du eller din partner är trött eller stressad – vänta.\n\nKom ihäg att kommunikation är en konst som behöver övas. Det viktigaste är att ni är villiga att försöka och att ni ser varandra." },
  { id:6, title:"Meditation för nybörjare", category:"Mindfulness", readTime:"10 min", image:"https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800", intro:"Meditation behöver inte vara komplicerat. Här är en enkel guide för dig som vill börja.", content:"Meditation har visat sig minska stress, förbättra fokus och öka välmående. Men tanken att meditation handlar om att tömma sinnet gör att många ger upp.\n\nSanningen är: meditation handlar INTE om att inte ha tankar. Det handlar om att notera dem och gå vidare.\n\nBörja med bara 5 minuter. Sitt bekämtligt, blunda och fokusera på ditt andande. Det är det. Det är meditation.\n\nNär tankar kommer – och de KOMMER – notera dem utan att döma. Bara \"Ah, jag tänker på jobbet.\" Och gå tillbaka till andningen. Det här ÄR meditation.\n\nKonsistens är viktigare än duration. 5 minuter varje dag är bättre än 30 minuter en gång i veckan. Speciellt morningen är bra – det sätter tonen för hela dagen." },
  { id:7, title:"Andning som verktyg mot stress", category:"Mindfulness", readTime:"8 min", image:"https://images.unsplash.com/photo-1545389336-cf090694435e?w=800", intro:"Din andning är den enda funktionen i kroppen som är både automatisk och medveten kontrollerad.", content:"Vi andas ungefär 20 000 gånger per dag. Men de flesta av oss andas grunt och snabbt – speciellt när vi är stressade.\n\nStressandning aktiverar din sympatiska nervsystem som kallas fight-or-flight. Det är kroppens sätt att förbereda dig för fara. Men när du är stressad över arbete behöver du inte fly eller slåss.\n\nDjup andning från magen aktiverar din parasympatiska nervsystem – rest and digest läget. Det sänker blodtryck och lugnar sinnet.\n\nTekniken är enkel: lägg en hand på magen. Andas in genom näsan och Känn magen expandera. Andas ut genom munnen, långsamt och kontrollerat.\n\nDu kan göra detta var som helst – på jobbet, i kön, i bilen. Det behöver inte se ut som om du mediterar. Det är dold kraft som du bär med dig hela tiden." },
  { id:8, title:"Hur du bygger en bättre morgonrutin", category:"Självvård", readTime:"6 min", image:"https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800", intro:"Morningen sätter tonen för hela dagen. En bra morgonrutin behöver inte vara perfekt – den behöver bara vara din.", content:"De första 30 minuten på morningen har en enorm påverkan på hur resten av din dag blir. Det handlar inte om att vara upp kl 5 – det handlar om att skapa ett utrymme för dig själv.\n\nBörja med att stänga av telefonen. De första minuterna på morningen borde vara dina. Innan du kollar sociala medier eller nyheterna – ge dig själv 10 minuters fred.\n\nHydration är nyckeln. Drick ett glas vatten direkt. Din kropp har legat utan vätska i 6 till 8 timmar.\n\nRörelse – bara 5 minuter. Det kan vara stretching, yoga eller bara att gå ut och promenera. Det väcker upp din kropp på ett naturligt sätt.\n\nSlutnligen: tänk på en sak du vill fokusera på idag. Inte alla saker – en sak. Kom ihäg att din morgonrutin ska känslas som belöning, inte som plik." },
{ 
  id:9, 
  title:"Varfor mar du samre veckan innan mens", 
  category:"Menscykel", 
  readTime:"8 min", 
  image:"https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800", 
  intro:"Upp till 80% av alla kvinnor upplever PMS. Men varfor hander det egentligen — och vad kan du gora at det?", 
  content:"Veckan innan din mens kallas lutealfasen. Det ar har progesteronnivarna stiger och sedan faller — och det ar den snabba hormonforändringen som paverkar ditt maende.\n\nDet har ar inte inbillning. Det ar biologi.\n\n## Vad hander i kroppen?\n\nNar agylossninen skett borjar kroppen producera progesteron i väntan pa en eventuell graviditet. Om ingen befruktning sker rasar bade progesteron och ostrogen snabbt — och det paverkar serotonin, ditt lyckohormone.\n\nLagre serotonin = samre humör, mer angest, trotthet och irritabilitet.\n\n## Vanliga PMS-symptom\n\nHumorsvangningar och irritabilitet ar de vanligaste. Men aven:\n- Trotthet och lagenergi\n- Uppblasthet och viktuppgang\n- Huvudvark\n- Somnsvarigheter\n- Sotsug\n- Koncentrationssvarigehter\n- Omma brost\n\n## Vad kan du gora?\n\nDu kan inte stoppa hormonerna — men du kan minska deras paverkan.\n\nKost spelar stor roll. Minska socker och koffein under lutealfasen. Oka intaget av magnesium (mork choklad, notter, spenat) — forskning visar att magnesium minskar PMS-symptom.\n\nRorelse hjalper. Lagintensiv traning som yoga och promenad minskar angest och humorssvangningar under lutealfasen.\n\nSomn ar extra viktigt nu. Kroppen ar mer kanslig for somnbrist under lutealfasen.\n\nJournaling kan hjalpa dig se monster. Nar borjar dina symptom? Vad forvarrar dem? Vad lindrar dem?\n\n## Nar ar det inte langre PMS?\n\nOm dina symptom ar sa svara att de paverkar din vardag, dina relationer eller ditt arbete — kan det vara PMDD. Las mer om det i vaar artikel om PMDD." 
},
{ 
  id:10, 
  title:"Hur din cykel paverkar energi, humör och fokus", 
  category:"Menscykel", 
  readTime:"10 min", 
  image:"https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800", 
  intro:"Din menscykel ar inte bara reproduktion — den paverkar din energi, din hjarna och ditt humör varje dag.", 
  content:"De flesta kvinnor tänker pa sin menscykel som nagot som hander en gang i manaden. Men i verkligheten paverkar cykeln dig varje enskild dag.\n\nGenom att forsta din cykel kan du planera ditt liv smartare — och vara snallare mot dig sjalv nar du inte mar pa topp.\n\n## De fyra faserna\n\n### Mensfasen (dag 1-5)\n\nKroppen bloder och hormonnivarna ar laga. Energin ar pa sin lagsta punkt. Det har ar inte ratt tid att prestera maximalt — det ar ratt tid att vila och aterhamta.\n\nVad passar bra: lugn yoga, promenader, kreativt arbete, reflektion.\nVad passar daligt: intensiv traning, stora beslut, sociala aktiviteter.\n\n### Follikelfasen (dag 6-13)\n\nOstrogen borjar stiga och du kanner hur energin ater. Det har ar din starkaste fas — hjarnan ar skarp, humöret ljusnar och du kanner motivation.\n\nVad passar bra: nya projekt, socialt umgange, intensiv traning, inlarning.\nVad passar daligt: ingenting — du ar pa topp!\n\n### Agglossning (dag 14)\n\nOstrogentoppen nar sin hojdpunkt och du ar troligtvis pa ditt energimassiga maximum. Kommunikationsforgman ar extra stark nu.\n\nVad passar bra: viktiga moten, presentationer, dejting, sociala evenemang.\n\n### Lutealfasen (dag 15-28)\n\nProgesteron stiger och sedan faller. Energin minskar gradvis. Under de sista dagarna kan PMS-symptom uppsta.\n\nVad passar bra: detaljearbete, analytiskt tankande, avsluta projekt.\nVad passar daligt: nya stora initiativ, konfliktfyllda samtal.\n\n## Hur du anvander den har kunskapen\n\nBorja med att spara din cykel i var CycleTracker. Efter 2-3 manader borjar du se monster — nar du mar bast, nar du behover mer vila, nar du ar mest produktiv.\n\nDen har kunskapen ar inte till for att begränsa dig. Den ar till for att du ska sluta kampa mot din kropp — och borja jobba med den istallet." 
},
{ 
  id:11, 
  title:"PMDD — nar PMS blir mer an PMS", 
  category:"Menscykel", 
  readTime:"9 min", 
  image:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800", 
  intro:"PMDD paverkar upp till 8% av alla kvinnor i fertil alder — men de flesta vet inte ens att det finns.", 
  content:"Premenstruellt dysforiskt syndrom, PMDD, ar en allvarligare form av PMS som paverkar humöret pa ett satt som kan kanna likna depression eller svår angest.\n\nOm du kanner att du 'byter personlighet' veckan innan din mens — att du kanner dig hopplös, extremt irritabel, angstfylld eller till och med deprimerad — kan PMDD vara forklaringen.\n\n## Skillnaden mellan PMS och PMDD\n\nVanlig PMS ger obehagliga symptom som paverkar hur du mar. PMDD ger symptom som paverkar din fomaga att fungera i vardagen.\n\nSymptom pa PMDD:\n- Svart depression eller hopplöshetskansla\n- Extrem irritabilitet eller ilska\n- Paniksymptom\n- Svarigehter att koncentrera sig\n- Kraftig trotthet\n- Somnproblem\n- Tankar pa att skada sig\n\nNyckelskillnaden: Symptomen borjar typiskt 1-2 veckor fore mensen och forsvinner inom nagra dagar efter att mensen borjar.\n\n## Vad orsakar PMDD?\n\nForskning pekar pa en ovanlig kanslighet for normala hormonforandringar — sarskilt fallet av progesteron och ostrogen efter agglossningen. Hjarnan reagerar pa ett satt som utloser starka humorsforandringar.\n\nDet ar inte din falt. Det ar inte inbillning. Det ar en medicinsk tillstand.\n\n## Behandling\n\nPMDD ar behandlingsbart. Alternativen inkluderar:\n\nLivsforandringar: kost, rorelse, somn och stresshantering kan minska symptomen.\n\nKognitivt beteendeterapi (KBT) har god evidens for PMDD.\n\nLakemedel: SSRI-preparat (antidepressiva) har stark evidens for PMDD — de kan tas antingen dagligen eller bara under lutealfasen.\n\nHormonella preventivmedel kan hjalpa vissa.\n\n## Nar ska du soka hjalp?\n\nOm du kanner igen dig i symptomen — prata med din lakare. PMDD ar underdiagnostiserat och manga kvinnor lider i onödan i ar utan att veta vad det ar.\n\nDu fortjanar hjalp." 
},
{ 
  id:12, 
  title:"Traning och kost under olika faser av cykeln", 
  category:"Menscykel", 
  readTime:"11 min", 
  image:"https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800", 
  intro:"Att anpassa traning och kost efter din cykel kan gora stor skillnad for bade prestationen och hur du mar.", 
  content:"Din kropp ar inte samma fran dag till dag. Hormonnivarna forandras konstant under cykeln — och det paverkar allt fran muskelaterhamtning till aptit och energi.\n\nAtt ignorera det har och trena likadant varje dag ar att jobba mot kroppen. Att anpassa sig ar att jobba med den.\n\n## Traning per fas\n\n### Mensfasen — vila och latt rorelse\n\nKroppen ar i ett inflammatoriskt tillstand och energin ar lag. Det har ar inte ratt tid for harda pass.\n\nBra: promenader, lugn yoga, stretching, simning i lagintensitet.\nUndvik: HIIT, tung styrketraning, langlopp.\n\nOm du vill trena: lyssna pa kroppen. Lite rorelse ar battre an ingen — men tvinga dig inte.\n\n### Follikelfasen — bygg upp\n\nOstrogen okar och kroppen aterhamtar sig snabbare fran traning. Det har ar din optimala fas for att bygga styrka och kondition.\n\nBra: styrketraning, HIIT, lopning, nya utmaningar.\nFokus: progressiv overlast, pressa granser.\n\n### Agglossning — maximal prestation\n\nDu ar pa topp. Kroppen klarar av mer och aterhamtningen ar snabb.\n\nBra: tavlingar, PB-forsok, intensiva gruppass.\nOBS: Forskning visar okat risk for ligamentskador runt agglossningen — var uppmarsam pa knana.\n\n### Lutealfasen — minska gradvis\n\nProgesterons paverkan gor att kroppen aterhamtar sig sämre. Intensiteten bor minska under de sista dagarna.\n\nBra: yoga, pilates, latt styrketraning, promenader.\nFokus: aterhamtning och rorlighetstraning.\n\n## Kost per fas\n\n### Mensfasen\n\nJarnutsondringen okar — at jarnrik mat (rod kott, linser, morka bladgronsaker). Magnesium hjalper mot kramper (mork choklad, notter).\n\nUndvik: koffein (forvarrar kramper), alkohol, mycket salt (okar uppblasthet).\n\n### Follikelfasen\n\nKroppen anvander kol hydrater effektivare nu. Bra fas for att trena hart och ata mer kolhydrater.\n\nFokus: balanserad kost, massor av gronsaker, lean protein.\n\n### Agglossning\n\nMar du bast nu — kosten spelar mindre roll. Fortsatt med nararik mat och hydrera bra.\n\n### Lutealfasen\n\nSotsug okar — det ar biologiskt, inte bristande viljestyrka. Kom igang med det.\n\nBra: komplexa kolhydrater (havre, sotoatis, quinoa) stabiliserar blodsockret. Magnesium minskar PMS.\nUndvik: socker, raffinerade kolhydrater, koffein och alkohol — de forvarrar alla PMS-symptom.\n\n## Kom igang\n\nBorja enkelt: anteckna hur du kanner dig fore, under och efter traning under en hel cykel. Du kommer se monster snabbt." 
},
{ 
  id:13,
  title:"Människan bakom masken",
  category:"Personlig berättelse",
  readTime:"8 min",
  featured:true,
  podcastUrl:"https://open.spotify.com/show/3OwdDmeLPNnFunKnJRvrss?si=PTjhS8LcQQy2OcPKzvNl8Q",
  image:"https://i.imgur.com/mKXoyAu.webp",
  intro:"På bara ett år förlorade jag fyra nära i suicid. Det var tystnaden efteråt som fick mig att vilja göra något.",
  content:"På bara ett år förändrades hela mitt liv.\n\nI januari 2025 förlorade jag min syster i suicid. Sorgen var omöjlig att ta in. Chocken, tomheten och känslan av att inget längre var verkligt. Innan jag ens hunnit förstå vad som hänt eller börja bearbeta förlusten, förlorade jag även min mamma i februari 2025 – också i suicid.\n\nMen tragedierna slutade inte där.\n\nI oktober 2025 förlorade jag min kusin. Och i januari 2026 förlorade jag även min moster - också dessa två i suicid.\n\nFyra människor. Fyra förluster. På ett år.\n\nDet går inte att beskriva med ord vad den typen av sorg gör med en människa. När man förlorar så många nära på så kort tid förändras allt – tryggheten, tankarna, kroppen, sömnen och hela synen på livet. Man försöker överleva dag för dag samtidigt som världen runt omkring fortsätter som vanligt.\n\nMånga ser bara utsidan. Att man fortfarande går upp på morgonen, arbetar, ler ibland och försöker fungera. Men inuti pågår ofta en kamp ingen annan ser. Sorgen efter suicid är inte bara saknad – den är fylld av frågor, skuld, trauma och tystnad.\n\nDet var just tystnaden som fick mig att vilja göra något.\n\nEfter allt jag varit med om kände jag att jag inte längre ville tiga om psykisk ohälsa, suicid och människors smärta. Jag vet hur ensamt det kan kännas. Hur lätt det är att tro att ingen förstår. Därför valde jag att en podd.\n\nPodden blev mitt sätt att omvandla smärta till något meningsfullt.\n\nDär pratar jag öppet om psykisk ohälsa, trauma, sorg, självkänsla och livet efter förlust. Jag vill skapa samtal som är äkta – utan filter och utan skam. För ibland kan det räcka att höra någon annan sätta ord på det man själv känner för att orka lite till.\n\nAtt starta podden har inte tagit bort sorgen. Jag kommer alltid bära med mig min syster, min mamma, min kusin och min moster. Men podden har gett mig ett syfte mitt i allt mörker. Ett sätt att hedra dem genom att våga prata om det som så många försöker gömma undan.\n\nOm min historia kan hjälpa någon annan att känna sig mindre ensam, våga öppna sig eller söka hjälp – då finns det mening i att jag berättar den."
}
];

const resources = [
  { name:"Mind Självmordslinjen", phone:"90101", hours:"Dygnet runt", description:"Chat och samtal. Anonymt och gratis stöd när livet känns hopplöst.", type:"Kris" },
  { name:"Suicide Zero", phone:null, website:"https://suicidezero.se", hours:null, description:"Viktig information och fakta om självmord och förebyggande arbete.", type:"Information" },
  { name:"1177 Vårdguiden", phone:"1177", hours:"Dygnet runt", description:"Sjuksköterskor som ger råd och hänvisar vidare vid behov.", type:"Sjukvård" },
  { name:"BRIS", phone:"0771-150 50 50", hours:"Vardagar", description:"Om du är orolig för att barn far illa. Stöd och rådgivning för vuxna som är oroliga för barn.", type:"Barn" },
  { name:"Jourhavande präst", phone:"112", hours:"Dygnet runt", description:"Via SOS Alarm kan du be att få prata med jourhavande präst. Anonymt samtal oavsett trosuppfattning.", type:"Andligt stöd" },
  { name:"Jourhavande medmänniska", phone:"08-702 16 80", hours:"Nätterna 21:00–06:00", description:"Anonymt stöd och någon att prata med. Chat öppet varje kväll 21:00–24:00.", type:"Samtal" }
];

const testimonials = [
  { id:1, name:"Emma L.", role:"Använder Trygga Kvinnor sedan 6 månader", text:"Jag har kämpat med ångest i flera år. Att ha tillgång till stöd mitt i natten när paniken kommer har varit livsförändrande. AI-chatten känns som att prata med någon som förstår, och artiklarna har gett mig konkreta verktyg.", avatar:"" },
  { id:2, name:"Sofia M.", role:"Premium-medlem", text:"Jag var skeptisk till online-terapi först, men att kunna chatta med en riktig terapeut på mina villkor har gjort hela skillnaden. Ingen restid, ingen väntetid – bara stöd när jag behöver det.", avatar:"" },
  { id:3, name:"Lina K.", role:"Använder mående-dagboken", text:"Att se mina mönster över tid har gjort att jag förstår min ångest så mycket bättre. Jag kan visa min terapeut konkret data istället för att bara säga 'jag mår dåligt'. Det är guld värt.", avatar:"" },
  { id:4, name:"Anna S.", role:"Andningsövningar + meditation", text:"Jag trodde aldrig att andning kunde göra så stor skillnad. Nu använder jag 4-7-8 metoden varje gång jag känner ångest komma. Det funkar faktiskt.", avatar:"" },
  { id:5, name:"Maria H.", role:"Community-medlem", text:"Att läsa att andra kämpar med samma saker som jag har fått mig att känna mig mindre ensam. Vi stöttar varandra och delar tips. Det är ovärderligt.", avatar:"" },
  { id:6, name:"Jessica T.", role:"Från skeptisk till övertygad", text:"Jag trodde det här var någon app-grej som inte skulle fungera. Men efter två månader mår jag märkbart bättre. Kombinationen av verktyg, kunskap och stöd är perfekt.", avatar:"" }
];

const faqs = [
  { id:1, question:"Är AI-rådgivningen säker och privat?", answer:"Ja, absolut. All kommunikation är krypterad. Vi sparar ingen identifierbar information utan ditt samtycke. Du kan vara helt anonym om du vill – inget namn, ingen e-post krävs för basanvändning." },
  { id:2, question:"Kan AI-chatten ersätta en riktig terapeut?", answer:"Nej. AI-rådgivningen är ett komplement, inte en ersättning. Den är bra för vardagligt stöd, verktyg och att prata igenom tankar. Men vid djupare problem, traumas eller klinisk depression/ångest rekommenderar vi starkt professionell terapi." },
  { id:3, question:"Vad händer om jag är i kris?", answer:"AI-chatten är tränad att identifiera kris-situationer och kommer omedelbart hänvisa dig till Mind Självmordslinjen (90101) eller 112. Vi har också tydliga resurser med alla viktiga kris-nummer. Vid akut fara – ring alltid 112 direkt." },
  { id:4, question:"Hur fungerar Premium med riktig terapeut?", answer:"Med Premium kan du chatta med legitimerade psykoterapeuter. Du skriver när du vill, och terapeuten svarar inom 24 timmar. Det är som att ha en terapeut i fickan – men på dina villkor. Inga restider, inga bokade tider." },
  { id:5, question:"Kan jag avsluta när som helst?", answer:"Ja! Ingen bindningstid. Du kan avsluta ditt medlemskap när du vill. Vi har även 30 dagars pengarna-tillbaka-garanti om du inte är nöjd." },
  { id:6, question:"Sparas mina mood tracker-uppgifter?", answer:"Ja, de sparas krypterat så att du kan följa din utveckling över tid. Men det är DINA uppgifter – du kan exportera dem, radera dem eller begära att få se allt vi har sparat när som helst." },
  { id:7, question:"Vem kan använda Trygga Kvinnor?", answer:"Plattformen är skapad för kvinnor, men alla är välkomna. Vi fokuserar på kvinnors specifika utmaningar med mental hälsa, men verktygen fungerar för alla människor." },
  { id:8, question:"Fungerar det verkligen?", answer:"Ja – men det kräver att du använder det. Meditation, andning, mående-dagbok och artiklar är evidensbaserade verktyg som forskning visar funkar. Men precis som gymmet – det fungerar bara om du faktiskt tränar." }
];

/* ============================================================
   BREATHING EXERCISE OVERLAY
   ============================================================ */
const BreathingExercise = ({ exercise, onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const cycleTime = exercise.phases.reduce((s, p) => s + p.duration, 0);
  const timeInCycle = elapsed % cycleTime;
  let acc = 0, currentPhase = exercise.phases[0], timeLeft = exercise.phases[0].duration;
  for (let i = 0; i < exercise.phases.length; i++) {
    if (timeInCycle < acc + exercise.phases[i].duration) {
      currentPhase = exercise.phases[i];
      timeLeft = exercise.phases[i].duration - (timeInCycle - acc);
      break;
    }
    acc += exercise.phases[i].duration;
  }
  useEffect(() => {
    if (!isRunning || elapsed >= exercise.totalDuration) { if (elapsed >= exercise.totalDuration) setIsRunning(false); return; }
    const t = setInterval(() => setElapsed(p => p + 1), 1000);
    return () => clearInterval(t);
  }, [isRunning, elapsed, exercise.totalDuration]);
  const remaining = exercise.totalDuration - elapsed;
  const done = elapsed >= exercise.totalDuration;
  const colors = { 'Andas IN':'#7BAF8E', 'HÅLL':'#E8B4A8', 'Andas UT':'#D4756F' };
  const col = colors[currentPhase.label] || '#7BAF8E';
  const size = currentPhase.label === 'Andas IN' ? '240px' : currentPhase.label === 'Andas UT' ? '140px' : '190px';

  return (
    <div className="breathing-overlay">
      <div className="breathing-modal">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>{exercise.title}</h2>
        <p className="exercise-subtitle">{exercise.purpose}</p>
        {done ? (
          <div className="exercise-complete">
            <div className="complete-circle">&#10003;</div>
            <h3>Bra jobbat!</h3>
            <p>Du har avslutat övningen. Känn hur din kropp och sinne har lugnat sig.</p>
            <button className="btn-primary" onClick={() => setElapsed(0)}>Gör igen</button>
          </div>
        ) : (
          <>
            <div className="breath-circle-container">
             <div className="breath-circle" style={{ width: size, height: size, transition: 'width ' + currentPhase.duration + 's ease, height ' + currentPhase.duration + 's ease, border-color 0.5s, box-shadow 0.5s', borderColor: col, boxShadow: '0 0 60px ' + col + '50' }}>
                <span className="breath-phase-label" style={{ color: col }}>{currentPhase.label}</span>
                <span className="breath-countdown">{timeLeft}</span>
              </div>
            </div>
            <p className="remaining-time-text">{Math.floor(remaining/60)}:{(remaining%60).toString().padStart(2,'0')} kvar</p>
            <div className="phase-indicators">
            {exercise.phases.map((ph, i) => <div key={i} className={'phase-dot ' + (currentPhase.label === ph.label ? 'active' : '')} style={currentPhase.label === ph.label ? {color: colors[ph.label]} : {}}>{ph.label} ({ph.duration}s)</div>)}
            </div>
            <button className="btn-primary" onClick={() => setIsRunning(!isRunning)}>{isRunning ? 'Paus' : elapsed === 0 ? 'Starta' : 'Fortsätt'}</button>
          </>
        )}
      </div>
    </div>
  );
};

/* ============================================================
   MEDITATION CARD
   ============================================================ */
const MeditationCard = ({ med }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="meditation-card">
      <div className="meditation-image" style={{ backgroundImage: 'url(' + med.image + ')' }}>
      </div>
      <div className="meditation-content">
        <span className="meditation-category">{med.category}</span>
        <h3>{med.title}</h3>
        <p className="med-desc">{med.description}</p>
        <div className="meditation-footer">
          <span className="duration">{med.duration}</span>
          <button className="btn-secondary" onClick={() => setOpen(!open)}>{open ? 'Dölj guide' : 'Visa guide'}</button>
        </div>
        {open && (
          <div className="meditation-steps">
            <h4>Steg-för-steg:</h4>
            {med.steps.map((step, i) => (
              <div key={i} className="meditation-step">
                <span className="step-number">{i+1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ============================================================
   PAGE COMPONENTS
   ============================================================ */
const MeditationPage = ({ nav }) => {
  const [activeEx, setActiveEx] = useState(null);
  return (
    <div className="page-content">
      {activeEx && <BreathingExercise exercise={activeEx} onClose={() => setActiveEx(null)} />}
      <div className="page-hero meditation-hero"><h1>Meditation och Andning</h1><p>Guidat stöd för inre ro och balans</p></div>
      <section className="content-section">
        <h2>Meditationer</h2>
        <p className="section-intro">Klicka på en meditation för att se steg-för-steg guiden</p>
        <div className="meditation-grid">{meditations.map(m => <MeditationCard key={m.id} med={m} />)}</div>
      </section>
      <section className="content-section breathing-section">
        <h2>Andningsövningar</h2>
        <p className="section-intro">Interaktiva övningar med timer och visuell guide</p>
        <div className="breathing-grid">
          {breathingExercises.map(br => (
            <div key={br.id} className="breathing-card">
              <div className="breathing-image"style={{ backgroundImage: 'url(' + br.image + ')' }}>
              </div>
              <h3>{br.title}</h3>
              <span className="breathing-purpose">{br.purpose}</span>
              <p>{br.description}</p>
              <button className="btn-primary" onClick={() => setActiveEx(br)}>Starta övningen</button>
            </div>
          ))}
        </div>
      </section>
      <div className="spotify-section">
        <h2>Musik för meditation</h2>
        <div className="spotify-grid">
          <div className="spotify-embed"><h4>Lugn och Meditation</h4><iframe style={{borderRadius:'12px'}} src="https://open.spotify.com/embed/playlist/37i9dQZF1DWZqd5JICZI0u?utm_source=generator&theme=0" width="100%" height="152" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe></div>
          <div className="spotify-embed"><h4>Djup sömn</h4><iframe style={{borderRadius:'12px'}} src="https://open.spotify.com/embed/playlist/37i9dQZF1DWZd79rJ6a7lp?utm_source=generator&theme=0" width="100%" height="152" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe></div>
        </div>
      </div>
    </div>
  );
};

const ArticlesPage = ({ nav, isPremium, openArticleId }) => {
  const [sel, setSel] = useState(null);
  const [cat, setCat] = useState('Alla');

  useEffect(() => {
    if (openArticleId) {
      const article = articles.find(a => a.id === openArticleId);
      if (article) setSel(article);
    }
  }, [openArticleId]);
  const cats = ['Alla', ...new Set(articles.map(a => a.category))];
  const filtered = cat === 'Alla' ? articles : articles.filter(a => a.category === cat);
  if (sel) {
    const paragraphs = sel.content.split('\n\n');
    const introText = paragraphs.slice(0, 3).join('\n\n'); // First 3 paragraphs free
    const lockedText = paragraphs.slice(3).join('\n\n');
    
    return (
      <div className="page-content">
        <div className="article-view">
          <button className="btn-text back-btn" onClick={() => setSel(null)}>&#8592; Tillbaka</button>
          <div className="article-hero-image" style={{ backgroundImage: 'url(' + sel.image + ')' }}>
          </div>
          <div className="article-view-content">
            <span className="article-category-tag">{sel.category}</span>
            <h1>{sel.title}</h1>
            <p className="article-meta">{sel.readTime} läsning</p>
            
            {isPremium ? (
              <div className="article-body">{paragraphs.map((p, i) => <p key={i}>{p}</p>)}</div>
            ) : (
              <>
                <div className="article-body">{introText.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}</div>
                <div style={{position:'relative',marginTop:'2rem'}}>
                  <div className="article-preview" style={{filter:'blur(4px)',userSelect:'none',pointerEvents:'none'}}>
                    {lockedText.split('\n\n').slice(0,2).map((p, i) => <p key={i}>{p}</p>)}
                  </div>
                  <div className="paywall-lock" style={{top:'50%',transform:'translate(-50%,-50%)'}}>
                    <div className="lock-icon">🔒</div>
                    <h3>Fortsätt läsa med Premium</h3>
                    <p>Få tillgång till hela artikeln och alla våra evidensbaserade guider.</p>
                    <div className="locked-badge">🔒 Premium krävs</div>
                    <button className="btn-primary" onClick={()=>nav('profil')}>Uppgradera - 39 kr/mån</button>
                  </div>
                </div>
              </>
            )}
            
            <button className="btn-secondary back-btn-bottom" onClick={() => setSel(null)}>&#8592; Tillbaka till artiklar</button>
         <button className="nav-btn" onClick={()=>nav('terapeut')}>Admin</button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="page-content">
      <div className="page-hero articles-hero"><h1>Artiklar och Kunskap</h1><p>Evidensbaserad information för din mentala hälsa</p></div>
      <div className="articles-filter-section">
        <select value={cat} onChange={e => setCat(e.target.value)} className="category-select">{cats.map(c => <option key={c} value={c}>{c}</option>)}</select>
        <p className="articles-count">{filtered.length} artiklar</p>
      </div>
      <div className="articles-grid">
        {filtered.map(a => (
          <div key={a.id} className="article-card" onClick={() => setSel(a)}>
            <div className="article-image" style={{ backgroundImage: 'url(' + a.image + ')', backgroundSize: a.id === 13 ? 'contain' : 'cover', backgroundRepeat: 'no-repeat', backgroundColor: a.id === 13 ? 'white' : 'transparent' }}>
            </div>
            <div className="article-text-content">
              <span className="article-category-tag">{a.category}</span>
              <h3>{a.title}</h3>
              <p className="article-intro">{a.intro}</p>
              <span className="read-time">{a.readTime} läsning &#8594;</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
const CycleTracker = ({ currentUser, moods = [] }) => {
  const [cycleData, setCycleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [lastPeriodStart, setLastPeriodStart] = useState('');
  const [bleedingDays, setBleedingDays] = useState([]);
  const [showSetup, setShowSetup] = useState(false);
  const [saved, setSaved] = useState(false);
  const [todaySymptoms, setTodaySymptoms] = useState([]);
const [symptomLog, setSymptomLog] = useState({});
  useEffect(() => {
    if (!currentUser) return;
    const loadCycle = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'users', currentUser.uid));
        if (docSnap.exists() && docSnap.data().cycle) {
          const c = docSnap.data().cycle;
          setCycleData(c);
          setCycleLength(c.cycleLength || 28);
          setPeriodLength(c.periodLength || 5);
          setLastPeriodStart(c.lastPeriodStart || '');
          setBleedingDays(c.bleedingDays || []);
        } else {
          setShowSetup(true);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    loadCycle();
  }, [currentUser]);

  const saveCycle = async () => {
    if (!lastPeriodStart || !currentUser) return;
    const data = { cycleLength, periodLength, lastPeriodStart, bleedingDays, updatedAt: new Date().toISOString() };
    await setDoc(doc(db, 'users', currentUser.uid), { cycle: data }, { merge: true });
    setCycleData(data);
    setShowSetup(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleBleedingDay = async (dateStr) => {
    const updated = bleedingDays.includes(dateStr)
      ? bleedingDays.filter(d => d !== dateStr)
      : [...bleedingDays, dateStr];
    setBleedingDays(updated);
    if (currentUser) {
      await updateDoc(doc(db, 'users', currentUser.uid), { 'cycle.bleedingDays': updated });
    }
  };

  const getCycleInfo = () => {
    if (!lastPeriodStart) return null;
    const start = new Date(lastPeriodStart);
    const today = new Date();
    today.setHours(0,0,0,0);
    const daysSinceStart = Math.floor((today - start) / (1000 * 60 * 60 * 24));
    const dayInCycle = (daysSinceStart % cycleLength) + 1;
    const ovulationDay = cycleLength - 14;
    const cyclesCompleted = Math.floor(daysSinceStart / cycleLength);
    const nextPeriod = new Date(start);
    nextPeriod.setDate(start.getDate() + (cyclesCompleted + 1) * cycleLength);
    const daysUntilPeriod = Math.floor((nextPeriod - today) / (1000 * 60 * 60 * 24));
    const daysUntilOvulation = ovulationDay - dayInCycle;

    let phase, phaseColor, phaseEmoji, phaseDesc;
    if (dayInCycle <= periodLength) {
      phase = 'Mensfas'; phaseColor = '#D4756F'; phaseEmoji = '🌹';
      phaseDesc = 'Vila är viktigt nu. Värme och omsorg om kroppen.';
    } else if (dayInCycle <= ovulationDay - 2) {
      phase = 'Follikelfas'; phaseColor = '#7BAF8E'; phaseEmoji = '🌱';
      phaseDesc = 'Energin ökar! Bra tid för nya projekt och socialt umgänge.';
    } else if (dayInCycle <= ovulationDay + 2) {
      phase = 'Ägglossning'; phaseColor = '#E8B466'; phaseEmoji = '✨';
      phaseDesc = 'Du är troligtvis på topp energimässigt just nu!';
    } else {
      phase = 'Lutealfas'; phaseColor = '#E8B4A8'; phaseEmoji = '🌙';
      phaseDesc = 'PMS-symptom kan förekomma. Var snäll mot dig själv.';
    }

    return { dayInCycle, phase, phaseColor, phaseEmoji, phaseDesc, daysUntilPeriod, daysUntilOvulation, nextPeriod };
  };

  const generateICS = () => {
    if (!lastPeriodStart) return;
    const events = [];
    const start = new Date(lastPeriodStart);

    for (let i = 0; i < 6; i++) {
      const periodStart = new Date(start);
      periodStart.setDate(start.getDate() + i * cycleLength);
      const ovulation = new Date(periodStart);
      ovulation.setDate(periodStart.getDate() + cycleLength - 14);
      const reminder = new Date(periodStart);
      reminder.setDate(periodStart.getDate() - 3);
      const fmt = d => d.toISOString().replace(/-|:|\.\d{3}/g, '').slice(0, 8);

      events.push('BEGIN:VEVENT\nUID:period-' + i + '@tryggakvinnor\nDTSTART;VALUE=DATE:' + fmt(periodStart) + '\nDTEND;VALUE=DATE:' + fmt(periodStart) + '\nSUMMARY:🌹 Mens börjar\nDESCRIPTION:Din mens beräknas börja idag\nBEGIN:VALARM\nTRIGGER:-P3D\nACTION:DISPLAY\nDESCRIPTION:Mens om 3 dagar!\nEND:VALARM\nEND:VEVENT');
      events.push('BEGIN:VEVENT\nUID:ovulation-' + i + '@tryggakvinnor\nDTSTART;VALUE=DATE:' + fmt(ovulation) + '\nDTEND;VALUE=DATE:' + fmt(ovulation) + '\nSUMMARY:✨ Ägglossning\nDESCRIPTION:Beräknad ägglossning idag\nEND:VEVENT');
      events.push('BEGIN:VEVENT\nUID:reminder-' + i + '@tryggakvinnor\nDTSTART;VALUE=DATE:' + fmt(reminder) + '\nDTEND;VALUE=DATE:' + fmt(reminder) + '\nSUMMARY:💗 Mens om 3 dagar\nDESCRIPTION:Din mens beräknas komma om 3 dagar\nEND:VEVENT');
    }

    const ics = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Trygga Kvinnor//Menscykel//SV\nCALSCALE:GREGORIAN\n' + events.join('\n') + '\nEND:VCALENDAR';
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'menscykel_tryggakvinnor.ics';
    a.click();
  };

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  };

  if (loading) return null;

  const info = getCycleInfo();

  return (
    <div style={{background:'white',borderRadius:'24px',padding:'2rem',margin:'2rem 5%',boxShadow:'var(--shadow-sm)',border:'1px solid var(--border)'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.2rem'}}>
        <h3 style={{fontFamily:'Playfair Display,serif',fontSize:'1.4rem'}}>🌹 Min menscykel</h3>
        <button onClick={()=>setShowSetup(!showSetup)} style={{background:'none',border:'2px solid var(--border)',borderRadius:'50px',padding:'0.4rem 1rem',cursor:'pointer',fontFamily:'inherit',fontSize:'0.85rem',color:'var(--text-medium)'}}>
          {showSetup ? 'Stäng' : '⚙️ Inställningar'}
        </button>
      </div>

      {showSetup && (
        <div style={{background:'var(--cream)',borderRadius:'16px',padding:'1.5rem',marginBottom:'1.5rem'}}>
          <h4 style={{marginBottom:'1rem',color:'var(--primary)'}}>Fyll i din cykel</h4>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'1rem',marginBottom:'1rem'}}>
            <div>
              <label style={{fontWeight:600,fontSize:'0.85rem',display:'block',marginBottom:'0.4rem'}}>Första dagen senaste mens</label>
              <input type="date" value={lastPeriodStart} onChange={e=>setLastPeriodStart(e.target.value)} className="mood-select" style={{width:'100%'}}/>
            </div>
            <div>
              <label style={{fontWeight:600,fontSize:'0.85rem',display:'block',marginBottom:'0.4rem'}}>Cykellängd (dagar)</label>
              <input type="number" min="21" max="35" value={cycleLength} onChange={e=>setCycleLength(parseInt(e.target.value))} className="mood-select" style={{width:'100%'}}/>
              <span style={{fontSize:'0.75rem',color:'var(--text-light)'}}>Vanligtvis 21-35 dagar</span>
            </div>
            <div>
              <label style={{fontWeight:600,fontSize:'0.85rem',display:'block',marginBottom:'0.4rem'}}>Menslängd (dagar)</label>
              <input type="number" min="2" max="8" value={periodLength} onChange={e=>setPeriodLength(parseInt(e.target.value))} className="mood-select" style={{width:'100%'}}/>
              <span style={{fontSize:'0.75rem',color:'var(--text-light)'}}>Vanligtvis 3-7 dagar</span>
            </div>
          </div>
          <button onClick={saveCycle} className="btn-primary">
            {saved ? '✓ Sparat!' : 'Spara'}
          </button>
        </div>
      )}

      {info ? (
        <div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:'1rem',marginBottom:'1.5rem'}}>
            <div style={{background:'linear-gradient(135deg,rgba(212,117,111,0.08),rgba(232,180,168,0.08))',borderRadius:'16px',padding:'1.2rem',textAlign:'center'}}>
              <div style={{fontSize:'2rem',marginBottom:'0.3rem'}}>{info.phaseEmoji}</div>
              <div style={{fontWeight:700,color:info.phaseColor,fontSize:'0.95rem'}}>{info.phase}</div>
              <div style={{fontSize:'0.75rem',color:'var(--text-light)'}}>Dag {info.dayInCycle} av {cycleLength}</div>
            </div>
            <div style={{background:'linear-gradient(135deg,rgba(212,117,111,0.08),rgba(232,180,168,0.08))',borderRadius:'16px',padding:'1.2rem',textAlign:'center'}}>
              <div style={{fontSize:'2rem',fontWeight:700,color:'var(--primary)'}}>{info.daysUntilPeriod}</div>
              <div style={{fontSize:'0.78rem',color:'var(--text-light)'}}>dagar till nästa mens</div>
              <div style={{fontSize:'0.7rem',color:'var(--text-light)',marginTop:'0.2rem'}}>{info.nextPeriod.toLocaleDateString('sv-SE')}</div>
            </div>
            <div style={{background:'linear-gradient(135deg,rgba(123,175,142,0.08),rgba(160,200,176,0.08))',borderRadius:'16px',padding:'1.2rem',textAlign:'center'}}>
              <div style={{fontSize:'2rem',fontWeight:700,color:'var(--accent)'}}>{info.daysUntilOvulation > 0 ? info.daysUntilOvulation : '—'}</div>
              <div style={{fontSize:'0.78rem',color:'var(--text-light)'}}>dagar till ägglossning</div>
            </div>
          </div>

          <div style={{background:'rgba(212,117,111,0.06)',borderRadius:'12px',padding:'1rem',marginBottom:'1.5rem',fontSize:'0.88rem',color:'var(--text-medium)'}}>
            {info.phaseEmoji} <strong>{info.phase}:</strong> {info.phaseDesc}
          </div>
          <div style={{background:'rgba(123,175,142,0.08)',borderRadius:'12px',padding:'1rem',marginBottom:'1.5rem'}}>
  <h4 style={{fontSize:'0.95rem',marginBottom:'0.6rem',color:'var(--accent)'}}>💡 Tips för din fas idag</h4>
  {info.phase === 'Mensfas' && (
    <ul style={{listStyle:'none',fontSize:'0.85rem',color:'var(--text-medium)',display:'flex',flexDirection:'column',gap:'0.4rem'}}>
      <li>🛁 Ta ett varmt bad för att lindra kramper</li>
      <li>🍫 Magnesiumrik mat hjälper — mörk choklad, nötter</li>
      <li>🧘 Lugn yoga eller promenad är perfekt nu</li>
      <li>😴 Prioritera sömn — kroppen jobbar hårt</li>
    </ul>
  )}
  {info.phase === 'Follikelfas' && (
    <ul style={{listStyle:'none',fontSize:'0.85rem',color:'var(--text-medium)',display:'flex',flexDirection:'column',gap:'0.4rem'}}>
      <li>💪 Energin ökar — bra tid för intensivare träning</li>
      <li>🌱 Starta nya projekt och ta sociala initiativ</li>
      <li>🥗 Lätta måltider med mycket grönsaker passar bra</li>
      <li>📚 Hjärnan är skarp — perfekt för inlärning</li>
    </ul>
  )}
  {info.phase === 'Ägglossning' && (
    <ul style={{listStyle:'none',fontSize:'0.85rem',color:'var(--text-medium)',display:'flex',flexDirection:'column',gap:'0.4rem'}}>
      <li>✨ Du är på topp — utnyttja energin!</li>
      <li>🗣️ Bra tid för viktiga samtal och presentationer</li>
      <li>🏃 Kroppen klarar hård träning bra nu</li>
      <li>💃 Socialt och utåtriktat läge — njut av det!</li>
    </ul>
  )}
  {info.phase === 'Lutealfas' && (
    <ul style={{listStyle:'none',fontSize:'0.85rem',color:'var(--text-medium)',display:'flex',flexDirection:'column',gap:'0.4rem'}}>
      <li>🌙 Sakta ner och lyssna på kroppen</li>
      <li>🍵 Örtte som kamomille och ingefära kan hjälpa</li>
      <li>📓 Journaling hjälper mot humörsvängningar</li>
      <li>🚫 Minska koffein och socker om möjligt</li>
    </ul>
  )}
</div>
      {bleedingDays.length >= 2 && (
  <div style={{background:'var(--cream)',borderRadius:'12px',padding:'1rem',marginBottom:'1.5rem'}}>
    <h4 style={{fontSize:'0.95rem',marginBottom:'0.6rem',color:'var(--text-dark)'}}>📊 Din cykelstatistik</h4>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.8rem',fontSize:'0.85rem',marginBottom:'1rem'}}>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:'1.5rem',fontWeight:700,color:'var(--primary)'}}>{cycleLength}</div>
        <div style={{color:'var(--text-light)'}}>Inställd cykellängd</div>
      </div>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:'1.5rem',fontWeight:700,color:'var(--accent)'}}>{bleedingDays.length}</div>
        <div style={{color:'var(--text-light)'}}>Loggade blödningsdagar</div>
      </div>
    </div>

    {(() => {
      const allSymptoms = Object.values(symptomLog).flat();
      const freq = {};
      allSymptoms.forEach(s => { freq[s] = (freq[s] || 0) + 1; });
      const top = Object.entries(freq).sort((a,b) => b[1]-a[1]).slice(0,3);
      return top.length > 0 ? (
        <div style={{marginBottom:'1rem'}}>
          <div style={{fontSize:'0.8rem',fontWeight:600,color:'var(--text-dark)',marginBottom:'0.4rem'}}>🔁 Vanligaste symptom</div>
          <div style={{display:'flex',gap:'0.4rem',flexWrap:'wrap'}}>
            {top.map(([s,c]) => (
              <span key={s} style={{background:'rgba(212,117,111,0.12)',color:'var(--primary)',borderRadius:'50px',padding:'0.2rem 0.7rem',fontSize:'0.78rem'}}>
                {s} ({c}x)
              </span>
            ))}
          </div>
        </div>
      ) : null;
    })()}

    {moods && moods.length >= 3 && (() => {
      const info = getCycleInfo();
      if (!info) return null;
      const phaseMap = { 'Mensfas': [], 'Follikelfas': [], 'Ägglossning': [], 'Lutealfas': [] };
      moods.forEach(m => {
        const d = new Date(m.date);
        const start = new Date(cycleStartDate);
        const diff = Math.floor((d - start) / (1000*60*60*24));
        const dayInCycle = (diff % cycleLength + cycleLength) % cycleLength + 1;
        const ovDay = cycleLength - 14;
        let phase = '';
        if (dayInCycle <= periodLength) phase = 'Mensfas';
        else if (dayInCycle <= ovDay - 2) phase = 'Follikelfas';
        else if (dayInCycle <= ovDay + 2) phase = 'Ägglossning';
        else phase = 'Lutealfas';
        if (phaseMap[phase]) phaseMap[phase].push(parseInt(m.energy));
      });
      const avg = arr => arr.length ? (arr.reduce((a,b)=>a+b,0)/arr.length).toFixed(1) : null;
      const phases = [
        { name:'Mensfas', emoji:'🌹', avg: avg(phaseMap['Mensfas']) },
        { name:'Follikelfas', emoji:'🌱', avg: avg(phaseMap['Follikelfas']) },
        { name:'Ägglossning', emoji:'✨', avg: avg(phaseMap['Ägglossning']) },
        { name:'Lutealfas', emoji:'🌙', avg: avg(phaseMap['Lutealfas']) },
      ].filter(p => p.avg !== null);
      return phases.length > 0 ? (
        <div>
          <div style={{fontSize:'0.8rem',fontWeight:600,color:'var(--text-dark)',marginBottom:'0.4rem'}}>⚡ Snittenergi per fas</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'0.5rem'}}>
            {phases.map(p => (
              <div key={p.name} style={{background:'white',borderRadius:'8px',padding:'0.5rem',textAlign:'center'}}>
                <div style={{fontSize:'1.1rem'}}>{p.emoji}</div>
                <div style={{fontSize:'0.75rem',color:'var(--text-light)'}}>{p.name}</div>
                <div style={{fontSize:'1rem',fontWeight:700,color:'var(--primary)'}}>{p.avg}/10</div>
              </div>
            ))}
          </div>
        </div>
      ) : null;
    })()}
  </div>
)}
            <div style={{marginBottom:'1.5rem'}}>
  <h4 style={{fontSize:'1rem',marginBottom:'0.8rem',color:'var(--text-dark)'}}>Hur mår du idag?</h4>
<p style={{fontSize:'0.82rem',color:'var(--text-light)',marginBottom:'0.8rem'}}>Tryck på en dag för att markera att du blödde</p>
            <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
    {['Huvudvärk','Humörsvängningar','Uppblåsthet','Trötthet','Ömma bröst','Kramper','Illamående','Ångest','Nedstämdhet','Acne','Sötsug','Koncentrationssvårigheter'].map(symptom => (
      <button
        key={symptom}
        onClick={() => {
          const today = new Date().toISOString().split('T')[0];
          const updated = todaySymptoms.includes(symptom)
            ? todaySymptoms.filter(s => s !== symptom)
            : [...todaySymptoms, symptom];
          setTodaySymptoms(updated);
          const newLog = {...symptomLog, [today]: updated};
          setSymptomLog(newLog);
          if (currentUser) {
            updateDoc(doc(db, 'users', currentUser.uid), { 'cycle.symptomLog': newLog });
          }
        }}
        style={{
          padding:'0.4rem 0.9rem',
          borderRadius:'50px',
          border:'2px solid ' + (todaySymptoms.includes(symptom) ? '#D4756F' : 'var(--border)'),
          background: todaySymptoms.includes(symptom) ? 'rgba(212,117,111,0.15)' : 'white',
          cursor:'pointer',
          fontSize:'0.8rem',
          fontFamily:'inherit',
          color: todaySymptoms.includes(symptom) ? '#D4756F' : 'var(--text-medium)',
          fontWeight: todaySymptoms.includes(symptom) ? 700 : 400,
          transition:'all 0.2s'
        }}
      >
        {symptom}
      </button>
    ))}
</div>
</div>
          <div style={{marginBottom:'1rem'}}>
            <h4 style={{fontSize:'1rem',marginBottom:'0.8rem',color:'var(--text-dark)'}}>Logga blödningsdagar</h4>
           <p style={{fontSize:'0.82rem',color:'var(--text-light)',marginBottom:'0.8rem'}}>Tryck på en dag för att markera att du blödde</p>
            <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
              {getLast7Days().map(dateStr => (
                <button
                  key={dateStr}
                  onClick={() => toggleBleedingDay(dateStr)}
                  style={{
                    padding:'0.5rem 0.8rem',
                    borderRadius:'12px',
                    border:'2px solid ' + (bleedingDays.includes(dateStr) ? '#D4756F' : 'var(--border)'),
                    background: bleedingDays.includes(dateStr) ? 'rgba(212,117,111,0.15)' : 'white',
                    cursor:'pointer',
                    fontSize:'0.8rem',
                    fontFamily:'inherit',
                    color: bleedingDays.includes(dateStr) ? '#D4756F' : 'var(--text-medium)',
                    fontWeight: bleedingDays.includes(dateStr) ? 700 : 400
                  }}
                >
                  {bleedingDays.includes(dateStr) ? '🩸 ' : ''}{new Date(dateStr).toLocaleDateString('sv-SE', {weekday:'short', day:'numeric'})}
                </button>
              ))}
            </div>
          </div>
          <button onClick={generateICS}
            className="btn-primary" style={{width:'100%',marginBottom:'0.5rem'}}>
            Lägg till i kalender (Google, Apple, Outlook)
          </button>
          <p style={{fontSize:'0.75rem',color:'var(--text-light)',textAlign:'center',marginBottom:'0.8rem'}}>
            Fungerar med Google Kalender, Apple Kalender och Outlook
          </p>
          <button onClick={() => {
            const ev = [];
            const t = new Date();
            for (let i = 0; i < 90; i++) {
              const d = new Date(t);
              d.setDate(t.getDate() + i);
              const f = x => x.toISOString().replace(/-|:|\.\d{3}/g,'').slice(0,8);
              ev.push('BEGIN:VEVENT\nUID:pill-' + i + '@tk\nDTSTART;VALUE=DATE:' + f(d) + '\nDTEND;VALUE=DATE:' + f(d) + '\nSUMMARY:Ta p-pillret\nBEGIN:VALARM\nTRIGGER:T080000\nACTION:DISPLAY\nDESCRIPTION:Dags!\nEND:VALARM\nEND:VEVENT');
            }
            const ics = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//TK//SV\n' + ev.join('\n') + '\nEND:VCALENDAR';
            const blob = new Blob([ics], {type:'text/calendar'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'p-piller.ics';
            a.click();
          }} style={{width:'100%',marginTop:'0.8rem',background:'none',border:'2px solid var(--border)',borderRadius:'50px',padding:'0.8rem',cursor:'pointer',fontFamily:'inherit',fontSize:'0.9rem',color:'var(--text-medium)'}}>
            P-piller påminnelse (90 dagar)
          </button>
        </div>
             ) : (
        <div style={{textAlign:'center',padding:'1.5rem',color:'var(--text-light)'}}>
          <div style={{fontSize:'2.5rem',marginBottom:'0.8rem'}}>🌹</div>
          <p style={{marginBottom:'1rem',fontSize:'0.95rem'}}>Fyll i din cykelinformation for att komma igang</p>
          <button onClick={()=>setShowSetup(true)} className="btn-secondary">Kom igang</button>
        </div>
      )}
    </div>
  );
};
 
const MoodPage = ({ isPremium, nav, currentUser }) => {
  const [moods, setMoods] = useState([]);
  const [loadingMoods, setLoadingMoods] = useState(true);
  const [mood, setMood] = useState('');
  const [energy, setEnergy] = useState(5);
  const [sleep, setSleep] = useState(7);
  const [sleepQuality, setSleepQuality] = useState('Okej');
  const [activity, setActivity] = useState(0);
  const [activityType, setActivityType] = useState('');
  const [anxiety, setAnxiety] = useState(5);
  const [stress, setStress] = useState(5);
  const [menstrualDay, setMenstrualDay] = useState(0);
  const [gratitude, setGratitude] = useState('');
  const [triggers, setTriggers] = useState('');
  const [cycleStartDate, setCycleStartDate] = useState('');
const [cycleLength, setCycleLength] = useState(28);
const [periodLength, setPeriodLength] = useState(5);
const [showCycleSetup, setShowCycleSetup] = useState(false);
const add = async (e) => {
  e.preventDefault();
  if (!mood) return;
  console.log('currentUser:', currentUser);
  console.log('mood:', mood)
  const entry = {
    date: new Date().toISOString().split('T')[0],
    mood, energy, sleep, sleepQuality, activity, activityType,
    anxiety, stress, menstrualDay, gratitude, triggers
  };
  if (currentUser) {
    const docSnap = await getDoc(doc(db, 'users', currentUser.uid));
    const existing = docSnap.exists() && docSnap.data().moods ? docSnap.data().moods : [];
    const updated = [entry, ...existing];
    await setDoc(doc(db, 'users', currentUser.uid), { moods: updated }, { merge: true });
    setMoods(updated);
  } else {
    setMoods(prev => [entry, ...prev]);
  }
  setMood(''); setEnergy(5); setSleep(7); setSleepQuality('Okej');
  setActivity(0); setActivityType(''); setAnxiety(5); setStress(5);
  setMenstrualDay(0); setGratitude(''); setTriggers('');
};
  const getCycleInfo = () => {
  if (!cycleStartDate) return null;
  const start = new Date(cycleStartDate);
  const today = new Date();
  const daysSinceStart = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  const dayInCycle = (daysSinceStart % cycleLength) + 1;
  const ovulationDay = cycleLength - 14;
  const nextPeriod = new Date(start);
  nextPeriod.setDate(start.getDate() + Math.ceil(daysSinceStart / cycleLength) * cycleLength);
  const daysUntilPeriod = Math.floor((nextPeriod - today) / (1000 * 60 * 60 * 24));
  
  let phase = '';
  let phaseColor = '';
  let phaseEmoji = '';
  if (dayInCycle <= periodLength) {
    phase = 'Mensfas'; phaseColor = '#D4756F'; phaseEmoji = '🌹';
  } else if (dayInCycle <= ovulationDay - 2) {
    phase = 'Follikelfas'; phaseColor = '#7BAF8E'; phaseEmoji = '🌱';
  } else if (dayInCycle <= ovulationDay + 2) {
    phase = 'Ägglossning'; phaseColor = '#E8B466'; phaseEmoji = '✨';
  } else {
    phase = 'Lutealfas'; phaseColor = '#E8B4A8'; phaseEmoji = '🌙';
  }
  
  return { dayInCycle, phase, phaseColor, phaseEmoji, daysUntilPeriod, ovulationDay, nextPeriod };
};

const generateICS = () => {
  if (!cycleStartDate) return;
  const info = getCycleInfo();
  const events = [];
  
  for (let i = 0; i < 6; i++) {
    const periodStart = new Date(cycleStartDate);
    periodStart.setDate(periodStart.getDate() + i * cycleLength);
    const periodEnd = new Date(periodStart);
    periodEnd.setDate(periodEnd.getDate() + periodLength);
    const ovulation = new Date(periodStart);
    ovulation.setDate(ovulation.getDate() + cycleLength - 14);
    const reminder = new Date(periodStart);
    reminder.setDate(reminder.getDate() - 3);
    
    const fmt = d => d.toISOString().replace(/-|:|\.\d{3}/g, '').slice(0, 8);
    
    events.push(`BEGIN:VEVENT\nUID:period-${i}@tryggakvinnor\nDTSTART;VALUE=DATE:${fmt(periodStart)}\nDTEND;VALUE=DATE:${fmt(periodEnd)}\nSUMMARY:🌹 Mens börjar\nDESCRIPTION:Din mens beräknas börja idag\nBEGIN:VALARM\nTRIGGER:-P3D\nACTION:DISPLAY\nDESCRIPTION:Mens om 3 dagar\nEND:VALARM\nEND:VEVENT`);
    
    events.push(`BEGIN:VEVENT\nUID:ovulation-${i}@tryggakvinnor\nDTSTART;VALUE=DATE:${fmt(ovulation)}\nDTEND;VALUE=DATE:${fmt(ovulation)}\nSUMMARY:✨ Ägglossning\nDESCRIPTION:Beräknad ägglossning idag\nEND:VEVENT`);
    
    events.push(`BEGIN:VEVENT\nUID:reminder-${i}@tryggakvinnor\nDTSTART;VALUE=DATE:${fmt(reminder)}\nDTEND;VALUE=DATE:${fmt(reminder)}\nSUMMARY:💗 Mens om 3 dagar\nDESCRIPTION:Din mens beräknas komma om 3 dagar\nEND:VEVENT`);
  }
  
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Trygga Kvinnor//Menscykel//SV\nCALSCALE:GREGORIAN\n${events.join('\n')}\nEND:VCALENDAR`;
  
  const blob = new Blob([ics], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'menscykel_tryggakvinnor.ics';
  a.click();
};
  // Calculate stats
  const avgEnergy = moods.length > 0 ? (moods.reduce((s,m)=>s+parseInt(m.energy),0)/moods.length).toFixed(1) : 0;
  const avgSleep = moods.length > 0 ? (moods.reduce((s,m)=>s+parseInt(m.sleep),0)/moods.length).toFixed(1) : 0;
  const avgAnxiety = moods.length > 0 ? (moods.reduce((s,m)=>s+parseInt(m.anxiety),0)/moods.length).toFixed(1) : 0;
  const avgStress = moods.length > 0 ? (moods.reduce((s,m)=>s+parseInt(m.stress),0)/moods.length).toFixed(1) : 0;
  const totalActivity = moods.reduce((s,m)=>s+parseInt(m.activity||0),0);
  
  if (!isPremium) {
    return (
      <div className="page-content">
        <div className="page-hero mood-hero"><h1>Mående-dagbok</h1><p>Följ din resa och se dina mönster över tid</p></div>
        <div style={{position:'relative'}}>
          <div className="paywall-overlay" style={{minHeight:'400px'}}>
            <CycleTracker currentUser={currentUser} moods={moods}/>
            <div className="mood-form-card" style={{filter:'blur(3px)',pointerEvents:'none',userSelect:'none'}}>
              <h3>Hur mår du idag?</h3>
              <div style={{height:'300px',background:'linear-gradient(rgba(251,248,245,0.3),rgba(251,248,245,0.9))'}}></div>
            </div>
          </div>
          <div className="paywall-lock">
            <div className="lock-icon">🔒</div>
            <h3>Mående-dagboken är Premium</h3>
            <p>Följ ditt mående över tid, se mönster och förstå vad som påverkar din hälsa.</p>
            <div className="locked-badge">🔒 Kräver Premium</div>
            <button className="btn-primary" onClick={()=>nav('profil')}>Uppgradera till Premium - 39 kr/mån</button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="page-content">
      <div className="page-hero mood-hero"><h1>Mående-dagbok</h1><p>Följ din resa och se dina mönster över tid</p></div>
      {/* CYKELTRACKER */}
<div style={{background:'white',borderRadius:'24px',padding:'2rem',margin:'2rem 5%',boxShadow:'var(--shadow-sm)',border:'1px solid var(--border)'}}>
  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.2rem'}}>
    <h3 style={{fontFamily:'Playfair Display,serif',fontSize:'1.4rem'}}>🌹 Min menscykel</h3>
    <button onClick={()=>setShowCycleSetup(!showCycleSetup)} style={{background:'none',border:'2px solid var(--border)',borderRadius:'50px',padding:'0.4rem 1rem',cursor:'pointer',fontFamily:'inherit',fontSize:'0.85rem',color:'var(--text-medium)'}}>
      {showCycleSetup ? 'Dölj inställningar' : '⚙️ Inställningar'}
    </button>
  </div>

  {showCycleSetup && (
    <div style={{background:'var(--cream)',borderRadius:'16px',padding:'1.5rem',marginBottom:'1.5rem'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'1rem'}}>
        <div>
          <label style={{fontWeight:600,fontSize:'0.88rem',display:'block',marginBottom:'0.4rem'}}>Första dagen senaste mens</label>
          <input type="date" value={cycleStartDate} onChange={e=>setCycleStartDate(e.target.value)} className="mood-select" style={{width:'100%'}}/>
        </div>
        <div>
          <label style={{fontWeight:600,fontSize:'0.88rem',display:'block',marginBottom:'0.4rem'}}>Cykellängd (dagar)</label>
          <input type="number" min="21" max="35" value={cycleLength} onChange={e=>setCycleLength(parseInt(e.target.value))} className="mood-select" style={{width:'100%'}}/>
        </div>
        <div>
          <label style={{fontWeight:600,fontSize:'0.88rem',display:'block',marginBottom:'0.4rem'}}>Menslängd (dagar)</label>
          <input type="number" min="2" max="8" value={periodLength} onChange={e=>setPeriodLength(parseInt(e.target.value))} className="mood-select" style={{width:'100%'}}/>
        </div>
      </div>
    </div>
  )}

  {getCycleInfo() ? (() => {
    const info = getCycleInfo();
    return (
      <div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'1rem',marginBottom:'1.5rem'}}>
          <div style={{background:'linear-gradient(135deg,rgba(212,117,111,0.08),rgba(232,180,168,0.08))',borderRadius:'16px',padding:'1.2rem',textAlign:'center'}}>
            <div style={{fontSize:'1.8rem',marginBottom:'0.3rem'}}>{info.phaseEmoji}</div>
            <div style={{fontWeight:700,color:info.phaseColor,fontSize:'1rem'}}>{info.phase}</div>
            <div style={{fontSize:'0.78rem',color:'var(--text-light)'}}>Dag {info.dayInCycle} av {cycleLength}</div>
          </div>
          <div style={{background:'linear-gradient(135deg,rgba(212,117,111,0.08),rgba(232,180,168,0.08))',borderRadius:'16px',padding:'1.2rem',textAlign:'center'}}>
            <div style={{fontSize:'1.8rem',fontWeight:700,color:'var(--primary)'}}>{info.daysUntilPeriod}</div>
            <div style={{fontSize:'0.82rem',color:'var(--text-light)'}}>dagar till nästa mens</div>
          </div>
          <div style={{background:'linear-gradient(135deg,rgba(123,175,142,0.08),rgba(160,200,176,0.08))',borderRadius:'16px',padding:'1.2rem',textAlign:'center'}}>
            <div style={{fontSize:'1.8rem',fontWeight:700,color:'var(--accent)'}}>{cycleLength - 14 - info.dayInCycle > 0 ? cycleLength - 14 - info.dayInCycle : '—'}</div>
            <div style={{fontSize:'0.82rem',color:'var(--text-light)'}}>dagar till ägglossning</div>
          </div>
        </div>

        <div style={{background:'rgba(212,117,111,0.06)',borderRadius:'12px',padding:'1rem',marginBottom:'1.2rem',fontSize:'0.88rem',color:'var(--text-medium)'}}>
          {info.phase === 'Mensfas' && '🌹 Du är i mensfasen. Ta hand om dig, vila är viktigt nu.'}
          {info.phase === 'Follikelfas' && '🌱 Follikelfasen — energin ökar, perfekt tid för nya projekt och socialt umgänge!'}
          {info.phase === 'Ägglossning' && '✨ Ägglossningsfasen — du är troligtvis på topp energimässigt nu!'}
          {info.phase === 'Lutealfas' && '🌙 Lutealfasen — du kan märka av PMS-symptom. Var snäll mot dig själv.'}
        </div>

        <button onClick={generateICS} className="btn-primary" style={{width:'100%'}}>
          📅 Lägg till i kalender (Google, Apple, Outlook)
        </button>
        <p style={{fontSize:'0.75rem',color:'var(--text-light)',textAlign:'center',marginTop:'0.5rem'}}>
          Laddar ner en .ics-fil med mens och ägglossning för 6 månader framåt
        </p>
        <button onClick={() => {
  const ev = [];
  const t = new Date();
  for (let i = 0; i < 90; i++) {
    const d = new Date(t);
    d.setDate(t.getDate() + i);
    const f = x => x.toISOString().replace(/-|:|\.\d{3}/g,'').slice(0,8);
    ev.push('BEGIN:VEVENT\nUID:pill-' + i + '@tk\nDTSTART;VALUE=DATE:' + f(d) + '\nDTEND;VALUE=DATE:' + f(d) + '\nSUMMARY:Ta p-pillret\nBEGIN:VALARM\nTRIGGER:T080000\nACTION:DISPLAY\nDESCRIPTION:Dags!\nEND:VALARM\nEND:VEVENT');
  }
  const ics = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//TK//SV\n' + ev.join('\n') + '\nEND:VCALENDAR';
  const blob = new Blob([ics], {type:'text/calendar'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'p-piller.ics';
  a.click();
}} style={{width:'100%',marginTop:'0.8rem',background:'none',border:'2px solid var(--border)',borderRadius:'50px',padding:'0.8rem',cursor:'pointer',fontFamily:'inherit',fontSize:'0.9rem',color:'var(--text-medium)'}}>
  P-piller påminnelse (90 dagar)
</button>
      </div>
    );
  })() : (
    <div style={{textAlign:'center',padding:'1.5rem',color:'var(--text-light)'}}>
      <div style={{fontSize:'2rem',marginBottom:'0.5rem'}}>🌹</div>
      <p style={{marginBottom:'1rem'}}>Fyll i din cykelinformation för att se din fas och få påminnelser</p>
      <button onClick={()=>setShowCycleSetup(true)} className="btn-secondary">
        Kom igång
      </button>
    </div>
  )}
</div>
      <div className="mood-form-card fade-in-up">
        <h3>Hur mår du idag?</h3>
        <form onSubmit={add} className="mood-form">
          <div className="form-group">
            <label>Känsla</label>
            <select value={mood} onChange={e=>setMood(e.target.value)} className="mood-select">
              <option value="">Välj hur du känner dig...</option>
              {['Glad','Neutral','Orolig','Ledsen','Energisk','Trött','Stressad','Lugn','Rädd','Tacksam','Arg','Ensam','Hopfull','Överväldigad'].map(m=><option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          
          <div className="form-group">
            <label>Energinivå: {energy}/10</label>
            <input type="range" min="1" max="10" value={energy} onChange={e=>setEnergy(e.target.value)} className="energy-slider"/>
            <div className="slider-labels"><span>Låg</span><span>Hög</span></div>
            <div className="slider-value-display">{energy}/10</div>
          </div>
          
          <div className="form-group">
            <label>Sömn (timmar): {sleep}h</label>
            <input type="range" min="0" max="12" step="0.5" value={sleep} onChange={e=>setSleep(e.target.value)} className="energy-slider"/>
            <div className="slider-labels"><span>0h</span><span>12h</span></div>
            <div className="slider-value-display">{sleep} timmar</div>
          </div>
          
          <div className="form-group">
            <label>Sömnkvalitet</label>
            <select value={sleepQuality} onChange={e=>setSleepQuality(e.target.value)} className="mood-select">
              <option value="Mycket bra">Mycket bra</option>
              <option value="Bra">Bra</option>
              <option value="Okej">Okej</option>
              <option value="Dålig">Dålig</option>
              <option value="Mycket dålig">Mycket dålig</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Fysisk aktivitet (minuter): {activity} min</label>
            <input type="range" min="0" max="120" step="5" value={activity} onChange={e=>setActivity(e.target.value)} className="energy-slider"/>
            <div className="slider-labels"><span>0 min</span><span>120 min</span></div>
            <div className="slider-value-display">{activity} minuter</div>
          </div>
          
          {activity > 0 && (
            <div className="form-group">
              <label>Typ av aktivitet</label>
              <select value={activityType} onChange={e=>setActivityType(e.target.value)} className="mood-select">
                <option value="">Välj typ...</option>
                <option value="Promenad">Promenad</option>
                <option value="Löpning">Löpning</option>
                <option value="Gym">Gym</option>
                <option value="Yoga">Yoga</option>
                <option value="Dans">Dans</option>
                <option value="Cykling">Cykling</option>
                <option value="Simning">Simning</option>
                <option value="Annat">Annat</option>
              </select>
            </div>
          )}
          
          <div className="form-group">
            <label>Ångest-nivå: {anxiety}/10</label>
            <input type="range" min="0" max="10" value={anxiety} onChange={e=>setAnxiety(e.target.value)} className="energy-slider"/>
            <div className="slider-labels"><span>Ingen</span><span>Extrem</span></div>
            <div className="slider-value-display">{anxiety}/10</div>
          </div>
          
          <div className="form-group">
            <label>Stress-nivå: {stress}/10</label>
            <input type="range" min="0" max="10" value={stress} onChange={e=>setStress(e.target.value)} className="energy-slider"/>
            <div className="slider-labels"><span>Ingen</span><span>Extrem</span></div>
            <div className="slider-value-display">{stress}/10</div>
          </div>
          
          <div className="form-group">
            <label>Menscykel (dag i cykel, 0 om ej relevant)</label>
            <input type="number" min="0" max="35" value={menstrualDay} onChange={e=>setMenstrualDay(e.target.value)} className="mood-select" placeholder="0"/>
          </div>
          
          <div className="form-group">
            <label>3 saker jag är tacksamför idag</label>
            <textarea value={gratitude} onChange={e=>setGratitude(e.target.value)} placeholder="1. Solen sken 2. God mat 3. ..." className="mood-textarea" rows="3"/>
          </div>
          
          <div className="form-group">
            <label>Triggers eller viktiga händelser idag (valfritt)</label>
            <textarea value={triggers} onChange={e=>setTriggers(e.target.value)} placeholder="Deadline på jobbet, konflikt med kollega, etc..." className="mood-textarea" rows="2"/>
          </div>
          
          <button type="submit" className="btn-primary full-width">Spara dagens mående</button>
        </form>
      </div>
      
      {moods.length >= 3 && (
        <div className="mood-chart-section fade-in-up delay-2">
          <h3>Din utveckling</h3>
          <div className="mood-stats">
            <div className="stat-card">
              <div className="stat-number">{avgEnergy}</div>
              <div className="stat-label">Genomsnittlig energi</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{avgSleep}h</div>
              <div className="stat-label">Genomsnittlig sömn</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{avgAnxiety}</div>
              <div className="stat-label">Genomsnittlig ångest</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{avgStress}</div>
              <div className="stat-label">Genomsnittlig stress</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{totalActivity}</div>
              <div className="stat-label">Total träning (min)</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{moods.length}</div>
              <div className="stat-label">Dagar loggade</div>
            </div>
          </div>
          <div className="chart-container">
            <svg className="chart-canvas" viewBox="0 0 800 300">
              {/* Simple line graph showing energy over time */}
              <line x1="50" y1="250" x2="750" y2="250" stroke="#E8B4A8" strokeWidth="2"/>
              <line x1="50" y1="50" x2="50" y2="250" stroke="#E8B4A8" strokeWidth="2"/>
              {moods.slice(0,10).reverse().map((m,i)=>{
                const x = 100 + i * 70;
                const y = 250 - (m.energy * 20);
                return <circle key={i} cx={x} cy={y} r="6" fill="#D4756F"/>;
              })}
              {moods.slice(0,10).reverse().map((m,i)=>{
                if(i===0) return null;
                const x1 = 100 + (i-1) * 70;
                const y1 = 250 - (moods.slice(0,10).reverse()[i-1].energy * 20);
                const x2 = 100 + i * 70;
                const y2 = 250 - (m.energy * 20);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D4756F" strokeWidth="3"/>;
              })}
              <text x="10" y="260" fill="#8B7B7B" fontSize="14">0</text>
              <text x="10" y="60" fill="#8B7B7B" fontSize="14">10</text>
              <text x="350" y="285" fill="#8B7B7B" fontSize="16" fontWeight="600">Energi över tid</text>
            </svg>
          </div>
        </div>
      )}
      
      <div className="mood-history fade-in-up delay-3">
        <h3>Din historik</h3>
        {moods.map((e,i)=>(
          <div key={i} className="mood-entry">
            <div className="mood-date">{e.date}</div>
            <div className="mood-info">
              <div className="mood-top">
                <strong>{e.mood}</strong>
                <span className="energy-badge">Energi: {e.energy}/10</span>
                <span className="energy-badge">Sömn: {e.sleep}h ({e.sleepQuality})</span>
              </div>
              {e.activity > 0 && <p><strong>Träning:</strong> {e.activity} min {e.activityType}</p>}
              <p><strong>Ångest:</strong> {e.anxiety}/10 | <strong>Stress:</strong> {e.stress}/10</p>
              {e.menstrualDay > 0 && <p><strong>Menscykel:</strong> Dag {e.menstrualDay}</p>}
              {e.gratitude && <p><strong>Tacksamhet:</strong> {e.gratitude}</p>}
              {e.triggers && <p><strong>Triggers:</strong> {e.triggers}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const WorkshopsPage = () => (
  <div className="page-content">
    <div className="page-hero workshops-hero"><h1>Workshops och Kurser</h1><p>Vi arbetar på fantastiska live-workshops för dig</p></div>
    <div className="workshops-coming">
      <h2>Kommande workshops</h2>
      <div className="workshop-preview-card"><div className="workshop-preview-image" style={{backgroundImage:'url(https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800)'}}></div><div className="workshop-preview-content"><span className="workshop-tag">Snart</span><h3>Hantera ångest med andning</h3><p>En 90 minuters live-workshop med legitimerad psykoterapeut som lär dig praktiska verktyg.</p><button className="btn-primary">Anmäl intresse</button></div></div>
      <div className="workshop-preview-card"><div className="workshop-preview-image" style={{backgroundImage:'url(https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800)'}}></div><div className="workshop-preview-content"><span className="workshop-tag">Snart</span><h3>Självkärleksworkshop</h3><p>Lär dig att vara snäll mot dig själv i en grupp av likasinnade kvinnor.</p><button className="btn-primary">Anmäl intresse</button></div></div>
    </div>
  </div>
);

const ChatPage = ({ nav, isPremium, currentUser }) => {
  const [messages, setMessages] = useState([{ role:'assistant', content:'Hej! Jag är en AI-rådgivare och finns här för att lyssna och ge stöd. Viktigt: jag är inte en terapeut och kan inte ersätta professionell vård. Hur mår du idag?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const bottomRef = useRef(null);
  
  const isLocked = !isPremium && userMessageCount >= 3;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages, loading]);
  
  const send = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading || isLocked) return;
    const msg = input;
    setMessages(p => [...p, { role:'user', content: msg }]);
    setInput('');
    setLoading(true);
    setUserMessageCount(c => c + 1);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({
          model:'claude-sonnet-4-20250514',
          max_tokens:1000,
          system:'Du är en AI-rådgivare på svenska plattformen Trygga Kvinnor. Din roll är att ge allmänt stöd, lyssna och hjälpa med vardaglig stress och välmående. VIKTIGT: Du är INTE en terapeut. Du ger INTE behandling eller diagnos. Du är ett komplement till, inte ersättning för, professionell vård.\n\nREGLER:\n1. Berätta alltid tydligt att du är en AI och inte en riktig terapeut.\n2. Vid MINSTA misstänkning om kris, självmordstankar, skador eller akut utsatthet — STOPPA samtalet och hänvisa DIREKT till: Mind Självmordslinjen 90101 (dygnet runt) och 112 vid akut fara.\n3. Uppmana alltid personen att kontakta en professionell — psykoterapeut, läkare eller 1177 — om deras situation verkar allvarlig.\n4. Ge ALDRI medicinskt råd eller diagnoser.\n5. Tala svenska.',
          messages: messages.concat({ role:'user', content: msg }).map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      setMessages(p => [...p, { role:'assistant', content: data.content[0].text }]);
    } catch(err) {
      setMessages(p => [...p, { role:'assistant', content:'Tack för att du delar med dig. Om du behöver professionellt stöd kan du ringa 1177 eller kontakta din vårdcentral.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="page-content chat-page">
      <div className="chat-container">
        <div className="chat-header"><h2>AI-Rådgivning</h2><span className="online-badge">Alltid tillgänglig</span></div>
        <div className="chat-disclaimer-banner">⚠️ Ersätter <strong>inte</strong> professionell vård. Vid kris: <span className="crisis-link" onClick={()=>alert('Mind Självmordslinjen: 90101\nAkut fara: 112\n1177 Vårdguiden: 1177')}>90101 / 112</span></div>
        <div className="messages-container">
        {messages.map((m,i)=><div key={i} className={'message ' + m.role}><div className="message-content">{m.content}</div></div>)}
          {loading && <div className="typing-indicator">Skriver...</div>}
          <div ref={bottomRef}/>
        </div>

        {isLocked ? (
          <div style={{padding:'1.5rem',background:'#FBF8F5',borderTop:'1px solid rgba(212,117,111,0.12)',textAlign:'center'}}>
            <div style={{fontSize:'1.8rem',marginBottom:'0.5rem'}}>🌸</div>
            <h3 style={{fontFamily:'Playfair Display,serif',fontSize:'1.2rem',marginBottom:'0.5rem',color:'#2D2424'}}>
              Du har använt dina 3 gratis meddelanden
            </h3>
            <p style={{color:'#8B7B7B',fontSize:'0.9rem',marginBottom:'1rem'}}>
              Uppgradera till Bas för obegränsat AI-stöd — bara 39 kr/mån.
            </p>
            <button className="btn-primary" onClick={()=>nav('profil')}>
              Kom igång för 39 kr/mån
            </button>
            {!currentUser && (
              <p style={{marginTop:'0.8rem',fontSize:'0.85rem',color:'#8B7B7B'}}>
                Redan medlem? <button onClick={()=>nav('login')} style={{background:'none',border:'none',color:'#D4756F',fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>Logga in</button>
              </p>
            )}
          </div>
        ) : (
          <>
            {!isPremium && (
              <div style={{padding:'0.5rem 1.5rem',background:'rgba(123,175,142,0.08)',borderTop:'1px solid rgba(123,175,142,0.15)',textAlign:'center',fontSize:'0.8rem',color:'#7BAF8E',fontWeight:600}}>
                {3 - userMessageCount} gratis meddelanden kvar idag
              </div>
            )}
            <form onSubmit={send} className="chat-input-form">
              <input type="text" value={input} onChange={e=>setInput(e.target.value)} placeholder="Skriv här..." className="chat-input" disabled={loading}/>
              <button type="submit" className="send-button" disabled={loading}>Skicka</button>
            </form>
          </>
        )}
        <div className="chat-crisis-notice"><strong>Vid akut kris:</strong> Ring 90101 (Mind) eller 112.</div>
      </div>
    </div>
  );
};

const therapists = [
  {
    id: 1,
    name: "Anna Bergström",
    title: "Leg. Psykoterapeut, KBT",
    photo: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=200",
    specialties: ["Ångest", "Depression", "Stress"],
    bio: "Jag har arbetat med mental hälsa i 8 år och är specialiserad på KBT. Jag tror på att ge dig verktyg att hantera dina utmaningar själv, och jag är här för att guida dig på vägen.",
    experience: "8 år",
    education: "Legitimerad Psykoterapeut",
    languages: ["Svenska", "Engelska"],
    price: 369
  },
  {
    id: 2,
    name: "Sofia Lindqvist",
    title: "Leg. Psykolog, Traumaspecialist",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200",
    specialties: ["Trauma", "Våld", "PTSD"],
    bio: "Med bakgrund i traumaterapi arbetar jag med kvinnor som upplevt våld eller trauman. Jag skapar en trygg miljö där du kan bearbeta i din egen takt.",
    experience: "10 år",
    education: "Leg. Psykolog, Traumacertifierad",
    languages: ["Svenska"],
    price: 369
  },
  {
    id: 3,
    name: "Emma Johansson",
    title: "Leg. Psykoterapeut, ACT & Mindfulness",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
    specialties: ["Relationer", "Självkänsla", "Mindfulness"],
    bio: "Jag arbetar med ACT (Acceptance and Commitment Therapy) och mindfulness. Min approach är mjuk men effektiv - vi arbetar med acceptans och värderingar.",
    experience: "6 år",
    education: "Leg. Psykoterapeut, ACT-certifierad",
    languages: ["Svenska", "Engelska"],
    price: 369
  },
  {
    id: 4,
    name: "Maria Andersson",
    title: "Leg. Psykolog, Beroendespecialist",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200",
    specialties: ["Beroende", "Självskada", "Ätstörningar"],
    bio: "Jag har lång erfarenhet av att arbeta med beroende, självskada och ätstörningar. Jag möter dig där du är, utan dömande, och vi hittar vägen framåt tillsammans.",
    experience: "12 år",
    education: "Leg. Psykolog, Beroendespecialist",
    languages: ["Svenska", "Engelska", "Arabiska"],
    price: 369
  }
];

const ExpertPage = ({ nav, isPremium, currentUser }) => {
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  if (isPremium) {
  return <UserTherapyChat nav={nav} currentUser={currentUser} isPremium={isPremium}/>;
}
  
  return (
    <div className="page-content">
      <div className="page-hero expert-hero">
        <h1>Professionell terapi</h1>
        <p>Chatta med legitimerade terapeuter på dina villkor</p>
      </div>
      
      <div className="expert-info">
        <div className="expert-card featured">
          <div className="expert-badge">Premium</div>
          <h3>Terapeut-chatt</h3>
          <p>Chatta med legitimerad psykoterapeut eller KBT-terapeut. Svar inom 24 timmar.</p>
          <ul>
            <li>💬 Chatta när du vill - ingen bokning</li>
            <li>⏰ Svar vardagar 09-17</li>
            <li>🗑️ Chattar raderas efter 48h</li>
            <li>🔒 100% konfidentiellt, krypterat</li>
            <li>🔄 Byt terapeut när du vill</li>
          </ul>
          <div className="price">369 kr<span>/månad</span></div>
          <button 
            className="btn-primary full-width" 
           onClick={()=>nav('terapi-chatt')}
            disabled={!selectedTherapist}
            style={{opacity: selectedTherapist ? 1 : 0.6}}
          >
            {selectedTherapist ? 'Starta terapi med ' + selectedTherapist.name.split(' ')[0] : 'Starta terapi-chatt'}
          </button>
          <p style={{fontSize:'0.85rem',color:'var(--text-light)',marginTop:'1rem',textAlign:'center'}}>💡 Chattar sparas i 48 timmar efter svar av säkerhetsskäl</p>
        </div>
        
        <div className="expert-card">
          <h3>AI-Rådgivning</h3>
          <p>Allmänt stöd och rådgivning dygnet runt. Ersätter inte professionell vård.</p>
          <ul>
            <li>💬 Svar direkt</li>
            <li>🌙 Tillgänglig dygnet runt</li>
            <li>🧘 Verktyg och övningar</li>
            <li>🎭 Helt anonymt</li>
            <li>ℹ️ Allmänt stöd - inte behandling</li>
          </ul>
          <div className="price">39 kr<span>/månad</span></div>
          <button className="btn-secondary full-width" onClick={()=>nav('chat')}>Chatta nu</button>
        </div>
      </div>
      {false && (
      <div style={{maxWidth:'1200px',margin:'3rem auto 0',padding:'0 5%'}}>
        <h2 style={{fontSize:'2rem',textAlign:'center',marginBottom:'0.5rem'}}>Välj din terapeut</h2>
        <p style={{textAlign:'center',color:'var(--text-medium)',marginBottom:'2rem'}}>
          {selectedTherapist ? '✓ Du har valt ' + selectedTherapist.name : 'Välj den terapeut som passar dig bäst'}
        </p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))',gap:'1.5rem'}}>
          {therapists.map(t => (
            <div key={t.id} style={{
              background:'var(--white)',
              borderRadius:'20px',
              padding:'1.5rem',
              border: selectedTherapist?.id === t.id ? '3px solid var(--accent)' : '1px solid var(--border)',
              boxShadow: selectedTherapist?.id === t.id ? 'var(--shadow-md)' : 'var(--shadow-sm)',
              transition:'all 0.3s',
              position:'relative'
            }} className="fade-in-up">
              {selectedTherapist?.id === t.id && (
                <div style={{
                  position:'absolute',
                  top:'-12px',
                  right:'20px',
                  background:'var(--accent)',
                  color:'var(--white)',
                  padding:'0.4rem 1rem',
                  borderRadius:'50px',
                  fontSize:'0.85rem',
                  fontWeight:'600',
                  boxShadow:'0 2px 8px rgba(123,175,142,0.4)'
                }}>
                  ✓ Vald
                </div>
              )}
            
              <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1rem'}}>
                <div style={{
                  width:'60px',
                  height:'60px',
                  borderRadius:'50%',
                background: 'url(' + t.photo + ')',
                  backgroundSize:'cover',
                  backgroundPosition:'center',
                  flexShrink:0,
                  border:'3px solid var(--accent-light)'
                }}></div>
                <div>
                  <h4 style={{fontSize:'1.1rem',marginBottom:'0.2rem'}}>{t.name}</h4>
                  <p style={{fontSize:'0.85rem',color:'var(--text-medium)'}}>{t.title}</p>
                </div>
              </div>
              
              <div style={{marginBottom:'1rem'}}>
                <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',marginBottom:'0.8rem'}}>
                  {t.specialties.map((s,i) => (
                    <span key={i} style={{
                      background:'rgba(123,175,142,0.12)',
                      color:'var(--accent)',
                      padding:'0.25rem 0.7rem',
                      borderRadius:'12px',
                      fontSize:'0.8rem',
                      fontWeight:'600'
                    }}>{s}</span>
                  ))}
                </div>
                <p style={{fontSize:'0.88rem',color:'var(--text-medium)',lineHeight:'1.5'}}>{t.bio}</p>
              </div>
              
              <div style={{borderTop:'1px solid var(--border)',paddingTop:'1rem',fontSize:'0.85rem',color:'var(--text-medium)',marginBottom:'1rem'}}>
                <div style={{marginBottom:'0.4rem'}}>🎓 {t.education}</div>
                <div style={{marginBottom:'0.4rem'}}>⏱️ {t.experience} erfarenhet</div>
                <div>🌍 {t.languages.join(', ')}</div>
              </div>
              
              <button 
                className={selectedTherapist?.id === t.id ? 'btn-secondary full-width' : 'btn-primary full-width'}
                onClick={() => setSelectedTherapist(selectedTherapist?.id === t.id ? null : t)}
                style={{fontSize:'0.9rem'}}
              >
             {selectedTherapist?.id === t.id ? 'Avmarkera' : 'Välj ' + t.name.split(' ')[0]}
              </button>
            </div>
          ))}
        </div>
      </div>
      )}
    </div>
  );
};

const ResourcesPage = () => (
  <div className="page-content">
    <div className="page-hero resources-hero"><h1>Resurser och Hjälp</h1><p>Det är okej att inte må bra. Det är okej att be om hjälp.</p></div>
    <div className="resources-notice"><p>Om du är i akut kris eller tänker på att skada dig – ring 112 eller 90101 direkt.</p></div>
    <div className="resources-grid">
      {resources.map((r,i)=>(
        <div key={i} className="resource-card">
          <div className="resource-header"><span className="resource-type">{r.type}</span><h3>{r.name}</h3></div>
          <p className="resource-description">{r.description}</p>
          <div className="resource-details">
            {r.phone && <a href={'tel:' + r.phone.replace(/[^0-9]/g,'')} className="resource-phone">{r.phone}</a>}
            {r.website && <a href={r.website} target="_blank" rel="noopener noreferrer" className="resource-link">Besök webbplats &#8594;</a>}
            {r.hours && <span className="resource-hours">{r.hours}</span>}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PrivacyPage = () => (
  <div className="page-content">
    <div className="page-hero privacy-hero"><h1>Sekretess och Integritet</h1><p>Din integritet och trygghet är vår högsta prioritet</p></div>
    <div className="privacy-content">
      
      <div className="privacy-section">
        <h2>1. Personuppgiftsansvarig</h2>
        <p><strong>Trygga Kvinnor</strong><br/>
        Organisationsnummer: [kommer]<br/>
        E-post: integritet@tryggakvinnor.se<br/>
        Adress: [kommer vid lansering]</p>
        <p>Vi är personuppgiftsansvariga för behandlingen av dina personuppgifter. Vid frågor kontakta vår Dataskyddsombud på adressen ovan.</p>
      </div>
      
      <div className="privacy-section">
        <h2>2. Vilka uppgifter samlar vi in?</h2>
        <p>Vi samlar endast in uppgifter som är nödvändiga för att tillhandahålla tjänsten:</p>
        <ul>
          <li><strong>Konto-information:</strong> E-postadress (om du väljer att skapa konto), användarnamn</li>
          <li><strong>Mående-dagbok:</strong> Känsla, energinivå, sömn, aktivitet, ångest, stress, menscykel, tacksamhet, triggers</li>
          <li><strong>Chat-konversationer:</strong> AI-chat och terapeut-chat sparas krypterat</li>
          <li><strong>Teknisk data:</strong> IP-adress (loggas temporärt), enhetstyp, webbläsare, tidzon</li>
          <li><strong>Cookies:</strong> Se avsnitt om cookies nedan</li>
        </ul>
        <p><strong>OBS:</strong> Du kan använda tjänsten helt anonymt utan att ange e-post eller personnummer.</p>
      </div>
      
      <div className="privacy-section">
        <h2>3. Varför samlar vi in uppgifter?</h2>
        <p>Vi behandlar dina personuppgifter för följande ändamål:</p>
        <ul>
          <li><strong>Tillhandahålla tjänsten:</strong> För att du ska kunna använda mood tracker, chat, artiklar etc.</li>
          <li><strong>Förbättra tjänsten:</strong> Analysera användningsmönster (anonymiserat) för att förbättra funktioner</li>
          <li><strong>Säkerhet:</strong> Förhindra missbruk och säkerställa plattformens säkerhet</li>
          <li><strong>Lagstadgade krav:</strong> Bokföring, skattelagstiftning</li>
        </ul>
        <p><strong>Rättslig grund:</strong> Samtycke (för frivillig data), avtalsuppfyllelse (för tjänsten), berättigat intresse (säkerhet)</p>
      </div>
      
      <div className="privacy-section">
        <h2>4. Hur länge sparas uppgifter?</h2>
        <ul>
          <li><strong>Mående-dagbok:</strong> Tills du raderar dem eller avslutar kontot</li>
          <li><strong>Chat-konversationer:</strong> 12 månader efter sista aktivitet (lagkrav för hälsodata)</li>
          <li><strong>Konto-information:</strong> Tills du begär radering</li>
          <li><strong>Teknisk data:</strong> IP-adresser raderas efter 90 dagar</li>
          <li><strong>Bokföringsdata:</strong> 7 år (enligt bokföringslagen)</li>
        </ul>
      </div>
      
      <div className="privacy-section">
        <h2>5. Cookies</h2>
        <p>Vi använder cookies för att förbättra din upplevelse:</p>
        <ul>
          <li><strong>Nödvändiga cookies:</strong> För inloggning och grundfunktionalitet (kan ej stängas av)</li>
          <li><strong>Funktionella cookies:</strong> Sparar dina preferenser (språk, tema)</li>
          <li><strong>Analytiska cookies:</strong> Google Analytics (anonymiserat) för att förstå användning</li>
        </ul>
        <p>Du kan hantera cookies i din webbläsares inställningar. Observera att vissa funktioner kan påverkas om du blockerar cookies.</p>
        <p><strong>Vi använder INTE:</strong> Marknadsföringscookies eller tredjepartsspårning för annonser.</p>
      </div>
      
      <div className="privacy-section">
        <h2>6. Tredjepartstjänster</h2>
        <p>Vi använder följande tredjepartstjänster som kan behandla viss data:</p>
        <ul>
          <li><strong>Netlify:</strong> Hosting av webbplatsen (USA, GDPR-compliant)</li>
          <li><strong>Anthropic:</strong> AI-chat-funktionalitet (USA, GDPR-compliant)</li>
          <li><strong>Spotify:</strong> Embeds för musik (ingen persondata delas)</li>
          <li><strong>Google Analytics:</strong> Anonymiserad användningsstatistik</li>
        </ul>
        <p>Alla leverantörer har personuppgiftsbiträdesavtal och följer GDPR.</p>
      </div>
      
      <div className="privacy-section">
        <h2>7. Dina rättigheter enligt GDPR</h2>
        <p>Du har följande rättigheter:</p>
        <ul>
          <li><strong>Rätt till tillgång:</strong> Begär kopia av all data vi har om dig</li>
          <li><strong>Rätt till rättelse:</strong> Korrigera felaktig information</li>
          <li><strong>Rätt till radering:</strong> "Rätten att bli glömd" - radera ditt konto och all data</li>
          <li><strong>Rätt till dataportabilitet:</strong> Få dina uppgifter i maskinläsbart format (JSON/CSV)</li>
          <li><strong>Rätt att återkalla samtycke:</strong> När som helst</li>
          <li><strong>Rätt att göra invändningar:</strong> Mot behandling baserad på berättigat intresse</li>
        </ul>
        <p>För att utöva dina rättigheter, kontakta: <strong className="privacy-email">integritet@tryggakvinnor.se</strong></p>
        <p>Vi svarar inom <strong>30 dagar</strong> enligt lag.</p>
      </div>
      
      <div className="privacy-section">
        <h2>8. Säkerhet</h2>
        <p>Vi tar säkerhet på största allvar:</p>
        <ul>
          <li><strong>Kryptering:</strong> All data krypteras både i transit (TLS 1.3) och i vila (AES-256)</li>
          <li><strong>Åtkomstkontroll:</strong> Endast auktoriserad personal har tillgång till känslig data</li>
          <li><strong>Regelbundna säkerhetsgransknin gar:</strong> Penetrationstester och säkerhetsuppdateringar</li>
          <li><strong>Anonymisering:</strong> Persondata anonymiseras när möjligt för analys</li>
        </ul>
      </div>
      
      <div className="privacy-section">
        <h2>9. Barn och ungdomar</h2>
        <p>Tjänsten är öppen för användare från 15 år med målsmans samtycke. För användare under 18 år rekommenderar vi starkt att en förälder eller vårdnadshavare är medveten om användningen.</p>
        <p>Vi samlar inte medvetet in känslig information från barn under 15 år.</p>
      </div>
      
      <div className="privacy-section">
        <h2>10. Ändringar i integritetspolicyn</h2>
        <p>Vi kan uppdatera denna policy vid behov. Vid väsentliga ändringar meddelar vi dig via:</p>
        <ul>
          <li>E-post (om du angett e-post)</li>
          <li>Popup-notis på plattformen</li>
        </ul>
        <p><strong>Senast uppdaterad:</strong> 2026-02-04</p>
      </div>
      
      <div className="privacy-section">
        <h2>11. Klagomål till tillsynsmyndighet</h2>
        <p>Om du anser att vi behandlar dina personuppgifter felaktigt har du rätt att klaga till:</p>
        <p><strong>Integritetsskyddsmyndigheten (IMY)</strong><br/>
        Box 8114, 104 20 Stockholm<br/>
        Tel: 08-657 61 00<br/>
        E-post: imy@imy.se<br/>
        Webbplats: www.imy.se</p>
      </div>
      
      <div className="privacy-promise">
        <h3>Vårt löfte till dig</h3>
        <p>Din trygghet och integritet är kärnan i vad vi gör. Vi kommer aldrig:</p>
        <ul>
          <li>❌ Sälja dina uppgifter</li>
          <li>❌ Dela med tredje part för marknadsföring</li>
          <li>❌ Använda dina känsliga hälsouppgifter för annat än tjänsten</li>
          <li>❌ Spåra dig över andra webbplatser</li>
        </ul>
        <p style={{marginTop:'1rem'}}>✓ Vi är transparenta, ärliga och respektfulla mot din integritet.</p>
      </div>
      
      <div className="privacy-section">
        <h2>Kontakt</h2>
        <p>Frågor om integritet och personuppgifter?</p>
        <p className="privacy-email">integritet@tryggakvinnor.se</p>
        <p>Vi svarar inom 48 timmar.</p>
      </div>
      
    </div>
  </div>
);

const AboutPage = () => (
  <div className="page-content">
    <div className="page-hero about-hero"><h1>Om Trygga Kvinnor</h1><p>Skapad med kärlek och purpose</p></div>
    <div className="about-content">
      <div className="about-hero-section">
        <div className="about-image" style={{backgroundImage:'url(https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=800)'}}></div>
        <div className="about-text"><h2>Varför Trygga Kvinnor?</h2><p>Vi skapade Trygga Kvinnor eftersom vi tror att alla kvinnor förtjänar tillgång till mentalt hälsostöd – oavsett tid på dygnet, oavsett ekonomi.</p><p>Verkligheten är att ångest, stress och depression inte funkar efter kontorstid. De slår mitt i natten, mitt i jobbet. Du behöver stöd DÅ – inte nästa vecka.</p></div>
      </div>
      <div className="about-values-section">
        <h2>Våra värden</h2>
        <div className="values-grid">
          <div className="value-card"><h4>Trygghet</h4><p>En miljö där du kan vara dig själv utan rädsla för att dömas.</p></div>
          <div className="value-card"><h4>Tillgänglighet</h4><p>Stöd dygnet runt. Ångest vänter inte på kontorstid.</p></div>
          <div className="value-card"><h4>Evidensbaserat</h4><p>Allt vi erbjuder är baserat på forskning och bästa praxis.</p></div>
          <div className="value-card"><h4>Kvinnocentrerat</h4><p>Skapad för och av kvinnor. Vi förstår de unika utmaningarna.</p></div>
        </div>
      </div>
      <div className="about-vision"><h2>Vår vision</h2><p>Vi drömmer om en värld där mental hälsa inte är tabu, där varje kvinna har access till stöd hon behöver, och där det är lika naturligt att ta hand om sin mentala hälsa som sin fysiska.</p></div>
    </div>
  </div>
);

const CommunityPage = ({ isPremium, nav }) => {
  const categories = ['Alla', 'Ångest', 'Depression', 'Relationer', 'Våld', 'Beroende'];
  
  const [posts, setPosts] = useState([
    { id:1, author:'Emma', time:'2 timmar sedan', content:'Idag hade jag min första panikattack på flera månader. Jag är så besviken på mig själv. Jag trodde jag var över det här...', category:'Ångest', likes:12, comments:[{author:'Sofia',text:'Du är inte ensam. Återfall är del av processen. Var snäll mot dig själv ❤️'},{author:'Anna',text:'Jag har varit där. Det går över. Du är stark.'}] },
    { id:2, author:'Maria', time:'5 timmar sedan', content:'Jag vill bara säga tack till er alla. För två månader sedan mådde jag så dåligt att jag knappt kunde gå upp. Idag gick jag en promenad och kände mig nästan... normal? Det är små steg, men de räknas.', category:'Depression', likes:28, comments:[{author:'Linda',text:'Detta gav mig hopp. Tack för att du delar. Jag är så stolt över dig!'},{author:'Emma',text:'Du inspirerar mig. Fortsätt kämpa!'}] },
    { id:3, author:'Anna', time:'8 timmar sedan', content:'Min partner respekterar aldrig när jag säger nej. Jag börjar förstå att det här inte är okej...', category:'Relationer', likes:34, comments:[{author:'Karin',text:'Det här är INTE okej. Vet du om att du kan ringa kvinnofridslinjen? 020-50 50 50'},{author:'Lisa',text:'Du förtjänar så mycket bättre. Snälla, sök hjälp. Vi finns här för dig. ❤️'}] },
    { id:4, author:'Linda', time:'1 dag sedan', content:'Någon annan som känner skuld över att må dåligt när "inget är fel"? Jag har allt jag behöver men känner ändå denna tunga...', category:'Depression', likes:19, comments:[{author:'Maria',text:'Ja, absolut. Depression bryr sig inte om dina omständigheter. Du är inte ensam.'},{author:'Emma',text:'Känslor behöver inte logik för att vara giltiga. ❤️'}] },
    { id:5, author:'Sofia', time:'1 dag sedan', content:'14 dagar nykter idag. Det är inte mycket, men för mig är det enormt. Jag klarade av en jobbmiddag utan att dricka.', category:'Beroende', likes:89, comments:[{author:'Anna',text:'Jag är SÅ stolt över dig! 14 dagar är jättestort!'},{author:'Linda',text:'Du är en inspiration! Fortsätt kämpa, en dag i taget ❤️'}] },
    { id:6, author:'Karin', time:'2 dagar sedan', content:'Tips: Jag har börjat lägga undan telefonen 1h före sömn och det har gjort ENORM skillnad för min sömn och ångest. Prova det!', category:'Ångest', likes:45, comments:[{author:'Sofia',text:'Jag provar detta ikväll. Tack!'}] },
    { id:7, author:'Lisa', time:'2 dagar sedan', content:'Jag lämnade honom äntligen. Efter 3 år av gaslighting och kontroll är jag fri. Skrämmande och befriande samtidigt.', category:'Våld', likes:76, comments:[{author:'Emma',text:'Du är så modig. Det här var det svåraste och viktigaste steget. Stolt över dig!'},{author:'Maria',text:'Välkommen till din nya början. Du är starkare än du vet. ❤️'}] }
  ]);
  
  const [liked, setLiked] = useState({});
  const [showComments, setShowComments] = useState({});
  const [activeFilter, setActiveFilter] = useState('Alla');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('');
  const [newComment, setNewComment] = useState({});
  
  const filteredPosts = activeFilter === 'Alla' 
    ? posts 
    : posts.filter(p => p.category === activeFilter);
  
  const handleNewPost = (e) => {
    e.preventDefault();
    if (!newPostContent.trim() || !newPostCategory) return;
    
    const newPost = {
      id: Date.now(),
      author: 'Du',
      time: 'Just nu',
      content: newPostContent,
      category: newPostCategory,
      likes: 0,
      comments: []
    };
    
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setNewPostCategory('');
    setShowNewPostForm(false);
  };
  
  const handleAddComment = (postId) => {
    if (!newComment[postId]?.trim()) return;
    
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, { author: 'Du', text: newComment[postId] }]
        };
      }
      return post;
    }));
    
    setNewComment({ ...newComment, [postId]: '' });
  };
  
  return (
    <div className="page-content">
      <div className="page-hero community-hero">
        <h1>Community</h1>
        <p>En trygg plats för kvinnor att dela och stötta varandra</p>
      </div>
      
      <div className="community-guidelines">
        <h3>🛡️ Community Guidelines</h3>
        <p>✓ Var respektfull och empatisk</p>
        <p>✓ Ingen hatfull språk eller diskriminering</p>
        <p>✓ Dela inte personlig information (namn, adress, telefon)</p>
        <p>✓ Flagga olämpligt innehåll med report-knappen</p>
        <p>⚠️ <strong>Vid akut kris eller självmordstankar - ring 90101 eller 112 direkt</strong></p>
      </div>
      
      {!isPremium && (
        <div style={{
          background:'linear-gradient(135deg,rgba(212,117,111,0.1),rgba(123,175,142,0.1))',
          border:'2px solid var(--accent)',
          borderRadius:'20px',
          padding:'1.5rem 2rem',
          margin:'0 5% 2rem',
          maxWidth:'900px',
          textAlign:'center'
        }}>
          <h3 style={{fontSize:'1.2rem',marginBottom:'0.5rem',color:'var(--primary)'}}>
            💡 Du läser som gratisanvändare
          </h3>
          <p style={{color:'var(--text-medium)',fontSize:'0.92rem',marginBottom:'1rem'}}>
            Du kan läsa alla inlägg, men för att skriva egna inlägg och kommentera behöver du Premium.
          </p>
          <button className="btn-primary" onClick={() => nav('profil')}>
            Uppgradera till Premium - 39 kr/mån
          </button>
        </div>
      )}
      
      {showNewPostForm && isPremium && (
        <div className="new-post-form fade-in-up">
          <h3>Skapa nytt inlägg</h3>
          <p className="new-post-subtitle">Dela dina tankar, frågor eller erfarenheter med communityn</p>
          <form onSubmit={handleNewPost}>
            <div className="post-form-group">
              <label>Välj kategori *</label>
              <div className="category-pills">
                {categories.filter(c => c !== 'Alla').map(cat => (
                  <button
                    key={cat}
                    type="button"
                    className={'category-pill ' + (newPostCategory === cat ? 'selected' : '')}
                    onClick={() => setNewPostCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="post-form-group">
              <label>Ditt inlägg *</label>
              <textarea
                className="post-textarea"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Dela dina tankar här... Du är anonym och det du skriver behandlas med respekt."
                maxLength={1000}
              />
              <div className="post-actions-row">
                <span className="char-count">{newPostContent.length}/1000 tecken</span>
                <div style={{display:'flex',gap:'0.8rem'}}>
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => {
                      setShowNewPostForm(false);
                      setNewPostContent('');
                      setNewPostCategory('');
                    }}
                  >
                    Avbryt
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={!newPostContent.trim() || !newPostCategory}
                  >
                    Publicera inlägg
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
      
      <div className="category-filter">
        {categories.map(cat => (
          <button
            key={cat}
           className={'filter-pill ' + (activeFilter === cat ? 'active' : '')}
            onClick={() => setActiveFilter(cat)}
          >
          {cat} {cat === 'Alla' ? '(' + posts.length + ')' : '(' + posts.filter(p => p.category === cat).length + ')'}
          </button>
        ))}
      </div>
      
      <div className="community-feed">
        {filteredPosts.map(post => (
          <div key={post.id} className={'post-card fade-in-up category-' + post.category}>
            <div className="post-header">
              <div className="post-avatar"></div>
              <div className="post-author-info">
                <h4>{post.author}</h4>
                <span className="post-time">{post.time}</span>
              </div>
            </div>
            <p className="post-content">{post.content}</p>
            <div className="post-tags">
              <span className="post-tag">{post.category}</span>
            </div>
            <div className="post-actions">
              <button 
                className={'post-action-btn ' + (liked[post.id] ? 'active' : '')}
                onClick={() => setLiked({...liked, [post.id]: !liked[post.id]})}
              >
                ❤️ {post.likes + (liked[post.id] ? 1 : 0)}
              </button>
              <button 
                className="post-action-btn"
                onClick={() => setShowComments({...showComments, [post.id]: !showComments[post.id]})}
              >
                💬 {post.comments.length}
              </button>
              <button className="post-action-btn">🚩 Rapportera</button>
            </div>
            
            {showComments[post.id] && (
              <div className="comment-section">
                {post.comments.map((c, i) => (
                  <div key={i} className="comment">
                    <span className="comment-author">{c.author}:</span>
                    <span className="comment-text">{c.text}</span>
                  </div>
                ))}
                {isPremium ? (
                  <div style={{marginTop:'1rem',display:'flex',gap:'0.6rem',alignItems:'center'}}>
                    <input
                      type="text"
                      placeholder="Skriv en kommentar..."
                      value={newComment[post.id] || ''}
                      onChange={(e) => setNewComment({...newComment, [post.id]: e.target.value})}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                      style={{
                        flex:1,
                        padding:'0.6rem 1rem',
                        border:'2px solid var(--border)',
                        borderRadius:'50px',
                        fontSize:'0.9rem',
                        fontFamily:'inherit'
                      }}
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      disabled={!newComment[post.id]?.trim()}
                      className="btn-primary"
                      style={{padding:'0.6rem 1.2rem',fontSize:'0.9rem'}}
                    >
                      Skicka
                    </button>
                  </div>
                ) : (
                  <div style={{
                    marginTop:'1rem',
                    padding:'1rem',
                    background:'rgba(212,117,111,0.08)',
                    borderRadius:'12px',
                    textAlign:'center',
                    border:'1px dashed rgba(212,117,111,0.3)'
                  }}>
                    <p style={{fontSize:'0.9rem',color:'var(--text-medium)',marginBottom:'0.8rem'}}>
                      🔒 Kommentarer kräver Premium
                    </p>
                    <button 
                      className="btn-primary" 
                      style={{fontSize:'0.85rem',padding:'0.5rem 1rem'}}
                      onClick={() => nav('profil')}
                    >
                      Uppgradera - 39 kr/mån
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {!showNewPostForm && (
        <button 
          className="new-post-btn" 
          title={isPremium ? "Skapa nytt inlägg" : "Premium krävs"}
          onClick={() => isPremium ? setShowNewPostForm(true) : nav('profil')}
          style={{background: isPremium ? 'linear-gradient(135deg,var(--primary),#C66D67)' : 'linear-gradient(135deg,#999,#777)'}}
        >
          {isPremium ? '+' : '🔒'}
        </button>
      )}
    </div>
  );
};
const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);
};

const formatTime = (ts) => {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts.seconds * 1000);
  return d.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
};
const TherapistPage = ({ nav, currentUser }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'chats'), snapshot => {
      const chatList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setChats(chatList.sort((a,b) => (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0)));
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!selectedChat) return;
    const q = query(collection(db, 'chats', selectedChat.id, 'messages'), orderBy('createdAt'));
    const unsub = onSnapshot(q, snapshot => {
      setMessages(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [selectedChat]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (e) => {
  e.preventDefault();
  if (!input.trim() || !selectedChat) return;
  
  await addDoc(collection(db, 'chats', selectedChat.id, 'messages'), {
    text: input,
    sender: 'therapist',
    senderName: 'Din terapeut',
    createdAt: serverTimestamp()
  });

  await setDoc(doc(db, 'chats', selectedChat.id), {
    lastMessage: input,
    updatedAt: serverTimestamp(),
    therapistReplied: true,
    therapistFirstReplyAt: serverTimestamp(),
    queueStatus: 'active'
  }, { merge: true });

  setInput('');
};

  return (
    <div className="page-content">
      <div style={{padding:'1.5rem 5% 0'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
          <div>
            <h2 style={{fontFamily:'Playfair Display,serif',fontSize:'1.8rem',color:'#2D2424'}}>Terapeutvyn</h2>
            <p style={{color:'#8B7B7B',fontSize:'0.9rem'}}>{chats.length} aktiva klienter</p>
          </div>
        </div>
      </div>
      <div className="therapist-dashboard">
        <div className="client-sidebar">
          <div className="sidebar-header">
            <h3>Klienter</h3>
            <p>{chats.length} aktiva konversationer</p>
          </div>
          <div className="client-list">
            {chats.length === 0 ? (
              <div className="empty-sidebar"><p>Inga aktiva klienter ännu.</p></div>
            ) : (
             chats.map(chat => {
  // Räkna ut väntetid
  const firstMsg = chat.firstMessageAt?.seconds;
  const now = Date.now() / 1000;
  const hoursWaiting = firstMsg ? Math.floor((now - firstMsg) / 3600) : 0;
  const hasReplied = chat.therapistReplied;
  
  // Färgkod
  let statusColor = '#7BAF8E'; // grön — ok
  let statusText = 'Ny';
  if (hasReplied) { statusColor = '#B0B0B0'; statusText = 'Aktiv'; }
  else if (hoursWaiting >= 94) { statusColor = '#D4756F'; statusText = '⚠️ 94h+'; }
  else if (hoursWaiting >= 48) { statusColor = '#E8B466'; statusText = '⚠️ 48h+'; }

  return (
    <div key={chat.id} className={'client-item ' + (selectedChat?.id === chat.id ? 'active' : '')}
      onClick={() => setSelectedChat(chat)}>
      <div className="client-avatar">{getInitials(chat.userName || chat.userEmail)}</div>
      <div className="client-meta">
        <div className="client-name">{chat.userName || chat.userEmail || 'Anonym'}</div>
        <div className="client-last-msg">{chat.lastMessage || 'Inget meddelande'}</div>
      </div>
      <div style={{
        width:'8px', height:'8px', borderRadius:'50%',
        background: statusColor, flexShrink:0,
        title: statusText
      }}></div>
      {!hasReplied && hoursWaiting > 0 && (
        <div style={{fontSize:'0.65rem',color:statusColor,fontWeight:700,flexShrink:0}}>
          {hoursWaiting}h
        </div>
      )}
    </div>
  );
})
            )}
          </div>
        </div>
        <div className="therapist-chat-area">
          {!selectedChat ? (
            <div className="no-chat-selected"><p>Välj en klient för att se konversationen</p></div>
          ) : (
            <>
              <div className="therapist-chat-header">
                <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
                  <div className="client-avatar" style={{width:'44px',height:'44px',fontSize:'1rem'}}>
                    {getInitials(selectedChat.userName || selectedChat.userEmail)}
                  </div>
                  <div>
                    <h3>{selectedChat.userName || selectedChat.userEmail || 'Anonym klient'}</h3>
                    <p><span className="online-dot"></span>Aktiv nu</p>
                  </div>
                </div>
              </div>
              <div className="therapist-messages">
                {messages.map(m => (
                  <div key={m.id} className={'therapy-message ' + (m.sender === 'therapist' ? 'user' : '')}>
                    <div className={'msg-avatar ' + (m.sender === 'therapist' ? 'user-av' : 'therapist-av')}>
                      {m.sender === 'therapist' ? 'T' : getInitials(selectedChat.userName || selectedChat.userEmail)}
                    </div>
                    <div>
                      <div className={'msg-bubble ' + (m.sender === 'therapist' ? 'user-bubble' : 'therapist-bubble')}>
                        {m.text}
                      </div>
                      <span className="msg-time">{formatTime(m.createdAt)}</span>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef}/>
              </div>
              <div className="therapist-input-area">
                <input type="text" value={input} onChange={e=>setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && sendMessage(e)}
                  placeholder={'Svara ' + (selectedChat.userName || 'klienten') + '...'}
                  className="therapy-input"/>
                <button onClick={sendMessage} className="therapy-send-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
const UserTherapyChat = ({ nav, currentUser, isPremium }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [messageCount, setMessageCount] = useState(0);
const [showLimitQuestion, setShowLimitQuestion] = useState(false);
const MESSAGE_LIMIT = 10;
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'chats', currentUser.uid, 'messages'), orderBy('createdAt'));
    const unsub = onSnapshot(q, snapshot => {
      setMessages(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [currentUser]);
  useEffect(() => {
  if (!currentUser || messages.length === 0) return;
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const count = messages.filter(m => {
    if (m.sender !== 'user') return false;
    if (!m.createdAt) return false;
    const d = m.createdAt.toDate ? m.createdAt.toDate() : new Date(m.createdAt.seconds * 1000);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;
  setMessageCount(count);
}, [messages, currentUser]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

 const sendMessage = async (e) => {
   if (messageCount >= MESSAGE_LIMIT) {
  setShowLimitQuestion(true);
  return;
}
  e.preventDefault();
  if (!input.trim() || !currentUser) return;
  const text = input;
  setInput('');

  // Kolla om detta är första meddelandet
  const isFirstMessage = messages.length === 0;

  await setDoc(doc(db, 'chats', currentUser.uid), {
    userId: currentUser.uid,
    userEmail: currentUser.email,
    userName: currentUser.displayName || currentUser.email,
    lastMessage: text,
    updatedAt: serverTimestamp(),
    // Spara tidsstämpel för första meddelandet om det inte redan finns
    ...(isFirstMessage && {
      firstMessageAt: serverTimestamp(),
      queueStatus: 'waiting',
      therapistReplied: false,
    })
  }, { merge: true });

  await addDoc(collection(db, 'chats', currentUser.uid, 'messages'), {
    text,
    sender: 'user',
    senderName: currentUser.displayName || currentUser.email,
    createdAt: serverTimestamp()
  });
};

  if (!currentUser) return (
    <div className="page-content">
      <div className="page-hero expert-hero"><h1>Terapi-chatt</h1><p>Logga in för att chatta</p></div>
      <div style={{textAlign:'center',padding:'3rem'}}>
        <button className="btn-primary" onClick={()=>nav('login')}>Logga in</button>
      </div>
    </div>
  );

  if (!isPremium) return (
    <div className="page-content">
      <div className="page-hero expert-hero"><h1>Terapi-chatt</h1><p>Personligt stöd från legitimerade terapeuter</p></div>
      <div style={{textAlign:'center',padding:'3rem 2rem',maxWidth:'520px',margin:'0 auto'}}>
        <div style={{fontSize:'3rem',marginBottom:'1.5rem'}}>🔒</div>
        <h3 style={{fontFamily:'Playfair Display,serif',fontSize:'2rem',marginBottom:'1rem'}}>Premium krävs</h3>
        <p style={{color:'#8B7B7B',marginBottom:'2rem'}}>Ingen bokning. Ingen diagnos. Bara någon som lyssnar och svarar — när du behöver det.</p>
        <button className="btn-primary" onClick={()=>nav('profil')}>Uppgradera till Premium — 369 kr/mån</button>
      </div>
    </div>
  );

  return (
    <div className="therapy-page">
      <div style={{background:'white',borderRadius:'20px',overflow:'hidden',boxShadow:'0 8px 40px rgba(212,117,111,0.12)'}}>
        <div className="therapy-header">
          <div className="therapist-avatar-lg">🌸</div>
          <div className="therapist-info" style={{flex:1}}>
            <h3>Din personliga terapeut</h3>
            <p><span className="online-dot"></span>Svarar inom 24 timmar · Legitimerad terapeut</p>
          </div>
        </div>
        <div className="therapy-messages">
          {messages.length === 0 && (
            <div style={{textAlign:'center',padding:'3rem 2rem',color:'#C0B0B0'}}>
              <div style={{fontSize:'2.5rem',marginBottom:'1rem'}}>🌸</div>
              <p style={{fontFamily:'Playfair Display,serif',fontSize:'1.1rem',color:'#8B7B7B',marginBottom:'0.5rem'}}>Välkommen till din trygga plats</p>
              <p style={{fontSize:'0.85rem',lineHeight:'1.7'}}>Skriv ditt första meddelande. Din terapeut svarar inom 24 timmar.</p>
            </div>
          )}
          {messages.map(m => (
            <div key={m.id} className={'therapy-message ' + (m.sender === 'user' ? 'user' : '')}>
              <div className={'msg-avatar ' + (m.sender === 'user' ? 'user-av' : 'therapist-av')}>
                {m.sender === 'user' ? getInitials(currentUser.displayName || currentUser.email) : '🌸'}
              </div>
              <div>
                <div className={'msg-bubble ' + (m.sender === 'user' ? 'user-bubble' : 'therapist-bubble')}>{m.text}</div>
                <span className="msg-time">{formatTime(m.createdAt)}</span>
              </div>
            </div>
          ))}
          <div ref={bottomRef}/>
        </div>
      {messageCount > 0 && messageCount < MESSAGE_LIMIT && (
  <div style={{textAlign:'center',fontSize:'0.78rem',color:'#7BAF8E',padding:'0.4rem',background:'rgba(123,175,142,0.08)'}}>
    {MESSAGE_LIMIT - messageCount} meddelanden kvar denna månad
  </div>
)}
         {showLimitQuestion && (
  <div style={{padding:'1.5rem',background:'#FBF8F5',borderTop:'1px solid rgba(212,117,111,0.12)',textAlign:'center'}}>
    <div style={{fontSize:'1.5rem',marginBottom:'0.5rem'}}>💬</div>
    <h3 style={{fontFamily:'Playfair Display,serif',fontSize:'1.1rem',marginBottom:'0.5rem',color:'#2D2424'}}>
      Du har använt dina 10 meddelanden denna månad
    </h3>
<p style={{color:'#8B7B7B',fontSize:'0.9rem',marginBottom:'1rem'}}>
      Skulle du vilja ha fler meddelanden per månad?
    </p>
    <div style={{display:'flex',gap:'1rem',justifyContent:'center'}}>
      <button className="btn-primary" onClick={() => { setShowLimitQuestion(false); alert('Tack för din feedback!'); }}>Ja, gärna!</button>
      <button className="btn-secondary" onClick={() => setShowLimitQuestion(false)}>Nej tack</button>
    </div>
  </div>
)}
<div className="therapy-input-area">
  <input type="text" value={input} onChange={e=>setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && sendMessage(e)} placeholder={messageCount >= MESSAGE_LIMIT ? 'Meddelandegräns nådd' : 'Skriv till din terapeut...'} className="therapy-input" disabled={messageCount >= MESSAGE_LIMIT}/>
  <button onClick={sendMessage} className="therapy-send-btn" disabled={!input.trim() || messageCount >= MESSAGE_LIMIT}><svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>
</div>
<div className="therapy-disclaimer">Krypterat och konfidentiellt. Vid akut kris: ring 90101 eller 112</div>
      </div>
    </div>
  );
};

const HomePage = ({ nav }) => (
  <div className="page-content">
    <div className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">Trygga Kvinnor</h1>
        <p className="hero-subtitle">Ditt utrymme för personlig utveckling</p>
        <p className="hero-text">Ett varmt och tryggt rum där du kan växa, läka och hitta balans. Meditation, terapi, gemenskap – allt samlat på ett ställe.</p>
        <div className="cta-buttons"><button className="btn-primary" onClick={()=>nav('meditation')}>Börja meditera</button><button className="btn-secondary" onClick={()=>nav('chat')}>Chatta</button></div>
      </div>
      <div className="hero-image" style={{backgroundImage:'url(https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200)'}}></div>
    </div>
    <section className="features-section">
      <div className="feature-card" onClick={()=>nav('meditation')}><div className="feature-image" style={{backgroundImage:'url(https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600)'}}></div><h3>Meditation och Andning</h3><p>Guidat stöd för inre ro. Meditationer från 5 till 20 minuter och interaktiva andningsövningar.</p><span className="feature-link">Utforska &#8594;</span></div>
      <div className="feature-card" onClick={()=>nav('chat')}><div className="feature-image" style={{backgroundImage:'url(https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600)'}}></div><h3>AI-Rådgivning</h3><p>En AI som lyssnar och ger allmänt stöd dygnet runt. Komplement till, inte ersättning för, professionell vård.</p><span className="feature-link">Chatta nu &#8594;</span></div>
      <div className="feature-card" onClick={()=>nav('expert')}><div className="feature-image" style={{backgroundImage:'url(https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=600)'}}></div><h3>Professionell terapi</h3><p>Chatta med legitimerade terapeuter med svar binnen 24 timmar.</p><span className="feature-link">Läs mer &#8594;</span></div>
      <div className="feature-card" onClick={()=>nav('mood')}><div className="feature-image" style={{backgroundImage:'url(https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600)'}}></div><h3>Mående-dagbok</h3><p>Registrera hur du mår varje dag. Se mönster och din utveckling över tid.</p><span className="feature-link">Börja följa &#8594;</span></div>
      <div className="feature-card" onClick={() => { setOpenArticleId(13); nav('artiklar'); }}><div className="feature-image" style={{backgroundImage:'url(https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600)'}}></div><h3>Artiklar och Kunskap</h3><p>Evidensbaserade artiklar om mental hälsa, relationer, självvård och mindfulness.</p><span className="feature-link">Läs artiklar &#8594;</span></div>
      <div className="feature-card" onClick={()=>nav('community')}><div className="feature-image" style={{backgroundImage:'url(https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=600)'}}></div><h3>Trygg community</h3><p>Chatta anonymt med andra kvinnor i en modererad och säker miljö.</p><span className="feature-link">Utforska &#8594;</span></div>
    </section>
    <section className="featured-story fade-in-up" style={{padding:'3rem 5%',background:'linear-gradient(135deg,rgba(212,117,111,0.06),rgba(232,180,168,0.04))'}}>
      <div style={{maxWidth:'900px',margin:'0 auto'}}>
        <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'1.5rem'}}>
          <span style={{background:'var(--primary)',color:'white',borderRadius:'50px',padding:'0.3rem 1rem',fontSize:'0.78rem',fontWeight:700,letterSpacing:'0.05em'}}>✨ VECKANS BERÄTTELSE</span>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2.5rem',alignItems:'center',background:'white',borderRadius:'24px',padding:'2.5rem',boxShadow:'0 8px 40px rgba(212,117,111,0.12)'}}>
          <div style={{borderRadius:'16px',overflow:'hidden',height:'400px',background:'white'}}>
            <div style={{width:'100%',height:'100%',backgroundImage:'url(https://i.imgur.com/mKXoyAu.webp)',backgroundSize:'contain',backgroundRepeat:'no-repeat',backgroundColor:'#white',backgroundPosition:'center'}}></div>
          </div>
          <div>
            <span style={{fontSize:'0.8rem',color:'var(--primary)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em'}}>Personlig berättelse</span>
            <h2 style={{fontFamily:'Playfair Display,serif',fontSize:'2rem',margin:'0.5rem 0 1rem',lineHeight:1.3}}>Människan bakom masken</h2>
            <p style={{color:'var(--text-medium)',lineHeight:1.8,marginBottom:'1.5rem',fontSize:'0.95rem'}}>På bara ett år förlorade jag fyra nära i suicid. Det var tystnaden efteråt som fick mig att vilja göra något — och starta en podd om det ingen vill prata om.</p>
            <div style={{display:'flex',gap:'1rem',flexWrap:'wrap'}}>
              <button onClick={()=>{ nav('artiklar'); setTimeout(()=>{ const el = document.getElementById('artikel-13'); if(el) el.click(); }, 100); }} className="btn-primary" style={{padding:'0.7rem 1.5rem'}}>
                Läs hela berättelsen →
              </button>
              <a href="https://open.spotify.com/show/3OwdDmeLPNnFunKnJRvrss" target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'center',gap:'0.5rem',background:'#1DB954',color:'white',borderRadius:'50px',padding:'0.7rem 1.5rem',textDecoration:'none',fontWeight:600,fontSize:'0.9rem'}}>
                🎧 Lyssna på podden
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section style={{padding:'4rem 5%',background:'white'}}>
  <h2 style={{textAlign:'center',fontFamily:'Playfair Display,serif',fontSize:'2rem',marginBottom:'0.5rem'}}>Enkla priser, inga överraskningar</h2>
  <p style={{textAlign:'center',color:'var(--text-light)',marginBottom:'3rem'}}>Börja gratis — uppgradera när du är redo</p>
  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:'1.5rem',maxWidth:'900px',margin:'0 auto'}}>
    
    <div style={{border:'2px solid var(--border)',borderRadius:'20px',padding:'2rem',textAlign:'center'}}>
      <h3 style={{fontSize:'1.2rem',marginBottom:'0.5rem'}}>Gratis</h3>
      <div style={{fontSize:'2.5rem',fontWeight:700,color:'var(--text-dark)',margin:'1rem 0'}}>0 kr</div>
      <p style={{color:'var(--text-light)',fontSize:'0.9rem',marginBottom:'1.5rem'}}>För alltid gratis</p>
      <ul style={{listStyle:'none',textAlign:'left',fontSize:'0.9rem',color:'var(--text-medium)',marginBottom:'1.5rem',display:'flex',flexDirection:'column',gap:'0.5rem'}}>
        <li>✓ 3 AI-meddelanden</li>
        <li>✓ Artiklar och meditation</li>
      </ul>
      <button onClick={()=>nav('signup')} style={{width:'100%',background:'none',border:'2px solid var(--border)',borderRadius:'50px',padding:'0.8rem',cursor:'pointer',fontFamily:'inherit',fontWeight:600}}>Kom igång</button>
    </div>

    <div style={{border:'2px solid var(--primary)',borderRadius:'20px',padding:'2rem',textAlign:'center',background:'rgba(212,117,111,0.03)'}}>
      <h3 style={{fontSize:'1.2rem',marginBottom:'0.5rem'}}>Bas</h3>
      <div style={{fontSize:'2.5rem',fontWeight:700,color:'var(--primary)',margin:'1rem 0'}}>39 kr<span style={{fontSize:'1rem',fontWeight:400,color:'var(--text-light)'}}>/mån</span></div>
      <p style={{color:'var(--text-light)',fontSize:'0.9rem',marginBottom:'1.5rem'}}>Ingen bindningstid</p>
      <ul style={{listStyle:'none',textAlign:'left',fontSize:'0.9rem',color:'var(--text-medium)',marginBottom:'1.5rem',display:'flex',flexDirection:'column',gap:'0.5rem'}}>
        <li>✓ Obegränsad AI-chatt</li>
        <li>✓ Mående-dagbok</li>
        <li>✓ Menscykel-tracker</li>
        <li>✓ Alla artiklar</li>
      </ul>
      <button onClick={()=>nav('profil')} className="btn-primary" style={{width:'100%'}}>Välj Bas</button>
    </div>

    <div style={{border:'2px solid var(--accent)',borderRadius:'20px',padding:'2rem',textAlign:'center',position:'relative'}}>
      <div style={{position:'absolute',top:'-14px',left:'50%',transform:'translateX(-50%)',background:'var(--accent)',color:'white',borderRadius:'50px',padding:'0.3rem 1rem',fontSize:'0.78rem',fontWeight:700}}>POPULÄRAST</div>
      <h3 style={{fontSize:'1.2rem',marginBottom:'0.5rem'}}>Premium</h3>
      <div style={{fontSize:'2.5rem',fontWeight:700,color:'var(--accent)',margin:'1rem 0'}}>369 kr<span style={{fontSize:'1rem',fontWeight:400,color:'var(--text-light)'}}>/mån</span></div>
      <p style={{color:'var(--text-light)',fontSize:'0.9rem',marginBottom:'1.5rem'}}>Ingen bindningstid</p>
      <ul style={{listStyle:'none',textAlign:'left',fontSize:'0.9rem',color:'var(--text-medium)',marginBottom:'1.5rem',display:'flex',flexDirection:'column',gap:'0.5rem'}}>
        <li>✓ Allt i Bas</li>
        <li>✓ 10 meddelanden/mån med legitimerad terapeut</li>
        <li>✓ Svar inom 24 timmar</li>
      </ul>
      <button onClick={()=>nav('profil')} className="btn-primary" style={{width:'100%',background:'var(--accent)'}}>Välj Premium</button>
    </div>

  </div>
</section>
    <section className="testimonials-section fade-in-up">
      <h2>Vad våra användare säger</h2>
      <div className="testimonials-grid">
        {testimonials.map((t,i)=>(
          <div key={t.id} className={'testimonial-card fade-in-up delay-' + Math.min(i+1,6)}>
            <div className="stars">★★★★★</div>
            <div className="quote-icon">"</div>
            <p className="testimonial-text">{t.text}</p>
            <div className="testimonial-author">
              <div className="testimonial-avatar"></div>
              <div>
                <div className="testimonial-name">{t.name}</div>
                <div className="testimonial-role">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
    <section className="faq-section fade-in-up">
      <h2>Vanliga frågor</h2>
      <FAQList />
    </section>
  </div>
);

const FAQList = () => {
  const [openId, setOpenId] = useState(null);
  return (
    <>
      {faqs.map(faq=>(
        <div key={faq.id} className="faq-item" onClick={()=>setOpenId(openId === faq.id ? null : faq.id)}>
          <div className="faq-question">
            <span>{faq.question}</span>
            <span className={'faq-toggle ' + (openId === faq.id ? 'open' : '')}>▼</span>
          </div>
          <div className={'faq-answer ' + (openId === faq.id ? 'open' : '')}>{faq.answer}</div>
        </div>
      ))}
    </>
  );
};

/* ============================================================
   MAIN APP
   ============================================================ */
function AppContent() {
  const { currentUser, isPremium, isTherapist} = useAuth();
  const [page, setPage] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [disclaimerSeen, setDisclaimerSeen] = useState(false);
  const [openArticleId, setOpenArticleId] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);

useEffect(() => {
  if (currentUser) {
    setShowWelcome(true);
    const t = setTimeout(() => setShowWelcome(false), 12000);
    return () => clearTimeout(t);
  }
}, [currentUser]);

  const navItems = [
    { key:'home', label:'Hem' },
    { key:'meditation', label:'Meditation' },
    { key:'artiklar', label:'Artiklar' },
    { key:'mood', label:'Mående' },
    { key:'community', label:'Community' },
    { key:'chat', label:'Chat' },
    { key:'expert', label:'Terapi' },
    { key:'resurser', label:'Resurser' }
  ];

  const nav = (p) => { setPage(p); setMobileOpen(false); };

  const renderPage = () => {
    switch(page) {
      case 'home': return <HomePage nav={nav}/>;
      case 'meditation': return <MeditationPage nav={nav}/>;
      case 'artiklar': return <ArticlesPage nav={nav} isPremium={isPremium} openArticleId={openArticleId}/>;
      case 'mood': return <MoodPage nav={nav} isPremium={isPremium} currentUser={currentUser}/>;
      case 'workshops': return <WorkshopsPage/>;
      case 'chat': return <ChatPage nav={nav} isPremium={isPremium} currentUser={currentUser}/>;
     case 'expert': return <ExpertPage nav={nav} isPremium={isPremium} currentUser={currentUser}/>;
      case 'resurser': return <ResourcesPage/>;
      case 'sekretess': return <PrivacyPage/>;
      case 'om-oss': return <AboutPage/>;
      case 'community': return <CommunityPage nav={nav} isPremium={isPremium}/>;
      case 'profil': return <ProfilePage nav={nav}/>;
        case 'terapi-chatt': return <UserTherapyChat nav={nav} currentUser={currentUser} isPremium={isPremium}/>;
case 'terapeut': return <TherapistPage nav={nav} currentUser={currentUser}/>;
      case 'login': return <LoginPage nav={nav}/>;
case 'signup': return <SignupPage nav={nav}/>;
case 'forgot-password': return <ForgotPasswordPage nav={nav}/>;
case 'account': return <AccountPage nav={nav} />;
case 'success': return <SuccessPage nav={nav}/>;
      default: return <HomePage nav={nav}/>;
      
    }
  };

  return (
    <>
      <style>{css}</style>
      {showWelcome && currentUser && !mobileOpen && (
  <div style={{
    position:'fixed', top:'80px', right:'20px', zIndex:1000,
    background:'white', borderRadius:'20px', padding:'1.2rem 1.5rem',
    boxShadow:'0 8px 40px rgba(212,117,111,0.2)', border:'1px solid rgba(212,117,111,0.15)',
    maxWidth:'300px', animation:'slideIn 0.4s ease'
  }}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
      <div>
        <div style={{fontSize:'1.1rem',fontWeight:700,color:'var(--text-dark)',marginBottom:'0.3rem'}}>
          Hej {currentUser.displayName || currentUser.email.split('@')[0]}! 🌸
        </div>
        <div style={{fontSize:'0.88rem',color:'var(--text-medium)',lineHeight:1.5}}>
          Hur mår du idag? Vi är glada att du är här.
        </div>
        <div style={{display:'flex',gap:'0.5rem',marginTop:'0.8rem'}}>
          <button onClick={()=>{setShowWelcome(false);setPage('mood');}} style={{background:'var(--primary)',color:'white',border:'none',borderRadius:'50px',padding:'0.4rem 0.9rem',fontSize:'0.8rem',cursor:'pointer',fontFamily:'inherit',fontWeight:600}}>
            Logga mående
          </button>
          <button onClick={()=>{setShowWelcome(false);setPage('chat');}} style={{background:'none',border:'2px solid var(--border)',borderRadius:'50px',padding:'0.4rem 0.9rem',fontSize:'0.8rem',cursor:'pointer',fontFamily:'inherit',color:'var(--text-medium)'}}>
            Chatta
          </button>
        </div>
      </div>
      <button onClick={()=>setShowWelcome(false)} style={{background:'none',border:'none',cursor:'pointer',fontSize:'1.2rem',color:'var(--text-light)',marginLeft:'0.5rem',lineHeight:1}}>×</button>
    </div>
  </div>
)}
      {!disclaimerSeen && (
        <div className="disclaimer-overlay">
          <div className="disclaimer-modal">
            <div className="disclaimer-modal-icon">🛡️</div>
            <h2>Viktigt att veta</h2>
            <p>Välkommen till Trygga Kvinnor. Innan du börjar — läs detta noga.</p>
            <div className="disclaimer-box">
              <p>AI-rådgivningen på detta ställe är ett <strong>allmänt stöd</strong> och ersätter <strong>inte</strong> professionell psykisk hälsovård.</p>
              <p>Prata alltid med en läkare, psykoterapeut eller annan professionell om du mår dåligt.</p>
            </div>
            <div className="disclaimer-box">
              <p className="crisis-line">Vid akut kris eller självmordstankar:</p>
              <p>Mind Självmordslinjen: <strong>90101</strong> — dygnet runt</p>
              <p>Akut fara: <strong>112</strong></p>
              <p>Vårdguiden: <strong>1177</strong></p>
            </div>
            <p style={{fontSize:'0.85rem',color:'var(--text-light)',marginTop:'0.5rem'}}>Genom att klicka "Jag förstår" bekräftar du att du har läst och förstår detta.</p>
            <button className="btn-primary" onClick={()=>setDisclaimerSeen(true)}>Jag förstår</button>
          </div>
        </div>
      )}
      <div className="app">
      <nav className="navbar">
  <button className="logo" onClick={()=>nav('home')} style={{zIndex:100,position:'relative'}}>Trygga Kvinnor</button>
  
  {/* Desktop meny */}
  <div className="nav-links">
    {navItems.map(item => <button key={item.key} className={'nav-btn ' + (page===item.key?'active':'')} onClick={()=>nav(item.key)}>{item.label}</button>)}
    {currentUser ? (
      <>
        {isTherapist && (
          <button className="nav-btn" onClick={()=>nav('terapeut')} style={{fontSize:'0.7rem',color:'var(--text-light)'}}>⚙️</button>
        )}
        <button className="user-menu" onClick={()=>nav('account')}>
          👤 {currentUser.displayName || 'Profil'}
        </button>
      </>
    ) : (
      <button className="nav-btn nav-cta" onClick={()=>nav('login')}>Logga in</button>
    )}
  </div>

  {/* Mobil hamburgare */}
 <button 
  className="mobile-menu-btn" 
  onClick={(e)=>{e.stopPropagation();setMobileOpen(!mobileOpen);}} 
  style={{zIndex:1002,position:'relative'}}
>
  <span/><span/><span/>
</button>

  {/* Mobil overlay */}
 {mobileOpen && (
    <div onClick={()=>setMobileOpen(false)} style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'rgba(0,0,0,0.4)',zIndex:997}}/>
  )}
</nav>
        <main className="main-content">{renderPage()}</main>
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-brand"><h3>Trygga Kvinnor</h3><p>Ett tryggt utrymme för personlig utveckling</p></div>
            <div className="footer-links">
              <button className="footer-link" onClick={()=>nav('resurser')}>Resurser</button>
              <button className="footer-link" onClick={()=>nav('sekretess')}>Sekretess</button>
              <button className="footer-link" onClick={()=>nav('om-oss')}>Om oss</button>
            </div>
            <div className="footer-crisis"><p>Akut kris? Ring 112 eller 90101</p></div>
          </div>
        </footer>
      </div>
    </>
  );
}

const LoginPage = ({ nav }) => {

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
            {isLogin && (
  <div style={{textAlign:'right',marginTop:'-0.8rem'}}>
    <button type="button" onClick={()=>nav('forgot-password')} style={{background:'none',border:'none',color:'var(--primary)',fontSize:'0.85rem',cursor:'pointer',fontFamily:'inherit',fontWeight:600}}>
      Glömt lösenord?
    </button>
  </div>
)}
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
const ProfilePage = ({ nav }) => {
  const { createCheckoutSession, loading } = useStripe();
  return (
    <div className="page-content">
      <div className="page-hero profile-hero">
        <h1>Alla förtjänar någon att prata med.</h1>
        <div style={{display:'flex',justifyContent:'center',gap:'0.3rem',margin:'0.8rem 0',color:'#D4756F',fontSize:'1.3rem'}}>★★★★★</div>
        <p style={{fontSize:'0.95rem',color:'var(--text-light)'}}>4.9 av 5 — älskad av våra användare</p>
      </div>

      <p style={{textAlign:'center',color:'var(--text-medium)',fontSize:'1.1rem',padding:'1.5rem 5% 0',maxWidth:'600px',margin:'0 auto'}}>
        Ibland räcker det att få skriva av sig – och få ett svar tillbaka.
      </p>

      <div className="pricing-cards">
        <div className="pricing-card">
          <h3>🌿 Bas</h3>
          <p style={{color:'var(--text-light)',fontSize:'0.9rem',marginBottom:'1rem'}}>För dig som vill må bättre varje dag</p>
          <div className="price">39 kr<span>/månad</span></div>
          <p style={{color:'var(--text-medium)',fontSize:'0.9rem',marginBottom:'1rem'}}>Bygg en starkare mental vardag i din egen takt.</p>
          <ul>
            <li>AI-stöd för reflektion och vägledning</li>
            <li>Alla artiklar och guider</li>
            <li>Mood tracking & dagbok</li>
            <li>Meditationer och övningar</li>
            <li>Community</li>
          </ul>
          <p style={{color:'var(--text-light)',fontSize:'0.85rem',fontStyle:'italic',margin:'1rem 0'}}>
            👉 Perfekt för dig som vill förstå dig själv bättre och skapa nya vanor
          </p>
          <button className="btn-secondary full-width" onClick={() => createCheckoutSession(import.meta.env.VITE_STRIPE_PRICE_ID_BAS)}>
            Välj Bas
          </button>
        </div>

        <div className="pricing-card featured">
          <div className="badge">Mest populär</div>
          <h3>💬 Premium</h3>
          <p style={{color:'var(--text-light)',fontSize:'0.9rem',marginBottom:'0.5rem'}}>När du vill ha riktigt stöd</p>
          <p style={{color:'var(--primary)',fontSize:'0.85rem',fontWeight:600,marginBottom:'1rem'}}>
            
            Ingen bokning. Ingen diagnos. Bara någon som lyssnar och svarar — när du behöver det.
          </p>
          <div className="price">369 kr<span>/månad</span></div>
          <p style={{color:'var(--text-medium)',fontSize:'0.9rem',marginBottom:'1rem'}}>
            Allt i Bas – plus möjlighet att bli sedd och få personligt stöd.
          </p>
          <ul>
            <li>Skriv när du behöver – svar inom 24h</li>
            <li>Personliga svar från legitimerad terapeut</li>
            <li>Stöd utan att boka tid</li>
            <li>Live workshops</li>
            <li>Ingen bindningstid</li>
          </ul>
          <p style={{color:'var(--text-light)',fontSize:'0.85rem',fontStyle:'italic',margin:'1rem 0'}}>
            👉 För dig som vill ha någon att vända dig till – på dina villkor
          </p>
          <p style={{color:'var(--text-light)',fontSize:'0.82rem',marginBottom:'1rem'}}>
            💡 De flesta använder chatten några gånger i månaden, när behovet finns.
          </p>
          <button className="btn-primary full-width" onClick={() => createCheckoutSession(import.meta.env.VITE_STRIPE_PRICE_ID_PREMIUM)} disabled={loading}>
            {loading ? 'Laddar...' : 'Starta med stöd'}
          </button>
        </div>
      </div>

      <div className="guarantee-section">
        <p>30 dagars pengarna-tillbaka-garanti. Avsluta när du vill.</p>
        <p style={{marginTop:'0.8rem',color:'var(--text-light)',fontSize:'0.9rem'}}>
          🔒 Dina samtal är alltid privata och krypterade. Vi delar aldrig din information.
        </p>
      </div>
    </div>
  );
};

const SignupPage = ({ nav }) => <LoginPage nav={nav}/>;
const ForgotPasswordPage = ({ nav }) => {
  const { auth } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await auth.sendPasswordResetEmail(email);
      setSent(true);
    } catch (err) {
      setError('Kunde inte skicka återställningsmail. Kontrollera e-postadressen.');
    }
  };

  return (
    <div style={{minHeight:'80vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem'}}>
      <div style={{background:'#fff',borderRadius:'24px',padding:'2.5rem',maxWidth:'440px',width:'100%',boxShadow:'0 4px 24px rgba(212,117,111,0.12)'}}>
        <h2 style={{fontFamily:'Playfair Display,serif',fontSize:'2rem',marginBottom:'0.5rem',textAlign:'center'}}>Glömt lösenord?</h2>
        <p style={{color:'#8B7B7B',textAlign:'center',marginBottom:'2rem'}}>Vi skickar ett återställningsmail till dig 🌸</p>
        {sent ? (
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:'3rem',marginBottom:'1rem'}}>✉️</div>
            <p style={{color:'#7BAF8E',fontWeight:600,marginBottom:'1.5rem'}}>Mail skickat! Kolla din inkorg.</p>
            <button onClick={()=>nav('login')} className="btn-primary">Tillbaka till inloggning</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1.2rem'}}>
            {error && <div style={{background:'rgba(212,117,111,0.1)',borderRadius:'12px',padding:'1rem',color:'#B85E58',fontSize:'0.9rem'}}>{error}</div>}
            <div>
              <label style={{fontWeight:600,fontSize:'0.9rem',display:'block',marginBottom:'0.4rem'}}>E-post</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="din@epost.se"
                style={{width:'100%',padding:'0.85rem 1.2rem',border:'2px solid rgba(212,117,111,0.2)',borderRadius:'14px',fontSize:'0.95rem',fontFamily:'inherit',boxSizing:'border-box'}}/>
            </div>
            <button type="submit" className="btn-primary">Skicka återställningsmail</button>
            <button type="button" onClick={()=>nav('login')} style={{background:'none',border:'none',color:'#8B7B7B',cursor:'pointer',fontFamily:'inherit',fontSize:'0.9rem'}}>Tillbaka till inloggning</button>
          </form>
        )}
      </div>
    </div>
  );
};
const AccountPage = ({ nav }) => {
  const { currentUser, isPremium } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [hiddenMode, setHiddenMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  

  const handleSaveName = async () => {
    if (!displayName.trim()) return;
    setSaving(true);
    try {
      await currentUser.updateProfile({ displayName: displayName.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const handleCancelSubscription = () => {
    window.open('https://billing.stripe.com/p/login/test_00g00000000000', '_blank');
  };

  if (!currentUser) {
    return (
      <div className="page-content">
        <div className="page-hero profile-hero"><h1>Min profil</h1></div>
        <div style={{textAlign:'center',padding:'3rem'}}>
          <button className="btn-primary" onClick={()=>nav('login')}>Logga in</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-hero profile-hero">
        <h1>Min profil</h1>
        <p>Hantera ditt konto och prenumeration</p>
      </div>

      <div style={{maxWidth:'700px',margin:'2rem auto',padding:'0 5%',display:'flex',flexDirection:'column',gap:'1.5rem'}}>

        {/* PLAN */}
        <div style={{background:'white',borderRadius:'20px',padding:'2rem',boxShadow:'var(--shadow-sm)',border:'1px solid var(--border)'}}>
          <h3 style={{fontFamily:'Playfair Display,serif',fontSize:'1.4rem',marginBottom:'1.2rem'}}>Din prenumeration</h3>
          <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.5rem'}}>
            <div style={{
              background: isPremium ? 'linear-gradient(135deg,#D4756F,#C66D67)' : 'linear-gradient(135deg,#7BAF8E,#5a9e7a)',
              color:'white',padding:'0.5rem 1.2rem',borderRadius:'50px',fontWeight:700,fontSize:'0.9rem'
            }}>
              {isPremium ? '💬 Premium' : '🌿 Bas'}
            </div>
            <span style={{color:'var(--text-light)',fontSize:'0.9rem'}}>
              {isPremium ? '369 kr/månad' : '39 kr/månad'}
            </span>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1.5rem'}}>
            <div style={{background:'var(--cream)',borderRadius:'12px',padding:'1rem',textAlign:'center'}}>
              <div style={{fontSize:'1.5rem',fontWeight:700,color:'var(--primary)'}}>
                {isPremium ? '✓' : '—'}
              </div>
              <div style={{fontSize:'0.82rem',color:'var(--text-light)'}}>Terapeut-chatt</div>
            </div>
            <div style={{background:'var(--cream)',borderRadius:'12px',padding:'1rem',textAlign:'center'}}>
              <div style={{fontSize:'1.5rem',fontWeight:700,color:'var(--primary)'}}>✓</div>
              <div style={{fontSize:'0.82rem',color:'var(--text-light)'}}>AI-rådgivning</div>
            </div>
          </div>
          {!isPremium && (
            <button className="btn-primary full-width" onClick={()=>nav('profil')} style={{marginBottom:'0.8rem'}}>
              Uppgradera till Premium — 369 kr/mån
            </button>
          )}
          {isPremium && (
            <button onClick={handleCancelSubscription}
              style={{background:'none',border:'1px solid rgba(212,117,111,0.3)',borderRadius:'50px',padding:'0.7rem 1.5rem',color:'var(--text-light)',cursor:'pointer',fontFamily:'inherit',fontSize:'0.9rem',width:'100%'}}>
              Avsluta prenumeration
            </button>
          )}
        </div>

        {/* PROFIL */}
        <div style={{background:'white',borderRadius:'20px',padding:'2rem',boxShadow:'var(--shadow-sm)',border:'1px solid var(--border)'}}>
          <h3 style={{fontFamily:'Playfair Display,serif',fontSize:'1.4rem',marginBottom:'1.2rem'}}>Profilinformation</h3>
          <div style={{marginBottom:'1.2rem'}}>
            <label style={{fontWeight:600,fontSize:'0.9rem',display:'block',marginBottom:'0.4rem'}}>E-post</label>
            <div style={{padding:'0.85rem 1.2rem',background:'var(--cream)',borderRadius:'12px',color:'var(--text-medium)',fontSize:'0.95rem'}}>
              {currentUser.email}
            </div>
          </div>
          <div style={{marginBottom:'1.2rem'}}>
            <label style={{fontWeight:600,fontSize:'0.9rem',display:'block',marginBottom:'0.4rem'}}>Visningsnamn</label>
            <input
              type="text"
              value={displayName}
              onChange={e=>setDisplayName(e.target.value)}
              placeholder="Vad vill du heta?"
              style={{width:'100%',padding:'0.85rem 1.2rem',border:'2px solid var(--border)',borderRadius:'12px',fontSize:'0.95rem',fontFamily:'inherit',boxSizing:'border-box'}}
            />
          </div>
          <div style={{marginBottom:'1.5rem',display:'flex',alignItems:'center',gap:'1rem',padding:'1rem',background:'var(--cream)',borderRadius:'12px'}}>
            <input type="checkbox" id="hidden" checked={hiddenMode} onChange={e=>setHiddenMode(e.target.checked)}
              style={{width:'18px',height:'18px',cursor:'pointer'}}/>
            <label htmlFor="hidden" style={{cursor:'pointer'}}>
              <div style={{fontWeight:600,fontSize:'0.9rem'}}>👻 Dolt läge i community</div>
              <div style={{fontSize:'0.8rem',color:'var(--text-light)'}}>Dina inlägg visas som "Anonym" istället för ditt namn</div>
            </label>
          </div>
          <button onClick={handleSaveName} disabled={saving} className="btn-primary full-width">
            {saved ? '✓ Sparat!' : saving ? 'Sparar...' : 'Spara ändringar'}
          </button>
        </div>

        {/* STATISTIK */}
        <div style={{background:'white',borderRadius:'20px',padding:'2rem',boxShadow:'var(--shadow-sm)',border:'1px solid var(--border)'}}>
          <h3 style={{fontFamily:'Playfair Display,serif',fontSize:'1.4rem',marginBottom:'1.2rem'}}>Din statistik</h3>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem'}}>
            <div style={{background:'linear-gradient(135deg,rgba(212,117,111,0.08),rgba(232,180,168,0.08))',borderRadius:'14px',padding:'1.2rem',textAlign:'center'}}>
              <div style={{fontSize:'2rem',fontWeight:700,color:'var(--primary)'}}>0</div>
              <div style={{fontSize:'0.8rem',color:'var(--text-light)'}}>Dagar loggade</div>
            </div>
            <div style={{background:'linear-gradient(135deg,rgba(123,175,142,0.08),rgba(160,200,176,0.08))',borderRadius:'14px',padding:'1.2rem',textAlign:'center'}}>
              <div style={{fontSize:'2rem',fontWeight:700,color:'var(--accent)'}}>0</div>
              <div style={{fontSize:'0.8rem',color:'var(--text-light)'}}>Meditationer</div>
            </div>
            <div style={{background:'linear-gradient(135deg,rgba(244,214,204,0.2),rgba(232,180,168,0.1))',borderRadius:'14px',padding:'1.2rem',textAlign:'center'}}>
              <div style={{fontSize:'2rem',fontWeight:700,color:'#E8B4A8)'}}>0</div>
              <div style={{fontSize:'0.8rem',color:'var(--text-light)'}}>Chattar</div>
            </div>
          </div>
        </div>

        {/* LOGGA UT */}
        <div style={{background:'white',borderRadius:'20px',padding:'2rem',boxShadow:'var(--shadow-sm)',border:'1px solid var(--border)'}}>
          <h3 style={{fontFamily:'Playfair Display,serif',fontSize:'1.4rem',marginBottom:'1rem'}}>Konto</h3>
          <button onClick={() => { signOut(auth); nav('home'); }}
            style={{background:'none',border:'2px solid rgba(212,117,111,0.3)',borderRadius:'50px',padding:'0.8rem 2rem',color:'var(--primary)',cursor:'pointer',fontFamily:'inherit',fontWeight:600,fontSize:'0.95rem'}}>
            Logga ut
          </button>
        </div>

      </div>
    </div>
  );
};
const SuccessPage = ({ nav }) => (
  <div style={{minHeight:'80vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem'}}>
    <div style={{background:'#fff',borderRadius:'24px',padding:'3rem',maxWidth:'480px',width:'100%',boxShadow:'0 4px 24px rgba(212,117,111,0.12)',textAlign:'center'}}>
      <div style={{fontSize:'4rem',marginBottom:'1rem'}}>🌸</div>
      <h2 style={{fontFamily:'Playfair Display,serif',fontSize:'2rem',marginBottom:'1rem'}}>Välkommen!</h2>
      <p style={{color:'#5A4F4F',marginBottom:'2rem'}}>Tack för att du valde att investera i din mentala hälsa.</p>
      <button onClick={()=>nav('home')} style={{background:'linear-gradient(135deg,#D4756F,#C66D67)',color:'#fff',border:'none',borderRadius:'50px',padding:'0.9rem 2rem',fontSize:'1rem',fontWeight:600,cursor:'pointer'}}>
        Till startsidan
      </button>
    </div>
    <div style={{display:'flex',gap:'1rem',justifyContent:'center'}}>
      <button className="btn-primary" onClick={() => {
        setShowLimitQuestion(false);
        alert('Tack för din feedback! Vi jobbar på fler alternativ.');
      }}>
        Ja, gärna!
      </button>
      <button className="btn-secondary" onClick={() => setShowLimitQuestion(false)}>
        Nej tack
      </button>
    </div>
  </div>
  );
  }
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
