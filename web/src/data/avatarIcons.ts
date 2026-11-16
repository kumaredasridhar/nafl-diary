// NAFL Digital School Diary++
// Stylized graphic outline vector avatars for personas (Child, Parents, Grandparents, Driver, Nanny, etc.)

function makeSvgDataUri(svg: string): string {
  // Use URL-safe encoding so it works natively in <img src="..." />
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

export const AVATAR_STUDENT_BOY = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#ede9fe" stroke="#818cf8" stroke-width="2"/>
  <!-- Head -->
  <circle cx="50" cy="47" r="21" fill="#ffffff" stroke="#1e293b" stroke-width="2.5"/>
  <!-- Boy Hair Fringe -->
  <path d="M29 44 C30 28 42 24 50 25 C58 24 70 28 71 44 C66 35 59 32 50 34 C41 32 34 35 29 44 Z" fill="#1e293b"/>
  <!-- Eyes -->
  <circle cx="43" cy="47" r="2.5" fill="#1e293b"/>
  <circle cx="57" cy="47" r="2.5" fill="#1e293b"/>
  <!-- Smile -->
  <path d="M44 55 Q50 61 56 55" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Cheeks -->
  <circle cx="39" cy="53" r="2" fill="#f43f5e" opacity="0.4"/>
  <circle cx="61" cy="53" r="2" fill="#f43f5e" opacity="0.4"/>
  <!-- School Polo Shirt -->
  <path d="M25 88 C25 73 36 69 50 69 C64 69 75 73 75 88 Z" fill="#0284c7" stroke="#1e293b" stroke-width="2.5"/>
  <path d="M42 69 L50 80 L58 69 Z" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
  <circle cx="50" cy="83" r="1.5" fill="#ffffff"/>
</svg>
`);

export const AVATAR_STUDENT_GIRL = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#ffe4e6" stroke="#fb7185" stroke-width="2"/>
  <!-- Pigtails / Hair Ribbons -->
  <circle cx="25" cy="42" r="7" fill="#f43f5e"/>
  <circle cx="75" cy="42" r="7" fill="#f43f5e"/>
  <!-- Head -->
  <circle cx="50" cy="47" r="21" fill="#ffffff" stroke="#1e293b" stroke-width="2.5"/>
  <!-- Hair & Bangs -->
  <path d="M29 46 C29 28 42 24 50 25 C58 24 71 28 71 46 C67 36 60 32 50 34 C40 32 33 36 29 46 Z" fill="#1e293b"/>
  <!-- Eyes -->
  <circle cx="43" cy="47" r="2.5" fill="#1e293b"/>
  <circle cx="57" cy="47" r="2.5" fill="#1e293b"/>
  <!-- Smile -->
  <path d="M44 55 Q50 61 56 55" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Cheeks -->
  <circle cx="39" cy="53" r="2.5" fill="#f43f5e" opacity="0.45"/>
  <circle cx="61" cy="53" r="2.5" fill="#f43f5e" opacity="0.45"/>
  <!-- School Polo -->
  <path d="M25 88 C25 73 36 69 50 69 C64 69 75 73 75 88 Z" fill="#0284c7" stroke="#1e293b" stroke-width="2.5"/>
  <path d="M42 69 L50 80 L58 69 Z" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
</svg>
`);

export const AVATAR_FATHER = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2"/>
  <!-- Head -->
  <circle cx="50" cy="46" r="19" fill="#ffffff" stroke="#1e293b" stroke-width="2.5"/>
  <!-- Side-Part Hair -->
  <path d="M31 42 C30 27 44 24 54 25 C66 26 69 34 69 42 C67 33 55 30 50 32 C41 31 34 35 31 42 Z" fill="#1e293b"/>
  <!-- Modern Glasses -->
  <rect x="37" y="42" width="10" height="7" rx="2" fill="none" stroke="#1e293b" stroke-width="2"/>
  <rect x="53" y="42" width="10" height="7" rx="2" fill="none" stroke="#1e293b" stroke-width="2"/>
  <line x1="47" y1="45" x2="53" y2="45" stroke="#1e293b" stroke-width="2"/>
  <circle cx="42" cy="45.5" r="1.5" fill="#1e293b"/>
  <circle cx="58" cy="45.5" r="1.5" fill="#1e293b"/>
  <!-- Smile -->
  <path d="M44 56 Q50 61 56 56" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round"/>
  <!-- Shirt & Tie -->
  <path d="M24 88 C24 72 35 67 50 67 C65 67 76 72 76 88 Z" fill="#ffffff" stroke="#1e293b" stroke-width="2.5"/>
  <path d="M42 67 L50 78 L58 67" fill="none" stroke="#1e293b" stroke-width="2"/>
  <path d="M48 76 L52 76 L54 88 L46 88 Z" fill="#2563eb" stroke="#1e293b" stroke-width="1.5"/>
