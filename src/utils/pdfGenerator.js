import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

// Configuration for PDF generation
const PDF_CONFIG = {
  format: "a4",
  unit: "mm",
  orientation: "portrait",
  margins: {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  }
};

/**
 * Shows an error notification for PDF generation issues.
 * @param {string} message - The error message to display.
 */
const showErrorNotification = (message = "An error occurred. Please try again.") => {
  // Remove existing notifications first to prevent stacking
  const existingNotification = document.querySelector(".pdf-gen-notification");
  if (existingNotification && document.body.contains(existingNotification)) {
    document.body.removeChild(existingNotification);
  }

  const notification = document.createElement("div");
  notification.className = "pdf-gen-notification fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-[10000]";
  // Basic fade-in using JS, assuming no global CSS for this
  notification.style.opacity = "0";
  notification.style.transition = "opacity 0.3s ease-in-out";
  
  notification.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="132" x2="128" y2="80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="172" r="16"/></svg>
    <span>${message}</span>
  `;
  
  document.body.appendChild(notification);
  
  // Trigger reflow for transition
  requestAnimationFrame(() => {
    notification.style.opacity = "1";
  });

  setTimeout(() => {
    notification.style.opacity = "0";
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300); // Matches transition duration
  }, 3000);
};


/**
 * Generates a PDF from an HTML element using html-to-image and jsPDF.
 * @param {HTMLElement} element - The DOM element to convert to PDF.
 * @param {string} filename - The name of the PDF file (without extension).
 * @returns {Promise<boolean>} - True if PDF generation was successful, false otherwise.
 */
export const generatePDF = async (element, filename = "resume") => {
  let loadingIndicator;
  try {
    loadingIndicator = document.createElement("div");
    loadingIndicator.className = "fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[9999]";
    loadingIndicator.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-4">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M117.2,85.18a12,12,0,0,0-12.7,1.45l-40,32a12,12,0,0,0,0,18.74l40,32A12,12,0,0,0,124,160V96A12,12,0,0,0,117.2,85.18Z"/><path d="M173.2,85.18a12,12,0,0,0-12.7,1.45l-40,32a12,12,0,0,0,0,18.74l40,32A12,12,0,0,0,180,160V96A12,12,0,0,0,173.2,85.18Z"/></svg>
        <span class="text-gray-700">Generating PDF...</span>
      </div>
    `;
    document.body.appendChild(loadingIndicator);

    const dataUrl = await toPng(element, {
      quality: 0.98,
      pixelRatio: 2, // Higher pixelRatio for better quality on high DPI screens
      backgroundColor: "#ffffff",
      // html-to-image usually captures based on element's rendered size.
      // Ensure the element has a defined width, especially for off-screen rendering.
      // Example: style: { width: `${element.offsetWidth}px`, height: `${element.offsetHeight}px` }
      // For an A4-like element, this should be fine if CSS is set correctly.
    });

    const pdf = new jsPDF({
      orientation: PDF_CONFIG.orientation,
      unit: PDF_CONFIG.unit,
      format: PDF_CONFIG.format,
    });

    const imgProperties = pdf.getImageProperties(dataUrl);
    const pdfPageWidth = pdf.internal.pageSize.getWidth();
    const pdfPageHeight = pdf.internal.pageSize.getHeight();

    const marginHorizontal = PDF_CONFIG.margins.left + PDF_CONFIG.margins.right;
    const marginVertical = PDF_CONFIG.margins.top + PDF_CONFIG.margins.bottom;

    const contentWidth = pdfPageWidth - marginHorizontal;
    const contentHeight = pdfPageHeight - marginVertical;

    const imgOriginalWidth = imgProperties.width;
    const imgOriginalHeight = imgProperties.height;
    const imgAspectRatio = imgOriginalWidth / imgOriginalHeight;

    // Calculate image dimensions to fit contentWidth, maintaining aspect ratio
    const finalImageWidth = contentWidth;
    const finalImageHeight = finalImageWidth / imgAspectRatio;
    
    let numPages = Math.ceil(finalImageHeight / contentHeight);
    if (numPages === 0) numPages = 1; // Ensure at least one page

    for (let i = 0; i < numPages; i++) {
      if (i > 0) {
        pdf.addPage();
      }
      // yDrawPosition is the y-coordinate of the top-left corner of the *entire* image
      // relative to the current page's top-left corner (excluding margins).
      // For each new page, the image is "pulled up" by `contentHeight`.
      const yDrawPositionOnPage = PDF_CONFIG.margins.top - (i * contentHeight);
      
      pdf.addImage(
        dataUrl,
        "PNG",
        PDF_CONFIG.margins.left, // X position
        yDrawPositionOnPage,     // Y position
        finalImageWidth,         // Width of image in PDF
        finalImageHeight         // Height of image in PDF
      );
    }

    pdf.save(`${filename}.pdf`);
    return true;

  } catch (error) {
    console.error("Error generating PDF:", error);
    showErrorNotification("Failed to generate PDF. Please check the console for details.");
    return false;
  } finally {
    if (loadingIndicator && document.body.contains(loadingIndicator)) {
      document.body.removeChild(loadingIndicator);
    }
  }
};

