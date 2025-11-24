export function createInfo() {
  const faqs = [
    {
      question: 'What is this?',
      answer: 'This page scans the information your browser exposes automatically. Modern browsers leak dozens of subtle system traits, even without permissions.'
    },
    {
      question: 'Why is this important?',
      answer: 'Fingerprinting lets websites identify a device even without cookies. Many small traits combined create a highly unique profile tied to your browser and hardware.'
    },
    {
      question: 'What can we do about this?',
      answer: 'Use browsers with anti-fingerprinting protections, disable unnecessary APIs, and prefer browsers that reduce entropy. No single setting fixes everything, minimizing identifiable variation is key.'
    }
  ];

  return `
    <section id="info" class="category-section">
      <div class="section-header">
        <i data-lucide="Info"></i>
        <h2>About This Tool</h2>
      </div>
      <div class="accordion">
        ${faqs.map((faq, i) => `
          <div class="accordion-item">
            <button class="accordion-header" aria-expanded="false" data-index="${i}">
              ${faq.question}
            </button>
            <div class="accordion-content" style="display: none;">
              <p>${faq.answer}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

export function initAccordion() {
  const headers = document.querySelectorAll<HTMLButtonElement>('.accordion-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const expanded = header.getAttribute('aria-expanded') === 'true';
      header.setAttribute('aria-expanded', String(!expanded));

      const content = header.nextElementSibling as HTMLElement;
      if (!content) return;

      if (expanded) {
        content.style.display = 'none';
      } else {
        content.style.display = 'block';
      }
    });
  });
}
