// YENİ EKLENEN BİLDİRİM FONKSİYONU
function showNotification(type, message) {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️'
  };
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <span class="notification-icon">${icons[type]}</span>
    ${message}
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  const page = location.pathname.split('/').pop();

  const themeBtns = document.querySelectorAll('#theme-toggle');
  themeBtns.forEach(btn =>
    btn.addEventListener('click', () => {
      const root = document.documentElement;
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
    })
  );

  if (page === 'ilac_otomasyonu.html') {
    const form = document.getElementById('login-form');
    const codeInput = document.getElementById('code-input');
    const tcInput = document.getElementById('tc-input');
    const reportBtn = document.getElementById('report');

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const code = codeInput.value.trim();
      const tc = tcInput.value.trim();

      if (code && !tc) {
        try {
          const res = await fetch('/api/login/prescription', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ code })
          });
          const data = await res.json();
          if (!res.ok) return showNotification('error', data.error);

          localStorage.setItem('prescriptionDrugs', JSON.stringify(data.drugs));
          location.href = 'index2.html';
        } catch {
          showNotification('error', 'Sunucu hatası, lütfen tekrar deneyin.');
        }
      }
      else if (tc && !code) {
        try {
          const res = await fetch('/api/login/without-prescription', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ tc })
          });
          const data = await res.json();
          if (!res.ok) return showNotification('error', data.error);

          location.href = 'index4.html';
        } catch {
          showNotification('error', 'Sunucu hatası, lütfen tekrar deneyin.');
        }
      }
      else {
        showNotification('warning', 'Lütfen ya kod ya da TC girin, ikisini birlikte doldurmayın.');
      }
    });

    reportBtn.addEventListener('click', () => {
      const txt = document.getElementById('report-text').value.trim();
      if (!txt) return showNotification('warning', 'Lütfen önce sorun/isteğinizi yazın.');
      showNotification('success', 'Şikayetiniz iletildi: ' + txt);
      document.getElementById('report-text').value = '';
    });
  }

  if (page === 'index4.html') {
    const form = document.querySelector('.medicine-form');
    const selects = form.querySelectorAll('select');
    const btnOk = form.querySelector('button[type="submit"]');
    const btnClr = form.querySelector('button[type="reset"]');

    btnOk.addEventListener('click', e => {
      e.preventDefault();
      const any = Array.from(selects).some(s => s.value);
      if (!any) return showNotification('warning', 'Lütfen en az bir ilaç seçiniz.');
      showNotification('success', 'İşleminiz başarılı. Otomattan ilacınızı alabilirsiniz.');
      form.reset();
    });

    btnClr.addEventListener('click', e => {
      const any = Array.from(selects).some(s => s.value);
      if (!any) {
        e.preventDefault();
        return showNotification('warning', 'İlaç seçmeden silme işlemi yapılamaz.');
      }
    });
  }

  if (page === 'index2.html') {
    const container = document.getElementById('presc-list');
    container.innerHTML = '';

    const drugs = JSON.parse(localStorage.getItem('prescriptionDrugs') || '[]');
    const unique = drugs.filter((d,i,a) => a.findIndex(x=>x.ad===d.ad)===i);

    unique.forEach((d, idx) => {
      const card = document.createElement('div');
      card.className = 'ilac-karti';
      card.dataset.index = idx;
      card.innerHTML = `
        <h3>${d.ad}</h3>
        <p>SKT: ${d.skt}</p>
        <p>${d.kullanim_talimati}</p>
        <button class="sil-butonu">Sil</button>
      `;
      container.appendChild(card);

      card.querySelector('.sil-butonu').addEventListener('click', () => {
        card.remove();
        const arr = JSON.parse(localStorage.getItem('prescriptionDrugs') || '[]');
        arr.splice(arr.findIndex(x=>x.ad===d.ad), 1);
        localStorage.setItem('prescriptionDrugs', JSON.stringify(arr));
      });
    });

    document.getElementById('presc-confirm').addEventListener('click', () => {
      showNotification('success', 'İşleminiz başarılı. Otomattan ilacınızı alabilirsiniz.');
      localStorage.removeItem('prescriptionDrugs');
      location.href = 'ilac_otomasyonu.html';
    });
  }
});