/**
 * Validates and sanitizes the filename for PDF export.
 * @param {string} filename - The proposed filename.
 * @returns {string} - Sanitized filename.
 */
export const sanitizeFilename = (filename) => {
  let sanitized = String(filename || "") // Ensure it's a string
    .replace(/[^a-z0-9-_\s.]/gi, "") // Allow dots for potential extensions from user input
    .trim()
    .replace(/\s+/g, "-"); // Replace spaces with hyphens

  if (sanitized.startsWith(".")) { // Remove leading dots
      sanitized = sanitized.substring(1);
  }
  
  // Remove or replace multiple dots if any, keeping only the last one if it's for an extension (though we add .pdf later)
  sanitized = sanitized.replace(/\.{2,}/g, ".").replace(/\.(?=.*\.)/g, "");


  if (!sanitized || sanitized === ".pdf" || sanitized === "-") {
    sanitized = "resume";
  }
  // Remove .pdf if accidentally included, as .save() adds it
  if (sanitized.toLowerCase().endsWith(".pdf")) {
    sanitized = sanitized.substring(0, sanitized.length - 4);
  }

  return sanitized.toLowerCase();
};

/**
 * Prepares the resume element for PDF generation by applying necessary styles.
 * Note: This function creates a clone. The caller is responsible for it if not passed to generatePDF.
 * @param {HTMLElement} element - The resume element to prepare.
 * @returns {{element: HTMLElement, waitForImages: () => Promise<void[]>}} - The prepared element and a promise for image loading.
 */
export const prepareElementForPDF = (element) => {
  const clone = element.cloneNode(true); // Deep clone
  
  // It's generally better to ensure the original element is styled correctly for A4 via CSS.
  // Applying styles here can sometimes conflict or not fully replicate the visual.
  // For html-to-image, the source element's current render is what's captured.
  // If specific print styles are needed, they should ideally be in a print stylesheet.
  // However, if explicit sizing is needed for the capture:
  // clone.style.width = "210mm";
  // clone.style.minHeight = "297mm"; // Or actual content height
  // clone.style.margin = "0";
  // clone.style.padding = "0"; // Padding should be part of the content if desired in PDF

  const images = clone.getElementsByTagName("img");
  const imagePromises = Array.from(images).map(img => {
    if (img.complete && img.naturalHeight !== 0) {
      return Promise.resolve();
    }
    return new Promise((resolve) => { // Removed reject to prevent Promise.all from failing early
      img.onload = () => resolve();
      img.onerror = () => {
        console.warn("An image failed to load for PDF generation:", img.src);
        resolve(); // Resolve anyway to not block PDF generation for one failed image
      };
      // Optional: Add a timeout for image loading
      setTimeout(() => {
        if (!img.complete) {
          console.warn("Image loading timed out for PDF generation:", img.src);
          resolve(); // Resolve on timeout
        }
      }, 7000); // 7 second timeout per image
    });
  });

  return {
    element: clone,
    waitForImages: () => Promise.all(imagePromises)
  };
};

/**
 * Main function to handle resume PDF generation.
 * This is typically the function connected to a download button's onClick handler.
 * @param {HTMLElement} resumeElement - The HTML element containing the resume content.
 * @param {string} [filename="resume"] - The desired filename for the PDF (without .pdf extension).
 * @returns {Promise<boolean>} - True if PDF download was initiated successfully, false otherwise.
 */
export const downloadResumeAsPDF = async (resumeElement, filename = "resume") => {
  if (!resumeElement) {
    console.error("Resume element not provided for PDF generation.");
    showErrorNotification("Cannot generate PDF: resume content is missing.");
    return false;
  }

  try {
    const sanitizedFilename = sanitizeFilename(filename);
    
    // The preparation step is important if the live element has dynamic parts not suitable for direct capture
    // or if specific "print" styling needs to be applied to a copy.
    // For many cases, `resumeElement` itself can be passed if styled correctly.
    const { element: elementToPrint, waitForImages } = prepareElementForPDF(resumeElement);
    
    await waitForImages(); // Wait for images in the cloned/prepared element to load
    
    const success = await generatePDF(elementToPrint, sanitizedFilename);
    return success;

  } catch (error) {
    // This catch handles errors from sanitizeFilename, prepareElementForPDF, or waitForImages
    console.error("Error in PDF preparation or image loading steps:", error);
    showErrorNotification("Failed to prepare resume for PDF. Please check console.");
    return false;
  }
};