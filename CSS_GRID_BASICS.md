# CSS Grid Basics - `grid-template-columns` and `grid-template-rows`

## What is CSS Grid?

CSS Grid is a layout system that allows you to create two-dimensional layouts (rows AND columns) with ease.

## Your Current Grid (Profile Content)

```css
.profile-content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);  /* 2 equal columns */
    gap: 20px;                               /* Space between items */
}
```

## Understanding `grid-template-columns`

This property defines how many columns you have and their sizes.

### Basic Examples:

```css
/* 2 equal columns */
grid-template-columns: 1fr 1fr;
/* OR shorter: */
grid-template-columns: repeat(2, 1fr);

/* 3 equal columns */
grid-template-columns: repeat(3, 1fr);

/* Fixed width columns */
grid-template-columns: 200px 200px 200px;
/* OR: */
grid-template-columns: repeat(3, 200px);

/* Mixed sizes - first column 2x wider than others */
grid-template-columns: 2fr 1fr 1fr;

/* One narrow, one wide */
grid-template-columns: 250px 1fr;  /* 250px fixed, rest fills space */

/* Auto-sizing based on content */
grid-template-columns: auto 1fr auto;  /* Left auto, middle flexible, right auto */
```

### Common Units:

- `fr` (fraction) - divides remaining space proportionally
- `px` - fixed pixels
- `%` - percentage of container
- `auto` - sizes based on content
- `minmax(min, max)` - sets min and max sizes

## Understanding `grid-template-rows`

This defines how many rows you have and their heights.

```css
/* 3 equal rows */
grid-template-rows: repeat(3, 1fr);

/* Different row heights */
grid-template-rows: 100px 200px 1fr;  /* First 100px, second 200px, third fills rest */

/* Auto rows (rows created automatically as needed) */
grid-template-rows: auto;  /* Each row sizes to its content */
```

## Practical Examples for Your Project

### Example 1: Change to 3 Columns
```css
.profile-content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);  /* 3 columns instead of 2 */
    gap: 20px;
}
```

### Example 2: Make First Column Wider
```css
.profile-content {
    display: grid;
    grid-template-columns: 2fr 1fr;  /* First column takes 2/3, second takes 1/3 */
    gap: 20px;
}
```

### Example 3: Fixed First Column, Flexible Second
```css
.profile-content {
    display: grid;
    grid-template-columns: 300px 1fr;  /* First fixed at 300px, second fills */
    gap: 20px;
}
```

### Example 4: Define Rows Explicitly
```css
.profile-content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto 200px auto;  /* Row 1: auto, Row 2: 200px, Row 3: auto */
    gap: 20px;
}
```

### Example 5: Different Layouts Per Row
```css
.profile-content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 150px auto 100px;  /* Specific heights */
    gap: 20px;
}
```

## Grid Placement: `grid-column` and `grid-row`

Make items span multiple columns/rows:

```css
/* Make an item span all columns */
.statistics-section {
    grid-column: 1 / -1;  /* Start at column 1, end at last column */
}

/* Make an item span 2 columns */
.big-card {
    grid-column: span 2;  /* Spans 2 columns */
}

/* Make an item span 2 rows */
.tall-card {
    grid-row: span 2;  /* Spans 2 rows */
}
```

## Gap (Spacing)

```css
gap: 20px;           /* Same gap for rows and columns */
row-gap: 30px;       /* Gap between rows only */
column-gap: 20px;    /* Gap between columns only */
gap: 30px 20px;      /* row-gap column-gap */
```

## Responsive Grid (Media Queries)

```css
.profile-content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
}

/* On mobile, stack vertically */
@media (max-width: 768px) {
    .profile-content {
        grid-template-columns: 1fr;  /* Single column on mobile */
    }
}
```

## Try These Experiments on Your Project

### Experiment 1: Change Layout to 3 Columns
```css
.profile-content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}
```

### Experiment 2: Make Cards Different Sizes
```css
.profile-content {
    display: grid;
    grid-template-columns: 1fr 2fr;  /* Second column twice as wide */
    gap: 20px;
}
```

### Experiment 3: Add Row Definitions
```css
.profile-content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 200px 300px auto;  /* Define row heights */
    gap: 20px;
}
```

## Quick Reference

| Property | What It Does | Example |
|----------|--------------|---------|
| `display: grid` | Makes container a grid | Required first! |
| `grid-template-columns` | Defines columns | `repeat(2, 1fr)` |
| `grid-template-rows` | Defines rows | `auto 200px` |
| `gap` | Space between items | `20px` |
| `grid-column: span 2` | Item spans 2 columns | - |
| `grid-row: span 2` | Item spans 2 rows | - |
| `1fr` | Takes 1 fraction of space | Flexible unit |
| `repeat(3, 1fr)` | Repeats 3 times | Shorthand |

## Visual Example

```
grid-template-columns: repeat(3, 1fr);

┌─────────┬─────────┬─────────┐
│    1    │    2    │    3    │  ← Row 1
├─────────┼─────────┼─────────┤
│    4    │    5    │    6    │  ← Row 2
└─────────┴─────────┴─────────┘
```

```
grid-template-columns: 2fr 1fr;

┌───────────────┬───────────┐
│       1       │     2     │  ← Row 1 (1 takes 2/3, 2 takes 1/3)
├───────────────┼───────────┤
│       3       │     4     │  ← Row 2
└───────────────┴───────────┘
```

## Tips

1. **Start simple**: Use `repeat(2, 1fr)` for 2 equal columns
2. **Use `fr` for flexibility**: Better than percentages for responsive design
3. **Use `gap` instead of margins**: Cleaner spacing between items
4. **Auto rows**: If you don't define rows, they create automatically
5. **Experiment**: The best way to learn is to try different values!

