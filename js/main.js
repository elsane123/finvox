/**
 * FinVox Landing Page — Interactions & Animations
 * Vanilla JavaScript — Zero dependencies
 */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        initHeader();
        initMobileNav();
        initSmoothScroll();
        initScrollAnimations();
        initFAQ();
        initPricingToggle();
        initForms();
    });

    /* ---- 1. Header scroll effect ---- */
    function initHeader() {
        var header = document.getElementById('header');
        if (!header) return;
        function onScroll() {
            header.classList.toggle('header--scrolled', window.pageYOffset > 50);
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ---- 2. Mobile Navigation ---- */
    function initMobileNav() {
        var toggle = document.getElementById('navToggle');
        var menu = document.getElementById('navMenu');
        if (!toggle || !menu) return;

        function closeMenu() {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        }

        toggle.addEventListener('click', function () {
            var isOpen = menu.classList.contains('active');
            if (isOpen) {
                closeMenu();
            } else {
                toggle.classList.add('active');
                menu.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });

        // Close on link click
        menu.querySelectorAll('.nav__link').forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });

        // Close on outside click
        document.addEventListener('click', function (e) {
            if (menu.classList.contains('active') &&
                !menu.contains(e.target) &&
                !toggle.contains(e.target)) {
                closeMenu();
            }
        });
    }

    /* ---- 3. Smooth Scroll ---- */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var id = this.getAttribute('href');
                if (id === '#') return;
                var target = document.querySelector(id);
                if (!target) return;
                e.preventDefault();
                var headerH = document.getElementById('header').offsetHeight;
                var top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 20;
                window.scrollTo({ top: top, behavior: 'smooth' });
            });
        });
    }

    /* ---- 4. Scroll Animations (Intersection Observer) ---- */
    function initScrollAnimations() {
        var els = document.querySelectorAll('.fade-in');
        if (!els.length) return;

        // Fallback for old browsers
        if (!('IntersectionObserver' in window)) {
            els.forEach(function (el) { el.classList.add('visible'); });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    // Stagger animation for siblings
                    var parent = entry.target.parentElement;
                    var siblings = parent ? parent.querySelectorAll('.fade-in') : [];
                    var idx = Array.prototype.indexOf.call(siblings, entry.target);
                    var delay = Math.min(idx * 100, 400);
                    setTimeout(function () {
                        entry.target.classList.add('visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        els.forEach(function (el) { observer.observe(el); });
    }

    /* ---- 5. FAQ Accordion ---- */
    function initFAQ() {
        var items = document.querySelectorAll('.faq__item');
        if (!items.length) return;

        items.forEach(function (item) {
            var btn = item.querySelector('.faq__question');
            if (!btn) return;
            btn.addEventListener('click', function () {
                var isActive = item.classList.contains('active');
                // Close all others
                items.forEach(function (other) {
                    if (other !== item) {
                        other.classList.remove('active');
                        var ob = other.querySelector('.faq__question');
                        if (ob) ob.setAttribute('aria-expanded', 'false');
                    }
                });
                // Toggle current
                item.classList.toggle('active');
                btn.setAttribute('aria-expanded', !isActive ? 'true' : 'false');
            });
        });
    }

    /* ---- 6. Pricing Toggle (Monthly / Yearly) ---- */
    function initPricingToggle() {
        var toggle = document.getElementById('pricingToggle');
        if (!toggle) return;

        var labels = document.querySelectorAll('.pricing__toggle-label');
        var amounts = document.querySelectorAll('.pricing-card__amount[data-monthly]');
        var periods = document.querySelectorAll('.pricing-card__period[data-monthly]');
        var isYearly = false;

        function update() {
            var p = isYearly ? 'yearly' : 'monthly';
            toggle.classList.toggle('active', isYearly);

            // Update active label
            labels.forEach(function (l) {
                l.classList.toggle('pricing__toggle-label--active',
                    l.getAttribute('data-period') === p);
            });

            // Animate price change
            amounts.forEach(function (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(-10px)';
                setTimeout(function () {
                    el.textContent = el.getAttribute('data-' + p);
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 150);
            });

            // Update period text
            periods.forEach(function (el) {
                el.textContent = el.getAttribute('data-' + p);
            });
        }

        toggle.addEventListener('click', function () {
            isYearly = !isYearly;
            update();
        });

        // Allow clicking labels too
        labels.forEach(function (l) {
            l.addEventListener('click', function () {
                isYearly = l.getAttribute('data-period') === 'yearly';
                update();
            });
        });

        // Smooth transitions on amounts
        amounts.forEach(function (el) {
            el.style.transition = 'opacity .15s ease, transform .15s ease';
        });
    }

    /* ---- 7. Form Handling ---- */
    function initForms() {
        document.querySelectorAll('.hero__form').forEach(function (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                var input = form.querySelector('.hero__input');
                var btn = form.querySelector('.hero__btn');
                if (!input || !btn) return;

                var email = input.value.trim();

                // Validation
                if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    input.style.borderColor = '#c62828';
                    input.style.animation = 'shake .4s ease';
                    setTimeout(function () { input.style.animation = ''; }, 400);
                    return;
                }

                // Success feedback
                var original = btn.innerHTML;
                btn.innerHTML = '✓ Inscription envoyée !';
                btn.style.background = 'linear-gradient(135deg, #2e7d32, #388e3c)';
                btn.disabled = true;
                input.value = '';
                input.style.borderColor = '#2e7d32';

                // Reset after 3s
                setTimeout(function () {
                    btn.innerHTML = original;
                    btn.style.background = '';
                    btn.disabled = false;
                    input.style.borderColor = '';
                }, 3000);
            });
        });
    }

    /* ---- Inject shake keyframes ---- */
    var style = document.createElement('style');
    style.textContent = '@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}';
    document.head.appendChild(style);

})();
