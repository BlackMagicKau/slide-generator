import pptxgen from "pptxgenjs";

export const generatePPTX = async (slides, design) => {
  const pptx = new pptxgen();

  // Set modern 16:9 layout
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'Slide Generator';

  // Create a clean, modern theme
  const theme = {
    title: {
      x: '8%',
      y: '15%',
      w: '84%',
      h: '15%',
      fontSize: 36,
      bold: true,
      color: design.primaryColor,
      fontFace: design.headingFont || 'Arial',
    },
    content: {
      x: '8%',
      y: '35%',
      w: '84%',
      h: '55%',
      fontSize: 24,
      color: design.secondaryColor,
      fontFace: design.bodyFont || 'Arial',
      bulletColor: design.accentColor,
    },
    titleSlide: {
      title: {
        x: '8%',
        y: '35%',
        w: '84%',
        h: '30%',
        fontSize: 54,
        bold: true,
        align: 'center',
      },
      subtitle: {
        x: '8%',
        y: '65%',
        w: '84%',
        h: '15%',
        fontSize: 28,
        align: 'center',
      }
    }
  };

  // Generate slides
  slides.forEach((slideData) => {
    const slide = pptx.addSlide();

    // Set slide background
    slide.background = { 
      color: design.backgroundColor,
    };

    if (slideData.layout === 'title') {
      // Title slide layout
      slide.addText(slideData.title, {
        ...theme.titleSlide.title,
        color: design.primaryColor,
        fontFace: design.headingFont || 'Arial',
      });

      // Add points as subtitle if present
      if (slideData.points.length > 0) {
        slide.addText(slideData.points.join('\n'), {
          ...theme.titleSlide.subtitle,
          color: design.secondaryColor,
          fontFace: design.bodyFont || 'Arial',
        });
      }
    } else {
      // Content slide layout
      slide.addText(slideData.title, {
        ...theme.title,
      });

      // Add bullet points with proper spacing and formatting
      if (slideData.points.length > 0) {
        const bulletPoints = slideData.points.map(point => ({
          text: point,
          options: {
            bullet: { type: 'bullet', color: design.accentColor },
            color: design.secondaryColor,
            fontSize: 24,
            fontFace: design.bodyFont || 'Arial',
            breakLine: true,
          }
        }));

        slide.addText(bulletPoints, {
          ...theme.content,
          lineSpacing: 32,
          bulletFontSize: 12,
        });
      }
    }

    // Add subtle accent elements
    slide.addShape(pptx.ShapeType.rect, {
      x: '8%',
      y: '32%',
      w: '10%',
      h: '0.5%',
      fill: { color: design.accentColor },
      opacity: 0.6,
    });
  });

  // Save the presentation
  return pptx.write('blob');
}; 