# CSS Grid Layout Options: 2 Columns with Different Layout

You want:
- **Column 1**: Student Info (row 1), Audit Card (row 2), Top Skills (row 3)
- **Column 2**: Total XP spanning all 3 rows

## Option 1: Using `grid-template-rows` with Auto Heights (Recommended)

```css
.profile-content {
    display: grid;
    grid-template-columns: 1fr 1fr;           /* 2 equal columns */
    grid-template-rows: repeat(3, auto);      /* 3 rows, auto height */
    gap: 20px;
}

/* Make Total XP span all 3 rows in column 2 */
.xp-card {
    grid-column: 2;                           /* Place in column 2 */
    grid-row: 1 / -1;                         /* Span from row 1 to last row */
    /* OR: */
    grid-row: 1 / 4;                          /* Span rows 1, 2, 3 */
}
```

## Option 2: Using `grid-row: span 3`

```css
.profile-content {
    display: grid;
    grid-template-columns: 1fr 1fr;           /* 2 equal columns */
    grid-template-rows: auto auto auto;       /* 3 explicit rows */
    gap: 20px;
}

.xp-card {
    grid-column: 2;                           /* Place in column 2 */
    grid-row: span 3;                         /* Span 3 rows */
}
```

## Option 3: Equal Height Rows with `1fr`

```css
.profile-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;          /* 3 equal height rows */
    gap: 20px;
}

.xp-card {
    grid-column: 2;
    grid-row: 1 / -1;                         /* Span all rows */
}
```

## Option 4: Flexible Rows with Auto

```css
.profile-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto;       /* Rows auto-size to content */
    gap: 20px;
}

.xp-card {
    grid-column: 2;
    grid-row: 1 / 4;                          /* Spans rows 1-3 */
}
```

## Option 5: Different Column Widths

```css
.profile-content {
    display: grid;
    grid-template-columns: 2fr 1fr;           /* First column 2x wider */
    grid-template-rows: repeat(3, auto);
    gap: 20px;
}

.xp-card {
    grid-column: 2;
    grid-row: 1 / -1;                         /* Span all rows */
}
```

## HTML Structure

The items will automatically flow in this order:
1. Student Info → Column 1, Row 1
2. Top Skills → Column 1, Row 2 (but you want it in Row 3!)
3. Total XP → Column 1, Row 3 (but you want it in Column 2!)

So you need to reorder or use explicit grid placement:

### Option A: Reorder HTML (Easiest)
```html
<div id="profile-content" class="profile-content">
    <!-- Column 1, Row 1 -->
    <div class="profile-card">Student Information</div>
    
    <!-- Column 2, Row 1-3 (SPANS ALL) -->
    <div class="profile-card xp-card">Total XP</div>
    
    <!-- Column 1, Row 2 -->
    <div class="profile-card audit-card">Audit Ratio</div>
    
    <!-- Column 1, Row 3 -->
    <div class="profile-card skills-card">Top Skills</div>
</div>
```

### Option B: Keep HTML order, use explicit placement
```css
.profile-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(3, auto);
    gap: 20px;
}

/* Student Info - Column 1, Row 1 */
.student-info-card {
    grid-column: 1;
    grid-row: 1;
}

/* Audit Card - Column 1, Row 2 */
.audit-card {
    grid-column: 1;
    grid-row: 2;
}

/* Top Skills - Column 1, Row 3 */
.skills-card {
    grid-column: 1;
    grid-row: 3;
}

/* Total XP - Column 2, Rows 1-3 */
.xp-card {
    grid-column: 2;
    grid-row: 1 / -1;  /* Or: grid-row: 1 / 4; */
}
```

## Recommended CSS (Easiest)

```css
.profile-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(3, auto);
    gap: 20px;
}

.xp-card {
    grid-column: 2;
    grid-row: 1 / -1;
}
```

## Visual Layout

```
┌─────────────────┬─────────────────┐
│  Student Info   │                 │
│  (Row 1)        │                 │
├─────────────────┤                 │
│  Audit Card     │   Total XP      │
│  (Row 2)        │   (spans all    │
├─────────────────┤   3 rows)       │
│  Top Skills     │                 │
│  (Row 3)        │                 │
└─────────────────┴─────────────────┘
```

## All CSS Combination Options

### Combination 1: Auto-height rows (content-based)
```css
.profile-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto;
    gap: 20px;
}

.xp-card {
    grid-column: 2;
    grid-row: 1 / 4;
}
```

### Combination 2: Equal height rows
```css
.profile-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    gap: 20px;
}

.xp-card {
    grid-column: 2;
    grid-row: span 3;
}
```

### Combination 3: Repeat shorthand
```css
.profile-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(3, auto);
    gap: 20px;
}

.xp-card {
    grid-column: 2;
    grid-row: 1 / -1;
}
```

### Combination 4: Mixed column widths
```css
.profile-content {
    display: grid;
    grid-template-columns: 2fr 1fr;  /* First column wider */
    grid-template-rows: repeat(3, auto);
    gap: 20px;
}

.xp-card {
    grid-column: 2;
    grid-row: 1 / -1;
}
```

### Combination 5: Fixed first row height
```css
.profile-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 200px auto auto;  /* First row 200px */
    gap: 20px;
}

.xp-card {
    grid-column: 2;
    grid-row: 1 / 4;
}
```

## Grid Row Syntax Explained

```css
grid-row: 1 / 4;      /* Start at row 1, end at row 4 (spans rows 1, 2, 3) */
grid-row: 1 / -1;     /* Start at row 1, go to last row (spans all) */
grid-row: span 3;     /* Span 3 rows from current position */
```

## Notes:

- **Auto rows** (`auto`): Height based on content (flexible, recommended)
- **Equal rows** (`1fr`): Equal share of available space (all rows same height)
- **`grid-row: 1 / 4`**: Starts at row 1, ends at row 4 (spans 3 rows)
- **`grid-row: 1 / -1`**: Starts at row 1, goes to last row (spans all)
- **`grid-row: span 3`**: Spans 3 rows from where item is placed

## Quick Start

1. Add class to Total XP card: `class="profile-card xp-card"`
2. Add this CSS:
```css
.profile-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(3, auto);
    gap: 20px;
}

.xp-card {
    grid-column: 2;
    grid-row: 1 / -1;
}
```
