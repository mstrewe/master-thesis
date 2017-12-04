var pdfLoader =
    {
        documentCache: { url: {}, pdf: {}, page: 0 },

        loadUrl: function (url) {

            // Asynchronous download PDF
            PDFJS.getDocument(url)
                .then(function (pdf) {
                    pdfLoader.documentCache.url = url;
                    pdfLoader.documentCache.pdf = pdf;
                    pdfLoader.documentCache.page = 1;
                    return pdf.getPage(1);
                })
                .then(function (page) {
                    // Set scale (zoom) level
                    var scale = 1.5;

                    // Get viewport (dimensions)
                    var viewport = page.getViewport(scale);

                    // Get canvas#the-canvas
                    var canvas = document.getElementById('the-canvas');

                    // Fetch canvas' 2d context
                    var context = canvas.getContext('2d');

                    // Set dimensions to Canvas
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    // Prepare object needed by render method
                    var renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };

                    // Render PDF page
                    page.render(renderContext);
                });
        },


        nextPage: function () {
            var page = pdfLoader.documentCache.pdf.getPage(pdfLoader.documentCache.page + 1);
            // Set scale (zoom) level
            var scale = 1.5;

            // Get viewport (dimensions)
            var viewport = page.getViewport(scale);

            // Get canvas#the-canvas
            var canvas = document.getElementById('the-canvas');

            // Fetch canvas' 2d context
            var context = canvas.getContext('2d');

            // Set dimensions to Canvas
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Prepare object needed by render method
            var renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            // Render PDF page
            page.render(renderContext);
        },

        previusPage: function () {
            if (pdfLoader.documentCache.page - 1 === 0)
                return;
            var page = documentCache.pdf.getPage(pdfLoader.documentCache.page - 1);
            // Set scale (zoom) level
            var scale = 1.5;

            // Get viewport (dimensions)
            var viewport = page.getViewport(scale);

            // Get canvas#the-canvas
            var canvas = document.getElementById('the-canvas');

            // Fetch canvas' 2d context
            var context = canvas.getContext('2d');

            // Set dimensions to Canvas
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Prepare object needed by render method
            var renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            // Render PDF page
            page.render(renderContext);
        }
    };

window.onload = function () {
    document.getElementById('pdf_next_page').addEventListener('click', function (evt) {
        pdfLoader.nextPage();
        console.log('Next page clicked: ', evt.detail.intersection.point);
    });
    document.getElementById('pdf_previus_page').addEventListener('click', function (evt) {
        pdfLoader.previusPage();
        console.log('Previus page clicked: ', evt.detail.intersection.point);
    });
    document.getElementById('pdf1').addEventListener('click', function (evt) {
        pdfLoader.loadUrl("resources/pdf/02_Mobile_Learning.pdf");
        console.log('pdf1 clicked: ', evt.detail.intersection.point);
    });
    document.getElementById('pdf2').addEventListener('click', function (evt) {
        pdfLoader.loadUrl("resources/pdf/143-1-611-1-10-20080609.pdf");
        console.log('pdf2 clicked: ', evt.detail.intersection.point);
    });
};