</svg>
`);

export const AVATAR_MOTHER = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#fae8ff" stroke="#d8b4fe" stroke-width="2"/>
  <!-- Head -->
  <circle cx="50" cy="47" r="19" fill="#ffffff" stroke="#1e293b" stroke-width="2.5"/>
  <!-- Wavy Hair -->
  <path d="M28 55 C26 40 28 26 50 26 C72 26 74 40 72 55 C68 44 67 34 50 34 C33 34 32 44 28 55 Z" fill="#1e293b"/>
  <!-- Eyes -->
  <circle cx="43" cy="47" r="2.5" fill="#1e293b"/>
  <circle cx="57" cy="47" r="2.5" fill="#1e293b"/>
  <!-- Smile -->
  <path d="M44 56 Q50 61 56 56" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Pearl Earrings -->
  <circle cx="30" cy="50" r="2" fill="#d8b4fe" stroke="#1e293b" stroke-width="1"/>
  <circle cx="70" cy="50" r="2" fill="#d8b4fe" stroke="#1e293b" stroke-width="1"/>
  <!-- Blouse with graceful neckline -->
  <path d="M24 88 C24 72 35 68 50 68 C65 68 76 72 76 88 Z" fill="#fdf4ff" stroke="#1e293b" stroke-width="2.5"/>
  <path d="M43 68 Q50 75 57 68" fill="none" stroke="#a855f7" stroke-width="2"/>
</svg>
`);

export const AVATAR_GRANDFATHER = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
  <!-- Head -->
  <circle cx="50" cy="46" r="20" fill="#ffffff" stroke="#1e293b" stroke-width="2.5"/>
  <!-- Side Hair (Bald Top) -->
  <path d="M30 46 C29 36 34 32 37 32 C36 40 33 46 32 52 Z" fill="#94a3b8"/>
  <path d="M70 46 C71 36 66 32 63 32 C64 40 67 46 68 52 Z" fill="#94a3b8"/>
  <!-- Round Wire Glasses -->
  <circle cx="42" cy="45" r="5.5" fill="none" stroke="#1e293b" stroke-width="2"/>
  <circle cx="58" cy="45" r="5.5" fill="none" stroke="#1e293b" stroke-width="2"/>
  <line x1="47.5" y1="45" x2="52.5" y2="45" stroke="#1e293b" stroke-width="2"/>
  <circle cx="42" cy="45" r="1.5" fill="#1e293b"/>
  <circle cx="58" cy="45" r="1.5" fill="#1e293b"/>
  <!-- Distinguished Mustache -->
  <path d="M40 54 Q50 51 60 54 Q50 59 40 54 Z" fill="#64748b" stroke="#1e293b" stroke-width="1.5"/>
  <!-- Smile under mustache -->
  <path d="M46 60 Q50 62 54 60" fill="none" stroke="#1e293b" stroke-width="1.5" stroke-linecap="round"/>
  <!-- Cozy Cardigan -->
  <path d="M24 88 C24 72 36 68 50 68 C64 68 76 72 76 88 Z" fill="#ffffff" stroke="#1e293b" stroke-width="2.5"/>
  <path d="M43 68 L50 79 L57 68" fill="none" stroke="#f59e0b" stroke-width="2"/>
  <circle cx="50" cy="83" r="1.5" fill="#f59e0b"/>
</svg>
`);

export const AVATAR_GRANDMOTHER = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#ecfdf5" stroke="#10b981" stroke-width="2"/>
  <!-- Hair Bun on Top -->
  <circle cx="50" cy="22" r="8" fill="#e2e8f0" stroke="#1e293b" stroke-width="2.5"/>
  <!-- Head -->
  <circle cx="50" cy="48" r="20" fill="#ffffff" stroke="#1e293b" stroke-width="2.5"/>
  <!-- Gray Hair Wave -->
  <path d="M30 46 C32 32 44 28 50 32 C56 28 68 32 70 46 C65 37 58 35 50 37 C42 35 35 37 30 46 Z" fill="#94a3b8"/>
  <!-- Round Spectacles -->
  <circle cx="42" cy="47" r="5.5" fill="none" stroke="#1e293b" stroke-width="2"/>
  <circle cx="58" cy="47" r="5.5" fill="none" stroke="#1e293b" stroke-width="2"/>
  <line x1="47.5" y1="47" x2="52.5" y2="47" stroke="#1e293b" stroke-width="2"/>
  <circle cx="42" cy="47" r="1.5" fill="#1e293b"/>
  <circle cx="58" cy="47" r="1.5" fill="#1e293b"/>
  <!-- Gentle Smile -->
  <path d="M44 58 Q50 63 56 58" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Traditional Saree / Shawl Collar -->
  <path d="M24 88 C24 73 36 70 50 70 C64 70 76 73 76 88 Z" fill="#ffffff" stroke="#1e293b" stroke-width="2.5"/>
  <path d="M32 88 L46 70 L54 70 L68 88" fill="none" stroke="#10b981" stroke-width="2"/>
</svg>
`);

