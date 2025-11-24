const fs = require('fs');
const { Resvg } = require('@resvg/resvg-js');

function convertSvgToPng(svgPath, pngPath, width) {
  const svg = fs.readFileSync(svgPath);

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: width,
    },
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  fs.writeFileSync(pngPath, pngBuffer);
  console.log(`✓ ${pngPath} generated successfully`);
}

// Convert all SVG files to PNG
convertSvgToPng('public/splash.svg', 'public/splash.png', 1024);
convertSvgToPng('public/icon.svg', 'public/icon.png', 512);
convertSvgToPng('public/og-image.svg', 'public/og-image.png', 1200);
