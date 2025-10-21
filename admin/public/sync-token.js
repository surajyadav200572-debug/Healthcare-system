// Emergency token sync utility
// Run this in browser console if token sync fails
window.syncTokens = function() {
    const aToken = localStorage.getItem('aToken');
    const dToken = localStorage.getItem('dToken');
    
    console.log('Manual token sync check:');
    console.log('Admin Token:', aToken ? 'Found' : 'Missing');
    console.log('Doctor Token:', dToken ? 'Found' : 'Missing');
    
    if (aToken || dToken) {
        console.log('Reloading page to sync tokens...');
        window.location.reload();
    } else {
        console.log('No tokens found in localStorage');
        console.log('Please login first at http://localhost:5173/login');
    }
}

// Auto-run on load if needed
document.addEventListener('DOMContentLoaded', function() {
    const aToken = localStorage.getItem('aToken');
    const dToken = localStorage.getItem('dToken');
    
    if ((aToken || dToken) && window.location.href.includes('localhost:5174')) {
        // If we have tokens but admin panel shows loading, auto-sync
        setTimeout(() => {
            if (document.body.textContent.includes('Loading') || 
                document.body.textContent.includes('Please wait')) {
                console.log('Auto-syncing tokens due to loading state...');
                window.location.reload();
            }
        }, 2000);
    }
});

console.log('Token sync utility loaded. Run window.syncTokens() if needed.');