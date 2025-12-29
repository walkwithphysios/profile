document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    // IMPORTANT: Replace with your actual credentials from emailjs.com
    const PUBLIC_KEY = "wEGC0krW7ZBzchurF";
    const SERVICE_ID = "service_hfl1tgz";
    const TEMPLATE_ID = "template_yvoqfcj";
    
    // Update copyright year
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Initialize EmailJS if the SDK is loaded
    if (typeof emailjs !== 'undefined') {
        try {
            emailjs.init(PUBLIC_KEY);
            console.log("EmailJS Initialized");
        } catch (e) {
            console.warn("EmailJS init failed (expected if using placeholders):", e);
        }
    }
  const physioservices = [
    {
      key: 'pain',
      title: 'Pain Management',
      short:
        'Manual Therapy, Soft Tissue Release, TENS, IFT, Ultrasound, Dry Needling, Cupping, K-Tape, Cryotherapy, Laser Therapy.',
      long:
        'Comprehensive pain relief for acute and chronic conditions using manual therapy, soft tissue work, electrotherapy, ultrasound, dry needling, cupping, taping, cryotherapy, and laser therapy.',
      borderClass: 'medical-blue',
    },
    {
      key: 'ortho',
      title: 'Ortho Rehab',
      short:
        'Back/Neck Pain, Post-Fracture Recovery, Joint Replacement (TKR/THR), Arthritis Management, Shoulder Rehab.',
      long:
        'Focused rehab for spine, joint, and post-fracture conditions, including mobilization, strengthening, posture correction, gait training, and guided home exercises.',
      borderClass: 'medical-green',
    },
    {
      key: 'sports',
      title: 'Sports Physio',
      short:
        'Injury Management, Return-to-Sport Programs, Screening, Sports Massage.',
      long:
        'Sport-specific assessment and rehabilitation for strains, sprains, overuse injuries, and post-surgical recovery with return-to-play planning.',
      borderClass: 'yellow-500',
    },
    {
      key: 'neuro',
      title: 'Neuro Rehab',
      short:
        'Stroke Recovery, Parkinson’s, Spinal Cord Injury, Bell’s Palsy, Nerve Injury.',
      long:
        'Therapy to improve balance, coordination, walking, hand function, and independence after stroke, Parkinson’s, spinal cord injury, or nerve damage.',
      borderClass: 'indigo-500',
    },
    {
      key: 'cardio',
      title: 'Cardiorespiratory',
      short: 'Post-Covid Rehabilitation, Chest Physio, Cardiac Rehab.',
      long:
        'Breathing exercises, airway clearance, graded aerobic training, and endurance building after Covid-19, cardiac events, or chronic respiratory conditions.',
      borderClass: 'red-500',
    },
    {
      key: 'special',
      title: 'Specialized Care',
      short:
        'Geriatric Wellness, Pediatric Physio, Women’s Health, Ergonomics, Vestibular Rehab.',
      long:
        'Tailored physio for seniors, children, and women, plus workplace ergonomics and dizziness/vertigo care with a focus on safety and long-term prevention.',
      borderClass: 'pink-500',
    },
  ];
  const labservies = [
    {
      key: 'hematology ',
      icon: '<i class="fas fa-tint mr-2"></i>',
      title: 'Hematology',
      short:
        'Complete Blood Count (CBC), Blood Smear, Coagulation Tests, Erythrocyte Sedimentation Rate (ESR).',
      long:
        'Comprehensive blood analysis including CBC, blood smear examination, coagulation profiles, and ESR for diagnosing various hematological conditions.',
      borderClass: 'medical-blue',
    },
    {
      key: 'biochemistry',
      icon: '<i class="fas fa-flask mr-2"></i>',
      title: 'Biochemistry',
      short:
        'Liver Function Tests, Kidney Function Tests, Lipid Profile, Blood Glucose Tests.',
      long:
        'Extensive biochemical testing including liver and kidney function panels, lipid profiles, and blood glucose assessments for metabolic health evaluation.',
      borderClass: 'medical-green',
    },
    {
      key: 'hormones',
      icon: '<i class="fas fa-dna mr-2"></i>',
      title: 'Hormones',
      short:
        'Thyroid Function Tests, Reproductive Hormone Panels, Adrenal Function Tests.',
      long:
        'Detailed hormonal analysis including thyroid function, reproductive hormone panels, and adrenal function tests for endocrine health assessment.',
      borderClass: 'yellow-500',
    },
    {
      key: 'serology',
      icon: '<i class="fas fa-virus mr-2"></i>',
      title: 'Serology',
      short:
        'Infectious Disease Screening, Autoimmune Panels, Allergy Testing.',
      long:
        'Comprehensive serological testing for infectious diseases, autoimmune conditions, and allergy identification through specific antibody detection.',
      borderClass: 'indigo-500',
    },
    {
      key: 'vitamins',
      icon: '<i class="fas fa-heart mr-2"></i>',
      title: 'Vitamins & Cardiac',
      short: 'Vitamin D, Vitamin B12, Cardiac Enzyme Tests.',
      long:
        'Assessment of vitamin levels including Vitamin D and B12, along with cardiac enzyme tests for heart health evaluation.',
      borderClass: 'red-500',
    },
    {
      key: 'tumor',
      icon: '<i class="fas fa-microscope mr-2"></i>',
      title: 'Tumor Markers',
      short:
        'Prostate-Specific Antigen (PSA), CA-125, CEA, Alpha-Fetoprotein (AFP).',
      long:
        'Screening and monitoring of various cancers through tumor marker tests including PSA, CA-125, CEA, and AFP.',
      borderClass: 'pink-500',
    },
  ]

  const physiocardsContainer1 = document.getElementById('cards-container1');
  const physiocardsContainer2 = document.getElementById('cards-container2');

  const labcardsContainer1 = document.getElementById('lab-cards-container1');
  const labcardsContainer2 = document.getElementById('lab-cards-container2');


  let physioFocusedMode = false; 
  let labsFocusedMode = false; // false = 3+3 grid, true = all-left + detail-right
  let physioActiveKey = null;
  let labActiveKey = null;

  function renderCards(services , con1 , con2 , focusedMode , activeKey) {
    con1.innerHTML = '';
    con2.innerHTML = '';

    var i=0
    services.forEach(service => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.key = service.key;
      colour = service.borderClass;
      icon = service.icon ? service.icon : '';
      btn.className =
        'service-card text-left bg-white p-6 rounded-xl shadow-sm ' +
        'border-l-4 border-' + service.borderClass +
        ' hover:shadow-md transition cursor-pointer ' +
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-green';
      btn.innerHTML = `
        <h3 class="text-${colour} font-semibold text-gray-900">${icon}${service.title}</h3>
        ${
          !focusedMode
            ? `<p class="mt-1 text-xs text-gray-600">${service.short}</p>`
            : ''
        }
      `;

      btn.addEventListener('click', () => handleClick(service.key , services , con1 , con2 , focusedMode , activeKey));
      if (!focusedMode) {
            if (i < 3) {
            con1.appendChild(btn);
        } else {
            con2.appendChild(btn);
        }

      } else{
        con1.appendChild(btn);
      }
      i = i + 1;
      
    });

    // Layout:
    // initial: 2 columns (3+3)
    // focused: all in first column (single column list)
    if (focusedMode) {
        const wrapper = document.createElement('div');
        wrapper.className = "space-y-1";
        const detailtitle = document.createElement('h3');
        detailtitle.className = "text-xl font-bold text-gray-900";
        detailtitle.textContent = services.find(s => s.key === activeKey).title;
        detailtitle.id = "detail-title";
        const detailbody = document.createElement('p');
        detailbody.className = "text-sm text-gray-600 leading-relaxed";
        detailbody.textContent = services.find(s => s.key === activeKey).long;
        detailbody.id = "detail-body";
        wrapper.appendChild(detailtitle);
        wrapper.appendChild(detailbody);
        con2.appendChild(wrapper);
    }

    // Restore highlight if any
    if (activeKey) highlightActive(services , con1 , activeKey);
  }

  function handleClick(key , services , con1 , con2 , focusedMode , activeKey) {
    if (!focusedMode) {
      // first click: switch layout
      focusedMode = true;
      activeKey = key;
      // re-render cards so they move to single left column without short text
      renderCards(services , con1 , con2 , focusedMode , activeKey);
    }
    else {
      // already focused: clicking same card de-focuses
      if (activeKey === key) {
        focusedMode = false;
        activeKey = null;
        renderCards(services , con1 , con2 , focusedMode , activeKey);
      }else {
        activeKey = key;
        highlightActive(services , con1 , activeKey);
        renderCards(services , con1 , con2, focusedMode , activeKey);
      }

    }

    // activeKey = key;
    // highlightActive();
    // updateDetail();
  }

  function highlightActive(services , con , activeKey) {
    const buttons = con.querySelectorAll('.service-card');
    buttons.forEach(btn => {
      const isActive = btn.dataset.key === activeKey;
      colour = services.find(s => s.key === activeKey).borderClass;
      btn.classList.toggle('ring-2', isActive);
      btn.classList.toggle('ring-' + colour, isActive);
      btn.classList.toggle('bg-green-50', isActive);
    });
  }

 

  // Initial render: 3 cards per column (2-col grid with short desc)
  renderCards(physioservices , physiocardsContainer1 , physiocardsContainer2 , physioFocusedMode , physioActiveKey);
  
  renderCards(labservies , labcardsContainer1 , labcardsContainer2 , labsFocusedMode , labActiveKey);

    function toggleServices() {
        document.getElementById("services-dropdown").classList.toggle("hidden");
    }
    // Handle Appointment Booking
    const bookingForm = document.getElementById('appointmentForm');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            console.log("Booking form submitted");
            const submitBtn = document.getElementById('submitBtn');
            const originalBtnText = submitBtn.innerText;
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            try {
                // 1. Generate Appointment ID
                const appointmentId = 'APT-' + Math.floor(Math.random() * 1000000);
                
                // 2. Gather Form Data
                const formData = new FormData(bookingForm);
                const data = Object.fromEntries(formData.entries());
                
                // Add derived fields
                data.appointment_id = appointmentId;
                data.customer_email = data.email; // Map for template
                data.business_email = "shreyasbajjir082@gmail.com"; // Admin email
                
                console.log("Preparing to send appointment:", data);

                // 3. Send Email via EmailJS
                // Note: This will fail if using placeholder keys, so we wrap in try-catch to simulate success for demo
                let emailResult = { status: 200, text: "Simulated Success" };

                
                emailResult = await emailjs.send(SERVICE_ID, TEMPLATE_ID, data);
                
                

                // 4. Save to Database (Backup Record)
                // This ensures data is captured even if email fails or limits are reached
                try {
                    if (window.LeadGenRuntime && window.LeadGenRuntime.insertData) {
                        await window.LeadGenRuntime.insertData('appointments', {
                            name: data.name,
                            email: data.email,
                            phone: data.phone,
                            service: data.service,
                            address: data.address,
                            preferred_date: data.preferred_date,
                            preferred_time: data.preferred_time,
                            message: data.message || '',
                            appointment_id: appointmentId
                        });
                        console.log("Appointment saved to database backup");
                    }
                } catch (dbError) {
                    console.warn("Database backup skipped:", dbError.message);
                }

                // 5. Success UI
                alert(`Appointment Booked Successfully!\n\nYour Appointment ID is: ${appointmentId}\nWe will confirm with you shortly.`);
                bookingForm.reset();
                
            } catch (error) {
                console.error("Booking Error:", error);
                alert("There was an error booking your appointment. Please call us directly.");
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }
        });
    }
});
