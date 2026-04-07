/**
 * ResumePreview — three recruiter-grade templates rendered with pure inline styles
 * so the component is fully self-contained for PDF export via window.print().
 *
 * Templates:
 *   Classic  — centered header, full-width page, Jake''s-Resume-inspired sections
 *   Modern   — dark-navy sidebar (210 px) + clean white main column
 *   Minimal  — ultra-clean editorial layout with accent top bar
 */
import type { ResumeData, ResumeStyle } from '@/types/resume';
import type { CSSProperties } from 'react';

/* ─── Font registry ─────────────────────────────────────────── */

export const FONT_FAMILIES: Record<string, string> = {
  inter:    "'Inter', 'Helvetica Neue', Arial, sans-serif",
  georgia:  "Georgia, 'Times New Roman', serif",
  playfair: "'Playfair Display', Georgia, serif",
};

export const FONT_LINK: Record<string, string> = {
  inter:    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  georgia:  '',
  playfair: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap',
};

/* ─── Spacing config ────────────────────────────────────────── */

const GAP: Record<string, { section: number; entry: number; bullet: number }> = {
  compact:  { section:  9, entry:  5, bullet: 1 },
  normal:   { section: 15, entry:  9, bullet: 2 },
  spacious: { section: 22, entry: 13, bullet: 4 },
};

/* ─── Shared helpers ────────────────────────────────────────── */

function contactParts(c: ResumeData['contact']) {
  return [c.email, c.phone, c.location, c.linkedin, c.github, c.website].filter(Boolean);
}

function lhFor(spacing: string) {
  return spacing === 'compact' ? 1.3 : spacing === 'spacious' ? 1.65 : 1.5;
}

