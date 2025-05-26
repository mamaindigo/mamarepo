# INDIGO Fund Website Enhancement Guide

This guide provides instructions for implementing the Pantera-inspired design enhancements to your INDIGO Fund website.

## 1. CSS Integration

First, add the new CSS file to your project:

1. Place the `pantera-inspired.css` file in your `css` directory
2. Link it in your HTML files after your existing CSS files:

```html
<head>
  <!-- Existing CSS files -->
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/newsletter.css">
  
  <!-- New enhanced styles -->
  <link rel="stylesheet" href="css/pantera-inspired.css">
</head>
```

## 2. JavaScript Integration

Add the enhanced animation script:

1. Place the `enhanced-animations.js` file in your `js` directory
2. Link it in your HTML files before the closing `</body>` tag:

```html
<script src="js/script.js"></script>
<script src="js/newsletter.js"></script>
<script src="js/enhanced-animations.js"></script>
```

## 3. HTML Class Adjustments

The new CSS uses most of your existing class names, but you may need to add a few new classes to certain elements:

### Hero Section

Add the `anim` class to elements you want to animate on scroll:

```html
<div class="hero__section">
  <div class="container">
    <div class="outer__hero">
      <div class="desc anim">
        <h1>Investing in digital assets with ease and security, an unprecedented opportunity.</h1>
        <p>INDIGO Fund - your gateway to a liquid institutional-grade fund</p>
      </div>
      <div class="btns anim">
        <a href="funds.html">FUNDS</a>
      </div>
    </div>
  </div>
</div>
```

### Statistics Section

Ensure your statistics have the proper structure:

```html
<div class="details__count">
  <div class="el anim">
    <span>$X <span>Billion</span></span>
    <p>Assets Under Management</p>
  </div>
  <div class="el anim">
    <span>3</span>
    <p>Core Investment Strategies</p>
  </div>
  <!-- More stats... -->
</div>
```

### Info Boxes

Add the `anim` class to your info boxes:

```html
<div class="outer__info">
  <div class="elem anim">
    <h6>Edge</h6>
    <p>Extensive network of venture funds, digital asset funds, industry projects, and layer-1s sharing information flow gives INDIGO an informational edge.</p>
  </div>
  <!-- More info boxes... -->
</div>
```

### Partners Section

Add the `anim` class to your partner elements:

```html
<div class="outer__partners">
  <h2 class="anim">Our Partners</h2>
  <div class="grid">
    <div class="elem anim">
      <p>CUSTODY</p>
      <img src="img/partner1.webp" alt="partner">
    </div>
    <!-- More partners... -->
  </div>
</div>
```

## 4. Font Integration

Ensure your fonts are properly loaded. The CSS assumes you're using:

- NeoGramExtended (for headings)
- Inter (for body text)
- IBM Plex Mono (for buttons and interactive elements)

If you need to adjust the font paths, update the `@font-face` declarations in your CSS.

## 5. Color Customization

The CSS uses CSS variables for colors. If you want to adjust the color scheme, modify these variables at the top of the CSS file:

```css
:root {
  --indigo-dark-blue: #15182B;
  --indigo-purple: #5940BE;
  --indigo-gold: #E9B737;
  --indigo-white: #FFFFFF;
  --indigo-light-gray: #F8F8F8;
}
```

## 6. Testing

After implementation, test your website on different devices and browsers to ensure:

1. Responsive layouts work correctly
2. Animations perform well
3. Navigation functions properly
4. Forms submit correctly
5. All interactive elements work as expected

## 7. Performance Optimization

For optimal performance:

1. Compress images using tools like TinyPNG
2. Minify CSS and JavaScript files
3. Consider lazy loading for images
4. Use browser caching for static assets

## 8. Troubleshooting

If you encounter issues:

- Check browser console for JavaScript errors
- Verify CSS specificity (the new CSS might be overridden by existing styles)
- Ensure all required classes are present in your HTML
- Confirm JavaScript dependencies (jQuery) are loaded before your scripts

## 9. Ongoing Maintenance

As you continue to develop your website:

1. Keep the CSS organized by following the established pattern
2. Document new components and their styles
3. Maintain consistent naming conventions
4. Test regularly on different devices

By following this guide, you'll successfully implement the Pantera-inspired design enhancements to your INDIGO Fund website, creating a more professional and engaging user experience.