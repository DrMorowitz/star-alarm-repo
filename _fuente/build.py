import pathlib, re
S=pathlib.Path(__file__).parent; src=S/'src'; out=S/'dist'; out.mkdir(exist_ok=True)
WA='https://wa.me/50766785785?text='+'Hola%20Star%20Alarm%2C%20quiero%20cotizar%20un%20sistema%20de%20seguridad.'
ico=lambda d:f'<svg viewBox="0 0 24 24" aria-hidden="true">{d}</svg>'
I={
 'ICO_WA':'<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>',
 'ICO_ROBO':ico('<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>'),
 'ICO_CAM':ico('<path d="M3 7h12l3 3v4l-3 3H3z"/><circle cx="9" cy="12" r="2.5"/><path d="M18 12h3"/>'),
 'ICO_MON':ico('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
 'ICO_FUEGO':ico('<path d="M12 3s5 4.5 5 9.5A5 5 0 0 1 7 12.5C7 10 9 9 9 6c1.5 1 3 3 3 3s0-3 0-6Z"/>'),
 'ICO_ACC':ico('<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M9 17h6"/>'),
 'ICO_PLANO':ico('<path d="M4 4h16v16H4z"/><path d="M4 12h8V4M12 16h8"/><circle cx="16" cy="8" r="1.6" fill="currentColor"/>'),
 'FONTS':'<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet">',
}
part=lambda n:(src/f'_{n}.html').read_text()
for page,cur in [('index','INICIO'),('servicios','SERV'),('contacto','CONT')]:
    h=(src/f'{page}.html').read_text()
    h=h.replace('{{NAV}}',part('nav')).replace('{{PIE}}',part('pie')).replace('{{COTIZAR}}',part('cotizar'))
    for k in ['INICIO','SERV','CONT']:
        h=h.replace('{{CUR_'+k+'}}','aria-current="page"' if k==cur else '')
    for k,v in I.items(): h=h.replace('{{'+k+'}}',v)
    h=h.replace('{{WA}}',WA)
    left=re.findall(r'\{\{\w+\}\}',h); assert not left,(page,left)
    (out/f'{page}.html').write_text(h)
(out/'styles.css').write_text((S/'styles.css').read_text())
(out/'vercel.json').write_text('{"cleanUrls":true,"trailingSlash":false,"headers":[{"source":"/(.*)","headers":[{"key":"X-Robots-Tag","value":"noindex"}]}]}')
(out/'robots.txt').write_text("# DEMO: bloqueado. Al lanzar: Allow: / y Sitemap\nUser-agent: *\nDisallow: /\n")
(out/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join(f'<url><loc>https://www.staralarmpanama.com/{p}</loc></url>' for p in ['','servicios','contacto'])+'</urlset>\n')
(out/'llms.txt').write_text("""# Star Alarm
> Empresa panameña (Star Alarm S.A.) con más de 20 años. Alarmas contra robo e incendio, cámaras CCTV con video analytics, monitoreo 24/7 y control de acceso para casas, negocios, PH e industria en Panamá.

## Datos
- Teléfono: +507 263-6380 · WhatsApp: +507 6678-5785 · ventas@staralarmpanama.com
- Monitoreo y soporte 24/7
- Trayectoria: +4,000 alarmas, +3,000 cámaras, +200 sistemas de control de acceso
- Marcas: Honeywell/Resideo, Notifier, Silent Knight, Edwards, Hikvision, Dahua, HID, ZKTeco, IrisID
- Clientes: UPS, Grupo Melo, Panamed, Aquaviva, DDP, QLU

## Páginas
- [Inicio](https://www.staralarmpanama.com/): qué hacemos y cómo responde el monitoreo
- [Servicios](https://www.staralarmpanama.com/servicios): alarma contra robo, cámaras y video analytics, monitoreo 24/7, incendio, control de acceso
- [Contacto](https://www.staralarmpanama.com/contacto): WhatsApp, horario y ubicación
""")
print('ok', [p.name for p in out.iterdir()])