/** Standard resume bullets — plain filled circle, no accent color */
function Bullets({ bullets, gap }: { bullets: string[]; gap: number }) {
  if (!bullets.length) return null;
  return (
    <div style={{ paddingLeft: 12 } as CSSProperties}>
      {bullets.map((b, i) => (
        <div
          key={i}
          style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: gap } as CSSProperties}
        >
          <span style={{ flexShrink: 0, fontSize: '7pt', marginTop: '0.3em', color: '#333' }}>&#9679;</span>
          <span style={{ flex: 1 }}>{b}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * CustomContent — renders `\n`-separated lines as bullet points.
 * Falls back to preformatted paragraph if no clear line breaks.
 */
function CustomContent({ content, gap, fsz = 9 }: { content: string; gap: number; fsz?: number }) {
  const lines = content.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length > 1) {
    return <Bullets bullets={lines} gap={gap} />;
  }
  return (
    <div style={{ fontSize: `${fsz}pt`, color: '#444', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
      {content}
    </div>
  );
}

/* ===============================================================
   CLASSIC — Executive one-column  (Jake''s-Resume style)
   Header   : name centred + contact with | separators + thin rule
   Sections : ALL-CAPS bold label + 1.5 px accent underline
   =============================================================== */

function ClassicSH({ title, color }: { title: string; color: string }) {
  return (
    <div style={{ marginBottom: 7 } as CSSProperties}>
      <span style={{
        fontSize: '8pt', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.1em', color: '#111',
      } as CSSProperties}>
        {title}
      </span>
      <div style={{ height: '1.5px', background: color, marginTop: 3 }} />
    </div>
  );
}

export function ClassicTemplate({ data, style }: { data: ResumeData; style: ResumeStyle }) {
  const sp    = GAP[style.spacing];
  const font  = FONT_FAMILIES[style.font];
  const color = style.primaryColor;
  const lh    = lhFor(style.spacing);
  const cl    = contactParts(data.contact);
  const fsz   = style.fontSize;

  return (
    <div style={{
      fontFamily: font, fontSize: `${fsz}pt`, color: '#1a1a1a',
      background: '#ffffff', padding: '46px 56px 52px',
      lineHeight: lh, minHeight: '1040px',
    } as CSSProperties}>

      {/* Name + contact header */}
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <div style={{
          fontSize: '22pt', fontWeight: 700, letterSpacing: '-0.015em',
          color: '#0d0d0d', lineHeight: 1.1, marginBottom: 7,
        }}>
          {data.contact.name || 'Your Name'}
        </div>
        {cl.length > 0 && (
          <div style={{ fontSize: '8.5pt', color: '#555', display: 'flex', justifyContent: 'center', flexWrap: 'wrap' } as CSSProperties}>
            {cl.map((p, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
                {i > 0 && <span style={{ margin: '0 8px', color: '#c0c0c0' }}>|</span>}
                {p}
              </span>
            ))}
          </div>
        )}
      </div>
      <div style={{ height: '0.8px', background: '#cccccc', marginBottom: sp.section }} />

      {data.summary && (
        <div style={{ marginBottom: sp.section }}>
          <ClassicSH title="Professional Summary" color={color} />
          <p style={{ margin: 0, color: '#333', lineHeight: 1.55 }}>{data.summary}</p>
        </div>
      )}

      {data.experience.length > 0 && (
        <div style={{ marginBottom: sp.section }}>
          <ClassicSH title="Experience" color={color} />
          {data.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: sp.entry }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' } as CSSProperties}>
                <span style={{ fontWeight: 700, fontSize: `${fsz + 0.5}pt`, color: '#0d0d0d' }}>
                  {exp.company || 'Company'}
                </span>
                <span style={{ fontSize: '8pt', color: '#777', flexShrink: 0, marginLeft: 10 }}>
                  {exp.startDate}{(exp.startDate && (exp.endDate || exp.current)) ? ' \u2013 ' : ''}{exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.role && (
                <div style={{ fontSize: `${fsz - 0.5}pt`, color, fontStyle: 'italic', marginTop: 1, marginBottom: 4 }}>
                  {exp.role}{exp.location ? `  \u00B7  ${exp.location}` : ''}
                </div>
              )}
              <Bullets bullets={exp.bullets} gap={sp.bullet} />
            </div>
          ))}
        </div>
      )}

      {data.education.length > 0 && (
        <div style={{ marginBottom: sp.section }}>
          <ClassicSH title="Education" color={color} />
          {data.education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: sp.entry }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' } as CSSProperties}>
                <span style={{ fontWeight: 700, fontSize: `${fsz + 0.5}pt`, color: '#0d0d0d' }}>
                  {edu.institution || 'Institution'}
                </span>
                <span style={{ fontSize: '8pt', color: '#777', flexShrink: 0, marginLeft: 10 }}>
                  {edu.startDate}{(edu.startDate && edu.endDate) ? ' \u2013 ' : ''}{edu.endDate}
                </span>
              </div>
              {(edu.degree || edu.field) && (
                <div style={{ fontSize: `${fsz - 0.5}pt`, color: '#444', fontStyle: 'italic', marginTop: 1 }}>
                  {[edu.degree, edu.field].filter(Boolean).join(', ')}
                  {edu.gpa ? `  \u00B7  GPA: ${edu.gpa}` : ''}
                </div>
              )}
              <Bullets bullets={edu.bullets} gap={sp.bullet} />
            </div>
          ))}
        </div>
      )}

      {data.skills.some((s) => s.skills.length > 0) && (
        <div style={{ marginBottom: sp.section }}>
          <ClassicSH title="Technical Skills" color={color} />
          {data.skills.filter((c) => c.skills.length > 0).map((cat) => (
            <div key={cat.id} style={{ display: 'flex', gap: 6, marginBottom: 4 } as CSSProperties}>
              <span style={{ fontWeight: 700, flexShrink: 0, color: '#111' }}>{cat.category}:</span>
              <span style={{ color: '#444' }}>{cat.skills.join(', ')}</span>
            </div>
          ))}
        </div>
      )}

      {data.projects.length > 0 && (
        <div style={{ marginBottom: sp.section }}>
          <ClassicSH title="Projects" color={color} />
          {data.projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: sp.entry }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' } as CSSProperties}>
                <span style={{ fontWeight: 700, fontSize: `${fsz + 0.5}pt`, color: '#0d0d0d' }}>
                  {proj.name || 'Project'}
                </span>
                {proj.link && (
                  <span style={{ fontSize: '8pt', color: '#666', flexShrink: 0, marginLeft: 10 }}>{proj.link}</span>
                )}
              </div>
              {proj.tech && (
                <div style={{ fontSize: `${fsz - 0.5}pt`, color: '#555', marginTop: 1, marginBottom: 3 }}>
                  <span style={{ fontWeight: 600 }}>Stack:</span> {proj.tech}
                </div>
              )}
              <Bullets bullets={proj.bullets} gap={sp.bullet} />
            </div>
          ))}
        </div>
      )}

      {data.customSections.map((sec) => (
        <div key={sec.id} style={{ marginBottom: sp.section }}>
          <ClassicSH title={sec.title} color={color} />
          <CustomContent content={sec.content} gap={sp.bullet} fsz={fsz} />
        </div>
      ))}
    </div>
  );
}

