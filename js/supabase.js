// supabase.js - Configuration Supabase pour Virtual Market

// Configuration
const SUPABASE_URL = 'https://vpgzcakjnbsttmmzpvar.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwZ3pjYWtqbmJzdHRtbXpwdmFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODM3NTUsImV4cCI6MjA4NzI1OTc1NX0.9s9VN5B9IxFuxxCrSCRb3f4kaUGRMUGR6fHpglQXioQ';

// Création du client Supabase global
window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Vérification que Supabase est bien initialisé
console.log('✅ Supabase client initialisé avec succès');

// Fonctions utilitaires pour le débogage
window.testSupabase = async function() {
    console.log('🔍 Test de connexion Supabase...');
    
    try {
        // Test 1: Vérifier la connexion
        const { data, error } = await window.supabase
            .from('commandes')
            .select('count', { count: 'exact', head: true });
        
        if (error) throw error;
        
        console.log('✅ Connexion Supabase réussie');
        console.log('📊 Tables disponibles: commandes, produits, utilisateurs, communes, etc.');
        
        return { success: true };
        
    } catch (error) {
        console.error('❌ Erreur de connexion:', error.message);
        return { success: false, error: error.message };
    }
};

// Fonction pour obtenir la session courante
window.getCurrentSession = async function() {
    try {
        const { data: { session }, error } = await window.supabase.auth.getSession();
        if (error) throw error;
        
        if (session) {
            console.log('👤 Utilisateur connecté:', session.user.email);
            return session;
        } else {
            console.log('👤 Aucun utilisateur connecté');
            return null;
        }
    } catch (error) {
        console.error('❌ Erreur session:', error);
        return null;
    }
};

// Fonction pour se déconnecter
window.logout = async function() {
    try {
        const { error } = await window.supabase.auth.signOut();
        if (error) throw error;
        
        console.log('✅ Déconnexion réussie');
        window.location.href = 'index.html';
        
    } catch (error) {
        console.error('❌ Erreur déconnexion:', error);
    }
};

// Export des fonctions (si nécessaire)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { supabase: window.supabase };
}
