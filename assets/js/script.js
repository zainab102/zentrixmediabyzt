document.addEventListener('DOMContentLoaded', function () {
    const defaultFormsEndpoint = 'https://formspree.io/f/xaqdlwan';

    const trackFormEvent = (formName) => {
        if (Array.isArray(window.dataLayer)) {
            window.dataLayer.push({ event: 'form_submission', form_name: formName });
        }

        if (typeof window.gtag === 'function') {
            window.gtag('event', 'form_submit', { form_name: formName });
        }
    };

    const setFormStatus = (form, message, type) => {
        const status = form.querySelector('.form-status');
        if (!status) return;

        status.textContent = message;
        status.classList.remove('success', 'error');

        if (type) {
            status.classList.add(type);
        }
    };

    const validateForm = (form) => {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach((field) => {
            const value = typeof field.value === 'string' ? field.value.trim() : '';
            const isEmpty = value.length === 0;

            field.classList.toggle('error', isEmpty);
            if (isEmpty) {
                isValid = false;
            }

            if (field.type === 'email' && !isEmpty) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const emailInvalid = !emailPattern.test(value);
                field.classList.toggle('error', emailInvalid);
                if (emailInvalid) {
                    isValid = false;
                }
            }
        });

        return isValid;
    };

    const submitAjaxForms = () => {
        const forms = document.querySelectorAll('form[data-ajax="true"]');

        forms.forEach((form) => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                if (!validateForm(form)) {
                    setFormStatus(form, 'Please complete all required fields correctly.', 'error');
                    return;
                }

                const submitButton = form.querySelector('button[type="submit"]');
                const formName = form.getAttribute('data-form-name') || 'unknown_form';

                if (submitButton) {
                    submitButton.disabled = true;
                }

                setFormStatus(form, 'Submitting...', null);

                const payload = new FormData(form);
                payload.set('_subject', form.getAttribute('data-subject') || 'New Website Submission');
                const endpoint = form.getAttribute('action') || defaultFormsEndpoint;

                try {
                    const response = await fetch(endpoint, {
                        method: 'POST',
                        body: payload,
                        headers: {
                            Accept: 'application/json'
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Submission failed');
                    }

                    setFormStatus(form, 'Thanks. Your message was sent successfully.', 'success');
                    form.reset();
                    trackFormEvent(formName);
                } catch (error) {
                    setFormStatus(form, 'Submission failed. Please try again or contact us on WhatsApp.', 'error');
                } finally {
                    if (submitButton) {
                        submitButton.disabled = false;
                    }
                }
            });
        });
    };

    const enableSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (!targetId || targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;

                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            });
        });
    };

    const initializeHeadingUnderlines = () => {
        const headings = document.querySelectorAll('[data-heading-underline="true"]');
        if (!headings.length) return;

        headings.forEach((heading) => {
            if (heading.dataset.underlineEnhanced === 'true') return;
            heading.dataset.underlineEnhanced = 'true';

            const span = document.createElement('span');
            while (heading.firstChild) {
                span.appendChild(heading.firstChild);
            }

            span.style.position = 'relative';
            heading.appendChild(span);

            const underline = document.createElement('div');
            underline.classList.add('gold-underline');
            underline.style.position = 'absolute';
            underline.style.bottom = '-10px';
            underline.style.left = '50%';
            underline.style.width = '0';
            underline.style.height = '3px';
            underline.style.backgroundColor = 'var(--accent-gold)';
            underline.style.transition = 'width 0.8s ease, left 0.8s ease';
            span.appendChild(underline);

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    setTimeout(() => {
                        underline.style.width = '80px';
                        underline.style.left = 'calc(50% - 40px)';
                    }, 300);

                    observer.unobserve(entry.target);
                });
            }, { threshold: 0.5 });

            observer.observe(heading);
        });
    };

    const createMobileMenu = () => {
        const header = document.querySelector('.sticky-nav');
        if (!header) return;

        const container = header.querySelector('.container');
        const nav = header.querySelector('nav');
        if (!container || !nav) return;

        if (!nav.id) {
            nav.id = 'site-primary-nav';
        }

        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.classList.add('mobile-menu-btn');
        mobileMenuBtn.type = 'button';
        mobileMenuBtn.setAttribute('aria-label', 'Toggle navigation menu');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-controls', nav.id);
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
        mobileMenuBtn.style.background = 'none';
        mobileMenuBtn.style.border = 'none';
        mobileMenuBtn.style.color = 'var(--accent-gold)';
        mobileMenuBtn.style.fontSize = '1.5rem';
        mobileMenuBtn.style.cursor = 'pointer';
        mobileMenuBtn.style.display = 'none';
        mobileMenuBtn.style.width = '2.85rem';
        mobileMenuBtn.style.height = '2.85rem';
        mobileMenuBtn.style.alignItems = 'center';
        mobileMenuBtn.style.justifyContent = 'center';
        mobileMenuBtn.style.borderRadius = '16px';
        mobileMenuBtn.style.background = 'rgba(59, 130, 246, 0.08)';
        mobileMenuBtn.style.lineHeight = '1';

        container.appendChild(mobileMenuBtn);

        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .sticky-nav .container {
                    display: grid;
                    grid-template-columns: minmax(0, 1fr) auto;
                    align-items: center;
                    gap: 0.85rem 1rem;
                }

                .mobile-menu-btn {
                    display: inline-flex !important;
                    grid-column: 2;
                    justify-self: end;
                    align-self: center;
                }

                .sticky-nav .logo {
                    grid-column: 1;
                    min-width: 0;
                }

                .sticky-nav nav {
                    grid-column: 1 / -1;
                    width: 100%;
                    max-height: 0;
                    overflow: hidden;
                    opacity: 0;
                    pointer-events: none;
                    transition: max-height 0.3s ease, opacity 0.25s ease;
                }

                .sticky-nav nav.open {
                    max-height: 420px;
                    opacity: 1;
                    pointer-events: auto;
                }

                .sticky-nav nav ul {
                    flex-direction: column;
                    align-items: stretch;
                    gap: 0.4rem;
                    padding: 0.95rem 0 0.25rem;
                }

                .sticky-nav nav ul li {
                    width: 100%;
                    margin: 0;
                }

                .sticky-nav nav ul li a {
                    display: flex;
                    justify-content: center;
                    width: 100%;
                    padding: 0.8rem 1rem;
                    border-radius: 18px;
                    text-align: center;
                    background: rgba(255, 255, 255, 0.04);
                }

                .sticky-nav nav ul li a.cta-btn {
                    margin-top: 0.3rem;
                }
            }
        `;

        document.head.appendChild(style);

        const setMenuState = (open) => {
            nav.classList.toggle('open', open);
            mobileMenuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
            mobileMenuBtn.innerHTML = open
                ? '<i class="fas fa-times" aria-hidden="true"></i>'
                : '<i class="fas fa-bars" aria-hidden="true"></i>';
        };

        mobileMenuBtn.addEventListener('click', () => {
            setMenuState(!nav.classList.contains('open'));
        });

        nav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    setMenuState(false);
                }
            });
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && nav.classList.contains('open')) {
                setMenuState(false);
            }
        });

        document.addEventListener('click', (e) => {
            if (!header.contains(e.target) && nav.classList.contains('open')) {
                setMenuState(false);
            }
        });
    };

    const initializeCalendlyEmbed = () => {
        const containers = document.querySelectorAll('[data-calendly-container]');
        if (!containers.length) return;

        containers.forEach((container) => {
            const rawUrl = container.dataset.calendlyUrl;
            const calendlyUrl = typeof rawUrl === 'string' ? rawUrl.trim() : '';
            if (!calendlyUrl) return;

            let url;
            try {
                url = new URL(calendlyUrl);
            } catch (error) {
                return;
            }

            const fallback = container.querySelector('.scheduler-fallback');
            if (fallback) {
                fallback.remove();
            }
            url.searchParams.set('hide_gdpr_banner', '1');
            url.searchParams.set('primary_color', '3b82f6');

            const iframe = document.createElement('iframe');
            iframe.src = url.toString();
            iframe.title = 'Schedule a strategy call with Zentrix Media';
            iframe.loading = 'lazy';
            iframe.referrerPolicy = 'strict-origin-when-cross-origin';

            container.classList.add('is-live');
            container.appendChild(iframe);
        });
    };

    const createNodeDiagram = () => {
        const diagrams = document.querySelectorAll('.node-diagram');
        if (!diagrams.length) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            diagrams.forEach((diagram) => diagram.classList.add('motion-reduced'));
            return;
        }

        const instances = [];

        diagrams.forEach((nodeDiagram) => {
            if (nodeDiagram.dataset.diagramEnhanced === 'true') return;
            nodeDiagram.dataset.diagramEnhanced = 'true';

            const canvas = document.createElement('canvas');
            canvas.classList.add('node-diagram-canvas');
            nodeDiagram.prepend(canvas);

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const nodeColor = nodeDiagram.dataset.nodeColor || 'rgba(59,130,246,0.88)';
            const connectionColor = nodeDiagram.dataset.connectionColor || 'rgba(96,165,250,0.18)';
            const nodes = [];
            let width = 0;
            let height = 0;
            let rafId = null;
            let inView = true;

            class Node {
                constructor() {
                    this.reset(true);
                }

                reset(initial) {
                    this.radius = 2 + Math.random() * 3;
                    this.x = initial ? Math.random() * width : Math.random() > 0.5 ? width + 20 : -20;
                    this.y = Math.random() * height;
                    this.vx = (Math.random() - 0.5) * 0.32;
                    this.vy = (Math.random() - 0.5) * 0.32;
                }

                update() {
                    this.x += this.vx;
                    this.y += this.vy;

                    if (this.x <= 0 || this.x >= width) {
                        this.vx *= -1;
                    }

                    if (this.y <= 0 || this.y >= height) {
                        this.vy *= -1;
                    }
                }

                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fillStyle = nodeColor;
                    ctx.shadowBlur = 14;
                    ctx.shadowColor = nodeColor;
                    ctx.fill();
                    ctx.closePath();
                    ctx.shadowBlur = 0;
                }
            }

            const setCanvasSize = () => {
                const bounds = nodeDiagram.getBoundingClientRect();
                const dpr = window.devicePixelRatio || 1;
                width = Math.max(1, Math.floor(bounds.width));
                height = Math.max(1, Math.floor(bounds.height));

                canvas.width = width * dpr;
                canvas.height = height * dpr;
                canvas.style.width = `${width}px`;
                canvas.style.height = `${height}px`;
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

                if (!nodes.length) {
                    const computedCount = Math.max(8, Math.min(18, Math.round((width * height) / 32000)));
                    const totalNodes = Number(nodeDiagram.dataset.nodeCount) || computedCount;
                    for (let i = 0; i < totalNodes; i += 1) {
                        nodes.push(new Node());
                    }
                    return;
                }

                nodes.forEach((node) => {
                    node.x = Math.min(Math.max(node.x, 0), width);
                    node.y = Math.min(Math.max(node.y, 0), height);
                });
            };

            const draw = () => {
                ctx.clearRect(0, 0, width, height);

                const maxDistance = Math.max(110, Math.min(190, Math.min(width, height) * 0.32));

                nodes.forEach((node) => node.update());

                for (let i = 0; i < nodes.length; i += 1) {
                    for (let j = i + 1; j < nodes.length; j += 1) {
                        const nodeA = nodes[i];
                        const nodeB = nodes[j];
                        const dx = nodeA.x - nodeB.x;
                        const dy = nodeA.y - nodeB.y;
                        const distance = Math.hypot(dx, dy);

                        if (distance > maxDistance) continue;

                        ctx.beginPath();
                        ctx.moveTo(nodeA.x, nodeA.y);
                        ctx.lineTo(nodeB.x, nodeB.y);
                        ctx.strokeStyle = connectionColor;
                        ctx.lineWidth = 1;
                        ctx.globalAlpha = 1 - distance / maxDistance;
                        ctx.stroke();
                        ctx.closePath();
                        ctx.globalAlpha = 1;
                    }
                }

                nodes.forEach((node) => node.draw());
            };

            const animate = () => {
                if (document.hidden || !inView) {
                    rafId = null;
                    return;
                }

                draw();
                rafId = requestAnimationFrame(animate);
            };

            const stopAnimation = () => {
                if (!rafId) return;
                cancelAnimationFrame(rafId);
                rafId = null;
            };

            const startAnimation = () => {
                if (rafId || document.hidden || !inView) return;
                animate();
            };

            setCanvasSize();

            const visibilityObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    inView = entry.isIntersecting;
                    if (inView) {
                        startAnimation();
                    } else {
                        stopAnimation();
                    }
                });
            }, {
                threshold: 0.08
            });

            visibilityObserver.observe(nodeDiagram);
            startAnimation();

            instances.push({
                setCanvasSize,
                startAnimation,
                stopAnimation
            });
        });

        if (!instances.length) return;

        window.addEventListener('resize', () => {
            instances.forEach((instance) => instance.setCanvasSize());
        });

        document.addEventListener('visibilitychange', () => {
            instances.forEach((instance) => {
                if (document.hidden) {
                    instance.stopAnimation();
                } else {
                    instance.startAnimation();
                }
            });
        });
    };

    const initializeCounters = () => {
        const counters = document.querySelectorAll('[data-count]');
        if (!counters.length) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const formatValue = (value, decimals) => {
            if (decimals > 0) {
                return value.toFixed(decimals);
            }

            return Math.round(value).toLocaleString('en-US');
        };

        const animateCounter = (counter) => {
            if (counter.dataset.counted === 'true') return;
            counter.dataset.counted = 'true';

            const endValue = Number(counter.dataset.count || 0);
            const prefix = counter.dataset.prefix || '';
            const suffix = counter.dataset.suffix || '';
            const decimals = Number(counter.dataset.decimals || (Number.isInteger(endValue) ? 0 : 1));
            const render = (value) => {
                counter.textContent = `${prefix}${formatValue(value, decimals)}${suffix}`;
            };

            if (prefersReducedMotion) {
                render(endValue);
                return;
            }

            const duration = 1400;
            let startTime = null;

            const updateCounter = (timestamp) => {
                if (!startTime) {
                    startTime = timestamp;
                }

                const progress = Math.min((timestamp - startTime) / duration, 1);
                const easedProgress = 1 - Math.pow(1 - progress, 3);
                render(endValue * easedProgress);

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    render(endValue);
                }
            };

            requestAnimationFrame(updateCounter);
        };

        if (prefersReducedMotion) {
            counters.forEach((counter) => animateCounter(counter));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.35
        });

        counters.forEach((counter) => observer.observe(counter));
    };

    const initializeCaseStudies = () => {
        document.querySelectorAll('.saas-case-grid').forEach((grid) => {
            const cards = Array.from(grid.querySelectorAll('details'));
            if (!cards.length) return;

            cards.forEach((card) => {
                card.addEventListener('toggle', () => {
                    if (!card.open) return;

                    cards.forEach((otherCard) => {
                        if (otherCard !== card) {
                            otherCard.open = false;
                        }
                    });
                });
            });
        });
    };

    const initializeTestimonialSlider = () => {
        const sections = document.querySelectorAll('.saas-testimonials');
        if (!sections.length) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        sections.forEach((section) => {
            const slides = Array.from(section.querySelectorAll('.testimonial-slide'));
            const dots = Array.from(section.querySelectorAll('.testimonial-dots button'));
            const prevButton = section.querySelector('.testimonial-nav.prev');
            const nextButton = section.querySelector('.testimonial-nav.next');
            if (!slides.length) return;

            let currentIndex = slides.findIndex((slide) => slide.classList.contains('is-active'));
            let autoAdvance = null;

            if (currentIndex < 0) {
                currentIndex = 0;
            }

            const setActiveSlide = (index) => {
                currentIndex = (index + slides.length) % slides.length;

                slides.forEach((slide, slideIndex) => {
                    const isActive = slideIndex === currentIndex;
                    slide.classList.toggle('is-active', isActive);
                    slide.setAttribute('aria-hidden', String(!isActive));
                });

                dots.forEach((dot, dotIndex) => {
                    dot.classList.toggle('is-active', dotIndex === currentIndex);
                });
            };

            const startAutoAdvance = () => {
                if (prefersReducedMotion || slides.length < 2) return;
                autoAdvance = window.setInterval(() => {
                    setActiveSlide(currentIndex + 1);
                }, 5000);
            };

            const stopAutoAdvance = () => {
                if (!autoAdvance) return;
                window.clearInterval(autoAdvance);
                autoAdvance = null;
            };

            prevButton?.addEventListener('click', () => {
                stopAutoAdvance();
                setActiveSlide(currentIndex - 1);
                startAutoAdvance();
            });

            nextButton?.addEventListener('click', () => {
                stopAutoAdvance();
                setActiveSlide(currentIndex + 1);
                startAutoAdvance();
            });

            dots.forEach((dot, dotIndex) => {
                dot.addEventListener('click', () => {
                    stopAutoAdvance();
                    setActiveSlide(dotIndex);
                    startAutoAdvance();
                });
            });

            section.addEventListener('mouseenter', stopAutoAdvance);
            section.addEventListener('mouseleave', startAutoAdvance);

            setActiveSlide(currentIndex);
            startAutoAdvance();
        });
    };

    const initializeFloatingStrategyCTA = () => {
        if (document.querySelector('.floating-strategy-cta')) return;

        const path = window.location.pathname;
        if (
            path.endsWith('/book-call.html') ||
            path === '/book-call.html' ||
            path.endsWith('/contact.html') ||
            path === '/contact.html'
        ) {
            return;
        }

        const isNestedPage = /\/(insights|case-studies)\//.test(path);
        const strategyHref = isNestedPage ? '../book-call.html' : 'book-call.html';
        const floatingCTA = document.createElement('a');
        floatingCTA.className = 'floating-strategy-cta';
        floatingCTA.href = strategyHref;
        floatingCTA.setAttribute('aria-label', 'Book a strategy call');
        floatingCTA.innerHTML = `
            <span class="floating-strategy-copy">
                <strong>Book a Strategy Call</strong>
                <small>30 min growth review</small>
            </span>
            <span class="floating-strategy-icon" aria-hidden="true">
                <i class="fas fa-arrow-up-right-from-square"></i>
            </span>
        `;

        document.body.appendChild(floatingCTA);
        document.body.classList.add('has-floating-cta');

        const mobileQuery = window.matchMedia('(max-width: 768px)');

        const updateFloatingVisibility = () => {
            if (!mobileQuery.matches) {
                floatingCTA.classList.remove('is-mobile-hidden');
                return;
            }

            const revealPoint = Math.max(280, Math.round(window.innerHeight * 0.55));
            floatingCTA.classList.toggle('is-mobile-hidden', window.scrollY < revealPoint);
        };

        updateFloatingVisibility();
        window.addEventListener('scroll', updateFloatingVisibility, { passive: true });
        window.addEventListener('resize', updateFloatingVisibility);
    };

    const initializeMarquee = () => {
        const track = document.querySelector('.marquee-track');
        if (!track || track.dataset.enhanced === 'true') return;

        track.dataset.enhanced = 'true';
        track.innerHTML = `${track.innerHTML}${track.innerHTML}`;
    };

    const revealSections = () => {
        const revealTargets = document.querySelectorAll('[data-reveal], .fade-in');
        if (!revealTargets.length) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            revealTargets.forEach((target) => target.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.18,
            rootMargin: '0px 0px -40px 0px'
        });

        revealTargets.forEach((target) => observer.observe(target));
    };

    revealSections();
    initializeMarquee();
    enableSmoothScroll();
    submitAjaxForms();
    initializeHeadingUnderlines();
    createMobileMenu();
    initializeCalendlyEmbed();
    createNodeDiagram();
    initializeCounters();
    initializeCaseStudies();
    initializeTestimonialSlider();
    initializeFloatingStrategyCTA();
});
