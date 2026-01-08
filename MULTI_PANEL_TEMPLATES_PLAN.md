# Multi-Panel Brochure Templates - Implementation Plan

## 📋 Overview

Your client wants templates like the attached brochure image - **multi-panel layouts** with sections for:
- Events/Calendar
- Contact Information
- Social Media Links
- Multiple Images
- Campaign Messages
- Logo Placement

## 🎯 Current vs. Desired State

### Current Templates (Single-Panel)
- ✅ Single A4 page (210mm × 297mm)
- ✅ Basic sections: Header, Title, Description, Features
- ✅ Simple layouts (top-to-bottom flow)

### Desired Templates (Multi-Panel)
- 🎨 **3-Panel Vertical Layout** (like your image)
- 🎨 **2-Panel Horizontal Layout** (folded brochure)
- 🎨 **4-Panel Accordion** (Z-fold)
- 🎨 **Custom Panel Arrangements**

## 🏗️ Architecture Plan

### Phase 1: Extend Data Model

**Current `ProductData` Interface:**
```typescript
interface ProductData {
  productName: string
  description: string
  features: string[]
  audience: 'B2B' | 'B2C' | 'Enterprise' | 'SMB'
  language: 'en' | 'zh-CN' | 'nl'
  imageUrl: string | null
}
```

**Extended `ProductData` Interface:**
```typescript
interface ProductData {
  // Existing fields
  productName: string
  description: string
  features: string[]
  audience: 'B2B' | 'B2C' | 'Enterprise' | 'SMB'
  language: 'en' | 'zh-CN' | 'nl'
  imageUrl: string | null
  
  // NEW: Multi-panel support
  logoUrl?: string | null
  companyName?: string
  contactInfo?: {
    website?: string
    email?: string
    phone?: string
    address?: string
  }
  socialMedia?: {
    facebook?: string
    linkedin?: string
    twitter?: string
    instagram?: string
  }
  events?: Array<{
    title: string
    date: string
    time?: string
    location?: string
  }>
  campaignMessage?: string
  additionalImages?: string[]  // Multiple images for different panels
  ctaText?: string  // Call-to-action
  ctaLink?: string
}
```

### Phase 2: Template Structure

**New Template Types:**
1. **`three-panel-vertical`** - Like your image (3 columns)
2. **`two-panel-horizontal`** - Front/Back (folded)
3. **`four-panel-accordion`** - Z-fold style
4. **`magazine-spread`** - 2-page spread
5. **`event-brochure`** - Event-focused (like your image)

### Phase 3: Template Component Structure

**Example: Three-Panel Vertical Template**

```typescript
// frontend/src/components/templates/ThreePanelVertical.tsx

export default function ThreePanelVertical({ data, variant }: TemplateProps) {
  const panelWidth = '70mm'  // 210mm / 3 = 70mm per panel
  
  return (
    <div style={{ 
      width: '210mm', 
      height: '297mm',
      display: 'flex',  // Horizontal flex for 3 panels
      backgroundColor: '#FFFFFF'
    }}>
      {/* LEFT PANEL */}
      <div style={{ 
        width: panelWidth,
        backgroundColor: '#F5F5DC',  // Cream/beige
        padding: '12mm',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        {/* Events Section */}
        <div>
          <h3 style={{ color: '#FFB6C1', textDecoration: 'underline' }}>
            Upcoming Events
          </h3>
          {data.events?.map((event, i) => (
            <div key={i} style={{ marginTop: '8mm' }}>
              <span style={{ color: '#87CEEB' }}>→</span>
              <div>{event.title}</div>
              <div style={{ fontSize: '10pt' }}>{event.date}</div>
            </div>
          ))}
        </div>
        
        {/* Image Section */}
        {data.additionalImages?.[0] && (
          <div style={{ 
            borderRadius: '50%', 
            overflow: 'hidden',
            marginTop: 'auto'
          }}>
            <img 
              src={data.additionalImages[0]} 
              alt="Support"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        )}
      </div>

      {/* MIDDLE PANEL */}
      <div style={{ 
        width: panelWidth,
        backgroundColor: '#FFB6C1',  // Pink
        padding: '12mm',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        {data.logoUrl && (
          <div style={{ 
            width: '40mm', 
            height: '40mm',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img src={data.logoUrl} alt="Logo" style={{ maxWidth: '80%' }} />
          </div>
        )}

        {/* Get Involved Section */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '24pt', marginBottom: '12mm' }}>
            Get Involved!
          </h2>
          
          {/* Contact Info */}
          {data.contactInfo && (
            <div style={{ fontSize: '11pt', marginBottom: '12mm' }}>
              {data.contactInfo.website && <div>{data.contactInfo.website}</div>}
              {data.contactInfo.email && <div>{data.contactInfo.email}</div>}
              {data.contactInfo.phone && <div>{data.contactInfo.phone}</div>}
            </div>
          )}

          {/* Social Media */}
          {data.socialMedia && (
            <div>
              <div style={{ fontSize: '10pt', marginBottom: '4mm' }}>FOLLOW US</div>
              <div style={{ display: 'flex', gap: '4mm', justifyContent: 'center' }}>
                {data.socialMedia.facebook && <SocialIcon type="facebook" />}
                {data.socialMedia.linkedin && <SocialIcon type="linkedin" />}
                {data.socialMedia.twitter && <SocialIcon type="twitter" />}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ 
        width: panelWidth,
        backgroundColor: '#F5F5DC',  // Cream/beige
        padding: '12mm',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Blue Semi-circle Top */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '80mm',
          backgroundColor: '#87CEEB',
          borderRadius: '0 0 50% 50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12mm'
        }}>
          <h2 style={{ fontSize: '20pt', textAlign: 'center' }}>
            {variant.headline}
          </h2>
          <p style={{ fontSize: '14pt', textDecoration: 'underline' }}>
            {variant.tagline}
          </p>
        </div>

        {/* Image Section */}
        {data.additionalImages?.[1] && (
          <div style={{ 
            marginTop: '80mm',
            borderRadius: '50%',
            overflow: 'hidden'
          }}>
            <img 
              src={data.additionalImages[1]} 
              alt="Meditation"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        )}

        {/* Campaign Message Bottom */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60mm',
          backgroundColor: '#F5F5DC',
          borderRadius: '50% 50% 0 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12mm'
        }}>
          <h3 style={{ fontSize: '16pt', textAlign: 'center' }}>
            {data.campaignMessage || data.productName}
          </h3>
          {data.logoUrl && (
            <img 
              src={data.logoUrl} 
              alt="Logo" 
              style={{ width: '20mm', marginTop: '4mm' }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
```

