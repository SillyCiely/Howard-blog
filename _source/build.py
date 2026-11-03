#!/usr/bin/env python3
"""Generates the static Dr Howard Fan site into ../dist.
Shared header/footer live here so every page stays consistent.
Run:  python3 build.py
"""
import json
from html import escape
from pathlib import Path

DIST = Path(__file__).resolve().parent.parent  # the site folder
BASE_URL = "https://www.drfan.com.au/"
PHONE = "1300 038 398"
PHONE_TEL = "1300038398"
EMAIL = "admin@drfan.com.au"

# ---------------------------------------------------------------- icons
def icon(name, size=None):
    paths = {
        "arrow": '<path d="M5 12h14M13 6l6 6-6 6"/>',
        "left": '<path d="M15 6l-6 6 6 6"/>',
        "right": '<path d="M9 6l6 6-6 6"/>',
        "down": '<path d="M6 9l6 6 6-6"/>',
        "phone": '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
        "menu": '<path d="M4 8h16M4 16h16"/>',
        "close": '<path d="M6 6l12 12M18 6L6 18"/>',
        "plus": '<path d="M12 5v14M5 12h14"/>',
        "info": '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
        "external": '<path d="M7 17L17 7M9 7h8v8"/>',
        "mail": '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
        "pin": '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    }
    s = f' width="{size}" height="{size}"' if size else ""
    return (f'<svg{s} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
            f'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">{paths[name]}</svg>')


# ---------------------------------------------------------------- navigation
NAV_GROUPS = [
    ("Procedures", [("Laparoscopy", "laparoscopy.html"), ("Endoscopy", "endoscopy.html"), ("Minor Operations", "minor-operations.html")]),
    ("Patient information", [("Operation Risks", "operation-risks.html"), ("Post Operative Instructions", "post-operative-instructions.html"), ("FAQs", "faqs.html")]),
    ("Resources", [("Useful Links", "useful-links.html"), ("Other Resources", "other-resources.html")]),
]

SOCIALS = [  # same profiles and order as the "Follow" links on drfan.com.au/home
    ("LinkedIn", "linkedin", "https://www.linkedin.com/in/howardsfan/"),
    ("Instagram", "instagram", "https://www.instagram.com/drfanfracs/"),
    ("Threads", "threads", "https://www.threads.net/@drfanfracs"),
    ("TikTok", "tiktok", "https://www.tiktok.com/@drfan_fracs"),
    ("Facebook", "facebook", "https://www.facebook.com/DrFanFRACS"),
    ("X", "x", "https://x.com/DrFanFRACS"),
    ("YouTube", "youtube", "https://www.youtube.com/@DrFanFRACS"),
]

def social_icon(name):
    """Inline assets/img/social/<name>.svg (brand-coloured; Font Awesome Free, CC BY 4.0)."""
    svg = (DIST / "assets" / "img" / "social" / f"{name}.svg").read_text(encoding="utf-8").strip()
    return svg.replace("<svg ", '<svg aria-hidden="true" focusable="false" ', 1)

LOCATIONS = [
    ("syd", "St George Private Hospital", "Kogarah", "Consulting & Operating", "1 South St, Kogarah NSW 2217", "1300 038 398"),
    ("syd", "Kareena Private Hospital", "Caringbah", "Consulting & Operating", "Level 3, 86 Kareena Rd, Caringbah NSW 2229", "1300 038 398"),
    ("syd", "Ramsay Surgical Centre Miranda", "Miranda", "Operating", "533 Kingsway, Miranda NSW 2228", "1300 038 398"),
    ("syd", "Hurstville", "Hurstville", "Consulting", "185A Forest Rd, Hurstville NSW 2220", "(02) 9580 7233"),
    ("syd", "Woolooware", "Woolooware", "Consulting", "156 Kingsway, Woolooware NSW 2230", "(02) 9523 6600"),
    ("syd", "Miranda", "Miranda", "Consulting", "573 Kingsway, Miranda NSW 2228", "(02) 9540 1044"),
    ("syd", "Cronulla", "Cronulla", "Consulting", "Suite 3, Level 1, 17 Surf Rd, Cronulla NSW 2230", "1300 038 398"),
    ("grf", "St Vincent’s Private Community Hospital", "Griffith", "Consulting & Operating", "41-45 Animoo Ave, Griffith NSW 2680", "(02) 6966 8300"),
    ("grf", "Griffith Base Hospital", "Griffith", "Consulting & Operating", "1 Noorebar Ave, Griffith NSW 2680", "(02) 6969 5811"),
]

FAQS = [
    ("What are the benefits of laparoscopic (keyhole) surgery?",
     "Laparoscopic surgery, often called keyhole surgery, involves performing operations through small incisions rather than a single large incision. The primary benefits include significantly reduced post-operative pain, smaller scars, a lower risk of infection, and a faster return to normal activities and work. Dr Howard Fan specialises in laparoscopic hernia, gallbladder, and bowel surgery."),
    ("How long is the recovery after keyhole surgery?",
     "While recovery varies by procedure, most patients undergoing laparoscopic surgery can return home the same day, or by the next day. Light activities can usually resume within a few days."),
    ("Do I really need my gallbladder removed if I have gallstones?",
     "It depends. Gallbladder removal (cholecystectomy) is recommended if gallstones are causing symptoms like biliary colic (abdominal pain), inflammation, or jaundice. If left untreated, symptomatic gallstones can lead to serious complications such as pancreatitis or bile duct infections. Because the gallbladder is a non-essential organ, its removal generally has no long-term impact on digestion for most patients. However, if you have no symptoms, it is not always necessary to remove your gallbladder. Consider a consultation with Dr Howard Fan to discuss your specific situation."),
    ("What can I eat after gallbladder surgery?",
     "Most people can return to a normal diet. However, if you are having diarrhoea, consider a low-fat diet for the first few weeks to allow the digestive system to adjust. This is because bile that is normally stored in the gallbladder is used to help digest fats/oils, and without the gallbladder, the ability to digest fats/oils are diminished. Gradually reintroducing fats/oils helps prevent temporary digestive discomfort or bloating."),
    ("Will a hernia go away on its own without surgery?",
     "No. Having a hernia is like having a hole in the wall. The hole does not cover itself. Likewise a hernia is a mechanical defect in the abdominal wall that cannot heal itself. While some hernias are painless, they typically increase in size over time. Surgery is recommended if you are having symptoms of pain or the hernia is getting larger. Urgent surgery is required if important structures, such as the bowel, are stuck in the hernia."),
    ("What is the difference between a gastroscopy and a colonoscopy?",
     "A gastroscopy examines the upper digestive tract (oesophagus, stomach, and duodenum) via the mouth, while a colonoscopy examines the large bowel via the rectum. Both are day procedures performed under light sedation. Dr. Howard Fan (GESA accredited) uses these endoscopic techniques to investigate symptoms like reflux, abdominal pain, or changes in bowel habits."),
    ("Who is the best surgeon for me?",
     "There is no single best surgeon, because each surgeon has their own specific area of expertise. It is best to consult with your general practitioner and have a discussion with your surgeon to discuss your condition. Remember, you are always entitled to a second opinion if you feel that your needs are not met."),
]

def tel(p):
    return "tel:" + "".join(ch for ch in p if ch.isdigit())

# ---------------------------------------------------------------- shell
def head(title, description, path):
    canonical = BASE_URL + ("" if path == "index.html" else path)
    full_title = title if path == "index.html" else f"{title} | Dr Howard Fan, Surgeon"
    return f"""<!doctype html>
<html lang="en-AU" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{escape(full_title)}</title>
<meta name="description" content="{escape(description)}">
<link rel="canonical" href="{canonical}">
<meta name="theme-color" content="#3134CF">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Dr Howard Fan">
<meta property="og:title" content="{escape(full_title)}">
<meta property="og:description" content="{escape(description)}">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="{BASE_URL}assets/img/og-image.jpg">
<link rel="icon" type="image/png" sizes="32x32" href="assets/img/favicon-32.png">
<link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&amp;family=Manrope:wght@600;700;800&amp;display=swap">
<link rel="stylesheet" href="assets/css/styles.css">
<script>document.documentElement.classList.remove('no-js');document.documentElement.classList.add('js');</script>
"""

def header(active=""):
    drops = []
    for label, links in NAV_GROUPS:
        cur = any(href == active for _, href in links)
        cur_attr = ' aria-current="page"'
        items = "".join(
            f'<a href="{href}"{cur_attr if href == active else ""}>{escape(t)}</a>' for t, href in links)
        drops.append(f"""<div class="nav-drop">
<button type="button" aria-expanded="false" aria-haspopup="true"{' data-current="true"' if cur else ''}>{escape(label)}{icon("down")}</button>
<div class="nav-drop__menu">{items}</div>
</div>""")
    mobile_groups = "".join(
        f'<div class="mobile-menu__group"><span>{escape(label)}</span>' +
        "".join(f'<a href="{href}">{escape(t)}</a>' for t, href in links) + "</div>"
        for label, links in NAV_GROUPS)
    contact_cur = ' aria-current="page"' if active == "contact.html" else ""
    return f"""</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
<div class="container site-header__inner">
<a class="brand" href="index.html" aria-label="Dr Howard Fan, home">
<img src="assets/img/logo.jpg" alt="" width="48" height="48">
<span class="brand__text"><span class="brand__name">Dr Howard Fan</span><span class="brand__role">General Surgeon · FRACS</span></span>
</a>
<nav class="main-nav" aria-label="Main">
{"".join(drops)}
<a href="index.html#about">About</a>
<a href="contact.html"{contact_cur}>Contact Us</a>
</nav>
<div class="header-actions">
<a class="header-phone" href="{tel(PHONE)}" aria-label="Call {PHONE}">{icon("phone")}<span>{PHONE}</span></a>
<a class="btn btn--primary" href="#book">Book a consultation</a>
<a class="header-call" href="{tel(PHONE)}" aria-label="Call {PHONE}">{icon("phone")}</a>
<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu"><span class="icon-open">{icon("menu")}</span><span class="icon-close">{icon("close")}</span></button>
</div>
</div>
</header>
<nav class="mobile-menu" id="mobile-menu" aria-label="Mobile" aria-hidden="true">
<a href="index.html">Home</a>
{mobile_groups}
<a href="index.html#about">About Dr Fan</a>
<a href="contact.html">Contact Us</a>
<a class="btn btn--primary" href="#book">Book a consultation</a>
</nav>
"""

def footer():
    cols = "".join(
        f'<nav class="footer-col" aria-label="{escape(label)}"><h2>{escape(label)}</h2>' +
        "".join(f'<a href="{href}">{escape(t)}</a>' for t, href in links) + "</nav>"
        for label, links in NAV_GROUPS[:2] + [("Resources", NAV_GROUPS[2][1] + [("Contact Us", "contact.html")])])
    socials = "".join(
        f'<a class="social" href="{url}" aria-label="{name}" title="{name}" target="_blank" rel="noopener">{social_icon(icon_file)}</a>'
        for name, icon_file, url in SOCIALS)
    return f"""<footer class="site-footer">
<div class="container site-footer__inner">
<div class="footer-grid">
<div class="footer-brand">
<a class="footer-brand__logo" href="index.html" aria-label="Dr Howard Fan, home">
<span class="footer-brand__badge"><img src="assets/img/logo.jpg" alt="" width="48" height="48"></span>
<span class="brand__text"><span class="brand__name" style="font-size:18px">Dr Howard Fan</span><span class="brand__role">General Surgeon · FRACS</span></span>
</a>
<p>Improving your health. Elevating the standards of healthcare.</p>
<div class="footer-contact"><a href="{tel(PHONE)}">{PHONE}</a><a href="mailto:{EMAIL}">{EMAIL}</a></div>
</div>
{cols}
<div class="footer-col"><h2>Follow</h2><div class="socials">{socials}</div></div>
</div>
<div class="footer-bottom">
<span>Information on this website is general in nature and is not a substitute for individual medical advice. In an emergency, call 000.</span>
<span>© <span data-year>2026</span> Dr Howard Fan</span>
</div>
</div>
</footer>
<div class="action-bar" aria-label="Quick actions">
<a href="{tel(PHONE)}">{icon("phone")}Call</a>
<a href="#book">Book a consultation</a>
</div>
<script src="assets/js/main.js" defer></script>
</body>
</html>
"""

# ---------------------------------------------------------------- shared sections
def book_band():
    return f"""<section class="section section--brand" id="book" aria-labelledby="book-title">
<div class="container book__grid">
<div class="book__intro reveal">
<h2 id="book-title">Book a consultation</h2>
<p>In-person at nine locations, or by telehealth to save you time.</p>
</div>
<div class="book-card book-card--light reveal" style="--d:.08s">
<span class="book-card__kicker">Patients</span>
<h3>Call or email</h3>
<p>Send your GP referral letter and we’ll contact you to arrange an appointment.</p>
<div class="book-card__actions">
<a class="btn btn--primary" href="{tel(PHONE)}">{PHONE}</a>
<a class="btn btn--outline" href="mailto:{EMAIL}">Email</a>
</div>
</div>
<div class="book-card book-card--dark reveal" style="--d:.16s">
<span class="book-card__kicker">GPs &amp; referrers</span>
<h3>Direct referral endoscopy</h3>
<p>No-gap direct referral gastroscopy and colonoscopy for suitable patients. Email referrals to {EMAIL}.</p>
<div class="book-card__actions">
<a class="btn btn--white" href="mailto:{EMAIL}?subject=GP%20referral">Email a referral</a>
</div>
</div>
</div>
</section>
"""

def faq_items(items):
    out = []
    for q, a in items:
        out.append(f"""<details class="faq-item">
<summary>{escape(q)}<span class="faq-item__icon">{icon("plus")}</span></summary>
<div class="faq-item__body"><p>{escape(a)}</p></div>
</details>""")
    return "\n".join(out)

def page_hero(eyebrow, title, intro, crumbs):
    crumb_html = '<li><a href="index.html">Home</a></li>' + "".join(
        (f'<li><a href="{h}">{escape(t)}</a></li>' if h else f'<li aria-current="page">{escape(t)}</li>') for t, h in crumbs)
    return f"""<section class="page-hero">
<div class="container page-hero__inner">
<nav aria-label="Breadcrumb"><ol class="breadcrumb">{crumb_html}</ol></nav>
<p class="eyebrow">{escape(eyebrow)}</p>
<h1>{escape(title)}</h1>
{f'<p class="page-hero__intro">{intro}</p>' if intro else ''}
</div>
</section>
"""

def doc_layout(sections, after=""):
    """sections: list of (id, title, inner_html)."""
    toc = "".join(f'<a href="#{sid}">{escape(t)}</a>' for sid, t, _ in sections)
    body = "".join(f"""<section class="doc-section reveal" id="{sid}" aria-labelledby="{sid}-h">
<div class="doc-section__head"><span class="doc-section__num">{i:02d}</span><h2 id="{sid}-h">{escape(t)}</h2></div>
{inner}
</section>
""" for i, (sid, t, inner) in enumerate(sections, 1))
    return f"""<div class="container doc">
<nav class="toc" aria-label="On this page"><span class="toc__title">On this page</span>{toc}</nav>
<div class="doc__body">
{body}{after}
</div>
</div>
"""

def note(text):
    return f'<div class="note">{icon("info")}<p>{text}</p></div>'

GENERAL_NOTE = note("Advice provided on this webpage is general in nature. Your specific personal circumstances and post operative instructions may differ.")

def instr_list(items):
    li = []
    for strong, rest in items:
        rest_html = f"<span>{rest}</span>" if rest else ""
        li.append(f"<li class=\"instr\"><div><strong>{strong}</strong>{rest_html}</div></li>")
    return '<ol class="instr-list">' + "".join(li) + "</ol>"

def risk_grid(items):
    return '<div class="risk-grid">' + "".join(
        f'<div class="risk"><strong>{escape(t)}</strong><span>{escape(d)}</span></div>' for t, d in items) + "</div>"

def related(cards):
    inner = "".join(f"""<a class="link-card" href="{href}">
<span class="link-card__source">{escape(kicker)}</span>
<h3>{escape(title)}</h3>
<p>{escape(desc)}</p>
<span class="text-link">Read more {icon("arrow")}</span>
</a>""" for kicker, title, desc, href in cards)
    return f"""<section aria-labelledby="related-h" class="reveal" style="margin-top:20px">
<h2 id="related-h" class="section-title" style="font-size:clamp(24px,2.4vw,30px);margin-bottom:20px">Related information</h2>
<div class="link-grid">{inner}</div>
</section>"""

def write(path, html):
    with open(DIST / path, "w", encoding="utf-8", newline="\n") as f:  # keep LF line endings on Windows
        f.write(html)
    print("wrote", path)

# ================================================================ HOME
def home():
    updates = [
        ("No-gap gastroscopy &amp; colonoscopy", f'Now accepting direct referrals for suitable patients. Ask your GP to email a referral to <a href="mailto:{EMAIL}">{EMAIL}</a>.'),
        ("Telehealth appointments", "Telehealth appointments are available for suitable consultations, to save you time and travel."),
        ("Nine locations across Sydney’s south and Griffith", "See Dr Fan at Kogarah, Caringbah, Hurstville, Miranda, Woolooware and Cronulla, plus Griffith in the Riverina."),
    ]
    upd_html = "".join(f"""<div class="update{' is-active' if i == 0 else ''}" aria-hidden="{'false' if i == 0 else 'true'}">
<span class="update__title">{t}</span><span class="update__body">{b}</span>
</div>""" for i, (t, b) in enumerate(updates))
    dots = "".join(f'<button type="button" class="dot{" is-active" if i == 0 else ""}" aria-label="Show update {i+1}"><span class="dot__track"><span class="dot__fill"></span></span></button>' for i in range(len(updates)))

    procs = [
        ("Endoscopy", "Gastroscopy", "A camera examination of the oesophagus, stomach and upper small bowel. A day procedure under light sedation.", "endoscopy.html"),
        ("Endoscopy", "Colonoscopy", "A camera examination of the large bowel. A day procedure under light sedation, with bowel preparation beforehand.", "endoscopy.html#bowel-prep"),
        ("Keyhole", "Laparoscopic surgery", "Surgery through small incisions with a camera and fine instruments, which means less scarring, less pain and a shorter stay.", "laparoscopy.html"),
        ("Keyhole", "Gallbladder surgery", "Keyhole removal of the gallbladder, usually recommended when gallstones are causing symptoms.", "post-operative-instructions.html#gallbladder"),
        ("Keyhole", "Hernia surgery", "Repair of groin and abdominal wall hernias. Hernias don’t heal on their own and tend to grow over time.", "post-operative-instructions.html#hernia"),
        ("Keyhole", "Anti-reflux surgery", "Surgery for reflux when lifestyle measures and medication are not controlling symptoms.", "post-operative-instructions.html#reflux"),
        ("Bowel", "Bowel surgery", "Elective and emergency surgery for conditions of the small and large bowel.", "laparoscopy.html"),
        ("Anorectal", "Haemorrhoid surgery", "Treatment for haemorrhoids when simpler measures haven’t brought relief.", "post-operative-instructions.html#haemorrhoid"),
        ("Skin", "Skin cancer surgery", "Excision of skin cancers and other lesions, with reconstruction techniques designed to optimise the cosmetic outcome.", "minor-operations.html"),
    ]
    proc_html = "".join(f"""<article class="proc-card reveal" style="--d:{(i % 3) * 0.06:.2f}s">
<h3>{escape(name)}</h3>
<p>{escape(desc)}</p>
<a class="text-link" href="{href}">Learn more<span class="sr-only"> about {escape(name.lower())}</span>{icon("arrow")}</a>
</article>""" for i, (cat, name, desc, href) in enumerate(procs))

    # (name, link, logo file in assets/img/affiliations/ without extension)
    affils = [
        ("Royal Australasian College of Surgeons", "https://www.surgeons.org/en", "racs"),
        ("General Surgeons Australia", "https://generalsurgeons.com.au/", "gsa"),
        ("Gastroenterological Society of Australia", "https://www.gesa.org.au/", "gesa"),
        ("Cancer Institute NSW", "https://www.canrefer.org.au/specialists/howard-fan", "canrefer"),
        ("ResearchGate", "https://www.researchgate.net/profile/Howard-Fan", "researchgate"),
        ("Charles Sturt University", "https://science-health.csu.edu.au/schools/medicine/people/profiles/rural-generalist-program-murrumbidgee-rural-clinical-school/howard-fan", "csu"),
        ("University of New South Wales", "https://www.unsw.edu.au/staff/howard-fan", "unsw"),
        ("St Vincent’s Private Community Hospital Griffith", "https://www.svph.org.au/specialists/dr-howard-fan-surgeon-griffith-%281%29", "svph"),
        ("Kareena Hospital (Ramsay Health)", "https://www.kareenaprivate.com.au/Our-Doctors/Specialists/kareena-private-hospital/general-surgery/109156/dr-howard-fan", "kareena"),
    ]

    def aff_logo(slug):
        # Uses the first matching file; shows the grey placeholder until one is added.
        for ext in ("svg", "png", "webp", "jpg"):
            if (DIST / "assets" / "img" / "affiliations" / f"{slug}.{ext}").exists():
                # alt is empty because the tile's text already names the organisation
                return f'<img src="assets/img/affiliations/{slug}.{ext}" alt="" loading="lazy">'
        return '<span class="aff-tile__logo">Logo</span>'

    # Logo only; the name slides in on hover/focus (aria-label gives screen readers the name).
    aff_html = "\n".join(f"""<a class="aff-tile" href="{url}" target="_blank" rel="noopener" aria-label="{escape(name)}">
{aff_logo(slug)}
<span class="aff-tile__label" aria-hidden="true">{escape(name)}</span>
</a>""" for name, url, slug in affils)

    steps = [
        ("Referral", "Start with a GP referral", "Ask your GP for a referral to Dr Howard Fan. Referrals can be emailed straight to us, and we’ll contact you to arrange an appointment.",
         ["GPs can email referrals to admin@drfan.com.au", "No-gap direct referral gastroscopy and colonoscopy for suitable patients", "Prefer to call? Ring 1300 038 398"]),
        ("Consultation", "Unhurried, honest advice", "Dr Fan explains your diagnosis, outlines all appropriate management options and answers your questions thoroughly. When surgery isn’t the best option, you’ll get honest guidance on the alternatives.",
         ["Telehealth appointments available to save you time", "You may also meet the anaesthetist and, where needed, allied health staff"]),
        ("Preparing", "Getting ready for your procedure", "You’ll receive individual instructions. As a general guide:",
         ["Some medications may need to be paused, including blood thinners, antiplatelets, diabetes and blood pressure medications, and some supplements", "Follow the fasting instructions you’re given before surgery", "Colonoscopy: avoid nuts, seeds, grains and leafy vegetables for 3 days, clear fluids the day before, and bowel preparation the night before"]),
        ("Procedure day", "On the day", "Gastroscopy and colonoscopy are day procedures under light sedation. After keyhole surgery, most patients go home the same day or the next.",
         ["No driving for 24 hours after an anaesthetic, so arrange a lift home", "Simple pain relief such as paracetamol or ibuprofen is usually enough at home"]),
        ("Recovery", "Recovery and follow-up", "Most people return to light activities within a few days. After keyhole surgery:",
         ["Keep dressings on for one week, and don’t soak wounds for two weeks", "No heavy lifting (over 5 kg) or strenuous activity for six weeks", "A follow-up appointment at 2–4 weeks to check wounds and review results"]),
    ]
    step_btns = "".join(f"""<button type="button" class="step-btn{' is-active' if i == 0 else ''}" role="tab" id="step-tab-{i}" aria-controls="step-panel-{i}" aria-selected="{'true' if i == 0 else 'false'}"{'' if i == 0 else ' tabindex="-1"'}>
<span class="step-btn__num">{i+1:02d}</span><span class="step-btn__label">{label}</span>
</button>""" for i, (label, *_r) in enumerate(steps))
    step_panels = "".join(f"""<div class="step-panel" role="tabpanel" id="step-panel-{i}" aria-labelledby="step-tab-{i}"{'' if i == 0 else ' hidden'}>
<span class="step-panel__kicker">Step {i+1:02d} · {label}</span>
<h3>{escape(title)}</h3>
<p>{escape(body)}</p>
<ul class="check-list">{"".join(f"<li>{escape(p)}</li>" for p in pts)}</ul>
</div>""" for i, (label, title, body, pts) in enumerate(steps))

    loc_items = "".join(f"""<li>
<div class="loc-item" data-region="{r}" data-name="{escape(n)}" data-addr="{escape(a)}" data-phone="{p}" data-roles="{escape(roles)}">
<button type="button" class="loc-btn" aria-expanded="false">
<span class="loc-btn__text"><span class="loc-btn__name">{escape(n)}</span><span class="loc-btn__meta">{escape(sub)} · {escape(roles)}</span></span>
{icon("right")}
</button>
<div class="loc-detail">
<span>{escape(a)}</span>
<span>Ph: <a href="{tel(p)}">{p}</a> · E: <a href="mailto:{EMAIL}">{EMAIL}</a></span>
<div class="loc-detail__actions">
<a class="btn btn--dark" href="{tel(p)}">Call</a>
<a class="btn btn--outline" href="https://www.google.com/maps/search/?api=1&amp;query={escape(n + ', ' + a).replace(' ', '+')}" target="_blank" rel="noopener">Directions</a>
</div>
</div>
</div>
</li>""" for r, n, sub, roles, a, p in LOCATIONS)

    schema = {
        "@context": "https://schema.org",
        "@type": "Physician",
        "name": "Dr Howard Fan",
        "description": "General surgeon (FRACS) offering laparoscopic (keyhole) surgery, gastroscopy, colonoscopy and skin cancer surgery across Sydney and Griffith, NSW.",
        "url": BASE_URL,
        "image": BASE_URL + "assets/img/og-image.jpg",
        "telephone": "+61 1300 038 398",
        "email": EMAIL,
        "medicalSpecialty": "Surgical",
        "address": [
            {"@type": "PostalAddress", "name": n, "streetAddress": a.split(",")[0] if not a.startswith(("Level", "Suite")) else ", ".join(a.split(",")[:2]),
             "addressLocality": sub, "addressRegion": "NSW", "postalCode": a.split()[-1], "addressCountry": "AU"}
            for r, n, sub, roles, a, p in LOCATIONS
        ],
    }

    html = head("Dr Howard Fan | General Surgeon, Sydney & Griffith NSW",
                "Dr Howard Fan is a general surgeon (FRACS) offering keyhole surgery, gastroscopy, colonoscopy and skin cancer surgery across Sydney’s St George and Sutherland Shire, and Griffith NSW.",
                "index.html")
    html += f'<script type="application/ld+json">{json.dumps(schema, ensure_ascii=False)}</script>\n'
    html += header("index.html")
    html += f"""<main id="main">

<section class="hero">
<div class="container hero__grid">
<div class="hero__text">
<p class="eyebrow reveal">BMed, MD, MHM, FRACS, GESA</p>
<h1 class="hero__title reveal" style="--d:.06s">Dr Howard Fan</h1>
<div class="hero__bio reveal" style="--d:.12s">
<p class="lead">Dr Howard Fan is a fellow of the Royal Australian College of Surgery (FRACS) with over 10 years of clinical experience. Having graduated from the University of New South Wales (UNSW) with Doctors of Medicine and Masters of Health Management, Dr Fan now manages a broad range of elective, emergency and trauma conditions. Dr Fan specialises in minimally invasive surgery including gastroscopy, colonoscopy, and laparoscopic (keyhole) surgery, and is very experienced in the excision of skin cancers and other skin lesions with reconstruction techniques designed to optimise the cosmetic outcomes.</p>
<div class="bio-more" id="bio-more" hidden>
<p>Outside of the operating room, Dr Fan is actively engaged in teaching the next generation of doctors. He is a lecturer for Charles Sturt University and supervises surgical trainees at Griffith Hospital. Furthermore he is committed to maintaining high clinical standards through ongoing audit, adherence to contemporary guidelines and active professional development.</p>
<p>Dr Fan offers his services across metropolitan Sydney and regional NSW in treating a range of problems including that of the oesophagus, stomach, gallbladder, bowels, hernias, haemorrhoids, skin cancers, and more...</p>
</div>
<button type="button" class="bio-toggle" data-bio-toggle aria-expanded="false" aria-controls="bio-more"><span>Read full biography</span>{icon("down")}</button>
</div>
<div class="cta-cards reveal" style="--d:.18s">
<a class="cta-card cta-card--primary" href="#book"><span class="cta-card__text"><span class="cta-card__title">Book a consultation</span></span><span class="cta-card__arrow">{icon("arrow")}</span></a>
<a class="cta-card cta-card--outline" href="mailto:{EMAIL}?subject=GP%20referral"><span class="cta-card__text"><span class="cta-card__title">Send a GP referral</span></span><span class="cta-card__arrow">{icon("arrow")}</span></a>
</div>
</div>
<div class="portrait reveal" style="--d:.1s">
<img src="assets/img/portrait.jpg" alt="Portrait of Dr Howard Fan" width="1200" height="1500" fetchpriority="high">
</div>
</div>
</section>

<section class="updates" data-updates aria-roledescription="carousel" aria-label="Practice updates">
<div class="container updates__inner">
<span class="updates__label">Practice updates · <span data-updates-count>01</span> / {len(updates):02d}</span>
<div class="updates__viewport" aria-live="polite">{upd_html}</div>
<div class="updates__controls">
<div class="dots">{dots}</div>
<button type="button" class="icon-btn" data-updates-prev aria-label="Previous update">{icon("left")}</button>
<button type="button" class="icon-btn icon-btn--solid" data-updates-next aria-label="Next update">{icon("right")}</button>
</div>
</div>
</section>

<section class="mv" aria-label="Mission and vision">
<div class="container mv__grid">
<div class="mv-card mv-card--light reveal"><p class="eyebrow">My Mission</p><p class="mv-card__statement">Improving your health</p></div>
<div class="mv-card mv-card--dark reveal" style="--d:.08s"><p class="eyebrow">My Vision</p><p class="mv-card__statement">Elevating the standards of healthcare</p></div>
</div>
</section>

<section class="section" id="procedures" aria-labelledby="proc-title">
<div class="container">
<div class="section-head reveal">
<p class="eyebrow">Procedures</p>
<h2 class="section-title" id="proc-title">Specialty Services Offered</h2>
</div>
<div class="proc-grid">{proc_html}</div>
<p class="proc-more reveal">…and more</p>
</div>
</section>

<section class="affiliations" data-aff aria-labelledby="aff-title">
<div class="container">
<div class="section-head section-head--row reveal">
<div><p class="eyebrow">Affiliations</p><h2 class="section-title" id="aff-title">Colleges, societies, universities and hospitals</h2></div>
<div class="carousel-nav">
<button type="button" class="icon-btn icon-btn--lg" data-aff-prev aria-label="Previous affiliations">{icon("left")}</button>
<button type="button" class="icon-btn icon-btn--lg icon-btn--dark" data-aff-next aria-label="Next affiliations">{icon("right")}</button>
</div>
</div>
<div class="aff-viewport" role="region" aria-roledescription="carousel" aria-label="Affiliations">
<div class="aff-track">
{aff_html}
</div>
</div>
<div class="progress" aria-hidden="true"><div class="progress__bar"></div></div>
</div>
</section>

<section class="section section--dark" id="journey" data-steps aria-labelledby="journey-title">
<div class="container journey__grid">
<div class="journey__intro">
<div class="section-head reveal" style="margin:0">
<p class="eyebrow">Your surgery</p>
<h2 class="section-title" id="journey-title">What to expect, from referral to recovery.</h2>
</div>
<div class="steps" role="tablist" aria-orientation="vertical" aria-label="Steps of your surgery">
<div class="steps__rail" aria-hidden="true"><div class="steps__rail-fill"></div></div>
{step_btns}
</div>
</div>
<div class="step-panel-wrap reveal">
{step_panels}
<div class="step-foot">
<p>General information only. Your own instructions may differ. See <a href="operation-risks.html">operation risks</a> and <a href="post-operative-instructions.html">post-operative instructions</a>.</p>
<div class="carousel-nav">
<button type="button" class="icon-btn" data-step-prev aria-label="Previous step">{icon("left")}</button>
<button type="button" class="icon-btn icon-btn--solid" data-step-next aria-label="Next step">{icon("right")}</button>
</div>
</div>
</div>
</div>
</section>

<section class="section" id="about" aria-labelledby="about-title">
<div class="container about__grid">
<div class="about__photo reveal"><img src="assets/img/about-photo.jpg" alt="Dr Howard Fan" width="1200" height="1500" loading="lazy"></div>
<div class="about__text reveal" style="--d:.08s">
<p class="eyebrow" id="about-title">A message from Dr Howard Fan</p>
<blockquote class="about__quote">“I understand that surgery can be confronting. My priority is to ensure that every patient feels informed, supported and confident in their treatment plan.”</blockquote>
<p>I take the time to clearly explain diagnoses, outline all appropriate management options, and answer questions thoroughly. Where surgery is required, my focus is on safe technique, thoughtful decision-making and careful postoperative follow-up. When surgery is not the best option, I provide honest guidance and alternative pathways.</p>
<p style="color:var(--ink);font-weight:600">My goal is simple: to deliver high-quality surgical care with clarity, respect and professionalism.</p>
<div class="signature"><div><strong>Dr Howard Fan</strong><span>BMed, MD, MHM, FRACS</span></div></div>
<div class="facts">
<div class="fact"><span class="fact__label">Practice</span><span class="fact__value">Elective, emergency and trauma general surgery</span></div>
<div class="fact"><span class="fact__label">Focus</span><span class="fact__value">Minimally invasive surgery, endoscopy and skin cancer reconstruction</span></div>
<div class="fact"><span class="fact__label">Teaching</span><span class="fact__value">Lecturer at Charles Sturt University; supervises trainees at Griffith Hospital</span></div>
<div class="fact"><span class="fact__label">Standards</span><span class="fact__value">Ongoing audit, contemporary guidelines, active professional development</span></div>
</div>
</div>
</div>
</section>

<section class="section section--ground" id="locations" data-locations aria-labelledby="loc-title">
<div class="container">
<div class="section-head section-head--row reveal">
<div><p class="eyebrow">Locations</p><h2 class="section-title" id="loc-title">Consulting across Sydney’s south and the Riverina.</h2></div>
<div class="segmented" role="group" aria-label="Region">
<button type="button" data-region="syd" aria-pressed="true">Sydney (7)</button>
<button type="button" data-region="grf" aria-pressed="false">Griffith (2)</button>
</div>
</div>
<div class="loc-grid">
<ul class="loc-list">{loc_items}</ul>
<div class="loc-panel" aria-live="polite">
<div class="loc-panel__map"><iframe title="Map" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
<div class="loc-panel__body">
<div class="loc-panel__tags" data-f="tags"></div>
<h3 data-f="name"></h3>
<div class="loc-panel__lines">
<span data-f="addr"></span>
<span>Ph: <a data-f="tel" href="#"></a></span>
<span>E: <a href="mailto:{EMAIL}">{EMAIL}</a></span>
</div>
<div class="loc-panel__actions">
<a class="btn btn--dark" data-f="maps" href="#" target="_blank" rel="noopener">Get directions</a>
</div>
</div>
</div>
</div>
</div>
</section>

{book_band()}
<section class="section" id="faqs" aria-labelledby="faq-title">
<div class="container faq__grid">
<div class="faq__intro reveal">
<p class="eyebrow">FAQs</p>
<h2 class="section-title" id="faq-title">Common questions</h2>
<p>Can’t see your question? Call <a href="{tel(PHONE)}" style="color:var(--ink);font-weight:600">{PHONE}</a>.</p>
<a class="text-link" href="faqs.html">See all FAQs {icon("arrow")}</a>
</div>
<div class="faq-list reveal" style="--d:.08s">
{faq_items(FAQS[:5])}
</div>
</div>
</section>

</main>
"""
    html += footer()
    write("index.html", html)

# ================================================================ INNER PAGES
def inner(path, title, description, eyebrow, intro, crumbs, sections, extra_after="", related_cards=None):
    html = head(title, description, path) + header(path) + '<main id="main">\n'
    html += page_hero(eyebrow, title, intro, crumbs)
    after = extra_after + (related(related_cards) if related_cards else "")
    html += doc_layout(sections, after) if sections else extra_after
    html += book_band() + "</main>\n" + footer()
    write(path, html)

def laparoscopy():
    sections = [
        ("what", "What is laparoscopy?", "<p>Laparoscopy (key-hole surgery) is a type of minimally invasive surgery that involves an operation being performed through small skin incisions. This is done by using cameras and instruments that are inserted through the tiny cuts made on the skin. Carbon dioxide is then used to create a space in which the operation can take place. The benefits of laparoscopy include less scarring, less pain, and shorter stays in hospital.</p>"),
        ("preop", "Preoperative Preparations", instr_list([
            ("You will need a discussion about your procedure with your surgeon and anaesthetist prior to the operation.", "Depending on your personal circumstances you may require a review by allied health staff including dietician, physiotherapist, occupational therapist, or a clinical nurse specialist."),
            ("Your medications may need to be stopped prior to your operation.", "This includes anticoagulants (blood-thinners), antiplatelets (blood-thinners), antiglycaemics (diabetes medications), antihypertensives (blood pressure medications), and other health supplements (which may act as blood-thinners)."),
            ("You will need to start the fasting process 6 hours prior to your operation.", "This includes clear fluids only (water, black tea with no milk, black coffee with no milk, apple juice, or clear lemonade) 6 hours prior; and nil by mouth from 2 hours prior to your operation."),
        ])),
        ("postop", "Post Operative Instructions", instr_list([
            ("Keep the operative dressings on for 1 week.", "This keeps your wounds clean whilst your skin is healing."),
            ("Do not soak the wounds for 2 weeks.", "This allows time for your skin to become fully waterproof."),
            ("Review with your doctor in 2-4 weeks.", "This is to check your wounds and review any pathology results."),
            ("Do not perform heavy lifting (&gt;5kg) or strenuous activities for 6 weeks.", "This is to reduce your risk of getting a hernia through the laparoscopic incisions."),
            ("Take regular over the counter pain medications (paracetamol, ibuprofen) as required.", "The continued use of stronger pain medications may lead to addiction."),
            ("Do not drive for 24 hours after your procedure, due to the effects of the anaesthetic.", "Beyond that there are no driving restrictions, however we recommend you not to drive if you are in pain or require strong pain medications."),
        ]) + GENERAL_NOTE),
    ]
    inner("laparoscopy.html", "Laparoscopy",
          "Laparoscopy (key-hole surgery) with Dr Howard Fan: what it is, how to prepare, and post operative instructions.",
          "Procedures", "Key-hole surgery: what it involves, how to prepare, and what to do afterwards.",
          [("Procedures", None), ("Laparoscopy", None)], sections,
          related_cards=[("Patient information", "Operation Risks", "Risks of laparoscopy and general anaesthetic, explained.", "operation-risks.html#laparoscopy"),
                         ("Patient information", "Post Operative Instructions", "Specific instructions for gallbladder, hernia and reflux surgery.", "post-operative-instructions.html#keyhole"),
                         ("Patient information", "FAQs", "Benefits of keyhole surgery, recovery times and more.", "faqs.html")])

def endoscopy():
    sections = [
        ("what", "What is Endoscopy?", f"""<p>Camera test to check your stomach and intestines.</p>
<p>{escape(FAQS[5][1])}</p>"""),
        ("bowel-prep", "Colonoscopy Bowel Preparation Instructions", """<ol class="timeline">
<li><span class="timeline__when">72 hours before</span><div class="timeline__card"><strong>Low-residue diet</strong>Avoid nuts, seeds, grains, and leafy vegetables for 72 hours (3 days) before your colonoscopy.</div></li>
<li><span class="timeline__when">24 hours before</span><div class="timeline__card"><strong>Clear fluids only</strong>Clear fluids only for 24 hours (1 day) before your colonoscopy. As a rule, a clear fluid is any fluid that you can see through (this includes: water, apple juice, lemonade, black coffee, and black tea).</div></li>
<li><span class="timeline__when">The night before</span><div class="timeline__card"><strong>Bowel preparation</strong>Start your bowel preparation solutions the night before your colonoscopy. This involves 2-3 sachets of bowel preparation solution (Phosphoprep, ColonLYTELY, Glycoprep, Bisalax, Durolax, Picolax, or Picoprep). You may require extra sachets if you have experienced difficulty with adequate bowel preparation in previous colonoscopies. The expected result is to have clear fluid passing into the toilet by the time of your colonoscopy.</div></li>
</ol>""" + GENERAL_NOTE),
    ]
    inner("endoscopy.html", "Endoscopy",
          "Gastroscopy and colonoscopy with Dr Howard Fan, including colonoscopy bowel preparation instructions.",
          "Procedures", "Gastroscopy and colonoscopy, and how to prepare your bowel for a colonoscopy.",
          [("Procedures", None), ("Endoscopy", None)], sections,
          related_cards=[("Patient information", "Endoscopy Risks", "Bleeding, perforation and missed lesions explained.", "operation-risks.html#endoscopy"),
                         ("Patient information", "After your procedure", "Post operative instructions for gastroscopy and colonoscopy.", "post-operative-instructions.html#gastro"),
                         ("Resources", "Useful Links", "Health information on gastroscopy, colonoscopy and bowel cancer screening.", "useful-links.html")])

def minor_ops():
    sections = [
        ("skin", "Skin procedures", "<p>Skin lesions can be cancerous or non-cancerous. Skin cancers are very common in Australia and early intervention can prevent future detrimental consequences. Consult your doctor early if you have concerns about any skin changes. Early treatment and excision of skin cancers can prevent death.</p>"),
        ("hand", "Hand Surgery / Carpal Tunnel Surgery", "<p>Hand surgery involves operations such as carpal tunnel syndrome release. Prolonged symptoms may lead to permanent weakness. Consult your doctor early if you have concerns. Early treatment can prevent permanent weakness.</p>"),
    ]
    inner("minor-operations.html", "Minor Operations",
          "Skin cancer surgery and hand surgery (carpal tunnel release) with Dr Howard Fan.",
          "Procedures", "Skin procedures and hand surgery.",
          [("Procedures", None), ("Minor Operations", None)], sections,
          related_cards=[("Patient information", "Skin & Hand Surgery Risks", "What to know before a skin or hand procedure.", "operation-risks.html#skin"),
                         ("Patient information", "Skin Operation Aftercare", "Dressings, stitches and caring for your scar.", "post-operative-instructions.html#skin")])

def risks():
    common_bleed = ("Bleeding", "Any operation carries the risk of bleeding because cuts need to be made in the operation. Bleeding is usually minor and stopped during the operation. 1 in 1000 people may need a blood transfusion.")
    common_inf = ("Infection", "Any time a cut is made, there is a risk of infection. Infection risks depend on the reason for the operation. Clearly the risk of infection is higher if the operation performed is to treat an infection. Overall infections rates for elective operations are around 1-2%.")
    sections = [
        ("endoscopy", "Endoscopy Risks", risk_grid([
            ("Bleeding", "This may occur if we take biopsies or remove polyps. The risks of bleeding is generally low, but is higher if you take medications for anticoagulation (blood thinners)."),
            ("Bowel Perforation (hole in the bowel)", "This is very rare, but if it happens you may need an operation to fix or remove the area affected."),
            ("Missed lesions", "Sometimes it is not possible to see every aspect of the large bowel. This is often due to inadequate bowel preparation and having poo covering parts of the bowel. We always try to clean the bowel wall when we are looking but this is not always possible and small lesions may be missed."),
        ])),
        ("laparoscopy", "Laparoscopy Risks", risk_grid([
            common_bleed, common_inf,
            ("Bowel injury", "Laparoscopy involves inserting instruments into the abdomen. All care is taken to avoid injury, and injuries to organs inside the abdomen are rare, with an over all risk of around 3 in 1000."),
            ("Hernia", "Even tiny key-hole cuts disrupt the strength of your abdominal wall under the skin. These weaknesses are potential points for hernias to occur where contents inside the abdomen come out through these incision sites. Healing takes about 6 weeks, and that is the reason we ask you to perform light duties during this period."),
        ])),
        ("skin", "Skin Surgery Risks", risk_grid([
            common_bleed, common_inf,
            ("Reoperation", "Occasionally, we need to operate again to remove a bit more of the skin cancer that was detected under the microscope but not visible at time of surgery."),
        ])),
        ("hand", "Hand Surgery Risks", risk_grid([
            common_bleed, common_inf,
            ("Nerve Injury", "This is a rare complication that can result in numbness, tingling, or even weakness in the hand or fingers. Usually this improves, but depends on the severity of the nerve injury."),
            ("Contractures", "Scarring over the operative site may lead to contractures and stiffness."),
        ])),
        ("haemorrhoid", "Haemorrhoid Surgery Risks", risk_grid([
            ("Pain", "Pain is expected due to the sensitive nature of the area. This can last 2-6 weeks."),
            ("Bleeding", "Mild bleeding is common for the first 2-3 weeks."),
            ("Infection", "Infections are rare. Signs of infection include: worsening pain, discharge of pus, and fevers."),
            ("Urine Retention", "You may experience temporary difficulty with urinating after the surgery. This is more common in men with enlarged prostates."),
            ("Anal Stenosis", "Excessive surgery may lead to stenosis, where the anal sphincter is tight and passing stools may be difficult."),
            ("Faecal incontinence", "Removal of haemorrhoidal tissue disrupts the usual seal needed for continence. You may experience temporary incontinence as your body adapts."),
        ])),
        ("anaesthetic", "General Anaesthetic Risks", risk_grid([
            ("Reactions to the anaesthetic", "Reactions such as anaphylaxis to medications used for anaesthetics are very rare and you will be treated immediately by your anaesthetist. Depending on your allergic reaction, your operation may be cancelled in the interests of your overall health."),
            ("Aspiration", "Food content may come up from your stomach and go down into your lung. This is the reason we ask you to fast before an operation."),
            ("Breathing difficulties", "General anaesthetic is designed to relax your muscles including those responsible for your breathing. These issues are rare and temporary. Risks are usually related to underlying lung and heart conditions."),
            ("Being semiconscious", "This is related to individual tolerance to anaesthetics and is very rare."),
            ("Cognitive changes", "Anaesthetics affects the brain and can cause confusion and memory loss. Older people, particularly anyone with underlying dementia are more likely affected."),
            ("Heart attack / stroke", "Anaesthetics and the physiological stress of an operation increases the strain on your heart. These are rare complications, and usually related to underlying heart diseases."),
            ("Hoarse voice", "The breathing tube reaches all the way down your throat and may cause a bit of irritation leading to a hoarse voice. You can expect to fully recover from this irritation."),
            ("Minor damage to mouth/teeth", "This is due to the breathing tube being placed in your mouth which may cause irritation after the procedure."),
            ("Nerve injury", "A nerve may be temporarily compressed during your operation because you are not awake to reposition yourself. This is rare and temporary, however, recovery may take up to many weeks depending on the nerve involved and the duration of the operation."),
            ("Temporary vision changes", "All care is taken to protect the eyes because you will be unable to close your own eyes under a general anaesthetic. Eye ointments are often used and may cause blurriness on waking."),
        ]) + GENERAL_NOTE),
    ]
    inner("operation-risks.html", "Operation Risks",
          "Risks of endoscopy, laparoscopy, skin, hand and haemorrhoid surgery, and general anaesthetic.",
          "Patient information", "Every procedure carries some risk. Here is what to know, by type of operation.",
          [("Patient information", None), ("Operation Risks", None)], sections)

def postop():
    sections = [
        ("gastro", "Gastroscopy & Colonoscopy", '<ul class="check-list">' + "".join(f"<li>{t}</li>" for t in [
            "Sips of water after the procedure.",
            "Continue regular diet after tolerating water.",
            "You may need new medications depending on findings of your endoscopy.",
            "Do not drive or operate heavy machinery for 24 hours after your procedure, because you will be under the influence of the anaesthetics.",
            "You should have the rest of the day off for rest, and have a responsible adult take you home.",
            "Expect to have some abdominal bloating and a sore throat. This usually improves over a few hours. Please notify us if you have severe pain.",
            "We will follow up with you to discuss results of your biopsies (if any).",
        ]) + "</ul>"),
        ("haemorrhoid", "Haemorrhoid Operations", instr_list([
            ("Take regular pain relief and stool softeners.", "Operations for haemorrhoids are extremely painful due to the sensitive nature of the area involved. Taking regular pain medications and keeping stools soft prevents worsening irritation and pain over the area. Expect there to be pain for 2-6 weeks."),
            ("Regularly wash the area in the shower or bath. Avoid harsh soaps.", "This can be done during your regular showers/baths. It will keep the area clean and ease pain."),
            ("A small amount of bleeding is expected for 2-3 weeks.", "Please contact us if bleeding persists."),
            ("We will follow up with you in a few weeks to check up on your progress.", ""),
        ])),
        ("skin", "Skin Operations", instr_list([
            ("Take some simple pain relief medications if you feel pain.", ""),
            ("Apply gentle pressure over the site if there is bleeding.", ""),
            ("Leave the dressings on for 5 days.", "You may change them if they are wet or stained. Some dressings such as those for skin graft sites may need to stay on for longer."),
            ("Avoid soaking the wound for 2 weeks.", "It takes about 2 weeks for the skin to become fully waterproof."),
            ("The stitches used are usually dissolvable.", "If we had to use non dissolving sutures we will inform you of when they need to be removed. In general:<ul><li>On the face: 5-7 days.</li><li>On the body / arms / legs: 10-14 days.</li></ul>"),
            ("For best cosmetic healing outcomes:", "avoid the sun, use moisturisers, and apply a silicon based dressing over the scar until fully healed."),
            ("We will follow up with you in a few weeks to discuss results and assess healing.", ""),
        ])),
        ("hand", "Hand Surgery", "<p>See skin operations (above)... In addition:</p>" + instr_list([
            ("Start gentle finger exercises within 1-2 days of surgery.", ""),
            ("Avoid heavy lifting, straining, and manual labour for 4-6 weeks.", ""),
            ("Keep hand elevated at rest to reduce swelling.", ""),
            ("Expect functional improvement in 2-3 months.", "Full recovery may take over 6 months."),
        ])),
        ("keyhole", "Any Keyhole Surgery (Laparoscopic Surgery)", instr_list([
            ("Keep the operative dressings on for 1 week.", "This keeps your wounds clean whilst your skin is healing."),
            ("Do not soak the wounds for 2 weeks.", "This allows time for your skin to become fully waterproof."),
            ("Book in a review in 2-4 weeks time.", "This is to check your wounds and review any pathology results."),
            ("Do not perform heavy lifting (&gt;5kg) or strenuous activities for 6 weeks.", "This is to reduce your risk of getting a hernia through the laparoscopic incisions."),
            ("Take regular over the counter pain medications (paracetamol, ibuprofen) as required.", "Expect to have some pain after your operation. The continued use of stronger pain medications may lead to addiction."),
            ("Do not drive for 24 hours after your procedure, due to the effects of the anaesthetic.", "Beyond that there are no driving restrictions, however we recommend you not to drive if you are in pain or require strong pain medications."),
            ("We will follow up with you in a few weeks to discuss results and assess your progress.", ""),
        ])),
        ("gallbladder", "Gallbladder Surgery (Cholecystectomy)", "<p>See keyhole surgery (above)... In addition:</p>" + instr_list([
            ("Avoid excessive dietary fats/oils.", "The gallbladder stores bile which helps dissolve fats/oils. Without the gallbladder you may not digest fats/oils as well, which can result in diarrhoea. This should improve with time as your body adapts."),
        ])),
        ("hernia", "Hernia Surgery", "<p>See keyhole surgery (above)... In addition:</p>" + instr_list([
            ("Expect tenderness, bruising and swelling over the operative area.", "In cases of groin hernia repairs, swelling can extend to the scrotum and inner thigh. These can last 2-4 weeks. Please contact us if the pain and swelling is getting worse."),
        ])),
        ("reflux", "Reflux Surgery (Fundoplication)", "<p>See keyhole surgery (above)... In addition, you need to follow a special diet:</p>" + """<ol class="timeline">
<li><span class="timeline__when">Day 1</span><div class="timeline__card"><strong>Clear fluids only</strong>This includes: water, apple juice, lemonade, black coffee, and black tea.</div></li>
<li><span class="timeline__when">From day 2</span><div class="timeline__card"><strong>Free fluids</strong>This includes: milk, yogurt, protein shakes, and ice-cream.</div></li>
<li><span class="timeline__when">Next 6 weeks</span><div class="timeline__card"><strong>Pureed foods</strong>This includes: mashed potatoes, scrambled eggs, oats, and blended foods.</div></li>
<li><span class="timeline__when">After 6 weeks</span><div class="timeline__card"><strong>Gradually return to normal</strong>Have regular small meals, chew thoroughly, stay upright for 30 minutes after eating, and avoid fizzy drinks.</div></li>
</ol>
<p>You may initially experience some difficulty swallowing, but that will improve with time.</p>"""),
        ("concerns", "Other Concerns", f"""<p>Please contact us if there are any concerns. Things that may be concerning include:</p>
<ul class="check-list"><li>Redness over the wound</li><li>Foul smell, discharge, or breakdown of the wound</li><li>Pain that is not improving</li><li>Persistent bleeding or enlarging bruising/swelling</li></ul>
<div class="book-card__actions"><a class="btn btn--primary" href="{tel(PHONE)}">Call {PHONE}</a></div>""" + GENERAL_NOTE),
    ]
    inner("post-operative-instructions.html", "Post Operative Instructions",
          "Aftercare instructions for endoscopy, haemorrhoid, skin, hand, keyhole, gallbladder, hernia and reflux surgery.",
          "Patient information", "What to do after your procedure, and when to contact us.",
          [("Patient information", None), ("Post Operative Instructions", None)], sections)

def faqs_page():
    html = head("FAQs", "Answers to common questions about keyhole surgery, recovery, gallstones, hernias, gastroscopy and colonoscopy.", "faqs.html")
    html += header("faqs.html") + '<main id="main">\n'
    html += page_hero("Patient information", "FAQs", "Answers to the questions Dr Fan is asked most often.", [("Patient information", None), ("FAQs", None)])
    html += f"""<section class="section"><div class="container faq__grid">
<div class="faq__intro reveal"><p class="eyebrow">Common questions</p><h2 class="section-title">Still have a question?</h2><p>Call <a href="{tel(PHONE)}" style="color:var(--ink);font-weight:600">{PHONE}</a> or email <a href="mailto:{EMAIL}" style="color:var(--ink);font-weight:600">{EMAIL}</a>.</p></div>
<div class="faq-list reveal" style="--d:.08s">{faq_items(FAQS)}</div>
</div></section>
"""
    html += book_band() + "</main>\n" + footer()
    write("faqs.html", html)

def contact():
    cards = "".join(f"""<article class="contact-card reveal" style="--d:{(i % 3) * 0.06:.2f}s">
<span class="tag" style="align-self:flex-start">{escape(roles)}</span>
<h3>{escape(n)}</h3>
<p>{escape(a)}</p>
<p>Ph: <a href="{tel(p)}">{p}</a><br>E: <a href="mailto:{EMAIL}">{EMAIL}</a></p>
<div class="contact-card__actions"><a class="btn btn--dark" href="{tel(p)}">Call</a><a class="btn btn--outline" href="https://www.google.com/maps/search/?api=1&amp;query={escape(n + ', ' + a).replace(' ', '+')}" target="_blank" rel="noopener">Directions</a></div>
</article>""" for i, (r, n, sub, roles, a, p) in enumerate(LOCATIONS))
    html = head("Contact Us", "Contact Dr Howard Fan: phone 1300 038 398, email admin@drfan.com.au, and consulting and operating locations across Sydney and Griffith NSW.", "contact.html")
    html += header("contact.html") + '<main id="main">\n'
    html += page_hero("Contact Us", "Contact Us", f'Email us at <a href="mailto:{EMAIL}">{EMAIL}</a>. Please email your referral letter with your contact details if you wish for us to contact you for an appointment.', [("Contact Us", None)])
    html += f"""<section class="section"><div class="container">
<div class="section-head section-head--row reveal"><div><p class="eyebrow">Locations</p><h2 class="section-title">Consulting &amp; Operating Locations</h2></div>
<a class="btn btn--primary" href="mailto:{EMAIL}?subject=Appointment%20request">{icon("mail", 18)} Email your referral</a></div>
<div class="contact-grid">{cards}</div>
</div></section>
"""
    html += book_band() + "</main>\n" + footer()
    write("contact.html", html)

def useful_links():
    links = [
        ("Queensland Health", "Informed consent forms and patient information sheets", "Search table page for informed consent forms and patient information sheets.", "https://www.health.qld.gov.au/consent/consent-forms-and-patient-information-sheets/search-consent-forms"),
        ("Queensland Health", "Gastroscopy (Upper Endoscopy)", "Gastroscopy (Upper Endoscopy) allows the doctor to inspect these areas as well as perform specialised procedures such as biopsies.", "https://conditions.health.qld.gov.au/HealthCondition/condition/9/180/834/gastroscopy-upper-endoscopy"),
        ("Queensland Health", "Colonoscopy", "A colonoscopy (scope) is the examination of the lower gastrointestinal tract to diagnose, and in some cases, treat problems.", "https://conditions.health.qld.gov.au/HealthCondition/condition/9/180/833/colonoscopy"),
        ("Cancer Council", "Bowel cancer screening", "Regular bowel cancer screening using an FOBT kit can pick up pre-cancerous polyps. Find out more about tests to help diagnose bowel cancer.", "https://www.cancer.org.au/cancer-information/causes-and-prevention/early-detection-and-screening/bowel-cancer-screening"),
    ]
    cards = "".join(f"""<a class="link-card reveal" href="{url}" target="_blank" rel="noopener" style="--d:{(i % 2) * 0.06:.2f}s">
<span class="link-card__source">{escape(src)}</span>
<h2>{escape(t)}</h2>
<p>{escape(d)}</p>
<span class="text-link">Visit site<span class="sr-only"> (opens in a new tab)</span> {icon("external")}</span>
</a>""" for i, (src, t, d, url) in enumerate(links))
    html = head("Useful Links", "External resources on consent forms, gastroscopy, colonoscopy and bowel cancer screening.", "useful-links.html")
    html += header("useful-links.html") + '<main id="main">\n'
    html += page_hero("Resources", "Useful Links", "Trusted external information about your procedure.", [("Resources", None), ("Useful Links", None)])
    html += f'<section class="section"><div class="container"><div class="link-grid">{cards}</div></div></section>\n'
    html += book_band() + "</main>\n" + footer()
    write("useful-links.html", html)

def other_resources():
    # To add the downloadable PDF: save it as assets/docs/bowel-preparation-instructions.pdf
    # and change the href below to that path.
    html = head("Other Resources", "Bowel preparation instructions and other resources for Dr Howard Fan’s patients.", "other-resources.html")
    html += header("other-resources.html") + '<main id="main">\n'
    html += page_hero("Resources", "Other Resources", "", [("Resources", None), ("Other Resources", None)])
    html += f"""<section class="section"><div class="container"><div class="link-grid">
<a class="link-card reveal" href="endoscopy.html#bowel-prep">
<span class="link-card__source">Colonoscopy</span>
<h2>Bowel Preparation Instructions</h2>
<p>What to eat and drink in the 3 days before your colonoscopy, and how to take your bowel preparation solution.</p>
<span class="text-link">View instructions {icon("arrow")}</span>
</a>
</div></div></section>
"""
    html += book_band() + "</main>\n" + footer()
    write("other-resources.html", html)

def extras():
    pages = ["", "laparoscopy.html", "endoscopy.html", "minor-operations.html", "operation-risks.html",
             "post-operative-instructions.html", "faqs.html", "contact.html", "useful-links.html", "other-resources.html"]
    urls = "".join(f"<url><loc>{BASE_URL}{p}</loc></url>" for p in pages)
    write("sitemap.xml", f'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{urls}</urlset>\n')
    write("robots.txt", f"User-agent: *\nAllow: /\nSitemap: {BASE_URL}sitemap.xml\n")
    four = head("Page not found", "The page you were looking for could not be found.", "404.html") + header() + f"""<main id="main">
{page_hero("404", "Page not found", "Sorry, that page doesn’t exist or has moved. Try one of the links below.", [("Page not found", None)])}
<section class="section"><div class="container"><div class="book-card__actions"><a class="btn btn--primary" href="index.html">Go to the homepage</a><a class="btn btn--outline" href="contact.html">Contact Us</a></div></div></section>
""" + book_band() + "</main>\n" + footer()
    write("404.html", four)

if __name__ == "__main__":
    home(); laparoscopy(); endoscopy(); minor_ops(); risks(); postop(); faqs_page(); contact(); useful_links(); other_resources(); extras()
