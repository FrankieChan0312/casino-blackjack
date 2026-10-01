// Original vector characters. No photographs, external artwork or real likeness.
export function CasinoPerson({ kind }: { kind: 'dealer' | 'suit' | 'gown' | 'tux' }) {
  const female = kind === 'dealer' || kind === 'gown';
  const dealer = kind === 'dealer';
  const skin = kind === 'gown' ? '#a86b48' : kind === 'suit' ? '#d19a76' : '#edbb99';
  const hair = kind === 'tux' ? '#c5cbc5' : kind === 'gown' ? '#241b20' : '#38281f';
  const label = dealer ? 'Original illustrated female dealer in professional attire' : 'Original illustrated computer guest in evening attire';
  return <svg className={`casino-person person-${kind}`} viewBox="0 0 180 220" role="img" aria-label={label}>
    <ellipse cx="90" cy="208" rx="76" ry="9" fill="#061b16" opacity=".35" />
    {!dealer && <><rect x="24" y="110" width="132" height="95" rx="27" fill="#362d29" stroke="#a18d60" strokeWidth="3" />
      <path d="M33 129 Q90 96 147 129" fill="none" stroke="#b29763" opacity=".5" /></>}
    {female && <path d="M50 83 Q34 24 79 15 Q134 5 138 64 L134 134 L46 134Z" fill={hair} />}
    {dealer && <ellipse cx="126" cy="31" rx="17" ry="20" fill={hair} />}
    <path d="M71 91 L69 124 L110 124 L108 91" fill={skin} />
    <path d="M71 106 Q91 119 108 105 L108 95 L71 95Z" fill="#6c3929" opacity=".22" />
    <path d="M48 128 Q65 112 72 115 L108 115 Q129 117 138 130 L160 207 L20 207Z"
      fill={kind === 'gown' ? '#184e4b' : dealer ? '#f1ede1' : '#18252d'} />
    {kind === 'gown' ? <><path d="M72 115 Q90 134 108 115 L118 207 L60 207Z" fill="#226660" />
      <path d="M70 121 Q90 146 111 121" fill="none" stroke="#d7bc7c" strokeWidth="3" /></>
      : <><path d="M72 114 L90 132 L108 114 L105 196 L75 196Z" fill="#f8f4e9" />
        <path d="M70 114 L89 151 L75 207 L41 207 L50 134Z M110 114 L91 151 L106 207 L142 207 L131 134Z" fill={dealer ? '#20372e' : '#273741'} />
        <path d="M70 116 L62 132 L79 147 M110 116 L119 132 L102 147" fill="none" stroke="#b19b6b" strokeWidth="2" />
        <path d="M74 124 L89 132 L106 124 L104 141 L90 134 L76 141Z" fill={kind === 'suit' ? '#703e40' : '#182620'} />
        <circle cx="91" cy="157" r="2" fill="#aa925d" /><circle cx="91" cy="181" r="2" fill="#aa925d" />
        {dealer && <rect x="109" y="151" width="19" height="7" rx="2" fill="#d4b97b" />}</>}
    <path d="M47 137 Q38 165 39 190 L65 195 M132 137 Q143 166 139 190 L114 195" fill="none" stroke={dealer ? '#e8e2d3' : kind === 'gown' ? '#23665f' : '#273741'} strokeWidth="21" strokeLinecap="round" />
    <ellipse cx="69" cy="197" rx="14" ry="6" fill={skin} /><ellipse cx="110" cy="197" rx="14" ry="6" fill={skin} />
    <ellipse cx="49" cy="71" rx="7" ry="12" fill={skin} /><ellipse cx="131" cy="71" rx="7" ry="12" fill={skin} />
    <path d="M51 48 Q55 20 91 22 Q129 22 131 53 L127 81 Q117 108 90 111 Q63 106 54 83Z" fill={skin} />
    <path d={female ? 'M50 57 Q45 23 81 16 Q122 9 134 48 Q105 46 89 27 Q74 48 50 57Z' : 'M50 56 L51 35 Q79 9 111 23 Q136 31 130 56 L121 43 Q90 51 67 37 L59 57Z'} fill={hair} />
    <path d="M64 58 Q73 54 80 58 M102 58 Q111 54 118 58" fill="none" stroke={hair} strokeWidth="3" strokeLinecap="round" />
    <path d="M64 68 Q73 62 81 68 M101 68 Q110 62 118 68" fill="none" stroke="#33251e" strokeWidth="2" />
    <ellipse cx="73" cy="68" rx="3" ry="3.5" fill="#302b27" /><ellipse cx="109" cy="68" rx="3" ry="3.5" fill="#302b27" />
    <circle cx="74" cy="67" r="1" fill="#fff5df" /><circle cx="110" cy="67" r="1" fill="#fff5df" />
    <path d="M91 68 L87 81 L94 83" fill="none" stroke="#a87355" strokeWidth="2" strokeLinecap="round" />
    <path d="M78 92 Q91 100 104 91 Q91 94 78 92" fill={female ? '#974d54' : '#975e4e'} />
    {female && <><circle cx="54" cy="85" r="3" fill="#d8bf7f" /><circle cx="128" cy="85" r="3" fill="#d8bf7f" /></>}
    {kind === 'tux' && <path d="M63 79 Q71 82 78 79 M103 79 Q111 82 119 79" stroke="#b47e60" fill="none" opacity=".5" />}
  </svg>;
}
