export async function exportResumePdf(element: HTMLElement, fileName: string): Promise<void> {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ])

  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: Math.min(window.devicePixelRatio || 2, 3),
    useCORS: true,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  })

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = 210
  const pageHeight = 297
  const pageOverflowTolerance = 2
  const imageWidth = pageWidth
  const rawImageHeight = (canvas.height * imageWidth) / canvas.width
  const imageHeight =
    Math.abs(rawImageHeight - pageHeight) <= pageOverflowTolerance ? pageHeight : rawImageHeight
  const imageData = canvas.toDataURL('image/png')

  let remainingHeight = imageHeight
  let position = 0

  pdf.addImage(imageData, 'PNG', 0, position, imageWidth, imageHeight, undefined, 'FAST')
  remainingHeight -= pageHeight

  while (remainingHeight > pageOverflowTolerance) {
    position -= pageHeight
    pdf.addPage()
    pdf.addImage(imageData, 'PNG', 0, position, imageWidth, imageHeight, undefined, 'FAST')
    remainingHeight -= pageHeight
  }

  pdf.save(fileName)
}