## 🔄 Integration Steps

### Step 1: Update Input Forms
- **Manual Input Tab**: Add fields for:
  - Logo upload
  - Contact information (website, email, phone)
  - Social media links
  - Events (add/remove events)
  - Campaign message
  - Additional images (multiple uploads)

### Step 2: Update Backend API
- Extend `/api/generate-variants` to accept new fields
- Update web scraper to extract:
  - Contact info from websites
  - Social media links
  - Events/calendar data (if available)

### Step 3: Add New Templates
- Create `ThreePanelVertical.tsx`
- Create `TwoPanelHorizontal.tsx`
- Create `FourPanelAccordion.tsx`
- Create `EventBrochure.tsx`

### Step 4: Update Template Selection
- Add new template options in `TemplateStep.tsx`
- Update `TemplateRenderer.tsx` switch statement
- Add preview cards for new templates

### Step 5: PDF Generation
- Current PDF generation should work (html2canvas captures entire div)
- May need to adjust scale for multi-panel layouts

## 📐 Layout Specifications

### Three-Panel Vertical (Like Your Image)
- **Total Size**: 210mm × 297mm (A4)
- **Panel Width**: 70mm each (210mm ÷ 3)
- **Panel Height**: 297mm (full height)
- **Gap**: 0mm (seamless) or 2mm (with gap)

### Two-Panel Horizontal (Folded Brochure)
- **Total Size**: 420mm × 297mm (A3, folded to A4)
- **Panel Width**: 210mm each
- **Panel Height**: 297mm
- **Fold**: Center vertical line

### Four-Panel Accordion (Z-Fold)
- **Total Size**: 840mm × 297mm (4 × A4 width)
- **Panel Width**: 210mm each
- **Panel Height**: 297mm
- **Folds**: At 210mm, 420mm, 630mm

## 🎨 Design System

### Color Schemes (Based on Your Image)
1. **Cream/Beige**: `#F5F5DC`
2. **Pink**: `#FFB6C1`
3. **Light Blue**: `#87CEEB`
4. **Dark Gray Text**: `#374151`
5. **White**: `#FFFFFF`

### Typography
- **Headings**: Sans-serif, bold, 18-24pt
- **Body**: Sans-serif, regular, 11-13pt
- **Events**: Sans-serif, regular, 10-11pt

### Spacing
- **Panel Padding**: 12mm
- **Section Gap**: 8-12mm
- **Element Gap**: 4-6mm

## 🚀 Implementation Priority

### Phase 1 (Quick Win - 1-2 days)
1. ✅ Extend `ProductData` interface
2. ✅ Update `ManualInputTab` with new fields
3. ✅ Create `ThreePanelVertical` template
4. ✅ Add to template selection

### Phase 2 (Medium - 2-3 days)
1. ✅ Create `TwoPanelHorizontal` template
2. ✅ Update web scraper for contact info
3. ✅ Add logo upload functionality
4. ✅ Social media icons component

### Phase 3 (Advanced - 3-4 days)
1. ✅ Create `FourPanelAccordion` template
2. ✅ Event calendar component
3. ✅ Multiple image upload/management
4. ✅ Template preview improvements

## 💡 Key Considerations

1. **Responsive Design**: Templates must work at 60% scale (preview) and 100% scale (PDF)
2. **Print Quality**: Ensure 300 DPI for images
3. **Text Overflow**: Handle long text gracefully (truncate or resize)
4. **Image Aspect Ratios**: Maintain proper ratios for different panel sizes
5. **Color Accuracy**: Use print-safe colors (CMYK-friendly)

## 🔧 Technical Notes

- **Flexbox Layout**: Use CSS flexbox for panel arrangements
- **Absolute Positioning**: For overlapping elements (like semi-circles)
- **Image Optimization**: Compress images before PDF generation
- **Font Loading**: Ensure custom fonts load before PDF generation
- **Print CSS**: May need `@media print` styles for better PDF output

## 📝 Next Steps

1. **Review this plan** with your team/client
2. **Choose priority templates** (start with 3-panel vertical?)
3. **Gather requirements** for additional fields
4. **Design mockups** for each template type
5. **Begin Phase 1 implementation**

---

**Questions to Answer:**
- Which template types are highest priority?
- What additional data fields are required?
- Should templates be customizable (colors, fonts)?
- Do you need a template builder/editor UI?