export const AVATAR_DRIVER = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
  <!-- Head -->
  <circle cx="50" cy="48" r="19" fill="#ffffff" stroke="#1e293b" stroke-width="2.5"/>
  <!-- Chauffeur Peaked Cap Crown -->
  <path d="M28 39 C28 27 72 27 72 39 Z" fill="#0284c7" stroke="#1e293b" stroke-width="2.5"/>
  <!-- Cap Visor / Brim -->
  <path d="M26 39 C34 43 66 43 74 39 C70 46 30 46 26 39 Z" fill="#0f172a" stroke="#1e293b" stroke-width="1.5"/>
  <!-- Cap Gold Shield Badge -->
  <path d="M48 30 L52 30 L53 35 L50 37 L47 35 Z" fill="#facc15" stroke="#1e293b" stroke-width="1"/>
  <!-- Eyes -->
  <circle cx="43" cy="48" r="2.5" fill="#1e293b"/>
  <circle cx="57" cy="48" r="2.5" fill="#1e293b"/>
  <!-- Confident Smile -->
  <path d="M44 56 Q50 61 56 56" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Uniform Jacket -->
  <path d="M24 88 C24 72 36 68 50 68 C64 68 76 72 76 88 Z" fill="#ffffff" stroke="#1e293b" stroke-width="2.5"/>
  <path d="M42 68 L50 82 L58 68" fill="none" stroke="#0284c7" stroke-width="2"/>
  <path d="M48 76 L52 76 L53 88 L47 88 Z" fill="#0f172a"/>
</svg>
`);

export const AVATAR_NANNY = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#ccfbf1" stroke="#14b8a6" stroke-width="2"/>
  <!-- Hair Bun -->
  <circle cx="50" cy="24" r="7" fill="#1e293b"/>
  <!-- Head -->
  <circle cx="50" cy="47" r="19" fill="#ffffff" stroke="#1e293b" stroke-width="2.5"/>
  <!-- Neat Hair Part -->
  <path d="M31 46 C32 32 44 28 50 32 C56 28 68 32 69 46 C65 37 58 35 50 37 C42 35 35 37 31 46 Z" fill="#1e293b"/>
  <!-- Eyes -->
  <circle cx="43" cy="47" r="2.5" fill="#1e293b"/>
  <circle cx="57" cy="47" r="2.5" fill="#1e293b"/>
  <!-- Warm Caring Smile -->
  <path d="M44 55 Q50 61 56 55" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Cheeks -->
  <circle cx="39" cy="53" r="2" fill="#14b8a6" opacity="0.3"/>
  <circle cx="61" cy="53" r="2" fill="#14b8a6" opacity="0.3"/>
  <!-- Caregiver Apron Dress -->
  <path d="M24 88 C24 72 36 68 50 68 C64 68 76 72 76 88 Z" fill="#f0fdfa" stroke="#1e293b" stroke-width="2.5"/>
  <path d="M41 72 L41 88 M59 72 L59 88" stroke="#14b8a6" stroke-width="2"/>
</svg>
`);

export const AVATAR_UNCLE = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#e0e7ff" stroke="#6366f1" stroke-width="2"/>
  <!-- Head -->
  <circle cx="50" cy="46" r="19" fill="#ffffff" stroke="#1e293b" stroke-width="2.5"/>
  <!-- Modern Casual Hair -->
  <path d="M31 40 C30 26 44 23 52 24 C64 25 69 31 69 40 C66 33 58 30 50 32 C42 30 35 34 31 40 Z" fill="#1e293b"/>
  <!-- Eyes -->
  <circle cx="43" cy="46" r="2.5" fill="#1e293b"/>
  <circle cx="57" cy="46" r="2.5" fill="#1e293b"/>
  <!-- Smile -->
  <path d="M44 55 Q50 60 56 55" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Casual Polo Shirt -->
  <path d="M24 88 C24 72 36 68 50 68 C64 68 76 72 76 88 Z" fill="#ffffff" stroke="#1e293b" stroke-width="2.5"/>
  <path d="M42 68 L50 79 L58 68" fill="none" stroke="#6366f1" stroke-width="2"/>
</svg>
`);

// Preset list for 1-tap guardian avatar selection
export const GUARDIAN_AVATAR_PRESETS = [
  { label: '👴 Grandfather', role: 'Grandfather', url: AVATAR_GRANDFATHER },
  { label: '👵 Grandmother', role: 'Grandmother', url: AVATAR_GRANDMOTHER },
  { label: '👨 Uncle', role: 'Uncle', url: AVATAR_UNCLE },
  { label: '🚗 Driver', role: 'Family Driver', url: AVATAR_DRIVER },
  { label: '👩 Nanny', role: 'Daycare Nanny', url: AVATAR_NANNY },
];
