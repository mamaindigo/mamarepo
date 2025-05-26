const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  try {
    console.log('Starting browser...');
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    console.log('Opening page...');
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log('Navigating to Pantera Capital website...');
    await page.goto('https://panteracapital.com', { 
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    console.log('Extracting styles...');
    
    // Define the elements we want to analyze
    const selectors = {
      // Layout and structure
      body: 'body',
      container: '.grid-container',
      header: 'header.navigation',
      navLogo: '.nav-logo',
      navLinks: '.menu-list > li > a',
      navDropdown: '.sub-menu',
      
      // Hero section
      heroSection: '.homepage-hero',
      heroHeading: '.homepage-hero h1',
      heroDescription: '.homepage-hero .body-big',
      heroCta: '.homepage-hero .btn',
      
      // Content sections
      textBlock: '.text-block',
      textBlockTitle: '.text-block .title h3',
      textBlockDescription: '.text-block .description p',
      
      // Stats section
      statsTable: '.text-block table',
      statsHeading: '.text-block table h4',
      statsText: '.text-block table p',
      
      // Cards
      cards: '.cards .text-card',
      cardTitle: '.text-card .title h5',
      cardDescription: '.text-card .description p',
      
      // Footer
      subscribeBanner: '.subscribe-banner',
      footer: '.footer',
      footerLogo: '.footer .logo',
      footerLinks: '.footer-list > li > a',
      footerSocial: '.social-icons a',
      copyright: '.copyright'
    };

    // CSS properties to extract
    const properties = [
      // Typography
      'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'text-transform',
      'color', 'text-align',
      
      // Spacing
      'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
      'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
      
      // Layout
      'display', 'position', 'top', 'right', 'bottom', 'left',
      'width', 'height', 'max-width', 'max-height',
      'flex-direction', 'justify-content', 'align-items',
      
      // Visual
      'background-color', 'background-image',
      'border', 'border-radius', 'box-shadow',
      'opacity', 'z-index',
      'transition'
    ];

    // Extract styles for each selector
    const result = {};
    
    for (const [key, selector] of Object.entries(selectors)) {
      console.log(`Extracting styles for: ${key}`);
      
      result[key] = await page.evaluate((selector, properties) => {
        const elements = document.querySelectorAll(selector);
        if (!elements.length) return null;
        
        const extractStyles = (element) => {
          const styles = window.getComputedStyle(element);
          const extracted = {};
          
          properties.forEach(prop => {
            extracted[prop] = styles.getPropertyValue(prop);
          });
          
          // Also extract any custom CSS variables being used
          const allProps = {};
          for (let i = 0; i < styles.length; i++) {
            const prop = styles[i];
            if (prop.startsWith('--')) {
              allProps[prop] = styles.getPropertyValue(prop);
            }
          }
          
          extracted.customProperties = allProps;
          
          return extracted;
        };
        
        return elements.length > 1
          ? Array.from(elements).map(extractStyles)
          : extractStyles(elements[0]);
      }, selector, properties);
    }
    
    // Also capture color scheme and typography system
    result.colorScheme = await page.evaluate(() => {
      const colors = {};
      const styles = getComputedStyle(document.documentElement);
      
      // Extract colors from CSS variables
      for (let i = 0; i < styles.length; i++) {
        const prop = styles[i];
        if (prop.startsWith('--') && (
          prop.includes('color') || 
          prop.includes('background') || 
          prop.includes('border')
        )) {
          colors[prop] = styles.getPropertyValue(prop);
        }
      }
      
      // Also extract common colors from the page
      const commonElements = {
        bodyBackground: 'body',
        headerBackground: 'header',
        primaryText: 'body',
        headingText: 'h1, h2, h3',
        linkColor: 'a',
        buttonBackground: '.btn',
        buttonText: '.btn',
        footerBackground: 'footer'
      };
      
      for (const [key, selector] of Object.entries(commonElements)) {
        const elements = document.querySelectorAll(selector);
        if (elements.length) {
          const style = window.getComputedStyle(elements[0]);
          if (key.includes('Background')) {
            colors[key] = style.backgroundColor;
          } else if (key.includes('Text') || key.includes('Color')) {
            colors[key] = style.color;
          }
        }
      }
      
      return colors;
    });
    
    // Take screenshots of key sections
    console.log('Taking screenshots of key sections...');
    const screenshotSelectors = {
      fullPage: null, // Full page screenshot
      header: 'header.navigation',
      hero: '.homepage-hero',
      textBlocks: '.text-block-container',
      cards: '.cards',
      footer: 'footer.footer'
    };
    
    const screenshots = {};
    for (const [key, selector] of Object.entries(screenshotSelectors)) {
      try {
        if (selector === null) {
          // Full page screenshot
          screenshots[key] = await page.screenshot({ 
            fullPage: true,
            encoding: 'base64'
          });
        } else {
          // Try to find the element
          const elementHandle = await page.$(selector);
          if (elementHandle) {
            screenshots[key] = await elementHandle.screenshot({ 
              encoding: 'base64'
            });
          }
        }
      } catch (error) {
        console.log(`Error taking screenshot for ${key}:`, error.message);
      }
    }
    
    // Save the results
    console.log('Writing results to files...');
    
    // Save the computed styles
    fs.writeFileSync('pantera-styles.json', JSON.stringify(result, null, 2));
    
    // Save the screenshots
    if (!fs.existsSync('./screenshots')) {
      fs.mkdirSync('./screenshots');
    }
    
    for (const [key, data] of Object.entries(screenshots)) {
      if (data) {
        fs.writeFileSync(`./screenshots/${key}.png`, Buffer.from(data, 'base64'));
      }
    }
    
    // Generate a CSS file with the extracted styles
    let cssContent = `/* 
 * Extracted styles from Pantera Capital website
 * Generated on ${new Date().toISOString()}
 */

:root {
`;

    // Add color variables
    for (const [key, value] of Object.entries(result.colorScheme)) {
      if (key.startsWith('--')) {
        cssContent += `  ${key}: ${value};\n`;
      } else {
        cssContent += `  --${key}: ${value};\n`;
      }
    }
    
    cssContent += `}

/* Typography */
body {
  font-family: ${result.body?.['font-family'] || 'inherit'};
  font-size: ${result.body?.['font-size'] || 'inherit'};
  line-height: ${result.body?.['line-height'] || 'inherit'};
  color: ${result.body?.['color'] || 'inherit'};
  background-color: ${result.body?.['background-color'] || 'inherit'};
}

h1, .h1 {
  font-family: ${result.heroHeading?.['font-family'] || 'inherit'};
  font-size: ${result.heroHeading?.['font-size'] || '3.5rem'};
  font-weight: ${result.heroHeading?.['font-weight'] || 'bold'};
  line-height: ${result.heroHeading?.['line-height'] || '1.2'};
  margin-bottom: ${result.heroHeading?.['margin-bottom'] || '1.5rem'};
}

h2, .h2 {
  font-size: 2.5rem;
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

h3, .h3 {
  font-size: 2rem;
  font-weight: bold;
  line-height: 1.3;
  margin-bottom: 1rem;
}

p {
  margin-bottom: 1rem;
}

.body-big {
  font-size: ${result.heroDescription?.['font-size'] || '1.25rem'};
  line-height: ${result.heroDescription?.['line-height'] || '1.5'};
}

/* Layout */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header */
header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: ${result.header?.['background-color'] || 'transparent'};
  transition: background-color 0.3s ease;
}

header.colored {
  background-color: #15182B;
}

.nav-logo {
  display: block;
  transition: opacity 0.3s ease;
}

.menu-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu-list > li {
  margin-right: 2rem;
  position: relative;
}

.menu-list > li > a {
  color: ${result.navLinks?.[0]?.['color'] || '#fff'};
  text-decoration: none;
  font-weight: ${result.navLinks?.[0]?.['font-weight'] || '500'};
  transition: color 0.3s ease;
}

.menu-list > li > a:hover {
  color: #e9b737;
}

.sub-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #fff;
  min-width: 200px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s ease;
  z-index: 100;
}

.menu-list > li:hover .sub-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.sub-menu li {
  padding: 0.5rem 1rem;
}

.sub-menu li a {
  color: #333;
  text-decoration: none;
  display: block;
}

/* Hero Section */
.hero-section {
  padding: 8rem 0 4rem;
  background-color: #15182B;
  color: #fff;
  position: relative;
  overflow: hidden;
}

.hero-section h1 {
  max-width: 800px;
}

.hero-section p {
  max-width: 600px;
  margin-bottom: 2rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: ${result.heroCta?.[0]?.['background-color'] || '#fff'};
  color: ${result.heroCta?.[0]?.['color'] || '#15182B'};
  text-decoration: none;
  font-weight: 500;
  border-radius: 0;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid transparent;
}

.btn:hover {
  background-color: transparent;
  border-color: #fff;
  color: #fff;
}

/* Text Blocks */
.text-block {
  padding: 4rem 0;
}

.text-block.left {
  padding-right: 4rem;
}

.text-block.right {
  padding-left: 4rem;
}

/* Stats */
.stats-table {
  width: 100%;
  border-collapse: collapse;
}

.stats-table td {
  padding: 1rem;
  text-align: center;
  vertical-align: top;
}

.stats-table h4 {
  color: #e9b737;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

/* Cards */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
}

.text-card {
  padding: 2rem;
  background-color: #f8f8f8;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.text-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.text-card .title h5 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

/* Subscribe Banner */
.subscribe-banner {
  background-color: #e9b737;
  color: #15182B;
  padding: 2rem 0;
}

.subscribe-banner .title {
  font-size: 1.5rem;
  font-weight: 500;
}

.btn.subscribe {
  background-color: #15182B;
  color: #fff;
}

.btn.subscribe:hover {
  background-color: #fff;
  color: #15182B;
}

/* Footer */
footer {
  background-color: #15182B;
  color: #fff;
  padding: 4rem 0 2rem;
}

.footer-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.footer-list > li {
  margin-bottom: 1rem;
}

.footer-list > li > a {
  color: #fff;
  font-weight: 500;
  text-decoration: none;
}

.footer-list .sub-menu {
  list-style: none;
  margin: 0.5rem 0 1.5rem;
  padding: 0;
  position: static;
  opacity: 1;
  visibility: visible;
  transform: none;
  background-color: transparent;
  box-shadow: none;
}

.footer-list .sub-menu li {
  padding: 0.25rem 0;
}

.footer-list .sub-menu a {
  color: rgba(255,255,255,0.7);
  font-weight: normal;
}

.social-icons {
  display: flex;
  gap: 1rem;
  margin: 1.5rem 0;
}

.copyright {
  font-size: 0.875rem;
  color: rgba(255,255,255,0.7);
  margin-top: 2rem;
}

/* Media Queries */
@media (max-width: 991px) {
  .menu-list {
    display: none;
  }
  
  .hamburger-menu {
    display: block;
  }
  
  .text-block.left,
  .text-block.right {
    padding: 2rem 0;
  }
  
  .cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  h1, .h1 {
    font-size: 2.5rem;
  }
  
  h2, .h2 {
    font-size: 2rem;
  }
  
  h3, .h3 {
    font-size: 1.75rem;
  }
  
  .hero-section {
    padding: 6rem 0 3rem;
  }
}
`;

    fs.writeFileSync('pantera-extracted.css', cssContent);
    
    // Generate an HTML report
    const htmlReport = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pantera Capital Website Analysis</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    h1 {
      border-bottom: 2px solid #15182B;
      padding-bottom: 0.5rem;
      margin-bottom: 2rem;
    }
    h2 {
      margin-top: 3rem;
      color: #15182B;
    }
    .color-swatch {
      display: inline-block;
      width: 20px;
      height: 20px;
      margin-right: 8px;
      border: 1px solid #ddd;
      vertical-align: middle;
    }
    .color-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
      margin: 1rem 0 2rem;
    }
    .color-item {
      display: flex;
      align-items: center;
      padding: 0.5rem;
      border: 1px solid #eee;
      border-radius: 4px;
    }
    .screenshot {
      max-width: 100%;
      height: auto;
      margin: 1rem 0;
      border: 1px solid #eee;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .section {
      margin-bottom: 3rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid #eee;
    }
    .style-table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0 2rem;
    }
    .style-table th, .style-table td {
      padding: 0.5rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    .style-table th {
      background-color: #f8f8f8;
      font-weight: 500;
    }
    .recommendations {
      background-color: #f8f8f8;
      padding: 1.5rem;
      border-radius: 4px;
      margin: 2rem 0;
    }
    .recommendations h3 {
      margin-top: 0;
    }
    .recommendations ul {
      margin-bottom: 0;
    }
  </style>
</head>
<body>
  <h1>Pantera Capital Website Analysis</h1>
  
  <div class="section">
    <h2>Color Scheme</h2>
    <p>The website uses a sophisticated color palette with dark backgrounds and strategic accent colors:</p>
    
    <div class="color-grid">
      <div class="color-item">
        <span class="color-swatch" style="background-color: #15182B;"></span>
        <span>Primary Dark Blue (#15182B)</span>
      </div>
      <div class="color-item">
        <span class="color-swatch" style="background-color: #FFFFFF;"></span>
        <span>White Text (#FFFFFF)</span>
      </div>
      <div class="color-item">
        <span class="color-swatch" style="background-color: #E9B737;"></span>
        <span>Accent Gold (#E9B737)</span>
      </div>
      <div class="color-item">
        <span class="color-swatch" style="background-color: #F8F8F8;"></span>
        <span>Light Background (#F8F8F8)</span>
      </div>
    </div>
  </div>
  
  <div class="section">
    <h2>Typography</h2>
    <p>The typography system uses a clean, modern approach with clear hierarchy:</p>
    
    <table class="style-table">
      <tr>
        <th>Element</th>
        <th>Font Family</th>
        <th>Font Size</th>
        <th>Font Weight</th>
        <th>Line Height</th>
      </tr>
      <tr>
        <td>Body Text</td>
        <td>-apple-system, BlinkMacSystemFont, sans-serif</td>
        <td>16px</td>
        <td>400</td>
        <td>1.6</td>
      </tr>
      <tr>
        <td>Headings (H1)</td>
        <td>Custom font (NeoGramExtended)</td>
        <td>3.5rem</td>
        <td>700</td>
        <td>1.2</td>
      </tr>
      <tr>
        <td>Navigation</td>
        <td>-apple-system, BlinkMacSystemFont, sans-serif</td>
        <td>1rem</td>
        <td>500</td>
        <td>1.4</td>
      </tr>
      <tr>
        <td>Buttons</td>
        <td>IBM Plex Mono, monospace</td>
        <td>0.875rem</td>
        <td>500</td>
        <td>1.4</td>
      </tr>
    </table>
  </div>
  
  <div class="section">
    <h2>Layout & Structure</h2>
    <p>The website uses a clean, grid-based layout with ample whitespace:</p>
    
    <ul>
      <li><strong>Header:</strong> Fixed position, transparent initially and solid on scroll</li>
      <li><strong>Hero Section:</strong> Full-width with background video, large heading and CTA buttons</li>
      <li><strong>Content Sections:</strong> Alternating left/right text blocks with animations</li>
      <li><strong>Cards:</strong> Clean, minimal cards for presenting different investment types</li>
      <li><strong>Footer:</strong> Multi-column layout with navigation, social links and legal info</li>
    </ul>
  </div>
  
  <div class="section">
    <h2>Key Screenshots</h2>
    
    <h3>Header & Navigation</h3>
    <img src="./screenshots/header.png" alt="Header and Navigation" class="screenshot">
    
    <h3>Hero Section</h3>
    <img src="./screenshots/hero.png" alt="Hero Section" class="screenshot">
    
    <h3>Text Blocks</h3>
    <img src="./screenshots/textBlocks.png" alt="Text Blocks" class="screenshot">
    
    <h3>Cards</h3>
    <img src="./screenshots/cards.png" alt="Cards" class="screenshot">
    
    <h3>Footer</h3>
    <img src="./screenshots/footer.png" alt="Footer" class="screenshot">
  </div>
  
  <div class="recommendations">
    <h3>Recommendations for INDIGO Fund Website</h3>
    <p>Based on the analysis of Pantera Capital's website, here are recommendations for improving the INDIGO Fund website:</p>
    
    <ul>
      <li><strong>Color Scheme:</strong> Consider adopting a similar dark blue/gold accent color scheme for a sophisticated financial look</li>
      <li><strong>Typography:</strong> Use a custom display font for headings and a monospace font for buttons to create visual interest</li>
      <li><strong>Hero Section:</strong> Add a full-width hero with a bold statement and background video/image</li>
      <li><strong>Statistics Display:</strong> Create a visually appealing grid to showcase key fund metrics</li>
      <li><strong>Card Layout:</strong> Use cards with hover effects to present different fund types</li>
      <li><strong>Animations:</strong> Add subtle scroll animations to enhance user experience</li>
      <li><strong>Navigation:</strong> Implement a fixed header that changes on scroll</li>
      <li><strong>Footer:</strong> Reorganize the footer with better categorization of links</li>
    </ul>
  </div>
  
  <p>Generated on ${new Date().toLocaleString()}</p>
</body>
</html>`;

    fs.writeFileSync('pantera-analysis.html', htmlReport);
    
    console.log('✅ Analysis complete! Files created:');
    console.log('- pantera-styles.json: Raw extracted styles');
    console.log('- pantera-extracted.css: Ready-to-use CSS based on Pantera\'s design');
    console.log('- screenshots/: Visual references of key sections');
    console.log('- pantera-analysis.html: Complete analysis report with recommendations');
    
    await browser.close();
    console.log('Browser closed.');
    
  } catch (error) {
    console.error('Error during style analysis:', error);
  }
})();