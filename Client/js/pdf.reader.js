var url = "http://192.168.0.68/ppt/ppt1.pdf";
PDFJS.disableWorker = true;

var pdfDoc = null,
    pageNum = 1,
    scale = 1,
    canvas = document.getElementById('pdf-reader'),
    ctx = canvas.getContext('2d');

function renderPage(num) {
  // Using promise to fetch the page
  pdfDoc.getPage(num).then(function(page) {
    var viewport = page.getViewport(scale);
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render PDF page into canvas context
    var renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };
    page.render(renderContext);
  });

  // Update page counters
  //document.getElementById('page_num').textContent = pageNum;
  //document.getElementById('page_count').textContent = pdfDoc.numPages;
}

//
// Go to previous page
//
function goPrevious() {
  if (pageNum <= 1)
    return;
  pageNum--;
  renderPage(pageNum);
}

//
// Go to next page
//
function goNext() {
  if (pageNum >= pdfDoc.numPages)
    return;
  pageNum++;
  renderPage(pageNum);
}

//
// Asynchronously download PDF as an ArrayBuffer
//
PDFJS.getDocument(url).then(function getPdfHelloWorld(_pdfDoc) {
  pdfDoc = _pdfDoc;
  console.log(pdfDoc);
  renderPage(pageNum);
});
