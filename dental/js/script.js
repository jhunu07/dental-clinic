
/**
 * DentaCare India - INTERACTIVE APPLICATION SCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Navigation & Sticky Navbar
       ========================================================================== */
    const navbar = id('navbar');
    const hamburgerBtn = id('hamburger-btn');
    const navMenu = id('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    const scrollTopBtn = id('scroll-top-btn');

    // Sticky shadow effect on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (scrollTopBtn) {
            scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
        }

        // Highlight active nav item based on scroll position
        const scrollPos = window.scrollY + 120;
        document.querySelectorAll('section[id]').forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const idVal = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${idVal}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                toggle.closest('.has-dropdown').classList.toggle('open');
            }
        });
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.has-dropdown')) {
            document.querySelectorAll('.has-dropdown.open').forEach(item => item.classList.remove('open'));
        }
    });

    // Mobile menu toggle
    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const isExpanded = navMenu.classList.contains('active');
            hamburgerBtn.innerHTML = isExpanded ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburgerBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
            });
        });
    }

    /* ==========================================================================
       2. Service Category Tabs Filter
       ========================================================================== */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');

            serviceCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                if (category === 'all' || cardCat === category) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    /* ==========================================================================
       3. Animated Stats Counters
       ========================================================================== */
    const statCounters = document.querySelectorAll('.stat-number');

    const animateCounter = (element) => {
        const target = parseFloat(element.dataset.target || '0');
        const decimals = parseInt(element.dataset.decimals || '0', 10);
        const suffix = element.dataset.suffix || '';
        const duration = 1400;
        const startTime = performance.now();

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const value = target * progress;
            const formatted = Number(value).toFixed(decimals);
            element.textContent = `${Number(formatted).toLocaleString()}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                const finalValue = target.toFixed(decimals);
                element.textContent = `${Number(finalValue).toLocaleString()}${suffix}`;
            }
        };

        requestAnimationFrame(step);
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    statCounters.forEach(counter => statsObserver.observe(counter));

    /* ==========================================================================
       4. Interactive Treatment Cost & Duration Estimator
       ========================================================================== */
    const calcProcedure = id('calc-procedure');
    const calcComplexity = id('calc-complexity');
    const resDuration = id('res-duration');
    const resVisits = id('res-visits');
    const resPrice = id('res-price');

    const procedureData = {
        whitening: {
            duration: '45 - 60 Mins',
            visits: '1 Visit',
            basePrice: { standard: 8000, moderate: 12000, advanced: 15000 }
        },
        veneers: {
            duration: '90 - 120 Mins',
            visits: '2 - 3 Visits',
            basePrice: { standard: 15000, moderate: 20000, advanced: 25000 }
        },
        invisalign: {
            duration: '30 Mins (Per Check)',
            visits: '6 - 18 Months',
            basePrice: { standard: 150000, moderate: 250000, advanced: 350000 }
        },
        implant: {
            duration: '60 - 90 Mins',
            visits: '2 - 3 Visits',
            basePrice: { standard: 35000, moderate: 45000, advanced: 60000 }
        },
        rootcanal: {
            duration: '60 - 90 Mins',
            visits: '1 - 2 Visits',
            basePrice: { standard: 5000, moderate: 8000, advanced: 12000 }
        },
        cleaning: {
            duration: '45 Mins',
            visits: '1 Visit',
            basePrice: { standard: 1500, moderate: 2500, advanced: 4000 }
        }
    };

    function updateEstimator() {
        if (!calcProcedure || !calcComplexity) return;
        const procKey = calcProcedure.value;
        const compKey = calcComplexity.value;
        const data = procedureData[procKey];

        if (data) {
            resDuration.textContent = data.duration;
            resVisits.textContent = data.visits;
            const cost = data.basePrice[compKey];
            resPrice.textContent = `₹${cost.toLocaleString('en-IN')} - ₹${Math.round(cost * 1.25).toLocaleString('en-IN')}`;
        }
    }

    if (calcProcedure && calcComplexity) {
        calcProcedure.addEventListener('change', updateEstimator);
        calcComplexity.addEventListener('change', updateEstimator);
        updateEstimator(); // Initialize
    }

    /* ==========================================================================
       5. Interactive Appointment Booking Modal
       ========================================================================== */
    const bookingModal = id('booking-modal');
    const openModalBtns = document.querySelectorAll('.open-booking-modal');
    const closeModalBtn = id('modal-close-btn');
    const modalServiceSelect = id('modal-service');
    const fullBookingForm = id('full-booking-form');
    const bookingSuccessView = id('booking-success-view');
    const successCloseBtn = id('success-close-btn');

    // Open Modal
    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const preSelectService = btn.getAttribute('data-service');

            if (modalServiceSelect && preSelectService) {
                for (let i = 0; i < modalServiceSelect.options.length; i++) {
                    if (modalServiceSelect.options[i].value.toLowerCase().includes(preSelectService.toLowerCase()) ||
                        modalServiceSelect.options[i].text.toLowerCase().includes(preSelectService.toLowerCase())) {
                        modalServiceSelect.selectedIndex = i;
                        break;
                    }
                }
            }

            resetBookingModal();
            bookingModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close Modal
    function closeModal() {
        bookingModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (successCloseBtn) successCloseBtn.addEventListener('click', closeModal);

    // Close on overlay click
    bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) closeModal();
    });

    // Multi-Step Form Navigation
    const nextStepBtns = document.querySelectorAll('.next-step-btn');
    const prevStepBtns = document.querySelectorAll('.prev-step-btn');

    nextStepBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const nextStep = btn.getAttribute('data-next');

            // Simple validation before step 2
            if (nextStep === '2') {
                if (!modalServiceSelect.value) {
                    showToast('Please select a treatment service to proceed.', 'warning');
                    modalServiceSelect.focus();
                    return;
                }
            }

            // Simple validation before step 3
            if (nextStep === '3') {
                const dateVal = id('modal-date').value;
                if (!dateVal) {
                    showToast('Please select a preferred date.', 'warning');
                    id('modal-date').focus();
                    return;
                }
            }

            goToStep(nextStep);
        });
    });

    prevStepBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const prevStep = btn.getAttribute('data-prev');
            goToStep(prevStep);
        });
    });

    function goToStep(stepNum) {
        document.querySelectorAll('.booking-step-content').forEach(content => content.classList.remove('active'));
        document.querySelectorAll('.step-badge').forEach(badge => badge.classList.remove('active'));

        const targetStep = id(`booking-step-${stepNum}`);
        const targetBadge = id(`step-badge-${stepNum}`);

        if (targetStep) targetStep.classList.add('active');
        if (targetBadge) targetBadge.classList.add('active');
    }

    function resetBookingModal() {
        goToStep('1');
        if (fullBookingForm) fullBookingForm.reset();
        if (fullBookingForm) fullBookingForm.style.display = 'block';
        if (bookingSuccessView) bookingSuccessView.classList.remove('active');
        document.querySelector('.booking-steps-indicator').style.display = 'flex';
    }

    // Modal Form Submission
    if (fullBookingForm) {
        fullBookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const patientName = id('patient-name').value;
            const patientPhone = id('patient-phone').value;
            const patientEmail = id('patient-email').value;
            const serviceVal = modalServiceSelect.options[modalServiceSelect.selectedIndex].text;
            const doctorVal = id('modal-doctor').value;
            const dateVal = id('modal-date').value;
            const timeSlotVal = document.querySelector('input[name="timeslot"]:checked')?.value || '10:00 AM';

            // Generate Random Ref Number
            const refNum = '#DentaCare-' + Math.floor(1000 + Math.random() * 9000);

            // Populate Success View
            id('conf-name').textContent = patientName;
            id('conf-ref').textContent = refNum;
            id('conf-service').textContent = serviceVal;
            id('conf-doctor').textContent = doctorVal;
            id('conf-datetime').textContent = `${dateVal} at ${timeSlotVal}`;

            // Toggle view
            fullBookingForm.style.display = 'none';
            document.querySelector('.booking-steps-indicator').style.display = 'none';
            bookingSuccessView.classList.add('active');

            showToast(`Appointment confirmed! Booking Ref: ${refNum}`, 'success');
        });
    }

    /* ==========================================================================
       6. Quick Booking Form in Hero
       ========================================================================== */
    const quickForm = id('quick-form');
    if (quickForm) {
        quickForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const service = id('quick-service').value;
            const date = id('quick-date').value;
            const phone = id('quick-phone').value;

            if (!service || !date || !phone) {
                showToast('Please fill out all fields in the quick booking form.', 'warning');
                return;
            }

            showToast('Slot reserved! Opening details confirmation...', 'success');

            // Transfer to main modal
            setTimeout(() => {
                resetBookingModal();
                if (id('modal-date')) id('modal-date').value = date;
                if (id('patient-phone')) id('patient-phone').value = phone;
                bookingModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }, 800);
        });
    }

    /* ==========================================================================
       7. FAQ Accordion Toggle
       ========================================================================== */
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const faqAnswer = faqItem.querySelector('.faq-answer');

            // Close other items
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                    const ans = item.querySelector('.faq-answer');
                    if (ans) ans.style.maxHeight = null;
                }
            });

            // Toggle current
            faqItem.classList.toggle('active');
            if (faqItem.classList.contains('active')) {
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
            } else {
                faqAnswer.style.maxHeight = null;
            }
        });
    });

    /* ==========================================================================
       8. Reviews Page Filters
       ========================================================================== */
    const galleryTabs = document.querySelectorAll('.gallery-tab');
    const galleryCards = document.querySelectorAll('.ba-card');
    const beforeAfterRanges = document.querySelectorAll('.ba-range');

    beforeAfterRanges.forEach(range => {
        const sliderCard = range.closest('.ba-slider-card');
        if (!sliderCard) return;

        const updateReveal = () => {
            sliderCard.style.setProperty('--reveal', `${range.value}%`);
        };

        range.addEventListener('input', updateReveal);
        updateReveal();
    });

    galleryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetGallery = tab.getAttribute('data-gallery');

            galleryTabs.forEach(item => item.classList.remove('active'));
            tab.classList.add('active');

            galleryCards.forEach(card => {
                const cardGallery = card.getAttribute('data-gallery-type');
                card.classList.toggle('is-hidden', targetGallery !== 'all' && cardGallery !== targetGallery);
            });
        });
    });

    const reviewFilters = document.querySelectorAll('.review-filter');
    const reviewCards = document.querySelectorAll('.testimonial-card[data-review-type]');

    reviewFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            const reviewType = filter.getAttribute('data-review-filter');

            reviewFilters.forEach(item => item.classList.remove('active'));
            filter.classList.add('active');

            reviewCards.forEach(card => {
                const cardType = card.getAttribute('data-review-type');
                card.classList.toggle('is-hidden', reviewType !== 'all' && cardType !== reviewType);
            });
        });
    });

    /* ==========================================================================
       9. Newsletter Subscription Form
       ========================================================================== */
    const newsletterForm = id('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Thank you for subscribing to DentaCare India updates!', 'success');
            newsletterForm.reset();
        });
    }

    /* ==========================================================================
       10. Toast Notification Utility
       ========================================================================== */
    function showToast(message, type = 'info') {
        let toastContainer = id('toast-container');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = 'toast';

        let iconClass = 'fa-circle-info';
        if (type === 'success') iconClass = 'fa-circle-check';
        if (type === 'warning') iconClass = 'fa-triangle-exclamation';

        toast.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span>${message}</span>`;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s reverse forwards';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // Helper Selector Function
    function id(elemId) {
        return document.getElementById(elemId);
    }

});
