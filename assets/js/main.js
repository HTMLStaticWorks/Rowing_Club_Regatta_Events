/**
 * RiverPulse - Main Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Toggle Logic
  const themeToggles = document.querySelectorAll('.theme-toggle');
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
  
  // Check local storage or system preference
  const currentTheme = localStorage.getItem('riverpulse-theme') || 
                       (prefersDarkScheme.matches ? 'dark' : 'light');

  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  const toggleTheme = () => {
    let theme = 'light';
    if (!document.documentElement.hasAttribute('data-theme')) {
      document.documentElement.setAttribute('data-theme', 'dark');
      theme = 'dark';
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('riverpulse-theme', theme);
    updateThemeIcons();
  };

  themeToggles.forEach(btn => btn.addEventListener('click', toggleTheme));

  const updateThemeIcons = () => {
    const isDark = document.documentElement.hasAttribute('data-theme');
    themeToggles.forEach(btn => {
      btn.innerHTML = isDark ? '<i class="ph ph-sun"></i>' : '<i class="ph ph-moon"></i>';
    });
  };
  updateThemeIcons();


  // 2. RTL Toggle Logic
  const rtlToggles = document.querySelectorAll('.rtl-toggle');
  const currentDir = localStorage.getItem('riverpulse-dir') || 'ltr';
  
  if (currentDir === 'rtl') {
    document.documentElement.setAttribute('dir', 'rtl');
  }

  const toggleRTL = () => {
    const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
    const newDir = isRtl ? 'ltr' : 'rtl';
    document.documentElement.setAttribute('dir', newDir);
    localStorage.setItem('riverpulse-dir', newDir);
  };

  rtlToggles.forEach(btn => {
    btn.innerHTML = '<i class="ph ph-arrows-left-right"></i>'; // ↔ icon
    btn.addEventListener('click', toggleRTL);
  });


  // 3. Mobile Nav Drawer Logic
  const mobileToggle = document.querySelector('.mobile-toggle');
  const drawerClose = document.querySelector('.drawer-close');
  const navDrawer = document.querySelector('.nav-drawer');
  const drawerOverlay = document.querySelector('.drawer-overlay');

  const openDrawer = () => {
    navDrawer.classList.add('open');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeDrawer = () => {
    navDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);


  // 4. Scroll Animations (Intersection Observer)
  const animElements = document.querySelectorAll('.animate-fade-in, .animate-slide-up');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const animObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Just let the CSS animation play, or we can trigger it by adding a class
        // Since we defined the animations with forwards, they'll play once visible
        // However, the cleanest way is to add a class when in view.
        
        // For our current CSS, we can control play state by removing a paused class 
        // or adding the actual animation class here. Let's add an "is-visible" class.
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animElements.forEach(el => {
    el.style.animationPlayState = 'paused'; // Pause until scrolled into view
    animObserver.observe(el);
  });


  // 5. Form Validation Scaffolding
  const forms = document.querySelectorAll('form.needs-validation');
  
  forms.forEach(form => {
    form.addEventListener('submit', event => {
      let isValid = true;
      const inputs = form.querySelectorAll('.form-control, .form-check-input');
      
      inputs.forEach(input => {
        if (!input.checkValidity()) {
          isValid = false;
          input.classList.add('is-invalid');
          input.classList.remove('is-valid');
        } else {
          input.classList.remove('is-invalid');
          input.classList.add('is-valid');
        }

        // Custom password match logic
        if (input.name === 'confirm_password') {
          const pwd = form.querySelector('[name="password"]').value;
          if (input.value !== pwd) {
            isValid = false;
            input.classList.add('is-invalid');
          }
        }
      });

      if (!isValid) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        // Prevent default for demo purposes and show success message
        event.preventDefault();
        const successMsg = document.createElement('div');
        successMsg.className = 'alert alert-success';
        successMsg.textContent = 'Form submitted successfully!';
        form.appendChild(successMsg);
      }
    });
  });
});
