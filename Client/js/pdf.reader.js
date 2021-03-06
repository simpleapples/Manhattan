var url = "http://192.168.0.46/ppt/ppt1.pdf";
PDFJS.disableWorker = true;

var pdfDoc = null,
    pageNum = 1,
    scale = 1,
    pptCanvas = document.getElementById('pdf-reader'),
    pptCtx = pptCanvas.getContext('2d'),
    prevPage = $("a.page-prev"),
    nextPage = $("a.page-next");

prevPage.bind("click", function() {
    serverService.send("GOPV", urlMsg.uid, pageNum);
    goPrevious();
});

nextPage.bind("click", function() {
    serverService.send("GONX", urlMsg.uid, pageNum);
    goNext();
});

function renderPage(num) {
  // Using promise to fetch the page
  pdfDoc.getPage(num).then(function(page) {
    var viewport = page.getViewport(scale);
    pptCanvas.height = viewport.height;
    pptCanvas.width = viewport.width;

    // Render PDF page into pptCanvas context
    var renderContext = {
      canvasContext: pptCtx,
      viewport: viewport
    };
    page.render(renderContext);
  });

  // Update page counters
  document.getElementById('now-page').textContent = pageNum;
  document.getElementById('total-page').textContent = pdfDoc.numPages;
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
