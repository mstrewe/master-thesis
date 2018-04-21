var pdfLoader = function () {
    this.documentCache = { url: {}, pdf: {}, page: 0 };
    
    var self = this;
    
    this.init = function () {
        document.getElementById('pdf_next_page').addEventListener('click', function (evt) {
            self.nextPage();
            console.log('Next page clicked: ', evt.detail.intersection.point);
        });
        document.getElementById('pdf_previus_page').addEventListener('click', function (evt) {
            self.previusPage();
            console.log('Previus page clicked: ', evt.detail.intersection.point);
        });
        document.getElementById('pdf1').addEventListener('click', function (evt) {
            self.loadUrl("resources/pdf/02_Mobile_Learning.pdf");
            console.log('pdf1 clicked: ', evt.detail.intersection.point);
        });
        document.getElementById('pdf2').addEventListener('click', function (evt) {
            self.loadUrl("resources/pdf/143-1-611-1-10-20080609.pdf");
            console.log('pdf2 clicked: ', evt.detail.intersection.point);
        });

        document.getElementById('play_button').addEventListener('click',function(evt){
            document.querySelector('a-videosphere').setAttribute('visible',"true");
            document.querySelector('#WhiteBoard').setAttribute('visible',"false");
            document.querySelector('#island').setAttribute('visible',"false");
            document.querySelector('#pdf_next_page').setAttribute('visible',"false");
            document.querySelector('#pdf_previus_page').setAttribute('visible',"false");
            document.querySelector('#sky_entity').setAttribute('visible',"false");
            document.querySelector('#video_asset').play();
        });

        document.getElementById('stop_button').addEventListener('click',function(evt){
            document.querySelector('a-videosphere').setAttribute('visible',"false");
            document.querySelector('#WhiteBoard').setAttribute('visible',"true");
            document.querySelector('#island').setAttribute('visible',"true");
            document.querySelector('#pdf_next_page').setAttribute('visible',"true");
            document.querySelector('#pdf_previus_page').setAttribute('visible',"true");
            document.querySelector('#sky_entity').setAttribute('visible',"true");
            
            document.querySelector('#video_asset').currentTime = 0;
            document.querySelector('#video_asset').stop();
        });

        document.getElementById('pause_button').addEventListener('click',function(evt){
            document.querySelector('#video_asset').pause();
        });

        $("#upload_button").click(function(e){
            // show upload hint
            document.querySelector("#uploadhint").setAttribute("position","0 0 -2");
            window.setTimeout(function(){window.location.href="/prepare_lesson.html";},4000);
         });
    };

    this.loadUrl = function (url) {

        // Asynchronous download PDF
        pdfjsLib.getDocument(url)
            .then(function (pdf) {
                self.documentCache.url = url;
                self.documentCache.pdf = pdf;
                self.documentCache.page = 1;
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
    };

    this.nextPage = function () {
        self.documentCache.pdf.getPage(self.documentCache.page + 1).then(function (page) {
            //increment page in cache
            self.documentCache.page++;

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
    };

    this.previusPage = function () {
        if (self.documentCache.page - 1 === 0)
            return;
            self.documentCache.pdf.getPage(self.documentCache.page - 1).then(function (page) {
            // decrement page in cache
            self.documentCache.page--;

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
    };

    return this;
};
