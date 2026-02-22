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
        const headings = document.querySelectorAll('h2:not(.no-underline)');

        headings.forEach((heading) => {
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

        container.appendChild(mobileMenuBtn);

        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .sticky-nav .container {
                    flex-wrap: wrap;
                }

                .mobile-menu-btn {
                    display: block !important;
                }

                .sticky-nav nav {
                    flex-basis: 100%;
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease;
                }

                .sticky-nav nav.open {
                    max-height: 300px;
                }

                .sticky-nav nav ul {
                    flex-direction: column;
                    align-items: center;
                    padding: 1rem 0;
                }

                .sticky-nav nav ul li {
                    margin: 0.5rem 0;
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

        document.addEventListener('click', (e) => {
            if (!header.contains(e.target) && nav.classList.contains('open')) {
                setMenuState(false);
            }
        });
    };

    const createNodeDiagram = () => {
        const nodeDiagram = document.querySelector('.node-diagram');
        if (!nodeDiagram) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const canvas = document.createElement('canvas');
        canvas.width = nodeDiagram.offsetWidth;
        canvas.height = nodeDiagram.offsetHeight;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        nodeDiagram.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let rafId = null;

        class Node {
            constructor(x, y, radius) {
                this.x = x;
                this.y = y;
                this.radius = radius;
                this.color = 'rgba(198, 167, 94, 0.8)';
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.closePath();
            }
        }

        class Connection {
            constructor(nodeA, nodeB) {
                this.nodeA = nodeA;
                this.nodeB = nodeB;
                this.color = 'rgba(198, 167, 94, 0.3)';
            }

            draw() {
                ctx.beginPath();
                ctx.moveTo(this.nodeA.x, this.nodeA.y);
                ctx.lineTo(this.nodeB.x, this.nodeB.y);
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.closePath();
            }
        }

        const nodes = [];
        const connections = [];
        const numNodes = 8;

        for (let i = 0; i < numNodes; i += 1) {
            nodes.push(new Node(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                3 + Math.random() * 3
            ));
        }

        for (let i = 0; i < nodes.length; i += 1) {
            for (let j = i + 1; j < nodes.length; j += 1) {
                if (Math.random() > 0.5) {
                    connections.push(new Connection(nodes[i], nodes[j]));
                }
            }
        }

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            connections.forEach((connection) => connection.draw());
            nodes.forEach((node) => node.draw());
        };

        const animate = () => {
            draw();
            rafId = requestAnimationFrame(animate);
        };

        const stopAnimation = () => {
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        };

        const startAnimation = () => {
            if (!rafId && !document.hidden) {
                animate();
            }
        };

        startAnimation();

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAnimation();
            } else {
                startAnimation();
            }
        });

        window.addEventListener('resize', () => {
            canvas.width = nodeDiagram.offsetWidth;
            canvas.height = nodeDiagram.offsetHeight;
            draw();
        });
    };

    const updateFooterYear = () => {
        const currentYear = new Date().getFullYear();
        document.querySelectorAll('.footer-bottom p').forEach((node) => {
            node.textContent = `© ${currentYear} Zentrix Media. All rights reserved.`;
        });
    };

    const revealSections = () => {
        document.querySelectorAll('section').forEach((section) => {
            section.classList.add('fade-in');
        });
    };

    revealSections();
    enableSmoothScroll();
    submitAjaxForms();
    initializeHeadingUnderlines();
    createMobileMenu();
    createNodeDiagram();
    updateFooterYear();
});
