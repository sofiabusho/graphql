# CSS Bible - Complete Reference Guide

A comprehensive guide to CSS Grid, Flexbox, and common CSS properties for layout and styling.

---

## Table of Contents

1. [CSS Grid](#css-grid)
2. [Flexbox](#flexbox)
3. [Common CSS Properties](#common-css-properties)
4. [Layout Patterns](#layout-patterns)
5. [Responsive Design](#responsive-design)
6. [Quick Reference](#quick-reference)

---

## CSS Grid

CSS Grid is a two-dimensional layout system (rows AND columns) that gives you complete control over both dimensions.

### Basic Grid Setup

```css
.container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;  /* 3 equal columns */
    grid-template-rows: auto auto;        /* 2 auto-height rows */
    gap: 20px;                            /* Space between items */
}
```

### `grid-template-columns`

Defines how many columns and their sizes.

#### Common Patterns:

```css
/* Equal columns */
grid-template-columns: repeat(3, 1fr);      /* 3 equal columns */
grid-template-columns: 1fr 1fr 1fr;        /* Same as above */
grid-template-columns: repeat(4, 1fr);     /* 4 equal columns */

/* Fixed width columns */
grid-template-columns: 200px 200px 200px;
grid-template-columns: repeat(3, 200px);

/* Mixed sizes */
grid-template-columns: 2fr 1fr 1fr;        /* First column 2x wider */
grid-template-columns: 250px 1fr;          /* Fixed + flexible */
grid-template-columns: auto 1fr auto;      /* Auto, flexible, auto */

/* Responsive columns */
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
```

### `grid-template-rows`

Defines how many rows and their heights.

```css
/* Equal rows */
grid-template-rows: repeat(3, 1fr);
grid-template-rows: 1fr 1fr 1fr;

/* Different row heights */
grid-template-rows: 100px 200px 1fr;       /* Fixed + fixed + flexible */
grid-template-rows: auto auto auto;        /* Auto-height based on content */

/* Mixed */
grid-template-rows: 50px auto 100px 1fr;
```

### Grid Placement

Control where items appear in the grid:

```css
/* Span multiple columns */
.item {
    grid-column: 1 / 3;        /* Start at column 1, end at column 3 (spans 2 cols) */
    grid-column: 1 / -1;       /* Start at col 1, end at last column (spans all) */
    grid-column: span 2;       /* Span 2 columns from current position */
}

/* Span multiple rows */
.item {
    grid-row: 1 / 4;           /* Start at row 1, end at row 4 (spans 3 rows) */
    grid-row: 1 / -1;          /* Start at row 1, end at last row (spans all) */
    grid-row: span 3;          /* Span 3 rows from current position */
}

/* Both at once */
.item {
    grid-column: 2 / 4;
    grid-row: 1 / 3;
}

/* Shorthand */
.item {
    grid-area: 1 / 1 / 3 / 3;  /* row-start / col-start / row-end / col-end */
}
```

### Gap (Spacing)

```css
gap: 20px;              /* Same gap for rows and columns */
row-gap: 30px;          /* Gap between rows only */
column-gap: 20px;       /* Gap between columns only */
gap: 30px 20px;         /* row-gap column-gap */
```

### Grid Units Explained

| Unit | Description | Example |
|------|-------------|---------|
| `fr` | Fraction - divides remaining space | `1fr 2fr` = 1/3 and 2/3 of space |
| `px` | Fixed pixels | `200px` = exactly 200 pixels |
| `%` | Percentage of container | `50%` = half the container width |
| `auto` | Sizes based on content | Auto-fits content |
| `minmax(min, max)` | Sets min and max sizes | `minmax(200px, 1fr)` |

### Grid Examples

#### Example 1: 2 Columns, 3 Rows Layout

```css
.container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(3, auto);
    gap: 20px;
}

/* Make second item span all rows */
.item-2 {
    grid-column: 2;
    grid-row: 1 / -1;
}
```

#### Example 2: 3-Column Layout with Header/Footer

```css
.container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 80px auto 60px;
    gap: 20px;
}

.header {
    grid-column: 1 / -1;  /* Spans all columns */
}

.footer {
    grid-column: 1 / -1;  /* Spans all columns */
}
```

#### Example 3: Responsive Grid

```css
.container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}

/* On mobile, stack vertically */
@media (max-width: 768px) {
    .container {
        grid-template-columns: 1fr;
    }
}
```

---

## Flexbox

Flexbox is a one-dimensional layout system (row OR column) perfect for component layouts.

### Basic Flexbox Setup

```css
.container {
    display: flex;
    flex-direction: row;        /* or column, row-reverse, column-reverse */
    justify-content: center;    /* Horizontal alignment (main axis) */
    align-items: center;        /* Vertical alignment (cross axis) */
    gap: 20px;                  /* Space between items */
}
```

### Flex Direction

```css
flex-direction: row;            /* Horizontal (default) */
flex-direction: column;         /* Vertical */
flex-direction: row-reverse;    /* Horizontal, reversed */
flex-direction: column-reverse; /* Vertical, reversed */
```

### Justify Content (Main Axis)

Aligns items along the main axis (horizontal if row, vertical if column):

```css
justify-content: flex-start;    /* Start of container */
justify-content: flex-end;      /* End of container */
justify-content: center;        /* Center */
justify-content: space-between; /* Space between items */
justify-content: space-around;  /* Space around items */
justify-content: space-evenly;  /* Equal space everywhere */
```

### Align Items (Cross Axis)

Aligns items along the cross axis (vertical if row, horizontal if column):

```css
align-items: flex-start;        /* Start */
align-items: flex-end;          /* End */
align-items: center;            /* Center */
align-items: stretch;           /* Stretch to fill (default) */
align-items: baseline;          /* Align to baseline */
```

### Flex Wrap

```css
flex-wrap: nowrap;              /* Single line (default) */
flex-wrap: wrap;                /* Wrap to multiple lines */
flex-wrap: wrap-reverse;        /* Wrap, reversed */
```

### Flex Items

Properties for individual flex items:

```css
.item {
    flex-grow: 1;               /* Grow to fill space */
    flex-shrink: 1;             /* Shrink if needed */
    flex-basis: 200px;          /* Initial size */
    
    /* Shorthand */
    flex: 1;                    /* flex-grow: 1, shrink: 1, basis: 0 */
    flex: 1 1 200px;            /* grow shrink basis */
    
    align-self: center;         /* Override align-items for this item */
    order: 2;                   /* Change order (default: 0) */
}
```

### Flexbox Examples

#### Example 1: Centered Content

```css
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}
```

#### Example 2: Space Between Items

```css
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
```

#### Example 3: Equal Width Columns

```css
.container {
    display: flex;
}

.item {
    flex: 1;  /* Each item takes equal space */
}
```

---

## Common CSS Properties

### Display

```css
display: block;         /* Block element (full width) */
display: inline;        /* Inline element (content width) */
display: inline-block;  /* Inline but can have width/height */
display: flex;          /* Flexbox container */
display: grid;          /* Grid container */
display: none;          /* Hidden */
```

### Positioning

```css
position: static;       /* Default - normal flow */
position: relative;     /* Relative to normal position */
position: absolute;     /* Absolute to nearest positioned parent */
position: fixed;        /* Fixed to viewport */
position: sticky;       /* Sticky when scrolling */

/* With positioning, use: */
top: 10px;
right: 20px;
bottom: 30px;
left: 40px;
z-index: 10;
```

### Box Model

```css
/* Spacing */
margin: 20px;           /* All sides */
margin: 20px 10px;      /* vertical horizontal */
margin: 10px 20px 30px 40px;  /* top right bottom left */
margin-top: 10px;
margin-right: 20px;
margin-bottom: 30px;
margin-left: 40px;

/* Padding (same syntax as margin) */
padding: 20px;
padding: 20px 10px;
padding-top: 10px;

/* Border */
border: 2px solid #333;
border-width: 2px;
border-style: solid;
border-color: #333;
border-radius: 8px;     /* Rounded corners */

/* Box sizing */
box-sizing: border-box; /* Include padding/border in width */
box-sizing: content-box; /* Default - width excludes padding/border */
```

### Width & Height

```css
width: 100%;            /* Percentage of parent */
width: 500px;           /* Fixed pixels */
width: 50vw;            /* 50% of viewport width */
width: auto;            /* Based on content */
width: max-content;     /* Fit content */
width: min-content;     /* Minimum content width */

height: 100vh;          /* 100% of viewport height */
height: auto;           /* Based on content */
min-height: 300px;      /* Minimum height */
max-width: 1200px;      /* Maximum width */
```

### Overflow

```css
overflow: visible;      /* Content can overflow */
overflow: hidden;       /* Hide overflow */
overflow: scroll;       /* Always show scrollbar */
overflow: auto;         /* Show scrollbar if needed */

overflow-x: hidden;     /* Horizontal only */
overflow-y: scroll;     /* Vertical only */
```

### Text Properties

```css
font-family: Arial, sans-serif;
font-size: 16px;
font-weight: bold;      /* or 400, 600, 700, etc. */
font-style: italic;
line-height: 1.5;
text-align: left;       /* left, center, right, justify */
text-decoration: none;  /* none, underline, overline, line-through */
text-transform: uppercase;  /* uppercase, lowercase, capitalize */
color: #333;
```

### Background

```css
background-color: #fff;
background-image: url('image.jpg');
background-size: cover;     /* cover, contain, 100% 100% */
background-position: center;
background-repeat: no-repeat;
background: #fff url('img.jpg') center/cover no-repeat;  /* Shorthand */
```

### Shadows

```css
box-shadow: 2px 4px 10px rgba(0,0,0,0.1);
/* x-offset y-offset blur spread color */

text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
```

### Transitions & Animations

```css
/* Transition */
transition: all 0.3s ease;
transition: background 0.3s, transform 0.2s;
transition-property: background;
transition-duration: 0.3s;
transition-timing-function: ease;  /* ease, linear, ease-in, ease-out, ease-in-out */

/* Transform */
transform: translateX(10px);
transform: translateY(-10px);
transform: scale(1.2);
transform: rotate(45deg);
transform: translate(10px, -10px) scale(1.1) rotate(5deg);

/* Animation */
@keyframes slideIn {
    from {
        transform: translateX(-100%);
    }
    to {
        transform: translateX(0);
    }
}

.element {
    animation: slideIn 0.5s ease;
}
```

---

## Layout Patterns

### Pattern 1: Centered Container

```css
.container {
    max-width: 1200px;
    margin: 0 auto;     /* Centers horizontally */
    padding: 20px;
}
```

### Pattern 2: Card Layout

```css
.card {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
```

### Pattern 3: Sticky Header

```css
.header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: white;
}
```

### Pattern 4: Two-Column Layout

```css
/* Using Grid */
.container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

/* Using Flexbox */
.container {
    display: flex;
    gap: 20px;
}

.sidebar {
    flex: 0 0 250px;  /* Don't grow, don't shrink, 250px wide */
}

.content {
    flex: 1;         /* Takes remaining space */
}
```

### Pattern 5: Holy Grail Layout

```css
.container {
    display: grid;
    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: 80px 1fr 60px;
    min-height: 100vh;
}

.header {
    grid-column: 1 / -1;
}

.footer {
    grid-column: 1 / -1;
}

/* Responsive */
@media (max-width: 768px) {
    .container {
        grid-template-columns: 1fr;
        grid-template-rows: auto;
    }
}
```

---

## Responsive Design

### Media Queries

```css
/* Mobile first approach */
.container {
    padding: 10px;
}

/* Tablet */
@media (min-width: 768px) {
    .container {
        padding: 20px;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .container {
        padding: 40px;
    }
}

/* Specific breakpoints */
@media (max-width: 480px) { }   /* Mobile */
@media (max-width: 768px) { }   /* Tablet */
@media (max-width: 1024px) { }  /* Small desktop */
@media (min-width: 1200px) { }  /* Large desktop */
```

### Viewport Units

```css
width: 100vw;          /* Full viewport width */
height: 100vh;         /* Full viewport height */
font-size: 5vw;        /* Responsive font size */
padding: 2vh 3vw;      /* Responsive padding */
```

### Responsive Images

```css
img {
    max-width: 100%;    /* Never exceed container */
    height: auto;       /* Maintain aspect ratio */
}
```

---

## Quick Reference

### Grid vs Flexbox

| Feature | Grid | Flexbox |
|---------|------|---------|
| Dimensions | 2D (rows + columns) | 1D (row OR column) |
| Best for | Page layouts | Component layouts |
| Alignment | Built-in (gap) | justify-content, align-items |
| Items | Can span multiple cells | Linear flow |

**When to use Grid:**
- Two-dimensional layouts
- Complex page structures
- When you need items to align in both rows and columns

**When to use Flexbox:**
- One-dimensional layouts (row OR column)
- Navigation bars
- Centering content
- Distributing space within components

### Common Layout Combinations

#### Grid + Flexbox

```css
/* Use Grid for overall layout */
.page {
    display: grid;
    grid-template-columns: 250px 1fr;
}

/* Use Flexbox for component layout */
.navbar {
    display: flex;
    justify-content: space-between;
}
```

### CSS Units Cheat Sheet

| Unit | Type | Best For |
|------|------|----------|
| `px` | Absolute | Borders, fixed sizes |
| `%` | Relative | Widths relative to parent |
| `em` | Relative | Font sizes, margins (relative to font) |
| `rem` | Relative | Font sizes (relative to root font) |
| `vw` | Viewport | Full-width sections |
| `vh` | Viewport | Full-height sections |
| `fr` | Grid only | Grid column/row sizing |
| `auto` | Flexible | Let browser decide |

### Common Patterns Quick Copy

#### Centered Content

```css
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}
```

#### Two-Column Grid

```css
.grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}
```

#### Three-Column Grid

```css
.grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}
```

#### Sidebar + Content

```css
.layout {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 20px;
}
```

#### Card Grid (Responsive)

```css
.cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}
```

---

## Tips & Best Practices

1. **Mobile First**: Start with mobile styles, then add desktop styles with media queries
2. **Use `gap` instead of margins**: Cleaner spacing in Grid and Flexbox
3. **Use `fr` in Grid**: More flexible than percentages
4. **Use `box-sizing: border-box`**: Makes width calculations easier
5. **Combine Grid and Flexbox**: Use Grid for page layout, Flexbox for components
6. **Test Responsiveness**: Always check on different screen sizes
7. **Use semantic HTML**: Makes CSS easier to write
8. **Keep it simple**: Don't overcomplicate layouts

---

## Visual Grid Examples

### 2 Columns, 3 Rows

```
┌─────────┬─────────┐
│    1    │    2    │  ← Row 1
├─────────┼─────────┤
│    3    │    4    │  ← Row 2
├─────────┼─────────┤
│    5    │    6    │  ← Row 3
└─────────┴─────────┘
```

### 2 Columns, Unequal Widths

```
┌───────────────┬───────────┐
│       1       │     2     │  ← 1 takes 2/3, 2 takes 1/3
├───────────────┼───────────┤
│       3       │     4     │
└───────────────┴───────────┘
```

### Spanning Items

```
┌─────────┬─────────┐
│    1    │         │
├─────────┤    2    │  ← Item 2 spans 2 rows
│    3    │         │
├─────────┴─────────┤
│    4              │  ← Item 4 spans 2 columns
└───────────────────┘
```

---

**Happy Coding! 🎨**
