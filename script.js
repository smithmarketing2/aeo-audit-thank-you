// AEO Audit Thank You Page - JavaScript

(function() {
    'use strict';

    // URL Parameter Parser
    function getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        const data = {};
        for (const [key, value] of params) {
            data[key] = decodeURIComponent(value);
        }
        return data;
    }

    // Personalization
    function personalizePage() {
        const params = getUrlParams();
        
        // Personalize headline with name
        if (params.name) {
            const headline = document.getElementById('headline');
            if (headline) {
                const firstName = params.name.split(' ')[0];
                headline.innerHTML = `Success! Your AEO Website Audit is on Its Way, ${firstName}`;
            }
        }

        // Track source and campaign
        if (params.source || params.campaign || params.utm_source) {
            const source = params.source || params.utm_source;
            const campaign = params.campaign || params.utm_campaign;
            
            console.log('Traffic Source:', source);
            console.log('Campaign:', campaign);
            
            // Store in localStorage for persistence
            if (source) localStorage.setItem('traffic_source', source);
            if (campaign) localStorage.setItem('campaign', campaign);
            
            // Track with pixels
            if (typeof fbq !== 'undefined') {
                fbq('trackCustom', 'LeadSource', {
                    source: source,
                    campaign: campaign
                });
            }
        }

        // Pre-fill email references if provided
        if (params.email) {
            localStorage.setItem('user_email', params.email);
        }
    }

    // Button Click Tracking
    function initButtonTracking() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const buttonText = this.textContent.trim();
                const buttonId = this.id || 'unnamed-button';
                const href = this.getAttribute('href') || '';
                
                // Google Analytics 4 event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'click', {
                        event_category: 'thank_you_page',
                        event_label: buttonText,
                        button_id: buttonId,
                        destination: href
                    });
                }

                // Meta Pixel event
                if (typeof fbq !== 'undefined') {
                    fbq('trackCustom', 'ThankYouCTAClick', {
                        button_text: buttonText,
                        button_id: buttonId,
                        destination: href
                    });
                }

                console.log('Button clicked:', buttonText, '→', href);
            });
        });
    }

    // Track time on page
    function initEngagementTracking() {
        let timeOnPage = 0;
        const engagementInterval = setInterval(() => {
            timeOnPage += 10;
            
            // Track engagement milestones
            if (timeOnPage === 30) { // 30 seconds
                if (typeof fbq !== 'undefined') {
                    fbq('trackCustom', 'Engagement30s');
                }
            }
            
            if (timeOnPage === 60) { // 1 minute
                if (typeof fbq !== 'undefined') {
                    fbq('trackCustom', 'Engagement1m');
                }
                clearInterval(engagementInterval);
            }
        }, 10000); // Check every 10 seconds

        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                // Track scroll milestones
                if (maxScroll === 25 || maxScroll === 50 || maxScroll === 75 || maxScroll === 100) {
                    if (typeof fbq !== 'undefined') {
                        fbq('trackCustom', 'ScrollDepth', { percent: maxScroll });
                    }
                }
            }
        });
    }

    // Notification Toast
    function showNotification(message, type = 'success') {
        const existingToast = document.querySelector('.notification-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'notification-toast';
        toast.textContent = message;
        
        const bgColor = type === 'success' ? '#10b981' : '#ef4444';
        
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${bgColor};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 1000;
            animation: slideUp 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideDown 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from { transform: translate(-50%, 100%); opacity: 0; }
            to { transform: translate(-50%, 0); opacity: 1; }
        }
        @keyframes slideDown {
            from { transform: translate(-50%, 0); opacity: 1; }
            to { transform: translate(-50%, 100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Initialize everything when DOM is ready
    function init() {
        personalizePage();
        initButtonTracking();
        initEngagementTracking();

        console.log('AEO Audit Thank You Page initialized');
        
        // Track page view
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead');
        }
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: 'AEO Audit Thank You',
                page_location: window.location.href
            });
        }
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose utility functions globally
    window.AEOThankYou = {
        getUrlParams,
        showNotification
    };

})();