/* ===============================================================
   MODERN — Executive two-column
   Left  : 210 px dark-navy sidebar (name, role, contact, skills, education)
   Right : white main (accent-bar top, summary, experience, projects)
   =============================================================== */

export function ModernTemplate({ data, style }: { data: ResumeData; style: ResumeStyle }) {
  const sp    = GAP[style.spacing];
  const font  = FONT_FAMILIES[style.font];
  const color = style.primaryColor;
  const lh    = lhFor(style.spacing);
  const cl    = contactParts(data.contact);
  const fsz   = style.fontSize;
  const NAVY  = '#18212e';   // professional dark navy regardless of accent color

  const SideLabel = ({ title }: { title: string }) => (
    <div style={{
      fontSize: '7pt', fontWeight: 700, textTransform: 'uppercase' as const,
      letterSpacing: '0.12em', color,
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      paddingBottom: 4, marginBottom: 8, marginTop: sp.section,
    }}>
      {title}
    </div>
  );

  const MainSH = ({ title }: { title: string }) => (
    <div style={{ marginBottom: 7 }}>
      <span style={{ fontSize: '8pt', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#111' }}>
        {title}
      </span>
      <div style={{ height: '1.5px', background: color, marginTop: 3 }} />
    </div>
  );

  return (
    <div style={{ fontFamily: font, fontSize: `${fsz}pt`, display: 'flex', lineHeight: lh } as CSSProperties}>

      {/* Sidebar */}
      <div style={{
        width: 210, flexShrink: 0, background: NAVY, color: '#dde3ec',
        minHeight: '1040px', display: 'flex', flexDirection: 'column',
      } as CSSProperties}>
        <div style={{ height: 5, background: color, flexShrink: 0 }} />
        <div style={{ padding: '26px 20px 36px', flex: 1 }}>
          <div style={{ fontSize: '15.5pt', fontWeight: 700, lineHeight: 1.2, color: '#fff', marginBottom: 4, letterSpacing: '-0.01em' }}>
            {data.contact.name || 'Your Name'}
          </div>
          {data.experience[0]?.role && (
            <div style={{ fontSize: '8.5pt', color, fontWeight: 500, marginBottom: 18, lineHeight: 1.3 }}>
              {data.experience[0].role}
            </div>
          )}

          {cl.length > 0 && (
            <>
              <SideLabel title="Contact" />
              {cl.map((p, i) => (
                <div key={i} style={{ fontSize: '7.5pt', color: 'rgba(221,227,236,0.8)', marginBottom: 5, wordBreak: 'break-all', lineHeight: 1.45 }}>
                  {p}
                </div>
              ))}
            </>
          )}

          {data.skills.some((s) => s.skills.length > 0) && (
            <>
              <SideLabel title="Skills" />
              {data.skills.filter((c) => c.skills.length > 0).map((cat) => (
                <div key={cat.id} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: '7pt', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'rgba(221,227,236,0.5)', marginBottom: 4 }}>
                    {cat.category}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 3px' } as CSSProperties}>
                    {cat.skills.map((sk, i) => (
                      <span key={i} style={{
                        fontSize: '7.5pt', padding: '2px 7px', borderRadius: '3px',
                        background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                        color: 'rgba(221,227,236,0.88)',
                      }}>{sk}</span>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

          {data.education.length > 0 && (
            <>
              <SideLabel title="Education" />
              {data.education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: '8.5pt', fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>{edu.institution}</div>
                  <div style={{ fontSize: '7.5pt', color: 'rgba(221,227,236,0.75)', marginTop: 2 }}>
                    {[edu.degree, edu.field].filter(Boolean).join(', ')}
                  </div>
                  <div style={{ fontSize: '7.5pt', color: 'rgba(221,227,236,0.45)', marginTop: 1 }}>
                    {edu.startDate}{edu.endDate ? ` \u2013 ${edu.endDate}` : ''}{edu.gpa ? `  \u00B7  GPA ${edu.gpa}` : ''}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, background: '#fff', color: '#1a1a1a', display: 'flex', flexDirection: 'column' } as CSSProperties}>
        <div style={{ height: 5, background: color, flexShrink: 0 }} />
        <div style={{ padding: '28px 36px 40px', flex: 1 }}>

          {data.summary && (
            <div style={{ marginBottom: sp.section }}>
              <MainSH title="Professional Summary" />
              <p style={{ margin: 0, color: '#333', lineHeight: 1.55 }}>{data.summary}</p>
            </div>
          )}

          {data.experience.length > 0 && (
            <div style={{ marginBottom: sp.section }}>
              <MainSH title="Experience" />
              {data.experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: sp.entry }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' } as CSSProperties}>
                    <span style={{ fontWeight: 700, fontSize: `${fsz + 0.5}pt`, color: '#0d0d0d' }}>{exp.company}</span>
                    <span style={{ fontSize: '8pt', color: '#888', flexShrink: 0, marginLeft: 10 }}>
                      {exp.startDate}{(exp.startDate && (exp.endDate || exp.current)) ? ' \u2013 ' : ''}{exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.role && (
                    <div style={{ fontSize: `${fsz - 0.5}pt`, color, fontStyle: 'italic', marginTop: 1, marginBottom: 4 }}>
                      {exp.role}{exp.location ? `  \u00B7  ${exp.location}` : ''}
                    </div>
                  )}
                  <Bullets bullets={exp.bullets} gap={sp.bullet} />
                </div>
              ))}
            </div>
          )}

          {data.projects.length > 0 && (
            <div style={{ marginBottom: sp.section }}>
              <MainSH title="Projects" />
              {data.projects.map((proj) => (
                <div key={proj.id} style={{ marginBottom: sp.entry }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' } as CSSProperties}>
                    <span style={{ fontWeight: 700, fontSize: `${fsz + 0.5}pt`, color: '#0d0d0d' }}>{proj.name}</span>
                    {proj.link && <span style={{ fontSize: '8pt', color: '#777', flexShrink: 0, marginLeft: 10 }}>{proj.link}</span>}
                  </div>
                  {proj.tech && (
                    <div style={{ fontSize: `${fsz - 0.5}pt`, color: '#555', marginTop: 1, marginBottom: 3 }}>
                      <span style={{ fontWeight: 600 }}>Stack:</span> {proj.tech}
                    </div>
                  )}
                  <Bullets bullets={proj.bullets} gap={sp.bullet} />
                </div>
              ))}
            </div>
          )}

          {data.customSections.map((sec) => (
            <div key={sec.id} style={{ marginBottom: sp.section }}>
              <MainSH title={sec.title} />
              <CustomContent content={sec.content} gap={sp.bullet} fsz={fsz} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===============================================================
   MINIMAL — Ultra-clean editorial layout
   4 px accent bar bleeds edge-to-edge at top.
   Name in light-weight large uppercase tracking.
   Sections: 20 px accent slab + full-width grey rule.
   =============================================================== */

export function MinimalTemplate({ data, style }: { data: ResumeData; style: ResumeStyle }) {
  const sp    = GAP[style.spacing];
  const font  = FONT_FAMILIES[style.font];
  const color = style.primaryColor;
  const lh    = lhFor(style.spacing);
  const cl    = contactParts(data.contact);
  const fsz   = style.fontSize;

  const SH = ({ title }: { title: string }) => (
    <div style={{ marginTop: sp.section, marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 } as CSSProperties}>
        <div style={{ width: 20, height: '2.5px', background: color, borderRadius: 1, flexShrink: 0 }} />
        <span style={{ fontSize: '7.5pt', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.14em', color: '#111' }}>
          {title}
        </span>
      </div>
      <div style={{ height: '0.8px', background: '#d8d8d8' }} />
    </div>
  );

  return (
    <div style={{ fontFamily: font, fontSize: `${fsz}pt`, color: '#1a1a1a', background: '#fff', minHeight: '1040px' } as CSSProperties}>
      {/* Full-width accent bar */}
      <div style={{ height: 4, background: color }} />

      <div style={{ padding: '34px 56px 52px', lineHeight: lh }}>
        <div style={{
          fontSize: '24pt', fontWeight: 300, letterSpacing: '0.07em',
          textTransform: 'uppercase', color: '#0d0d0d', lineHeight: 1.1, marginBottom: 8,
        } as CSSProperties}>
          {data.contact.name || 'Your Name'}
        </div>

        {cl.length > 0 && (
          <div style={{ fontSize: '8.5pt', color: '#666', display: 'flex', flexWrap: 'wrap', marginBottom: 6 } as CSSProperties}>
            {cl.map((p, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
                {i > 0 && <span style={{ margin: '0 9px', color: '#bbb' }}>&middot;</span>}
                {p}
              </span>
            ))}
          </div>
        )}
        <div style={{ height: '1.5px', background: '#222', marginBottom: 2 }} />

        {data.summary && (
          <div>
            <SH title="Summary" />
            <p style={{ margin: 0, color: '#444', lineHeight: 1.55 }}>{data.summary}</p>
          </div>
        )}

        {data.experience.length > 0 && (
          <div>
            <SH title="Experience" />
            {data.experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: sp.entry }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' } as CSSProperties}>
                  <span style={{ fontWeight: 700, fontSize: `${fsz + 0.5}pt`, color: '#0d0d0d' }}>{exp.company}</span>
                  <span style={{ fontSize: '8pt', color: '#999', flexShrink: 0, marginLeft: 10 }}>
                    {exp.startDate}{(exp.startDate && (exp.endDate || exp.current)) ? ' \u2013 ' : ''}{exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.role && (
                  <div style={{ fontSize: `${fsz - 0.5}pt`, color, marginTop: 1, marginBottom: 3 }}>
                    {exp.role}{exp.location ? `  \u00B7  ${exp.location}` : ''}
                  </div>
                )}
                <Bullets bullets={exp.bullets} gap={sp.bullet} />
              </div>
            ))}
          </div>
        )}

        {data.education.length > 0 && (
          <div>
            <SH title="Education" />
            {data.education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: sp.entry }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' } as CSSProperties}>
                  <span style={{ fontWeight: 700, fontSize: `${fsz + 0.5}pt`, color: '#0d0d0d' }}>{edu.institution}</span>
                  <span style={{ fontSize: '8pt', color: '#999', flexShrink: 0, marginLeft: 10 }}>
                    {edu.startDate}{(edu.startDate && edu.endDate) ? ' \u2013 ' : ''}{edu.endDate}
                  </span>
                </div>
                {(edu.degree || edu.field) && (
                  <div style={{ fontSize: `${fsz - 0.5}pt`, color: '#555', marginTop: 1 }}>
                    {[edu.degree, edu.field].filter(Boolean).join(', ')}{edu.gpa ? `  \u00B7  GPA ${edu.gpa}` : ''}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {data.skills.some((s) => s.skills.length > 0) && (
          <div>
            <SH title="Skills" />
            {data.skills.filter((c) => c.skills.length > 0).map((cat) => (
              <div key={cat.id} style={{ display: 'flex', gap: 6, marginBottom: 4 } as CSSProperties}>
                <span style={{ fontWeight: 700, flexShrink: 0, color: '#111' }}>{cat.category}:</span>
                <span style={{ color: '#444' }}>{cat.skills.join(',  ')}</span>
              </div>
            ))}
          </div>
        )}

        {data.projects.length > 0 && (
          <div>
            <SH title="Projects" />
            {data.projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: sp.entry }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' } as CSSProperties}>
                  <span style={{ fontWeight: 700, fontSize: `${fsz + 0.5}pt`, color: '#0d0d0d' }}>{proj.name}</span>
                  {proj.link && <span style={{ fontSize: '8pt', color: '#888', flexShrink: 0, marginLeft: 10 }}>{proj.link}</span>}
                </div>
                {proj.tech && (
                  <div style={{ fontSize: `${fsz - 0.5}pt`, color: '#666', marginTop: 1, marginBottom: 3 }}>
                    <span style={{ fontWeight: 600 }}>Stack:</span> {proj.tech}
                  </div>
                )}
                <Bullets bullets={proj.bullets} gap={sp.bullet} />
              </div>
            ))}
          </div>
        )}

        {data.customSections.map((sec) => (
          <div key={sec.id}>
            <SH title={sec.title} />
            <CustomContent content={sec.content} gap={sp.bullet} fsz={fsz} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Public wrapper ────────────────────────────────────────── */

export function ResumePreview({ data, style }: { data: ResumeData; style: ResumeStyle }) {
  if (style.template === 'modern')  return <ModernTemplate  data={data} style={style} />;
  if (style.template === 'minimal') return <MinimalTemplate data={data} style={style} />;
  return <ClassicTemplate data={data} style={style} />;
}
