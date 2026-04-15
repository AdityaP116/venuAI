# The Design System: Digital Vitality & Editorial Precision

## 1. Creative North Star: "The Living Curator"
This design system moves away from the sterile, clinical feel of traditional health apps and toward a "Living Curator" aesthetic. It treats health data as a premium editorial experience. By blending **Soft Minimalism** with **Organic Layering**, we create an environment that feels as fresh as a morning harvest and as intelligent as a private concierge.

The system rejects the "boxed-in" look of standard SaaS templates. Instead, it utilizes intentional asymmetry, generous white space (breathing room), and a hierarchy that prioritizes cognitive ease. We don't just display data; we curate a lifestyle.

---

## 2. Color & Tonal Architecture
The palette is rooted in botanical greens and oxygenated whites, punctuated by "Smart AI" signals in vibrant cobalt and burnt ochre.

### The "No-Line" Rule
To achieve a premium, high-end feel, **this design system prohibits 1px solid borders for sectioning.** 
*   **The Strategy:** Boundaries are defined exclusively through background shifts. For instance, a `surface-container-low` section should sit against a `surface` background to denote a change in context. 
*   **Surface Hierarchy:** Use the hierarchy of `surface-container-lowest` (pure white/highest lift) through `surface-container-highest` (deepest grounding) to create nested depth. Think of the UI as layers of fine, heavy-weight paper.

### The "Glass & Gradient" Rule
Flat colors can feel static. To inject "soul":
*   **Smart AI Elements:** Use `secondary` (Blue) or `tertiary` (Orange) with a 20% opacity backdrop-blur (Glassmorphism) for floating AI insights.
*   **Visual Vitality:** Primary CTAs should utilize a subtle linear gradient from `primary` (#0d631b) to `primary_container` (#2e7d32) at a 135-degree angle to mimic the natural shift of light on a leaf.

---

## 3. Typography: Editorial Authority
We utilize a dual-typeface system to balance high-end editorial character with functional legibility.

*   **Display & Headlines (Manrope):** Chosen for its modern, geometric structure and approachable warmth. Large scales (`display-lg` at 3.5rem) should be used with tight letter-spacing (-2%) to create a "bold health" statement.
*   **Body & Labels (Inter):** The workhorse. Inter provides exceptional readability at small scales for nutritional facts and AI-driven data points.

**Hierarchy as Identity:**
*   **Nutritional Stats:** Use `headline-lg` for hero numbers, paired with `label-md` in `on_surface_variant` for descriptors.
*   **AI Insights:** Use `title-md` with a slight italic slant or a `secondary` color treatment to differentiate machine-generated advice from static content.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are often a crutch for poor layout. In this system, depth is organic.

*   **The Layering Principle:** Place a `surface-container-lowest` card atop a `surface-container-low` background. This "lift" is felt, not seen, creating a sophisticated interface that breathes.
*   **Ambient Shadows:** For high-priority floating elements (like an AI FAB), use a "Sunlight Shadow": `0px 20px 40px rgba(25, 28, 27, 0.06)`. It must be tinted with the `on_surface` color—never pure black.
*   **The "Ghost Border":** If accessibility requires a stroke (e.g., in high-contrast mode), use `outline-variant` at 15% opacity. If it’s visible at a glance, it’s too heavy.

---

## 5. Components

### Buttons & Interaction
*   **Primary:** High-gloss `primary` gradient with `xl` (1.5rem) roundedness. Padding: `12px 24px`.
*   **Secondary/AI:** Use the `secondary` (Blue) token with a glassmorphic background for "Ask AI" actions.
*   **Haptics:** Interactions should feel "soft." On hover, buttons should shift from `primary` to `primary_fixed_dim`, rather than getting darker.

### Health Data Cards
*   **Architecture:** Forbid the use of divider lines. Separate "Carbs," "Protein," and "Fats" using vertical white space (using the `lg` spacing token) and varying `surface-container` weights.
*   **The "Vitals" Chip:** Use `primary_fixed` backgrounds with `on_primary_fixed` text for positive health markers. Use `error_container` for alerts.

### Input Fields
*   **Style:** Minimalist. No bottom line. Instead, use a `surface-container-highest` background with an `xl` corner radius.
*   **Focus State:** A 2px "Ghost Border" of `primary` at 40% opacity.

### Navigation
*   **Mobile-First Dock:** A floating `surface-container-lowest` bar with a `0.1` opacity `outline` and heavy backdrop blur (`20px`). Icons should use `primary` for active states.

---

## 6. Do’s and Don'ts

### Do:
*   **Embrace Asymmetry:** Let hero images of fresh food bleed off the edge of the screen to break the "grid" feel.
*   **Use Generous Leading:** Increase line-height for `body-lg` to 1.6 for a relaxed, premium reading experience.
*   **Color as Data:** Use `tertiary` (Orange) sparingly—only for urgent AI-driven insights or "Smart" suggestions.

### Don’t:
*   **Don't use Dividers:** Never use a 1px line to separate content. Use a 16px or 24px gap instead.
*   **Don't use Sharp Corners:** Nothing in the "Living Curator" system is sharp. Even the smallest `sm` radius is 0.25rem.
*   **Don't over-saturate:** Keep backgrounds neutral (`surface`). Let the `primary` green and `secondary` blue be the stars against a clean, "breathable" canvas.

## Palette Parameters
- displayName: Vitality Core
- colorMode: LIGHT
- font: MANROPE
- roundness: ROUND_EIGHT
- customColor: #2E7D32
- overridePrimaryColor: #2E7D32
- overrideSecondaryColor: #007AFF
- overrideTertiaryColor: #FF9100
- overrideNeutralColor: #F5F7F5
