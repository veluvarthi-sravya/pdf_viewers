const url = 'pdfs/samples.pdf';

let pdfDoc = null,
  pageNum = 1,
  pageIsRendering = false,
  pageNumIsPending = null,
  scale = 1.2,
  canvas = document.getElementById('pdf-render'),
  ctx = canvas.getContext('2d');

const renderPage = num => {
  pageIsRendering = true;

  pdfDoc.getPage(num).then(page => {
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderCtx = {
      canvasContext: ctx,
      viewport
    };

    page.render(renderCtx).promise.then(() => {
      pageIsRendering = false;
      if (pageNumIsPending !== null) {
        renderPage(pageNumIsPending);
        pageNumIsPending = null;
      }
    });

    document.getElementById('page-num').textContent = num;
  });
};

const queueRenderPage = num => {
  if (pageIsRendering) {
    pageNumIsPending = num;
  } else {
    renderPage(num);
  }
};

const showPrevPage = () => {
  if (pageNum <= 1) return;
  pageNum--;
  queueRenderPage(pageNum);
};

const showNextPage = () => {
  if (pageNum >= pdfDoc.numPages) return;
  pageNum++;
  queueRenderPage(pageNum);
};

const zoomIn = () => {
  scale += 0.2;
  queueRenderPage(pageNum);
};

const zoomOut = () => {
  if (scale <= 0.4) return;
  scale -= 0.2;
  queueRenderPage(pageNum);
};

const downloadPDF = () => {
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sample.pdf';
  a.click();
};

pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
  pdfDoc = pdfDoc_;
  document.getElementById('page-count').textContent = pdfDoc.numPages;
  renderPage(pageNum);
});

document.getElementById('prev').addEventListener('click', showPrevPage);
document.getElementById('next').addEventListener('click', showNextPage);
document.getElementById('zoom-in').addEventListener('click', zoomIn);
document.getElementById('zoom-out').addEventListener('click', zoomOut);
document.getElementById('download').addEventListener('click', downloadPDF);

// ...existing code...

// ...existing code...

document.querySelector('header').addEventListener('click', () => {
  // Go to first page and scroll to top
  pageNum = 1;
  queueRenderPage(pageNum);
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.querySelector('header').addEventListener('dblclick', () => {
  // Scroll to bottom
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
});
// ...existing code...